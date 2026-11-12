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
assert.ok(homepage.includes('const [category, setCategory] = useState("PDF")'), "Homepage should focus on PDF tools by default");
assert.ok(homepage.includes("const [visibleCount, setVisibleCount] = useState(12)"), "Homepage should render a compact initial tool list");
assert.ok(homepage.includes("const visibleTools = filteredTools.slice(0, visibleCount)"), "Homepage should paginate the tool catalogue");
assert.ok(homepage.includes("Show more tools") && homepage.includes('href="/tools"'), "Homepage should expose a path to the full tools directory");
console.log("Homepage content checks passed: focused PDF-first browsing, paginated catalogue and accurate popular tool guidance.");
