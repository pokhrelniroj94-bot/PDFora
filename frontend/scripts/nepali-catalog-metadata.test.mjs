import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ensureTypeStripping, frontendRoot, loadToolAdapter } from "./lib/load-i18n.mjs";

ensureTypeStripping();
const { toolCatalog } = (await loadToolAdapter()).toolCatalog;
const page = fs.readFileSync(path.join(frontendRoot, "app", "[locale]", "tools", "[slug]", "page.tsx"), "utf8");

function readStringMap(name) {
  const match = page.match(new RegExp("const " + name + ": Record<string, string> = \\{([\\s\\S]*?)\\n\\};"));
  assert.ok(match, name + " map must exist");
  return new Map([...match[1].matchAll(/^\\s*"([^"]+)":\\s*"([^"]*)",?\\s*$/gm)].map((row) => [row[1], row[2]]));
}

const titles = readStringMap("nepaliTitles");
const descriptions = readStringMap("nepaliDescriptions");
const catalog = toolCatalog.filter((entry) => entry.slug !== "pdf-tools");
const missing = [];
const tooLong = [];
for (const entry of catalog) {
  const title = titles.get(entry.slug) ?? "";
  const description = descriptions.get(entry.slug) ?? "";
  if (!/[\\u0900-\\u097F]/.test(title) || !/[\\u0900-\\u097F]/.test(description)) missing.push(entry.slug);
  if (description.length > 155) tooLong.push({ slug: entry.slug, length: description.length });
}
assert.deepEqual(missing, [], "Every catalog tool must have Nepali title and description copy");
assert.deepEqual(tooLong, [], "Nepali catalog meta descriptions must stay within 155 characters");
assert.match(page, /nepaliTitles\\[request\\.implementation\\.slug\\] && nepaliDescriptions\\[request\\.implementation\\.slug\\]/, "localized metadata must use the Nepali maps for all catalog tools");
console.log("Nepali catalog metadata review passed: " + catalog.length + " titles/descriptions present, Devanagari copy and 155-character descriptions.");
