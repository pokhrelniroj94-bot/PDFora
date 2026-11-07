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
assert.ok(componentSource.includes("photo.size > 20 * 1024 * 1024"), "Photo resizer must enforce its 20 MB client-side limit");
assert.ok(componentSource.includes("URL.createObjectURL(photo)") && componentSource.includes("canvas.toBlob"), "Photo resizing must be performed locally in the browser");
assert.ok(!componentSource.includes("fetch("), "Nepali utility workspace must not upload user photos to a server");
assert.ok(componentSource.includes("bsYear < 1975 || bsYear > 2099"), "Calendar must enforce the supported BS range");
assert.ok(componentSource.includes("toAsciiDigits(year)") && componentSource.includes("toNepaliDigits(row.ad)"), "Calendar must accept Devanagari year digits and render dates in Nepali numerals");
assert.ok(componentSource.includes('<main lang="ne" dir="ltr"') || pageSource.includes('<main lang="ne" dir="ltr"'), "Localized tool pages must expose Nepali language and LTR direction to assistive technology and crawlers");
assert.ok(componentSource.includes("does not include public holidays") || componentSource.includes("सार्वजनिक बिदा, तिथि वा चाडपर्वको आधिकारिक सूची समावेश छैन"), "Calendar must not imply unimplemented holiday/tithi data");

const holidayBlock = liveSource.slice(liveSource.indexOf("const holidays = ["), liveSource.indexOf("const holidayNamesNe:"));
const holidayRows = [...holidayBlock.matchAll(/\{ name: "([^"]+)", bs: "([^"]+)", ad: "([^"]*)", note: "([^"]+)", type: "([^"]+)" \}/g)];
assert.ok(holidayRows.length >= 30, "The 2083 list must retain its full holiday/observance dataset");
assert.equal(new Set(holidayRows.map((row) => row[1])).size, holidayRows.length, "Holiday names must be unique");

// Independently cross-check every displayed BS/AD pair against the repository's calendar data.
const yearSource = fs.readFileSync(path.join(root, "lib/nepali-date-converter/years.ts"), "utf8");
const yearData = new Map();
for (const [, year, values] of yearSource.matchAll(/years\[(\d+)\] = \[([^\]]+)\];/g)) {
  yearData.set(Number(year), values.split(",").map((value) => Number(value.trim())));
}
for (const [, year, sourceYear] of yearSource.matchAll(/years\[(\d+)\] = years\[(\d+)\];/g)) {
  yearData.set(Number(year), yearData.get(Number(sourceYear)));
}
const monthNames = ["", "Baisakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Asoj", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
function convertAdToBs(ad) {
  const [year, month, day] = ad.split("-").map(Number);
  let remaining = (Date.UTC(year, month - 1, day) - Date.UTC(1918, 3, 13)) / 86400000;
  let bsYear = 1975;
  while (bsYear <= 2099 && remaining >= yearData.get(bsYear)[12]) remaining -= yearData.get(bsYear++)[12];
  let bsMonth = 1;
  while (remaining >= yearData.get(bsYear)[bsMonth - 1]) remaining -= yearData.get(bsYear)[bsMonth++ - 1];
  return { year: bsYear, month: bsMonth, date: remaining + 1 };
}
assert.deepEqual(convertAdToBs("2026-04-14"), { year: 2083, month: 1, date: 1 }, "BS New Year reference must match the calendar dataset");
for (const [, name, bs, ad] of holidayRows) {
  if (!ad) {
    assert.equal(bs, "Date to be announced", `${name} should explain why its date is not confirmed`);
    continue;
  }
  const [bsYear, bsMonth, bsDay] = bs.split(" ");
  const converted = convertAdToBs(ad);
  assert.equal(converted.year, Number(bsYear), `${name} BS year must match its AD date`);
  assert.equal(converted.month, monthNames.indexOf(bsMonth), `${name} BS month must match its AD date`);
  assert.equal(converted.date, Number(bsDay), `${name} BS day must match its AD date`);
}
assert.ok(liveSource.includes("https://moha.gov.np/en/page/government-and-public-holidays-in-2083"), "Holiday list must link to the official MoHA notice");

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
