import assert from "node:assert/strict";
import { calculateMarketRegime, calculateOhlcvIndicators, detectLargePriceGaps, normalizeDailyBars, rsi, runBacktest } from "../lib/nepse-quant.mjs";

assert.equal(rsi(Array(20).fill(100), 19), 50, "flat market RSI must be neutral");
assert.equal(rsi(Array.from({length: 20}, (_, i) => 100 + i), 19), 100, "all-up RSI must be 100");
assert.equal(rsi(Array.from({length: 20}, (_, i) => 120 - i), 19), 0, "all-down RSI must be 0");
const wilderSequence = [...Array.from({length: 15}, (_, i) => 100 + i), 113];
assert.ok(Math.abs(rsi(wilderSequence, 15) - (100 - 100 / 14)) < 1e-9, "RSI must use Wilder smoothing after the initial period");

const normalized = normalizeDailyBars([
  { date: "2026-01-01", close: 100, volume: 10 },
  { date: "2026-01-02", close: 101, volume: 11 },
  { date: "2026-01-02", close: 102, volume: 12 },
  { date: "2026-02-30", close: 103 },
  { date: "2099-01-01", close: 104 },
  { date: "2026-01-03", close: -1 },
  { date: "bad-date", close: 100 },
]);
assert.equal(normalized.length, 2, "invalid rows must be dropped and duplicate dates deduplicated");
assert.equal(normalized[1].close, 102, "latest duplicate observation wins");
assert.equal(detectLargePriceGaps([{date:"a",close:100},{date:"b",close:125}])[0].changePct, 25);

const trend51 = Array.from({length: 51}, (_, i) => ({date:new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10),close:100+i}));
const regime = calculateMarketRegime(trend51);
assert.equal(regime.label, "Bullish trend", "51 valid rising sessions must produce a bullish regime");
assert.ok(Number.isFinite(regime.ret20) && Number.isFinite(regime.ret50) && Number.isFinite(regime.vol));
assert.equal(calculateMarketRegime(trend51.slice(0,50)).label, "Insufficient history", "50 sessions are insufficient for a 50-session return");

const candles = Array.from({length:30}, (_, i) => ({date:new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10),close:100,high:105,low:95,volume:i===29?200:100}));
const diagnostics = calculateOhlcvIndicators(candles);
assert.equal(diagnostics.atr, 10, "Wilder ATR should equal constant true range");
assert.equal(diagnostics.adx, 0, "flat candles should have zero directional trend strength");
assert.equal(diagnostics.volumeRatio, 2, "latest volume should compare with prior 20 sessions");
assert.equal(diagnostics.obvTrend, "Flat", "flat close and volume history should produce flat OBV");
assert.equal(calculateOhlcvIndicators(candles.map((row,i)=>i===29?{...row,high:90}:row)).atr, null, "inconsistent OHLC ranges must disable ATR rather than fabricate a value");
assert.equal(calculateOhlcvIndicators(candles.map(({volume,...row})=>row)).obvTrend, "Unavailable", "OBV must remain unavailable without complete volume data");

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
assert.equal(runBacktest(rising, "sma", 20).strategyReturn, runBacktest(rising, "sma", 5).strategyReturn, "backtest cost input must be capped at five percent per side");
assert.equal(runBacktest(rising, "sma", -1).strategyReturn, noCost.strategyReturn, "negative transaction costs must be clamped to zero");
assert.throws(() => runBacktest(flat.slice(0, 40), "sma", 0), /52 valid daily observations/);
console.log("NEPSE quant fixtures passed: RSI, data validation, 20/50-session market regime, Wilder ATR/ADX, volume ratio, OBV, price-gap flags, backtest and transaction costs.");
