import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const matrixPath = path.resolve(new URL("../../docs/i18n/TOOL_LANGUAGE_COVERAGE_MATRIX.json", import.meta.url).pathname);
const report = JSON.parse(fs.readFileSync(matrixPath, "utf8"));

test("tool-language matrix accounts for every configured locale and unique tool", () => {
  assert.equal(report.counts.locales, 12);
  assert.equal(report.counts.pdfTools, 49);
  assert.equal(report.counts.catalogUtilities, 124);
  assert.equal(report.counts.tools, 173);
  assert.equal(report.counts.matrixRows, 12 * 173);
  assert.equal(report.rows.length, 2076);
  assert.equal(report.counts.localizedNepaliTools, 70);
  assert.equal(report.counts.indexableNepaliTools, 6);
  assert.equal(new Set(report.tools.map((tool) => tool.slug)).size, 173);
  for (const slug of ["nepal-phone-validator", "gold-tola-gram-converter"]) {
    const row = report.rows.find((item) => item.locale === "ne" && item.slug === slug);
    assert.equal(row?.functionalTest, "targeted-unit-tests", `${slug} should record only its executed targeted tests`);
  }
  assert.ok(report.rows.filter((row) => row.locale === "ne" && row.interface !== "not-implemented").every((row) => row.interface === "nepali-interface-present"), "Interface presence must not imply native-language review");
  const nepaliGuides = report.rows.filter((row) => row.locale === "ne" && row.content !== "not-verified");
  assert.equal(nepaliGuides.length, 49);
  assert.ok(nepaliGuides.every((row) => row.content === "nepali-guide-present"), "Guide presence must not imply native-language review");
});

test("tool-language matrix keeps unpublished locales and unverified workflows out of indexing", () => {
  for (const locale of ["hi", "bn", "ur", "ar", "es", "fr", "de", "pt", "zh", "ja"]) {
    const rows = report.rows.filter((row) => row.locale === locale);
    assert.ok(rows.every((row) => row.published === false && row.indexing === "excluded"), `${locale} must remain unpublished`);
  }
  assert.ok(!report.tools.some((tool) => tool.slug === "ocr-pdf"), "OCR must remain outside the available-tool inventory");
});
