export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = "https://raw.githubusercontent.com/Shubhamnpk/yonepse/main";
const INDEX_SYMBOLS = new Set(["NEPSE", "SENSIND", "FLOATIND", "SENSFLTIND", "BANKSUBIND", "DEVBANKIND", "FININD", "HOTELIND", "HYDPOWIND", "INVIDX", "LIFINSIND", "MANPROCIND", "MICRFININD", "MUTUALIND", "NONLIFIND", "OTHERSIND", "TRDIND"]);
type Json = Record<string, unknown>;

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
    const optionalNumber = (keys: string[]) => {
      const rawValue = firstValue(row, keys);
      if (rawValue === undefined) return null;
      const parsed = Number(rawValue);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
    };
    const previous = optionalNumber(["previous_close", "previousClose", "previousClosingPrice"]);
    const explicitChange = optionalNumber(["change", "pointChange", "difference"]);
    const explicitPercent = Number(firstValue(row, ["percent_change", "percentageChange", "percentage_change"]));
    const change = explicitChange ?? (previous !== null ? ltp - previous : null);
    const percent = Number.isFinite(explicitPercent)
      ? explicitPercent
      : previous !== null && previous > 0 ? (ltp / previous - 1) * 100 : null;
    return [{
      ...row,
      symbol,
      name: String(firstValue(row, ["name", "securityName", "companyName"]) || symbol),
      ltp,
      previous_close: previous,
      change,
      percent_change: percent,
      high: optionalNumber(["high", "highPrice", "maxPrice"]),
      low: optionalNumber(["low", "lowPrice", "minPrice"]),
      volume: optionalNumber(["volume", "totalTradeQuantity", "tradedShares"]),
      turnover: optionalNumber(["turnover", "totalTradeValue", "amount"]),
      trades: optionalNumber(["trades", "totalTrades", "totalTransactions"]),
      last_updated: normalizeNepalTimestamp(updated),
    }];
  });
  const rowTimestamps = stocks.map(stock => Date.parse(stock.last_updated)).filter(Number.isFinite).sort((a, b) => a - b);
  const globalTimestampMs = Date.parse(normalizeNepalTimestamp(String(globalTimestamp ?? "")));
  const timestampMs = Number.isFinite(globalTimestampMs)
    ? globalTimestampMs
    : rowTimestamps.length >= Math.ceil(stocks.length * 0.9)
      ? rowTimestamps[Math.floor(rowTimestamps.length / 2)]
      : Number.NaN;
  const timestamp = Number.isFinite(timestampMs) ? new Date(timestampMs).toISOString() : "";
  const ageMs = Number.isFinite(timestampMs) ? Date.now() - timestampMs : Number.NaN;
  const ageMinutes = Number.isFinite(ageMs) ? Math.max(0, ageMs / 60_000) : Number.POSITIVE_INFINITY;
  // Require a recent snapshot-level timestamp or timestamps on at least 90% of rows.
  // One recently traded stock must not make an otherwise stale snapshot look fresh.
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
async function fetchCommunityHistory(symbol: string, period: string) {
  const file = symbol === "NEPSE" ? "NEPSE_INDEX.csv" : symbol + ".csv";
  const url = "https://raw.githubusercontent.com/binayabaral/nepal-market-data/main/data/nepse/" + encodeURIComponent(file);
  const response = await fetch(url, {
    headers: { Accept: "text/csv" },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Community history archive returned HTTP " + response.status);
  const csv = await response.text();
  const lines = csv.split(/\r?\n/);
  const headers = (lines.shift() || "").split(",").map((value) => value.trim());
  const column = (name: string) => headers.indexOf(name);
  const dateIndex = column("published_date");
  const closeIndex = column("close");
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const rows: Array<{ date: string; close: number; open?: number; high?: number; low?: number; volume?: number; turnover?: number }> = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = line.split(",").map((value) => value.trim());
    const date = cells[dateIndex] || "";
    const close = Number(cells[closeIndex]);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > today || !Number.isFinite(Date.parse(date)) || !Number.isFinite(close) || close <= 0) continue;
    const numeric = (name: string) => {
      const index = column(name);
      const value = index >= 0 && cells[index] !== "" ? Number(cells[index]) : Number.NaN;
      return Number.isFinite(value) && value > 0 ? value : undefined;
    };
    const point: { date: string; close: number; open?: number; high?: number; low?: number; volume?: number; turnover?: number } = { date, close };
    const open = numeric("open"), high = numeric("high"), low = numeric("low");
    if (open !== undefined) point.open = open;
    if (high !== undefined) point.high = high;
    if (low !== undefined) point.low = low;
    const volumeIndex = column("traded_quantity");
    const volume = volumeIndex >= 0 && cells[volumeIndex] !== "" ? Number(cells[volumeIndex]) : Number.NaN;
    if (Number.isFinite(volume) && volume >= 0) point.volume = volume;
    const turnover = numeric("traded_amount");
    if (turnover !== undefined) point.turnover = turnover;
    rows.push(point);
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  const limit = period === "1M" ? 22 : period === "3M" ? 66 : 252;
  return rows.slice(-limit);
}
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const symbol = (params.get("symbol") || "NEPSE").toUpperCase();
  const period = ["1M", "3M", "1Y"].includes(params.get("period") || "") ? params.get("period")! : "3M";
  if (!/^[A-Z0-9]{2,16}$/.test(symbol)) {
    return Response.json({ error: "Invalid stock symbol." }, { status: 400 });
  }
  const [unofficialSnapshot, liveStocksResult, stocksResult, indicesResult, statusResult, summaryResult, topResult, sectorsResult, supplyDemandResult, manifestResult, ltpManifestResult] = await Promise.all([
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
  const usingUnofficialLive = Boolean(unofficialSnapshot);
  const usingLiveQuotes = usingUnofficialLive || liveStocks.length > 0;
  const stocks = usingUnofficialLive ? unofficialSnapshot!.stocks : usingLiveQuotes ? liveStocks : fallbackStocks;
  const indices = indicesResult.status === "fulfilled" && Array.isArray(indicesResult.value)
    ? indicesResult.value.map((item) => {
        const row = asRecord(item);
        return row ? { ...row, generatedTime: normalizeNepalTimestamp(row.generatedTime) } : item;
      })
    : [];
  const marketStatus = statusResult.status === "fulfilled"
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
  const selectedMonths = isIndex ? availableMonths.slice(-monthCount(period)) : [];
  const historyResults = await Promise.allSettled(
    selectedMonths.map((month) => read<Json>("/data/" + historyKind + "/monthly/" + month + ".json")),
  );
  const points: Array<{ date: string; close: number; open?: number; high?: number; low?: number; volume?: number; turnover?: number; trades?: number }> = [];
  for (const result of historyResults) {
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
  let historySource = points.length ? "YONEPSE public historical archive" : "Unavailable";
  const minimumHistoryPoints = period === "1M" ? 10 : period === "3M" ? 30 : 100;
  if (points.length < minimumHistoryPoints) {
    try {
      const communityHistory = await fetchCommunityHistory(symbol, period);
      if (communityHistory.length > points.length) {
        points.splice(0, points.length, ...communityHistory);
        historySource = "Nepal Market Data public CSV archive (community-maintained; unadjusted)";
      }
    } catch {
      // Keep the best available source result; never replace missing history with invented prices.
    }
  }
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
  const sourceUpdatedAtRaw = usingUnofficialLive
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
    source: usingUnofficialLive ? "NEPSE unofficial session feed (nepseman-api)" : usingLiveQuotes ? "YONEPSE public market snapshot" : "YONEPSE historical snapshot fallback",
    sourceUpdatedAt: sourceUpdatedAt || null,
    fetchedAt: new Date().toISOString(),
    quoteAgeMinutes: Number.isFinite(quoteTimestamp) ? Math.max(0, Math.round((Date.now() - quoteTimestamp) / 60_000)) : null,
    providerRefreshCadence: usingUnofficialLive ? "NEPSE trading-session feed; verify timestamp on every response" : "Community dataset refresh cadence; not exchange-tick live data",
    quoteStale,
    latestHistoryDate: points.length ? points[points.length - 1].date : isIndex ? historyManifest.latestDate ?? null : null,
    historySource,
    historyPriceBasis: historySource.includes("Nepal Market Data") ? "Unadjusted source-reported prices; corporate actions require separate adjustment" : "Source-reported historical values; adjustment status not independently verified",
    status: marketStatus,
    indices,
    summary: pick(summaryResult, []),
    stockSummary: null,
    topStocks: pick(topResult, {}),
    sectors,
    supplyDemand: pick(supplyDemandResult, {}),
    stocks,
    points,
    // The unofficial provider currently supplies stock quote rows only. The other panels
    // remain sourced from YONEPSE archives until their schemas and timestamps are verified.
    dataCoverage: {
      stockQuotes: usingUnofficialLive ? "Unofficial NEPSE session feed (timestamp-checked)" : usingLiveQuotes ? "YONEPSE public snapshot" : "YONEPSE historical fallback",
      indexCards: "YONEPSE public snapshot",
      marketSummary: "YONEPSE public snapshot",
      topMovers: "YONEPSE public snapshot",
      sectorIndices: "YONEPSE archived daily data",
      supplyDemand: "YONEPSE public snapshot",
      historicalCharts: historySource,
    },
    partial: !usingLiveQuotes || [indicesResult, statusResult, summaryResult, topResult, sectorsResult, supplyDemandResult, manifestResult, ltpManifestResult].some((item) => item.status === "rejected") || historyResults.some((item) => item.status === "rejected") || indexHistoryResults.some((item) => item.status === "rejected"),
  };
  return Response.json(response, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}
