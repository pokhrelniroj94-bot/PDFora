import assert from "node:assert/strict";
import {
  calculateNepalSalaryTax,
  calculateSimpleInterest,
  countBusinessDays,
} from "../lib/calculations.ts";

const near = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < 1e-8, label + ": expected " + expected + ", got " + actual);

for (const [income, expected] of [
  [0, 0], [200_000, 2_000], [1_000_000, 10_000], [1_200_000, 30_000],
  [1_500_000, 60_000], [2_500_000, 260_000], [4_000_000, 665_000], [5_000_000, 955_000],
]) near(calculateNepalSalaryTax(income).tax, expected, "FY 2083/84 tax at " + income);
near(calculateNepalSalaryTax(200_000, true).tax, 0, "SSF / eligible first-band exemption");
near(calculateNepalSalaryTax(1_200_000, true).tax, 20_000, "exemption applies only to first band");
near(calculateNepalSalaryTax(200_000).effectiveRate, 1, "effective tax rate");
assert.equal(calculateNepalSalaryTax(0).effectiveRate, 0);
assert.throws(() => calculateNepalSalaryTax(-1), RangeError);
assert.throws(() => calculateNepalSalaryTax(Number.NaN), RangeError);

const interest = calculateSimpleInterest(10_000, 5, 2);
near(interest.interest, 1_000, "simple interest");
near(interest.total, 11_000, "simple-interest maturity value");
near(calculateSimpleInterest(0, 5, 2).total, 0, "zero principal");
assert.throws(() => calculateSimpleInterest(10_000, -1, 2), RangeError);

assert.equal(countBusinessDays("2026-11-01", "2026-11-07", [6]), 6, "Nepal Saturday-only weekend");
assert.equal(countBusinessDays("2026-11-01", "2026-11-07", [0, 6]), 5, "Saturday/Sunday weekend");
assert.equal(countBusinessDays("2026-11-07", "2026-11-07", [6]), 0, "single Saturday");
assert.equal(countBusinessDays("2026-11-07", "2026-11-01", [6]), 6, "reverse date range");
assert.throws(() => countBusinessDays("2026-02-31", "2026-03-01"), RangeError);

console.log("Calculator regression tests passed.");
