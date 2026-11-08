import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, frontendRoot, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();

const read = (relative) => fs.readFileSync(path.join(frontendRoot, relative), "utf8");
const sitemapSource = read("app/sitemap.ts");
const robotsSource = read("app/robots.ts");
const layoutSource = read("app/layout.tsx");
const homepageSource = read("app/page.tsx");
const blogArticleSource = read("app/blog/[slug]/page.tsx");
const englishNepalBlogSource = read("lib/nepal-blog-posts.ts");
const englishEditorialBlogSource = read("lib/blog-posts.ts");
const nepaliLocalizedBlogSource = read("lib/nepali-localized-blog-posts.ts");
const nepaliBlogArticleSource = read("app/[locale]/blog/[slug]/page.tsx");
const pdfToolJsonLdSource = read("components/PdfToolJsonLd.tsx");
const pdfToolSeoSource = read("components/ToolSEOContent.tsx");
const nepaliToolsDirectorySource = read("app/[locale]/tools/page.tsx");
const nepaliNepseSource = read("app/ne/nepse-technical-analysis/page.tsx");
const englishToolPageSource = read("app/tools/[slug]/page.tsx");
const modules = await loadToolAdapter();
const hreflangMap = modules.routing.hreflangMap;
const approvedNepali = modules["localized-verification"].verifiedLocalizedTools.ne ?? [];
const isLocalizedToolIndexable = modules["localized-verification"].isLocalizedToolIndexable;
const pdfRoutes = Object.keys(modules["nepali-pdf-routes"].nepaliPdfRoutes);
const toolRoutes = [
  ...modules["nepali-tool-routes"].nepaliLocalizedUtilitySlugs,
  ...modules["nepali-tool-routes"].nepaliLocalizedFinancialSlugs,
  ...modules["nepali-tool-routes"].nepaliLocalizedPublicInfoSlugs,
];

assert.deepEqual(
  [...approvedNepali].sort(),
  [...pdfRoutes.filter((slug) => isLocalizedToolIndexable("ne", slug))].sort(),
  "The explicit Nepali PDF allowlist must match exactly the PDF routes approved for indexing",
);

assert.match(sitemapSource, /Object\.keys\(nepaliPdfRoutes\)/, "Sitemap must derive PDF URLs from the canonical route registry");
assert.match(sitemapSource, /isLocalizedToolIndexable\("ne", slug\)/, "Localized sitemap entries must pass the same default-deny gate as metadata");
assert.match(sitemapSource, /nepaliPdfRoutes\[slug\]/, "PDF URLs must retain their established root-level paths");
assert.doesNotMatch(sitemapSource, /\.\.\.\["merge-pdf",\s*"split-pdf",\s*"compress-pdf",\s*"rotate-pdf",\s*"pdf-to-word",\s*"pdf-to-jpg"\]/, "Do not maintain a second hard-coded localized PDF allowlist");
assert.match(sitemapSource, /!isCatalogGeneratedGuide\(post\.slug\)/, "Unreviewed generated catalogue guides must stay out of the sitemap");
assert.match(robotsSource, /disallow:\s*\["\/api\/"\]/, "API endpoints should stay excluded from crawling");
assert.match(layoutSource, /inLanguage:\s*htmlLang/, "Structured data must reflect the server-rendered page language");
assert.match(layoutSource, /publisher:\s*\{\s*"@id":\s*"https:\/\/pd-fora\.vercel\.app\/#organization"\s*\}/, "WebSite structured data should reference the canonical publisher entity");
assert.doesNotMatch(layoutSource, /SoftwareApplication/, "SoftwareApplication schema must not be injected into unrelated blog, legal and utility pages");
assert.match(homepageSource, /"@type":\s*"SoftwareApplication"/, "SoftwareApplication schema should appear on the homepage that describes the application");
assert.doesNotMatch(robotsSource, /disallow:[^\]]*noindex|disallow:[^\]]*\/ne\//, "Do not block crawlers from reading noindex directives on localized pages");
assert.doesNotMatch(nepaliBlogArticleSource, /"@type":\s*"FAQPage"/, "Nepali blog pages must not emit deprecated FAQ rich-result markup");
assert.doesNotMatch(pdfToolJsonLdSource, /FAQPage/, "PDF tool JSON-LD must not emit deprecated FAQ rich-result markup");
assert.doesNotMatch(pdfToolSeoSource, /FAQPage/, "Localized PDF tool pages must retain visible FAQs without obsolete FAQ markup");
assert.doesNotMatch(blogArticleSource, /"@type":\s*"FAQPage"/, "Do not emit obsolete FAQ rich-result markup");
assert.match(blogArticleSource, /"@type":\s*"BlogPosting"/, "Blog articles must retain accurate Article structured data");
assert.match(nepaliToolsDirectorySource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/, "The partially translated Nepali directory must stay noindex");
assert.match(nepaliNepseSource, /redirect\("\/market"\)/, "The legacy Nepali NEPSE route must redirect to the canonical market page rather than publish a duplicate page");
assert.match(sitemapSource, /nepaliLocalizedPublicInfoSlugs/, "Localized public-info routes must be included in the candidate list and then pass through the explicit default-deny indexability gate");

const reciprocalEnglishPages = [
  ["app/about/page.tsx", "/about"],
  ["app/privacy/page.tsx", "/privacy"],
  ["app/terms/page.tsx", "/terms"],
  ["app/contact/page.tsx", "/contact"],
  ["app/blog/page.tsx", "/blog"],
  ["app/market/page.tsx", "/market"],
  ["app/resume-builder/page.tsx", "/resume-builder"],
];
for (const [relativePath, localeFreePath] of reciprocalEnglishPages) {
  const source = read(relativePath);
  assert.match(source, /hreflangMap\(/, `${relativePath} must publish alternates for its reviewed Nepali equivalent`);
  assert.match(source, /languages:\s*localizedAlternates/, `${relativePath} must emit the shared hreflang map`);
  const alternates = hreflangMap(localeFreePath);
  assert.equal(alternates?.en, `https://pd-fora.vercel.app${localeFreePath}`);
  assert.equal(alternates?.ne, `https://pd-fora.vercel.app/ne${localeFreePath}`);
  assert.equal(alternates?.["x-default"], `https://pd-fora.vercel.app${localeFreePath}`);
}

const englishBlogSlugs = new Set([...englishNepalBlogSource.matchAll(/slug:\s*"([^"]+)"/g), ...englishEditorialBlogSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]));
const nepaliBlogSlugs = [...nepaliLocalizedBlogSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
for (const slug of nepaliBlogSlugs) {
  assert.ok(englishBlogSlugs.has(slug), `Nepali blog ${slug} must have a real English equivalent before publishing hreflang`);
  const alternates = hreflangMap(`/blog/${slug}`);
  assert.equal(alternates?.en, `https://pd-fora.vercel.app/blog/${slug}`);
  assert.equal(alternates?.ne, `https://pd-fora.vercel.app/ne/blog/${slug}`);
}

assert.match(englishToolPageSource, /isLocalizedToolIndexable\("ne", slug\)/, "English tool pages must gate Nepali hreflang on explicit indexing approval");
assert.match(englishToolPageSource, /languages\s*\?\s*\{\s*languages\s*\}/, "Approved English PDF pages must emit the reciprocal hreflang map");
for (const slug of approvedNepali) {
  const localeFreePath = `/${slug}`;
  const alternates = hreflangMap(localeFreePath);
  assert.equal(alternates?.en, `https://pd-fora.vercel.app${localeFreePath}`);
  assert.equal(alternates?.ne, `https://pd-fora.vercel.app/ne${localeFreePath}`);
  assert.equal(alternates?.["x-default"], `https://pd-fora.vercel.app${localeFreePath}`);
}
for (const slug of toolRoutes) {
  assert.equal(modules["localized-verification"].isLocalizedToolIndexable("ne", slug), false, `${slug} must not enter English hreflang before explicit approval`);
}


for (const slug of toolRoutes) {
  const request = modules["localized-route"].resolveLocalizedToolRequest("ne", slug);
  assert.equal(request.status, "ok", `Expected registered Nepali route: ${slug}`);
  const metadata = modules["localized-metadata"].buildLocalizedToolMetadata("ne", request.implementation.entry);
  assert.deepEqual(metadata.robots, { index: false, follow: true }, `${slug} must remain noindex while preserving link discovery until approved`);
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
