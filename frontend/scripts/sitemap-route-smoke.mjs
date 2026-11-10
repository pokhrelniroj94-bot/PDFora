const baseUrl = process.env.E2E_BASE_URL || "http://127.0.0.1:3000";
const origin = new URL(baseUrl).origin;
const canonicalOrigin = process.env.PDFORA_EXPECT_CANONICAL_ORIGIN || "https://pd-fora.vercel.app";
const sitemapUrl = new URL("/sitemap.xml", origin);
const robotsUrl = new URL("/robots.txt", origin);
const concurrency = 8;
const timeoutMs = 20000;

async function get(url) {
  return fetch(url, { redirect: "manual", signal: AbortSignal.timeout(timeoutMs) });
}

const robotsResponse = await get(robotsUrl);
if (robotsResponse.status !== 200) {
  throw new Error("robots.txt returned HTTP " + robotsResponse.status);
}
const robotsText = await robotsResponse.text();
if (!/Disallow:\s*\/api\//i.test(robotsText)) {
  throw new Error("robots.txt must keep non-page API endpoints disallowed");
}
if (/Disallow:\s*\/(?!api\/)/i.test(robotsText)) {
  throw new Error("robots.txt contains a broad page-level disallow rule; review before deployment");
}

const sitemapResponse = await get(sitemapUrl);
if (sitemapResponse.status !== 200) {
  throw new Error("sitemap.xml returned HTTP " + sitemapResponse.status);
}
const xml = await sitemapResponse.text();
const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1].trim());
if (locs.length === 0) throw new Error("sitemap.xml contains no <loc> URLs");

const seen = new Set();
const duplicates = [];
const urls = [];
for (const loc of locs) {
  const parsed = new URL(loc);
  if (parsed.origin !== canonicalOrigin) throw new Error("Unexpected sitemap canonical origin: " + loc);
  if (parsed.pathname.startsWith("/api/") || parsed.pathname === "/ocr-pdf") {
    throw new Error("Non-indexable endpoint included in sitemap: " + loc);
  }
  if (seen.has(parsed.href)) duplicates.push(parsed.href);
  else { seen.add(parsed.href); urls.push(parsed); }
}
if (duplicates.length) throw new Error("Duplicate sitemap URLs: " + duplicates.join(", "));

const failures = [];
let cursor = 0;
async function worker() {
  while (cursor < urls.length) {
    const current = urls[cursor++];
    const target = new URL(current.pathname + current.search, origin);
    let status = 0;
    let error = "";
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await get(target);
        status = response.status;
        await response.body?.cancel();
        if (status === 200) break;
        if (status < 500 && status !== 429) break;
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (caught) {
        error = caught instanceof Error ? caught.message : String(caught);
        if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    if (status !== 200) failures.push({ url: current.href, status, error });
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, () => worker()));

console.log("Sitemap route smoke check: " + urls.length + " unique canonical URLs checked.");
console.log("robots.txt: only /api/ is disallowed; public pages remain crawlable.");
if (failures.length) {
  console.error("Sitemap URLs not returning HTTP 200 (" + failures.length + "):");
  for (const item of failures) console.error(JSON.stringify(item));
  process.exitCode = 1;
} else {
  console.log("PASS: every sitemap URL returns HTTP 200 with no redirects.");
}
