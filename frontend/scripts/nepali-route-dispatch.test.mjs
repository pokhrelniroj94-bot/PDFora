import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const routes = read("../lib/i18n/nepali-tool-routes.ts");
const page = read("../app/[locale]/tools/[slug]/page.tsx");
const utilityWorkspace = read("../components/NepaliUtilityWorkspace.tsx");
const textWorkspace = read("../components/NepaliTextUtilityWorkspace.tsx");
const developerWorkspace = read("../components/NepaliDeveloperTextWorkspace.tsx");
const dateWorkspace = read("../components/NepaliDateTimeWorkspace.tsx");
const businessWorkspace = read("../components/NepaliBusinessCalculatorWorkspace.tsx");
const mathWorkspace = read("../components/NepaliMathUtilityWorkspace.tsx");
const nepalWorkspace = read("../components/NepaliNepalToolsWorkspace.tsx");
const specialWorkspace = read("../components/NepaliSpecialCatalogWorkspace.tsx");
const extraWorkspace = read("../components/ExtraTools.tsx");
const quickWorkspace = read("../components/QuickUtilityTools.tsx");
const liveWorkspace = read("../components/NepalLiveTools.tsx");
const financeWorkspace = read("../components/NepaliFinanceCalculatorWorkspace.tsx");
const careerWorkspace = read("../components/AIWritingTools.tsx");
const resumeRoute = read("../app/[locale]/[slug]/page.tsx");

function exportedSlugs(name) {
  const start = routes.indexOf("export const " + name);
  assert.notEqual(start, -1, name + " registry is missing");
  const open = routes.indexOf("[", start);
  const close = routes.indexOf("] as const", open);
  return [...routes.slice(open, close).matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}
function pageSlugs(name) {
  const start = page.indexOf("const " + name);
  assert.notEqual(start, -1, name + " route dispatch is missing");
  const open = page.indexOf("[", start);
  const close = page.indexOf("];", open);
  return [...page.slice(open, close).matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}
function branchSlugs(source) {
  return [...source.matchAll(/if \(slug === "([^"]+)"/g)].map((match) => match[1]);
}

const utility = exportedSlugs("nepaliLocalizedUtilitySlugs");
const financial = exportedSlugs("nepaliLocalizedFinancialSlugs");
const publicInfo = exportedSlugs("nepaliLocalizedPublicInfoSlugs");
const career = exportedSlugs("nepaliLocalizedCareerSlugs");
const all = [...utility, ...financial, ...publicInfo, ...career];
assert.equal(new Set(all).size, all.length, "Nepali tool registries must not contain duplicate slugs");

const explicit = [...page.matchAll(/if \(request\.locale === "ne" && \[([^\]]+)\]\.includes\(toolSlug\)\)/g)]
  .map((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
assert.equal(explicit.length, 6, "Six explicit Nepali component groups should be routed");
const special = pageSlugs("nepaliSpecialToolSlugs");
const extra = pageSlugs("nepaliExtraToolSlugs");
const quick = pageSlugs("nepaliQuickUtilitySlugs");
const utilityFallback = branchSlugs(utilityWorkspace);
const utilityDispatch = new Set([...special, ...extra, ...quick, ...explicit.flat(), ...utilityFallback]);
assert.deepEqual(utility.filter((slug) => !utilityDispatch.has(slug)), [], "Utility routes must not fall through to an empty workspace");

const specialHandled = new Set([...specialWorkspace.matchAll(/"([^"]+)"/g)].map((match) => match[1]));
assert.deepEqual(special.filter((slug) => !specialHandled.has(slug)), [], "Specialized routes must map to a real Nepali component");
assert.deepEqual(extra.filter((slug) => !extraWorkspace.includes('"'+slug+'"')), [], "ExtraTools must implement every Nepali extra route");
assert.deepEqual(quick.filter((slug) => !quickWorkspace.includes('"'+slug+'"')), [], "QuickUtilityTools must implement every Nepali quick route");
assert.deepEqual(explicit[0].filter((slug) => !textWorkspace.includes('"'+slug+'"')), [], "Text tools need labels and a working handler");
assert.deepEqual(explicit[1].filter((slug) => !developerWorkspace.includes('"'+slug+'"')), [], "Developer tools need labels and a working handler");
assert.deepEqual(explicit[2].filter((slug) => !dateWorkspace.includes('"'+slug+'"')), [], "Date/time tools need labels and a working handler");
assert.deepEqual(explicit[3].filter((slug) => !businessWorkspace.includes('"'+slug+'"')), [], "Business tools need labels and a working handler");
assert.deepEqual(explicit[4].filter((slug) => !mathWorkspace.includes('"'+slug+'"')), [], "Math tools need labels and a working handler");
assert.deepEqual(explicit[5].filter((slug) => !nepalWorkspace.includes('"'+slug+'"')), [], "Nepal utility tools need labels and a working handler");

const liveSlugs = new Set(branchSlugs(liveWorkspace));
const financeSlugs = new Set(branchSlugs(financeWorkspace));
const financeHandled = new Set([...special, ...extra, ...financeSlugs, ...liveSlugs]);
assert.deepEqual(financial.filter((slug) => !financeHandled.has(slug)), [], "Every financial route must have a localized handler");
assert.deepEqual(publicInfo.filter((slug) => !liveSlugs.has(slug)), [], "Every public-information route must have a localized handler");
assert.ok(page.includes("nepaliLocalizedCareerSlugs.includes(toolSlug"), "Career route group must dispatch to the localized AI-writing workspace");
assert.ok(careerWorkspace.includes('const humanizer = slug === "ai-humanizer"') && careerWorkspace.includes('const cover = slug === "ai-cover-letter-generator"'), "Career workspace must distinguish humanizer and cover-letter tools and support resume writer as the default");

const titleStart = page.indexOf("const nepaliTitles");
const descriptionStart = page.indexOf("const nepaliDescriptions");
const metadataStart = page.indexOf("export async function generateMetadata");
assert.ok(titleStart >= 0 && descriptionStart > titleStart && metadataStart > descriptionStart, "Nepali title and description dictionaries must exist");
const titles = new Set([...page.slice(titleStart, descriptionStart).matchAll(/"([^"]+)":/g)].map((match) => match[1]));
const descriptions = new Set([...page.slice(descriptionStart, metadataStart).matchAll(/"([^"]+)":/g)].map((match) => match[1]));
assert.deepEqual(all.filter((slug) => !titles.has(slug)), [], "Nepali tool titles are missing");
assert.deepEqual(all.filter((slug) => !descriptions.has(slug)), [], "Nepali tool descriptions are missing");
assert.ok(resumeRoute.includes('slug === "resume-builder"') && resumeRoute.includes('<ResumeBuilder locale="ne" />'), "Resume Builder must retain its dedicated Nepali route");
assert.ok(!all.includes("market-ai"), "Market AI must remain deferred until AI-tool work is authorized");

console.log("Nepali route dispatch, metadata and workspace coverage passed for " + all.length + " registered catalog routes.");
