import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureTypeStripping, loadToolAdapter } from "./lib/load-i18n.mjs";
ensureTypeStripping();
const { convertTolaGrams, GRAMS_PER_TOLA, validateNepalMobileNumber } = await import("../lib/i18n/nepali-nepal-tools.ts");

assert.equal(GRAMS_PER_TOLA, 11.6638038);
assert.equal(convertTolaGrams(1, "tola"), 11.6638038);
assert.ok(Math.abs(convertTolaGrams(11.6638038, "gram") - 1) < 1e-12);
assert.equal(convertTolaGrams(0, "tola"), 0);
assert.throws(() => convertTolaGrams(-1, "gram"), RangeError);
assert.throws(() => convertTolaGrams(Number.NaN, "tola"), RangeError);


for (const value of ["9812345678", "+977 9812345678", "977-9812345678", "९८१२३४५६७८"]) {
  const result = validateNepalMobileNumber(value);
  assert.equal(result.valid, true, value);
  assert.equal(result.local, "9812345678");
  assert.equal(result.international, "+977 9812345678");
}
assert.equal(validateNepalMobileNumber("981234567").valid, false);
assert.equal(validateNepalMobileNumber("8812345678").valid, false);
assert.equal(validateNepalMobileNumber("+1 9812345678").valid, false);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routeSource = fs.readFileSync(path.join(root, "lib/i18n/nepali-tool-routes.ts"), "utf8");
const pageSource = fs.readFileSync(path.join(root, "app/[locale]/tools/[slug]/page.tsx"), "utf8");
const componentSource = fs.readFileSync(path.join(root, "components/NepaliNepalToolsWorkspace.tsx"), "utf8");
const liveSource = fs.readFileSync(path.join(root, "components/NepalLiveTools.tsx"), "utf8");
const newSlugs = ["nepal-phone-validator", "gold-tola-gram-converter", "nepali-calendar", "loksewa-photo-resizer"];
const liveSlugs = ["nepal-electricity-bill-calculator", "nepal-public-holidays-2083"];

for (const slug of newSlugs) {
  assert.ok(routeSource.includes(`"${slug}"`), `${slug} must be registered as a Nepali route`);
  assert.ok(pageSource.includes(`"${slug}"`), `${slug} must have a localized route branch and metadata`);
  assert.ok(componentSource.includes(`slug === "${slug}"`), `${slug} must render a dedicated Nepali workspace`);
}

assert.ok(liveSource.includes('function ElectricityTool({ locale = "en" }'), "Electricity tool must expose a localized interface");
assert.ok(liveSource.includes("https://www.erc.gov.np/electricity-calculator"), "Electricity tool must link to the live official ERC calculator");
assert.ok(liveSource.includes("https://www.erc.gov.np/detail/314"), "Electricity tool must disclose the current 2083 ERC tariff directive");
assert.ok(!liveSource.includes("estimateNepalDomesticElectricityBill"), "Electricity tool must not use unverified hard-coded tariff assumptions");
assert.ok(liveSource.includes('function HolidayTool({ locale = "en" }'), "Holiday tool must expose a localized interface");
assert.ok(liveSource.includes('return <ElectricityTool locale={locale}/>'), "Electricity tool must receive the selected locale");
assert.ok(liveSource.includes('return <HolidayTool locale={locale}/>'), "Holiday tool must receive the selected locale");
for (const required of ["नेपाली नयाँ वर्ष", "हरितालिका तीज", "शहीद दिवस", "महिला कर्मचारीका लागि मात्र", "आधिकारिक गृह मन्त्रालय"]) {
  assert.ok(liveSource.includes(required) || pageSource.includes(required), `Expected Nepali holiday copy: ${required}`);
}

const modules = await loadToolAdapter();
for (const slug of [...newSlugs, ...liveSlugs]) {
  const request = modules["localized-route"].resolveLocalizedToolRequest("ne", slug);
  assert.equal(request.status, "ok", `${slug} must resolve through the localized route`);
  const metadata = modules["localized-metadata"].buildLocalizedToolMetadata("ne", request.implementation.entry);
  assert.deepEqual(metadata.robots, { index: false, follow: true }, `${slug} stays noindex, but followable, until native review and explicit approval`);
  assert.equal(metadata.alternates?.canonical, `https://pd-fora.vercel.app/ne/tools/${slug}`, `${slug} must keep its self-referencing canonical`);
  assert.equal(metadata.alternates?.languages, undefined, `${slug} must not publish hreflang before approval`);
}

console.log("Nepali Nepal-tool regression checks passed: 6 localized routes, mobile validation, weight conversion, official electricity-source links and safe noindex metadata.");
