import fs from "node:fs";
import path from "node:path";
const frontendRoot = path.resolve(new URL("..", import.meta.url).pathname);
const namesSource = fs.readFileSync(path.join(frontendRoot, "lib/i18n/pdf-tool-names-hi.ts"), "utf8");
const slugs = [...namesSource.matchAll(/^\s*"([^"]+)":/gm)].map((match) => match[1]);
const baseUrl = process.env.HINDI_ROUTE_BASE_URL || "http://127.0.0.1:3000";
const failures = [];
if (slugs.length !== 49 || new Set(slugs).size !== 49) throw new Error(`Expected 49 unique Hindi PDF routes; found ${slugs.length}`);
for (const slug of slugs) {
  const response = await fetch(`${baseUrl}/hi/${slug}`);
  const html = await response.text();
  const checks = {
    status: response.status === 200,
    htmlLanguage: /<html[^>]*lang="hi"/i.test(html),
    heading: /<h1\b/i.test(html),
    hindiScript: /[\u0900-\u097f]/.test(html),
    noindex: /name="robots" content="noindex/i.test(html),
    hasCanonical: /rel="canonical"/i.test(html),
  };
  const failed = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  if (failed.length) failures.push({ slug, status: response.status, failed });
}
const report = { generatedAt: new Date().toISOString(), baseUrl, expected: 49, passed: 49 - failures.length, failed: failures.length, checks: ["HTTP 200", "lang=hi", "H1 present", "Devanagari content", "noindex", "canonical"], failures };
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;

