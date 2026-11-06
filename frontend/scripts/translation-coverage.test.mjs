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
  assert.equal(report.locales.ne.translatedRoutes, 24, "Nepali homepage, six PDF routes, six utility routes, seven financial/calculator routes, three AI writing routes, and the market dashboard");
  assert.equal(report.locales.ne.pdfGuideCoverage.translated, 49);
  assert.equal(report.locales.ne.pdfGuideCoverage.total, 49);
  assert.equal(report.locales.ne.blogCoverage.translated, 0, "English blog records are not Nepali translations");
  assert.equal(report.locales.ne.blogCoverage.percent, 0);

  for (const locale of ["hi", "bn", "ur", "ar", "es", "fr", "de", "pt", "zh", "ja"]) {
    assert.equal(report.locales[locale].published, false, `${locale} must remain unpublished`);
    assert.equal(report.locales[locale].translatedRoutes, 0);
    assert.equal(report.locales[locale].routeCoveragePercent, 0);
  }

  assert.match(report.methodology.routeCoverage, /source-file proxy/i);
  assert.match(report.methodology.review, /cannot certify/i);
});

const { routing } = await loadI18n();

test("untranslated destinations preserve intent through the locale fallback route", () => {
  assert.equal(routing.localizedOrFallbackPath("/merge-pdf", "ne"), "/ne/merge-pdf");
  assert.equal(routing.localizedOrFallbackPath("/about", "ne"), "/ne?from=%2Fabout");
  assert.equal(routing.localizedOrFallbackPath("/contact?source=footer", "ne"), "/ne?from=%2Fcontact");
  assert.equal(routing.localizedOrFallbackPath("/about", "en"), "/about");
  assert.equal(routing.localizedOrFallbackPath("/about", "ar"), "/ar?from=%2Fabout");
});
