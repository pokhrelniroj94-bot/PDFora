const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const nepalToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu" }).format(new Date());
function validTradingDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(date + "T00:00:00Z");
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date && date <= nepalToday();
}
function sma(values, period, index) {
  return index + 1 < period ? null : average(values.slice(index - period + 1, index + 1));
}
export function rsi(values, index, period = 14) {
  if (!Array.isArray(values) || !Number.isInteger(index) || !Number.isInteger(period) || period < 1 || index < period || index >= values.length) return null;
  if (values.slice(0, index + 1).some(value => !Number.isFinite(value))) return null;
  let averageGain = 0, averageLoss = 0;
  for (let i = 1; i <= period; i++) {
    const delta = values[i] - values[i - 1];
    averageGain += Math.max(delta, 0);
    averageLoss += Math.max(-delta, 0);
  }
  averageGain /= period;
  averageLoss /= period;
  for (let i = period + 1; i <= index; i++) {
    const delta = values[i] - values[i - 1];
    averageGain = (averageGain * (period - 1) + Math.max(delta, 0)) / period;
    averageLoss = (averageLoss * (period - 1) + Math.max(-delta, 0)) / period;
  }
  if (averageLoss === 0) return averageGain === 0 ? 50 : 100;
  const relativeStrength = averageGain / averageLoss;
  return 100 - 100 / (1 + relativeStrength);
}
export function normalizeOhlcvBars(input) {
  const byDate = new Map();
  for (const row of Array.isArray(input) ? input : []) {
    const rawDate = typeof row?.date === "string" ? row.date.trim() : "";
    const date = rawDate.slice(0, 10), close = Number(row?.close);
    if (!/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(rawDate) || !validTradingDate(date) || !Number.isFinite(close) || close <= 0) continue;
    const rawOpen = row.open, rawHigh = row.high, rawLow = row.low, rawVolume = row.volume;
    const open = rawOpen !== null && rawOpen !== undefined && rawOpen !== "" && Number.isFinite(Number(rawOpen)) && Number(rawOpen) > 0 ? Number(rawOpen) : undefined;
    let high = rawHigh !== null && rawHigh !== undefined && rawHigh !== "" && Number.isFinite(Number(rawHigh)) ? Number(rawHigh) : undefined;
    let low = rawLow !== null && rawLow !== undefined && rawLow !== "" && Number.isFinite(Number(rawLow)) ? Number(rawLow) : undefined;
    if (high === undefined || low === undefined || high < low || high < close || low > close || (open !== undefined && (open > high || open < low))) { high = undefined; low = undefined; }
    const volume = rawVolume !== null && rawVolume !== undefined && rawVolume !== "" && Number.isFinite(Number(rawVolume)) && Number(rawVolume) >= 0 ? Number(rawVolume) : undefined;
    byDate.set(date, { date, close, ...(open === undefined ? {} : { open }), ...(high === undefined ? {} : { high }), ...(low === undefined ? {} : { low }), ...(volume === undefined ? {} : { volume }) });
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}
export function normalizeDailyBars(input) {
  return normalizeOhlcvBars(input).map(({ date, close, volume }) => ({ date, close, ...(volume === undefined ? {} : { volume }) }));
}
export function detectLargePriceGaps(rows, thresholdPct = 20) {
  const gaps = [];
  for (let i = 1; i < rows.length; i++) {
    const changePct = (rows[i].close / rows[i - 1].close - 1) * 100;
    if (Math.abs(changePct) >= thresholdPct) gaps.push({ date: rows[i].date, changePct });
  }
  return gaps;
}
export function runBacktest(input, mode, costPct) {
  if (!["sma", "rsi", "breakout"].includes(mode)) throw new Error("Choose a supported backtest strategy.");
  const rows = normalizeDailyBars(input);
  if (rows.length < 52) throw new Error("At least 52 unique, valid and non-future daily observations are required.");
  const largeGaps = detectLargePriceGaps(rows, 20);
  if (largeGaps.length) throw new Error("Backtest paused: price gaps of 20% or more require corporate-action/source verification before returns can be trusted.");
  const trades = [], closes = rows.map(row => row.close);
  let cash = 1, units = 0, entry = 0, entryCapital = 0, entryDate = "", entryIndex = 0;
  const equity = [], cost = Math.max(0, Math.min(5, Number(costPct) || 0)) / 100;
  for (let i = 51; i < rows.length; i++) {
    const price = closes[i], signalIndex = i - 1, signalPrice = closes[signalIndex];
    const s20 = sma(closes, 20, signalIndex), s50 = sma(closes, 50, signalIndex);
    const prior20 = sma(closes, 20, signalIndex - 1), prior50 = sma(closes, 50, signalIndex - 1);
    const currentRsi = rsi(closes, signalIndex), previousRsi = rsi(closes, signalIndex - 1);
    let buy = false, sell = false;
    if (mode === "sma") {
      buy = s20 !== null && s50 !== null && prior20 !== null && prior50 !== null && s20 > s50 && prior20 <= prior50;
      sell = s20 !== null && s50 !== null && prior20 !== null && prior50 !== null && s20 < s50 && prior20 >= prior50;
    } else if (mode === "rsi") {
      buy = currentRsi !== null && previousRsi !== null && previousRsi < 30 && currentRsi >= 30;
      sell = currentRsi !== null && currentRsi >= 70;
    } else {
      const priorHigh = Math.max(...closes.slice(signalIndex - 20, signalIndex));
      buy = signalPrice > priorHigh && signalPrice > closes[signalIndex - 1];
      sell = signalPrice < (sma(closes, 20, signalIndex) ?? Number.POSITIVE_INFINITY);
    }
    // Evaluate completed session i-1 and execute at session i close.
    if (units === 0 && buy) {
      entry = price * (1 + cost);
      entryCapital = cash;
      units = cash / entry;
      cash = 0;
      entryDate = rows[i].date;
      entryIndex = i;
    } else if (units > 0 && (sell || i === rows.length - 1)) {
      const exit = price * (1 - cost), proceeds = units * exit;
      const pnl = proceeds - entryCapital;
      trades.push({ buyDate: entryDate, sellDate: rows[i].date, buy: entry, sell: exit, returnPct: entryCapital > 0 ? pnl / entryCapital * 100 : 0, pnl, days: i - entryIndex + 1 });
      cash = proceeds;
      units = 0;
      entryCapital = 0;
    }
    equity.push(cash + units * price * (1 - cost));
  }
  const final = equity.at(-1) ?? 1;
  let peak = 1, maxDrawdown = 0;
  for (const value of equity) {
    peak = Math.max(peak, value);
    maxDrawdown = Math.max(maxDrawdown, (peak - value) / peak * 100);
  }
  const wins = trades.filter(trade => trade.pnl > 0), losses = trades.filter(trade => trade.pnl < 0);
  const grossWins = wins.reduce((sum, trade) => sum + trade.pnl, 0);
  const grossLosses = Math.abs(losses.reduce((sum, trade) => sum + trade.pnl, 0));
  const benchmarkStart = rows[51].close * (1 + cost), benchmarkEnd = rows.at(-1).close * (1 - cost);
  const sessionsInMarket = trades.reduce((sum, trade) => sum + trade.days, 0);
  return {
    trades,
    strategyReturn: (final - 1) * 100,
    benchmarkReturn: (benchmarkEnd / benchmarkStart - 1) * 100,
    winRate: trades.length ? wins.length / trades.length * 100 : 0,
    maxDrawdown,
    profitFactor: grossLosses ? grossWins / grossLosses : grossWins ? Infinity : 0,
    exposure: equity.length ? Math.min(100, sessionsInMarket / equity.length * 100) : 0,
    equity,
  };
}

export function calculateMarketRegime(input) {
  const rows = normalizeDailyBars(input);
  if (rows.length < 51) return { label: "Insufficient history", ret20: null, ret50: null, vol: null, close: null, ema20: null, ema50: null, asOf: rows.at(-1)?.date ?? "Unavailable" };
  const closes = rows.map(row => row.close);
  const ema = period => {
    const k = 2 / (period + 1);
    return closes.reduce((values, value, index) => { values.push(index ? value * k + values[index - 1] * (1 - k) : value); return values; }, []);
  };
  const e20 = ema(20), e50 = ema(50), last = closes.length - 1;
  const ret20 = (closes[last] / closes[last - 20] - 1) * 100;
  const ret50 = (closes[last] / closes[last - 50] - 1) * 100;
  const dailyReturns = closes.slice(-21).slice(1).map((value, index) => value / closes.slice(-21)[index] - 1);
  const mean = average(dailyReturns);
  const variance = average(dailyReturns.map(value => (value - mean) ** 2));
  const vol = Math.sqrt(variance) * Math.sqrt(252) * 100;
  const bullish = closes[last] > e20[last] && e20[last] > e50[last] && ret20 > 0;
  const bearish = closes[last] < e20[last] && e20[last] < e50[last] && ret20 < 0;
  return { label: bullish ? "Bullish trend" : bearish ? "Bearish trend" : "Sideways / mixed", ret20, ret50, vol, close: closes[last], ema20: e20[last], ema50: e50[last], asOf: rows[last].date };
}
export function calculateOhlcvIndicators(input) {
  const rows = normalizeOhlcvBars(input);
  const last = rows.at(-1);
  if (!last) return null;
  const candles = rows.slice(-30), full = candles.length >= 15 && candles.every(row => Number.isFinite(row.high) && Number.isFinite(row.low) && row.high >= row.low && row.high >= row.close && row.low <= row.close);
  let atr = null, adx = null;
  if (full) {
    const tr = [], plus = [], minus = [];
    for (let i = 1; i < candles.length; i++) {
      const current = candles[i], previous = candles[i - 1];
      const up = current.high - previous.high, down = previous.low - current.low;
      tr.push(Math.max(current.high - current.low, Math.abs(current.high - previous.close), Math.abs(current.low - previous.close)));
      plus.push(up > down && up > 0 ? up : 0);
      minus.push(down > up && down > 0 ? down : 0);
    }
    const n = 14;
    if (tr.length >= n) {
      let smoothTr = average(tr.slice(0, n)), smoothPlus = average(plus.slice(0, n)), smoothMinus = average(minus.slice(0, n));
      const dx = [];
      const push = () => {
        const p = smoothTr > 0 ? 100 * smoothPlus / smoothTr : 0;
        const m = smoothTr > 0 ? 100 * smoothMinus / smoothTr : 0;
        dx.push(p + m > 0 ? 100 * Math.abs(p - m) / (p + m) : 0);
      };
      push();
      for (let i = n; i < tr.length; i++) {
        smoothTr = smoothTr - smoothTr / n + tr[i] / n;
        smoothPlus = smoothPlus - smoothPlus / n + plus[i] / n;
        smoothMinus = smoothMinus - smoothMinus / n + minus[i] / n;
        push();
      }
      atr = smoothTr;
      // ADX is Wilder-smoothed DX: seed with the first 14 DX values,
      // then apply Wilder smoothing to each subsequent DX observation.
      if (dx.length >= n) {
        adx = average(dx.slice(0, n));
        for (let i = n; i < dx.length; i++) adx = (adx * (n - 1) + dx[i]) / n;
      }
    }
  }
  const priorVolumes = rows.slice(-21, -1).map(row => row.volume).filter(value => Number.isFinite(value) && value >= 0);
  const avgVolume = priorVolumes.length >= 10 ? average(priorVolumes) : null;
  const volumeRatio = avgVolume !== null && avgVolume > 0 && Number.isFinite(last.volume) ? last.volume / avgVolume : null;
  const obvAvailable = rows.every(row => Number.isFinite(row.volume));
  let obvTrend = "Unavailable";
  if (obvAvailable && rows.length >= 21) {
    const obv = Array(rows.length).fill(0);
    for (let i = 1; i < rows.length; i++) obv[i] = obv[i - 1] + (rows[i].close > rows[i - 1].close ? 1 : rows[i].close < rows[i - 1].close ? -1 : 0) * rows[i].volume;
    obvTrend = obv.at(-1) > obv[obv.length - 21] ? "Rising" : obv.at(-1) < obv[obv.length - 21] ? "Falling" : "Flat";
  }
  return { atr, adx, volumeRatio, obvTrend, atrPct: atr === null ? null : atr / last.close * 100 };
}
