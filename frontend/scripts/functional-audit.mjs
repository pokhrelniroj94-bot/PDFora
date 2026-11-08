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
const commit = process.env.GITHUB_SHA || execFileSync("git", ["rev-parse", "HEAD"], {
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
const mobileStatusFor = (slug) => {
  const mobile = browserResults.get(slug)?.mobileViewport;
  if (!mobile) return "NOT TESTED";
  return mobile.viewport?.width <= 400 &&
    mobile.documentWidth <= mobile.viewportWidth + 2 &&
    mobile.mainWidth <= mobile.mainClientWidth + 2 ? "PASS" : "FAIL";
};
const keyboardStatusFor = (slug) =>
  browserResults.get(slug)?.keyboardNavigation?.afterTab?.advanced === true ? "PASS" :
    browserResults.get(slug)?.keyboardNavigation ? "FAIL" : "NOT TESTED";
const accessibilityStatusFor = (slug) =>
  browserResults.get(slug)?.accessibility?.status ?? "NOT TESTED";
const blockersFor = (slug, kind) => {
  const result = browserResults.get(slug);
  const blockers = [];
  if (!result) blockers.push("Browser E2E evidence is missing");
  else if (result.status === "FAIL") blockers.push("Browser E2E failure: " + (result.errors ?? []).join("; "));
  if (mobileStatusFor(slug) !== "PASS") blockers.push("390px mobile viewport check is not passing");
  if (keyboardStatusFor(slug) !== "PASS") blockers.push("Keyboard Tab progression check is not passing");
  if (accessibilityStatusFor(slug) !== "PASS") blockers.push("Basic document/control accessibility review is incomplete");
  if (kind === "pdf" && !result?.outputVerified) blockers.push("Downloaded PDF/archive bytes and content were not independently validated");
  blockers.push("Screen-reader, contrast and manual visual review remain separate WCAG checks");
  return blockers.join("; ");
};

// Catalog route/handler/SEO statuses are PARTIAL: current evidence proves registry,
// adapter and metadata contracts only, not an HTTP-rendered page or complete SEO validation.
// The PDF handler PASS is backed by the real-PDF backend sweep; its route and SEO remain PARTIAL.

const functionalStatusFor = (slug, kind) => {
  const result = browserResults.get(slug);
  const skipped = result?.checks?.some((check) => check.includes("execution intentionally skipped"));
  // Explicitly skipped AI execution is NOT TESTED, not a partial functional test.
  if (skipped) return "NOT TESTED";
  if (result?.status === "FAIL") return "FAIL";
  if (result?.status === "PASS" && (result.action || result.outputVerified)) return "PASS";
  if (result?.status === "PARTIAL") return "PARTIAL";
  if (kind === "pdf") return "PARTIAL"; // real-PDF API sweep exists, but browser evidence is absent
  return testedCatalog.has(slug) ? "PARTIAL" : "NOT TESTED";
};

const rows = [
  ...legacyToolSlugs.map((slug) => ({
    slug,
    category: "PDF",
    kind: "pdf",
    routeStatus: browserResults.get(slug)?.status === "PASS" ? "PASS" : browserResults.get(slug)?.status === "FAIL" ? "FAIL" : "PARTIAL",
    interfaceStatus: browserResults.get(slug)?.status === "PASS" && browserResults.get(slug)?.fileInputCount > 0 ? "PASS" : browserResults.get(slug)?.status === "FAIL" ? "FAIL" : "PARTIAL",
    handlerStatus: functionalStatusFor(slug, "pdf"),
    functionalTestStatus: functionalStatusFor(slug, "pdf"),
    outputVerificationStatus: browserResults.get(slug)?.outputVerified ? "PASS" : browserResults.get(slug)?.status === "FAIL" ? "FAIL" : "PARTIAL",
    mobileStatus: mobileStatusFor(slug),
    keyboardStatus: keyboardStatusFor(slug),
    accessibilityStatus: accessibilityStatusFor(slug),
    languageStatus: "PARTIAL",
    seoStatus: "PARTIAL",
    defectsFound: [slug === "reorder-pdf" || slug === "delete-pages" ? "Shared browser worker previously accepted unsafe page selections." : "", ...(browserResults.get(slug)?.errors ?? [])].filter(Boolean).join("; "),
    fixesApplied: slug === "reorder-pdf" || slug === "delete-pages"
      ? "Worker now rejects incomplete, duplicate, malformed reorder input and deleting every page."
      : "",
    remainingBlockers: blockersFor(slug, "pdf"),
    evidence: `${pdfEvidence}; ${workerEvidence}${browserReport ? "; docs/qa/BROWSER_E2E_173_REPORT.json" : ""}`,
  })),
  ...catalog.map((entry) => ({
    slug: entry.slug,
    category: entry.category,
    kind: "catalog",
    routeStatus: browserResults.get(entry.slug)?.status === "PASS" ? "PASS" : browserResults.get(entry.slug)?.status === "FAIL" ? "FAIL" : "PARTIAL",
    interfaceStatus: browserResults.get(entry.slug)?.status === "PASS" && browserResults.get(entry.slug)?.inputCount > 0 ? "PASS" : browserResults.get(entry.slug)?.status === "FAIL" ? "FAIL" : "PARTIAL",
    handlerStatus: functionalStatusFor(entry.slug, "catalog"),
    functionalTestStatus: functionalStatusFor(entry.slug, "catalog"),
    outputVerificationStatus: browserResults.get(entry.slug)?.outputVerified ? "PASS" : browserResults.get(entry.slug)?.status === "FAIL" ? "FAIL" : testedCatalog.has(entry.slug) ? "PARTIAL" : "NOT TESTED",
    mobileStatus: mobileStatusFor(entry.slug),
    keyboardStatus: keyboardStatusFor(entry.slug),
    accessibilityStatus: accessibilityStatusFor(entry.slug),
    languageStatus: "PARTIAL",
    seoStatus: "PARTIAL",
    defectsFound: [entry.slug === "nepal-electricity-bill-calculator" ? "A hard-coded tariff estimator could become inaccurate after the ERC 2083 tariff directive." : entry.slug === "unit-converter" ? "Negative length, weight and volume values were accepted; temperature could be mixed with unrelated unit families." : uiRegressionCatalog.has(entry.slug) ? "Blank numeric fields were silently coerced to zero or accepted as valid; YAML escaping and random modulo bias needed correction." : "", ...(browserResults.get(entry.slug)?.errors ?? [])].filter(Boolean).join("; "),
    fixesApplied: entry.slug === "nepal-electricity-bill-calculator"
      ? "Removed fixed-rate arithmetic and linked the tool to the live ERC calculator, the 2083 directive and NEA tariff information."
      : entry.slug === "unit-converter"
        ? "Rejects negative physical quantities and incompatible temperature/physical unit conversions; allows negative temperatures."
        : uiRegressionCatalog.has(entry.slug)
        ? "Added required-number validation, complete Nepali number-word conversion through crore, Nepal form blank-field checks, JSON-safe YAML serialization, strict CSV parsing, and rejection-sampled random integers with unit/regression tests."
        : "",
    remainingBlockers: entry.slug === "nepal-electricity-bill-calculator"
      ? "External ERC handoff and official calculator availability require separate live verification; PDFora intentionally does not estimate tariffs. " + blockersFor(entry.slug, "catalog")
      : blockersFor(entry.slug, "catalog"),
    evidence: `${entry.slug === "nepal-electricity-bill-calculator"
      ? "frontend/components/NepalLiveTools.tsx; frontend/scripts/nepali-nepal-tools.test.mjs; ERC official calculator and 2083 directive"
      : inputTestedCatalog.has(entry.slug)
        ? "frontend/__tests__/catalogInputs.test.ts; frontend/__tests__/nepali-number-words.test.ts; frontend/scripts/tool-ui-regression.test.mjs; frontend/lib/catalog-inputs.ts; frontend/lib/nepali-number-words.ts"
      : uiRegressionCatalog.has(entry.slug)
        ? "frontend/scripts/tool-ui-regression.test.mjs; frontend/components/AllTools.tsx"
        : testedCatalog.has(entry.slug)
          ? "frontend/__tests__/catalogCalculations.test.ts; frontend/lib/catalog-calculations.ts"
          : catalogEvidence}${browserResults.has(entry.slug) ? "; docs/qa/BROWSER_E2E_173_REPORT.json" : ""}`,
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
      browserReport ? "Browser route and tool-action checks are included where the per-tool report records them. 390px mobile viewport, Tab progression and basic document/control semantics are recorded per route. This does not replace visual comparison, WCAG contrast measurement, screen-reader testing or exhaustive input validation." : "No browser E2E report is present. Mobile, accessibility and individual catalog-tool runtime verification are not claimed.",

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
    functionalFail: rows.filter((row) => row.functionalTestStatus === "FAIL").length,
    functionalNotTested: rows.filter((row) => row.functionalTestStatus === "NOT TESTED").length,
    browserE2ePass: browserReport?.counts?.pass ?? 0,
    browserE2eFail: browserReport?.counts?.fail ?? 0,
    mobilePass: rows.filter((row) => row.mobileStatus === "PASS").length,
    mobileNotTested: rows.filter((row) => row.mobileStatus === "NOT TESTED").length,
    mobileFail: rows.filter((row) => row.mobileStatus === "FAIL").length,
    keyboardPass: rows.filter((row) => row.keyboardStatus === "PASS").length,
    keyboardFail: rows.filter((row) => row.keyboardStatus === "FAIL").length,
    keyboardNotTested: rows.filter((row) => row.keyboardStatus === "NOT TESTED").length,
    accessibilityPass: rows.filter((row) => row.accessibilityStatus === "PASS").length,
    accessibilityPartial: rows.filter((row) => row.accessibilityStatus === "PARTIAL").length,
    accessibilityNotTested: rows.filter((row) => row.accessibilityStatus === "NOT TESTED").length,
    browserReportSourceCommit: browserReport?.sourceCommit ?? "unknown",
    sourceCommitMatchesBrowserReport: Boolean(browserReport?.sourceCommit && browserReport.sourceCommit === commit),
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
  `Summary: **${legacyToolSlugs.length} PDF tools** and **${catalog.length} catalog utilities** (${rows.length} total). Functional status: **${report.counts.functionalPass} PASS**, **${report.counts.functionalPartial} partial**, **${report.counts.functionalFail} FAIL**, **${report.counts.functionalNotTested} not tested**. Browser sweep: **${browserReport?.counts?.pass ?? 0} PASS**, **${browserReport?.counts?.partial ?? 0} PARTIAL**, **${browserReport?.counts?.fail ?? 0} FAIL**.`,
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
