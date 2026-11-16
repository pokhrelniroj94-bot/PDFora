import assert from "node:assert/strict";
import fs from "node:fs";
import { ensureTypeStripping } from "./lib/load-i18n.mjs";

ensureTypeStripping();

const { parseNumberList, splitWords } = await import("../lib/catalog-inputs.ts");
const { average, breakEvenUnits, discountedPrice, loanEmi, simplifyDecimalRatio, sipFutureValue } = await import("../lib/catalog-calculations.ts");
const { addCalendarDays, calculateAge, dateDifferenceDays } = await import("../lib/date-time-calculations.ts");

assert.deepEqual(parseNumberList("10, 20 30; 40"), [10, 20, 30, 40]);
assert.deepEqual(parseNumberList("-1.5, 0, 2e2"), [-1.5, 0, 200]);
for (const input of ["", ",1", "1,", "1,,2", "1,;2", "1, nope", "Infinity"]) {
  assert.throws(() => parseNumberList(input), undefined, `reject malformed list: ${JSON.stringify(input)}`);
}
assert.equal(average(parseNumberList("1, 2, 3, 4")).mean, 2.5);
assert.deepEqual(splitWords("one two\nthree\tfour"), ["one", "two", "three", "four"]);
assert.deepEqual(splitWords("   "), []);

assert.equal(simplifyDecimalRatio(1920, 1080), "16:9");
assert.equal(simplifyDecimalRatio(0.5, 1), "1:2");
assert.equal(simplifyDecimalRatio(1.25, 0.5), "5:2");
assert.equal(simplifyDecimalRatio(0.000001, 0.000002), "1:2");
assert.throws(() => simplifyDecimalRatio(0, 10));
assert.throws(() => simplifyDecimalRatio(Number.POSITIVE_INFINITY, 10));

assert.equal(addCalendarDays("0099-12-31", 1), "0100-01-01");
assert.deepEqual(calculateAge("0099-01-01", "0099-01-02"), { years: 0, months: 0, days: 1 });
assert.equal(dateDifferenceDays("0099-01-01", "0099-01-03"), 2);

assert.ok(Math.abs(loanEmi(1_000_000, 10, 60) - 21247.039) < 0.01);
assert.equal(loanEmi(1200, 0, 12), 100);
assert.equal(discountedPrice(1000, 20).final, 800);
assert.deepEqual(breakEvenUnits(1001, 500, 300), { units: 6, revenue: 3000 });
assert.deepEqual(breakEvenUnits(0, 500, 300), { units: 0, revenue: 0 });
assert.throws(() => breakEvenUnits(1000, 300, 300));
assert.ok(sipFutureValue(5000, 10, 0, 0) === 600000);

const extraTools = fs.readFileSync(new URL("../components/ExtraTools.tsx", import.meta.url), "utf8");
assert.ok(extraTools.includes('label:"Numbers separated by commas, semicolons or spaces"'), "average calculator label must match accepted separators");

const allTools = fs.readFileSync(new URL("../components/AllTools.tsx", import.meta.url), "utf8");
const discountStart = allTools.indexOf('if(slug==="discount-percentage-calculator")');
const discountEnd = allTools.indexOf('if(slug==="currency-converter")', discountStart);
const discountBranch = allTools.slice(discountStart, discountEnd);
assert.ok(discountBranch.indexOf("part<0") < discountBranch.indexOf("discounted=discountedPrice"), "validate percentage fields before assigning a visible discount result");
assert.ok(discountBranch.includes("Number.isFinite(percentage)"), "reject percentage overflow instead of displaying Infinity");

console.log("Calculator math and edge-case regression checks passed.");
