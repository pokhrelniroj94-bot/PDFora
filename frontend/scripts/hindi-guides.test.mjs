// Focused checks for the Hindi PDF guides. Run: node scripts/hindi-guides.test.mjs (Node 22.6+, no install needed)
import assert from "node:assert/strict";
import test from "node:test";
import { ensureTypeStripping, loadI18n } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const { "tool-guides-hi": hiModule, "tool-guides": enModule } = await loadI18n();
const hi = hiModule.hindiToolGuides;
const en = enModule.toolGuides;
const DEVANAGARI = /[ऀ-ॿ]/;

test("all 49 PDF guides have Hindi copy and no extra slugs", () => {
  assert.equal(en.length, 49);
  assert.deepEqual(Object.keys(hi).sort(), en.map((g) => g.slug).sort());
});

test("Hindi guides keep the English step count and contain Hindi text", () => {
  for (const g of en) {
    const h = hi[g.slug];
    assert.equal(h.steps.length, g.steps.length, `${g.slug}: step count`);
    for (const text of [h.purpose, h.caution, ...h.steps]) {
      assert.ok(DEVANAGARI.test(text), `${g.slug}: expected Devanagari text in "${text}"`);
    }
  }
});

test("Hindi guides preserve numeric limits and ranges from the English source", () => {
  assert.match(hi["merge-pdf"].purpose, /2–20/);
  assert.match(hi["merge-pdf"].steps[0], /50 MB/);
  assert.match(hi["merge-pdf"].caution, /20/);
  assert.match(hi["merge-pdf"].caution, /50 MB/);
  assert.match(hi["rotate-pdf"].steps[1], /90°.*180°.*270°/);
  assert.match(hi["delete-pages"].steps[1], /6-8/);
});

test("Hindi PDF tool names, field copy and routing cover all 49 PDF tools", async () => {
  process.env.PDFORA_I18N_PREVIEW = "1";
  const { "pdf-tool-names-hi": names, "pdf-tool-fields-hi": fields, "nepali-pdf-routes": pdfRoutes, routing, config } = await loadI18n();
  const slugs = Object.keys(pdfRoutes.nepaliPdfRoutes);
  assert.equal(slugs.length, 49);
  assert.deepEqual(Object.keys(names.hindiToolNames).sort(), [...slugs].sort());
  for (const slug of slugs) {
    assert.ok(DEVANAGARI.test(names.hindiToolNames[slug]), `${slug}: Hindi name`);
    assert.equal(routing.hasLocalizedPage(`/${slug}`, "hi"), true, `${slug}: Hindi route registered`);
    // A real Hindi page must never be presented as indexable while Hindi is unpublished.
    assert.equal(routing.hasIndexableLocalizedPage(`/${slug}`, "hi"), false, `${slug}: must stay non-indexable`);
  }
  assert.equal(config.isPublished("hi"), false);
  delete process.env.PDFORA_I18N_PREVIEW;
  assert.equal(routing.hasLocalizedPage("/blog", "hi"), true, "Hindi blog index is a real preview page");
  assert.equal(routing.hasLocalizedPage("/", "hi"), true, "Hindi homepage is a real preview page");
  assert.equal(routing.hasLocalizedPage("/tools", "hi"), true, "Hindi tools directory is a real preview page");
  assert.equal(routing.hasLocalizedPage("/categories", "hi"), true, "Hindi categories page is a real preview page");
  assert.equal(routing.hasLocalizedPage("/privacy", "hi"), true, "Hindi privacy page is a real preview page");
  // Every translatable field string in the PDF route table has a Hindi equivalent (technical values excepted).
  const technical = new Set(["90", "bottom-center", "1", "false", "11", "all", "10", "85", "1,3,5", "#E5E7EB", "6"]);
  for (const route of Object.values(pdfRoutes.nepaliPdfRoutes)) {
    const strings = [route.formPlaceholder, route.queryDefault, ...(route.extraFields ?? []).flatMap((f) => [f.label, f.placeholder, f.defaultValue])].filter(Boolean);
    for (const value of strings) {
      if (technical.has(value)) continue;
      assert.ok(fields.hindiFieldKeys.includes(value), `${route.slug}: missing Hindi field copy for ${JSON.stringify(value)}`);
    }
  }
});
