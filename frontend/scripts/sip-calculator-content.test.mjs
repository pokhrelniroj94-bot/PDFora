import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guide = fs.readFileSync(path.join(root, "components/CatalogToolSEOContent.tsx"), "utf8");
const page = fs.readFileSync(path.join(root, "app/tools/[slug]/page.tsx"), "utf8");
const calc = fs.readFileSync(path.join(root, "lib/catalog-calculations.ts"), "utf8");

for (const phrase of [
  "month-end SIP contributions",
  "annual rate divided by 12",
  "market volatility",
  "expense ratio",
  "initial lump-sum",
  "total contributed principal"
]) {
  assert.ok(guide.toLowerCase().includes(phrase.toLowerCase()), `SIP guide must explain: ${phrase}`);
}
assert.ok(guide.includes('"compound-interest-sip-calculator": ['), "SIP page must have dedicated step-by-step instructions");
assert.ok(guide.includes("5,000 × [((1 + r)^n − 1) ÷ r]"), "SIP guide must include the monthly annuity formula");
assert.ok(page.includes('title: "SIP Calculator – Monthly Investment & Compound Growth"'), "SIP page must have a descriptive search title");
assert.ok(page.includes("illustrative, not guaranteed"), "SIP metadata must not promise investment outcomes");
assert.ok(calc.includes("const rate = annualRate / 1200"), "Guide assumptions must match the calculator's monthly rate implementation");
assert.ok(calc.includes("monthly * contributionGrowth"), "Guide must match month-end SIP future-value calculation");
console.log("SIP calculator content checks passed.");
