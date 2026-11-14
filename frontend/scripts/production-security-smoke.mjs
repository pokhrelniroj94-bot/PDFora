const base = process.env.PDFORA_PRODUCTION_URL || "https://pd-fora.vercel.app";
const failures = [];
const checks = [];
async function get(path) {
  const response = await fetch(new URL(path, base), {
    redirect: "follow",
    headers: { "User-Agent": "PDFora-ReadOnly-Production-Smoke/1.0" },
    signal: AbortSignal.timeout(15000),
  });
  return response;
}
function check(name, condition, detail = "") {
  checks.push({ name, status: condition ? "PASS" : "FAIL", detail });
  if (!condition) failures.push(name + (detail ? ": " + detail : ""));
}
const [home, robots, sitemap, privacy] = await Promise.all([
  get("/"),
  get("/robots.txt"),
  get("/sitemap.xml"),
  get("/privacy"),
]);
check("homepage HTTP 200", home.status === 200, String(home.status));
check("robots.txt HTTP 200", robots.status === 200, String(robots.status));
check("sitemap.xml HTTP 200", sitemap.status === 200, String(sitemap.status));
check("privacy policy HTTP 200", privacy.status === 200, String(privacy.status));

const headers = home.headers;
const hsts = headers.get("strict-transport-security") || "";
const csp = headers.get("content-security-policy") || "";
check("HSTS one-year max-age", /max-age=(?:31536000|[3-9]\d{7,})/.test(hsts), hsts || "missing");
check("X-Content-Type-Options nosniff", headers.get("x-content-type-options") === "nosniff", headers.get("x-content-type-options") || "missing");
check("Referrer-Policy strict-origin-when-cross-origin", headers.get("referrer-policy") === "strict-origin-when-cross-origin", headers.get("referrer-policy") || "missing");
check("X-Frame-Options DENY", headers.get("x-frame-options") === "DENY", headers.get("x-frame-options") || "missing");
check("CSP blocks framing", /frame-ancestors\s+'none'/.test(csp), csp || "missing");
if (process.env.PDFORA_EXPECT_HARDENED_CSP === "true") {
  check("CSP blocks object embeds", /object-src\s+'none'/.test(csp), csp || "missing");
  check("CSP restricts base URI", /base-uri\s+'self'/.test(csp), csp || "missing");
}
const permissions = headers.get("permissions-policy") || "";
check("Permissions-Policy disables unused sensitive APIs", /camera=\(\)/.test(permissions) && /microphone=\(\)/.test(permissions) && /geolocation=\(\)/.test(permissions), permissions || "missing");
check("HTML does not grant credentialed wildcard CORS",
  !(headers.get("access-control-allow-origin") === "*" && headers.get("access-control-allow-credentials") === "true"),
  JSON.stringify({ allowOrigin: headers.get("access-control-allow-origin"), allowCredentials: headers.get("access-control-allow-credentials") }));

const robotsText = await robots.text();
check("robots disallows API crawling", /Disallow:\s*\/api\//i.test(robotsText), robotsText.slice(0, 300));
check("robots declares sitemap", /Sitemap:\s*https:\/\/pd-fora\.vercel\.app\/sitemap\.xml/i.test(robotsText), robotsText.slice(0, 500));
const sitemapText = await sitemap.text();
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
check("sitemap is valid non-empty XML", sitemapText.includes("<urlset") && sitemapUrls.length > 0, "URLs=" + sitemapUrls.length);
check("sitemap has no duplicate URLs", new Set(sitemapUrls).size === sitemapUrls.length, "URLs=" + sitemapUrls.length);
check("sitemap excludes unpublished language routes", !sitemapUrls.some((url) => /\/(hi|bn|ur|ar|es|fr|de|pt|zh|ja)(\/|$)/.test(new URL(url).pathname)), "unpublished locales must not be indexed");

const privacyText = (await privacy.text()).toLowerCase();
check("privacy policy discloses advertising provider", privacyText.includes("adsterra") && privacyText.includes("advertising"));
// Accept both the currently deployed wording ("temporarily ... after processing")
// and the more explicit wording in the updated policy ("temporary ... after the
// processing response has been sent"). This check is run against both production
// and the pull-request build, so it must validate the policy intent, not one exact phrase.
const describesTemporaryHandling =
  privacyText.includes("temporar") &&
  (privacyText.includes("after processing") ||
    privacyText.includes("after the processing response") ||
    privacyText.includes("after the result has been sent"));
check("privacy policy describes temporary upload processing", describesTemporaryHandling);

const html = await home.text();
const canonicalTag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0] || "";
const canonicalHref = canonicalTag.match(/\bhref=["']([^"']+)["']/i)?.[1] || "";
let canonicalUrl = null;
const expectedCanonicalOrigin = process.env.PDFORA_EXPECT_CANONICAL_ORIGIN || new URL(base).origin;
try { canonicalUrl = canonicalHref ? new URL(canonicalHref, base) : null; } catch { canonicalUrl = null; }
check("homepage has a self-referencing canonical URL",
  Boolean(canonicalUrl && canonicalUrl.origin === expectedCanonicalOrigin && canonicalUrl.pathname === "/"),
  JSON.stringify({ base, expectedCanonicalOrigin, canonicalHref, canonicalOrigin: canonicalUrl?.origin, canonicalPath: canonicalUrl?.pathname }));
check("homepage has document language", /<html[^>]+lang=["'](?:en|ne)["']/i.test(html));
const report = { generatedAt: new Date().toISOString(), base, checks, counts: { pass: checks.filter((x) => x.status === "PASS").length, fail: failures.length } };
console.log(JSON.stringify(report, null, 2));
if (failures.length) {
  console.error("Production read-only smoke checks failed:", failures.join("; "));
  process.exitCode = 1;
}
