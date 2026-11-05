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
const catalogSource = fs.readFileSync(path.join(frontendRoot, "components", "toolCatalog.ts"), "utf8");
const guideSlugs = [...guideSource.matchAll(/"slug"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
const adviceBlock = adviceSource.match(/const toolAdvice[\s\S]*?=\s*\{([\s\S]*?)\n\s*\};/);
const adviceSlugs = adviceBlock ? [...adviceBlock[1].matchAll(/"([^"]+)"\s*:\s*\{\s*example\s*:/g)].map((m) => m[1]) : [];
const calculatorSlugs = [...catalogSource.matchAll(/\{slug:\s*"([^"]+)",name:\s*"([^"]+)"/g)].filter((m) => /calculator/i.test(m[2])).map((m) => m[1]);
const required = { tools: adviceSlugs, guides: guideSlugs, calculators: calculatorSlugs, faqs: adviceSlugs };
const validEntry = (namespace, entry) => {
  if (!entry || typeof entry !== "object") return false;
  const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
  if (namespace === "tools") return ["example", "accuracy", "workflow", "mistakes"].every((k) => nonempty(entry[k]));
  if (namespace === "guides") return nonempty(entry.purpose) && nonempty(entry.caution) && Array.isArray(entry.steps) && entry.steps.length >= 3 && entry.steps.every(nonempty);
  if (namespace === "calculators") return nonempty(entry.formula) && Array.isArray(entry.inputs) && entry.inputs.length > 0 && Array.isArray(entry.outputs) && entry.outputs.length > 0 && nonempty(entry.assumptions);
  if (namespace === "faqs") return Array.isArray(entry) && entry.length >= 3 && entry.every((item) => nonempty(item.q) && nonempty(item.a));
  return false;
};
let blockers = 0;
// Nepali currently publishes only its migrated homepage; it has no localized tool routes yet.
for (const locale of config.locales.filter((l) => l !== "en" && l !== "ne")) {
  const published = config.isPublished(locale);
  let missing = 0;
  for (const [namespace, slugs] of Object.entries(required)) {
    const file = path.join(root, locale, namespace + ".json");
    if (!fs.existsSync(file)) { missing += slugs.length; continue; }
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const entries = data.entries ?? {};
    for (const slug of slugs) {
      const entry = entries[slug];
      if (!validEntry(namespace, entry)) missing++;
    }
  }
  const label = `${locale}: ${missing} missing or invalid entries across tools, guides, calculators and FAQs`;
  if (missing) {
    console.log(`  ${published ? "FAIL" : "WARN"} ${label}`);
    if (published) blockers++;
  } else console.log(`  PASS ${label}`);
}
console.log(`English source inventory: ${adviceSlugs.length} tool-advice entries; ${guideSlugs.length} tool guides; ${calculatorSlugs.length} calculator interfaces.`);
if (blockers) process.exit(1);
