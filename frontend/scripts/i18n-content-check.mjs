// Checks slug-level localization coverage for preview locales.
// Empty or fallback-only content is reported as incomplete; published locales fail the gate.
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, frontendRoot, loadI18n } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const { config } = await loadI18n();
const root = path.join(frontendRoot, "lib", "i18n", "messages");
const guideSource = fs.readFileSync(path.join(frontendRoot, "lib", "tool-guides.ts"), "utf8");
const adviceSource = fs.readFileSync(path.join(frontendRoot, "components", "CatalogToolSEOContent.tsx"), "utf8");
const guideSlugs = [...guideSource.matchAll(/"slug"\\s*:\\s*"([^"]+)"/g)].map((m) => m[1]);
const adviceBlock = adviceSource.match(/const toolAdvice[\\s\\S]*?=\\s*\\{([\\s\\S]*?)\\n\\s*\\};/);
const adviceSlugs = adviceBlock ? [...adviceBlock[1].matchAll(/"([^"]+)"\\s*:\\s*\\{\\s*example\\s*:/g)].map((m) => m[1]) : [];
const required = { tools: adviceSlugs, guides: guideSlugs, faqs: guideSlugs };
let blockers = 0;
for (const locale of config.locales.filter((l) => l !== "en")) {
  const published = config.isPublished(locale);
  let missing = 0;
  for (const [namespace, slugs] of Object.entries(required)) {
    const file = path.join(root, locale, namespace + ".json");
    if (!fs.existsSync(file)) { missing += slugs.length; continue; }
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const entries = data.entries ?? {};
    for (const slug of slugs) {
      const entry = entries[slug];
      if (!entry || typeof entry !== "object" || !Object.values(entry).some((v) => typeof v === "string" && v.trim())) missing++;
    }
  }
  const calculatorFile = path.join(root, locale, "calculators.json");
  const calculatorData = fs.existsSync(calculatorFile) ? JSON.parse(fs.readFileSync(calculatorFile, "utf8")) : {};
  const calculatorEntries = calculatorData.entries ?? {};
  const calculatorCount = Object.keys(calculatorEntries).length;
  const label = `${locale}: ${missing} missing tool/guide/FAQ entries; ${calculatorCount} calculator definitions`;
  if (missing || calculatorCount === 0) {
    console.log(`  ${published ? "FAIL" : "WARN"} ${label}`);
    if (published) blockers++;
  } else console.log(`  PASS ${label}`);
}
console.log(`English source inventory: ${adviceSlugs.length} tool-advice entries; ${guideSlugs.length} tool guides.`);
if (blockers) process.exit(1);
