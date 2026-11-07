export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = "https://raw.githubusercontent.com/Shubhamnpk/yonepse/main";
const INDEX_SYMBOLS = new Set(["NEPSE", "SENSIND", "FLOATIND", "SENSFLTIND", "BANKSUBIND", "DEVBANKIND", "FININD", "HOTELIND", "HYDPOWIND", "INVIDX", "LIFINSIND", "MANPROCIND", "MICRFININD", "MUTUALIND", "NONLIFIND", "OTHERSIND", "TRDIND"]);
type Json = Record<string, unknown>;

const SHAREHUB_DATA = "https://sharehubnepal.com/data/api/v1/nepse-data";
const SHAREHUB_AUTH = "https://sharehubnepal.com/account/api/v1/auth/login";
type ShareHubTokens = { accessToken: string; refreshToken: string; accessExpiresAt: number };
let shareHubTokens: ShareHubTokens | null = null;
let shareHubTokenFlight: Promise<string | null> | null = null;
function shareHubEnabled() { return Boolean(process.env.SHAREHUB_EMAIL && process.env.SHAREHUB_PASSWORD); }
async function getShareHubToken(forceRefresh = false): Promise<string | null> {
  if (!shareHubEnabled()) return null;
  if (!forceRefresh && shareHubTokens && shareHubTokens.accessExpiresAt > Date.now() + 60_000) return shareHubTokens.accessToken;
  if (shareHubTokenFlight) return shareHubTokenFlight;
  shareHubTokenFlight = (async () => {
    const old = shareHubTokens; const useRefresh = Boolean(old?.refreshToken);
    const response = await fetch(SHAREHUB_AUTH + (useRefresh ? "/refresh" : "/email"), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(useRefresh ? { accessToken: old!.accessToken, refreshToken: old!.refreshToken } : { email: process.env.SHAREHUB_EMAIL, password: process.env.SHAREHUB_PASSWORD, useOnCookies: false }), cache: "no-store", signal: AbortSignal.timeout(9000) });
    if (!response.ok) throw new Error("ShareHub authentication failed (" + response.status + ")");
    const payload = await response.json() as { success?: boolean; data?: { accessToken?: string; refreshToken?: string; accessTokenExpiration?: string } };
    const accessToken = payload.data?.accessToken, refreshToken = payload.data?.refreshToken;
    if (!payload.success || !accessToken || !refreshToken) throw new Error("ShareHub returned an invalid authentication response.");
    shareHubTokens = { accessToken, refreshToken, accessExpiresAt: Date.parse(payload.data?.accessTokenExpiration || "") || Date.now() + 25 * 60_000 }; return accessToken;
  })().finally(() => { shareHubTokenFlight = null; }); return shareHubTokenFlight;
}
async function shareHubGet(path: string, retry = true): Promise<unknown> {
  const token = await getShareHubToken(); if (!token) throw new Error("ShareHub credentials are not configured.");
  const response = await fetch(SHAREHUB_DATA + path, { headers: { Accept: "application/json", Authorization: "Bearer " + token }, cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (response.status === 401 && retry) { await getShareHubToken(true); return shareHubGet(path, false); }
  if (!response.ok) throw new Error("ShareHub data request failed (" + response.status + ")");
  const payload = await response.json() as { success?: boolean; data?: unknown; message?: string };
  if (payload.success === false || payload.data === undefined) throw new Error(payload.message || "ShareHub returned no data."); return payload.data;
}
function shareHubRows(value: unknown): unknown[] { if (Array.isArray(value)) return value; const row = asRecord(value); if (!row) return []; for (const key of ["content", "items", "prices", "stocks", "history", "data", "records"]) if (Array.isArray(row[key])) return row[key] as unknown[]; return []; }
async function fetchShareHubSnapshot(symbol: string, period: string) {
  if (!shareHubEnabled()) return null;
  try {
    const time = period === "1M" ? "1M" : period === "3M" ? "3M" : "1Y";
    const results = await Promise.all([shareHubGet("/market"), shareHubGet("/stock-prices" + (INDEX_SYMBOLS.has(symbol) ? "" : "?symbol=" + encodeURIComponent(symbol))), shareHubGet("/price-history/" + encodeURIComponent(symbol) + "?time=" + time).catch(() => null), shareHubGet("/sectors").catch(() => [])]);
    const market = asRecord(results[0]) || {};
    const stocks = shareHubRows(results[1]).flatMap(item => { const row = asRecord(item); if (!row) return []; const ticker = String(firstValue(row, ["symbol", "securitySymbol"]) || "").toUpperCase(); const ltp = Number(firstValue(row, ["ltp", "lastTradedPrice", "close"])); if (!ticker || !Number.isFinite(ltp) || ltp <= 0) return []; const updated = firstValue(row, ["lastUpdatedTime", "lastUpdatedDateTime", "updatedAt", "timestamp"]); return [{ ...row, symbol: ticker, name: String(firstValue(row, ["name", "securityName"]) || ticker), ltp, previous_close: Number(firstValue(row, ["previousClose", "previous_close"])) || null, change: Number(firstValue(row, ["change", "pointChange"])) || null, percent_change: Number(firstValue(row, ["changePercent", "percentChange", "percentageChange"])) || null, high: Number(firstValue(row, ["high", "highPrice"])) || 0, low: Number(firstValue(row, ["low", "lowPrice"])) || 0, volume: Number(firstValue(row, ["volume", "totalTradeQuantity"])) || 0, turnover: Number(firstValue(row, ["turnover", "totalTradeValue"])) || 0, trades: Number(firstValue(row, ["transactions", "totalTransactions"])) || 0, last_updated: normalizeNepalTimestamp(updated) }]; });
    const points = shareHubRows(results[2]).flatMap(item => { const row = asRecord(item); if (!row) return []; const dateRaw = firstValue(row, ["date", "businessDate", "tradingDate", "time"]); const close = Number(firstValue(row, ["close", "closePrice", "ltp"])); if (!dateRaw || !Number.isFinite(close) || close <= 0) return []; return [{ date: String(dateRaw).slice(0, 10), close, open: Number(firstValue(row, ["open", "openPrice"])) || undefined, high: Number(firstValue(row, ["high", "highPrice"])) || undefined, low: Number(firstValue(row, ["low", "lowPrice"])) || undefined, volume: Number(firstValue(row, ["volume", "totalTradeQuantity"])) || undefined, turnover: Number(firstValue(row, ["turnover", "totalTradeValue"])) || undefined, trades: Number(firstValue(row, ["transactions", "totalTransactions"])) || undefined }]; }).sort((a,b) => a.date.localeCompare(b.date));
    const indices = (Array.isArray(market.indices) ? market.indices : []).map(item => { const row = asRecord(item); return row ? { ...row, index: row.name, close: row.value ?? row.currentValue, generatedTime: normalizeNepalTimestamp(row.lastUpdatedDateTime ?? row.time) } : item; });
    const updated = stocks.reduce((latest, row) => row.last_updated && row.last_updated > latest ? row.last_updated : latest, "");
    const validFresh = stocks.length > 0 && Boolean(updated) && Number.isFinite(Date.parse(updated)) && Date.now() - Date.parse(updated) <= 30 * 60_000 && Date.now() - Date.parse(updated) >= -120_000; if (!validFresh) throw new Error("ShareHub quote timestamp is missing or stale.");
    return { stocks, points, indices, sectors: shareHubRows(results[3]), status: asRecord(market.marketStatus) || {}, summary: market.marketSummary || [], stockSummary: market.stockSummary || {}, timestamp: updated, historyAvailable: points.length >= 50 };
  } catch { return null; }
}
const NEPSEMAN = "https://nepseman-api-production.up.railway.app";
const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const firstValue = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
  return undefined;
};
function extractRows(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  const object = asRecord(payload);
  if (!object) return [];
  for (const key of ["data", "results", "stocks", "prices", "payload", "items", "content"]) {
    const value = object[key];
    if (Array.isArray(value)) return value;
    const nested = asRecord(value);
    if (nested) {
      for (const nestedKey of ["data", "results", "stocks", "prices", "items", "content"]) {
        if (Array.isArray(nested[nestedKey])) return nested[nestedKey] as unknown[];
      }
    }
  }
  return [];
}
async function readNepseman<T>(path: string): Promise<T> {
  const response = await fetch(NEPSEMAN + path, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error("NEPSE unofficial provider returned HTTP " + response.status);
  return response.json() as Promise<T>;
}
async function fetchNepsemanSnapshot() {
  const [pricesResult, statusResult, indexResult] = await Promise.allSettled([
    readNepseman<unknown>("/api/v1/prices/today"),
    readNepseman<unknown>("/api/v1/market/status"),
    readNepseman<unknown>("/api/v1/indices/nepse"),
  ]);
  if (pricesResult.status !== "fulfilled") return null;
  const raw = pricesResult.value;
  const root = asRecord(raw);
  const globalTimestamp = firstValue(root || {}, ["last_updated", "updated_at", "timestamp", "generated_at", "generatedTime"]);
  const rows = extractRows(raw);
  const stocks = rows.flatMap((item) => {
    const row = asRecord(item);
    if (!row) return [];
    const symbol = String(firstValue(row, ["symbol", "securitySymbol", "stock_symbol", "scrip"]) || "").toUpperCase();
    const ltp = Number(firstValue(row, ["ltp", "lastTradedPrice", "last_traded_price", "closePrice", "price", "closingPrice"]));
    if (!/^[A-Z0-9]{2,16}$/.test(symbol) || !Number.isFinite(ltp) || ltp <= 0) return [];
    const updated = firstValue(row, ["last_updated", "updated_at", "timestamp", "lastTradedTime", "businessDate"]) ?? globalTimestamp;
    const previous = Number(firstValue(row, ["previous_close", "previousClose", "previousClosingPrice", "closePrice"]));
    const change = Number(firstValue(row, ["change", "pointChange", "difference"]));
    const percent = Number(firstValue(row, ["percent_change", "percentageChange", "percentage_change"]));
    return [{
      ...row,
      symbol,
      name: String(firstValue(row, ["name", "securityName", "companyName"]) || symbol),
      ltp,
      previous_close: Number.isFinite(previous) ? previous : null,
      change: Number.isFinite(change) ? change : null,
      percent_change: Number.isFinite(percent) ? percent : null,
      high: Number(firstValue(row, ["high", "highPrice", "maxPrice"]) || 0),
      low: Number(firstValue(row, ["low", "lowPrice", "minPrice"]) || 0),
      volume: Number(firstValue(row, ["volume", "totalTradeQuantity", "tradedShares"]) || 0),
      turnover: Number(firstValue(row, ["turnover", "totalTradeValue", "amount"]) || 0),
      trades: Number(firstValue(row, ["trades", "totalTrades", "totalTransactions"]) || 0),
      last_updated: normalizeNepalTimestamp(updated),
    }];
  });
  const timestamp = stocks.reduce((latest, stock) => stock.last_updated > latest ? stock.last_updated : latest, "");
  const timestampMs = timestamp ? Date.parse(timestamp) : Number.NaN;
  const ageMs = Number.isFinite(timestampMs) ? Date.now() - timestampMs : Number.NaN;
  const ageMinutes = Number.isFinite(ageMs) ? Math.max(0, ageMs / 60_000) : Number.POSITIVE_INFINITY;
  // Reject timestamps materially in the future as well as stale/missing timestamps.
  const validFreshSnapshot = stocks.length > 20 && Number.isFinite(ageMs) && ageMs >= -120_000 && ageMs <= 20 * 60_000;
  const status = statusResult.status === "fulfilled" ? statusResult.value : null;
  const index = indexResult.status === "fulfilled" ? indexResult.value : null;
  return validFreshSnapshot ? { stocks, timestamp, ageMinutes, status, index } : null;
}
async function read<T>(path: string, revalidateSeconds = 900): Promise<T> {
  const response = await fetch(BASE + path, {
    headers: { Accept: "application/json" },
    next: { revalidate: revalidateSeconds },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error("Market data source returned " + response.status + " for " + path);
  return response.json() as Promise<T>;
}
function normalizeNepalTimestamp(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "";
  const timestamp = value.trim().replace(" ", "T");
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp)) return timestamp;
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(timestamp)
    ? timestamp + "+05:45"
    : value.trim();
}

function monthCount(period: string) {
  return period === "1M" ? 1 : period === "3M" ? 3 : 12;
}
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const symbol = (params.get("symbol") || "NEPSE").toUpperCase();
  const period = ["1M", "3M", "1Y"].includes(params.get("period") || "") ? params.get("period")! : "3M";
  if (!/^[A-Z0-9]{2,16}$/.test(symbol)) {
    return Response.json({ error: "Invalid stock symbol." }, { status: 400 });
  }
  const [shareHubSnapshot, unofficialSnapshot, liveStocksResult, stocksResult, indicesResult, statusResult, summaryResult, topResult, sectorsResult, supplyDemandResult, manifestResult, ltpManifestResult] = await Promise.all([
    fetchShareHubSnapshot(symbol, period),
    fetchNepsemanSnapshot().catch(() => null),
    Promise.allSettled([read<unknown[]>("/data/market/live.json", 60)]).then((items) => items[0]),
    Promise.allSettled([read<unknown[]>("/data/nepse_data.json", 60)]).then((items) => items[0]),
    Promise.allSettled([read<unknown[]>("/data/market/indices.json", 60)]).then((items) => items[0]),
    Promise.allSettled([read<Json>("/data/market/status.json", 60)]).then((items) => items[0]),
    Promise.allSettled([read<unknown[]>("/data/market/summary.json", 60)]).then((items) => items[0]),
    Promise.allSettled([read<Json>("/data/market/top_stocks.json", 60)]).then((items) => items[0]),
    Promise.allSettled([read<unknown[]>("/data/market/sector_indices.json", 60)]).then((items) => items[0]),
    Promise.allSettled([read<Json>("/data/market/supply_demand.json", 60)]).then((items) => items[0]),
    Promise.allSettled([read<{ availableMonths?: string[]; latestDate?: string }>("/data/indices/manifest.json", 300)]).then((items) => items[0]),
    Promise.allSettled([read<{ availableMonths?: string[]; latestDate?: string }>("/data/ltp/manifest.json", 300)]).then((items) => items[0]),
  ]);
  const liveStocks = liveStocksResult.status === "fulfilled" && Array.isArray(liveStocksResult.value) ? liveStocksResult.value : [];
  const fallbackStocks = stocksResult.status === "fulfilled" && Array.isArray(stocksResult.value) ? stocksResult.value : [];
  const usingShareHub = Boolean(shareHubSnapshot);
  const usingUnofficialLive = !usingShareHub && Boolean(unofficialSnapshot);
  const usingLiveQuotes = usingShareHub || usingUnofficialLive || liveStocks.length > 0;
  const stocks = usingShareHub ? shareHubSnapshot!.stocks : usingUnofficialLive ? unofficialSnapshot!.stocks : usingLiveQuotes ? liveStocks : fallbackStocks;
  const indices = usingShareHub ? shareHubSnapshot!.indices : indicesResult.status === "fulfilled" && Array.isArray(indicesResult.value)
    ? indicesResult.value.map((item) => {
        const row = asRecord(item);
        return row ? { ...row, generatedTime: normalizeNepalTimestamp(row.generatedTime) } : item;
      })
    : [];
  const marketStatus = usingShareHub ? shareHubSnapshot!.status : statusResult.status === "fulfilled"
    ? { ...statusResult.value, last_checked: normalizeNepalTimestamp(statusResult.value.last_checked) }
    : {};
  if (!stocks.length && !indices.length) {
    return Response.json(
      { error: "NEPSE market snapshot is temporarily unavailable. Please retry or visit the official NEPSE market page." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
  const manifest = manifestResult.status === "fulfilled" ? manifestResult.value : { availableMonths: [], latestDate: undefined };
  const isIndex = INDEX_SYMBOLS.has(symbol);
  const historyKind = isIndex ? "indices" : "ltp";
  const historyManifest = historyKind === "indices"
    ? manifest
    : ltpManifestResult.status === "fulfilled" ? ltpManifestResult.value : { availableMonths: [] };
  const availableMonths = Array.isArray(historyManifest.availableMonths) ? historyManifest.availableMonths : [];
  const selectedMonths = availableMonths.slice(-monthCount(period));
  const historyResults = await Promise.allSettled(
    selectedMonths.map((month) => read<Json>("/data/" + historyKind + "/monthly/" + month + ".json")),
  );
  const points: Array<{ date: string; close: number; open?: number; high?: number; low?: number; volume?: number; turnover?: number; trades?: number }> = [];
  if (usingShareHub && shareHubSnapshot!.historyAvailable) points.push(...shareHubSnapshot!.points);
  for (const result of (usingShareHub && shareHubSnapshot!.historyAvailable ? [] : historyResults)) {
    if (result.status !== "fulfilled") continue;
    const shard = result.value;
    const dates = Array.isArray(shard.dates) ? shard.dates as string[] : [];
    const series = shard.series && typeof shard.series === "object" ? shard.series as Record<string, unknown> : {};
    const rows = Array.isArray(series[symbol]) ? series[symbol] as unknown[][] : [];
    for (const row of rows) {
      const index = Number(row[0]);
      const date = dates[index];
      const close = Number(row[1]);
      if (!date || !Number.isFinite(close)) continue;
      if (isIndex) {
        points.push({ date, close, open: Number(row[2]), high: Number(row[3]), low: Number(row[4]), turnover: Number(row[5]), volume: Number(row[6]), trades: Number(row[7]) });
      } else {
        points.push({ date, close, volume: Number(row[2]), turnover: Number(row[3]), trades: Number(row[4]) });
      }
    }
  }
  // The archived NEPSE index series can lag behind the current market snapshot.
  // Append the latest dated index close so the chart does not stop at an older archive date.
  if (isIndex) {
    const indexNameBySymbol: Record<string, string> = {
      NEPSE: "NEPSE Index", SENSIND: "Sensitive Index", FLOATIND: "Float Index",
      SENSFLTIND: "Sensitive Float Index", BANKSUBIND: "Banking SubIndex", DEVBANKIND: "Development Bank Index",
      FININD: "Finance Index", HOTELIND: "Hotels And Tourism Index", HYDPOWIND: "HydroPower Index",
      INVIDX: "Investment Index", LIFINSIND: "Life Insurance Index", MANPROCIND: "Manufacturing And Processing",
      MICRFININD: "Microfinance Index", MUTUALIND: "Mutual Fund Index", NONLIFIND: "Non Life Insurance Index",
      OTHERSIND: "Others Index", TRDIND: "Trading Index",
    };
    const latestIndex = indices.map(asRecord).find((row) => row && row.index === indexNameBySymbol[symbol]);
    const rawDate = latestIndex?.generatedTime;
    const latestDate = typeof rawDate === "string" && rawDate
      ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(rawDate))
      : "";
    const latestClose = Number(latestIndex?.close);
    if (latestDate && Number.isFinite(latestClose) && latestClose > 0 && !points.some((point) => point.date === latestDate)) {
      points.push({
        date: latestDate,
        close: latestClose,
        open: Number(latestIndex?.open),
        high: Number(latestIndex?.high),
        low: Number(latestIndex?.low),
      });
    }
  }
  points.sort((a, b) => a.date.localeCompare(b.date));
  const sectorMeta = sectorsResult.status === "fulfilled" && Array.isArray(sectorsResult.value)
    ? sectorsResult.value as Array<{ indexCode?: string; indexName?: string; description?: string }>
    : [];
  const indexMonths = (Array.isArray(manifest.availableMonths) ? manifest.availableMonths : []).slice(-2);
  const indexHistoryResults = historyKind === "indices"
    ? historyResults
    : await Promise.allSettled(indexMonths.map((month) => read<Json>("/data/indices/monthly/" + month + ".json")));
  const sectors = sectorMeta.map((sector) => {
    const history: Array<{ date: string; close: number }> = [];
    for (const result of indexHistoryResults) {
      if (result.status !== "fulfilled") continue;
      const shard = result.value;
      const dates = Array.isArray(shard.dates) ? shard.dates as string[] : [];
      const series = shard.series && typeof shard.series === "object" ? shard.series as Record<string, unknown> : {};
      const rows = sector.indexCode && Array.isArray(series[sector.indexCode]) ? series[sector.indexCode] as unknown[][] : [];
      for (const row of rows) {
        const date = dates[Number(row[0])];
        const close = Number(row[1]);
        if (date && Number.isFinite(close)) history.push({ date, close });
      }
    }
    history.sort((a, b) => a.date.localeCompare(b.date));
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    const change = latest && previous ? latest.close - previous.close : null;
    const perChange = latest && previous && previous.close !== 0 ? change! / previous.close * 100 : null;
    return { ...sector, currentValue: latest?.close ?? null, change, perChange, latestDate: latest?.date ?? null };
  });
  const pick = <T,>(result: PromiseSettledResult<T>, fallback: T): T => result.status === "fulfilled" ? result.value : fallback;
  const sourceUpdatedAtRaw = usingShareHub
    ? shareHubSnapshot!.timestamp
    : usingUnofficialLive
    ? unofficialSnapshot!.timestamp
    : (stocks as Array<{ last_updated?: string }>).reduce((latest, stock) => stock.last_updated && stock.last_updated > latest ? stock.last_updated : latest, "");
  // YONEPSE timestamps without an explicit offset are Nepal-local exchange times.
  // Normalize them to +05:45 before age calculations and before displaying the timestamp.
  const sourceUpdatedAt = normalizeNepalTimestamp(sourceUpdatedAtRaw) || sourceUpdatedAtRaw;
  const quoteTimestamp = Date.parse(sourceUpdatedAt);
  const quoteAgeHours = Number.isFinite(quoteTimestamp) ? (Date.now() - quoteTimestamp) / 3_600_000 : Number.POSITIVE_INFINITY;
  // Weekends/holidays can legitimately pause NEPSE updates; four days is a conservative stale-data warning.
  const quoteStale = !usingLiveQuotes || !Number.isFinite(quoteTimestamp) || quoteAgeHours > 96;
  const response = {
    symbol,
    period,
    // YONEPSE documents an approximately hourly update cadence; do not label this as exchange-tick live data.
    source: usingShareHub ? "ShareHub licensed NEPSE Data API" : usingUnofficialLive ? "NEPSE unofficial live API (nepseman-api)" : usingLiveQuotes ? "YONEPSE public market snapshot" : "YONEPSE historical snapshot fallback",
    sourceUpdatedAt: sourceUpdatedAt || null,
    fetchedAt: new Date().toISOString(),
    quoteAgeMinutes: Number.isFinite(quoteTimestamp) ? Math.max(0, Math.round((Date.now() - quoteTimestamp) / 60_000)) : null,
    providerRefreshCadence: usingShareHub ? "Approximately 20 seconds during trading; 5 minutes when closed (provider documentation)" : usingUnofficialLive ? "NEPSE trading-session feed; verify timestamp on every response" : "Approximately hourly on weekdays during market hours (provider documentation)",
    quoteStale,
    latestHistoryDate: points.length ? points[points.length - 1].date : historyManifest.latestDate ?? null,
    status: marketStatus,
    indices,
    summary: usingShareHub ? shareHubSnapshot!.summary : pick(summaryResult, []),
    stockSummary: usingShareHub ? shareHubSnapshot!.stockSummary : null,
    topStocks: pick(topResult, {}),
    sectors: usingShareHub ? shareHubSnapshot!.sectors : sectors,
    supplyDemand: pick(supplyDemandResult, {}),
    stocks,
    points,
    // The unofficial provider currently supplies stock quote rows only. The other panels
    // remain sourced from YONEPSE archives until their schemas and timestamps are verified.
    dataCoverage: {
      stockQuotes: usingShareHub ? "ShareHub licensed live API (timestamp-checked)" : usingUnofficialLive ? "Unofficial NEPSE session feed (timestamp-checked)" : usingLiveQuotes ? "YONEPSE public snapshot" : "YONEPSE historical fallback",
      indexCards: usingShareHub ? "ShareHub licensed live API" : "YONEPSE public snapshot",
      marketSummary: usingShareHub ? "ShareHub licensed live API" : "YONEPSE public snapshot",
      topMovers: usingShareHub ? "ShareHub live market snapshot" : "YONEPSE public snapshot",
      sectorIndices: usingShareHub ? "ShareHub live sector snapshot" : "YONEPSE archived daily data",
      supplyDemand: "YONEPSE public snapshot",
      historicalCharts: usingShareHub && shareHubSnapshot!.historyAvailable ? "ShareHub licensed daily OHLCV history" : "YONEPSE archived daily data",
    },
    partial: !usingLiveQuotes || [indicesResult, statusResult, summaryResult, topResult, sectorsResult, supplyDemandResult, manifestResult, ltpManifestResult].some((item) => item.status === "rejected") || historyResults.some((item) => item.status === "rejected") || indexHistoryResults.some((item) => item.status === "rejected"),
  };
  return Response.json(response, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
