import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ensureTypeStripping, frontendRoot, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const mods = await loadToolAdapter();
const { toolCatalog } = mods.toolCatalog;
const { legacyToolSlugs } = mods["legacy-tool-slugs"];
const reserved = mods.adapter.RESERVED_CATALOG_SLUGS;
const catalog = toolCatalog.filter((entry) => !reserved.has(entry.slug));
const commit = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: path.join(frontendRoot, ".."),
  encoding: "utf8",
}).trim();

const pdfEvidence =
  "backend/tests/test_tool_api.py::test_all_available_pdf_tools_process_a_realistic_pdf";
const workerEvidence = "frontend/__tests__/pdfWorker.test.ts";
const catalogEvidence = "frontend/scripts/verify-tool-catalog.mjs";
const testedCatalog = new Set([
  "loan-emi-calculator",
  "compound-interest-sip-calculator",
  "discount-percentage-calculator",
  "percentage-change-calculator",
  "average-calculator",
  "ratio-simplifier",
  "fraction-calculator",
  "unit-converter",
  "bmi-calculator",
  "bmr-calculator",
  "business-days-calculator",
  "json-to-yaml",
  "random-number-generator",
  "dice-roller",
  "password-generator",
  "csv-to-json",
  "nepali-vat-calculator",
  "nepali-number-converter",
  "gold-tola-gram-converter",
  "nepal-share-calculator",
  "lorem-ipsum-generator",
]);
const inputTestedCatalog = new Set(["json-to-yaml", "random-number-generator", "dice-roller", "password-generator", "csv-to-json", "nepali-vat-calculator", "nepali-number-converter", "gold-tola-gram-converter", "nepal-share-calculator"]);
const uiRegressionCatalog = new Set([...inputTestedCatalog, "lorem-ipsum-generator"]);
const browserReportPath = path.join(frontendRoot, "..", "docs", "qa", "BROWSER_E2E_173_REPORT.json");
const browserReport = fs.existsSync(browserReportPath)
  ? JSON.parse(fs.readFileSync(browserReportPath, "utf8"))
  : null;
const browserResults = new Map((browserReport?.results ?? []).map((row) => [row.slug, row]));

// Catalog route/handler/SEO statuses are PARTIAL: current evidence proves registry,
// adapter and metadata contracts only, not an HTTP-rendered page or complete SEO validation.
// The PDF handler PASS is backed by the real-PDF backend sweep; its route and SEO remain PARTIAL.

const rows = [
  ...legacyToolSlugs.map((slug) => ({
    slug,
    category: "PDF",
    kind: "pdf",
    routeStatus: browserResults.get(slug)?.status === "PASS" ? "PASS" : "PARTIAL",
    interfaceStatus: browserResults.get(slug)?.status === "PASS" ? "PASS" : "PARTIAL",
    handlerStatus: browserResults.get(slug)?.status === "PASS" && (browserResults.get(slug)?.action || browserResults.get(slug)?.outputVerified) ? "PASS" : "PARTIAL",
    functionalTestStatus: browserResults.get(slug)?.status === "PASS" && (browserResults.get(slug)?.action || browserResults.get(slug)?.outputVerified) ? "PASS" : "PARTIAL",
    outputVerificationStatus: browserResults.get(slug)?.outputVerified ? "PASS" : "PARTIAL",
    mobileStatus: "NOT TESTED",
    accessibilityStatus: "NOT TESTED",
    languageStatus: "PARTIAL",
    seoStatus: "PARTIAL",
    defectsFound: slug === "reorder-pdf" || slug === "delete-pages"
      ? "Shared browser worker previously accepted unsafe page selections."
      : "",
    fixesApplied: slug === "reorder-pdf" || slug === "delete-pages"
      ? "Worker now rejects incomplete, duplicate, malformed reorder input and deleting every page."
      : "",
    remainingBlockers:
      "Browser workflow, mobile layout, accessibility and download integrity require browser evidence.",
    evidence: `${pdfEvidence}; ${workerEvidence}`,
  })),
  ...catalog.map((entry) => ({
    slug: entry.slug,
    category: entry.category,
    kind: "catalog",
    routeStatus: browserResults.get(entry.slug)?.status === "PASS" ? "PASS" : "PARTIAL",
    interfaceStatus: browserResults.get(entry.slug)?.status === "PASS" && browserResults.get(entry.slug)?.inputCount > 0 ? "PASS" : "PARTIAL",
    handlerStatus: browserResults.get(entry.slug)?.status === "PASS" && (browserResults.get(entry.slug)?.action || browserResults.get(entry.slug)?.outputVerified) && !browserResults.get(entry.slug)?.checks?.some((check) => check.includes("execution intentionally skipped")) ? "PASS" : "PARTIAL",
    functionalTestStatus: browserResults.get(entry.slug)?.status === "PASS" && (browserResults.get(entry.slug)?.action || browserResults.get(entry.slug)?.outputVerified) && !browserResults.get(entry.slug)?.checks?.some((check) => check.includes("execution intentionally skipped"))
      ? "PASS"
      : testedCatalog.has(entry.slug) ? "PARTIAL" : "NOT TESTED",
    outputVerificationStatus: browserResults.get(entry.slug)?.outputVerified ? "PASS" : testedCatalog.has(entry.slug) ? "PARTIAL" : "NOT TESTED",
    mobileStatus: "NOT TESTED",
    accessibilityStatus: "NOT TESTED",
    languageStatus: "PARTIAL",
    seoStatus: "PARTIAL",
    defectsFound: entry.slug === "unit-converter"
      ? "Negative length, weight and volume values were accepted; temperature could be mixed with unrelated unit families."
      : uiRegressionCatalog.has(entry.slug)
        ? "Blank numeric fields were silently coerced to zero or accepted as valid; YAML escaping and random modulo bias needed correction."
        : "",
    fixesApplied: entry.slug === "unit-converter"
      ? "Rejects negative physical quantities and incompatible temperature/physical unit conversions; allows negative temperatures."
      : uiRegressionCatalog.has(entry.slug)
        ? "Added required-number validation, complete Nepali number-word conversion through crore, Nepal form blank-field checks, JSON-safe YAML serialization, strict CSV parsing, and rejection-sampled random integers with unit/regression tests."
        : "",
    remainingBlockers: testedCatalog.has(entry.slug)
      ? "Browser route, mobile layout and accessibility evidence remain unverified."
      : "Runtime input/output, edge cases, mobile layout, accessibility and download/clipboard behavior require individual tests.",
    evidence: inputTestedCatalog.has(entry.slug)
      ? "frontend/__tests__/catalogInputs.test.ts; frontend/__tests__/nepali-number-words.test.ts; frontend/scripts/tool-ui-regression.test.mjs; frontend/lib/catalog-inputs.ts; frontend/lib/nepali-number-words.ts"
      : uiRegressionCatalog.has(entry.slug)
        ? "frontend/scripts/tool-ui-regression.test.mjs; frontend/components/AllTools.tsx"
        : testedCatalog.has(entry.slug)
          ? "frontend/__tests__/catalogCalculations.test.ts; frontend/lib/catalog-calculations.ts"
          : catalogEvidence,
  })),
];

if (rows.length !== 173) throw new Error(`Expected 173 rows, generated ${rows.length}`);
const report = {
  generatedAt: new Date().toISOString(),
  sourceCommit: commit,
  methodology: {
    sourceOfTruth: "legacy-tool-slugs.ts plus toolCatalog.ts, excluding the pdf-tools collection entry",
    statusRule: "Only executed tests produce PASS; source inspection produces PARTIAL or NOT TESTED.",
    limitations:
      browserReport ? "Browser route and tool-action checks are included where the per-tool report records them. Mobile, accessibility, visual comparison and independent parsing of downloaded bytes remain separate." : "No browser E2E report is present. Mobile, accessibility and individual catalog-tool runtime verification are not claimed.",
  },
  evidence: {
    backendPdfSweep: pdfEvidence,
    frontendPdfWorker: workerEvidence,
    catalogStaticVerification: catalogEvidence,
    backendTestCommand: "python -m pytest -q backend/tests",
    frontendTestCommand: "npm test -- --runInBand",
  },
  counts: {
    tools: rows.length,
    pdfTools: legacyToolSlugs.length,
    catalogUtilities: catalog.length,
    functionalPass: rows.filter((row) => row.functionalTestStatus === "PASS").length,
    functionalPartial: rows.filter((row) => row.functionalTestStatus === "PARTIAL").length,
    functionalNotTested: rows.filter((row) => row.functionalTestStatus === "NOT TESTED").length,
    browserE2ePass: browserReport?.counts?.pass ?? 0,
    browserE2eFail: browserReport?.counts?.fail ?? 0,
  },
  tools: rows,
};

const docsDir = path.join(frontendRoot, "..", "docs", "qa");
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(
  path.join(docsDir, "FUNCTIONAL_TOOL_AUDIT.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

const headers = [
  "Tool",
  "Category",
  "Route",
  "Interface",
  "Handler",
  "Functional",
  "Output",
  "Mobile",
  "A11y",
  "Language",
  "SEO",
  "Defects / blockers",
];
const escape = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
const lines = [
  "# Functional Tool Audit",
  "",
  `Generated from commit \`${commit}\` on ${report.generatedAt}.`,
  "",
  "This report records executed evidence only. It does not treat route existence or static handler references as proof that a tool works.",
  "",
  `Summary: **${legacyToolSlugs.length} PDF tools** and **${catalog.length} catalog utilities** (${rows.length} total). Functional status: **${report.counts.functionalPass} PASS**, **${report.counts.functionalPartial} partial**, **${report.counts.functionalNotTested} not tested**. Browser sweep: **${report.counts.browserE2ePass} passed**, **${report.counts.browserE2eFail} failed**.`,
  "",
  `Evidence: backend PDF sweep \`${pdfEvidence}\`; frontend worker tests \`${workerEvidence}\`; catalog static verification \`${catalogEvidence}\`.`,
  "",
  `| ${headers.join(" | ")} |`,
  `|${headers.map(() => "---").join("|")}|`,
  ...rows.map((row) =>
    `| ${[
      row.slug,
      row.category,
      row.routeStatus,
      row.interfaceStatus,
      row.handlerStatus,
      row.functionalTestStatus,
      row.outputVerificationStatus,
      row.mobileStatus,
      row.accessibilityStatus,
      row.languageStatus,
      row.seoStatus,
      row.defectsFound || row.remainingBlockers,
    ].map(escape).join(" | ")} |`,
  ),
  "",
];
fs.writeFileSync(path.join(docsDir, "FUNCTIONAL_TOOL_AUDIT.md"), `${lines.join("\n")}\n`);
console.log(`Generated functional audit for ${rows.length} tools.`);
