import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const catalogSlugs = new Set([...read("components/toolCatalog.ts").matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]));
const legacySlugs = new Set([...read("lib/legacy-tool-slugs.ts").matchAll(/^\s*"([^"]+)",?$/gm)].map((match) => match[1]));
const collections = [
  ["English PDF guides", "lib/blog-posts.ts"],
  ["English Nepal guides", "lib/nepal-blog-posts.ts"],
  ["Nepali localized guides", "lib/nepali-localized-blog-posts.ts"],
];

// High-impact Nepal finance, tax, market and public-information articles must cite
// at least one primary authority, not only secondary summaries.
const primarySourceHosts = new Set([
  "ird.gov.np", "neb.gov.np", "www.nrb.org.np", "www.nepalstock.com", "nepalstock.com",
  "www.sebon.gov.np", "sebon.gov.np", "cdsc.com.np", "www.cdsc.com.np", "meroshare.cdsc.com.np",
  "www.nea.org.np", "www.erc.gov.np", "moha.gov.np",
]);
const requiresPrimarySource = /(?:vat|gpa|nepse|salary-income-tax|rastra-bank|electricity-bill|public-holidays)/i;

function articleBlocks(source) {
  return [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => {
    const start = source.lastIndexOf("{", match.index);
    let depth = 0;
    let quote = null;
    let escaped = false;
    for (let index = start; index < source.length; index += 1) {
      const character = source[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === quote) quote = null;
        continue;
      }
      if (character === '"' || character === "'" || character === "`") {
        quote = character;
        continue;
      }
      if (character === "{") depth += 1;
      if (character === "}") {
        depth -= 1;
        if (depth === 0) return { slug: match[1], body: source.slice(start, index + 1) };
      }
    }
    throw new Error("Unclosed article object for " + match[1]);
  });
}

function field(body, name) {
  return body.match(new RegExp(name + ':\\s*"([^"]*)"'))?.[1] ?? "";
}

const seenByCollection = new Map();
const substantialParagraphsByCollection = new Map();
for (const [label, file] of collections) {
  const source = read(file);
  const articles = articleBlocks(source);
  assert.ok(articles.length > 0, label + ": expected editorial articles");
  const slugs = new Set();
  const titles = new Set();
  const descriptions = new Set();
  const intros = new Set();
  const substantialParagraphs = new Map();

  for (const article of articles) {
    const { slug, body } = article;
    const title = field(body, "title");
    const description = field(body, "description");
    const keyword = field(body, "keyword");
    const intro = field(body, "intro");
    const sections = [...body.matchAll(/\{\s*heading:\s*"/g)].length;
    const faqs = [...body.matchAll(/\{\s*question:\s*"/g)].length;
    const toolLinks = [...body.matchAll(/\{\s*label:\s*"[^"]+",\s*href:\s*"\//g)].length;
    const sourceUrls = [...body.matchAll(/url:\s*"([^"]+)"/g)].map((match) => match[1]);

    if (requiresPrimarySource.test(slug)) {
      const hasPrimarySource = sourceUrls.some((value) => {
        try {
          return primarySourceHosts.has(new URL(value).hostname.toLowerCase());
        } catch {
          return false;
        }
      });
      assert.ok(hasPrimarySource, label + ": high-impact Nepal guidance needs a primary official source for " + slug);
    }

    assert.ok(slug && !slugs.has(slug), label + ": duplicate or empty slug " + slug);
    assert.ok(title.length >= 12 && !titles.has(title), label + ": duplicate or weak title for " + slug);
    assert.ok(description.length >= 55 && !descriptions.has(description), label + ": duplicate or weak description for " + slug);
    assert.ok(keyword.length >= 3, label + ": missing target topic for " + slug);
    assert.ok(intro.length >= 80 && !intros.has(intro.normalize("NFC").trim()), label + ": missing or duplicated introduction for " + slug);
    assert.ok(sections >= 3, label + ": needs at least three meaningful sections for " + slug);
    assert.ok(faqs >= 2, label + ": add useful reader questions for " + slug);
    assert.ok(toolLinks >= 1, label + ": add at least one relevant internal tool link for " + slug);
    for (const match of body.matchAll(/href:\s*"([^"]+)"/g)) {
      const href = match[1];
      if (href.startsWith("/tools/")) {
        assert.ok(catalogSlugs.has(href.slice("/tools/".length)), label + ": tool link does not exist in catalog: " + href);
      } else if (href.startsWith("/")) {
        assert.ok(legacySlugs.has(href.slice(1)), label + ": legacy tool link does not exist: " + href);
      } else {
        assert.fail(label + ": tool links must be internal paths: " + href);
      }
    }
    assert.doesNotMatch(body, /lorem ipsum|\bTBD\b|insert text here|coming soon/i, label + ": placeholder content in " + slug);

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
    descriptions.add(description);\n    intros.add(intro.normalize("NFC").trim());
  }
  seenByCollection.set(label, articles.length);\n  substantialParagraphsByCollection.set(label, substantialParagraphs.size);
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
