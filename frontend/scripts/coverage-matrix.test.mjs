import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const matrixPath = path.resolve(new URL("../../docs/i18n/TOOL_LANGUAGE_COVERAGE_MATRIX.json", import.meta.url).pathname);
const report = JSON.parse(fs.readFileSync(matrixPath, "utf8"));

test("tool-language matrix accounts for every configured locale and unique tool", () => {
  assert.equal(report.counts.locales, 12);
  assert.equal(report.counts.pdfTools, 49);
  assert.equal(report.counts.catalogUtilities, 120);
  assert.equal(report.counts.tools, 169);
  assert.equal(report.counts.matrixRows, 12 * 169);
  assert.equal(report.rows.length, 2028);
  assert.equal(report.counts.localizedNepaliTools, 119, "49 Nepali PDF routes plus 70 Nepali catalog routes");
  assert.equal(report.counts.indexableNepaliTools, 6);
  assert.ok(!report.tools.some((tool) => ["ai-resume-writer", "ai-cover-letter-generator", "ai-humanizer", "market-ai"].includes(tool.slug)), "retired AI tools must not appear in the language matrix");
  assert.equal(new Set(report.tools.map((tool) => tool.slug)).size, 169);
  for (const slug of ["nepal-phone-validator", "gold-tola-gram-converter", "email-extractor", "url-extractor", "phone-number-extractor", "number-extractor", "hashtag-extractor", "remove-duplicate-words", "find-replace-text", "palindrome-checker", "acronym-generator"]) {
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
