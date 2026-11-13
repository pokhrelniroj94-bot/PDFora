import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, frontendRoot, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();

const read = (relative) => fs.readFileSync(path.join(frontendRoot, relative), "utf8");
const sitemapSource = read("app/sitemap.ts");
const legacyToolSlugsSource = read("lib/legacy-tool-slugs.ts");
const nextConfigSource = read("next.config.ts");
const nepaliPdfPageSource = read("app/[locale]/[slug]/page.tsx");
const catalogToolSeoSource = read("components/CatalogToolSEOContent.tsx");
const toolGuidesSource = read("lib/tool-guides.ts");
const pdfToExcelLayoutSource = read("app/pdf-to-excel/layout.tsx");
const pdfToExcelPageSource = read("app/pdf-to-excel/page.tsx");
const niroj77ToolSource = read("components/Niroj77Tool.tsx");
const nepseLabPageSource = read("app/nepse-lab/page.tsx");
const ocrPageSource = read("app/ocr-pdf/page.tsx");
const generatedBlogPageSource = read("app/blog/[slug]/page.tsx");
const blogPostsSource = read("lib/blog-posts.ts");
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
const pdfToolSeoCoreSource = read("lib/i18n/pdf-tool-seo-core.ts");
const nepaliToolsDirectorySource = read("app/[locale]/tools/page.tsx");
const nepaliNepseSource = read("app/ne/nepse-technical-analysis/page.tsx");
const englishToolPageSource = read("app/tools/[slug]/page.tsx");
assert.ok(englishToolPageSource.includes('title: "SEO Title Checker – Meta Title & Google Preview | PDFora"'), "The meta-title utility must lead with the observed SEO Title Checker query");
assert.ok(homepageSource.includes('title: "Free Online PDF, Finance & Text Tools | PDFora"'), "Homepage metadata must describe PDFora as a multi-category tools platform");
assert.ok(homepageSource.includes("Explore free online PDF, finance, math, text, developer, image, SEO and Nepal tools."), "Homepage description must identify the wider tool categories");
assert.ok(englishToolPageSource.includes('description: "Check a meta description character count and preview its Google snippet.'), "The meta-description utility snippet must explicitly match its primary query");
assert.ok(englishToolPageSource.includes('title: "Tip Calculator Online Free – 15%, 18%, 20% & Split Bill"'), "The tip calculator snippet must lead with the first-page query and clarify free use");
assert.ok(pdfToolSeoCoreSource.includes('"rotate-pdf": { title: "Rotate PDF Online Free – Turn Pages 90°, 180° or 270°"'), "The Rotate PDF snippet must match its page operation and free-online intent");
assert.ok(pdfToolSeoCoreSource.includes('"pdf-to-excel": { title: "PDF to Excel Converter Online Free – Extract Tables"'), "The PDF to Excel snippet must match its conversion intent");
assert.ok(read("app/rotate-pdf/page.tsx").includes("Rotate PDF Online Free</h1>"), "The Rotate PDF page heading must match the primary tool intent");
assert.ok(pdfToExcelPageSource.includes("PDF to Excel Converter Online"), "The PDF to Excel page heading must match the primary conversion intent");
const nepaliBlogPageSource = read("app/[locale]/blog/[slug]/page.tsx");
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

const reportedNepaliLongTitleSlugs = [
  "nepali-date-converter-bs-to-ad-guide", "neb-gpa-calculator-nepal-guide", "nepal-vat-calculator-13-percent-guide",
  "ropani-aana-paisa-daam-land-measurement-guide", "tola-to-gram-gold-weight-conversion-nepal",
  "nepali-number-to-words-lakh-crore-guide", "nepal-mobile-number-format-checker-guide",
  "nepal-public-holidays-2083-calendar-guide", "nepal-rastra-bank-daily-exchange-rates-guide",
  "nepal-salary-income-tax-calculator-2083-84-guide", "nepse-cash-dividend-and-bonus-share-calculator-guide",
  "nepse-market-news-and-ipo-updates", "nepse-share-buy-sell-profit-calculator-guide",
  "preeti-to-unicode-nepali-font-converter-guide", "nepali-calendar-bs-month-guide",
  "compress-pdf-to-under-1mb-online", "convert-jpg-images-to-one-pdf-on-phone",
  "convert-pdf-pages-to-jpg-images", "convert-pdf-table-to-excel-spreadsheet",
  "convert-pdf-to-editable-word-document", "merge-multiple-pdf-files-into-one-document",
  "split-pdf-and-extract-selected-pages", "english-to-nepali-digits-converter-guide",
  "loksewa-online-form-photo-resizer-guide", "nea-electricity-bill-calculator-nepal-guide",
];
for (const slug of reportedNepaliLongTitleSlugs) {
  assert.match(nepaliBlogPageSource, new RegExp('"' + slug + '"\\s*:'), "Search Console title recovery missing for " + slug);
}
assert.match(nepaliBlogPageSource, /title: searchTitle/, "Nepali blog metadata must use concise search titles without changing visible article headlines");
for (const [slug, title] of [["percentage-change-calculator-guide", "Percentage Change: प्रतिशत कसरी निकाल्ने?"], ["tip-calculator-guide", "Tip Calculator: टिप र बिल कसरी बाँड्ने?"]]) {
  assert.ok(title.length <= 60, `${slug} search title must stay within 60 characters`);
  assert.ok(nepaliBlogPageSource.includes(`"${slug}": "${title}"`), `${slug} must retain its reviewed concise search title`);
}

const generatedArticleSlugs = toolGuidesSource.match(/const existingBlogSlugs = new Set\(\[([\s\S]*?)\]\);/)?.[1] ?? "";
for (const slug of ["repair-pdf-guide-online", "pdf-to-text-guide-online"]) {
  assert.ok(generatedArticleSlugs.includes(slug), `${slug} must use its individually reviewed editorial guide instead of the generic template`);
  assert.ok(englishEditorialBlogSource.includes(`slug: "${slug}"`), `${slug} must have a bespoke editorial article`);
}
assert.ok(englishEditorialBlogSource.includes("How to Repair a Damaged PDF Online: What to Check"));
assert.ok(englishEditorialBlogSource.includes("How to Extract Text from a PDF Online and Save a TXT File"));


assert.match(sitemapSource, /Object\.keys\(nepaliPdfRoutes\)/, "Sitemap must derive PDF URLs from the canonical route registry");
assert.match(sitemapSource, /isLocalizedToolIndexable\("ne", slug\)/, "Localized sitemap entries must pass the same default-deny gate as metadata");
assert.match(sitemapSource, /\$\{baseUrl\}\/nepse-lab/, "The canonical NEPSE Strategy Lab page must be discoverable in the sitemap");
assert.match(sitemapSource, /\$\{baseUrl\}\/resume-builder/, "The canonical Resume Builder page must be discoverable in the sitemap");
for (const slug of ["case-converter", "prime-number-checker", "json-to-yaml", "date-difference-calculator", "json-formatter-validator", "base64-encoder-decoder"]) {
  assert.match(catalogToolSeoSource, new RegExp('"' + slug + '"'), `${slug} must have page-specific Search Console recovery guidance`);
}
assert.match(catalogToolSeoSource, /toolSpecificSteps\[tool\.slug\]/, "Reviewed tools must render their own instructions instead of repeated generic steps");
assert.doesNotMatch(pdfToExcelLayoutSource, /<ToolSEOContent/, "PDF to Excel layout must not append a duplicate generic guide");
assert.match(pdfToExcelPageSource, /showSeoContent=\{false\}/, "PDF to Excel must disable the nested generic guide because its page contains a bespoke XLSX guide");
assert.match(niroj77ToolSource, /showSeoContent\?: boolean/, "Niroj77Tool must allow bespoke pages to suppress its generic SEO block");
assert.match(niroj77ToolSource, /showSeoContent && <ToolSEOContent/, "Niroj77Tool must render generic SEO content only when explicitly enabled");
for (const section of ["SMA 20/50 crossover", "RSI 14 recovery", "20-day breakout", "Maximum drawdown", "Important limitations before using results"]) {
  assert.ok(nepseLabPageSource.includes(section), `NEPSE Lab must explain ${section} for users and search crawlers`);
}

assert.match(sitemapSource, /nepaliPdfRoutes\[slug\]/, "PDF URLs must retain their established root-level paths");
assert.doesNotMatch(sitemapSource, /\.\.\.\["merge-pdf",\s*"split-pdf",\s*"compress-pdf",\s*"rotate-pdf",\s*"pdf-to-word",\s*"pdf-to-jpg"\]/, "Do not maintain a second hard-coded localized PDF allowlist");
assert.match(sitemapSource, /!isCatalogGeneratedGuide\(post\.slug\)/, "Unreviewed generated catalogue guides must stay out of the sitemap");
assert.ok(!["opengraph-image", "favicon.ico", "_next/", "/api/"].some((value) => sitemapSource.includes(value)), "Sitemap must contain canonical content pages only, never OG images, static assets or API endpoints");
assert.ok(!["/hi", "/id", "/pt", "/es", "/fr", "/de", "/bn", "/ur", "/ar", "/zh", "/ja"].some((value) => sitemapSource.includes(value)), "Unpublished locale routes must not be included in the sitemap");
assert.ok(nextConfigSource.includes("Object.keys(nepaliPdfRoutes).map"), "Legacy /ne/tools/<pdf-slug> paths must redirect using the canonical Nepali PDF route registry");
assert.ok(nextConfigSource.includes("source: " + String.fromCharCode(96) + "/ne/tools/${slug}" + String.fromCharCode(96)), "Legacy localized PDF route redirect must match /ne/tools/<slug>");
assert.ok(nextConfigSource.includes("destination: " + String.fromCharCode(96) + "/ne/${slug}" + String.fromCharCode(96)), "Legacy localized PDF route redirect must point to /ne/<slug>");
assert.ok(!read("app/[locale]/tools/page.tsx").includes("nepali-janma-kundali") && !read("app/[locale]/tools/page.tsx").includes("nepali-guna-milan"), "Do not internally link to unpublished astrology routes that return 404");

assert.match(robotsSource, /disallow:\s*\["\/api\/"\]/, "API endpoints should stay excluded from crawling");
assert.match(layoutSource, /inLanguage:\s*htmlLang/, "Structured data must reflect the server-rendered page language");
assert.match(layoutSource, /title:\s*\{\s*default:[^,]+,\s*template:\s*"%s"\s*\}/, "Page titles must not append a second PDFora brand suffix");
assert.ok((read("app/tools/page.tsx").match(/description:\s*"([^"]+)"/)?.[1]?.length ?? 999) <= 160, "Tool directory meta description must stay within 160 characters");
assert.match(layoutSource, /publisher:\s*\{\s*"@id":\s*"https:\/\/pd-fora\.vercel\.app\/#organization"\s*\}/, "WebSite structured data should reference the canonical publisher entity");
assert.doesNotMatch(layoutSource, /SoftwareApplication/, "SoftwareApplication schema must not be injected into unrelated blog, legal and utility pages");
assert.match(homepageSource, /"@type":\s*"SoftwareApplication"/, "SoftwareApplication schema should appear on the homepage that describes the application");
assert.doesNotMatch(robotsSource, /disallow:[^\]]*noindex|disallow:[^\]]*\/ne\//, "Do not block crawlers from reading noindex directives on localized pages");
assert.match(robotsSource, /disallow:\s*\[\s*"\/api\/"\s*\]/, "Only non-page API endpoints should be blocked in robots.txt");
assert.doesNotMatch(sitemapSource, /\/api\//, "API endpoints must never be submitted in the XML sitemap");
assert.match(sitemapSource, /tool\.slug !== "ocr-pdf"/, "Unavailable OCR must be explicitly filtered out of the sitemap");
assert.match(ocrPageSource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/, "Unavailable OCR page must remain intentionally noindex");
assert.match(generatedBlogPageSource, /isCatalogGeneratedGuide\(post\.slug\)\s*\?\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/, "Unreviewed generated guide pages must remain noindex until editorial review");
const priorityEditorialGuides = ["savings-goal-calculator-guide", "reading-time-calculator-guide", "tip-calculator-guide", "percentage-change-calculator-guide", "meta-title-checker-guide"];
for (const slug of priorityEditorialGuides) {
  assert.ok(blogPostsSource.includes(`slug: "${slug}"`), `${slug} must have individually reviewed editorial content`);
  assert.ok(nepaliLocalizedBlogSource.includes(`slug: "${slug}"`), `${slug} must have a reviewed Nepali translation before hreflang is published`);
}
assert.match(blogPostsSource, /return !existingArticleSlugs\.has\(slug\) && toolCatalog\.some\(/, "Reviewed editorial guides must be indexable while unreviewed generated guides remain noindex");
assert.doesNotMatch(nepaliBlogArticleSource, /"@type":\s*"FAQPage"/, "Nepali blog pages must not emit deprecated FAQ rich-result markup");
assert.doesNotMatch(pdfToolJsonLdSource, /FAQPage/, "PDF tool JSON-LD must not emit deprecated FAQ rich-result markup");
assert.doesNotMatch(pdfToolSeoSource, /FAQPage/, "Localized PDF tool pages must retain visible FAQs without obsolete FAQ markup");
assert.doesNotMatch(blogArticleSource, /"@type":\s*"FAQPage"/, "Do not emit obsolete FAQ rich-result markup");
assert.match(blogArticleSource, /"@type":\s*"BlogPosting"/, "Blog articles must retain accurate Article structured data");
assert.match(nepaliToolsDirectorySource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/, "The partially translated Nepali directory must stay noindex");
assert.ok(nepaliToolsDirectorySource.includes("nepaliPdfRoutes[slug] ? " + String.fromCharCode(96) + "/ne/${slug}" + String.fromCharCode(96)), "Nepali PDF directory links must point directly to their canonical /ne/<slug> URLs");
assert.match(nepaliNepseSource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/, "The not-yet-reviewed Nepali NEPSE page must stay noindex");
assert.doesNotMatch(sitemapSource, /nepaliLocalizedPublicInfoSlugs/, "Unreviewed public-info translations must not be added to the indexable sitemap automatically");

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

// Search Console's November 10 export contained these legacy localized URLs.
// They are real routes, but only the six explicitly reviewed Nepali PDF pages may be indexed.
for (const slug of ["pdf-information", "pdf-to-png", "pdf-to-html", "pdf-to-excel", "add-blank-pages"]) {
  assert.ok(pdfRoutes.includes(slug), `Historical localized URL /ne/${slug} must resolve to its registered page, not a 404`);
  assert.equal(isLocalizedToolIndexable("ne", slug), false, `/ne/${slug} must remain noindex until its Nepali implementation is reviewed`);
}
assert.match(nepaliPdfPageSource, /Object\.keys\(nepaliPdfRoutes\)/, "All registered Nepali PDF routes must be generated so legacy URLs resolve");
assert.ok(nextConfigSource.includes('{ source: "/nepali-date-converter", destination: "/tools/nepali-date-converter", permanent: true }'), "Legacy /nepali-date-converter must permanently redirect to the catalog canonical URL");
assert.doesNotMatch(legacyToolSlugsSource, /"nepali-date-converter"/, "Redirect-only Nepali date URL must not enter the canonical legacy PDF route registry");
assert.match(sitemapSource, /\$\{baseUrl\}\/tools\/\$\{tool\.slug\}/, "The canonical catalog URL must remain in the sitemap");
assert.ok(robotsSource.includes('disallow: ["/api/"]'), "The 27 API endpoints in the Search Console robots export must remain intentionally blocked");

console.log(`SEO sitemap/indexing regression checks passed: ${approvedNepali.length} approved Nepali tool URLs; ${toolRoutes.length} unapproved localized catalog tools remain noindex.`);
