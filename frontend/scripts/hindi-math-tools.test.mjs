import assert from "node:assert/strict";
import fs from "node:fs";
import { runHindiMathTool, hindiMathToolSlugs } from "../lib/i18n/hindi-math-tools.ts";

const run = runHindiMathTool;
assert.equal(hindiMathToolSlugs.length, 13);
assert.match(run("percentage-change-calculator", { from: "100", to: "125" }), /25%/);
assert.match(run("percentage-change-calculator", { from: "0", to: "5" }), /गणना नहीं की जा सकती/);
assert.match(run("average-calculator", { numbers: "2, 4, 6" }), /औसत: 4/);
assert.match(run("average-calculator", { numbers: "2, nope" }), /मान्य संख्याएँ/);
assert.equal(run("ratio-simplifier", { a: "12", b: "18" }), "सरलतम अनुपात: 2 : 3\nमहत्तम समापवर्तक: 6");
assert.equal(run("fraction-calculator", { a: "1", b: "2", c: "1", d: "3", operation: "add" }), "सरल रूप: 5/6\nदशमलव: 0.83333333");
assert.match(run("fraction-calculator", { a: "1", b: "0", c: "1", d: "2" }), /हर 0 नहीं/);
assert.match(run("percentage-of-number-calculator", { number: "200", percentage: "15" }), /= 30/);
assert.equal(run("gcd-lcm-calculator", { a: "12", b: "18" }), "महत्तम समापवर्तक (GCD): 6\nलघुत्तम समापवर्त्य (LCM): 36");
assert.match(run("prime-number-checker", { number: "17" }), /अभाज्य संख्या है/);
assert.match(run("prime-number-checker", { number: "21" }), /अभाज्य संख्या नहीं है/);
assert.match(run("unit-converter", { amount: "1", fromUnit: "km", toUnit: "m" }), /1 km = 1,000 m/);
assert.match(run("unit-converter", { amount: "1", fromUnit: "kg", toUnit: "m" }), /एक ही प्रकार/);
assert.match(run("bmi-calculator", { weight: "65", height: "170" }), /BMI: 22.49134948/);
assert.match(run("bmr-calculator", { weight: "65", height: "170", age: "25", sex: "male" }), /1,592.5 kcal/);
assert.match(run("tip-calculator", { bill: "1000", tip: "10", people: "2" }), /प्रति व्यक्ति: ₹550/);
assert.match(run("split-bill-calculator", { total: "2400", people: "3" }), /देय राशि: ₹800/);
assert.match(run("simple-interest-calculator", { principal: "100000", rate: "10", years: "2" }), /साधारण ब्याज: ₹20,000/);
assert.match(run("simple-interest-calculator", { principal: "-1", rate: "10", years: "2" }), /मूलधन धनात्मक/);

// Cleared inputs must never throw or show NaN; they produce a validation message.
for (const slug of hindiMathToolSlugs) {
  const out = run(slug, {});
  assert.ok(out.length > 0 && !/NaN/.test(out), `${slug} should give a clean message for empty input`);
}
// Same formulas as the Nepali runner: compare numeric outputs on shared samples.
const nepali = await import("../lib/i18n/nepali-math-tools.ts");
const digits = (s) => (s.match(/-?\d[\d,]*\.?\d*/g) ?? []).join("|").replaceAll(",", "");
for (const [slug, v] of [["bmi-calculator", { weight: "70", height: "175" }], ["gcd-lcm-calculator", { a: "48", b: "180" }], ["percentage-change-calculator", { from: "80", to: "100" }]]) {
  assert.equal(digits(run(slug, v)), digits(nepali.runNepaliMathTool(slug, v)), `${slug} numbers must match the Nepali runner`);
}
// UI: Hindi component uses only Devanagari labels and offers clear + restore-examples controls.
const ui = fs.readFileSync(new URL("../components/HindiMathUtilityWorkspace.tsx", import.meta.url), "utf8");
assert.match(ui, /सभी मान साफ़ करें/);
assert.match(ui, /उदाहरण मान वापस लाएँ/);
console.log("Hindi math utility tests passed.");
