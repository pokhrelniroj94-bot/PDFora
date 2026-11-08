"use client";

import { useState } from "react";
import NepseFundamentalReview from "./NepseFundamentalReview";
import NepseMarketContext from "./NepseMarketContext";
import NepseAdvancedIndicators from "./NepseAdvancedIndicators";
import NepseMacroDrivers from "./NepseMacroDrivers";
import { detectLargePriceGaps, normalizeOhlcvBars } from "../lib/nepse-quant.mjs";


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
  dataQuality: "Verified inputs" | "Limited inputs" | "Review required";
  actionable: boolean; qualityWarnings: string[];
};

const cls = "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100";
const card = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5";
const avg = (values: number[]) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
function ema(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = Array(values.length).fill(null);
  if (!Number.isInteger(period) || period < 1 || values.length < period || values.some(value => !Number.isFinite(value))) return result;
  const k = 2 / (period + 1);
  let value = avg(values.slice(0, period));
  result[period - 1] = value;
  for (let i = period; i < values.length; i++) {
    value = values[i] * k + value * (1 - k);
    result[i] = value;
  }
  return result;
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
function analyse(points: Point[], asset: string, sourceMeta?: { quoteStale?: boolean; historyPriceBasis?: string; historySource?: string }): Analysis | null {
  const rows = normalizeOhlcvBars(points);
  if (rows.length < 100) return null;
  const closes = rows.map((p) => p.close);
  const e20 = ema(closes, 20), e50 = ema(closes, 50);
  const fast = ema(closes, 12), slow = ema(closes, 26);
  const macdLine: (number | null)[] = closes.map((_, index) => fast[index] !== null && slow[index] !== null ? fast[index]! - slow[index]! : null);
  const validMacd = macdLine.filter((value): value is number => value !== null);
  const validMacdSignal = ema(validMacd, 9);
  const macdSignal: (number | null)[] = Array(closes.length).fill(null);
  const macdStart = macdLine.findIndex(value => value !== null);
  validMacdSignal.forEach((value, index) => { if (value !== null) macdSignal[macdStart + index] = value; });
  const last = rows[rows.length - 1];
  const i = closes.length - 1;
  const ema20 = e20[i] ?? last.close, ema50 = e50[i] ?? last.close;
  const rsiValue = rsi(closes);
  const trendUp = last.close > ema20 && ema20 > ema50;
  const trendDown = last.close < ema20 && ema20 < ema50;
  const macdHist = (macdLine[i] ?? 0) - (macdSignal[i] ?? 0);
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
  const technicalSignal = distributionRisk && score >= 3 ? (trendUp ? "HOLD / WATCH" : "Wait / neutral") : score >= 3 ? "Potential BUY setup" : score <= -3 ? (asset === "nepse" ? "Potential SELL / EXIT setup" : "Potential SELL / SHORT setup") : score >= 1 && trendUp ? "HOLD / WATCH" : "Wait / neutral";
  const recent = rows.slice(-20);
  const qualityWindow = rows.slice(-60);
  const ohlcCoverage = qualityWindow.filter(row => Number.isFinite(row.high) && Number.isFinite(row.low)).length / Math.max(1, qualityWindow.length);
  const volumeCoverage = qualityWindow.filter(row => Number.isFinite(row.volume)).length / Math.max(1, qualityWindow.length);
  const largeGaps = detectLargePriceGaps(rows.slice(-120), 20);
  const stale = hasStaleMarketData(last.date, asset);
  const qualityWarnings: string[] = [];
  if (stale) qualityWarnings.push("Latest daily candle is stale for the market calendar.");
  if (largeGaps.length) qualityWarnings.push("A 20%+ price gap exists in the latest 120 observations; corporate actions and source errors are not verified.");
  if (asset === "nepse" && ohlcCoverage < 0.8) qualityWarnings.push("Fewer than 80% of recent candles have a complete valid OHLC range.");
  if (asset === "nepse" && volumeCoverage < 0.7) qualityWarnings.push("Recent volume coverage is below 70%; participation confirmation is unreliable.");
  if (asset === "nepse" && sourceMeta?.quoteStale !== false) qualityWarnings.push("The market quote snapshot is stale or has no verifiable fresh timestamp.");
  if (asset === "nepse" && (!sourceMeta?.historyPriceBasis || /unadjusted|not independently verified/i.test(sourceMeta.historyPriceBasis))) qualityWarnings.push("Corporate-action adjustment status for the historical price series is not independently verified.");
  const actionable = qualityWarnings.length === 0;
  const dataQuality: Analysis["dataQuality"] = !actionable ? (qualityWarnings.some(w => /corporate actions|adjustment status/i.test(w)) ? "Review required" : "Limited inputs") : "Verified inputs";
  const signal = actionable ? technicalSignal : "Wait / neutral";
  const lows = recent.map((p) => p.low).filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v > 0);
  const highs = recent.map((p) => p.high).filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v > 0);
  const support = lows.length ? Math.min(...lows) : Math.min(...recent.map((p) => p.close));
  const resistance = highs.length ? Math.max(...highs) : Math.max(...recent.map((p) => p.close));
  const risk = volatility > (asset === "crypto" ? 85 : asset === "forex" ? 22 : 48) ? "Very high"
    : volatility > (asset === "crypto" ? 55 : asset === "forex" ? 14 : 32) ? "High"
    : volatility > (asset === "crypto" ? 30 : asset === "forex" ? 8 : 18) ? "Moderate" : "Lower";
  const risks: string[] = [];
  const finalSignal = signal;
  let stop: number | null = null, target: number | null = null;
  if (finalSignal === "Potential BUY setup") {
    stop = lows.length ? support * 0.995 : last.close * (1 - Math.max(0.015, dailyVol * 2));
    target = last.close + 2 * (last.close - stop);
  } else if (finalSignal === "Potential SELL / EXIT setup" || finalSignal === "Potential SELL / SHORT setup") {
    stop = highs.length ? resistance * 1.005 : last.close * (1 + Math.max(0.015, dailyVol * 2));
    target = last.close - 2 * (stop - last.close);
  }
  if (qualityWarnings.length) risks.push(...qualityWarnings.map(warning => "Decision gate: " + warning));
  if (risk === "High" || risk === "Very high") risks.push("Recent annualized volatility is elevated for this asset class.");
  if (rsiValue >= 68 && rsiValue < 72) risks.push("RSI is approaching the overbought zone; momentum is strong but a fresh entry may have limited room before a pullback.");
  if (rsiValue >= 72) risks.push("RSI is overbought; a pullback can occur even while the broader trend is positive.");
  if (distributionRisk) risks.push("Distribution warning: volume is unusually high while the latest close is lower. This weakens a bullish setup, so the engine blocks a BUY signal until price/volume behaviour improves.");
  if (rsiValue <= 28) risks.push("RSI is deeply oversold; this is not proof that a bottom has formed.");
  if (!volumeConfirm) risks.push("No strong volume confirmation was detected, or volume data is unavailable.");
  if (!lows.length || !highs.length) risks.push("The file/source has no full OHLC range; support, resistance and risk levels are close-based estimates.");
  const entry = !actionable
    ? "No actionable BUY/SELL decision: the data-quality gate requires verification. " + qualityWarnings.join(" ")
    : finalSignal === "Potential BUY setup"
    ? `Potential long setup only after a completed candle holds above EMA20 (${ema20.toFixed(4)}) and the next session confirms. Avoid chasing a sharp gap.`
    : finalSignal.includes("SELL")
      ? (asset === "nepse" ? `Downside/exit pressure is present while price remains below EMA20 (${ema20.toFixed(4)}). NEPSE short-selling availability is limited; treat this as an exit/risk-review condition, not an instruction to short.` : `Downside pressure is present while price remains below EMA20 (${ema20.toFixed(4)}). A short position requires a separate risk plan and may not be suitable for every trader.`)
      : finalSignal === "HOLD / WATCH"
      ? `Existing holders may watch the uptrend while price remains above EMA20 (${ema20.toFixed(4)}). This is not a fresh-entry confirmation; review position risk and invalidation levels.`
      : `Wait for a confirmed close above EMA20 (${ema20.toFixed(4)}) with improving momentum, or a confirmed breakdown below support. Current indicators are mixed.`;
  return { count: rows.length, latestDate: last.date, close: last.close, ema20, ema50, rsi: rsiValue, macd: macdLine[i] ?? 0, macdSignal: macdSignal[i] ?? 0, score, signal: finalSignal, volatility, risk, support, resistance, stop, target, entry, risks, reasons, annualizer, dataQuality, actionable, qualityWarnings };
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
  if (lines.length < 101) throw new Error("Upload at least 100 daily rows of historical data.");
  if (lines.length > 20_001) throw new Error("CSV contains too many rows. Maximum supported history is 20,000 rows.");
  const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const find = (...names: string[]) => headers.findIndex((h) => names.includes(h));
  const dateIndex = find("date", "time", "datetime", "timestamp");
  const closeIndex = find("close", "last");
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
  if (rows.length < 100) throw new Error("Fewer than 100 valid price rows were found in the CSV.");
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

export default function MarketIntelligence({ locale = "en", nestedHeading = false }: { locale?: "en" | "ne"; nestedHeading?: boolean }) {
  const tr = (value: string) => locale === "ne" ? ({ NEPSE: "नेप्से", Forex: "विदेशी मुद्रा", Crypto: "क्रिप्टो" }[value] ?? value) : value;
  const Heading = nestedHeading ? "h2" : "h1";
  const [asset, setAsset] = useState("nepse");
  const [symbol, setSymbol] = useState("NEPSE");
  const [marketSymbol, setMarketSymbol] = useState("EUR/USD");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [newsReview, setNewsReview] = useState<NewsReview | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<Point[]>([]);

  async function loadNepse() {
    setBusy(true); setError(""); setAnalysis(null); setNewsReview(null);
    try {
      const response = await fetch("/api/nepse-market?symbol=" + encodeURIComponent(symbol.trim().toUpperCase()) + "&period=1Y", { cache: "no-store", signal: AbortSignal.timeout(15000) });
      const responseText = await response.text();
      let data: {
        error?: unknown;
        points?: Point[];
        quoteStale?: boolean;
        historyPriceBasis?: string;
        historySource?: string;
        dataCoverage?: { historicalCharts?: string };
        latestHistoryDate?: string;
        source?: string;
      };
      try {
        const parsed: unknown = JSON.parse(responseText);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid market response");
        data = parsed as typeof data;
      } catch {
        throw new Error("NEPSE data is temporarily unavailable because the market-data service returned an invalid response. Please retry later or use a verified historical CSV.");
      }
      if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "NEPSE market data is temporarily unavailable. Please retry later.");
      const rows = normalizeOhlcvBars(data.points || []);
      setSelectedPoints(rows);
      const result = analyse(rows, "nepse", { quoteStale: data.quoteStale, historyPriceBasis: data.historyPriceBasis, historySource: data.historySource });
      if (!result) throw new Error("At least 100 valid historical daily prices are required for analysis.");

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
    } catch (err) { setError(err instanceof Error && err.name === "TimeoutError" ? "NEPSE market data request timed out. No signal was generated. Please retry later or upload a verified historical CSV." : err instanceof Error ? err.message : "Unable to analyse NEPSE data."); }
    finally { setBusy(false); }
  }

  async function loadCsv(file?: File) {
    if (!file) return;
    setBusy(true); setError(""); setAnalysis(null);
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error("CSV file is too large. Maximum supported size is 5 MB.");
      const rows = parseCsv(await file.text());
      const result = analyse(rows, asset);
      if (!result) throw new Error("At least 100 valid historical daily prices are required.");
      setAnalysis(result); setSource(`Uploaded file: ${file.name} · ${rows.length} rows`);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not read this CSV."); }
    finally { setBusy(false); }
  }

  const scoreTone = analysis?.signal.includes("BUY") ? "text-emerald-700" : analysis?.signal.includes("SELL") ? "text-rose-700" : "text-amber-700";
  const displaySignal = (signal: Analysis["signal"]) => locale === "ne" ? ({ "Potential BUY setup": "सम्भावित खरिद अवस्था", "HOLD / WATCH": "होल्ड / निगरानी", "Potential SELL / EXIT setup": "सम्भावित बिक्री / बाहिरिने अवस्था", "Potential SELL / SHORT setup": "सम्भावित बिक्री / सर्ट अवस्था", "Wait / neutral": "पर्खनुहोस् / तटस्थ" } as Record<Analysis["signal"], string>)[signal] : signal;
  return <div className="space-y-6">
    <header>
      <p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">PDFora NEPSE Quant Engine</p>
      <Heading className="mt-2 text-3xl font-black tracking-tight text-slate-950">{locale === "ne" ? "बजार विश्लेषण तथा जोखिम परीक्षक" : "Market Intelligence & Risk Analyzer"}</Heading>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{locale === "ne" ? "नियममा आधारित trend, momentum, volume, data-quality र risk checks बाट NEPSE को ऐतिहासिक मूल्य विश्लेषण गर्नुहोस्। सबै सूचक र संकेत पारदर्शी सूत्रबाट स्थानीय रूपमा गणना हुन्छन्।" : "Analyse NEPSE price history using transparent, deterministic trend, momentum, volume, data-quality and risk checks. All indicators and signals are calculated transparently from the supplied market data using fixed formulas."}</p>
      <a href="/nepse-lab" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-800 transition hover:-translate-y-0.5 hover:bg-teal-100">{locale === "ne" ? "NEPSE Quant Strategy Lab खोल्नुहोस्" : "Open NEPSE Quant Strategy Lab"} <span aria-hidden="true">→</span></a>
    </header>

    <section className={card}>
      <div className="mb-4 flex flex-wrap gap-2">
        {([["nepse",tr("NEPSE")],["forex",tr("Forex")],["crypto",tr("Crypto")]] as const).map(([key,label]) => <button type="button" key={key} onClick={() => { setAsset(key); if (key === "crypto") setMarketSymbol("BTC/USD"); else if (key === "forex") setMarketSymbol("EUR/USD"); setAnalysis(null); setError(""); }} className={"rounded-full px-4 py-2 text-sm font-bold " + (asset === key ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-teal-50")}>{label}</button>)}
      </div>
      {asset === "nepse" ? <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{locale === "ne" ? "NEPSE संकेत / सूचक" : "NEPSE symbol / index"}</span><input className={cls} value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="NEPSE, NABIL, NICA…" /></label>
        <button type="button" onClick={() => void loadNepse()} disabled={busy || !symbol.trim()} className="self-end rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? (locale === "ne" ? "विश्लेषण हुँदैछ…" : "Analysing…") : (locale === "ne" ? "NEPSE विश्लेषण गर्नुहोस्" : "Analyse NEPSE")}</button>
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
          <div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Computed technical setup</p><h2 className={"mt-2 text-2xl font-black " + scoreTone}>{displaySignal(analysis.signal)}</h2><p className="mt-1 text-sm text-slate-500">{asset.toUpperCase()} · {asset === "nepse" ? symbol : marketSymbol} · {analysis.latestDate}</p></div>
              <div className="rounded-xl bg-slate-100 px-4 py-3 text-center"><p className="text-xs text-slate-500">Technical confluence</p><p className="text-2xl font-black tabular-nums">{analysis.score > 0 ? "+" : ""}{analysis.score}</p><p className="text-[10px] text-slate-500">Not a win probability</p><p className="mt-1 text-[10px] font-bold">{analysis.dataQuality}</p></div>
        </div>
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{analysis.entry}</p>
        {analysis.qualityWarnings.length > 0 && <div role="status" className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><strong>Decision quality gate · no actionable trade signal</strong><ul className="mt-2 list-disc space-y-1 pl-5">{analysis.qualityWarnings.map(warning => <li key={warning}>{warning}</li>)}</ul></div>}
        <p className="mt-3 text-xs text-slate-500">Data: {source} · {analysis.count} daily observations. Signals are rule-based technical conditions, not a prediction or a personal trade recommendation.</p>
      </section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {([["Latest close",fmt(analysis.close)],["RSI (14)",analysis.rsi.toFixed(1)],["EMA 20 / 50",fmt(analysis.ema20)+" / "+fmt(analysis.ema50)],["Annualized volatility",pct(analysis.volatility)]]).map(([label,value]) => <div className={card} key={label}><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-lg font-black tabular-nums text-slate-900">{value}</p></div>)}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className={card}><h3 className="font-extrabold text-slate-900">Risk & key levels</h3><p className="mt-2 text-sm">Volatility-based risk: <strong>{analysis.risk}</strong></p><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-500">20-session support</dt><dd className="mt-1 font-bold">{fmt(analysis.support)}</dd></div><div><dt className="text-slate-500">20-session resistance</dt><dd className="mt-1 font-bold">{fmt(analysis.resistance)}</dd></div><div><dt className="text-slate-500">Illustrative risk / invalidation level</dt><dd className="mt-1 font-bold">{analysis.stop === null ? "—" : fmt(analysis.stop)}</dd></div><div><dt className="text-slate-500">{asset === "nepse" && analysis.signal.includes("SELL") ? "Illustrative downside level" : "Illustrative 2R target"}</dt><dd className="mt-1 font-bold">{analysis.target === null ? "—" : fmt(analysis.target)}</dd></div></dl><p className="mt-3 text-xs text-slate-500">Levels are estimates from the last 20 observations. Gaps, fees, slippage and liquidity can change actual outcomes.</p></div>
        <div className={card}><h3 className="font-extrabold text-slate-900">Why the engine reached this view</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-slate-700">{analysis.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>
      </section>
      <section className={card}><h3 className="font-extrabold text-slate-900">{locale === "ne" ? "जोखिमसम्बन्धी चेतावनी" : "Risk warnings"}</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-5 text-amber-900">{analysis.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></section>
      <section className={card}>
        <h3 className="font-extrabold text-slate-900">{locale === "ne" ? "गणना विधि र संकेतको सीमा" : "Calculation method & signal limits"}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{locale === "ne" ? "यो प्रतिवेदन ऐतिहासिक दैनिक OHLCV डेटा र निश्चित नियमबाट तयार हुन्छ। स्कोर नाफा हुने सम्भावना होइन र भविष्यको मूल्य अनुमान होइन।" : "This report is calculated from historical daily OHLCV data using fixed rules. The confluence score is not a probability of profit and is not a forecast."}</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
          <li>{locale === "ne" ? "EMA20/EMA50 trend alignment: +2 वा −2; RSI(14), MACD histogram, 5-session momentum र volume confirmation ले थप स्कोर दिन्छन्।" : "EMA20/EMA50 trend alignment contributes +2 or −2; RSI(14), MACD histogram, five-session momentum and volume confirmation add or subtract points."}</li>
          <li>{locale === "ne" ? "कम्तीमा 100 valid daily bars चाहिन्छ। stale quote, अपूरो OHLC/volume वा corporate-action adjustment अस्पष्ट भए BUY/SELL संकेत रोकिन्छ।" : "At least 100 valid daily bars are required. Stale quotes, incomplete OHLC/volume coverage or unclear corporate-action adjustments block actionable BUY/SELL signals."}</li>
          <li>{locale === "ne" ? "Support/resistance पछिल्ला 20 कारोबार सत्रका दायराबाट निकालिन्छ; शुल्क, slippage, liquidity र circuit limits अलग जाँच्नुहोस्।" : "Support/resistance use the latest 20 observations; separately account for fees, slippage, liquidity and circuit limits."}</li>
        </ul>
      </section>
      <section className={card}><h3 className="font-extrabold text-slate-900">{locale === "ne" ? "समाचार तथा खुलासा सन्दर्भ (संकेतबाट अलग)" : "News & disclosure context (separate from signal)"}</h3><p className="mt-2 text-sm text-slate-600">{locale === "ne" ? "समाचारको धारणा:" : "Headline screening:"} <strong>{newsReview?.sentiment || "Unavailable"}</strong> · {newsReview?.stories.length || 0} relevant headlines</p><p className="mt-2 text-sm text-slate-600">{newsReview?.note || "News checked alongside technical indicators."}</p>{newsReview?.stories.length ? <ul className="mt-3 space-y-3">{newsReview.stories.map(story=><li key={story.link} className="border-t border-slate-100 pt-3"><a href={story.link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-teal-800 underline">{story.title}</a><p className="mt-1 text-xs text-slate-500">{story.source} · {new Date(story.publishedAt).toLocaleString()}</p></li>)}</ul> : <p className="mt-3 text-xs text-amber-700">No relevant headlines were returned. This does not change the technical signal; verify official disclosures separately.</p>}</section>
      {asset === "nepse" && <NepseMarketContext symbol={symbol.trim().toUpperCase()} selectedPoints={selectedPoints} />}
      {asset === "nepse" && <NepseAdvancedIndicators rows={selectedPoints} />}
      {asset === "nepse" && <NepseMacroDrivers />}
      {asset === "nepse" && symbol.trim().toUpperCase() !== "NEPSE" && <NepseFundamentalReview symbol={symbol.trim().toUpperCase()} price={analysis.close} priceAsOf={analysis.latestDate} />}

    </div>}

    <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
      <strong className="text-slate-800">{locale === "ne" ? "महत्त्वपूर्ण:" : "Important:"}</strong> {locale === "ne" ? "यो शैक्षिक प्रयोजनको प्राविधिक विश्लेषण सहायता हो। यसले तपाईंको व्यक्तिगत आर्थिक अवस्था जान्दैन, निश्चित मूल्य पूर्वानुमान गर्न सक्दैन र लगानी सल्लाह होइन। एउटै सूचकका आधारमा कारोबार नगर्नुहोस्।" : "This is an educational technical-analysis aid. It does not know your financial situation, cannot forecast prices with certainty, and is not investment advice. Never trade only from one indicator. Test a strategy on out-of-sample historical data, include fees/slippage, and define your maximum loss before entering a trade."}
    </aside>
  </div>;
}
