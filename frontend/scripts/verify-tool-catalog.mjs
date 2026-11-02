import fs from "node:fs";
import assert from "node:assert/strict";
const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const catalogSource = read("../components/toolCatalog.ts");
const allTools = read("../components/AllTools.tsx");
const quickTools = read("../components/QuickUtilityTools.tsx");
const extraTools = read("../components/ExtraTools.tsx");
const nepalTools = read("../components/NepalTools.tsx");
const nepalLiveTools = read("../components/NepalLiveTools.tsx");
const nepaliTypingTool = read("../components/NepaliTypingTool.tsx");
const nepalBlogPosts = read("../lib/nepal-blog-posts.ts");
const blogPostsSource = read("../lib/blog-posts.ts");
const seoContent = read("../components/CatalogToolSEOContent.tsx");
const toolPage = read("../app/tools/[slug]/page.tsx");
const sitemapSource = read("../app/sitemap.ts");
const bsYearsSource = read("../lib/nepali-date-converter/years.ts");
const nepaliDateSource = read("../lib/nepali-date-converter/index.ts");
const bsYears = {};
for (const [, yearText, valueText] of bsYearsSource.matchAll(/^years\\[(\\d+)\\] = (.+);$/gm)) {
  const year = Number(yearText);
  bsYears[year] = valueText.startsWith("years[") ? bsYears[Number(valueText.match(/years\\[(\\d+)\\]/)[1])] : JSON.parse(valueText);
}
assert.ok(nepaliDateSource.includes("Date.UTC(1918, 3, 13)"), "BS calendar epoch must remain anchored at 1975-01-01 BS = 1918-04-13 AD");
assert.deepEqual(bsYears[2083].slice(0, 12), [31,31,32,31,31,31,30,29,30,29,30,30], "2083 BS month lengths must match the published calendar data");
assert.equal(bsYears[2083][12], 365, "2083 BS must contain 365 days");
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
assert.ok(nepalTools.includes('timeZone: "Asia/Kathmandu"'), "Today date must use Nepal's civil timezone");
assert.ok(nepalTools.includes('new DateConverter(`${y}-${String(m).padStart(2,"0")}-${String(day).padStart(2,"0")}`).toAd()'), "Calendar grid must derive every day from the exact BS converter");
const robotsSource = read("../app/robots.ts");
const rootLayout = read("../app/layout.tsx");
const toolsPageMetadata = read("../app/tools/page.tsx");
const catalog = [...catalogSource.matchAll(/\{slug:"([^"]+)"/g)].map((m) => m[1]).filter((slug) => slug !== "pdf-tools");
assert.ok(catalog.length >= 100, `Expected at least 100 catalog tools, found ${catalog.length}`);
assert.equal(new Set(catalog).size, catalog.length, "Duplicate tool slugs exist");
const quickBlock = allTools.match(/const quickUtilitySlugs = \[([\s\S]*?)\];/);
assert.ok(quickBlock, "Quick utility dispatch list is missing");
const quickSlugs = [...quickBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const quickCases = [...quickTools.matchAll(/case "([^"]+)"/g)].map((m) => m[1]);
const extraCases = [...extraTools.matchAll(/case "([^"]+)"/g)].map((m) => m[1]);
const conditionalCases = [...allTools.matchAll(/if\s*\(slug\s*===\s*"([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(quickCases).size, quickCases.length, "Duplicate quick-tool handlers");
assert.equal(new Set(extraCases).size, extraCases.length, "Duplicate extra-tool handlers");
assert.deepEqual([...quickSlugs].sort(), [...quickCases].sort(), "Quick utility dispatch list and handlers differ");
const nepalCases = [...nepalTools.matchAll(/slug==="([a-z0-9-]+)"/g)].map((m) => m[1]);
const liveCases = [...nepalLiveTools.matchAll(/slug === "([a-z0-9-]+)"/g)].map((m) => m[1]);
const nepalRouteBlock = allTools.match(/if\(\[(.*?)\]\.includes\(slug\)\)/s);
assert.ok(nepalRouteBlock, "Nepal utility route list is missing");
const routedNepalSlugs = [...nepalRouteBlock[1].matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
const typingRouted = allTools.includes('slug==="nepali-unicode-typing"') && nepaliTypingTool.includes("nepalify.format");
const implemented = new Set([...quickCases, ...extraCases, ...conditionalCases, ...nepalCases, ...liveCases, ...routedNepalSlugs]);
if (typingRouted) implemented.add("nepali-unicode-typing");
if (allTools.includes('const imageTool=slug==="image-compressor"||slug==="image-format-converter"')) {
  implemented.add("image-compressor");
  implemented.add("image-format-converter");
}
const missing = catalog.filter((slug) => !implemented.has(slug));
assert.deepEqual(missing, [], `Tools without handlers: ${missing.join(", ")}`);
for (const slug of ["nepal-forex-rates", "nepal-salary-tax-calculator", "nepal-electricity-bill-calculator", "nepal-public-holidays-2083"]) {
  assert.ok(liveCases.includes(slug), `Missing Nepal live tool handler: ${slug}`);
  assert.ok(routedNepalSlugs.includes(slug), `Missing Nepal live route: ${slug}`);
}
assert.ok(typingRouted, "Nepali Unicode typing route or engine is missing");
assert.ok(allTools.includes('import("./NepalLiveTools")') || allTools.includes('import NepalLiveTools from "./NepalLiveTools"'), "Nepal live tools component is not imported");

assert.ok(allTools.includes('import("./NepaliTypingTool")') || allTools.includes('import NepaliTypingTool from "./NepaliTypingTool"'), "Nepali typing component is not imported");
const nepalSlugs = [...catalogSource.matchAll(/\\{slug:"([^"]+)",name:"[^"]+",category:"Nepal"/g)].map((m) => m[1]);
const missingNepalGuides = nepalSlugs.filter((slug) => !nepalBlogPosts.includes('href: "/tools/' + slug + '"'));
assert.deepEqual(missingNepalGuides, [], "Nepal tools without dedicated guides: " + missingNepalGuides.join(", "));
assert.ok(blogPostsSource.indexOf("...nepalBlogPosts") < blogPostsSource.indexOf("...catalogGuides"), "Dedicated Nepal guides must take precedence over generated generic guides");
const nepalSeoSlugs = ["nepali-date-converter","nepali-vat-calculator","nepal-land-area-converter","nepali-number-converter","nepal-phone-validator","gold-tola-gram-converter","nepali-calendar","nepali-digit-converter","loksewa-photo-resizer","neb-gpa-calculator","nepal-share-calculator","preeti-unicode-converter","nepal-forex-rates","nepal-salary-tax-calculator","nepal-electricity-bill-calculator","nepal-public-holidays-2083","nepali-unicode-typing","nepse-market-news","nepse-dividend-calculator","nepal-fixed-deposit-calculator","nepal-remittance-calculator","nepal-ipo-profit-calculator","nepal-panchang-today"];
const missingNepalSeo = nepalSeoSlugs.filter((slug) => !seoContent.includes('"'+slug+'"'));
assert.deepEqual(missingNepalSeo, [], "Nepal tools without tool-specific SEO content: " + missingNepalSeo.join(", "));
assert.ok(toolPage.includes('"@type": "FAQPage"'), "Tool pages must include FAQ structured data");
assert.ok(toolPage.includes("seoOverrides"), "Tool-specific metadata overrides are missing");
assert.ok(toolPage.includes('canonical') && toolPage.includes('openGraph') && toolPage.includes('twitter'), "Tool metadata must include canonical and social previews");
assert.ok(toolPage.includes('"@type": "FAQPage"') && toolPage.includes('"@type": "BreadcrumbList"'), "Tool pages must include FAQ and breadcrumb structured data");
assert.ok(toolsPageMetadata.includes('canonical: "https://pd-fora.vercel.app/tools"'), "Tool directory must declare its canonical URL");
assert.ok(sitemapSource.includes("...legacyPdfEntries") && sitemapSource.includes("...catalogEntries") && sitemapSource.includes('tool.slug !== "ocr-pdf"'), "Sitemap must include available legacy and catalog tools but exclude OCR");
assert.ok(robotsSource.includes('disallow: ["/api/"]') && robotsSource.includes("/sitemap.xml"), "Robots policy must block API paths and advertise the sitemap");
assert.ok(rootLayout.includes("Calculators & Nepal Utilities") && rootLayout.includes("image and text converters"), "Site-wide metadata must describe the broader all-in-one tool collection");
const metadataBlock = toolPage.slice(toolPage.indexOf("const seoOverrides"), toolPage.indexOf("const seo = seoOverrides"));
const metadataEntries = [...metadataBlock.matchAll(/"([^"]+)":\s*\{\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g)];
assert.ok(metadataEntries.length >= 45, "Expected detailed metadata overrides for the main Nepal and utility pages");
assert.equal(new Set(metadataEntries.map((m) => m[1])).size, metadataEntries.length, "Duplicate tool-specific metadata overrides exist");
assert.ok(metadataEntries.every((m) => m[2].length <= 60 && m[3].length <= 160), "Tool metadata title or description exceeds the SEO length target");
assert.ok(toolPage.includes('replace(/\\s+\\S*$/') && toolPage.includes('}...`)'), "Fallback SEO descriptions must trim at word boundaries");


const adviceBlock = seoContent.match(/const toolAdvice:[\s\S]*?=\s*\{([\s\S]*?)\n\s*\};/);
assert.ok(adviceBlock, "Tool-specific SEO advice map is missing");
const advisedSlugs = [...adviceBlock[1].matchAll(/^\s{4}"([^"]+)":\s*\{/gm)].map((m) => m[1]);
const missingToolAdvice = catalog.filter((slug) => !advisedSlugs.includes(slug));
assert.deepEqual(missingToolAdvice, [], "Catalog tools without tool-specific SEO guidance: " + missingToolAdvice.join(", "));

assert.ok(nepalTools.includes("weighted/total"), "NEB GPA must use credit-weighted grade points");
assert.ok(nepalTools.includes("5476") && nepalTools.includes("72900"), "Nepal land converter reference factors are missing");
assert.ok(nepalTools.includes('from "../lib/nepali-date-converter"') && nepalTools.includes("new DateConverter"), "Bundled Nepali date converter is missing");
assert.ok(nepalTools.includes('https://usemiti.com/embed/today?style=panchanga') && nepalTools.includes("Miti (Yarsa Himalaya)") && nepalTools.includes("CC BY 4.0"), "Panchang tool must use the disclosed source embed and attribution");
assert.ok(allTools.includes('"nepal-panchang-today"'), "Panchang tool must be routed to the Nepal utility workspace");

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
assert.equal(catalog.length, 122, "Expected 122 catalog utilities");
assert.equal(allHrefs.length, 171, "Expected 171 available tools (49 PDF tools + 122 catalog utilities)");
assert.ok(toolDirectory.includes('kind: "pdf"') && toolDirectory.includes('kind: "utility"'), "Unified directory must distinguish PDF tools from utility tools");
assert.ok(toolDirectory.includes('"loan-emi-calculator": "EMI calculator'), "Loan/EMI search aliases are missing");
assert.ok(toolDirectory.includes('"notes-to-pdf": "notes to PDF'), "Notes-to-PDF search aliases are missing");
assert.ok(homepage.includes('import { allTools, type Tool } from "../lib/tool-directory"'), "Homepage is not using the canonical tool directory");
assert.ok(homepage.includes('tool.kind === "pdf" || tool.category === "PDF"'), "Homepage PDF category hides catalog PDF tools");
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
assert.ok(notesToolLine.includes('category:"PDF"'), "Notes to PDF must be grouped under the PDF category");
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
assert.ok(homepage.includes('const categories = ["All", "PDF Tools", ...Array.from(new Set(["PDF", ...allTools.map((tool) => tool.category)]))'), "Homepage category filters must include the unified PDF category and every tool category");
assert.ok(homepage.includes('category === "PDF Tools" ? tool.kind === "pdf"'), "Homepage must filter all PDF tools through the unified PDF Tools category");
for (const slug of ["nepali-date-converter","nepali-calendar","nepal-public-holidays-2083","date-difference-calculator","age-calculator"]) {
  const row = catalogSource.split("\n").find((line) => line.includes('slug:"' + slug + '"'));
  assert.ok(row && row.includes('category:"Date & Calendar"'), "Date and calendar tool must use the Date & Calendar category: " + slug);
}
assert.ok(homepage.includes("searchResults.map(tool=>"), "Homepage search must show all matching tools");
console.log(`Verified ${catalog.length} catalog tools and ${allHrefs.length} unified homepage/directory tools, including shared multilingual search, EMI search, Notes to PDF, NEPSE live quote refresh and resilient news feeds.`);
