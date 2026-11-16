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
