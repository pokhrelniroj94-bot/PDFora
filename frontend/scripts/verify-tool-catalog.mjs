import fs from "node:fs";
import assert from "node:assert/strict";
const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const catalogSource = read("../components/toolCatalog.ts");
const allTools = read("../components/AllTools.tsx");
const quickTools = read("../components/QuickUtilityTools.tsx");
const extraTools = read("../components/ExtraTools.tsx");
const newTools = read("../components/NewToolsFixed.tsx");
const nepalTools = read("../components/NepalTools.tsx");
const nepalLiveTools = read("../components/NepalLiveTools.tsx");
const nepaliTypingTool = read("../components/NepaliTypingTool.tsx");
const nepalBlogPosts = read("../lib/nepal-blog-posts.ts");
const blogPostsSource = read("../lib/blog-posts.ts");
const seoContent = read("../components/CatalogToolSEOContent.tsx");
const toolPage = read("../app/tools/[slug]/page.tsx");
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
const nepalRouteBlocks = [...allTools.matchAll(/if\(\[(.*?)\]\.includes\(slug\)\)/gs)].map((match) => match[1]);
const nepalRouteBlock = nepalRouteBlocks.find((block) => block.includes('"nepal-forex-rates"'));
assert.ok(nepalRouteBlock, "Nepal utility route list is missing");
const routedNepalSlugs = [...nepalRouteBlock.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
const typingRouted = allTools.includes('slug==="nepali-unicode-typing"') && nepaliTypingTool.includes("nepalify.format");
const newToolCases = [...newTools.matchAll(/if\(slug==="([a-z0-9-]+)"\)/g)].map((m) => m[1]);
const implemented = new Set([...quickCases, ...extraCases, ...conditionalCases, ...nepalCases, ...liveCases, ...routedNepalSlugs, ...newToolCases]);
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
assert.ok(allTools.includes('import("./NewToolsFixed")') || allTools.includes('import NewToolsChunk from "./NewToolsFixed"') || allTools.includes('import("./NewTools")') || allTools.includes('import NewToolsChunk from "./NewTools"'), "New practical tools component is not imported");
assert.ok(newToolCases.includes("ats-resume-checker") && newToolCases.includes("invoice-quotation-generator") && newToolCases.includes("loan-emi-calculator") && newToolCases.includes("image-resizer-compressor") && newToolCases.includes("business-break-even-calculator"), "New practical tool handlers are missing");
const nepalSlugs = [...catalogSource.matchAll(/\{slug:"([^"]+)",name:"[^"]+",category:"Nepal"/g)].map((m) => m[1]);
assert.ok(nepalSlugs.length > 0, "Nepal tool catalog entries were not detected by the guide coverage check");
const missingNepalGuides = nepalSlugs.filter((slug) => !nepalBlogPosts.includes('href: "/tools/' + slug + '"'));
assert.deepEqual(missingNepalGuides, [], "Nepal tools without dedicated guides: " + missingNepalGuides.join(", "));
assert.ok(blogPostsSource.indexOf("...nepalBlogPosts") < blogPostsSource.indexOf("...catalogGuides"), "Dedicated Nepal guides must take precedence over generated generic guides");
const nepalSeoSlugs = ["ats-resume-checker","invoice-quotation-generator","nepali-date-converter","nepali-vat-calculator","nepal-land-area-converter","nepali-number-converter","nepal-phone-validator","gold-tola-gram-converter","nepali-calendar","nepali-digit-converter","loksewa-photo-resizer","neb-gpa-calculator","nepal-share-calculator","preeti-unicode-converter","nepal-forex-rates","nepal-salary-tax-calculator","nepal-electricity-bill-calculator","nepal-public-holidays-2083","nepali-unicode-typing","nepse-market-news","nepse-dividend-calculator"];
const missingNepalSeo = nepalSeoSlugs.filter((slug) => !seoContent.includes('"'+slug+'"'));
assert.deepEqual(missingNepalSeo, [], "Nepal tools without tool-specific SEO content: " + missingNepalSeo.join(", "));
assert.ok(toolPage.includes('"@type": "FAQPage"'), "Tool pages must include FAQ structured data");
for (const slug of ["qr-code-generator","qr-code-scanner","barcode-generator"]) {
  assert.ok(toolPage.includes('"'+slug+'": ['), `Missing dedicated FAQ content for ${slug}`);
  assert.ok(toolPage.includes('"'+slug+'": { title:'), `Missing unique metadata for ${slug}`);
  assert.ok(seoContent.includes('"'+slug+'": {'), `Missing dedicated SEO guide for ${slug}`);
}
assert.ok(newTools.includes("function escapeWifiField") && newTools.includes("escapeWifiField(wifi)") && newTools.includes("escapeWifiField(pass)"), "Wi-Fi QR payload escaping is missing");
assert.ok(newTools.includes("3000/Math.max(img.naturalWidth,img.naturalHeight)"), "QR scanner image decode size guard is missing");
assert.ok(newTools.includes('if(!value.trim())throw Error("Enter a value to encode.")'), "Barcode generator empty-input validation is missing");
assert.ok(toolPage.includes("seoOverrides"), "Tool-specific metadata overrides are missing");

const adviceBlock = seoContent.match(/const toolAdvice:[\s\S]*?=\s*\{([\s\S]*?)\n\s*\};/);
assert.ok(adviceBlock, "Tool-specific SEO advice map is missing");
const advisedSlugs = [...adviceBlock[1].matchAll(/^\s{4}"([^"]+)":\s*\{/gm)].map((m) => m[1]);
const missingToolAdvice = catalog.filter((slug) => !advisedSlugs.includes(slug));
assert.deepEqual(missingToolAdvice, [], "Catalog tools without tool-specific SEO guidance: " + missingToolAdvice.join(", "));

assert.ok(nepalTools.includes("weighted/total"), "NEB GPA must use credit-weighted grade points");
assert.ok(nepalTools.includes("5476") && nepalTools.includes("72900"), "Nepal land converter reference factors are missing");
assert.ok(nepalTools.includes('from "../lib/nepali-date-converter"') && nepalTools.includes("new DateConverter"), "Bundled Nepali date converter is missing");

const toolDirectory = read("../lib/tool-directory.ts");
const homepage = read("../components/HomePageClient.tsx");
const directoryComponent = read("../components/AllTools.tsx");
const pdfBlock = toolDirectory.split("const rawPdfTools")[1]?.split("\n];")[0];
assert.ok(pdfBlock, "Canonical PDF tool list is missing");
const pdfHrefs = pdfBlock.split("\n").map((line) => line.match(/href: "([^"]+)"/)?.[1]).filter(Boolean);
const availablePdfHrefs = pdfHrefs.filter((href) => href !== "/ocr-pdf");
const catalogHrefs = catalog.map((slug) => "/tools/" + slug);
const allHrefs = [...availablePdfHrefs, ...catalogHrefs];
assert.equal(new Set(allHrefs).size, allHrefs.length, "Duplicate routes in the unified tool directory");
assert.equal(pdfHrefs.length, 50, "Expected 50 PDF tool routes in the canonical list");
assert.equal(availablePdfHrefs.length, 49, "OCR must remain excluded until its backend support is enabled");
assert.equal(catalog.length, 135, "Expected 135 unique catalog utilities after deduplication and new tool additions");
assert.equal(allHrefs.length, 184, "Expected 184 available tools (49 PDF tools + 135 catalog utilities)");
assert.ok(toolDirectory.includes('kind: "pdf"') && toolDirectory.includes('kind: "utility"'), "Unified directory must distinguish PDF tools from utility tools");
assert.ok(toolDirectory.includes('"loan-emi-calculator": "EMI calculator'), "Loan/EMI search aliases are missing");
assert.ok(toolDirectory.includes('"notes-to-pdf": "notes to PDF'), "Notes-to-PDF search aliases are missing");
assert.ok(homepage.includes('import { allTools, type Tool } from "../lib/tool-directory"'), "Homepage is not using the canonical tool directory");
assert.ok(homepage.includes('tool.kind === "pdf" || tool.category === "PDF"'), "Homepage PDF category hides catalog PDF tools");
assert.ok(homepage.includes("tool.keywords"), "Homepage search does not include tool keywords");

assert.ok(homepage.includes("searchResults.map(tool=>"), "Homepage search must display every matching tool, not just a small fixed number");
assert.ok(homepage.includes("max-h-[min(65vh,32rem)]") && homepage.includes("overflow-y-auto"), "Homepage search results must remain scrollable when many tools match");
assert.ok(homepage.includes("tokens.every((token) => searchable.includes(token))"), "Homepage search must match all query words across tool names, descriptions, routes and keywords");

assert.ok(directoryComponent.includes("allTools.filter"), "The /tools directory is not using the unified tool directory");
assert.ok(directoryComponent.includes("href={t.href}"), "The /tools directory does not preserve each tool's actual route");
const normalizeSearch = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
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
assert.ok(marketApi.includes('source: usingUnofficialLive ? "NEPSE unofficial live API (nepseman-api)"') && marketApi.includes('"YONEPSE public market snapshot"') && marketApi.includes('"YONEPSE historical snapshot fallback"'), "NEPSE API must identify each quote source accurately");
assert.ok(marketApi.includes("quoteStale,") && marketApi.includes("providerRefreshCadence:") && marketApi.includes("quoteAgeMinutes:"), "NEPSE API must disclose quote age and upstream refresh cadence");
assert.ok(marketApi.includes('["previous_close", "previousClose", "previousClosingPrice"]'), "NEPSE quote normalization must not treat an ambiguous current close as a previous close");
assert.ok(marketApi.includes('read<Json>("/data/market/status.json")'), "NEPSE status source must be mapped correctly");
assert.ok(marketApi.includes('read<unknown[]>("/data/market/summary.json")'), "NEPSE summary source must be an array");
assert.ok(marketApi.includes('read<Json>("/data/market/top_stocks.json")'), "NEPSE top movers source must be an object");
assert.ok(marketApi.includes('read<unknown[]>("/data/market/sector_indices.json")'), "NEPSE sector source must be an array");
assert.ok(marketApi.includes('read<Json>("/data/market/supply_demand.json")'), "NEPSE supply/demand source must be an object");
assert.ok(marketApi.includes("summary: pick(summaryResult, [])"), "NEPSE summary fallback must remain an array for dashboard rendering");
assert.ok(marketApi.includes('s-maxage=60'), "NEPSE API response cache must allow frequent quote updates");
assert.ok(marketDashboard.includes('60*1000'), "NEPSE dashboard must refresh quote data every 60 seconds");
assert.ok(marketDashboard.includes("not an exchange-authorized tick-by-tick trading terminal"), "NEPSE dashboard must disclose quote-feed limitations");
assert.ok(marketPage.includes("NepseMarketDashboard"), "Dedicated NEPSE market dashboard route is missing");
assert.ok(homepage.includes('href="/market"') && homepage.includes("NEPSE Market Dashboard"), "Homepage must link to the dedicated NEPSE market dashboard");
assert.ok(newsApi.includes('/data/notify/disclosures.json') && newsApi.includes('/data/ipo/upcoming.json'), "News API must include official NEPSE disclosures and IPO data");
assert.ok(newsApi.includes("Promise.allSettled"), "News API must preserve working feeds when another provider fails");
assert.ok(newsComponent.includes("15 * 60 * 1000"), "News component must auto-refresh headlines");

const forexApi = read("../app/api/nepal-forex/route.ts");
const forexBackend = read("../../backend/main.py");
const forexUi = read("../components/NepalLiveTools.tsx");
assert.ok(forexApi.includes('const NRB_URL = "https://www.nrb.org.np/api/forex/v1/rates"'), "NRB Forex must use the official NRB API as its primary source");
assert.ok(forexApi.includes("previousRateDate:") && forexApi.includes("previousRates:"), "NRB Forex must return the previous published snapshot when available");
assert.ok(forexBackend.includes('"previousRateDate"') && forexBackend.includes('"previousRates"'), "NRB backend fallback must preserve prior published rates");
assert.ok(forexUi.includes('type="search"') && forexUi.includes("currencyQuery"), "NRB Forex table must support currency search");
assert.ok(forexUi.includes('value="foreign-to-foreign"') && forexUi.includes("target.unit / target.sell"), "NRB Forex converter must support foreign-currency cross conversion using official buying/selling rates");
assert.ok(forexUi.includes("previousRateDate") && forexUi.includes("Copy conversion"), "NRB Forex UI must show previous-rate context and allow copying a conversion");

assert.ok(homepage.indexOf("/* ALL TOOLS */") < homepage.indexOf("/* NEPAL MARKET UPDATES */"), "Homepage must put tools before market news");
assert.ok(homepage.includes('const categories = ["All", ...Array.from(new Set(["PDF", ...allTools.map((tool) => tool.category)]))'), "Homepage category filters must include every tool category");
assert.ok(homepage.includes("searchResults.map(tool=>"), "Homepage search must show all matching tools");
console.log(`Verified ${catalog.length} catalog tools and ${allHrefs.length} unified homepage/directory tools, plus NRB source, prior-rate, search and cross-conversion coverage.`);

