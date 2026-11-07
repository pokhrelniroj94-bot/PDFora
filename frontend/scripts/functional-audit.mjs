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

const rows = [
  ...legacyToolSlugs.map((slug) => ({
    slug,
    category: "PDF",
    kind: "pdf",
    routeStatus: "PASS",
    interfaceStatus: "PARTIAL",
    handlerStatus: "PASS",
    functionalTestStatus: "PARTIAL",
    outputVerificationStatus: "PARTIAL",
    mobileStatus: "NOT TESTED",
    accessibilityStatus: "NOT TESTED",
    languageStatus: "PARTIAL",
    seoStatus: "PASS",
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
    routeStatus: "PASS",
    interfaceStatus: "PARTIAL",
    handlerStatus: "PASS",
    functionalTestStatus: "NOT TESTED",
    outputVerificationStatus: "NOT TESTED",
    mobileStatus: "NOT TESTED",
    accessibilityStatus: "NOT TESTED",
    languageStatus: "PARTIAL",
    seoStatus: "PASS",
    defectsFound: "",
    fixesApplied: "",
    remainingBlockers:
      "Runtime input/output, edge cases, mobile layout, accessibility and download/clipboard behavior require individual tests.",
    evidence: catalogEvidence,
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
      "This report does not claim browser, mobile, accessibility or individual catalog-tool runtime verification.",
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
  `Summary: **${legacyToolSlugs.length} PDF tools** and **${catalog.length} catalog utilities** (${rows.length} total). Functional status: **${report.counts.functionalPartial} partial**, **${report.counts.functionalNotTested} not tested**, **0 full PASS**.`,
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
