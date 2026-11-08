// Deterministic, dependency-free NEPSE portfolio and risk calculations.
//
// Everything here is a pure function of its inputs: no network access, no storage and no
// invented data. If an input (for example a current price) is missing the corresponding output
// is null and the result is flagged as incomplete instead of being estimated.
//
// FEES: the defaults below reflect the commonly published NEPSE broker-commission bands,
// the SEBON fee, the DP charge and capital-gains-tax rates for individuals. These rules change
// and brokers differ, so they are only DEFAULTS. Callers must let users edit them, and every
// figure produced from them is an ESTIMATE that must not be presented as a broker statement.

export const DEFAULT_FEE_CONFIG = Object.freeze({
  // The band is selected by the total transaction amount and its rate applies to the whole amount.
  brokerBands: Object.freeze([
    Object.freeze({ upTo: 50_000, rate: 0.004 }),
    Object.freeze({ upTo: 500_000, rate: 0.0037 }),
    Object.freeze({ upTo: 2_000_000, rate: 0.0034 }),
    Object.freeze({ upTo: 10_000_000, rate: 0.003 }),
    Object.freeze({ upTo: Infinity, rate: 0.0027 }),
  ]),
  brokerMinimum: 10,
  sebonRate: 0.00015,
  dpCharge: 25,
  capitalGainsShortRate: 0.075,
  capitalGainsLongRate: 0.05,
  longTermDays: 365,
});

const isNum = (value) => typeof value === "number" && Number.isFinite(value);
const isPositive = (value) => isNum(value) && value > 0;
const round = (value, digits = 2) => (isNum(value) ? Math.round((value + Number.EPSILON) * 10 ** digits) / 10 ** digits : null);

function mergeFees(overrides) {
  const config = { ...DEFAULT_FEE_CONFIG, ...(overrides ?? {}) };
  const valid = Array.isArray(config.brokerBands) && config.brokerBands.length > 0
    && config.brokerBands.every((band) => isNum(band.rate) && band.rate >= 0 && (band.upTo === Infinity || isPositive(band.upTo)));
  if (!valid) throw new TypeError("brokerBands must be a non-empty list of { upTo, rate } with non-negative rates");
  for (const key of ["brokerMinimum", "sebonRate", "dpCharge", "capitalGainsShortRate", "capitalGainsLongRate", "longTermDays"]) {
    if (!isNum(config[key]) || config[key] < 0) throw new TypeError(`${key} must be a non-negative number`);
  }
  return config;
}

/** Estimated charges on one transaction of `amount` NPR (quantity x price). */
export function transactionCharges(amount, feeOverrides) {
  if (!isPositive(amount)) return null;
  const fees = mergeFees(feeOverrides);
  const sorted = [...fees.brokerBands].sort((a, b) => a.upTo - b.upTo);
  const band = sorted.find((item) => amount <= item.upTo) ?? sorted[sorted.length - 1];
  const broker = Math.max(amount * band.rate, fees.brokerMinimum);
  const sebon = amount * fees.sebonRate;
  const dp = fees.dpCharge;
  return { broker, sebon, dp, total: broker + sebon + dp };
}

/**
 * Bollinger Bands using the simple moving average and the POPULATION standard deviation
 * over `period` closes. Entries are null until a full window of finite values exists.
 */
export function bollingerBands(values, period = 20, multiplier = 2) {
  if (!Array.isArray(values) || !Number.isInteger(period) || period < 2 || !isNum(multiplier) || multiplier <= 0) return null;
  return values.map((_, index) => {
    if (index < period - 1) return null;
    const window = values.slice(index - period + 1, index + 1);
    if (!window.every(isNum)) return null;
    const mean = window.reduce((sum, value) => sum + value, 0) / period;
    const variance = window.reduce((sum, value) => sum + (value - mean) ** 2, 0) / period;
    const deviation = Math.sqrt(variance);
    return { middle: mean, upper: mean + multiplier * deviation, lower: mean - multiplier * deviation, bandwidth: mean === 0 ? null : (2 * multiplier * deviation) / mean };
  });
}

/**
 * 52-week high and low from daily bars ({ date: "YYYY-MM-DD", close, high?, low? }), sorted or not.
 * Returns { available: false, ... } rather than a misleading range when the history is too short.
 */
export function fiftyTwoWeekRange(bars, { minBars = 200 } = {}) {
  const rows = (Array.isArray(bars) ? bars : [])
    .filter((bar) => bar && typeof bar.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(bar.date) && isPositive(bar.close))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (!rows.length) return { available: false, reason: "No valid daily bars were provided.", barsUsed: 0 };
  const last = new Date(`${rows[rows.length - 1].date}T00:00:00Z`);
  const start = new Date(last);
  start.setUTCDate(start.getUTCDate() - 365);
  const windowRows = rows.filter((bar) => new Date(`${bar.date}T00:00:00Z`) >= start);
  if (windowRows.length < minBars) {
    return { available: false, reason: `Only ${windowRows.length} daily bars cover the last 52 weeks; at least ${minBars} are required.`, barsUsed: windowRows.length };
  }
  const usesHighLow = windowRows.every((bar) => isPositive(bar.high) && isPositive(bar.low));
  const highs = windowRows.map((bar) => (usesHighLow ? bar.high : bar.close));
  const lows = windowRows.map((bar) => (usesHighLow ? bar.low : bar.close));
  return { available: true, high: Math.max(...highs), low: Math.min(...lows), basis: usesHighLow ? "intraday high/low" : "closing prices", barsUsed: windowRows.length, from: windowRows[0].date, to: rows[rows.length - 1].date };
}

/** Risk/reward for a long trade. Returns { valid: false, reason } on inconsistent levels. */
export function riskReward({ entry, stop, target }) {
  if (![entry, stop, target].every(isPositive)) return { valid: false, reason: "Entry, stop and target must be positive numbers." };
  if (!(stop < entry)) return { valid: false, reason: "For a long trade the stop must be below the entry." };
  if (!(target > entry)) return { valid: false, reason: "For a long trade the target must be above the entry." };
  const risk = entry - stop;
  const reward = target - entry;
  const ratio = reward / risk;
  return { valid: true, riskPerShare: risk, rewardPerShare: reward, ratio, breakEvenWinRatePct: (1 / (1 + ratio)) * 100 };
}

/** Fixed-fractional position size for a long trade, capped by available capital. */
export function positionSize({ capital, riskPct, entry, stop }) {
  if (![capital, riskPct, entry, stop].every(isPositive)) return { valid: false, reason: "Capital, risk %, entry and stop must be positive numbers." };
  if (riskPct > 100) return { valid: false, reason: "Risk % cannot exceed 100." };
  if (!(stop < entry)) return { valid: false, reason: "For a long trade the stop must be below the entry." };
  const riskAmount = capital * (riskPct / 100);
  const perShareRisk = entry - stop;
  const byRisk = Math.floor(riskAmount / perShareRisk);
  const byCapital = Math.floor(capital / entry);
  const shares = Math.min(byRisk, byCapital);
  return {
    valid: true,
    shares,
    cappedByCapital: byCapital < byRisk,
    positionValue: shares * entry,
    plannedRiskAmount: riskAmount,
    riskAtStop: shares * perShareRisk,
  };
}

/** Quantity-weighted average cost per share including buy charges, from a list of lots. */
export function averageCost(lots, feeOverrides) {
  const valid = (Array.isArray(lots) ? lots : []).filter((lot) => lot && isPositive(lot.quantity) && isPositive(lot.price));
  if (!valid.length) return null;
  let quantity = 0;
  let invested = 0;
  let charges = 0;
  for (const lot of valid) {
    const amount = lot.quantity * lot.price;
    quantity += lot.quantity;
    invested += amount;
    charges += transactionCharges(amount, feeOverrides).total;
  }
  return { quantity, invested, buyCharges: charges, averagePrice: invested / quantity, averageCostWithCharges: (invested + charges) / quantity };
}

/**
 * Portfolio summary. `holdings` is [{ symbol, lots: [{ quantity, price, date? }] }] and `prices` is
 * { SYMBOL: { price, asOf?, status? } }. Holdings without a usable price are listed with null
 * market values and excluded from totals; `complete` is false in that case.
 */
export function portfolioSummary(holdings, prices, { fees, asOf } = {}) {
  const today = asOf ? new Date(asOf) : null;
  const rows = (Array.isArray(holdings) ? holdings : []).map((holding) => {
    const symbol = String(holding?.symbol ?? "").trim().toUpperCase();
    const cost = averageCost(holding?.lots, fees);
    if (!symbol || !cost) return { symbol: symbol || null, valid: false, reason: "Holding needs a symbol and at least one lot with positive quantity and price." };
    const quote = prices?.[symbol];
    const price = isPositive(quote?.price) ? quote.price : null;
    const row = { symbol, valid: true, quantity: cost.quantity, averagePrice: round(cost.averagePrice, 4), invested: round(cost.invested), buyCharges: round(cost.buyCharges), priceStatus: quote?.status ?? null, priceAsOf: quote?.asOf ?? null, price: price, marketValue: null, estimatedSellCharges: null, estimatedCapitalGainsTax: null, estimatedNetValue: null, unrealizedProfit: null, returnPct: null };
    if (price === null) return row;
    const amount = cost.quantity * price;
    const sell = transactionCharges(amount, fees);
    const config = mergeFees(fees);
    const profitBeforeTax = amount - sell.total - (cost.invested + cost.buyCharges);
    let taxRate = config.capitalGainsShortRate;
    if (today && Array.isArray(holding.lots) && holding.lots.length && holding.lots.every((lot) => lot.date && new Date(lot.date) <= new Date(today))) {
      const held = Math.min(...holding.lots.map((lot) => (today - new Date(lot.date)) / 86_400_000));
      if (held > config.longTermDays) taxRate = config.capitalGainsLongRate;
    }
    const tax = profitBeforeTax > 0 ? profitBeforeTax * taxRate : 0;
    const totalCost = cost.invested + cost.buyCharges;
    row.marketValue = round(amount);
    row.estimatedSellCharges = round(sell.total);
    row.estimatedCapitalGainsTax = round(tax);
    row.estimatedNetValue = round(amount - sell.total - tax);
    row.unrealizedProfit = round(profitBeforeTax - tax);
    row.returnPct = round(((profitBeforeTax - tax) / totalCost) * 100);
    return row;
  });
  const valid = rows.filter((row) => row.valid);
  const priced = valid.filter((row) => row.marketValue !== null);
  const invested = priced.reduce((sum, row) => sum + row.invested + row.buyCharges, 0);
  const profit = priced.reduce((sum, row) => sum + row.unrealizedProfit, 0);
  return {
    rows,
    complete: valid.length > 0 && priced.length === valid.length && rows.length === valid.length,
    pricedCount: priced.length,
    holdingCount: valid.length,
    totalInvestedPricedHoldings: round(invested),
    totalMarketValue: round(priced.reduce((sum, row) => sum + row.marketValue, 0)),
    totalUnrealizedProfit: round(profit),
    totalReturnPct: invested > 0 ? round((profit / invested) * 100) : null,
    isEstimate: true,
  };
}

/**
 * Concentration of priced holdings: weights, Herfindahl-Hirschman index, effective number of
 * positions and a warning when the largest position exceeds `maxWeightPct`. Thresholds are
 * conventional heuristics, not recommendations.
 */
export function concentrationRisk(rows, { maxWeightPct = 25 } = {}) {
  const priced = (Array.isArray(rows) ? rows : []).filter((row) => row?.valid && isPositive(row.marketValue));
  const total = priced.reduce((sum, row) => sum + row.marketValue, 0);
  if (!priced.length || total <= 0) return { available: false, reason: "No priced holdings." };
  const weights = priced.map((row) => ({ symbol: row.symbol, weightPct: (row.marketValue / total) * 100 })).sort((a, b) => b.weightPct - a.weightPct);
  const hhi = weights.reduce((sum, item) => sum + (item.weightPct / 100) ** 2, 0);
  return { available: true, weights, hhi, effectivePositions: 1 / hhi, largest: weights[0], warnings: weights.filter((item) => item.weightPct > maxWeightPct).map((item) => item.symbol) };
}

/** Maximum peak-to-trough decline (percent, positive) of a close series. Null if invalid. */
export function maxDrawdownPct(closes) {
  if (!Array.isArray(closes) || closes.length < 2 || !closes.every(isPositive)) return null;
  let peak = closes[0];
  let worst = 0;
  for (const close of closes) {
    if (close > peak) peak = close;
    worst = Math.max(worst, (peak - close) / peak);
  }
  return worst * 100;
}
