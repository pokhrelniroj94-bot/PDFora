import fs from "node:fs";
import assert from "node:assert/strict";
const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const catalogSource = read("../components/toolCatalog.ts");
const allTools = read("../components/AllTools.tsx");
const quickTools = read("../components/QuickUtilityTools.tsx");
const extraTools = read("../components/ExtraTools.tsx");
const nepalTools = read("../components/NepalTools.tsx");
const nepalLiveTools = read("../components/NepalLiveTools.tsx");
const resumeBuilder = read("../components/ResumeBuilder.tsx");
const nepaliTypingTool = read("../components/NepaliTypingTool.tsx");
const nepalBlogPosts = read("../lib/nepal-blog-posts.ts");
const blogPostsSource = read("../lib/blog-posts.ts");
const seoContent = read("../components/CatalogToolSEOContent.tsx");
const pdfToolGuidesSource = read("../lib/tool-guides.ts");
const toolPage = read("../app/tools/[slug]/page.tsx");
const catalog = [...catalogSource.matchAll(/\{slug:"([^"]+)"/g)].map((m) => m[1]).filter((slug) => slug !== "pdf-tools");
assert.ok(catalog.length >= 100, `Expected at least 100 catalog tools, found ${catalog.length}`);
assert.equal(new Set(catalog).size, catalog.length, "Duplicate tool slugs exist");

const metadataEntries = [...catalogSource.matchAll(/\{slug:"([^"]+)",name:"([^"]+)",category:"([^"]+)",description:"([^"]+)",keywords:"([^"]+)"\}/g)]
  .map((match) => ({ slug: match[1], name: match[2], category: match[3], description: match[4] }))
  .filter((entry) => entry.slug !== "pdf-tools");
assert.equal(metadataEntries.length, 124, "Every catalog tool must have a metadata source entry");
assert.equal(new Set(metadataEntries.map((entry) => entry.name.trim().toLowerCase())).size, metadataEntries.length, "Catalog tool names must be unique");
assert.equal(new Set(metadataEntries.map((entry) => entry.description.trim().toLowerCase())).size, metadataEntries.length, "Catalog tool descriptions must be unique");

const pdfGuideEntries = [...pdfToolGuidesSource.matchAll(/"slug":\s*"([^"]+)"[\s\S]*?"name":\s*"([^"]+)"[\s\S]*?"keyword":\s*"([^"]+)"[\s\S]*?"purpose":\s*"([^"]+)"[\s\S]*?"steps":\s*\[([\s\S]*?)\][\s\S]*?"caution":\s*"([^"]+)"/g)]
  .map((match) => ({ slug: match[1], name: match[2], keyword: match[3], purpose: match[4], steps: [...match[5].matchAll(/"([^"]+)"/g)].map((step) => step[1]), caution: match[6] }));
assert.equal(pdfGuideEntries.length, 49, "All 49 established PDF routes need a dedicated guide record");
for (const field of ["name", "keyword", "purpose"]) {
  assert.equal(new Set(pdfGuideEntries.map((entry) => entry[field].trim().toLowerCase())).size, 49, `PDF guide ${field} values must be unique`);
}
assert.ok(pdfGuideEntries.every((entry) => entry.steps.length === 3 && entry.caution.length >= 60), "Every PDF guide needs three task-specific steps and a useful caution");


const seoOverridesBlock = toolPage.match(/const seoOverrides:[\s\S]*?= \{([\s\S]*?)\n  \};/)?.[1] ?? "";
const seoOverrides = new Map([...seoOverridesBlock.matchAll(/"([^"]+)": \{ title: "([^"]+)", description: "([^"]+)" \}/g)]
  .map((match) => [match[1], { title: match[2], description: match[3] }]));
const generatedMetadata = metadataEntries.map((entry) => ({
  slug: entry.slug,
  title: seoOverrides.get(entry.slug)?.title ?? `${entry.name} Online | PDFora`,
  description: seoOverrides.get(entry.slug)?.description ?? entry.description.trim(),
}));
assert.equal(new Set(generatedMetadata.map((entry) => entry.title.trim().toLowerCase())).size, generatedMetadata.length, "Generated English tool SEO titles must be unique");
assert.equal(new Set(generatedMetadata.map((entry) => entry.description.trim().toLowerCase())).size, generatedMetadata.length, "Generated English tool meta descriptions must be unique");
assert.ok(generatedMetadata.every((entry) => entry.title.length >= 20 && entry.description.length >= 40), "Tool metadata must be descriptive rather than empty or placeholder copy");

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
const nepalSlugs = [...catalogSource.matchAll(/\{slug:"([^"]+)",name:"[^"]+",category:"Nepal"/g)].map((m) => m[1]);
assert.ok(nepalSlugs.length > 0, "Nepal tool catalog entries were not detected by the guide coverage check");
const missingNepalGuides = nepalSlugs.filter((slug) => !nepalBlogPosts.includes('href: "/tools/' + slug + '"'));
assert.deepEqual(missingNepalGuides, [], "Nepal tools without dedicated guides: " + missingNepalGuides.join(", "));
assert.ok(blogPostsSource.indexOf("...nepalBlogPosts") < blogPostsSource.indexOf("...catalogGuides"), "Dedicated Nepal guides must take precedence over generated generic guides");
const nepalSeoSlugs = ["nepali-date-converter","nepali-vat-calculator","nepal-land-area-converter","nepali-number-converter","nepal-phone-validator","gold-tola-gram-converter","nepali-calendar","nepali-digit-converter","loksewa-photo-resizer","neb-gpa-calculator","nepal-share-calculator","preeti-unicode-converter","nepal-forex-rates","nepal-salary-tax-calculator","nepal-electricity-bill-calculator","nepal-public-holidays-2083","nepali-unicode-typing","nepse-market-news","nepse-dividend-calculator"];
const missingNepalSeo = nepalSeoSlugs.filter((slug) => !seoContent.includes('"'+slug+'"'));
assert.deepEqual(missingNepalSeo, [], "Nepal tools without tool-specific SEO content: " + missingNepalSeo.join(", "));
assert.doesNotMatch(toolPage, /"@type": "FAQPage"/, "Do not emit FAQ rich-result markup on generic utility pages");
assert.doesNotMatch(seoContent, /"@type": "FAQPage"/, "PDF guide content must not emit obsolete FAQ rich-result markup");
assert.doesNotMatch(read("../components/PdfToolJsonLd.tsx"), /"@type": "FAQPage"/, "Shared PDF schema must not emit obsolete FAQ rich-result markup");
assert.match(toolPage, /const description = seo\?\.description \?\? tool\.description\.trim\(\)/, "Fallback metadata must use the actual task-specific catalog description");
assert.match(toolPage, /const title = seo\?\.title \?\? `\$\{tool\.name\} Online \| PDFora`/, "Fallback metadata title must identify the actual tool and site");
assert.match(seoContent, /uniqueFaqItems\.map/, "Visible tool FAQs must remain available in page content");
assert.ok(toolPage.includes("seoOverrides"), "Tool-specific metadata overrides are missing");

const adviceBlock = seoContent.match(/const toolAdvice:[\s\S]*?=\s*\{([\s\S]*?)\n\s*\};/);
assert.ok(adviceBlock, "Tool-specific SEO advice map is missing");
const advisedSlugs = [...adviceBlock[1].matchAll(/^\s{4}"([^"]+)":\s*\{/gm)].map((m) => m[1]);
const missingToolAdvice = catalog.filter((slug) => !advisedSlugs.includes(slug));
assert.deepEqual(missingToolAdvice, [], "Catalog tools without tool-specific SEO guidance: " + missingToolAdvice.join(", "));
assert.equal(advisedSlugs.length, catalog.length, "Every catalog tool must have one and only one dedicated SEO advice record");
const uniqueAdviceFields = new Map(["example", "accuracy", "workflow", "mistakes"].map((field) => [field, new Set()]));
for (const slug of catalog) {
  const marker = `"${slug}": {`;
  const start = adviceBlock[1].indexOf(marker);
  const next = adviceBlock[1].indexOf('\n    "', start + marker.length);
  const entry = adviceBlock[1].slice(start, next < 0 ? undefined : next);
  for (const field of ["example", "accuracy", "workflow", "mistakes"]) {
    const match = entry.match(new RegExp(field + ': "((?:\\\\.|[^"\\\\])*)"'));
    assert.ok(match && match[1].trim().length >= 50, `${slug} needs substantive tool-specific ${field} guidance`);
    const seen = uniqueAdviceFields.get(field);
    assert.ok(!seen.has(match[1]), `${slug} repeats another tool's ${field} guidance`);
    seen.add(match[1]);
  }
}

assert.ok(nepalTools.includes("weighted/total"), "NEB GPA must use credit-weighted grade points");
assert.ok(nepalTools.includes("5476") && nepalTools.includes("72900"), "Nepal land converter reference factors are missing");
assert.ok(nepalTools.includes('from "../lib/nepali-date-converter"') && nepalTools.includes("new DateConverter"), "Bundled Nepali date converter is missing");

const toolDirectory = read("../lib/tool-directory.ts");
// The homepage UI moved from app/page.tsx into components/HomePageClient.tsx; page.tsx is now a thin metadata wrapper.
const homepage = read("../app/page.tsx") + "\n" + read("../components/HomePageClient.tsx");
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
assert.equal(catalog.length, 124, "Expected 124 catalog utilities");
assert.equal(allHrefs.length, 173, "Expected 173 available tools (49 PDF tools + 124 catalog utilities)");
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
const pageImagesToolPage = read("../app/extract-page-images/page.tsx");
const aiWritingRoute = read("../app/api/ai-writing/route.ts");
const envExample = read("../.env.example");
assert.ok(marketApi.includes('read<unknown[]>("/data/market/live.json", 60)'), "NEPSE API must use the latest YONEPSE live quote file with a short cache");
assert.ok(
  marketApi.includes('"NEPSE unofficial live API (nepseman-api)"') && marketApi.includes('"YONEPSE public market snapshot"') && marketApi.includes('"YONEPSE historical snapshot fallback"'),
  "NEPSE API must identify the live, snapshot and fallback quote sources",
);
assert.ok(marketApi.includes('read<Json>("/data/market/status.json", 60)'), "NEPSE status source must be mapped correctly");
assert.ok(marketApi.includes('read<unknown[]>("/data/market/summary.json", 60)'), "NEPSE summary source must be an array");
assert.ok(marketApi.includes('read<Json>("/data/market/top_stocks.json", 60)'), "NEPSE top movers source must be an object");
assert.ok(marketApi.includes('read<unknown[]>("/data/market/sector_indices.json", 60)'), "NEPSE sector source must be an array");
assert.ok(marketApi.includes('read<Json>("/data/market/supply_demand.json", 60)'), "NEPSE supply/demand source must be an object");
assert.ok(marketApi.includes("summary: pick(summaryResult, [])"), "NEPSE summary fallback must remain an array for dashboard rendering");
assert.ok(marketApi.includes('s-maxage=60'), "NEPSE API response cache must allow frequent quote updates");
assert.ok(marketDashboard.includes('60*1000'), "NEPSE dashboard must refresh quote data every 60 seconds");
assert.ok(marketDashboard.includes("not an exchange-authorized tick-by-tick trading terminal"), "NEPSE dashboard must disclose quote-feed limitations");
assert.ok(marketPage.includes("NepseMarketDashboard"), "Dedicated NEPSE market dashboard route is missing");
assert.ok(homepage.includes('href="/market"') && homepage.includes("NEPSE Market Dashboard"), "Homepage must link to the dedicated NEPSE market dashboard");
assert.ok(newsApi.includes('/data/notify/disclosures.json') && newsApi.includes('/data/ipo/upcoming.json'), "News API must include official NEPSE disclosures and IPO data");
assert.ok(newsApi.includes("Promise.allSettled"), "News API must preserve working feeds when another provider fails");
assert.ok(newsComponent.includes("10 * 60 * 1000"), "News component must auto-refresh headlines every 10 minutes");
assert.ok(pageImagesToolPage.includes("Render PDF Pages to PNG") && pageImagesToolPage.includes("Render every PDF page as a PNG image"), "Page-image tool must clearly describe full-page PNG rendering");
assert.ok(aiWritingRoute.includes("new URL(redisUrl)") && aiWritingRoute.includes('redisEndpoint.protocol !== "https:"') && aiWritingRoute.includes("SHARED_RATE_LIMIT_INVALID_URL"), "AI shared rate limiter must validate the Upstash HTTPS REST URL safely");
assert.ok(envExample.includes("UPSTASH_REDIS_REST_URL=") && envExample.includes("UPSTASH_REDIS_REST_TOKEN="), "Example environment file must document both Upstash REST settings");
assert.ok(nepalLiveTools.includes("Effective tax rate: {amount > 0 ?") && !nepalLiveTools.includes("Effective tax rate: ${amount > 0 ?"), "Nepal salary tax effective rate must display as a percentage, not currency");
assert.ok(catalogSource.includes("Explore 49 PDF Tools") && catalogSource.includes("49 available PDF tools"), "PDF tool catalogue must advertise the 49 enabled PDF tools accurately");
const resumeTemplateBlock = resumeBuilder.match(/const templates = \[([\s\S]*?)\n\];/);
assert.ok(resumeTemplateBlock, "Resume Builder template list is missing");
assert.equal([...resumeTemplateBlock[1].matchAll(/\bid:\s*"/g)].length, 20, "Resume Builder must expose 20 templates");
assert.ok(catalogSource.includes("20 professional templates"), "Resume Builder catalogue must advertise the 20 available templates");
assert.ok(homepage.indexOf("/* ALL TOOLS */") < homepage.indexOf("/* NEPAL MARKET UPDATES */"), "Homepage must put tools before market news");
assert.ok(homepage.includes('const categories = ["All", ...Array.from(new Set(["PDF", ...allTools.map((tool) => tool.category)]))'), "Homepage category filters must include every tool category");
assert.ok(homepage.includes("searchResults.map(tool=>"), "Homepage search must show all matching tools");
console.log(`Verified ${catalog.length} catalog tools and ${allHrefs.length} unified homepage/directory tools, including EMI search, Notes to PDF, NEPSE live quote refresh and resilient news feeds.`);
