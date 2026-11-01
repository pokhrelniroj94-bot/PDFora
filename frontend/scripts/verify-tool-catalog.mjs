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
assert.ok(allTools.includes('import NepalLiveTools from "./NepalLiveTools"'), "Nepal live tools component is not imported");

assert.ok(allTools.includes('import NepaliTypingTool from "./NepaliTypingTool"'), "Nepali typing component is not imported");
const nepalSlugs = [...catalogSource.matchAll(/\\{slug:"([^"]+)",name:"[^"]+",category:"Nepal"/g)].map((m) => m[1]);
const missingNepalGuides = nepalSlugs.filter((slug) => !nepalBlogPosts.includes('href: "/tools/' + slug + '"'));
assert.deepEqual(missingNepalGuides, [], "Nepal tools without dedicated guides: " + missingNepalGuides.join(", "));
assert.ok(blogPostsSource.indexOf("...nepalBlogPosts") < blogPostsSource.indexOf("...catalogGuides"), "Dedicated Nepal guides must take precedence over generated generic guides");
console.log(`Verified ${catalog.length} unique tools: every catalog slug has an implementation and Nepal utility routes are connected.`);
