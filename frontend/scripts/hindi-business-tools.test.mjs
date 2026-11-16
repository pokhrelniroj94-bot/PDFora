import assert from "node:assert/strict";
import fs from "node:fs";
import { runHindiBusinessTool as run, hindiBusinessToolSlugs } from "../lib/i18n/hindi-business-tools.ts";
import { runNepaliBusinessTool as runNe } from "../lib/i18n/nepali-business-tools.ts";

assert.equal(hindiBusinessToolSlugs.length, 7);
assert.match(run("profit-margin-calculator", { revenue: "200000", cost: "150000" }), /लाभ मार्जिन: 25%/);
assert.match(run("profit-margin-calculator", { revenue: "0", cost: "10" }), /धनात्मक/);
assert.match(run("markup-calculator", { cost: "1000", markup: "30" }), /बिक्री मूल्य: NPR 1,300/);
assert.match(run("markup-calculator", { cost: "1000", markup: "1001" }), /0–1000%/);
assert.match(run("break-even-calculator", { fixed: "100000", variable: "250", price: "500" }), /ब्रेक-ईवन मात्रा: 400 इकाई/);
assert.match(run("break-even-calculator", { fixed: "100000", variable: "500", price: "500" }), /परिवर्ती लागत से अधिक/);
assert.match(run("sales-tax-calculator", { price: "1000", rate: "13" }), /कर सहित कुल: NPR 1,130/);
assert.match(run("sales-tax-calculator", { price: "1000", rate: "101" }), /0–100%/);
assert.match(run("salary-breakdown-calculator", { gross: "50000", tax: "2500", provident: "3000", other: "500" }), /हाथ में आने वाला वेतन: NPR 44,000/);
assert.match(run("salary-breakdown-calculator", { gross: "10000", tax: "9000", provident: "2000", other: "0" }), /अधिक नहीं हो सकती/);
assert.match(run("commission-calculator", { sales: "100000", rate: "5" }), /कमीशन राशि: NPR 5,000/);
assert.match(run("hourly-to-salary-calculator", { hourly: "500", hours: "40", weeks: "48" }), /वार्षिक कुल: NPR 9,60,000/);
assert.match(run("hourly-to-salary-calculator", { hourly: "500", hours: "169", weeks: "48" }), /168 से अधिक न हों/);

for (const slug of hindiBusinessToolSlugs) {
  const out = run(slug, {});
  assert.ok(out.length > 0 && !/NaN/.test(out), `${slug}: cleared inputs give a clean message`);
}
// Formulas match the Nepali runner: compare digits only (grouping differs by locale).
const digits = (s) => (s.match(/-?\d[\d,]*\.?\d*/g) ?? []).join("|").replaceAll(",", "");
const samples = {
  "profit-margin-calculator": { revenue: "120000", cost: "90500" },
  "markup-calculator": { cost: "777", markup: "42" },
  "break-even-calculator": { fixed: "54321", variable: "13", price: "97" },
  "sales-tax-calculator": { price: "4567", rate: "13" },
  "salary-breakdown-calculator": { gross: "88000", tax: "4100", provident: "8800", other: "250" },
  "commission-calculator": { sales: "234567", rate: "7.5" },
  "hourly-to-salary-calculator": { hourly: "325", hours: "37", weeks: "50" },
};
for (const [slug, v] of Object.entries(samples)) {
  const a = digits(run(slug, v)).split("|").filter((x) => x !== "").slice(0, 3);
  const b = digits(runNe(slug, v)).split("|").filter((x) => x !== "").slice(0, 3);
  assert.deepEqual(a, b, `${slug} must produce the same numbers as the Nepali runner`);
}
const ui = fs.readFileSync(new URL("../components/HindiBusinessCalculatorWorkspace.tsx", import.meta.url), "utf8");
assert.match(ui, /सभी मान साफ़ करें/);
assert.match(ui, /उदाहरण मान वापस लाएँ/);
console.log("Hindi business calculator tests passed.");
