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
const sitemap = read("app/sitemap.ts");
const routing = read("lib/i18n/routing.ts");
const nepaliToolRoutes = read("lib/i18n/nepali-tool-routes.ts");

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
assert.ok(sitemap.includes("nepaliLocalizedBlogPosts.map"), "Every Nepali blog article must be included in sitemap");
assert.ok(sitemap.includes("nepaliLocalizedUtilitySlugs") && sitemap.includes("nepaliLocalizedFinancialSlugs") && sitemap.includes("nepaliLocalizedCareerSlugs"), "Every published Nepali utility, financial and career tool must be included in sitemap");
assert.ok(sitemap.includes("/ne/market") && sitemap.includes("/ne/resume-builder"), "Published Nepali market and resume pages must be included in sitemap");
for (const match of nepaliToolRoutes.matchAll(/"([a-z0-9-]+)"/g)) {
  if (nepaliToolRoutes.slice(0, nepaliToolRoutes.indexOf(match[0])).includes("nepaliLocalizedUtilitySlugs")) continue;
}
assert.ok(routing.includes("nepaliLocalizedBlogPosts.map"), "Every Nepali blog article must be registered for language switching and hreflang");

console.log(`Nepali blog coverage passed: ${expected.length} editorial articles translated; ${localized.length} localized routes available.`);
