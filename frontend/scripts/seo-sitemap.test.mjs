import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, frontendRoot, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();

const read = (relative) => fs.readFileSync(path.join(frontendRoot, relative), "utf8");
const sitemapSource = read("app/sitemap.ts");
const robotsSource = read("app/robots.ts");
const modules = await loadToolAdapter();
const approvedNepali = modules["localized-verification"].verifiedLocalizedTools.ne ?? [];
const pdfRoutes = Object.keys(modules["nepali-pdf-routes"].nepaliPdfRoutes);
const toolRoutes = [
  ...modules["nepali-tool-routes"].nepaliLocalizedUtilitySlugs,
  ...modules["nepali-tool-routes"].nepaliLocalizedFinancialSlugs,
  ...modules["nepali-tool-routes"].nepaliLocalizedCareerSlugs,
];

assert.deepEqual(
  [...approvedNepali].sort(),
  [...pdfRoutes].sort(),
  "Every currently approved Nepali tool URL must come from the explicit PDF verification allowlist",
);

assert.match(sitemapSource, /Object\.keys\(nepaliPdfRoutes\)/, "Sitemap must derive PDF URLs from the canonical route registry");
assert.match(sitemapSource, /isLocalizedToolIndexable\("ne", slug\)/, "Localized sitemap entries must pass the same default-deny gate as metadata");
assert.match(sitemapSource, /nepaliPdfRoutes\[slug\]/, "PDF URLs must retain their established root-level paths");
assert.doesNotMatch(sitemapSource, /\.\.\.\["merge-pdf",\s*"split-pdf",\s*"compress-pdf",\s*"rotate-pdf",\s*"pdf-to-word",\s*"pdf-to-jpg"\]/, "Do not maintain a second hard-coded localized PDF allowlist");
assert.match(sitemapSource, /!isCatalogGeneratedGuide\(post\.slug\)/, "Unreviewed generated catalogue guides must stay out of the sitemap");
assert.match(robotsSource, /disallow:\s*\["\/api\/"\]/, "API endpoints should stay excluded from crawling");
assert.doesNotMatch(robotsSource, /disallow:[^\]]*noindex|disallow:[^\]]*\/ne\//, "Do not block crawlers from reading noindex directives on localized pages");

for (const slug of toolRoutes) {
  const request = modules["localized-route"].resolveLocalizedToolRequest("ne", slug);
  assert.equal(request.status, "ok", `Expected registered Nepali route: ${slug}`);
  const metadata = modules["localized-metadata"].buildLocalizedToolMetadata("ne", request.implementation.entry);
  assert.deepEqual(metadata.robots, { index: false, follow: false }, `${slug} must remain noindex until explicitly approved`);
  assert.equal(metadata.alternates?.languages, undefined, `${slug} must not advertise hreflang before indexing approval`);
}

for (const slug of approvedNepali) {
  const pathName = modules["nepali-pdf-routes"].nepaliPdfRoutes[slug] ? `/${slug}` : `/tools/${slug}`;
  const metadata = modules.metadata.buildLocaleMetadata({
    locale: "ne",
    path: pathName,
    title: `Test ${slug}`,
    description: `Reviewed localized test page for ${slug}`,
  });
  assert.deepEqual(metadata.robots, { index: true, follow: true }, `${slug} must match the explicit approval gate`);
  assert.equal(metadata.alternates?.canonical, `https://pd-fora.vercel.app/ne${pathName}`);
  assert.equal(metadata.alternates?.languages?.ne, `https://pd-fora.vercel.app/ne${pathName}`);
  assert.equal(metadata.alternates?.languages?.en, `https://pd-fora.vercel.app${pathName}`);
}

console.log(`SEO sitemap/indexing regression checks passed: ${approvedNepali.length} approved Nepali tool URLs; ${toolRoutes.length} unapproved localized catalog tools remain noindex.`);
