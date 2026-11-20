// Checks that the Hindi editorial articles mirror the 16 English editorial articles. Run: node scripts/hindi-editorial-posts.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { ensureTypeStripping, loadI18n, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const i18n = await loadI18n();
const adapter = await loadToolAdapter();
const posts = i18n["hindi-editorial-posts"].hindiEditorialPosts;
const pdfRoutes = adapter["nepali-pdf-routes"].nepaliPdfRoutes;
const catalog = adapter.toolCatalog.toolCatalog;
const DEVANAGARI = /[ऀ-ॿ]/g;
const LETTERS = /[A-Za-zऀ-ॿ]/g;

// English editorial articles are read from source so a new English article without a Hindi version fails here.
const englishSource = await readFile(new URL("../lib/blog-posts.ts", import.meta.url), "utf8");
const editorialSource = englishSource.slice(englishSource.indexOf("const editorialBlogPosts"), englishSource.indexOf("const existingArticleSlugs"));
const english = editorialSource.split(/\n\s*\{\s*\n\s*slug: "/).slice(1).map((chunk) => ({
  slug: chunk.slice(0, chunk.indexOf('"')),
  sections: (chunk.match(/\bheading: "/g) ?? []).length,
  faqs: (chunk.match(/\bquestion: "/g) ?? []).length,
  tools: (chunk.match(/\{ label: "[^"]+", href: "/g) ?? []).length,
  sources: (chunk.match(/\{ label: "[^"]+", url: "/g) ?? []).length,
}));

const textOf = (post) => [post.title, post.description, post.intro, ...post.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]), ...post.faqs.flatMap((f) => [f.question, f.answer])];

test("every English editorial article has exactly one Hindi article, and no extras", () => {
  assert.equal(english.length, 16, "English inventory should be 16 editorial articles");
  assert.deepEqual(posts.map((p) => p.slug).sort(), english.map((e) => e.slug).sort());
  for (const post of posts) assert.equal(post.sourceSlug, post.slug);
  assert.equal(new Set(posts.map((p) => p.slug)).size, posts.length);
});

test("Hindi articles keep the English structure: sections, FAQs, tool links and sources", () => {
  for (const en of english) {
    const hi = posts.find((p) => p.slug === en.slug);
    assert.equal(hi.sections.length, en.sections, `${en.slug}: section count`);
    assert.equal(hi.faqs.length, en.faqs, `${en.slug}: FAQ count`);
    assert.equal(hi.toolLinks.length, en.tools, `${en.slug}: tool link count`);
    assert.equal(hi.sources?.length ?? 0, en.sources, `${en.slug}: source count`);
  }
});

test("Hindi articles are real Hindi: Devanagari headings, body and FAQs, no English fallback", () => {
  for (const post of posts) {
    for (const text of textOf(post)) {
      const letters = text.match(LETTERS)?.length ?? 0;
      const deva = text.match(DEVANAGARI)?.length ?? 0;
      assert.ok(deva > 0, `${post.slug}: expected Devanagari text in "${text.slice(0, 60)}"`);
      // Proper nouns such as PDF, Excel or WPM may stay Latin, but Hindi must dominate any sentence-length string.
      if (letters > 40) assert.ok(deva / letters >= 0.6, `${post.slug}: too much untranslated text in "${text.slice(0, 60)}"`);
    }
    assert.ok(post.intro.length >= 150, `${post.slug}: intro should be a real introduction`);
    assert.ok(post.sections.every((s) => s.paragraphs.length >= 1 && s.paragraphs.every((p) => p.length >= 80)), `${post.slug}: thin section`);
  }
});

test("search titles and descriptions are unique and within practical length", () => {
  assert.equal(new Set(posts.map((p) => p.title)).size, posts.length, "titles must be unique");
  assert.equal(new Set(posts.map((p) => p.description)).size, posts.length, "descriptions must be unique");
  for (const post of posts) {
    assert.ok(post.title.length <= 60, `${post.slug}: title ${post.title.length} chars`);
    assert.ok(post.description.length >= 60 && post.description.length <= 155, `${post.slug}: description ${post.description.length} chars`);
    assert.match(post.updated, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("factual limits, formulas and worked examples survive translation", () => {
  const all = (slug) => textOf(posts.find((p) => p.slug === slug)).join("\n");
  assert.match(all("merge-multiple-pdf-files-into-one-document"), /20 PDF/);
  assert.match(all("merge-multiple-pdf-files-into-one-document"), /50 MB/);
  assert.match(all("merge-multiple-pdf-files-into-one-document"), /2–20/);
  assert.match(all("compress-pdf-to-under-1mb-online"), /1MB/);
  assert.match(all("compress-pdf-to-under-1mb-online"), /सर्वर-साइड/, "server-side processing notice must be kept");
  assert.match(all("convert-pdf-to-editable-word-document"), /OCR सुविधा फ़िलहाल प्रोसेसिंग सर्वर पर उपलब्ध नहीं/, "OCR limitation must be kept");
  assert.match(all("convert-jpg-images-to-one-pdf-on-phone"), /JPG, JPEG, PNG और WebP/);
  assert.match(all("savings-goal-calculator-guide"), /NPR 90,000/);
  assert.match(all("savings-goal-calculator-guide"), /NPR 10,000/);
  assert.match(all("savings-goal-calculator-guide"), /52 सप्ताह/);
  assert.match(all("reading-time-calculator-guide"), /3 मिनट 20 सेकंड/);
  assert.match(all("reading-time-calculator-guide"), /130 WPM/);
  assert.match(all("reading-time-calculator-guide"), /7\.7 मिनट/);
  assert.match(all("tip-calculator-guide"), /10\.80/);
  assert.match(all("tip-calculator-guide"), /23\.60/);
  assert.match(all("percentage-change-calculator-guide"), /16\.67%/);
  assert.match(all("percentage-change-calculator-guide"), /96/);
  assert.match(all("percentage-change-calculator-guide"), /25%/);
  assert.match(all("meta-title-checker-guide"), /Google/);
  const sources = posts.find((p) => p.slug === "meta-title-checker-guide").sources;
  assert.equal(sources[0].url, "https://developers.google.com/search/docs/appearance/title-link");
});

test("Hindi articles do not repeat claims the English articles avoid", () => {
  for (const post of posts) {
    const text = textOf(post).join("\n");
    assert.doesNotMatch(text, /100%\s*(सुरक्षित|गारंटी)|गारंटीशुदा रैंकिंग|नंबर 1|सबसे तेज़/, `${post.slug}: unsupported superlative`);
  }
});

test("tool links point only to Hindi routes that exist", () => {
  const catalogSlugs = new Set(catalog.map((tool) => tool.slug));
  for (const post of posts) {
    assert.ok(post.toolLinks.length >= 2, `${post.slug}: needs related tools`);
    for (const link of post.toolLinks) {
      assert.ok(DEVANAGARI.test(link.label) || /[ऀ-ॿ]/.test(link.label), `${post.slug}: link label "${link.label}" should be Hindi`);
      DEVANAGARI.lastIndex = 0;
      assert.match(link.href, /^\/hi\//, `${post.slug}: ${link.href} must be a Hindi route`);
      const tool = link.href.match(/^\/hi\/tools\/([^/]+)$/)?.[1];
      const pdf = link.href.match(/^\/hi\/([^/]+)$/)?.[1];
      if (tool) assert.ok(catalogSlugs.has(tool), `${post.slug}: unknown catalog tool ${tool}`);
      else assert.ok(pdf && pdfRoutes[pdf], `${post.slug}: unknown PDF route ${link.href}`);
    }
  }
});

test("Hindi blog route is registered, returns 404 for unknown slugs, and stays preview-only", async () => {
  const route = await readFile(new URL("../app/[locale]/blog/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(route, /if \(!getHindiGuide\(slug\)\) notFound\(\)/, "unknown Hindi slugs must 404 (a JSX element is always truthy)");
  assert.doesNotMatch(route, /const article = <HindiBlogArticle/);
  const pages = await readFile(new URL("../components/HindiBlogPages.tsx", import.meta.url), "utf8");
  const article = await readFile(new URL("../components/HindiEditorialArticle.tsx", import.meta.url), "utf8");
  assert.match(pages, /hindiEditorialPosts\.map/, "index must list the editorial articles");
  assert.match(article, /inLanguage: "hi"/);
  assert.match(article, /<h1 /);
  assert.doesNotMatch(article, /FAQPage/, "FAQ rich-result markup is not justified for this site type");
  const slugs = i18n["hindi-editorial-posts"].hindiEditorialPosts.map((p) => p.slug);
  assert.ok(slugs.length === 16);
});
