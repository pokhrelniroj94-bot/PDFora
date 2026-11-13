import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const homepage = fs.readFileSync(path.join(root, "components/HomePageClient.tsx"), "utf8");
const catalog = fs.readFileSync(path.join(root, "components/toolCatalog.ts"), "utf8");

const expected = [
  ["/tools/loan-emi-calculator", "annual interest rate", "total interest"],
  ["/tools/notes-to-pdf", "paste your notes", "print dialog"],
  ["/tools/nepal-share-calculator", "share quantity", "profit or loss"],
];
for (const [href, ...phrases] of expected) {
  const entryLine = homepage.split("\n").find((line) => line.includes(`"${href}": "`));
  assert.ok(entryLine, `Homepage must provide a specific usage guide for ${href}`);
  const instruction = entryLine.slice(entryLine.indexOf('": "') + 4).replace(/",?$/, "");
  for (const phrase of phrases) {
    assert.ok(instruction.toLowerCase().includes(phrase.toLowerCase()), `Missing task-specific instruction for ${href}: ${phrase}`);
  }
}
assert.ok(!homepage.includes("upload the required file, follow the options and download the result"), "Homepage fallback must not falsely imply every tool requires file uploads");
for (const slug of ["loan-emi-calculator", "notes-to-pdf", "nepal-share-calculator"]) {
  assert.ok(catalog.includes(`slug:"${slug}"`), `Popular tool metadata must reference real catalog entry: ${slug}`);
}
assert.ok(homepage.includes('const [category, setCategory] = useState("All")'), "Homepage should show all tool categories by default");
assert.ok(homepage.includes("const [visibleCount, setVisibleCount] = useState(12)"), "Homepage should render a compact initial tool list");
assert.ok(homepage.includes("const visibleTools = homepageTools.slice(0, visibleCount)"), "Homepage should paginate the mixed-category featured catalogue");
assert.ok(homepage.includes("Free Online Tools for"), "Homepage hero must present PDFora as a multi-category tool platform");
for (const phrase of ["Finance & math", "Text tools", "Developer tools", "Image tools", "Nepal tools"]) {
  assert.ok(homepage.includes(phrase), `Homepage hero must visibly introduce ${phrase}`);
}
for (const href of ["/tools/tip-calculator", "/tools/savings-goal-calculator", "/tools/json-formatter-validator", "/tools/image-compressor", "/tools/nepali-date-converter", "/merge-pdf"]) {
  assert.ok(homepage.includes(`"${href}"`), `Homepage mixed-category featured tools must include ${href}`);
}
assert.ok(homepage.includes('setCategory("All")'), "Homepage search and clear actions should keep all categories discoverable");
assert.ok(homepage.includes("Explore tools for documents, money, text, code and images"), "Homepage directory introduction must explain the broader tool range");

assert.ok(homepage.includes("Show more tools") && homepage.includes('href="/tools"'), "Homepage should expose a path to the full tools directory");
console.log("Homepage content checks passed: all-category discovery, mixed-category featured tools, paginated catalogue and accurate popular tool guidance.");
