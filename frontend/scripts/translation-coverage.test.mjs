import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { frontendRoot, loadI18n } from "./lib/load-i18n.mjs";

const repoRoot = path.resolve(frontendRoot, "..");
const reportPath = path.join(repoRoot, "docs", "i18n", "TRANSLATION_COVERAGE.json");

// Generate the report from the current checkout before asserting its measured values.
execFileSync(process.execPath, [path.join(frontendRoot, "scripts", "translation-coverage.mjs")], {
  cwd: frontendRoot,
  stdio: "inherit",
});

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

test("translation coverage report is conservative and tied to the current commit", () => {
  assert.match(report.sourceCommit, /^[0-9a-f]{40}$/i, "report must identify the current Git commit");
  assert.equal(report.locales.en.status, "Source language; translation review not assessed");
  assert.equal(report.locales.en.routeCoveragePercent, null, "source language must not be misreported as translated/reviewed");
  assert.equal(report.locales.ne.status, "Partially translated");
  assert.equal(report.inventory.publishedNepaliFinancialRoutes, 7);
  assert.equal(report.inventory.publishedNepaliCatalogToolRoutes, 123);
  assert.equal(report.inventory.publishedNepaliPublicInfoRoutes, 2);
  assert.equal(report.locales.ne.translatedRoutes, 207, "Nepali homepage, 49 PDF routes, 123 catalog tools, market dashboard, Resume Builder, blog index, 27 articles, and four static pages");
  assert.equal(report.locales.ne.routeCoveragePercent, null, "dynamic route equivalents must not be divided by source-file counts");
  assert.equal(report.locales.ne.pdfGuideCoverage.translated, 49);
  assert.equal(report.locales.ne.pdfGuideCoverage.total, 49);
  assert.equal(report.locales.ne.blogCoverage.translated, 27, "All 27 curated editorial articles have Nepali translations");
  assert.equal(report.locales.ne.blogCoverage.total, 27);
  assert.equal(report.locales.ne.blogCoverage.percent, 100);
  assert.ok(report.locales.ne.blogCoverage.percent > 0);

  for (const locale of ["hi", "bn", "ur", "ar", "es", "fr", "de", "pt", "zh", "ja"]) {
    assert.equal(report.locales[locale].published, false, `${locale} must remain unpublished`);
    assert.equal(report.locales[locale].translatedRoutes, 0);
    assert.equal(report.locales[locale].routeCoveragePercent, 0);
  }

  assert.match(report.methodology.routeCoverage, /reported as counts only/i);
  assert.match(report.methodology.review, /cannot certify/i);
});

const { routing } = await loadI18n();

test("untranslated destinations preserve intent through the locale fallback route", () => {
  assert.equal(routing.localizedOrFallbackPath("/merge-pdf", "ne"), "/ne/merge-pdf");
  assert.equal(routing.localizedOrFallbackPath("/about", "ne"), "/ne/about");
  assert.equal(routing.localizedOrFallbackPath("/contact?source=footer", "ne"), "/ne/contact");
  assert.equal(routing.localizedOrFallbackPath("/about", "en"), "/about");
  assert.equal(routing.localizedOrFallbackPath("/about", "ar"), "/ar?from=%2Fabout");
});
