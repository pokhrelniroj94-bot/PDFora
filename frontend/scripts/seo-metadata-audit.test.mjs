import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, frontendRoot, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const read = (relative) => fs.readFileSync(path.join(frontendRoot, relative), "utf8");
const modules = await loadToolAdapter();
const catalog = modules.toolCatalog.toolCatalog.filter((tool) => tool.slug !== "pdf-tools");
const englishPage = read("app/tools/[slug]/page.tsx");
const nepaliPage = read("app/[locale]/tools/[slug]/page.tsx");
const localizedMetadata = read("lib/tools/localized-metadata.ts");
const englishBlogIndex = read("app/blog/page.tsx");
const englishBlogArticle = read("app/blog/[slug]/page.tsx");
const nepaliBlogIndex = read("app/[locale]/blog/page.tsx");
const nepaliBlogArticle = read("app/[locale]/blog/[slug]/page.tsx");
const sitemap = read("app/sitemap.ts");
const englishOverridesSource = englishPage.slice(englishPage.indexOf("const seoOverrides"), englishPage.indexOf("const seo ="));
const categorySource = englishPage.slice(englishPage.indexOf("const categoryDescription"), englishPage.indexOf("const description ="));
const nepaliTitleSource = nepaliPage.slice(nepaliPage.indexOf("const nepaliTitles"), nepaliPage.indexOf("const nepaliDescriptions"));
const nepaliDescriptionSource = nepaliPage.slice(nepaliPage.indexOf("const nepaliDescriptions"), nepaliPage.indexOf("export async function generateMetadata"));

const overrides = new Map([...englishOverridesSource.matchAll(/"([^"]+)":\s*\{\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g)].map((match) => [match[1], { title: match[2], description: match[3] }]));
const parseDictionary = (source) => new Map([...source.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((match) => [match[1], match[2]]));
const nepaliTitles = parseDictionary(nepaliTitleSource);
const nepaliDescriptions = parseDictionary(nepaliDescriptionSource);
const categoryAdvice = Object.fromEntries([...categorySource.matchAll(/^\s*(PDF|Finance|Math|Text|Developer|Image|SEO|Business|Nepal):\s*"([^"]+)"/gm)].map((match) => [match[1], match[2]]));

assert.equal(catalog.length, 124, "Update the audit when the canonical catalog size changes");
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
assert.match(nepaliPage, /title:\s*`\$\{nepaliTitles\[request\.implementation\.slug\]\} \| PDFora`/, "Nepali title must use its translated title dictionary and brand");
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
assert.match(sitemap, /nepaliLocalizedBlogPosts\.map/, "Nepali editorial articles must be represented in the sitemap");
assert.match(sitemap, /blogPosts\.filter\(\(post\) => !isCatalogGeneratedGuide\(post\.slug\)\)/, "Only curated English editorial articles should enter the sitemap");

console.log(`SEO metadata audit passed: ${englishMetadata.length} unique English tool titles/descriptions and ${nepaliMetadata.length} unique Nepali tool titles/descriptions.`);
