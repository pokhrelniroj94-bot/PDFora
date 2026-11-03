"use client";

import { useState } from "react";

type Point = { date: string; open?: number; high?: number; low?: number; close: number; volume?: number };
type Analysis = {
  count: number; latestDate: string; close: number; ema20: number; ema50: number; rsi: number;
  macd: number; macdSignal: number; score: number; signal: "Bullish setup" | "Bearish setup" | "Wait / neutral";
  volatility: number; risk: "Lower" | "Moderate" | "High" | "Very high";
  support: number; resistance: number; stop: number | null; target: number | null;
  entry: string; risks: string[]; reasons: string[]; annualizer: number;
};

const cls = "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100";
const card = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5";
const avg = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
function ema(values: number[], period: number) {
  const k = 2 / (period + 1);
  let value = values[0] ?? 0;
  return values.map((item, index) => { value = index === 0 ? item : item * k + value * (1 - k); return value; });
}
function rsi(values: number[], period = 14) {
  if (values.length <= period) return 50;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const delta = values[i] - values[i - 1];
    if (delta > 0) gains += delta; else losses -= delta;
  }
  let averageGain = gains / period, averageLoss = losses / period;
  for (let i = period + 1; i < values.length; i++) {
    const delta = values[i] - values[i - 1];
    averageGain = (averageGain * (period - 1) + Math.max(delta, 0)) / period;
    averageLoss = (averageLoss * (period - 1) + Math.max(-delta, 0)) / period;
  }
  if (averageLoss === 0) return 100;
  const rs = averageGain / averageLoss;
  return 100 - 100 / (1 + rs);
}
function analyse(points: Point[], asset: string): Analysis | null {
  const rows = points.filter((p) => Number.isFinite(p.close) && p.close > 0).sort((a, b) => a.date.localeCompare(b.date));
  if (rows.length < 50) return null;
  const closes = rows.map((p) => p.close);
  const e20 = ema(closes, 20), e50 = ema(closes, 50);
  const fast = ema(closes, 12), slow = ema(closes, 26);
  const macdLine = fast.map((v, i) => v - slow[i]);
  const macdSignal = ema(macdLine, 9);
  const last = rows[rows.length - 1];
  const i = closes.length - 1;
  const rsiValue = rsi(closes);
  const trendUp = last.close > e20[i] && e20[i] > e50[i];
  const trendDown = last.close < e20[i] && e20[i] < e50[i];
  const macdHist = macdLine[i] - macdSignal[i];
  const recentReturns = closes.slice(-21).slice(1).map((v, j) => (v / closes.slice(-21)[j]) - 1).filter(Number.isFinite);
  const dailyVol = Math.sqrt(avg(recentReturns.map((v) => (v - avg(recentReturns)) ** 2)));
  const annualizer = asset === "crypto" ? 365 : 252;
  const volatility = dailyVol * Math.sqrt(annualizer) * 100;
  const change5 = closes.length > 5 ? (last.close / closes[closes.length - 6] - 1) * 100 : 0;
  const volumes = rows.slice(-21).map((p) => p.volume).filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const volumeConfirm = volumes.length >= 10 && typeof last.volume === "number" && last.volume > avg(volumes.slice(0, -1)) * 1.15;
  let score = 0;
  const reasons: string[] = [];
  if (trendUp) { score += 2; reasons.push("Price is above EMA20 and EMA20 is above EMA50 (uptrend alignment)."); }
  else if (trendDown) { score -= 2; reasons.push("Price is below EMA20 and EMA20 is below EMA50 (downtrend alignment)."); }
  else reasons.push("EMA20 and EMA50 do not show a clear aligned trend.");
  if (rsiValue >= 52 && rsiValue <= 68) { score += 1; reasons.push("RSI shows positive momentum without an extreme overbought reading."); }
  else if (rsiValue <= 42) { score -= 1; reasons.push("RSI is weak; momentum risk remains."); }
  else if (rsiValue >= 72) reasons.push("RSI is elevated; chasing a new long entry may carry pullback risk.");
  if (macdHist > 0) { score += 1; reasons.push("MACD histogram is positive."); }
  else if (macdHist < 0) { score -= 1; reasons.push("MACD histogram is negative."); }
  if (change5 > 2) { score += 1; reasons.push("Five-session momentum is positive."); }
  else if (change5 < -2) { score -= 1; reasons.push("Five-session momentum is negative."); }
  if (volumeConfirm && last.close > rows[rows.length - 2].close) { score += 1; reasons.push("Latest volume is above its recent average while price is rising."); }
  if (volumeConfirm && last.close < rows[rows.length - 2].close) { score -= 1; reasons.push("Latest volume is above its recent average while price is falling."); }
  const signal = score >= 3 ? "Bullish setup" : score <= -3 ? "Bearish setup" : "Wait / neutral";
  const recent = rows.slice(-20);
  const lows = recent.map((p) => p.low).filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v > 0);
  const highs = recent.map((p) => p.high).filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v > 0);
  const support = lows.length ? Math.min(...lows) : Math.min(...recent.map((p) => p.close));
  const resistance = highs.length ? Math.max(...highs) : Math.max(...recent.map((p) => p.close));
  const risk = volatility > (asset === "crypto" ? 85 : asset === "forex" ? 22 : 48) ? "Very high"
    : volatility > (asset === "crypto" ? 55 : asset === "forex" ? 14 : 32) ? "High"
    : volatility > (asset === "crypto" ? 30 : asset === "forex" ? 8 : 18) ? "Moderate" : "Lower";
  let stop: number | null = null, target: number | null = null;
  if (signal === "Bullish setup") {
    stop = lows.length ? support * 0.995 : last.close * (1 - Math.max(0.015, dailyVol * 2));
    target = last.close + 2 * (last.close - stop);
  } else if (signal === "Bearish setup") {
    stop = highs.length ? resistance * 1.005 : last.close * (1 + Math.max(0.015, dailyVol * 2));
    target = last.close - 2 * (stop - last.close);
  }
  const risks: string[] = [];
  const ageDays = Math.max(0, (Date.now() - Date.parse(last.date)) / 86400000);
  if (Number.isFinite(ageDays) && ageDays > (asset === "crypto" ? 2 : 5)) risks.push("The latest observation is stale for this market. Refresh the file before relying on this analysis.");
  if (risk === "High" || risk === "Very high") risks.push("Recent annualized volatility is elevated for this asset class.");
  if (rsiValue >= 72) risks.push("RSI is overbought; a pullback can occur even while the broader trend is positive.");
  if (rsiValue <= 28) risks.push("RSI is deeply oversold; this is not proof that a bottom has formed.");
  if (rows.length < 100) risks.push("The history is limited; longer-term trend context may be incomplete.");
  if (!volumeConfirm) risks.push("No strong volume confirmation was detected, or volume data is unavailable.");
  if (!lows.length || !highs.length) risks.push("The file/source has no full OHLC range; support, resistance and risk levels are close-based estimates.");
  const entry = signal === "Bullish setup"
    ? `Potential long setup only after a completed candle holds above EMA20 (${e20[i].toFixed(4)}) and the next session confirms. Avoid chasing a sharp gap.`
    : signal === "Bearish setup"
      ? `Downside/exit pressure is present while price remains below EMA20 (${e20[i].toFixed(4)}). A short setup requires a separate risk plan and may not be suitable for every market.`
      : `Wait for a confirmed close above EMA20 (${e20[i].toFixed(4)}) with improving momentum, or a confirmed breakdown below support. Current indicators are mixed.`;
  return { count: rows.length, latestDate: last.date, close: last.close, ema20: e20[i], ema50: e50[i], rsi: rsiValue, macd: macdLine[i], macdSignal: macdSignal[i], score, signal, volatility, risk, support, resistance, stop, target, entry, risks, reasons, annualizer };
}
function splitCsvLine(line: string) {
  const cells: string[] = [];
  let cell = "", quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"' && quoted) { cell += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { cells.push(cell.trim()); cell = ""; }
    else cell += char;
  }
  cells.push(cell.trim());
  return cells;
}
function parseCsv(text: string): Point[] {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 51) throw new Error("Upload at least 50 daily rows of historical data.");
  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const find = (...names: string[]) => headers.findIndex((h) => names.includes(h));
  const dateIndex = find("date", "time", "datetime", "timestamp");
  const closeIndex = find("close", "adjclose", "last");
  const openIndex = find("open"), highIndex = find("high"), lowIndex = find("low"), volumeIndex = find("volume", "vol");
  if (dateIndex < 0 || closeIndex < 0) throw new Error("CSV needs Date/Time and Close columns. OHLCV columns are recommended.");
  const rows = lines.slice(1).map((line) => {
    const c = splitCsvLine(line);
    const num = (index: number) => index < 0 ? undefined : Number(c[index]?.replace(/,/g, ""));
    const dateRaw = c[dateIndex] || "";
    const date = Number.isFinite(Number(dateRaw)) && dateRaw.length > 9 ? new Date(Number(dateRaw)).toISOString().slice(0, 10) : dateRaw.slice(0, 10);
    return { date, open: num(openIndex), high: num(highIndex), low: num(lowIndex), close: num(closeIndex) ?? NaN, volume: num(volumeIndex) };
  }).filter((p) => p.date && Number.isFinite(p.close) && p.close > 0);
  if (rows.length < 50) throw new Error("Fewer than 50 valid price rows were found in the CSV.");
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}
const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 4 });
const pct = (v: number) => v.toFixed(2) + "%";

export default function MarketIntelligence() {
  const [asset, setAsset] = useState("nepse");
  const [symbol, setSymbol] = useState("NEPSE");
  const [marketSymbol, setMarketSymbol] = useState("EUR/USD");
  const [points, setPoints] = useState<Point[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiBusy, setAiBusy] = useState(false);

  async function loadNepse() {
    setBusy(true); setError(""); setAnalysis(null); setAiText("");
    try {
      const response = await fetch("/api/nepse-market?symbol=" + encodeURIComponent(symbol.trim().toUpperCase()) + "&period=1Y", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "NEPSE data is unavailable.");
      const rows = (data.points || []).map((p: Record<string, unknown>) => ({
        date: String(p.date || ""), open: Number(p.open) || undefined, high: Number(p.high) || undefined,
        low: Number(p.low) || undefined, close: Number(p.close), volume: Number(p.volume) || undefined,
      })).filter((p: Point) => p.date && Number.isFinite(p.close) && p.close > 0);
      const result = analyse(rows, "nepse");
      if (!result) throw new Error("At least 50 valid historical daily prices are required for analysis.");
      setPoints(rows); setAnalysis(result); setSource(`${data.source || "YONEPSE dataset"} · latest history ${data.latestHistoryDate || result.latestDate}`);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to analyse NEPSE data."); }
    finally { setBusy(false); }
  }

  async function loadCsv(file?: File) {
    if (!file) return;
    setBusy(true); setError(""); setAnalysis(null); setAiText("");
    try {
      const rows = parseCsv(await file.text());
      const result = analyse(rows, asset);
      if (!result) throw new Error("At least 50 valid historical daily prices are required.");
      setPoints(rows); setAnalysis(result); setSource(`Uploaded file: ${file.name} · ${rows.length} rows`);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not read this CSV."); }
    finally { setBusy(false); }
  }

  async function explainWithAI() {
    if (!analysis) return;
    setAiBusy(true); setError(""); setAiText("");
    try {
      const response = await fetch("/api/ai-writing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        kind: "market-explain",
        analysis: JSON.stringify({ asset, symbol: asset === "nepse" ? symbol : marketSymbol, ...analysis, reasons: analysis.reasons, risks: analysis.risks }),
      }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Free AI explanation is unavailable.");
      setAiText(String(payload.text || ""));
    } catch (err) { setError(err instanceof Error ? err.message : "AI explanation unavailable."); }
    finally { setAiBusy(false); }
  }

  const scoreTone = analysis?.signal === "Bullish setup" ? "text-emerald-700" : analysis?.signal === "Bearish setup" ? "text-rose-700" : "text-amber-700";
  return <div className="space-y-6">
    <header>
      <p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">PDFora Smart Market AI</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Market Intelligence & Risk Analyzer</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Analyse NEPSE, Forex and Crypto price history with trend, momentum, volatility, support/resistance and rule-based entry/exit conditions. Optional free AI explains the calculated results.</p>
    </header>

    <section className={card}>
      <div className="mb-4 flex flex-wrap gap-2">
        {([["nepse","NEPSE"],["forex","Forex"],["crypto","Crypto"]] as const).map(([key,label]) => <button type="button" key={key} onClick={() => { setAsset(key); setAnalysis(null); setError(""); setAiText(""); }} className={"rounded-full px-4 py-2 text-sm font-bold " + (asset === key ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-teal-50")}>{label}</button>)}
      </div>
      {asset === "nepse" ? <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1"><span className="mb-1.5 block text-sm font-semibold text-slate-700">NEPSE symbol / index</span><input className={cls} value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="NEPSE, NABIL, NICA…" /></label>
        <button type="button" onClick={() => void loadNepse()} disabled={busy || !symbol.trim()} className="self-end rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Analysing…" : "Analyse NEPSE"}</button>
      </div> : <div className="space-y-3">
        <label className="block max-w-sm"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{asset === "forex" ? "Forex pair" : "Crypto pair"}</span><input className={cls} value={marketSymbol} onChange={(e) => setMarketSymbol(e.target.value)} placeholder={asset === "forex" ? "EUR/USD" : "BTC/USD"} /></label>
        <p className="text-sm text-slate-700">Upload a CSV exported from your broker or exchange. Required columns: <code>Date, Close</code>. Recommended: <code>Date, Open, High, Low, Close, Volume</code>. At least 50 daily rows are needed.</p>
        <input className={cls} type="file" accept=".csv,text/csv" onChange={(e) => void loadCsv(e.target.files?.[0])} />
        <p className="text-xs leading-5 text-slate-500">PDFora does not scrape third-party Forex/Crypto feeds without display and analysis rights. CSV analysis runs on the uploaded historical data. Do not upload account credentials or private keys.</p>
      </div>}
    </section>

    {error && <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}
    {analysis && <div className="space-y-5">
      <section className={card}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Computed technical setup</p><h2 className={"mt-2 text-2xl font-black " + scoreTone}>{analysis.signal}</h2><p className="mt-1 text-sm text-slate-500">{asset.toUpperCase()} · {asset === "nepse" ? symbol : marketSymbol} · {analysis.latestDate}</p></div>
          <div className="rounded-xl bg-slate-100 px-4 py-3 text-center"><p className="text-xs text-slate-500">Confluence score</p><p className="text-2xl font-black tabular-nums">{analysis.score > 0 ? "+" : ""}{analysis.score}</p><p className="text-[10px] text-slate-500">Not a win probability</p></div>
        </div>
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{analysis.entry}</p>
        <p className="mt-3 text-xs text-slate-500">Data: {source} · {analysis.count} daily observations. Signals are rule-based technical conditions, not a prediction or a personal trade recommendation.</p>
      </section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {([["Latest close",fmt(analysis.close)],["RSI (14)",analysis.rsi.toFixed(1)],["EMA 20 / 50",fmt(analysis.ema20)+" / "+fmt(analysis.ema50)],["Annualized volatility",pct(analysis.volatility)]]).map(([label,value]) => <div className={card} key={label}><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-lg font-black tabular-nums text-slate-900">{value}</p></div>)}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className={card}><h3 className="font-extrabold text-slate-900">Risk & key levels</h3><p className="mt-2 text-sm">Volatility-based risk: <strong>{analysis.risk}</strong></p><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-500">20-session support</dt><dd className="mt-1 font-bold">{fmt(analysis.support)}</dd></div><div><dt className="text-slate-500">20-session resistance</dt><dd className="mt-1 font-bold">{fmt(analysis.resistance)}</dd></div><div><dt className="text-slate-500">Illustrative stop level</dt><dd className="mt-1 font-bold">{analysis.stop === null ? "—" : fmt(analysis.stop)}</dd></div><div><dt className="text-slate-500">Illustrative 2R target</dt><dd className="mt-1 font-bold">{analysis.target === null ? "—" : fmt(analysis.target)}</dd></div></dl><p className="mt-3 text-xs text-slate-500">Levels are estimates from the last 20 observations. Gaps, fees, slippage and liquidity can change actual outcomes.</p></div>
        <div className={card}><h3 className="font-extrabold text-slate-900">Why the engine reached this view</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-slate-700">{analysis.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>
      </section>
      <section className={card}><h3 className="font-extrabold text-slate-900">Risk warnings</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-amber-900">{analysis.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></section>
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">AI explanation (optional)</h3><p className="mt-1 text-xs text-slate-500">The model explains the calculations; it does not create or override the signal.</p></div><button type="button" onClick={() => void explainWithAI()} disabled={aiBusy} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{aiBusy ? "Explaining…" : "Explain with free AI"}</button></div>
        {aiText && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{aiText}</p>}
      </section>
    </div>}

    <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
      <strong className="text-slate-800">Important:</strong> This is an educational technical-analysis aid. It does not know your financial situation, cannot forecast prices with certainty, and is not investment advice. Never trade only from one indicator. Test a strategy on out-of-sample historical data, include fees/slippage, and define your maximum loss before entering a trade.
    </aside>
  </div>;
}
