import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const englishEditorial = read("lib/blog-posts.ts");
const nepalEditorial = read("lib/nepal-blog-posts.ts");
const nepali = read("lib/nepali-localized-blog-posts.ts");
const indexPage = read("app/[locale]/blog/page.tsx");
const articlePage = read("app/[locale]/blog/[slug]/page.tsx");
const englishArticlePage = read("app/blog/[slug]/page.tsx");
const sitemap = read("app/sitemap.ts");
const routing = read("lib/i18n/routing.ts");

const slugs = (source) => [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const expected = [...slugs(englishEditorial), ...slugs(nepalEditorial)];
const localized = slugs(nepali);
const uniqueLocalized = new Set(localized);

assert.equal(uniqueLocalized.size, localized.length, "Nepali blog slugs must be unique");
for (const slug of expected) {
  assert.ok(uniqueLocalized.has(slug), `Missing Nepali translation for editorial blog: ${slug}`);
}
for (const match of nepali.matchAll(/slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"/g)) {
  assert.match(match[2], /[\u0900-\u097F]/u, `Blog title must be Nepali script: ${match[1]}`);
}
assert.ok(indexPage.includes("nepaliLocalizedBlogPosts.map"), "Nepali blog index must render the complete localized catalogue");
assert.ok(articlePage.includes('inLanguage: "ne"'), "Nepali article structured data must declare Nepali");
assert.ok(articlePage.includes('"@type": "BreadcrumbList"') && articlePage.includes("breadcrumbSchema"), "Nepali articles must include localized breadcrumb structured data");
assert.ok(articlePage.includes("generateStaticParams"), "Nepali articles must be statically enumerable");
assert.ok(sitemap.includes("nepaliLocalizedBlogPosts.filter((post) => isLocalizedPageIndexable(\"ne\", `/blog/${post.slug}`))"), "Only native-reviewed Nepali blog articles may enter the sitemap");
assert.ok(sitemap.includes("isLocalizedToolIndexable") && sitemap.includes("filter((slug) => isLocalizedToolIndexable(\"ne\", slug))"), "Only verified, indexable Nepali tool pages may enter the sitemap");
assert.ok(sitemap.includes("nepaliLocalizedUtilitySlugs") && sitemap.includes("nepaliLocalizedFinancialSlugs"), "The candidate list must cover all localized Nepali tool groups");
assert.ok(englishArticlePage.includes("const languages = hreflangMap") && englishArticlePage.includes("languages"), "English articles must use the shared localized hreflang gate");
assert.ok(sitemap.includes("/ne/market") && sitemap.includes("/ne/resume-builder"), "Published Nepali market and resume pages must be included in sitemap");
assert.ok(routing.includes("nepaliLocalizedBlogPosts.map"), "Every Nepali blog article must be registered for language switching and hreflang");

console.log(`Nepali blog coverage passed: ${expected.length} editorial articles translated; ${localized.length} localized routes available.`);


// Deeper editorial audit: uniqueness, readable Nepali body, internal destinations and source hygiene.
const entries = [...nepali.matchAll(/slug:\\s*"([^"]+)"/g)].map((match) => ({ slug: match[1], offset: match.index }));
const toolRouteSource = read("lib/i18n/nepali-tool-routes.ts");
const pdfRouteSource = read("lib/i18n/nepali-pdf-routes.ts");
const knownToolSlugs = new Set([
  ...[...toolRouteSource.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1]),
  ...[...pdfRouteSource.matchAll(/^  "([a-z0-9-]+)":/gm)].map((match) => match[1]),
]);
const normalized = (value) => value.toLocaleLowerCase("ne").replace(/[\\s\\p{P}\\p{S}]+/gu, " ").trim();
const normalizedIntros = new Map();
const normalizedTitles = new Map();
const missingSources = [];
const editorialAudit = entries.map((entry, index) => {
  const source = nepali.slice(entry.offset, entries[index + 1]?.offset ?? nepali.length);
  const title = source.match(/title:\\s*"([^"]+)"/)?.[1] ?? "";
  const description = source.match(/description:\\s*"([^"]+)"/)?.[1] ?? "";
  const intro = source.match(/intro:\\s*"([^"]+)"/)?.[1] ?? "";
  const add = (map, value) => map.set(normalized(value), (map.get(normalized(value)) ?? 0) + 1);
  add(normalizedTitles, title);
  add(normalizedIntros, intro);
  const toolLinks = [...source.matchAll(/href:\\s*"([^"]+)"/g)].map((match) => match[1]);
  const sourceUrls = [...source.matchAll(/url:\\s*"([^"]+)"/g)].map((match) => match[1]);
  const invalidLinks = toolLinks.filter((href) => {
    const match = href.match(/^\\/tools\\/([a-z0-9-]+)$/);
    return !match || !knownToolSlugs.has(match[1]);
  });
  const invalidSources = sourceUrls.filter((url) => {
    try { return new URL(url).protocol !== "https:"; } catch { return true; }
  });
  const bodyText = source.replace(/https?:\\/\\/[^"\\s]+/g, "").replace(/\\\\n/g, " ");
  const hasNepaliBody = /[\\u0900-\\u097F]/u.test(bodyText);
  const hasSections = /sections:\\s*\\[/u.test(source) && /heading:\\s*"/u.test(source);
  const hasFaqs = /faqs:\\s*\\[/u.test(source) && /question:\\s*"/u.test(source) && /answer:\\s*"/u.test(source);
  if (!sourceUrls.length) missingSources.push(entry.slug);
  assert.ok(title.length >= 15 && title.length <= 70, `Blog title length out of editorial range: ${entry.slug}`);
  assert.ok(description.length >= 40 && description.length <= 180, `Blog description length out of editorial range: ${entry.slug}`);
  assert.ok(intro.length >= 80, `Blog introduction is too short: ${entry.slug}`);
  assert.ok(hasNepaliBody, `Blog body must contain Nepali script: ${entry.slug}`);
  assert.ok(hasSections && hasFaqs, `Blog needs useful sections and FAQs: ${entry.slug}`);
  assert.equal(invalidLinks.length, 0, `Broken/non-tool internal links in ${entry.slug}: ${invalidLinks.join(", ")}`);
  assert.equal(invalidSources.length, 0, `Invalid or non-HTTPS sources in ${entry.slug}: ${invalidSources.join(", ")}`);
  return { slug: entry.slug, titleLength: title.length, descriptionLength: description.length, introLength: intro.length, internalToolLinks: toolLinks.length, sources: sourceUrls.length, missingSources: sourceUrls.length === 0 };
});
assert.equal([...normalizedTitles.values()].filter((count) => count > 1).length, 0, "Nepali blog titles must not duplicate after normalization");
assert.equal([...normalizedIntros.values()].filter((count) => count > 1).length, 0, "Nepali blog introductions must not duplicate after normalization");
assert.equal(editorialAudit.length, 35, "Expected 35 Nepali blog articles in the editorial inventory");
console.log(`Nepali editorial QA: ${editorialAudit.length} articles checked; ${missingSources.length} have no cited source and require factual/editorial review before indexing.`);
