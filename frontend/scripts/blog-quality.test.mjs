import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const collections = [
  ["English PDF guides", "lib/blog-posts.ts"],
  ["English Nepal guides", "lib/nepal-blog-posts.ts"],
  ["Nepali localized guides", "lib/nepali-localized-blog-posts.ts"],
];

function articleBlocks(source) {
  return [...source.matchAll(/\{\s*slug:\s*"([^"]+)"([\s\S]*?)\n  \},/g)]
    .map((match) => ({ slug: match[1], body: match[2] }));
}

function field(body, name) {
  return body.match(new RegExp(name + ':\\s*"([^"]*)"'))?.[1] ?? "";
}

const seenByCollection = new Map();
for (const [label, file] of collections) {
  const source = read(file);
  const articles = articleBlocks(source);
  assert.ok(articles.length > 0, label + ": expected editorial articles");
  const slugs = new Set();
  const titles = new Set();
  const descriptions = new Set();

  for (const article of articles) {
    const { slug, body } = article;
    const title = field(body, "title");
    const description = field(body, "description");
    const keyword = field(body, "keyword");
    const intro = field(body, "intro");
    const sections = [...body.matchAll(/\{\s*heading:\s*"/g)].length;
    const faqs = [...body.matchAll(/\{\s*question:\s*"/g)].length;
    const toolLinks = [...body.matchAll(/\{\s*label:\s*"[^"]+",\s*href:\s*"\//g)].length;

    assert.ok(slug && !slugs.has(slug), label + ": duplicate or empty slug " + slug);
    assert.ok(title.length >= 12 && !titles.has(title), label + ": duplicate or weak title for " + slug);
    assert.ok(description.length >= 55 && !descriptions.has(description), label + ": duplicate or weak description for " + slug);
    assert.ok(keyword.length >= 3, label + ": missing target topic for " + slug);
    assert.ok(intro.length >= 80, label + ": missing useful introduction for " + slug);
    assert.ok(sections >= 3, label + ": needs at least three meaningful sections for " + slug);
    assert.ok(faqs >= 2, label + ": add useful reader questions for " + slug);
    assert.ok(toolLinks >= 1, label + ": add at least one relevant working internal tool link for " + slug);
    assert.doesNotMatch(body, /lorem ipsum|\\bTBD\\b|insert text here|coming soon/i, label + ": placeholder content in " + slug);

    for (const match of body.matchAll(/url:\s*"([^"]+)"/g)) {
      const value = match[1];
      if (/^https?:/i.test(value)) {
        const url = new URL(value);
        assert.equal(url.protocol, "https:", label + ": external sources must use HTTPS in " + slug);
        assert.ok(!/(utm_source|utm_medium|fbclid|gclid)=/i.test(value), label + ": remove tracking parameters from source URLs");
      } else {
        assert.ok(value.startsWith("/"), label + ": internal links must be site-relative in " + slug);
      }
    }
    slugs.add(slug);
    titles.add(title);
    descriptions.add(description);
  }
  seenByCollection.set(label, articles.length);
}

const enSlugs = new Set([
  ...articleBlocks(read("lib/blog-posts.ts")).map((item) => item.slug),
  ...articleBlocks(read("lib/nepal-blog-posts.ts")).map((item) => item.slug),
]);
const neSlugs = new Set(articleBlocks(read("lib/nepali-localized-blog-posts.ts")).map((item) => item.slug));
for (const slug of enSlugs) assert.ok(neSlugs.has(slug), "Missing Nepali article translation: " + slug);

const englishArticlePage = read("app/blog/[slug]/page.tsx");
const nepaliArticlePage = read("app/[locale]/blog/[slug]/page.tsx");
assert.ok(englishArticlePage.includes('"@type": "BlogPosting"'), "English article needs BlogPosting structured data");
assert.ok(nepaliArticlePage.includes('"@type": "BlogPosting"'), "Nepali article needs BlogPosting structured data");
assert.ok(englishArticlePage.includes("isCatalogGeneratedGuide(post.slug)"), "Generated catalogue guides must keep their noindex gate");
assert.ok(englishArticlePage.includes("post.title}</span>"), "English breadcrumb should identify the current article");
assert.ok(nepaliArticlePage.includes("post.title}</span>"), "Nepali breadcrumb should identify the current article");
assert.ok(nepaliArticlePage.includes("post.sources.map"), "Nepali articles should render cited sources when provided");

console.log("Editorial content checks passed: " + [...seenByCollection].map(([name, count]) => name + " " + count).join(", ") + ". No arbitrary word-count target is enforced.");
