// Dictionary check. Run: npm run i18n:check  (Node 22.6+, no install needed)
// - English (source) must parse, and every namespace file must be registered in lib/i18n/messages.ts.
// - Every non-English locale that has files is compared to English: missing keys, extra keys,
//   and placeholder ({name}) mismatches.
// - Exit code 1 if English is invalid, or if a PUBLISHED locale is incomplete or inconsistent.
//   Incomplete UNPUBLISHED locales are reported as work-in-progress, not failures.
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, frontendRoot, loadI18n } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const { config, translate } = await loadI18n();
const root = path.join(frontendRoot, "lib", "i18n", "messages");
const registered = fs.readFileSync(path.join(frontendRoot, "lib", "i18n", "messages.ts"), "utf8");

let hardFailures = 0;
const fail = (msg) => { console.log(`  FAIL ${msg}`); hardFailures++; };

function flatten(tree, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = [v];
    else if (translate.isPluralMessage(v)) out[key] = Object.values(v);
    else flatten(v, key, out);
  }
  return out;
}
const placeholders = (strings) => [...new Set(strings.flatMap((s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1])))].sort().join(",");
function readNs(locale, file) {
  try { return flatten(JSON.parse(fs.readFileSync(path.join(root, locale, file), "utf8"))); }
  catch (e) { return { __error: String(e.message) }; }
}

console.log("English (source)");
const enFiles = fs.existsSync(path.join(root, "en")) ? fs.readdirSync(path.join(root, "en")).filter((f) => f.endsWith(".json")) : [];
const en = {};
for (const f of enFiles) {
  const ns = f.replace(/\.json$/, "");
  en[ns] = readNs("en", f);
  if (en[ns].__error) fail(`en/${f}: invalid JSON (${en[ns].__error})`);
  else console.log(`  ok   ${ns}: ${Object.keys(en[ns]).length} keys`);
  if (!registered.includes(`messages/en/${ns}.json`)) fail(`en/${f} is not registered in lib/i18n/messages.ts`);
}

for (const locale of config.locales.filter((l) => l !== "en")) {
  const dir = path.join(root, locale);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".json")) : [];
  const published = config.isPublished(locale);
  // A published locale may currently ship only its localized homepage shell.
  // Tool/guide/calculator/FAQ namespaces have a separate slug-level release gate.
  const requiredNamespaces = published && !config.isToolContentPublished(locale)
    ? ["common", "accessibility", "seo"]
    : Object.keys(en);
  const problems = [];
  for (const ns of requiredNamespaces) {
    if (!files.includes(`${ns}.json`)) { problems.push(`${ns}: file missing`); continue; }
    const tr = readNs(locale, `${ns}.json`);
    if (tr.__error) { problems.push(`${ns}: invalid JSON`); continue; }
    for (const key of Object.keys(en[ns])) {
      if (!(key in tr)) problems.push(`${ns}.${key}: missing`);
      else if (placeholders(tr[key]) !== placeholders(en[ns][key])) problems.push(`${ns}.${key}: placeholders differ from English`);
      else if (tr[key].some((s) => !s.trim())) problems.push(`${ns}.${key}: empty`);
    }
    for (const key of Object.keys(tr)) if (!(key in en[ns])) problems.push(`${ns}.${key}: not in English source`);
  }
  const label = `${locale} (${published ? "PUBLISHED" : "unpublished"}, ${files.length}/${enFiles.length} namespaces)`;
  if (!problems.length && files.length === enFiles.length) console.log(`${label}\n  ok   complete`);
  else if (published) { console.log(label); problems.forEach((p) => fail(p)); }
  else console.log(`${label}\n  work in progress: ${problems.length} issue(s)${files.length ? "" : " (no files yet)"}`);
}

console.log(hardFailures ? `\n${hardFailures} blocking problem(s).` : "\nNo blocking problems.");
process.exit(hardFailures ? 1 : 0);
