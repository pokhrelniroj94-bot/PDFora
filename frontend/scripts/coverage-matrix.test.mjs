import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const matrixPath = path.resolve(new URL("../../docs/i18n/TOOL_LANGUAGE_COVERAGE_MATRIX.json", import.meta.url).pathname);
const report = JSON.parse(fs.readFileSync(matrixPath, "utf8"));

test("tool-language matrix accounts for every configured locale and unique tool", () => {
  assert.equal(report.counts.locales, 12);
  assert.equal(report.counts.pdfTools, 49);
  assert.equal(report.counts.catalogUtilities, 125);
  assert.equal(report.counts.tools, 174);
  assert.equal(report.counts.matrixRows, 12 * 174);
  assert.equal(report.rows.length, 2088);
  assert.equal(report.counts.localizedNepaliTools, 169, "49 Nepali PDF routes plus 120 localized catalog routes; five restored legacy utilities remain English-only");
  assert.equal(report.counts.indexableNepaliTools, 6);
  assert.equal(report.rows.filter((row) => row.locale === "ne" && row.functionalTest === "targeted-unit-tests").length, 44);
  for (const slug of ["email-signature-generator","timezone-meeting-planner","image-dpi-calculator","video-bitrate-calculator","markdown-table-generator"]) {
    const englishRow = report.rows.find((row) => row.locale === "en" && row.slug === slug);
    const nepaliRow = report.rows.find((row) => row.locale === "ne" && row.slug === slug);
    assert.equal(englishRow?.interface, "source-language", `${slug} must remain available in English`);
    assert.equal(nepaliRow?.interface, "not-implemented", `${slug} must not be falsely reported as translated`);
    assert.equal(nepaliRow?.published, false);
    assert.equal(nepaliRow?.indexing, "excluded");
  }
  for (const slug of ["xml-formatter-validator", "notes-to-pdf", "html-tag-stripper", "savings-goal-calculator", "nepal-share-calculator"]) {
    const row = report.rows.find((item) => item.locale === "ne" && item.slug === slug);
    assert.equal(row?.interface, "nepali-interface-present", `${slug} should have a dedicated Nepali interface`);
    assert.equal(row?.indexing, "excluded", `${slug} must remain noindex pending review`);
    assert.equal(row?.humanReview, "native-review-not-assessed");
  }
  for (const slug of ["currency-converter","image-compressor","image-format-converter","password-generator","uuid-generator","regex-tester","jwt-decoder","color-picker-palette","color-contrast-checker","css-minifier","meta-title-checker","meta-description-checker","keyword-density-checker","robots-txt-generator","sitemap-generator","open-graph-preview","preeti-unicode-converter","nepali-unicode-typing"]) {
    const row = report.rows.find((item) => item.locale === "ne" && item.slug === slug);
    assert.equal(row?.interface, "nepali-interface-present", `${slug} should have a dedicated Nepali interface`);
    assert.equal(row?.indexing, "excluded", `${slug} must remain noindex pending QA and review`);
    assert.equal(row?.humanReview, "native-review-not-assessed");
  }

  const englishCatalog = fs.readFileSync(path.resolve(new URL("../components/toolCatalog.ts", import.meta.url).pathname), "utf8");
  const englishWorkspace = fs.readFileSync(path.resolve(new URL("../components/AllTools.tsx", import.meta.url).pathname), "utf8");
  const browserOnlyWorkspacePath = path.resolve(new URL("../components/BrowserOnlyGrowthTools.tsx", import.meta.url).pathname);
  for (const slug of ["email-signature-generator","timezone-meeting-planner","image-dpi-calculator","video-bitrate-calculator","markdown-table-generator"]) {
    assert.ok(englishCatalog.includes(`slug:"${slug}"`), `${slug} must remain in the English catalog`);
  }
  assert.ok(englishWorkspace.includes("BrowserOnlyGrowthTools"), "Restored browser-only utilities must be routed to their workspace");
  assert.equal(fs.existsSync(browserOnlyWorkspacePath), true, "Restored browser-only workspace source must exist");

  const localizedToolPage = fs.readFileSync(path.resolve(new URL("../app/[locale]/tools/[slug]/page.tsx", import.meta.url).pathname), "utf8");
  for (const slug of ["currency-converter","image-compressor","image-format-converter","password-generator","uuid-generator","regex-tester","jwt-decoder","color-picker-palette","color-contrast-checker","css-minifier","meta-title-checker","meta-description-checker","keyword-density-checker","robots-txt-generator","sitemap-generator","open-graph-preview","preeti-unicode-converter","nepali-unicode-typing"]) {
    const metadataKeys = localizedToolPage.match(new RegExp(`"${slug}"\\s*:`, "g")) ?? [];
    assert.ok(metadataKeys.length >= 2, `${slug} must have both a Nepali title and description`);
    assert.ok(localizedToolPage.includes(`"${slug}"`), `${slug} must be included in localized routing`);
  }
  assert.ok(localizedToolPage.includes('NepaliRemainingToolsWorkspace slug={toolSlug}'));
  assert.ok(localizedToolPage.includes('<NepaliTypingTool locale="ne" />'));
  assert.equal(new Set(report.tools.map((tool) => tool.slug)).size, 169);
  for (const slug of ["nepal-phone-validator", "gold-tola-gram-converter", "email-extractor", "url-extractor", "phone-number-extractor", "number-extractor", "hashtag-extractor", "remove-duplicate-words", "find-replace-text", "palindrome-checker", "acronym-generator", "regex-tester", "jwt-decoder", "css-minifier", "color-contrast-checker", "keyword-density-checker", "robots-txt-generator", "sitemap-generator"]) {
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
