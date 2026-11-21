// Keeps the Hindi route registry (switcher/hreflang/locale-aware links) in sync with the real Hindi blog and article links.
import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { ensureTypeStripping, loadI18n } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const previousPreview = process.env.PDFORA_I18N_PREVIEW;
process.env.PDFORA_I18N_PREVIEW = "1"; // Hindi is unpublished: hasLocalizedPage("hi") is true only in preview mode.
const i18n = await loadI18n();
const { hindiLocalizedRoutePaths, hasLocalizedPage } = i18n.routing;
const posts = i18n["hindi-editorial-posts"].hindiEditorialPosts;
const blogSource = await readFile(new URL("../components/HindiBlogPages.tsx", import.meta.url), "utf8");
const coreSlugs = [...blogSource.matchAll(/\{slug:"([^"]+)",title:/g)].map((m) => m[1]);

test("every Hindi blog article (5 core + 16 editorial) is in the Hindi route registry", () => {
  assert.equal(coreSlugs.length, 5, "expected 5 core Hindi guides");
  for (const slug of [...coreSlugs, ...posts.map((p) => p.slug)]) {
    assert.ok(hindiLocalizedRoutePaths.has(`/blog/${slug}`), `/blog/${slug} missing from hindiLocalizedRoutePaths`);
    assert.ok(hasLocalizedPage(`/blog/${slug}`, "hi"), `hasLocalizedPage should be true for /blog/${slug}`);
  }
});

test("registry has no Hindi blog entry without a real article", () => {
  const real = new Set([...coreSlugs, ...posts.map((p) => p.slug)]);
  for (const path of hindiLocalizedRoutePaths) {
    const slug = path.match(/^\/blog\/(.+)$/)?.[1];
    if (slug) assert.ok(real.has(slug), `${path} is registered but has no Hindi article`);
  }
});

test("every /hi link inside Hindi articles resolves through the registry", () => {
  for (const post of posts) for (const link of post.toolLinks) {
    const path = link.href.replace(/^\/hi/, "") || "/";
    assert.ok(hasLocalizedPage(path, "hi"), `${post.slug}: ${link.href} is not a registered Hindi page`);
  }
});

test("routes that have no Hindi page are not registered", () => {
  assert.equal(hasLocalizedPage("/how-to-use", "hi"), false, "no Hindi help page exists yet");
});

test("without preview mode no Hindi page is reachable (Hindi stays unpublished)", () => {
  delete process.env.PDFORA_I18N_PREVIEW;
  try {
    assert.equal(hasLocalizedPage("/blog/merge-multiple-pdf-files-into-one-document", "hi"), false);
    assert.equal(hasLocalizedPage("/tools/tip-calculator", "hi"), false);
  } finally {
    if (previousPreview === undefined) delete process.env.PDFORA_I18N_PREVIEW; else process.env.PDFORA_I18N_PREVIEW = previousPreview;
  }
});
