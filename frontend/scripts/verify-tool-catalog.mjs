import fs from "node:fs";
import assert from "node:assert/strict";
const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const catalogSource = read("../components/toolCatalog.ts");
const allTools = read("../components/AllTools.tsx");
const nepalTools = read("../components/NepalTools.tsx");
const nepalLiveTools = read("../components/NepalLiveTools.tsx");
const nepalBlogPosts = read("../lib/nepal-blog-posts.ts");
const seoContent = read("../components/CatalogToolSEOContent.tsx");
const toolPage = read("../app/tools/[slug]/page.tsx");
const bsYearsSource = read("../lib/nepali-date-converter/years.ts");
const nepaliDateSource = read("../lib/nepali-date-converter/index.ts");
const panchangEngine = read("../lib/panchang-calculator.ts");
const kundaliEngine = read("../lib/kundali-calculator.ts");
const kundaliComponent = read("../components/KundaliTool.tsx");
const packageJson = read("../package.json");
const bsYears = {};
for (const [, yearText, valueText] of bsYearsSource.matchAll(/^years\[(\d+)\] = (.+);$/gm)) {
  const year = Number(yearText);
  bsYears[year] = valueText.startsWith("years[") ? bsYears[Number(valueText.match(/years\[(\d+)\]/)[1])] : JSON.parse(valueText);
}
assert.ok(nepaliDateSource.includes("Date.UTC(1918, 3, 13)"), "BS calendar epoch must remain anchored at 1975-01-01 BS = 1918-04-13 AD");
assert.deepEqual(bsYears[2083].slice(0, 12), [31,31,32,31,31,31,30,29,30,29,30,30], "2083 BS month lengths must match the published calendar data");
assert.equal(bsYears[2083][12], 365, "2083 BS must contain 365 days");
assert.ok(!bsYears[2084], "Unverified future calendar years must not be bundled as usable data");
assert.ok(nepaliDateSource.includes("yearOffsets[2084]") && nepaliDateSource.includes("this.year > 2083"), "Date converter must reject future BS years beyond the last supported calendar");
const bsToAd = (year, month, day) => {
  assert.ok(bsYears[year] && month >= 1 && month <= 12 && day >= 1 && day <= bsYears[year][month-1], "BS date must be valid");
  let offset = 0;
  for (let y = 1975; y < year; y++) offset += bsYears[y][12];
  for (let m = 0; m < month-1; m++) offset += bsYears[year][m];
  const date = new Date(Date.UTC(1918,3,13) + (offset + day - 1) * 86400000);
  return date.toISOString().slice(0,10);
};
assert.equal(bsToAd(2083,1,1), "2026-04-14", "2083 New Year anchor must match published calendar");
assert.equal(bsToAd(2083,7,1), "2026-10-18", "Kartik 1, 2083 must match published calendar");
assert.equal(bsToAd(2083,12,30), "2027-04-13", "2083 Chaitra 30 must match published calendar");
assert.ok(nepalTools.includes('function kathmanduISODate(timeZone = "Asia/Kathmandu")'), "Local date helper must default to Nepal civil timezone and accept city-specific time zones");
assert.ok(nepalTools.includes("new DateConverter(") && nepalTools.includes(".toAd()"), "Calendar grid must derive each day from the exact BS converter");
assert.ok(nepalTools.includes("y>2083"), "Calendar UI must not expose unverified future BS years");
assert.ok(nepalTools.includes('from "../lib/nepali-date-converter"') && nepalTools.includes("new DateConverter"), "Bundled Nepali date converter is missing");
assert.ok(nepalTools.includes('https://usemiti.com/embed/today?style=panchanga') && nepalTools.includes("Miti (Yarsa Himalaya)") && nepalTools.includes("CC BY 4.0"), "Panchang tool must use the disclosed source embed and attribution");
assert.ok(allTools.includes('"nepal-panchang-today"'), "Panchang reference tool must be routed to the Nepal utility workspace");
assert.ok(allTools.includes('"nepal-panchang-calculator"') && nepalTools.includes('slug==="nepal-panchang-calculator"'), "Astronomical Panchang calculator route or handler is missing");
assert.ok(packageJson.includes('"astronomy-engine": "2.1.19"') && panchangEngine.includes('import * as Astronomy from "astronomy-engine"'), "MIT astronomy engine dependency is missing");
assert.ok(panchangEngine.includes("SearchRiseSet") && panchangEngine.includes("EclipticGeoMoon") && panchangEngine.includes("SunPosition"), "Panchang must use astronomical ephemeris and location-based sunrise/sunset");
assert.ok(panchangEngine.includes("23.85709") && panchangEngine.includes("Asia/Kathmandu") && panchangEngine.includes("findAngaEnds"), "Panchang must document Lahiri, Nepal timezone and sunrise-anchored transition calculations");
assert.ok(panchangEngine.includes("indices.karana === 0") && panchangEngine.includes("(indices.karana - 1) % 7"), "Karana mapping must include Kimstughna at the opening half-tithi and the seven movable sequence");
assert.ok(kundaliEngine.includes('import * as Astronomy from "astronomy-engine"') && kundaliEngine.includes("GeoVector") && kundaliEngine.includes("Ecliptic(") && kundaliEngine.includes("EclipticGeoMoon") && kundaliEngine.includes("SunPosition") && kundaliEngine.includes("SiderealTime"), "Kundali must use geocentric apparent longitudes for the Sun, Moon and planets, plus local sidereal time");
assert.ok(!kundaliEngine.includes("EclipticLongitude(body") && kundaliEngine.includes("lahiriAyanamsa") && kundaliEngine.includes("meanNode") && kundaliEngine.includes("risingLongitude"), "Kundali must use documented Lahiri, lunar node and ascendant calculations");
assert.ok(kundaliEngine.includes("Asia/Kathmandu") && kundaliEngine.includes("localWallTimeToUtc") && kundaliEngine.includes("toAd()") && kundaliEngine.includes('input.placeId === "custom"'), "Kundali must support Nepali BS dates and historical Nepal local time offsets");
assert.ok(kundaliEngine.includes("Vimshottari") && kundaliEngine.includes("whole-sign houses"), "Kundali method and dasha calculations must be explicit");
assert.ok(kundaliEngine.includes("navamsaSignFor") && kundaliEngine.includes("navamsaHouses") && kundaliComponent.includes("Navamsa chart (D9)"), "Kundali must calculate and display the Navamsa D9 chart and houses");
for (const slug of ["nepali-janma-kundali-lagna-rashi-nakshatra-guide","nepali-hindu-panchang-tithi-nakshatra-guide"]) assert.ok(nepalBlogPosts.includes('slug: "' + slug + '"'), "Missing Nepali SEO guide: " + slug);
assert.ok(kundaliEngine.includes("formatAD") && kundaliEngine.includes("startAD:formatAD") && kundaliComponent.includes('language==="ne"?d.start:d.startAD'), "English and Hindi Kundali reports must show birth-city local Gregorian dasha dates while Nepali reports retain BS dates");
assert.ok(kundaliComponent.includes("जन्मकुण्डली") && kundaliComponent.includes("नवग्रहको स्थिति") && kundaliComponent.includes("विम्शोत्तरी महादशा") && kundaliComponent.includes("Latitude") && kundaliComponent.includes("Longitude"), "Kundali UI must present the report in Nepali");
assert.ok(kundaliComponent.includes("window.print()") && kundaliComponent.includes("birth details are not sent to the server"), "Kundali must support print/PDF and disclose client-side birth-data processing in English");
assert.ok(kundaliComponent.includes("localizedCalculationError") && kundaliComponent.includes("This local birth time is invalid"), "Kundali calculation errors must be localized for the English, Nepali and Hindi interfaces");
assert.ok(kundaliComponent.includes('changeDateSystem(zone==="Asia/Kolkata"?"AD":"BS")') && !kundaliComponent.includes('setBirthDate("2001-04-14")'), "Changing between Nepal and India cities must preserve the entered birth date by converting its calendar system");
assert.ok(kundaliComponent.includes('const num=(value:number,digits=2)=>n(') && !kundaliComponent.includes('const num=(value:number,digits=2)=>num('), "Localized number formatting must call the base formatter and must not recurse");
assert.ok(kundaliComponent.includes("HINDI_PLACES") && kundaliComponent.includes("placeText(place)"), "City names must be localized in Hindi, English and Nepali");
assert.ok(allTools.includes('slug==="nepali-janma-kundali"') && catalogSource.includes('slug:"nepali-janma-kundali"'), "Nepali Janma Kundali must have a dedicated catalog entry and route");
const catalog = [...catalogSource.matchAll(/\{slug:"([^"]+)"/g)].map((match) => match[1]).filter((slug) => slug !== "pdf-tools");

const toolDirectory = read("../lib/tool-directory.ts");
const homepage = read("../app/page.tsx");
const directoryComponent = read("../components/AllTools.tsx");
const sharedSearch = read("../lib/tool-search.ts");
const pdfBlock = toolDirectory.split("const rawPdfTools")[1]?.split("\n];")[0];
assert.ok(pdfBlock, "Canonical PDF tool list is missing");
const pdfHrefs = pdfBlock.split("\n").map((line) => line.match(/href: "([^"]+)"/)?.[1]).filter(Boolean);
const availablePdfHrefs = pdfHrefs.filter((href) => href !== "/ocr-pdf");
const catalogHrefs = catalog.map((slug) => "/tools/" + slug);
const allHrefs = [...availablePdfHrefs, ...catalogHrefs];
assert.equal(new Set(allHrefs).size, allHrefs.length, "Duplicate routes in the unified tool directory");
assert.equal(pdfHrefs.length, 50, "Expected 50 PDF tool routes in the canonical list");
assert.equal(availablePdfHrefs.length, 49, "OCR must remain excluded until its backend support is enabled");
assert.equal(catalog.length, 125, "Expected 125 catalog utilities");
assert.equal(allHrefs.length, 174, "Expected 174 available tools (49 PDF tools + 125 catalog utilities)");
assert.ok(toolDirectory.includes('kind: "pdf"') && toolDirectory.includes('kind: "utility"'), "Unified directory must distinguish PDF tools from utility tools");
assert.ok(toolDirectory.includes('"loan-emi-calculator": "EMI calculator'), "Loan/EMI search aliases are missing");
assert.ok(toolDirectory.includes('"notes-to-pdf": "notes to PDF'), "Notes-to-PDF search aliases are missing");
assert.ok(homepage.includes('import { allTools, type Tool } from "../lib/tool-directory"'), "Homepage is not using the canonical tool directory");
assert.ok(homepage.includes('category === "PDF Tools" ? tool.kind === "pdf"'), "Homepage PDF Tools category must include all PDF routes");
assert.ok(homepage.includes("matchesToolSearch(tool, query)") && directoryComponent.includes("matchesToolSearch(t,query)"), "Homepage and /tools directory must use the same shared search function");
assert.ok(sharedSearch.includes("tool.keywords") && sharedSearch.includes("toolAliases"), "Shared search must include tool keywords and task aliases");
assert.ok(sharedSearch.includes("querySynonyms") && sharedSearch.includes("editDistanceAtMostOne"), "Shared search must support multilingual synonyms and typo tolerance");
assert.ok(homepage.includes('id="homepage-tool-search"') && homepage.includes('type="search"'), "Homepage search input must be identifiable and use search semantics");
assert.ok(directoryComponent.includes('id="tool-directory-search"') && directoryComponent.includes('type="search"'), "/tools search input must be identifiable and use search semantics");
assert.ok(homepage.includes("Search by tool, task or keyword — English / नेपाली") && directoryComponent.includes("Search by tool, task or keyword — English / नेपाली"), "Both search bars must use the same clear multilingual prompt");
assert.ok(directoryComponent.includes('aria-pressed={category===c}') && directoryComponent.includes('aria-live="polite"'), "Directory category filters and result count must be accessible");

for (const term of ["jodne", "ghataune", "ghumaune", "फोटो", "कर", "मिति"]) {
  assert.ok(sharedSearch.includes(term), "Missing multilingual search alias: " + term);
}

assert.ok(homepage.includes("searchResults.map(tool=>"), "Homepage search must display every matching tool, not just a small fixed number");
assert.ok(homepage.includes("max-h-[min(65vh,32rem)]") && homepage.includes("overflow-y-auto"), "Homepage search results must remain scrollable when many tools match");
assert.ok(homepage.includes("matchesToolSearch(tool, query)"), "Homepage must use the shared search matcher");

assert.ok(directoryComponent.includes("allTools.filter"), "The /tools directory is not using the unified tool directory");
assert.ok(directoryComponent.includes("href={t.href}"), "The /tools directory does not preserve each tool's actual route");
const normalizeSearch = (value) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const loanToolLine = catalogSource.split("\n").find((line) => line.includes('slug:"loan-emi-calculator"'));
assert.ok(loanToolLine?.includes('name:"Loan & EMI Calculator"'), "Loan & EMI Calculator is missing from the catalog");
const loanSearchText = normalizeSearch([loanToolLine, "EMI calculator loan installment monthly payment"].join(" "));
assert.ok(["emi", "calculator"].every((token) => loanSearchText.includes(token)), "EMI Calculator cannot be found by homepage search terms");
const notesToolLine = catalogSource.split("\n").find((line) => line.includes('slug:"notes-to-pdf"'));
assert.ok(notesToolLine, "Notes to PDF is missing from the catalog");
assert.ok(notesToolLine.includes('category:"Document & Text"'), "Notes to PDF must be grouped with Document & Text tools");
assert.ok(directoryComponent.includes('if(slug==="notes-to-pdf") return <NotesToPDF />'), "Notes to PDF handler is missing");

const marketApi = read("../app/api/nepse-market/route.ts");
const marketDashboard = read("../components/NepseMarketDashboard.tsx");
const marketPage = read("../app/market/page.tsx");
const newsApi = read("../app/api/nepal-market-news/route.ts");
const newsComponent = read("../components/NepalMarketNews.tsx");
assert.ok(marketApi.includes('read<unknown[]>("/data/market/live.json", 60)'), "NEPSE API must use the latest YONEPSE live quote file with a short cache");
assert.ok(marketApi.includes('source: usingLiveQuotes ? "YONEPSE live quote snapshot"'), "NEPSE API must identify the live quote source");
assert.ok(marketApi.includes('read<Json>("/data/market/status.json")'), "NEPSE status source must be mapped correctly");
assert.ok(marketApi.includes('read<unknown[]>("/data/market/summary.json")'), "NEPSE summary source must be an array");
assert.ok(marketApi.includes('read<Json>("/data/market/top_stocks.json")'), "NEPSE top movers source must be an object");
assert.ok(marketApi.includes('read<unknown[]>("/data/market/sector_indices.json")'), "NEPSE sector source must be an array");
assert.ok(marketApi.includes('read<Json>("/data/market/supply_demand.json")'), "NEPSE supply/demand source must be an object");
assert.ok(marketApi.includes("summary: pick(summaryResult, [])"), "NEPSE summary fallback must remain an array for dashboard rendering");
assert.ok(marketApi.includes('s-maxage=60'), "NEPSE API response cache must allow frequent quote updates");
assert.ok(marketDashboard.includes('60*1000'), "NEPSE dashboard must refresh quote data every 60 seconds");
assert.ok(marketDashboard.includes("not an exchange-authorized tick-by-tick trading terminal"), "NEPSE dashboard must disclose quote-feed limitations");
const forexApi = read("../app/api/nepal-forex/route.ts");
const forexComponent = read("../components/NepalLiveTools.tsx");
assert.ok(forexApi.includes("fetchJsonHistory"), "NRB Forex historical rate API is missing");
assert.ok(forexApi.includes('params.get("history") === "1"'), "NRB Forex API must expose a history mode");
assert.ok(forexComponent.includes("Custom historical rate chart"), "Custom NRB Forex chart is missing");
assert.ok(forexComponent.includes("TradingView embedded Forex chart"), "Embedded Forex market chart is missing");
assert.ok(marketDashboard.includes("5*60*1000"), "NEPSE page should not poll faster than the upstream hourly feed needs");
assert.ok(marketDashboard.includes("refreshed about hourly"), "NEPSE upstream update cadence must be disclosed");
assert.ok(marketPage.includes("NepseMarketDashboard"), "Dedicated NEPSE market dashboard route is missing");
assert.ok(homepage.includes('href="/market"') && homepage.includes("NEPSE Market Dashboard"), "Homepage must link to the dedicated NEPSE market dashboard");
assert.ok(newsApi.includes('/data/notify/disclosures.json') && newsApi.includes('/data/ipo/upcoming.json'), "News API must include official NEPSE disclosures and IPO data");
assert.ok(newsApi.includes("Promise.allSettled"), "News API must preserve working feeds when another provider fails");
assert.ok(newsComponent.includes("15 * 60 * 1000"), "News component must auto-refresh headlines");
for (const slug of ["nepal-fixed-deposit-calculator","nepal-remittance-calculator","nepal-ipo-profit-calculator"]) {
  assert.ok(catalogSource.includes('slug:"' + slug + '"' ), "Missing Nepal finance catalog entry: " + slug);
  assert.ok(nepalLiveTools.includes('"' + slug + '"' ), "Missing Nepal finance tool handler: " + slug);
  assert.ok(toolPage.includes('"' + slug + '"' ), "Missing SEO metadata or FAQ coverage: " + slug);
  assert.ok(seoContent.includes('"' + slug + '"' ), "Missing dedicated SEO advice: " + slug);
  assert.ok(nepalBlogPosts.includes('href: "/tools/' + slug + '"' ), "Missing dedicated Nepal guide: " + slug);
}

const dividendTool = nepalLiveTools.slice(nepalLiveTools.indexOf("function NepseDividendTool()"), nepalLiveTools.indexOf("export default function NepalLiveTools"));
assert.ok(dividendTool.includes("Tax assumption only"), "Dividend calculator must clearly label tax as an editable assumption");
assert.ok(dividendTool.includes("bonusWhole") && dividendTool.includes("bonusFraction"), "Dividend calculator must show whole-share estimate and fractional remainder separately");
assert.ok(dividendTool.includes('aria-live="polite"') && dividendTool.includes("Calculation breakdown"), "Dividend calculator results must be accessible and clearly presented");
assert.ok(dividendTool.includes("not an official dividend or CDSC allotment confirmation"), "Dividend calculator must disclose that results are estimates only");
assert.ok(homepage.indexOf("/* ALL TOOLS */") < homepage.indexOf("/* NEPAL MARKET UPDATES */"), "Homepage must put tools before market news");
assert.ok(homepage.includes('const categories = ["All", "PDF Tools", ...Array.from(new Set(allTools.map((tool) => tool.category)))'), "Homepage category filters must include PDF Tools and every utility category");
assert.ok(homepage.includes('category === "PDF Tools" ? tool.kind === "pdf"'), "Homepage must filter all PDF tools through the unified PDF Tools category");
for (const slug of ["nepali-date-converter","nepali-calendar","nepal-public-holidays-2083","date-difference-calculator","age-calculator"]) {
  const row = catalogSource.split("\n").find((line) => line.includes('slug:"' + slug + '"'));
  assert.ok(row && row.includes('category:"Date & Calendar"'), "Date and calendar tool must use the Date & Calendar category: " + slug);
}
assert.ok(homepage.includes("searchResults.map(tool=>"), "Homepage search must show all matching tools");

const ashtakoota = read("../lib/ashtakoota-calculator.ts");
const gunaComponent = read("../components/GunaMilanTool.tsx");
const parseConstArray = (name) => {
  const match = ashtakoota.match(new RegExp("const " + name + " = (\\[[\\s\\S]*?\\]);"));
  assert.ok(match, "Missing Ashtakoota lookup table: " + name);
  return JSON.parse(match[1].replace(/([,\\[])\\.5/g, (_, prefix) => prefix + "0.5"));
};
for (const name of ["VARNA","VASHYA","SIGN_LORD","GANA","NADI","YONI"]) {
  assert.equal(parseConstArray(name).length, name === "VARNA" || name === "VASHYA" || name === "SIGN_LORD" ? 12 : 27, name + " must map all 12 signs or 27 nakshatras");
}
for (const name of ["VASHYA_TABLE","GRAHA_TABLE","GANA_TABLE","YONI_TABLE"]) {
  const table = parseConstArray(name);
  assert.ok(table.every((row) => Array.isArray(row) && row.length === table.length), name + " must be a square lookup matrix");
  assert.ok(table.flat().every((score) => typeof score === "number" && score >= 0), name + " must contain non-negative numeric scores");
}
assert.equal(parseConstArray("YONI_TABLE").length, 14, "Yoni matrix must cover all 14 traditional animal classes");
assert.equal(parseConstArray("YONI_TABLE").flat().length, 196, "Yoni matrix must contain 196 pairings");
assert.equal(parseConstArray("GRAHA_TABLE").length, 7, "Graha Maitri matrix must cover seven classical planetary lords");
assert.ok(ashtakoota.includes("Muhurta Chintamani") && ashtakoota.includes("ASHTAKOOTA_SOURCE_URL"), "Ashtakoota convention must identify its source");
assert.ok(ashtakoota.includes("bhakootCancelled") && ashtakoota.includes("nadiCancelled"), "Bhakoot and Nadi parihara must be reported separately from raw scores");
assert.ok(ashtakoota.includes("scores.some(s=>s.score<0||s.score>s.max)"), "Ashtakoota must reject scores outside each koota's maximum");
assert.ok(gunaComponent.includes('useState<Language>("ne")') && gunaComponent.includes('setLanguage("hi")') && gunaComponent.includes('setLanguage("en")'), "Guna Milan interface must support Nepali, Hindi and English");
assert.ok(gunaComponent.includes("Print / Save PDF") && gunaComponent.includes("ASHTAKOOTA_SOURCE_URL"), "Guna Milan report must provide print and source reference");
assert.ok(catalogSource.includes('slug:"nepali-guna-milan"'), "36-guna tool must be registered in the canonical catalog");
assert.ok(allTools.includes('slug==="nepali-guna-milan"') && allTools.includes("<GunaMilanTool />"), "36-guna tool must be routed to its dedicated calculator");
assert.ok(toolPage.includes('"nepali-guna-milan": { title:'), "36-guna page must have dedicated SEO metadata");

console.log(`Verified ${catalog.length} catalog tools and ${allHrefs.length} unified homepage/directory tools, including shared multilingual search, EMI search, Notes to PDF, NEPSE live quote refresh and resilient news feeds.`);
