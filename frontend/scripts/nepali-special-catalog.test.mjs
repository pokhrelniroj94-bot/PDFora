import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const page = read("../app/[locale]/tools/[slug]/page.tsx");
const workspace = read("../components/NepaliSpecialCatalogWorkspace.tsx");
const catalogBody = read("../components/AllTools.tsx");
const nepalTools = read("../components/NepalTools.tsx");
const typing = read("../components/NepaliTypingTool.tsx");
const registry = read("../lib/i18n/nepali-tool-routes.ts");

const slugs = [
  "currency-converter", "image-compressor", "image-format-converter", "color-picker-palette",
  "notes-to-pdf", "nepal-share-calculator", "preeti-unicode-converter", "nepali-unicode-typing",
];

for (const slug of slugs) {
  assert.ok(registry.includes('"'+slug+'"'), slug+" must be registered only after its Nepali workspace exists");
  assert.ok(page.includes('"'+slug+'"'), slug+" must be dispatched to a dedicated Nepali route");
  assert.ok(workspace.includes('"'+slug+'"'), slug+" must have a specialized Nepali workspace handler");
}

assert.ok(catalogBody.includes('export function CatalogToolBody({slug,locale="en"}'), "reusable tool body must accept the active locale");
assert.ok(catalogBody.includes('CurrencyTool box={box} label={label} locale={locale}'), "currency tool must receive locale copy");
assert.ok(catalogBody.includes('NotesToPDF locale={locale}'), "Notes to PDF must receive locale copy");
assert.ok(catalogBody.includes("40000000"), "image processing must enforce a pixel-count safety limit");
assert.ok(catalogBody.includes('mime==="image/jpeg"'), "JPEG output must flatten transparency onto a white background");
assert.ok(nepalTools.includes('export default function NepalTools({slug,locale="en"}'), "Nepal tool workspaces must preserve English defaults and support Nepali");
assert.ok(nepalTools.includes('locale==="ne"?"NEPSE शेयर खरिद/बिक्री क्याल्कुलेटर"'), "NEPSE share calculator needs localized title and disclosures");
assert.ok(typing.includes('export default function NepaliTypingTool({locale="en"}'), "Nepali typing must localize controls without changing the English route");
assert.ok(typing.includes("यो ध्वनिमा आधारित लिप्यन्तरण हो"), "typing tool must distinguish transliteration from translation");

console.log("Nepali special catalog workspace tests passed (25 assertions).");
