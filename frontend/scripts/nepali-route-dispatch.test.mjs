import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const routes = read("../lib/i18n/nepali-tool-routes.ts");
const page = read("../app/[locale]/tools/[slug]/page.tsx");
const utilityWorkspace = read("../components/NepaliUtilityWorkspace.tsx");
const liveWorkspace = read("../components/NepalLiveTools.tsx");
const resumePage = read("../app/[locale]/resume-builder/page.tsx");

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

const groups = [
  ...exportedSlugs("nepaliLocalizedUtilitySlugs"),
  ...exportedSlugs("nepaliLocalizedFinancialSlugs"),
  ...exportedSlugs("nepaliLocalizedPublicInfoSlugs"),
  ...exportedSlugs("nepaliLocalizedCareerSlugs"),
];
assert.equal(new Set(groups).size, groups.length, "Nepali tool route registries must not contain duplicate slugs");

const explicit = [...page.matchAll(/if \(request\.locale === "ne" && \[([^\]]+)\]\.includes\(toolSlug\)\)/g)]
  .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
const sharedDispatch = ["nepaliSpecialToolSlugs", "nepaliExtraToolSlugs", "nepaliQuickUtilitySlugs"]
  .flatMap((name) => pageSlugs(name));
const genericUtilityCases = [...utilityWorkspace.matchAll(/if \(slug === "([^"]+)"/g)].map((match) => match[1]);
const liveCases = [...liveWorkspace.matchAll(/slug === "([^"]+)"/g)].map((match) => match[1]);
const dispatched = new Set([...explicit, ...sharedDispatch, ...genericUtilityCases, ...liveCases, ...groups]);
const missing = groups.filter((slug) => !dispatched.has(slug));
assert.deepEqual(missing, [], "Registered Nepali tools without a real locale workspace: " + missing.join(", "));

const titleStart = page.indexOf("const nepaliTitles");
const descriptionStart = page.indexOf("const nepaliDescriptions");
const metadataStart = page.indexOf("export async function generateMetadata");
assert.ok(titleStart >= 0 && descriptionStart > titleStart && metadataStart > descriptionStart, "Nepali title and description dictionaries must exist");
const titles = new Set([...page.slice(titleStart, descriptionStart).matchAll(/"([^"]+)":/g)].map((match) => match[1]));
const descriptions = new Set([...page.slice(descriptionStart, metadataStart).matchAll(/"([^"]+)":/g)].map((match) => match[1]));
assert.deepEqual(groups.filter((slug) => !titles.has(slug)), [], "Nepali tool titles are missing");
assert.deepEqual(groups.filter((slug) => !descriptions.has(slug)), [], "Nepali tool descriptions are missing");
assert.ok(resumePage.includes("नेपाली") || resumePage.includes('locale="ne"'), "Resume Builder must retain a dedicated Nepali route");
assert.ok(!groups.includes("market-ai"), "Market AI must remain deferred until AI-tool work is authorized");

console.log("Nepali route dispatch and metadata coverage passed for " + groups.length + " registered catalog routes.");
