import assert from "node:assert/strict";
import { averageCost, bollingerBands, concentrationRisk, fiftyTwoWeekRange, maxDrawdownPct, portfolioSummary, positionSize, riskReward, transactionCharges } from "../lib/nepse-portfolio.mjs";

const close = (actual, expected, message, eps = 1e-9) => assert.ok(Math.abs(actual - expected) < eps, `${message}: ${actual} vs ${expected}`);

// Charges: band applies to the whole amount; minimum broker fee; invalid input yields null.
let c = transactionCharges(100_000);
close(c.broker, 370, "broker 0.37% band"); close(c.sebon, 15, "SEBON 0.015%"); close(c.dp, 25, "DP"); close(c.total, 410, "total");
close(transactionCharges(1_000).broker, 10, "broker minimum applies");
assert.equal(transactionCharges(0), null);
assert.equal(transactionCharges(Number.NaN), null);
close(transactionCharges(100_000, { dpCharge: 0, sebonRate: 0 }).total, 370, "fee overrides are honoured");
assert.throws(() => transactionCharges(100, { brokerBands: [] }), TypeError);

// Bollinger: population standard deviation, nulls until a full window.
const bb = bollingerBands([1, 2, 3, 4, 5], 5, 2);
assert.deepEqual(bb.slice(0, 4), [null, null, null, null]);
close(bb[4].middle, 3, "BB middle"); close(bb[4].upper, 3 + 2 * Math.SQRT2, "BB upper"); close(bb[4].lower, 3 - 2 * Math.SQRT2, "BB lower");
assert.equal(bollingerBands([1, 2, Number.NaN, 4, 5, 6], 3)[5].middle, 5, "window after the NaN has left is valid again");
assert.equal(bollingerBands([1, 2, Number.NaN, 4], 3)[3], null, "windows containing NaN yield null");
assert.equal(bollingerBands([1, 2, 3], 1), null, "invalid period rejected");

// Risk/reward.
const rr = riskReward({ entry: 100, stop: 90, target: 130 });
assert.equal(rr.valid, true); close(rr.ratio, 3, "ratio"); close(rr.breakEvenWinRatePct, 25, "break-even win rate");
assert.equal(riskReward({ entry: 100, stop: 110, target: 130 }).valid, false);
assert.equal(riskReward({ entry: 100, stop: 90, target: 95 }).valid, false);
assert.equal(riskReward({ entry: 100, stop: 90 }).valid, false);

// Position sizing.
const ps = positionSize({ capital: 100_000, riskPct: 1, entry: 100, stop: 95 });
assert.equal(ps.shares, 200); assert.equal(ps.positionValue, 20_000); assert.equal(ps.riskAtStop, 1_000); assert.equal(ps.cappedByCapital, false);
const capped = positionSize({ capital: 10_000, riskPct: 5, entry: 100, stop: 99 });
assert.equal(capped.shares, 100); assert.equal(capped.cappedByCapital, true);
assert.equal(positionSize({ capital: 1000, riskPct: 1, entry: 100, stop: 100 }).valid, false);
assert.equal(positionSize({ capital: 1000, riskPct: 150, entry: 100, stop: 90 }).valid, false);

// Average cost.
const avg = averageCost([{ quantity: 10, price: 100 }, { quantity: 10, price: 110 }]);
assert.equal(avg.quantity, 20); assert.equal(avg.invested, 2100); close(avg.averagePrice, 105, "average price");
assert.ok(avg.averageCostWithCharges > avg.averagePrice, "charges raise cost per share");
assert.equal(averageCost([{ quantity: 0, price: 100 }]), null);

// Portfolio: 100 @ 100, price 120. Buy charges 40+1.5+25=66.5; sell charges 48+1.8+25=74.8.
// Profit before tax = 12000-74.8-10066.5 = 1858.7; 7.5% tax = 139.4025.
const summary = portfolioSummary([{ symbol: "abc", lots: [{ quantity: 100, price: 100 }] }], { ABC: { price: 120, status: "delayed" } });
const row = summary.rows[0];
assert.equal(row.symbol, "ABC"); assert.equal(row.marketValue, 12_000); assert.equal(row.buyCharges, 66.5);
assert.equal(row.estimatedSellCharges, 74.8); assert.equal(row.estimatedCapitalGainsTax, 139.4); assert.equal(row.unrealizedProfit, 1719.3);
assert.equal(row.priceStatus, "delayed"); assert.equal(summary.complete, true); assert.equal(summary.isEstimate, true);

// Long-term rate applies only when every lot is older than 365 days and a date is supplied.
const longTerm = portfolioSummary([{ symbol: "ABC", lots: [{ quantity: 100, price: 100, date: "2024-01-01" }] }], { ABC: { price: 120 } }, { asOf: "2026-01-01" });
close(longTerm.rows[0].estimatedCapitalGainsTax, 1858.7 * 0.05, "5% long-term rate", 0.01);

// Missing prices are never fabricated.
const partial = portfolioSummary([{ symbol: "ABC", lots: [{ quantity: 100, price: 100 }] }, { symbol: "XYZ", lots: [{ quantity: 10, price: 50 }] }], { ABC: { price: 120 } });
assert.equal(partial.rows[1].marketValue, null); assert.equal(partial.rows[1].returnPct, null);
assert.equal(partial.complete, false); assert.equal(partial.pricedCount, 1); assert.equal(partial.holdingCount, 2);
assert.equal(portfolioSummary([{ symbol: "", lots: [] }], {}).rows[0].valid, false);
assert.equal(portfolioSummary([{ symbol: "ABC", lots: [{ quantity: 1, price: 10 }] }], { ABC: { price: -5 } }).rows[0].marketValue, null, "negative price rejected");

// Concentration and drawdown.
const conc = concentrationRisk([{ valid: true, symbol: "A", marketValue: 750 }, { valid: true, symbol: "B", marketValue: 250 }, { valid: true, symbol: "C", marketValue: null }]);
close(conc.hhi, 0.625, "HHI"); close(conc.effectivePositions, 1.6, "effective positions"); assert.deepEqual(conc.warnings, ["A"]);
assert.equal(concentrationRisk([]).available, false);
close(maxDrawdownPct([100, 120, 60, 90]), 50, "max drawdown");
assert.equal(maxDrawdownPct([100, 90, 80]) > 0, true); assert.equal(maxDrawdownPct([100]), null); assert.equal(maxDrawdownPct([100, 0]), null);

// 52-week range: short history is reported as unavailable, never as a range.
const start = Date.UTC(2025, 0, 1);
const bars = Array.from({ length: 250 }, (_, i) => ({ date: new Date(start + i * 86_400_000).toISOString().slice(0, 10), close: 100 + (i % 50), high: 101 + (i % 50), low: 99 + (i % 50) }));
const range = fiftyTwoWeekRange(bars);
assert.equal(range.available, true); assert.equal(range.high, 150); assert.equal(range.low, 99); assert.equal(range.basis, "intraday high/low"); assert.equal(range.barsUsed, 250);
const closesOnly = fiftyTwoWeekRange(bars.map(({ date, close: cl }) => ({ date, close: cl })));
assert.equal(closesOnly.basis, "closing prices"); assert.equal(closesOnly.high, 149);
const short = fiftyTwoWeekRange(bars.slice(0, 40));
assert.equal(short.available, false); assert.equal(short.barsUsed, 40);
assert.equal(fiftyTwoWeekRange([]).available, false);

console.log("NEPSE portfolio, fee, sizing, risk/reward, Bollinger, drawdown and 52-week range tests passed.");
