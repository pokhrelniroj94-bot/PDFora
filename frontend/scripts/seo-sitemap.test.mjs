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
const blogToolCtaSource = read("components/BlogToolCTA.tsx");
const analyticsClientSource = read("lib/analytics-client.ts");
const toolViewAnalyticsSource = read("components/ToolViewAnalytics.tsx");
const blogPostsSource = read("lib/blog-posts.ts");
const robotsSource = read("app/robots.ts");
const layoutSource = read("app/layout.tsx");
const homepageSource = read("app/page.tsx") + "\n" + read("components/HomePageClient.tsx");
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
assert.equal(homepageSource.split("Free Online PDF, Finance & Text Tools | PDFora").length - 1, 3, "Homepage, Open Graph and Twitter titles must share the multi-category positioning");
assert.ok(!homepageSource.includes("Free Online PDF Tools – Merge, Split & Compress | PDFora"), "Legacy PDF-only social titles must be removed");
assert.ok(homepageSource.includes("Explore free online PDF, finance, math, text, developer, image, SEO and Nepal tools."), "Homepage description must identify the wider tool categories");
assert.ok(englishToolPageSource.includes('description: "Check a meta description character count and preview its Google snippet.'), "The meta-description utility snippet must explicitly match its primary query");
assert.ok(englishToolPageSource.includes('title: "Free Tip Calculator – 15%, 18%, 20% & Bill Split | PDFora"'), "The tip calculator snippet must lead with the first-page query and clarify free use");
assert.ok(englishEditorialBlogSource.includes('title: "How to Calculate a Tip: 15%, 18%, 20% + Quick Math"'), "The tip guide title must match the 1,021-impression Search Console query");
assert.ok(englishEditorialBlogSource.includes('description: "Use the tip formula, quick mental-math shortcuts and 15%, 18% or 20% examples.'), "The tip guide description must lead with the actual calculator benefit");
assert.ok(englishEditorialBlogSource.includes('heading: "How to calculate tip: formula and worked examples"'), "The tip guide must answer the primary query in its first instructional section");
assert.ok(catalogToolSeoSource.includes("SEO Title Checker: Review Your Page Title Before Publishing"), "The SEO title checker content must state its primary search intent");
assert.ok(catalogToolSeoSource.includes("Use this SEO title checker with the exact HTML title"), "The SEO title checker intro must match its primary query");
assert.ok(catalogToolSeoSource.includes("Meta Description Checker: Preview Your Search Snippet"), "The meta description checker content must state its primary search intent");
assert.ok(catalogToolSeoSource.includes("Use this meta description checker with the exact description"), "The meta description checker intro must match its primary query");
assert.ok(englishToolPageSource.includes('title: "Free Reading Time Calculator – Estimate Minutes & WPM"'), "Reading Time metadata must target the calculator intent");
assert.ok(englishToolPageSource.includes('title: "Savings Goal Calculator – Monthly & Weekly Savings"'), "Savings Goal metadata must target deposit-planning intent");
assert.ok(englishToolPageSource.includes('title: "Percentage Change Calculator – Increase or Decrease"'), "Percentage Change metadata must target calculation intent with a concise search title");
assert.ok("Percentage Change Calculator – Increase or Decrease".length <= 60, "Percentage Change title must remain concise for search snippets");
assert.ok(englishToolPageSource.includes('title: "Prime Number Checker – Test Prime or Composite"'), "Prime Number Checker metadata must target the 114-impression GSC query");
assert.ok(englishEditorialBlogSource.includes('title: "Reading Time Calculator: WPM Formula & Examples"'), "Reading Time guide must target the calculator query while retaining its formula guide intent");
assert.ok(englishEditorialBlogSource.includes('title: "Savings Goal Calculator: Monthly & Weekly Savings Plan"'), "Savings guide must target the calculator query while retaining its planning intent");
assert.ok(englishEditorialBlogSource.includes('title: "Percentage Change Calculator: Formula & Examples"'), "Percentage Change guide must target the calculator query while retaining formula intent");
assert.ok(englishToolPageSource.includes("It estimates periodic interest when you enter an annual rate."), "Savings Goal FAQ must match the interest calculation");
assert.ok(catalogToolSeoSource.includes("compounds monthly or weekly"), "Savings Goal guidance must disclose periodic compounding");
assert.ok(nepaliLocalizedBlogSource.includes("मासिक वा साप्ताहिक अवधिअनुसार चक्रवृद्धि"), "Nepali savings guide must disclose periodic compounding");
const nepaliPostMatches = [...nepaliLocalizedBlogSource.matchAll(/slug: "([^"]+)"/g)];
assert.equal(nepaliPostMatches.length, 35, "Reviewed Nepali blog inventory must remain complete");
for (let index = 0; index < nepaliPostMatches.length; index += 1) {
  const start = nepaliPostMatches[index].index;
  const end = nepaliPostMatches[index + 1]?.index ?? nepaliLocalizedBlogSource.length;
  const entry = nepaliLocalizedBlogSource.slice(start, end);
  assert.ok(entry.includes("readTime:"), nepaliPostMatches[index][1] + " Nepali guide must retain reading-time metadata");
}
for (const href of ["/pdf-to-excel", "/rotate-pdf"]) {
  assert.ok(homepageSource.includes(`"${href}"`), `Homepage priority links must include the unindexed PDF page: ${href}`);
}
assert.ok(pdfToolSeoCoreSource.includes('"rotate-pdf": { title: "Rotate PDF Online Free – Turn Pages 90°, 180° or 270°"'), "The Rotate PDF snippet must match its page operation and free-online intent");
assert.ok(pdfToolSeoCoreSource.includes('"pdf-to-excel": { title: "PDF to Excel Converter Online Free – Extract Tables"'), "The PDF to Excel snippet must match its conversion intent");
assert.ok(pdfToolSeoCoreSource.includes('"delete-pages": { title: "Delete PDF Pages Online Free – Remove Selected Pages"'), "Delete Pages metadata must match the actual Search Console query order");
assert.ok(pdfToolSeoCoreSource.includes('"extract-pages": { title: "Extract PDF Pages Online Free – Save Selected"'), "Extract Pages metadata must match the actual Search Console query order");
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

const approvedPdfSlugs = pdfRoutes;
assert.deepEqual(
  [...approvedNepali].sort(),
  [...toolRoutes, ...approvedPdfSlugs].sort(),
  "All localized Nepali catalog and PDF tools may be indexable",
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
assert.match(nepaliBlogPageSource, /post\.toolLinks\.length > 0\s*&&\s*\(/, "Every Nepali editorial guide with a primary tool must show an above-the-fold CTA");
assert.match(nepaliBlogPageSource, /<BlogToolCTA/, "Nepali blog CTAs must use the shared consent-aware analytics component");
assert.ok(nepaliBlogPageSource.includes('locale="ne"'), "Nepali blog CTAs must render localized copy and analytics language");
assert.ok(nepaliBlogPageSource.includes("function toNepaliToolHref"), "Nepali blog links must normalize both catalog and legacy PDF routes");
assert.ok(nepaliBlogPageSource.includes("href={toNepaliToolHref(tool.href)}"), "Related-tool links must use localized route normalization");
assert.ok(blogToolCtaSource.includes('locale === "ne"'), "Shared blog CTA must support Nepali copy");
for (const [slug, title] of [["percentage-change-calculator-guide", "Percentage Change: प्रतिशत कसरी निकाल्ने?"], ["tip-calculator-guide", "Tip Calculator: १५%, १८% र २०% कसरी निकाल्ने?"]]) {
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
const highIntentTaskGuides = [
  ["reading-time-calculator", "Set the reading speed in words per minute (WPM).", "Set the speaking speed separately"],
  ["savings-goal-calculator", "Use the same currency", "Choose monthly or weekly deposits"],
  ["percentage-change-calculator", "Choose Calculate percentage change", "For a reverse calculation"],
];
for (const [slug, ...phrases] of highIntentTaskGuides) {
  assert.ok(catalogToolSeoSource.includes('"'+slug+'": ['), `${slug} must have a dedicated task-specific instruction list`);
  for (const phrase of phrases) {
    assert.ok(catalogToolSeoSource.includes(phrase), `${slug} task guidance must include: ${phrase}`);
  }
}
assert.doesNotMatch(pdfToExcelLayoutSource, /<ToolSEOContent/, "PDF to Excel layout must not append a duplicate generic guide");
assert.match(pdfToExcelPageSource, /showSeoContent=\{false\}/, "PDF to Excel must disable the nested generic guide because its page contains a bespoke XLSX guide");
assert.match(niroj77ToolSource, /showSeoContent\?: boolean/, "Niroj77Tool must allow bespoke pages to suppress its generic SEO block");
assert.match(niroj77ToolSource, /showSeoContent && <ToolSEOContent/, "Niroj77Tool must render generic SEO content only when explicitly enabled");
for (const section of ["SMA 20/50 crossover", "RSI 14 recovery", "20-day breakout", "Maximum drawdown", "Important limitations before using results"]) {
  assert.ok(nepseLabPageSource.includes(section), `NEPSE Lab must explain ${section} for users and search crawlers`);
}

assert.match(sitemapSource, /nepaliPdfRoutes\[slug\]/, "PDF URLs must retain their established root-level paths");
assert.doesNotMatch(sitemapSource, /\.\.\.\["merge-pdf",\s*"split-pdf",\s*"compress-pdf",\s*"rotate-pdf",\s*"pdf-to-word",\s*"pdf-to-jpg"\]/, "Do not maintain a second hard-coded localized PDF allowlist");
assert.match(sitemapSource, /!isGeneratedGuide\(post\.slug\)/, "Unreviewed generated PDF and catalogue guides must stay out of the sitemap");
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
assert.match(generatedBlogPageSource, /isGeneratedGuide\(post\.slug\)\s*\?\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/, "Unreviewed generated PDF and catalogue guide pages must remain noindex until editorial review");
assert.match(generatedBlogPageSource, /!isGeneratedGuide\(post\.slug\)\s*&&\s*post\.toolLinks\[0\]/, "Every reviewed editorial guide with a primary tool link must show an above-the-fold tool CTA");
assert.ok(blogToolCtaSource.includes("Ready to try this workflow? Open the matching tool."), "Non-calculator editorial guides must explain the next practical tool action");
assert.match(generatedBlogPageSource, /<BlogToolCTA/, "Reviewed editorial guides must use the shared tracked CTA component");
assert.match(analyticsClientSource, /preferences\?\.analytics !== true/, "All analytics events must respect the saved analytics consent choice");
assert.ok(analyticsClientSource.includes("sendGAEvent"), "Consent-approved events must be sent to GA4");
assert.ok(blogToolCtaSource.includes('"blog_to_tool_click"'), "Blog-to-tool clicks must be measurable as a GA4 event");
assert.ok(blogToolCtaSource.includes("blog_slug") && blogToolCtaSource.includes("tool_path"), "Conversion events must identify the guide and destination tool without collecting document data");
assert.ok(toolViewAnalyticsSource.includes('"tool_view"'), "All catalog tool categories must report consented tool views");
assert.ok(toolViewAnalyticsSource.includes("tool_slug") && toolViewAnalyticsSource.includes("tool_category"), "Tool view events must identify the tool and category");
assert.ok(niroj77ToolSource.includes('"tool_start"') && niroj77ToolSource.includes('"tool_complete"') && niroj77ToolSource.includes('"tool_error"'), "PDF tool processing must measure starts, completions and errors");
const splitGuideSource = blogPostsSource.slice(blogPostsSource.indexOf('slug: "split-pdf-and-extract-selected-pages"'));
for (const phrase of ["1-5;6-10", "1,3,8", "Split PDF", "Extract Pages", "does not perform OCR"]) {
  assert.ok(splitGuideSource.includes(phrase), `Split PDF guide must explain the verified workflow: ${phrase}`);
}
assert.ok(splitGuideSource.includes("updated: \"2026-11-17\""), "Split PDF guide must record its substantive editorial update");
const nepaliSplitGuideSource = nepaliLocalizedBlogSource.slice(nepaliLocalizedBlogSource.indexOf('slug: "split-pdf-and-extract-selected-pages"'));
for (const phrase of ["1-5;6-10", "1,3,8", "Split PDF", "Extract Pages", "OCR हुँदैन"]) {
  assert.ok(nepaliSplitGuideSource.includes(phrase), `Nepali Split PDF guide must explain the verified workflow: ${phrase}`);
}
assert.ok(nepaliSplitGuideSource.includes("updated: \"2026-11-17\""), "Nepali Split PDF guide must record its substantive editorial update");

const tipGuideSource = blogPostsSource.slice(blogPostsSource.indexOf('slug: "tip-calculator-guide"'));
assert.ok(tipGuideSource.includes("Quick mental-math shortcuts"), "Tip guide must add useful mental-math instructions for its high-impression query");
assert.ok(tipGuideSource.includes("18% = $10.80"), "Tip guide must include a verified 18% worked example");
assert.ok(tipGuideSource.includes("updated: \"2026-11-17\""), "Tip guide must record its substantive update");
const nepaliTipGuideSource = nepaliLocalizedBlogSource.slice(nepaliLocalizedBlogSource.indexOf('slug: "tip-calculator-guide"'));
assert.ok(nepaliTipGuideSource.includes("18%, 20% र 25% टिप छिटो निकाल्ने तरिका"), "Nepali tip guide must include the localized mental-math guidance");
assert.ok(nepaliTipGuideSource.includes("18% = 10.80"), "Nepali tip guide must include the localized worked example");
const nrbGuideSource = englishNepalBlogSource.slice(englishNepalBlogSource.indexOf('slug: "nepal-rastra-bank-daily-exchange-rates-guide"'));
const nrbTitle = nrbGuideSource.match(/title: "([^"]+)"/)?.[1] ?? "";
const nrbDescription = nrbGuideSource.match(/description: "([^"]+)"/)?.[1] ?? "";
assert.ok(nrbTitle.length <= 60, "NRB guide title must remain concise for Google title links");
assert.ok(nrbDescription.length <= 155, "NRB guide description must fit the reviewed snippet limit");
assert.ok(nrbGuideSource.includes("foreign amount × buying rate ÷ unit"), "NRB guide must explain the buying-rate conversion formula");
assert.ok(nrbGuideSource.includes("NPR amount × unit ÷ selling rate"), "NRB guide must explain the selling-rate conversion formula");
const nepaliNrbGuideSource = nepaliLocalizedBlogSource.slice(nepaliLocalizedBlogSource.indexOf('slug: "nepal-rastra-bank-daily-exchange-rates-guide"'));
assert.ok(nepaliNrbGuideSource.includes("विदेशी रकम × खरिद दर ÷ प्रकाशित एकाइ"), "Nepali NRB guide must include the correct buying-rate formula");
assert.ok(nepaliNrbGuideSource.includes("NPR रकम × प्रकाशित एकाइ ÷ बिक्री दर"), "Nepali NRB guide must include the correct selling-rate formula");
const priorityEditorialGuides = ["savings-goal-calculator-guide", "reading-time-calculator-guide", "tip-calculator-guide", "percentage-change-calculator-guide", "meta-title-checker-guide"];
for (const slug of priorityEditorialGuides) {
  assert.ok(blogPostsSource.includes(`slug: "${slug}"`), `${slug} must have individually reviewed editorial content`);
  assert.ok(nepaliLocalizedBlogSource.includes(`slug: "${slug}"`), `${slug} must have a reviewed Nepali translation before hreflang is published`);
}
assert.match(blogPostsSource, /return additionalToolBlogPosts\.some\(\(post\) => post\.slug === slug\) \|\|/, "Shared-template PDF guides must remain noindex until they receive individual editorial review");
assert.doesNotMatch(nepaliBlogArticleSource, /"@type":\s*"FAQPage"/, "Nepali blog pages must not emit deprecated FAQ rich-result markup");
assert.doesNotMatch(pdfToolJsonLdSource, /FAQPage/, "PDF tool JSON-LD must not emit deprecated FAQ rich-result markup");
assert.doesNotMatch(pdfToolSeoSource, /FAQPage/, "Localized PDF tool pages must retain visible FAQs without obsolete FAQ markup");
assert.doesNotMatch(blogArticleSource, /"@type":\s*"FAQPage"/, "Do not emit obsolete FAQ rich-result markup");
assert.match(blogArticleSource, /"@type":\s*"BlogPosting"/, "Blog articles must retain accurate Article structured data");
assert.match(nepaliToolsDirectorySource, /robots:\s*\{\s*index:\s*true,\s*follow:\s*true\s*\}/, "The Nepali tools directory must be indexable");
assert.ok(nepaliToolsDirectorySource.includes("nepaliPdfRoutes[slug] ? " + String.fromCharCode(96) + "/ne/${slug}" + String.fromCharCode(96)), "Nepali PDF directory links must point directly to their canonical /ne/<slug> URLs");
assert.match(nepaliToolsDirectorySource, /Object\.keys\(nepaliPdfRoutes\)/, "The Nepali directory must link every registered PDF tool, not a hand-picked subset");
assert.match(nepaliToolsDirectorySource, /\[\.\.\.nepaliLocalizedUtilitySlugs, \.\.\.nepaliLocalizedFinancialSlugs, \.\.\.nepaliLocalizedPublicInfoSlugs\]/, "The Nepali directory must expose every registered utility, finance and public-info route for crawling");
assert.match(sitemapSource, /isLocalizedPageIndexable\("ne", "\/tools"\)/, "The Nepali tools directory must pass the explicit native-review allowlist before sitemap inclusion");
assert.match(nepaliNepseSource, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/, "The not-yet-reviewed Nepali NEPSE page must stay noindex");
assert.match(sitemapSource, /nepaliLocalizedPublicInfoSlugs/, "Nepali public-info tools must be included in the indexable sitemap");

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
  assert.equal(alternates?.ne, `https://pd-fora.vercel.app/ne${localeFreePath}`);
  assert.equal(alternates?.en, `https://pd-fora.vercel.app${localeFreePath}`);
}

const englishBlogSlugs = new Set([...englishNepalBlogSource.matchAll(/slug:\s*"([^"]+)"/g), ...englishEditorialBlogSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]));
const nepaliBlogSlugs = [...nepaliLocalizedBlogSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
for (const slug of nepaliBlogSlugs) {
  assert.ok(englishBlogSlugs.has(slug), `Nepali blog ${slug} must have a real English equivalent before publishing hreflang`);
  const alternates = hreflangMap(`/blog/${slug}`);
  assert.equal(alternates?.ne, `https://pd-fora.vercel.app/ne/blog/${slug}`);
  assert.equal(alternates?.en, `https://pd-fora.vercel.app/blog/${slug}`);
}

assert.match(englishToolPageSource, /isLocalizedToolIndexable\("ne", slug\)/, "English tool pages must gate Nepali hreflang on explicit indexing approval");
assert.match(englishToolPageSource, /languages\s*\?\s*\{\s*languages\s*\}/, "Approved English PDF pages must emit the reciprocal hreflang map");
for (const slug of approvedNepali) {
  const localeFreePath = pdfRoutes.includes(slug) ? `/${slug}` : `/tools/${slug}`;
  const alternates = hreflangMap(localeFreePath);
  assert.equal(alternates?.en, `https://pd-fora.vercel.app${localeFreePath}`);
  assert.equal(alternates?.ne, `https://pd-fora.vercel.app/ne${localeFreePath}`);
  assert.equal(alternates?.["x-default"], `https://pd-fora.vercel.app${localeFreePath}`);
}
for (const slug of toolRoutes) {
  assert.equal(modules["localized-verification"].isLocalizedToolIndexable("ne", slug), true, `${slug} has a dedicated Nepali workspace`);
  const request = modules["localized-route"].resolveLocalizedToolRequest("ne", slug);
  assert.equal(request.status, "ok", `Expected registered Nepali route: ${slug}`);
  const metadata = modules["localized-metadata"].buildLocalizedToolMetadata("ne", request.implementation.entry);
  assert.deepEqual(metadata.robots, { index: true, follow: true }, `${slug} should be indexable after localization`);
  assert.equal(metadata.alternates?.languages?.ne, `https://pd-fora.vercel.app/ne/tools/${slug}`);
  assert.equal(metadata.alternates?.languages?.en, `https://pd-fora.vercel.app/tools/${slug}`);
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

// All 49 localized PDF routes are resolvable and included in the indexability registry.
for (const slug of ["pdf-information", "pdf-to-png", "pdf-to-html", "pdf-to-excel", "add-blank-pages"]) {
  assert.ok(pdfRoutes.includes(slug), `Historical localized URL /ne/${slug} must resolve to its registered page, not a 404`);
  assert.equal(isLocalizedToolIndexable("ne", slug), true, `/ne/${slug} has a localized guide and workspace and should be indexable`);
}
assert.match(nepaliPdfPageSource, /Object\.keys\(nepaliPdfRoutes\)/, "All registered Nepali PDF routes must be generated so legacy URLs resolve");
assert.ok(nextConfigSource.includes('{ source: "/nepali-date-converter", destination: "/tools/nepali-date-converter", permanent: true }'), "Legacy /nepali-date-converter must permanently redirect to the catalog canonical URL");
assert.doesNotMatch(legacyToolSlugsSource, /"nepali-date-converter"/, "Redirect-only Nepali date URL must not enter the canonical legacy PDF route registry");
assert.match(sitemapSource, /\$\{baseUrl\}\/tools\/\$\{tool\.slug\}/, "The canonical catalog URL must remain in the sitemap");
assert.ok(robotsSource.includes('disallow: ["/api/"]'), "The 27 API endpoints in the Search Console robots export must remain intentionally blocked");

console.log(`SEO sitemap/indexing regression checks passed: ${approvedNepali.length} Nepali tool URLs are indexable; ${toolRoutes.length} catalog and ${pdfRoutes.length} PDF tools are included.`);
