import assert from "node:assert/strict";
import test from "node:test";
import { calculateSavings, calculateShare } from "../lib/i18n/nepali-remaining-tools.ts";

test("savings calculator handles zero interest and an existing balance", () => {
  assert.deepEqual(calculateSavings(100000, 10000, 12, 0), { remaining: 90000, monthlyDeposit: 7500 });
  assert.deepEqual(calculateSavings(100000, 120000, 12, 0), { remaining: 0, monthlyDeposit: 0 });
});

test("savings calculator applies monthly compounding for a positive annual rate", () => {
  const noInterest = calculateSavings(100000, 10000, 12, 0);
  const withInterest = calculateSavings(100000, 10000, 12, 12);
  assert.ok(Number.isFinite(withInterest.monthlyDeposit));
  assert.ok(withInterest.monthlyDeposit < noInterest.monthlyDeposit);
});

test("savings calculator rejects invalid boundaries", () => {
  for (const values of [[0, 0, 12, 0], [100, -1, 12, 0], [100, 0, 0, 0], [100, 0, 12, -1], [100, 0, Infinity, 0]]) {
    assert.throws(() => calculateSavings(...values), /मान जाँच/);
  }
});

test("share calculator calculates profit, fee, tax and DP fee", () => {
  const result = calculateShare(10, 100, 120, 0, 5, 25);
  assert.deepEqual(result, { buyValue: 1000, sellValue: 1200, gross: 200, fees: 0, tax: 10, net: 165 });
});

test("share calculator does not charge profit tax on a loss", () => {
  const result = calculateShare(10, 120, 100, 0, 5, 25);
  assert.equal(result.gross, -200);
  assert.equal(result.tax, 0);
  assert.equal(result.net, -225);
});

test("share calculator deducts fees before estimating tax", () => {
  const result = calculateShare(10, 100, 120, 1, 10, 25);
  assert.equal(result.fees, 22);
  assert.equal(result.tax, 17.8);
  assert.equal(result.net, 135.2);
});

test("share calculator rejects invalid quantities and negative costs/rates", () => {
  for (const values of [[0, 100, 120, 0, 0, 0], [1, -1, 120, 0, 0, 0], [1, 100, 120, -1, 0, 0], [1, 100, 120, 0, -1, 0], [1, 100, 120, 0, 0, -1], [1, NaN, 120, 0, 0, 0]]) {
    assert.throws(() => calculateShare(...values), /मान जाँच/);
  }
});
