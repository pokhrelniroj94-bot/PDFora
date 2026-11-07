const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
function sma(values, period, index) {
  return index + 1 < period ? null : average(values.slice(index - period + 1, index + 1));
}
export function rsi(values, index, period = 14) {
  if (index < period) return null;
  let gain = 0, loss = 0;
  for (let i = index - period + 1; i <= index; i++) {
    const delta = values[i] - values[i - 1];
    gain += Math.max(delta, 0);
    loss += Math.max(-delta, 0);
  }
  if (loss === 0) return gain === 0 ? 50 : 100;
  return 100 - 100 / (1 + gain / loss);
}
export function normalizeDailyBars(input) {
  const byDate = new Map();
  for (const row of Array.isArray(input) ? input : []) {
    const date = String(row?.date ?? "").slice(0, 10);
    const close = Number(row?.close);
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(date) || !Number.isFinite(Date.parse(date + "T00:00:00Z")) || new Date(date + "T00:00:00Z").toISOString().slice(0, 10) !== date || !Number.isFinite(close) || close <= 0) continue;
    const volume = Number(row?.volume);
    byDate.set(date, { date, close, ...(Number.isFinite(volume) && volume >= 0 ? { volume } : {}) });
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}
export function detectLargePriceGaps(rows, thresholdPct = 20) {
  const gaps = [];
  for (let i = 1; i < rows.length; i++) {
    const changePct = (rows[i].close / rows[i - 1].close - 1) * 100;
    if (Math.abs(changePct) >= thresholdPct) gaps.push({ date: rows[i].date, changePct });
  }
  return gaps;
}
export function runBacktest(rows, mode, costPct) {
  if (!Array.isArray(rows) || rows.length < 52) throw new Error("At least 52 valid daily observations are required.");
  if (rows.some(row => !Number.isFinite(row.close) || row.close <= 0)) throw new Error("Backtest input contains an invalid closing price.");
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
  const benchmarkStart = rows[50].close * (1 + cost), benchmarkEnd = rows.at(-1).close * (1 - cost);
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
