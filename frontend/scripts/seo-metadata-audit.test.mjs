import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, frontendRoot, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const read = (relative) => fs.readFileSync(path.join(frontendRoot, relative), "utf8");
const modules = await loadToolAdapter();
const catalog = modules.toolCatalog.toolCatalog.filter((tool) => tool.slug !== "pdf-tools" && tool.slug !== "resume-builder");
const englishPage = read("app/tools/[slug]/page.tsx");
const nepaliPage = read("app/[locale]/tools/[slug]/page.tsx");
const localizedMetadata = read("lib/tools/localized-metadata.ts");
const englishBlogIndex = read("app/blog/page.tsx");
const englishBlogArticle = read("app/blog/[slug]/page.tsx");
const nepaliBlogIndex = read("app/[locale]/blog/page.tsx");
const nepaliBlogArticle = read("app/[locale]/blog/[slug]/page.tsx");
const sitemap = read("app/sitemap.ts");
const englishPdfGuidesSource = read("lib/tool-guides.ts");
const nepaliPdfGuidesSource = read("lib/i18n/tool-guides-ne.ts");
const nepaliPdfNamesSource = read("lib/i18n/pdf-tool-names-ne.ts");
const nepaliPdfRoutesSource = read("lib/i18n/nepali-pdf-routes.ts");
const nepaliPdfPage = read("app/[locale]/[slug]/page.tsx");
const englishPdfMetadataCore = read("lib/i18n/pdf-tool-seo-core.ts");
const englishResumeBuilder = read("app/resume-builder/page.tsx");
const nepaliStaticRoutePage = read("app/[locale]/[slug]/page.tsx");
const englishOverridesSource = englishPage.slice(englishPage.indexOf("const seoOverrides"), englishPage.indexOf("const seo ="));
const categorySource = englishPage.slice(englishPage.indexOf("const categoryDescription"), englishPage.indexOf("const description ="));
const nepaliTitleSource = nepaliPage.slice(nepaliPage.indexOf("const nepaliTitles"), nepaliPage.indexOf("const nepaliDescriptions"));
const nepaliDescriptionSource = nepaliPage.slice(nepaliPage.indexOf("const nepaliDescriptions"), nepaliPage.indexOf("export async function generateMetadata"));

const overrides = new Map([...englishOverridesSource.matchAll(/"([^"]+)":\s*\{\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g)].map((match) => [match[1], { title: match[2], description: match[3] }]));
const parseDictionary = (source) => new Map([...source.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((match) => [match[1], match[2]]));
const nepaliTitles = parseDictionary(nepaliTitleSource);
const nepaliDescriptions = parseDictionary(nepaliDescriptionSource);
const categoryAdvice = Object.fromEntries([...categorySource.matchAll(/^\s*(PDF|Finance|Math|Text|Developer|Image|SEO|Business|Nepal):\s*"([^"]+)"/gm)].map((match) => [match[1], match[2]]));

assert.equal(catalog.length, 123, "Update the audit when the canonical /tools route count changes");
const slugs = new Set(catalog.map((tool) => tool.slug));
for (const slug of overrides.keys()) assert.ok(slugs.has(slug), "Unknown English SEO override: " + slug);

const englishMetadata = catalog.map((tool) => {
  const override = overrides.get(tool.slug);
  const title = override?.title ?? `Free ${tool.name} Online`;
  const description = override?.description ?? `${tool.description.replace(/[.!?]$/, "")} ${categoryAdvice[tool.category] ?? "Check the input and output carefully before using the result."}`.slice(0, 160);
  return { slug: tool.slug, title, description };
});
function assertUnique(items, field, label) {
  const seen = new Map();
  for (const item of items) {
    const value = item[field].trim();
    assert.ok(value.length > 0, label + " missing " + field + " for " + item.slug);
    assert.ok(!seen.has(value), label + " duplicate " + field + " for " + item.slug + " and " + seen.get(value));
    seen.set(value, item.slug);
  }
}
assertUnique(englishMetadata, "title", "English tool metadata");
assertUnique(englishMetadata, "description", "English tool metadata");
for (const item of englishMetadata) {
  assert.ok(item.title.length >= 12, "English title too short: " + item.slug);
  assert.ok(item.description.length >= 55, "English description too short: " + item.slug);
  assert.ok(item.description.length <= 160, "English fallback description exceeds configured snippet target: " + item.slug);
}

const localizedSlugs = [
  ...modules["nepali-tool-routes"].nepaliLocalizedUtilitySlugs,
  ...modules["nepali-tool-routes"].nepaliLocalizedFinancialSlugs,
  ...modules["nepali-tool-routes"].nepaliLocalizedPublicInfoSlugs,
  ...modules["nepali-tool-routes"].nepaliLocalizedCareerSlugs,
];
assert.equal(new Set(localizedSlugs).size, localizedSlugs.length, "Nepali localized route registries must not contain duplicate slugs");
assert.equal(localizedSlugs.length, 123, "Update Nepali metadata coverage expectation when routes change");
for (const slug of localizedSlugs) {
  assert.ok(slugs.has(slug), "Nepali SEO metadata references a non-catalog slug: " + slug);
  assert.ok(nepaliTitles.has(slug), "Missing Nepali title: " + slug);
  assert.ok(nepaliDescriptions.has(slug), "Missing Nepali description: " + slug);
}
const nepaliMetadata = localizedSlugs.map((slug) => ({ slug, title: nepaliTitles.get(slug), description: nepaliDescriptions.get(slug) }));
assertUnique(nepaliMetadata, "title", "Nepali tool metadata");
assertUnique(nepaliMetadata, "description", "Nepali tool metadata");
for (const item of nepaliMetadata) {
  assert.ok(item.title.length >= 5, "Nepali title too short: " + item.slug);
  assert.ok(item.description.length >= 20, "Nepali description is empty or implausibly short: " + item.slug);
}

assert.match(englishPage, /alternates:\s*\{\s*canonical/, "English tool pages must have self-referencing canonical metadata");
assert.match(englishPage, /openGraph:\s*\{[^}]*title:/s, "English tool pages must define Open Graph titles");
assert.match(englishPage, /twitter:\s*\{[^}]*title:/s, "English tool pages must define Twitter titles");
assert.match(englishPage, /robots:\s*\{\s*index:\s*slug !== "ocr-pdf"/, "OCR remains excluded from indexing");
assert.match(nepaliPage, /buildLocalizedToolMetadata/, "Nepali tool pages must use the shared locale-aware metadata builder");
assert.match(nepaliPage, /title:\s*nepaliTitles\[request\.implementation\.slug\]/, "Nepali titles must use the translated dictionary without repeating the root layout brand suffix");
assert.doesNotMatch(nepaliPage, /title:\s*`[^`]*\\| PDFora`/, "Localized tool titles must not append PDFora twice");
assert.match(nepaliPage, /description:\s*nepaliDescriptions\[request\.implementation\.slug\]/, "Nepali description must use its translated description dictionary");
assert.match(localizedMetadata, /robots:\s*\{ index: false, follow: isPublished\(locale\) \}/, "Unverified Nepali tools must stay noindex until the release gate is satisfied");
assert.match(englishBlogIndex, /title:\s*"Practical PDF & Nepal Guides/, "English blog index needs a descriptive title");
assert.match(englishBlogIndex, /description:\s*"Step-by-step guides/, "English blog index needs a relevant description");
assert.match(englishBlogIndex, /alternates:\s*\{ canonical:/, "English blog index needs a self-canonical");
assert.match(englishBlogIndex, /openGraph:\s*\{/, "English blog index needs Open Graph metadata");
assert.match(englishBlogArticle, /title:\s*post\.title/, "English articles need post-specific titles");
assert.match(englishBlogArticle, /description:\s*post\.description/, "English articles need post-specific descriptions");
assert.match(englishBlogArticle, /canonical:\s*url/, "English articles need self-canonicals");
assert.match(englishBlogArticle, /openGraph:\s*\{[^}]*title:\s*post\.title/s, "English articles need matching Open Graph titles");
assert.match(englishBlogArticle, /twitter:\s*\{[^}]*title:\s*post\.title/s, "English articles need matching Twitter titles");
assert.match(nepaliBlogIndex, /buildLocaleMetadata/, "Nepali blog index must use shared locale metadata");
assert.match(nepaliBlogIndex, /path:\s*"\/blog"/, "Nepali blog index must canonicalize to its own locale path");
assert.match(nepaliBlogArticle, /buildLocaleMetadata/, "Nepali articles must use shared locale metadata");
assert.match(nepaliBlogArticle, /post\.title/, "Nepali articles need localized titles");
assert.match(nepaliBlogArticle, /post\.description/, "Nepali articles need localized descriptions");
assert.doesNotMatch(nepaliBlogArticle, /title:\s*`\$\{post\.title\} \\| PDFora`/, "Localized article titles must rely on the root metadata template for a single brand suffix");
assert.match(sitemap, /nepaliLocalizedBlogPosts\.map/, "Nepali editorial articles must be represented in the sitemap");
assert.match(sitemap, /blogPosts\.filter\(\(post\) => !isCatalogGeneratedGuide\(post\.slug\)\)/, "Only curated English editorial articles should enter the sitemap");

const englishPdfGuides = [...englishPdfGuidesSource.matchAll(/"slug":\s*"([^"]+)"[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"purpose":\s*"([^"]+)"/g)]
  .map((match) => ({ slug: match[1], title: `${match[2]} Online`, description: match[3].replace(/\s+/g, " ").trim().length <= 160 ? match[3].replace(/\s+/g, " ").trim() : (() => { const clean = match[3].replace(/\s+/g, " ").trim(); const shortened = clean.slice(0, 159); const boundary = shortened.lastIndexOf(" "); return `${shortened.slice(0, boundary > 110 ? boundary : 159).replace(/[,:;–-]+$/, "")}.`; })() }));
const routeStart = nepaliPdfRoutesSource.indexOf("export const nepaliPdfRoutes");
const nepaliPdfSlugs = [...nepaliPdfRoutesSource.slice(routeStart).matchAll(/^\s*"([^"]+)":\s*\{/gm)].map((match) => match[1]);
const nepaliPdfNames = parseDictionary(nepaliPdfNamesSource.slice(nepaliPdfNamesSource.indexOf("export const nepaliToolNames")));
const nepaliPdfPurposes = new Map([...nepaliPdfGuidesSource.matchAll(/"([^"]+)":\s*\{purpose:\s*"([^"]+)"/g)].map((match) => [match[1], match[2]]));
assert.equal(englishPdfGuides.length, 49, "All 49 English PDF tools need SEO metadata");
assert.equal(nepaliPdfSlugs.length, 49, "All 49 Nepali PDF routes need SEO metadata");
assert.equal(nepaliPdfNames.size, 49, "All 49 Nepali PDF routes need localized titles");
assert.equal(nepaliPdfPurposes.size, 49, "All 49 Nepali PDF routes need localized descriptions");
assertUnique(englishPdfGuides, "title", "English PDF tool metadata");
assertUnique(englishPdfGuides, "description", "English PDF tool metadata");
const nepaliPdfMetadata = nepaliPdfSlugs.map((slug) => ({ slug, title: nepaliPdfNames.get(slug), description: nepaliPdfPurposes.get(slug) }));
assertUnique(nepaliPdfMetadata, "title", "Nepali PDF tool metadata");
assertUnique(nepaliPdfMetadata, "description", "Nepali PDF tool metadata");
for (const item of nepaliPdfMetadata) {
  assert.ok(item.title && item.description, "Nepali PDF title/description missing for " + item.slug);
  const metadata = modules.metadata.buildLocaleMetadata({ locale: "ne", path: `/${item.slug}`, title: item.title, description: item.description });
  assert.equal(metadata.alternates?.canonical, `https://pd-fora.vercel.app/ne/${item.slug}`, "Nepali PDF canonical must be self-referencing: " + item.slug);
  const approved = modules["localized-verification"].isLocalizedToolIndexable("ne", item.slug);
  assert.deepEqual(metadata.robots, approved ? { index: true, follow: true } : { index: false, follow: true }, "Nepali PDF indexability must use the explicit allowlist: " + item.slug);
  assert.equal(Boolean(metadata.alternates?.languages), approved, "Only approved Nepali PDF routes may publish hreflang: " + item.slug);
}
assert.match(nepaliPdfPage, /title:\s*`\${name} \| PDFora`/, "Nepali PDF pages must use their localized title");
assert.match(nepaliPdfPage, /description:\s*guide\?\.purpose \?\? route\.description/, "Nepali PDF pages must use localized guide descriptions");
assert.match(englishPdfMetadataCore, /alternates:\s*\{ canonical: url \}/, "English PDF pages must have self-referencing canonicals");
assert.match(englishPdfMetadataCore, /robots:\s*\{ index: true, follow: true \}/, "English PDF tool metadata must be indexable");
assert.match(englishPdfMetadataCore, /openGraph:\s*\{[^}]*title:\s*brandedTitle/s, "English PDF pages need page-specific Open Graph titles");
assert.match(englishPdfMetadataCore, /twitter:\s*\{[^}]*title:\s*brandedTitle/s, "English PDF pages need page-specific Twitter titles");
assert.match(sitemap, /legacyToolSlugs\.map/, "English PDF tool routes must be present in the sitemap");
assert.match(englishPage, /tool\.slug !== "resume-builder"/, "The duplicate /tools/resume-builder URL must not be statically generated");
assert.match(englishPage, /slug === "resume-builder"\) permanentRedirect\("\/resume-builder"\)/, "The duplicate catalog Resume Builder route must permanently redirect to its canonical page");
assert.match(englishResumeBuilder, /canonical:\s*"https:\/\/pd-fora\.vercel\.app\/resume-builder"/, "English Resume Builder must self-canonicalize to its dedicated route");
assert.match(englishResumeBuilder, /title:\s*"Free Resume Builder/, "English Resume Builder needs a dedicated title");
assert.match(englishResumeBuilder, /description:\s*"Create a professional resume online/, "English Resume Builder needs a dedicated description");
assert.match(englishResumeBuilder, /openGraph:\s*\{[^}]*title:/s, "English Resume Builder needs Open Graph metadata");
assert.match(nepaliStaticRoutePage, /path:\s*"\/resume-builder"/, "Nepali Resume Builder must use its dedicated localized canonical route");
assert.match(sitemap, /tool\.slug !== "resume-builder"/, "Sitemap must exclude the duplicate catalog Resume Builder URL");
assert.match(sitemap, /url:\s*`\$\{baseUrl\}\/resume-builder`/, "Sitemap must include the canonical English Resume Builder URL");

console.log(`SEO metadata audit passed: ${englishMetadata.length} English catalog, ${englishPdfGuides.length} English PDF, dedicated English Resume Builder, ${nepaliMetadata.length} Nepali catalog, ${nepaliPdfMetadata.length} Nepali PDF, and dedicated Nepali Resume Builder metadata entries.`);
