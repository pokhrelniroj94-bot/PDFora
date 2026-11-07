"use client";

import { useState } from "react";
import NepseFundamentalReview from "./NepseFundamentalReview";
import NepseMarketContext from "./NepseMarketContext";
import NepseAdvancedIndicators from "./NepseAdvancedIndicators";


type NewsStory = { title: string; link: string; publishedAt: string; source: string };
type NewsReview = { stories: NewsStory[]; sentiment: "Positive" | "Negative" | "Mixed / neutral"; impact: number; note: string };
function reviewNews(payload: { market?: NewsStory[]; ipo?: NewsStory[] }, symbol: string): NewsReview {
  const all = [...(payload.market || []), ...(payload.ipo || [])], now = Date.now(), ticker = symbol.trim().toLowerCase();
  const relevant = all.filter(story => {
    const age = now - Date.parse(story.publishedAt), title = story.title.toLowerCase();
    const general = /nepse|stock market|share market|sebon|nrb|monetary policy|interest rate|liquidity|banking sector|capital market|ipo|fpo|dividend|bonus share|right share|merger|acquisition|agm|broker/.test(title);
    return Number.isFinite(age) && age >= -300000 && age <= 30*86400000 && (ticker === "nepse" ? general : Boolean(ticker) && title.includes(ticker));
  }).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,12);
  const pos=/profit|earnings growth|dividend|bonus share|right share|buyback|upgrade|approval|record high|strong demand|liquidity injection|rate cut|interest rate cut|capital increase|positive outlook|growth/;
  const neg=/fraud|scam|penalty|fine|investigation|default|loss|decline|crash|selloff|selling pressure|rate hike|interest rate hike|liquidity crunch|suspension|regulatory action|downgrade|lawsuit|weak outlook|non.?performing loan/;
  let score=0;
  for(const story of relevant){const h=(now-Date.parse(story.publishedAt))/3600000, fresh=h<=24?1:h<=72?.7:h<=168?.4:.2, official=/nepse|sebon|nepal rastra bank|nrb/i.test(story.source+" "+story.title)?1.35:1; if(pos.test(story.title.toLowerCase()))score+=fresh*official;if(neg.test(story.title.toLowerCase()))score-=fresh*official;}
  const sentiment=score>=.8?"Positive":score<=-.8?"Negative":"Mixed / neutral";
  return {stories:relevant,sentiment,impact:Math.max(-2,Math.min(2,score)),note:relevant.length?relevant.length+" recent headlines reviewed. Headlines are only a screening signal; verify the linked announcement and full context.":"No sufficiently relevant recent headlines found. News sentiment is unavailable, not neutral."};
}

type Point = { date: string; open?: number; high?: number; low?: number; close: number; volume?: number };
type Analysis = {
  count: number; latestDate: string; close: number; ema20: number; ema50: number; rsi: number;
  macd: number; macdSignal: number; score: number; signal: "Potential BUY setup" | "HOLD / WATCH" | "Potential SELL / EXIT setup" | "Potential SELL / SHORT setup" | "Wait / neutral";
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
  if (averageLoss === 0) return averageGain === 0 ? 50 : 100;
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
  const distributionRisk = volumeConfirm && last.close < rows[rows.length - 2].close;
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
  const signal = distributionRisk && score >= 3 ? (trendUp ? "HOLD / WATCH" : "Wait / neutral") : score >= 3 ? "Potential BUY setup" : score <= -3 ? (asset === "nepse" ? "Potential SELL / EXIT setup" : "Potential SELL / SHORT setup") : score >= 1 && trendUp ? "HOLD / WATCH" : "Wait / neutral";
  const recent = rows.slice(-20);
  const lows = recent.map((p) => p.low).filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v > 0);
  const highs = recent.map((p) => p.high).filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v > 0);
  const support = lows.length ? Math.min(...lows) : Math.min(...recent.map((p) => p.close));
  const resistance = highs.length ? Math.max(...highs) : Math.max(...recent.map((p) => p.close));
  const risk = volatility > (asset === "crypto" ? 85 : asset === "forex" ? 22 : 48) ? "Very high"
    : volatility > (asset === "crypto" ? 55 : asset === "forex" ? 14 : 32) ? "High"
    : volatility > (asset === "crypto" ? 30 : asset === "forex" ? 8 : 18) ? "Moderate" : "Lower";
  const risks: string[] = [];
  const stale = hasStaleMarketData(last.date, asset);
  const finalSignal = stale ? "Wait / neutral" : signal;
  let stop: number | null = null, target: number | null = null;
  if (finalSignal === "Potential BUY setup") {
    stop = lows.length ? support * 0.995 : last.close * (1 - Math.max(0.015, dailyVol * 2));
    target = last.close + 2 * (last.close - stop);
  } else if (finalSignal === "Potential SELL / EXIT setup" || finalSignal === "Potential SELL / SHORT setup") {
    stop = highs.length ? resistance * 1.005 : last.close * (1 + Math.max(0.015, dailyVol * 2));
    target = last.close - 2 * (stop - last.close);
  }
  if (stale) risks.push("The latest observation is stale for this market. New BUY/SELL signals are suppressed until fresh data is available.");
  if (risk === "High" || risk === "Very high") risks.push("Recent annualized volatility is elevated for this asset class.");
  if (rsiValue >= 68 && rsiValue < 72) risks.push("RSI is approaching the overbought zone; momentum is strong but a fresh entry may have limited room before a pullback.");
  if (rsiValue >= 72) risks.push("RSI is overbought; a pullback can occur even while the broader trend is positive.");
  if (distributionRisk) risks.push("Distribution warning: volume is unusually high while the latest close is lower. This weakens a bullish setup, so the engine blocks a BUY signal until price/volume behaviour improves.");
  if (rsiValue <= 28) risks.push("RSI is deeply oversold; this is not proof that a bottom has formed.");
  if (rows.length < 100) risks.push("The history is limited; longer-term trend context may be incomplete.");
  if (!volumeConfirm) risks.push("No strong volume confirmation was detected, or volume data is unavailable.");
  if (!lows.length || !highs.length) risks.push("The file/source has no full OHLC range; support, resistance and risk levels are close-based estimates.");
  const entry = stale
    ? `No BUY/SELL signal: the latest daily observation is ${last.date}. Refresh or wait for a new completed trading session.`
    : finalSignal === "Potential BUY setup"
    ? `Potential long setup only after a completed candle holds above EMA20 (${e20[i].toFixed(4)}) and the next session confirms. Avoid chasing a sharp gap.`
    : finalSignal.includes("SELL")
      ? (asset === "nepse" ? `Downside/exit pressure is present while price remains below EMA20 (${e20[i].toFixed(4)}). NEPSE short-selling availability is limited; treat this as an exit/risk-review condition, not an instruction to short.` : `Downside pressure is present while price remains below EMA20 (${e20[i].toFixed(4)}). A short position requires a separate risk plan and may not be suitable for every trader.`)
      : finalSignal === "HOLD / WATCH"
      ? `Existing holders may watch the uptrend while price remains above EMA20 (${e20[i].toFixed(4)}). This is not a fresh-entry confirmation; review position risk and invalidation levels.`
      : `Wait for a confirmed close above EMA20 (${e20[i].toFixed(4)}) with improving momentum, or a confirmed breakdown below support. Current indicators are mixed.`;
  return { count: rows.length, latestDate: last.date, close: last.close, ema20: e20[i], ema50: e50[i], rsi: rsiValue, macd: macdLine[i], macdSignal: macdSignal[i], score, signal: finalSignal, volatility, risk, support, resistance, stop, target, entry, risks, reasons, annualizer };
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
  if (quoted) throw new Error("CSV contains an unclosed quoted field.");
  cells.push(cell.trim());
  return cells;
}
function parseCsv(text: string): Point[] {
  if (new TextEncoder().encode(text).byteLength > 5 * 1024 * 1024) {
    throw new Error("CSV file is too large. Maximum supported size is 5 MB.");
  }
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 51) throw new Error("Upload at least 50 daily rows of historical data.");
  if (lines.length > 20_001) throw new Error("CSV contains too many rows. Maximum supported history is 20,000 rows.");
  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const find = (...names: string[]) => headers.findIndex((h) => names.includes(h));
  const dateIndex = find("date", "time", "datetime", "timestamp");
  const closeIndex = find("close", "adjclose", "last");
  const openIndex = find("open"), highIndex = find("high"), lowIndex = find("low"), volumeIndex = find("volume", "vol");
  if (dateIndex < 0 || closeIndex < 0) throw new Error("CSV needs Date/Time and Close columns. OHLCV columns are recommended.");

  const rows: Point[] = [];
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line);
    if (cells.length !== headers.length) throw new Error("CSV has rows with a different number of columns. Check commas and quotation marks.");
    const rawDate = cells[dateIndex] || "";
    let date = "";
    if (/^\d{10}$|^\d{13}$/.test(rawDate)) {
      const numeric = Number(rawDate);
      const milliseconds = rawDate.length === 10 ? numeric * 1000 : numeric;
      const parsed = new Date(milliseconds);
      if (!Number.isFinite(parsed.getTime())) throw new Error("CSV contains an invalid timestamp.");
      date = parsed.toISOString().slice(0, 10);
    } else if (/^\d{4}-\d{2}-\d{2}(?:$|[T ])/.test(rawDate)) {
      const parsed = new Date(rawDate.length === 10 ? rawDate + "T00:00:00Z" : rawDate);
      if (!Number.isFinite(parsed.getTime())) throw new Error("CSV contains an invalid date.");
      date = parsed.toISOString().slice(0, 10);
      if (date !== rawDate.slice(0, 10)) throw new Error("CSV contains an invalid calendar date.");
    } else {
      throw new Error("Use ISO dates (YYYY-MM-DD) or Unix timestamps in the Date column.");
    }
    const num = (index: number) => {
      if (index < 0 || !cells[index]) return undefined;
      const value = Number(cells[index].replace(/,/g, ""));
      return Number.isFinite(value) ? value : NaN;
    };
    const open = num(openIndex), high = num(highIndex), low = num(lowIndex);
    const close = num(closeIndex), volume = num(volumeIndex);
    if (close === undefined || !Number.isFinite(close) || close <= 0) throw new Error("CSV contains a missing or invalid closing price.");
    if ([open, high, low, volume].some((v) => v !== undefined && !Number.isFinite(v))) throw new Error("CSV contains a non-numeric OHLCV value.");
    if (open !== undefined && open <= 0) throw new Error("Opening prices must be greater than zero.");
    if (high !== undefined && (high <= 0 || high < Math.max(close, open ?? close))) throw new Error("A candle's High must be at least as large as its Open and Close.");
    if (low !== undefined && (low <= 0 || low > Math.min(close, open ?? close))) throw new Error("A candle's Low must not exceed its Open or Close.");
    if (high !== undefined && low !== undefined && high < low) throw new Error("A candle's High cannot be lower than its Low.");
    if (volume !== undefined && volume < 0) throw new Error("Volume cannot be negative.");
    rows.push({ date, open, high, low, close, volume });
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].date === rows[i - 1].date) throw new Error("CSV contains duplicate dates. Keep one daily candle per date.");
  }
  if (rows.length < 50) throw new Error("Fewer than 50 valid price rows were found in the CSV.");
  return rows;
}
const fmt = (v: number) => v.toLocaleString(undefined, { maximumFractionDigits: 4 });
const pct = (v: number) => v.toFixed(2) + "%";
function hasStaleMarketData(latestDate: string, asset: string) {
  // NEPSE daily bars are dated in Nepal time, not the browser's UTC calendar.
  const todayNepal = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const latest = new Date(`${latestDate}T00:00:00Z`);
  const end = new Date(`${todayNepal}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(latestDate) || !Number.isFinite(latest.getTime())) return true;
  // A future-dated candle is invalid and must never generate a live signal.
  if (latest > end) return true;
  let expectedSessions = 0;
  const cursor = new Date(latest.getTime());
  while (cursor < end) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const day = cursor.getUTCDay();
    // NEPSE trades Sunday–Thursday; Friday and Saturday are weekly closures.
    const isSession = asset === "crypto" || (asset === "forex" ? day !== 0 && day !== 6 : day !== 5 && day !== 6);
    if (isSession) expectedSessions++;
  }
  return expectedSessions >= 2;
}

export default function MarketIntelligence() {
  const [asset, setAsset] = useState("nepse");
  const [symbol, setSymbol] = useState("NEPSE");
  const [marketSymbol, setMarketSymbol] = useState("EUR/USD");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [newsReview, setNewsReview] = useState<NewsReview | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<Point[]>([]);

  async function loadNepse() {
    setBusy(true); setError(""); setAnalysis(null); setAiText(""); setNewsReview(null);
    try {
      const response = await fetch("/api/nepse-market?symbol=" + encodeURIComponent(symbol.trim().toUpperCase()) + "&period=1Y", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "NEPSE data is unavailable.");
      const rows = (data.points || []).map((p: Record<string, unknown>) => ({
        date: String(p.date || ""), open: Number(p.open) || undefined, high: Number(p.high) || undefined,
        low: Number(p.low) || undefined, close: Number(p.close), volume: Number(p.volume) || undefined,
      })).filter((p: Point) => p.date && Number.isFinite(p.close) && p.close > 0);
      setSelectedPoints(rows);
      const result = analyse(rows, "nepse");
      if (!result) throw new Error("At least 50 valid historical daily prices are required for analysis.");

      // The deterministic engine is the primary product. News is an optional,
      // separately-labelled context feed and must never gate or rewrite its signal.
      let reviewed: NewsReview | null = null;
      try {
        const newsResponse = await fetch(`/api/nepal-market-news?symbol=${encodeURIComponent(symbol.trim().toUpperCase())}`, { cache: "no-store" });
        if (newsResponse.ok) reviewed = reviewNews(await newsResponse.json(), symbol);
      } catch {
        reviewed = null;
      }
      setNewsReview(reviewed);
      const combined: Analysis = { ...result };
      if (reviewed) combined.reasons = [...combined.reasons, `Separate headline context: ${reviewed.sentiment}. Headlines do not change the deterministic technical signal. ${reviewed.note}`];
      else combined.risks = [...combined.risks, "News feed is unavailable. The rule-based technical analysis remains available; company announcements and material disclosures should be checked separately."];

      setAnalysis(combined);
      setSource(`${data.dataCoverage?.historicalCharts || "Historical daily data"} · latest history ${data.latestHistoryDate || result.latestDate} · stock quote freshness: ${data.quoteStale ? "stale / unavailable" : "timestamp available"} · dashboard source: ${data.source || "YONEPSE dataset"}`);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to analyse NEPSE data."); }
    finally { setBusy(false); }
  }

  async function loadCsv(file?: File) {
    if (!file) return;
    setBusy(true); setError(""); setAnalysis(null); setAiText("");
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("CSV file is too large. Maximum supported size is 5 MB.");
      const rows = parseCsv(await file.text());
      const result = analyse(rows, asset);
      if (!result) throw new Error("At least 50 valid historical daily prices are required.");
      setAnalysis(result); setSource(`Uploaded file: ${file.name} · ${rows.length} rows`);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not read this CSV."); }
    finally { setBusy(false); }
  }

  async function explainWithAI() {
    if (!analysis) return;
    setAiBusy(true); setError(""); setAiText("");
    try {
      let research: unknown = null;
      if (asset === "nepse" && symbol.trim().toUpperCase() !== "NEPSE") {
        const researchResponse = await fetch("/api/nepse-research?symbol=" + encodeURIComponent(symbol.trim().toUpperCase()), { cache: "no-store" });
        const researchPayload = await researchResponse.json();
        if (researchResponse.ok) research = researchPayload;
      }
      const response = await fetch("/api/ai-writing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        kind: "market-explain",
        analysis: JSON.stringify({ asset, symbol: asset === "nepse" ? symbol : marketSymbol, ...analysis, reasons: analysis.reasons, risks: analysis.risks, newsReview: asset === "nepse" ? newsReview : null }),
        research: research ? JSON.stringify(research).slice(0, 8500) : "",
        question: "Prepare a Nepal-focused research note for this selected symbol. Explain the evidence, data gaps, valuation/fundamentals only if provided, technical setup, catalysts and risks.",
      }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Free AI research is unavailable.");
      setAiText(String(payload.text || ""));
    } catch (err) { setError(err instanceof Error ? err.message : "AI research unavailable."); }
    finally { setAiBusy(false); }
  }

  const scoreTone = analysis?.signal.includes("BUY") ? "text-emerald-700" : analysis?.signal.includes("SELL") ? "text-rose-700" : "text-amber-700";
  return <div className="space-y-6">
    <header>
      <p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">PDFora NEPSE Quant Engine</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Market Intelligence & Risk Analyzer</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Analyse NEPSE price history with deterministic, rule-based trend, momentum, volume and risk checks. The core signal works without AI; AI research is an optional explanation layer.</p>
      <a href="/nepse-lab" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-800 transition hover:-translate-y-0.5 hover:bg-teal-100">Open NEPSE Quant Strategy Lab <span aria-hidden="true">→</span></a>
    </header>

    <section className={card}>
      <div className="mb-4 flex flex-wrap gap-2">
        {([["nepse","NEPSE"],["forex","Forex"],["crypto","Crypto"]] as const).map(([key,label]) => <button type="button" key={key} onClick={() => { setAsset(key); if (key === "crypto") setMarketSymbol("BTC/USD"); else if (key === "forex") setMarketSymbol("EUR/USD"); setAnalysis(null); setError(""); setAiText(""); }} className={"rounded-full px-4 py-2 text-sm font-bold " + (asset === key ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-teal-50")}>{label}</button>)}
      </div>
      {asset === "nepse" ? <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1"><span className="mb-1.5 block text-sm font-semibold text-slate-700">NEPSE symbol / index</span><input className={cls} value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="NEPSE, NABIL, NICA…" /></label>
        <button type="button" onClick={() => void loadNepse()} disabled={busy || !symbol.trim()} className="self-end rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Analysing…" : "Analyse NEPSE"}</button>
      </div> : <div className="space-y-3">
        <label className="block max-w-sm"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{asset === "forex" ? "Forex pair" : "Crypto pair"}</span><input className={cls} value={marketSymbol} onChange={(e) => setMarketSymbol(e.target.value)} placeholder={asset === "forex" ? "EUR/USD" : "BTC/USD"} /></label>
        <p className="text-sm text-slate-700">Upload a CSV exported from your broker or exchange. Required columns: <code>Date, Close</code>. Recommended: <code>Date, Open, High, Low, Close, Volume</code>. At least 50 daily rows are needed.</p>
        <input className={cls} type="file" accept=".csv,text/csv" onChange={(e) => void loadCsv(e.target.files?.[0])} /><button type="button" onClick={() => { const sample = "Date,Open,High,Low,Close,Volume\n2026-01-01,100,102,99,101,1200\n"; const url = URL.createObjectURL(new Blob([sample], { type: "text/csv" })); const a = document.createElement("a"); a.href = url; a.download = "pdfora-market-sample.csv"; a.click(); URL.revokeObjectURL(url); }} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Download CSV format</button>
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
        <div className={card}><h3 className="font-extrabold text-slate-900">Risk & key levels</h3><p className="mt-2 text-sm">Volatility-based risk: <strong>{analysis.risk}</strong></p><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-500">20-session support</dt><dd className="mt-1 font-bold">{fmt(analysis.support)}</dd></div><div><dt className="text-slate-500">20-session resistance</dt><dd className="mt-1 font-bold">{fmt(analysis.resistance)}</dd></div><div><dt className="text-slate-500">Illustrative risk / invalidation level</dt><dd className="mt-1 font-bold">{analysis.stop === null ? "—" : fmt(analysis.stop)}</dd></div><div><dt className="text-slate-500">{asset === "nepse" && analysis.signal.includes("SELL") ? "Illustrative downside level" : "Illustrative 2R target"}</dt><dd className="mt-1 font-bold">{analysis.target === null ? "—" : fmt(analysis.target)}</dd></div></dl><p className="mt-3 text-xs text-slate-500">Levels are estimates from the last 20 observations. Gaps, fees, slippage and liquidity can change actual outcomes.</p></div>
        <div className={card}><h3 className="font-extrabold text-slate-900">Why the engine reached this view</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-slate-700">{analysis.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>
      </section>
      <section className={card}><h3 className="font-extrabold text-slate-900">Risk warnings</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-amber-900">{analysis.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></section>
      <section className={card}><h3 className="font-extrabold text-slate-900">News & disclosure context (separate from signal)</h3><p className="mt-2 text-sm text-slate-600">Headline screening: <strong>{newsReview?.sentiment || "Unavailable"}</strong> · {newsReview?.stories.length || 0} relevant headlines</p><p className="mt-2 text-sm text-slate-600">{newsReview?.note || "News checked alongside technical indicators."}</p>{newsReview?.stories.length ? <ul className="mt-3 space-y-3">{newsReview.stories.map(story=><li key={story.link} className="border-t border-slate-100 pt-3"><a href={story.link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-teal-800 underline">{story.title}</a><p className="mt-1 text-xs text-slate-500">{story.source} · {new Date(story.publishedAt).toLocaleString()}</p></li>)}</ul> : <p className="mt-3 text-xs text-amber-700">No relevant headlines were returned. This does not change the technical signal; verify official disclosures separately.</p>}</section>
      {asset === "nepse" && <NepseMarketContext symbol={symbol.trim().toUpperCase()} selectedPoints={selectedPoints} />}
      {asset === "nepse" && <NepseAdvancedIndicators rows={selectedPoints} />}
      {asset === "nepse" && symbol.trim().toUpperCase() !== "NEPSE" && <NepseFundamentalReview symbol={symbol.trim().toUpperCase()} price={analysis.close} />}
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">Optional AI research explanation</h3><p className="mt-1 text-xs text-slate-500">Optional AI-generated explanation of the already-computed report. The deterministic technical and fundamental snapshots above work without AI; AI cannot change their calculated values or signals.</p></div><button type="button" onClick={() => void explainWithAI()} disabled={aiBusy} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{aiBusy ? "Researching…" : "Generate research report"}</button></div>
        {aiText && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{aiText}</p>}
      </section>
    </div>}

    <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
      <strong className="text-slate-800">Important:</strong> This is an educational technical-analysis aid. It does not know your financial situation, cannot forecast prices with certainty, and is not investment advice. Never trade only from one indicator. Test a strategy on out-of-sample historical data, include fees/slippage, and define your maximum loss before entering a trade.
    </aside>
  </div>;
}
