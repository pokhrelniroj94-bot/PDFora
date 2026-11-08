import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, frontendRoot, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();

const read = (relative) => fs.readFileSync(path.join(frontendRoot, relative), "utf8");
const sitemapSource = read("app/sitemap.ts");
const robotsSource = read("app/robots.ts");
const layoutSource = read("app/layout.tsx");
const englishToolPageSource = read("app/tools/[slug]/page.tsx");
const pdfToolWorkspaceSource = read("components/PDForaTool.tsx");
const niroj77ToolWorkspaceSource = read("components/Niroj77Tool.tsx");
const mergePdfLayoutSource = read("app/merge-pdf/layout.tsx");

const englishHomeSource = read("app/page.tsx");
const nepaliHomeSource = read("app/ne/page.tsx");
const blogArticleSource = read("app/blog/[slug]/page.tsx");
const englishBlogIndexSource = read("app/blog/page.tsx");
const toolsIndexSource = read("app/tools/page.tsx");
const toolDirectorySource = read("lib/tool-directory.ts");
const blogPostSource = read("lib/blog-posts.ts");
const nepaliBlogArticleSource = read("app/[locale]/blog/[slug]/page.tsx");
const localeMetadataSource = read("lib/i18n/metadata.ts");
const toolSeoContentSource = read("components/ToolSEOContent.tsx");
const catalogToolSeoContentSource = read("components/CatalogToolSEOContent.tsx");
const pdfToolJsonLdSource = read("components/PdfToolJsonLd.tsx");
const pdfToolMetadataSource = read("lib/i18n/pdf-tool-seo-core.ts");
const catalogIndexabilitySource = read("lib/tools/catalog-indexability.ts");

const legacyPdfSlugs = [...read("lib/legacy-tool-slugs.ts").matchAll(/^\s*"([^"]+)",?$/gm)].map((match) => match[1]);
const modules = await loadToolAdapter();
const { toolGuides } = await import("../lib/tool-guides.ts");
const { toolCatalog } = await import("../components/toolCatalog.ts");
const { indexableCatalogToolSlugs, isCatalogToolIndexable } = await import("../lib/tools/catalog-indexability.ts");
const { buildPdfToolMetadata } = await import("../lib/i18n/pdf-tool-seo-core.ts");
const hreflangMap = modules.routing.hreflangMap;
const approvedNepali = modules["localized-verification"].verifiedLocalizedTools.ne ?? [];
const isLocalizedToolIndexable = modules["localized-verification"].isLocalizedToolIndexable;
const pdfRoutes = Object.keys(modules["nepali-pdf-routes"].nepaliPdfRoutes);
const toolRoutes = [
  ...modules["nepali-tool-routes"].nepaliLocalizedUtilitySlugs,
  ...modules["nepali-tool-routes"].nepaliLocalizedFinancialSlugs,
  ...modules["nepali-tool-routes"].nepaliLocalizedPublicInfoSlugs,
  ...modules["nepali-tool-routes"].nepaliLocalizedCareerSlugs,
];

assert.deepEqual(
  [...approvedNepali].sort(),
  [...pdfRoutes.filter((slug) => isLocalizedToolIndexable("ne", slug))].sort(),
  "The explicit Nepali PDF allowlist must match exactly the PDF routes approved for indexing",
);

assert.doesNotMatch(pdfToolWorkspaceSource, /ToolSEOContent/, "PDForaTool must not render a second SEO guide");
assert.doesNotMatch(niroj77ToolWorkspaceSource, /ToolSEOContent/, "Niroj77Tool must not render a second SEO guide");
assert.match(read("app/[locale]/[slug]/page.tsx"), /<ToolSEOContent slug=\{slug\} locale="ne" \/>/, "Nepali PDF routes must render their localized SEO guide explicitly");
assert.match(mergePdfLayoutSource, /<ToolSEOContent slug="merge-pdf" \/>/, "The PDF page layout must remain the single owner of its SEO guide");
assert.equal(legacyPdfSlugs.length, 49, "Expected all 49 established PDF routes in the canonical registry");

const catalogueToolSlugs = toolCatalog.map((tool) => tool.slug).filter((slug) => slug !== "pdf-tools");
assert.equal(catalogueToolSlugs.length, 124, "Expected 124 catalogue utilities");
assert.equal(new Set([...legacyPdfSlugs, ...catalogueToolSlugs]).size, 173, "All 173 tools must have one unique canonical route identity");

const pdfMetadataTitles = new Set();
const pdfMetadataDescriptions = new Set();
for (const slug of legacyPdfSlugs) {
  const metadata = buildPdfToolMetadata(toolGuides.find((guide) => guide.slug === slug), slug);
  assert.equal(metadata.alternates?.canonical, `https://pd-fora.vercel.app/${slug}`, `${slug} must have a self-canonical URL`);
  assert.deepEqual(metadata.robots, { index: true, follow: true }, `${slug} must remain indexable only with its dedicated guide`);
  assert.ok(metadata.openGraph?.title && metadata.openGraph?.description, `${slug} must have Open Graph metadata`);
  assert.ok(metadata.twitter?.title && metadata.twitter?.description, `${slug} must have Twitter metadata`);
  pdfMetadataTitles.add(String(metadata.title));
  pdfMetadataDescriptions.add(String(metadata.description));
}
assert.equal(pdfMetadataTitles.size, legacyPdfSlugs.length, "All PDF tools must have unique metadata titles");
assert.equal(pdfMetadataDescriptions.size, legacyPdfSlugs.length, "All PDF tools must have unique metadata descriptions");

for (const slug of legacyPdfSlugs) {
  const layout = read(`app/${slug}/layout.tsx`);
  assert.equal((layout.match(/<ToolSEOContent\b/g) ?? []).length, 1, `${slug} must render exactly one shared PDF SEO guide from its layout`);
  const page = read(`app/${slug}/page.tsx`);
  assert.doesNotMatch(page, /ToolGuide|Frequently asked questions|How it works|More PDF tools/, `${slug} must not duplicate guide or promotional sections outside its shared layout`);
}

const consolidatedPdfPages = ["merge-pdf", "delete-pages", "compress-pdf", "extract-pages", "images-to-pdf", "pdf-to-excel", "pdf-to-jpg", "pdf-to-word", "split-pdf", "watermark", "rotate-pdf"];
for (const slug of consolidatedPdfPages) {
  const page = read(`app/${slug}/page.tsx`);
  assert.equal((page.match(/<section\b/g) ?? []).length, 1, `${slug} should retain one clear tool hero and workspace section`);
  assert.doesNotMatch(page, /ToolGuide|Frequently asked questions|How it works|More PDF tools/, `${slug} should not repeat the detailed guide or legacy promotional sections`);
}


assert.match(sitemapSource, /Object\.keys\(nepaliPdfRoutes\)/, "Sitemap must derive PDF URLs from the canonical route registry");
assert.match(sitemapSource, /isLocalizedToolIndexable\("ne", slug\)/, "Localized sitemap entries must pass the same default-deny gate as metadata");
assert.match(sitemapSource, /nepaliPdfRoutes\[slug\]/, "PDF URLs must retain their established root-level paths");
assert.doesNotMatch(sitemapSource, /\.\.\.\["merge-pdf",\s*"split-pdf",\s*"compress-pdf",\s*"rotate-pdf",\s*"pdf-to-word",\s*"pdf-to-jpg"\]/, "Do not maintain a second hard-coded localized PDF allowlist");
assert.match(sitemapSource, /!isCatalogGeneratedGuide\(post\.slug\)/, "Unreviewed generated catalogue guides must stay out of the sitemap");
assert.match(robotsSource, /disallow:\s*\["\/api\/"\]/, "API endpoints should stay excluded from crawling");
assert.match(layoutSource, /inLanguage:\s*htmlLang/, "Structured data must reflect the server-rendered page language");
assert.match(layoutSource, /publisher:\s*\{\s*"@id":\s*"https:\/\/pd-fora\.vercel\.app\/#organization"\s*\}/, "WebSite structured data should reference the canonical publisher entity");
assert.doesNotMatch(robotsSource, /disallow:[^\]]*noindex|disallow:[^\]]*\/ne\//, "Do not block crawlers from reading noindex directives on localized pages");

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


assert.match(read("app/layout.tsx"), /metadataBase:\s*new URL\("https:\/\/pd-fora\.vercel\.app"\)/, "The site must have one consistent metadata base");
assert.match(read("app/about/page.tsx"), /title:\s*\{\s*absolute:\s*"About PDFora \| Free Online PDF Tools & Nepal Utilities"/, "About page must use an absolute descriptive title without duplicating the root brand template");

assert.match(layoutSource, /title:\s*\{\s*default:[\s\S]*?template:\s*"%s \| PDFora"/, "The root layout must own the single PDFora title suffix");
for (const relativePath of ["app/tools/page.tsx", "app/market/page.tsx", "app/nepse-lab/page.tsx", "app/resume-builder/page.tsx", "app/privacy/page.tsx", "app/terms/page.tsx", "app/contact/page.tsx", "app/[locale]/blog/page.tsx", "app/[locale]/[slug]/page.tsx"]) {
  const source = read(relativePath);
  const pageMetadata = source.split("openGraph:")[0];
  // Social card titles may include the brand; only the page title inherits the root template.
  assert.doesNotMatch(pageMetadata, /title:\s*"[^"]*\|\s*PDFora"/, relativePath + " must not repeat the root title-template brand suffix");
}
assert.match(read("lib/tools/localized-metadata.ts"), /title: entry\.name/, "Localized tool titles must rely on the shared root brand suffix");
assert.match(read("lib/i18n/pdf-tool-seo-core.ts"), /const title = `\$\{guide\.name\} Online`/, "PDF guide titles must rely on the shared root brand suffix");

for (const [source, label] of [[englishHomeSource, "English home"], [nepaliHomeSource, "Nepali home"]]) {
  assert.match(source, /alternates:\s*\{[\s\S]*?canonical:/, `${label} must declare a self-canonical URL`);
  assert.match(source, /openGraph:\s*\{/, `${label} must provide Open Graph metadata`);
  assert.match(source, /twitter:\s*\{/, `${label} must provide social preview metadata`);
}
assert.match(englishToolPageSource, /alternates:\s*\{\s*canonical/, "Catalog tool pages must publish self-canonical URLs");
assert.ok(englishToolPageSource.includes("const title = seo?.title ?? `${tool.name} Online`"), "Fallback metadata title must rely on the root brand template exactly once");
assert.doesNotMatch(englishToolPageSource, /keywords\s*[:,]/, "Utility pages must not emit ignored meta-keywords");
assert.doesNotMatch(read("app/tools/page.tsx"), /keywords\s*:/, "The tools directory must not emit ignored meta-keywords");
assert.doesNotMatch(read("app/resume-builder/page.tsx"), /keywords\s*:/, "Resume builder must not emit ignored meta-keywords");
assert.doesNotMatch(read("lib/i18n/pdf-tool-seo-core.ts"), /keywords/, "PDF guide metadata must not emit ignored meta-keywords");
assert.match(englishToolPageSource, /openGraph:\s*\{/, "Catalog tool pages must publish Open Graph metadata");
assert.match(englishToolPageSource, /twitter:\s*\{/, "Catalog tool pages must publish Twitter metadata");
assert.match(englishToolPageSource, /robots:\s*\{\s*index:\s*isCatalogToolIndexable\(slug\)/, "Catalogue tool indexing must use the explicit editorial allowlist");
assert.match(sitemapSource, /isCatalogToolIndexable\(tool\.slug\)/, "Only reviewed catalogue tools may enter the sitemap");
assert.match(catalogIndexabilitySource, /Default-deny indexability/, "Catalogue indexability must document the editorial gate");
assert.ok(indexableCatalogToolSlugs.size > 0, "At least one reviewed catalogue tool should remain indexable");
assert.equal(toolCatalog.filter((tool) => isCatalogToolIndexable(tool.slug)).length, indexableCatalogToolSlugs.size, "The indexability allowlist must contain only real catalogue slugs");
assert.match(blogArticleSource, /alternates:\s*\{\s*canonical:\s*url/, "English articles must publish self-canonicals");
assert.match(blogArticleSource, /robots:\s*(?:isCatalogGeneratedGuide\(post\.slug\)\s*\|\|\s*isGeneratedPdfGuide\(post\.slug\))\s*\?\s*\{\s*index:\s*false/, "All generated thin blog guides must remain noindex");
assert.match(blogPostSource, /generatedPdfGuideSlugs = new Set\(additionalToolBlogPosts\.map/, "Generated PDF blog guide variants must be explicitly classified");
assert.match(blogArticleSource, /isGeneratedPdfGuide\(post\.slug\)/, "Generated PDF guide articles must remain noindex");
assert.match(englishBlogIndexSource, /!isGeneratedPdfGuide\(post\.slug\)/, "Generated PDF guide variants must not appear as editorial blog cards");
assert.match(englishBlogIndexSource, /twitter:\s*\{/, "Editorial blog index must provide Twitter preview metadata");
assert.match(englishBlogIndexSource, /openGraph:\s*\{[\s\S]*?images:/, "Editorial blog index must provide an Open Graph image");
assert.match(englishBlogIndexSource, /twitter:\s*\{[\s\S]*?images:/, "Editorial blog index must provide a Twitter image");
assert.match(toolsIndexSource, /openGraph:\s*\{[\s\S]*?images:/, "All-tools directory must provide an Open Graph image");
assert.match(toolsIndexSource, /twitter:\s*\{[\s\S]*?images:/, "All-tools directory must provide a Twitter preview image");
for (const slug of approvedNepali) assert.ok(nepaliHomeSource.includes(`href: "/ne/${slug}"`), `Nepali homepage must link to its reviewed localized PDF tool: ${slug}`);
assert.match(sitemapSource, /!isGeneratedPdfGuide\(post\.slug\)/, "Generated PDF guide variants must be excluded from the sitemap");
assert.match(sitemapSource, /baseUrl\}\/nepse-lab/, "NEPSE strategy lab must be included in the sitemap");
assert.match(sitemapSource, /baseUrl\}\/resume-builder/, "Resume builder must be included in the sitemap");

assert.match(sitemapSource, /tool\.slug !== "resume-builder"/, "Duplicate /tools/resume-builder must be excluded from the sitemap");
assert.match(englishToolPageSource, /slug === "resume-builder"\) permanentRedirect\("\/resume-builder"\)/, "The duplicate utility route must permanently redirect to the dedicated resume builder");
assert.match(englishToolPageSource, /tool\.slug !== "resume-builder"/, "The duplicate utility route must not be generated as a static catalog page");
assert.match(toolDirectorySource, /tool\.slug === "resume-builder" \? "\/resume-builder"/, "Tool directory links must use the canonical resume builder URL");
assert.match(catalogToolSeoContentSource, /item\.slug === "resume-builder" \? "\/resume-builder"/, "Related-tool links must use the canonical resume builder URL");
assert.match(blogPostSource, /catalogToolHref = \(slug: string\) => slug === "resume-builder" \? "\/resume-builder"/, "Generated guide references must use the canonical resume builder URL");

assert.match(toolSeoContentSource, /!isGeneratedPdfGuide\(guide\.blogSlug\)/, "PDF tool pages must link only to reviewed editorial guides");
assert.match(catalogToolSeoContentSource, /guideSlug && !isCatalogGeneratedGuide\(guideSlug\)/, "Utility pages must not link to generated noindex catalog guide duplicates");
assert.match(blogArticleSource, /openGraph:\s*\{\s*type:\s*"article"/, "English articles must publish article Open Graph metadata");
assert.match(blogArticleSource, /twitter:\s*\{/, "English articles must publish Twitter metadata");
assert.match(blogArticleSource, /openGraph:\s*\{[\s\S]*?images:/, "English articles must publish an Open Graph image");
assert.match(blogArticleSource, /twitter:\s*\{[\s\S]*?images:/, "English articles must publish a Twitter image");
assert.match(pdfToolMetadataSource, /openGraph:\s*\{[\s\S]*?images:/, "PDF tools must publish an Open Graph image");
assert.match(pdfToolMetadataSource, /twitter:\s*\{[\s\S]*?images:/, "PDF tools must publish a Twitter image");
assert.match(nepaliBlogArticleSource, /buildLocaleMetadata\(/, "Nepali articles must use the shared canonical and locale metadata builder");
assert.match(localeMetadataSource, /alternates:\s*\{\s*canonical,/, "Localized pages must self-canonicalize");
assert.match(localeMetadataSource, /openGraph:\s*\{/, "Localized pages must publish locale-aware Open Graph metadata");
assert.match(localeMetadataSource, /twitter:\s*\{/, "Localized pages must publish locale-aware Twitter metadata");

assert.match(localeMetadataSource, /openGraph:\s*\{[\s\S]*?images:/, "Localized pages must publish Open Graph images");
assert.match(localeMetadataSource, /twitter:\s*\{[\s\S]*?images:/, "Localized pages must publish Twitter images");
for (const relativePath of ["app/tools/page.tsx", "app/market/page.tsx", "app/nepse-lab/page.tsx", "app/resume-builder/page.tsx"]) {
  const source = read(relativePath);
  assert.match(source, /openGraph:\s*\{[\s\S]*?images:/, `${relativePath} must provide an Open Graph image`);
  assert.match(source, /twitter:\s*\{[\s\S]*?images:/, `${relativePath} must provide a Twitter image`);
}

for (const relativePath of ["app/about/page.tsx", "app/contact/page.tsx", "app/privacy/page.tsx", "app/terms/page.tsx"]) {
  const source = read(relativePath);
  assert.match(source, /openGraph:\s*\{[\s\S]*?images:/, `${relativePath} must provide an Open Graph image`);
  assert.match(source, /twitter:\s*\{[\s\S]*?images:/, `${relativePath} must provide a Twitter image`);
}

assert.match(localeMetadataSource, /robots:\s*!published\s*\?/, "Unpublished locales must remain excluded from indexing");

assert.doesNotMatch(blogArticleSource, /"@type": "FAQPage"/, "English blog pages must not carry obsolete FAQ rich-result markup");
assert.doesNotMatch(toolSeoContentSource, /"@type": "FAQPage"/, "English and Nepali PDF guides must not emit obsolete FAQ rich-result markup");
assert.doesNotMatch(nepaliHomeSource, /"@type": "FAQPage"/, "Nepali homepage must not emit obsolete FAQ rich-result markup");
assert.doesNotMatch(pdfToolJsonLdSource, /"@type": "FAQPage"/, "Shared PDF JSON-LD must not emit obsolete FAQ rich-result markup");
assert.doesNotMatch(nepaliBlogArticleSource, /"@type": "FAQPage"/, "Nepali blog pages must not carry obsolete FAQ rich-result markup");
assert.match(blogArticleSource, /post\.faqs\.map/, "English article FAQs must remain visible to readers");
assert.match(nepaliBlogArticleSource, /post\.faqs\.map/, "Nepali article FAQs must remain visible to readers");
for (const relativePath of ["app/market/page.tsx", "app/nepse-lab/page.tsx", "app/resume-builder/page.tsx"]) {
  const source = read(relativePath);
  assert.match(source, /alternates:\s*\{\s*canonical:/, `${relativePath} must have a self-canonical URL`);
  assert.match(source, /openGraph:\s*\{/, `${relativePath} must have Open Graph metadata`);
  assert.match(source, /twitter:\s*\{/, `${relativePath} must have social preview metadata`);
}


console.log(`SEO sitemap/indexing regression checks passed: ${approvedNepali.length} approved Nepali tool URLs; ${toolRoutes.length} unapproved localized catalog tools remain noindex.`);
