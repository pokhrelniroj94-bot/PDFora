import assert from "node:assert/strict";
import { detectLargePriceGaps, normalizeDailyBars, rsi, runBacktest } from "../lib/nepse-quant.mjs";

assert.equal(rsi(Array(20).fill(100), 19), 50, "flat market RSI must be neutral");
assert.equal(rsi(Array.from({length: 20}, (_, i) => 100 + i), 19), 100, "all-up RSI must be 100");
assert.equal(rsi(Array.from({length: 20}, (_, i) => 120 - i), 19), 0, "all-down RSI must be 0");

const normalized = normalizeDailyBars([
  { date: "2026-01-01", close: 100, volume: 10 },
  { date: "2026-01-02", close: 101, volume: 11 },
  { date: "2026-01-02", close: 102, volume: 12 },
  { date: "2026-02-30", close: 103 },
  { date: "2026-01-03", close: -1 },
  { date: "bad-date", close: 100 },
]);
assert.equal(normalized.length, 2, "invalid rows must be dropped and duplicate dates deduplicated");
assert.equal(normalized[1].close, 102, "latest duplicate observation wins");
assert.equal(detectLargePriceGaps([{date:"a",close:100},{date:"b",close:125}])[0].changePct, 25);

const flat = Array.from({length: 100}, (_, i) => ({date:new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10),close:100}));
const flatResult = runBacktest(flat, "sma", 0);
assert.equal(flatResult.trades.length, 0);
assert.equal(flatResult.strategyReturn, 0);
assert.equal(flatResult.benchmarkReturn, 0);
assert.equal(flatResult.maxDrawdown, 0);

const rising = Array.from({length: 120}, (_, i) => ({date:new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10),close:i<65?100:100+(i-65)*1.5}));
const noCost = runBacktest(rising, "sma", 0);
const withCost = runBacktest(rising, "sma", 0.5);
assert.ok(noCost.trades.length > 0, "synthetic trend must trigger a crossover trade");
assert.ok(withCost.strategyReturn < noCost.strategyReturn, "round-trip costs must reduce strategy return");
assert.ok(withCost.benchmarkReturn < noCost.benchmarkReturn, "round-trip costs must reduce benchmark return");
assert.ok(withCost.trades[0].days > 0, "trade holding duration must include entry and exit sessions");
assert.throws(() => runBacktest(flat.slice(0, 40), "sma", 0), /52 valid daily observations/);
console.log("NEPSE quant fixtures passed: RSI, input normalization, corporate-action gap flag, flat market, trend crossover and transaction costs.");
