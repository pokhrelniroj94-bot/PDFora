export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = "https://raw.githubusercontent.com/Shubhamnpk/yonepse/main";
const INDEX_SYMBOLS = new Set(["NEPSE", "SENSIND", "FLOATIND", "SENSFLTIND", "BANKSUBIND", "DEVBANKIND", "FININD", "HOTELIND", "HYDPOWIND", "INVIDX", "LIFINSIND", "MANPROCIND", "MICRFININD", "MUTUALIND", "NONLIFIND", "OTHERSIND", "TRDIND"]);
const INDEX_CODE_BY_NAME: Record<string, string> = {
  "NEPSE Index": "NEPSE", "Sensitive Index": "SENSIND", "Float Index": "FLOATIND",
  "Sensitive Float Index": "SENSFLTIND", "Banking SubIndex": "BANKSUBIND",
  "Development Bank Index": "DEVBANKIND", "Finance Index": "FININD",
  "Hotels And Tourism Index": "HOTELIND", "HydroPower Index": "HYDPOWIND",
  "Investment Index": "INVIDX", "Life Insurance Index": "LIFINSIND",
  "Manufacturing And Processing": "MANPROCIND", "Microfinance Index": "MICRFININD",
  "Mutual Fund Index": "MUTUALIND", "Mutual Fund": "MUTUALIND",
  "Non Life Insurance Index": "NONLIFIND", "Non Life Insurance": "NONLIFIND",
  "Others Index": "OTHERSIND", "Others": "OTHERSIND", "Trading Index": "TRDIND",
};
type Json = Record<string, unknown>;
async function read<T>(path: string, revalidateSeconds = 300): Promise<T> {
  const response = await fetch(BASE + path, {
    headers: { Accept: "application/json" },
    next: { revalidate: revalidateSeconds },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error("Market data source returned " + response.status + " for " + path);
  return response.json() as Promise<T>;
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
  const [liveStocksResult, stocksResult, indicesResult, statusResult, summaryResult, topResult, sectorsResult, supplyDemandResult, manifestResult, ltpManifestResult] = await Promise.allSettled([
    read<unknown[]>("/data/market/live.json", 60),
    read<unknown[]>("/data/nepse_data.json", 60),
    read<unknown[]>("/data/market/indices.json", 60),
    read<Json>("/data/market/status.json", 60),
    read<unknown[]>("/data/market/summary.json", 60),
    read<Json>("/data/market/top_stocks.json", 60),
    read<unknown[]>("/data/market/sector_indices.json", 60),
    read<Json>("/data/market/supply_demand.json", 60),
    read<{ availableMonths?: string[]; latestDate?: string }>("/data/indices/manifest.json"),
    read<{ availableMonths?: string[]; latestDate?: string }>("/data/ltp/manifest.json"),
  ]);
  const liveStocks = liveStocksResult.status === "fulfilled" && Array.isArray(liveStocksResult.value) ? liveStocksResult.value : [];
  const fallbackStocks = stocksResult.status === "fulfilled" && Array.isArray(stocksResult.value) ? stocksResult.value : [];
  const usingLiveQuotes = liveStocks.length > 0;
  const stocks = usingLiveQuotes ? liveStocks : fallbackStocks;
  const indices = indicesResult.status === "fulfilled" && Array.isArray(indicesResult.value) ? indicesResult.value : [];
  if (!stocks.length && !indices.length) {
    return Response.json(
      { error: "NEPSE market snapshot is temporarily unavailable. Please retry or visit the official NEPSE market page." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
  const manifest = manifestResult.status === "fulfilled" ? manifestResult.value : { availableMonths: [], latestDate: undefined };
  const isIndex = INDEX_SYMBOLS.has(symbol) || sectorMeta.some((sector) => sector.indexCode === symbol);
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
  points.sort((a, b) => a.date.localeCompare(b.date));
  const sectorMeta = sectorsResult.status === "fulfilled" && Array.isArray(sectorsResult.value)
    ? sectorsResult.value as Array<{ indexCode?: string; indexName?: string; description?: string }>
    : [];
  const indexMonths = (Array.isArray(manifest.availableMonths) ? manifest.availableMonths : []).slice(-2);
  const indexHistoryResults = historyKind === "indices"
    ? historyResults
    : await Promise.allSettled(indexMonths.map((month) => read<Json>("/data/indices/monthly/" + month + ".json")));
  // Sector cards must use the same current quote snapshot as the headline index cards.
  // Historical archives can lag the live quote feed by a session or more; use them
  // only as a clearly dated fallback when the live snapshot has no matching index.
  const liveIndexByCode = new Map(
    (indices as Array<{ index?: string; currentValue?: number; close?: number; change?: number; perChange?: number; generatedTime?: string }>)
      .map((item) => [INDEX_CODE_BY_NAME[item.index ?? ""] ?? "", item] as const)
      .filter(([code]) => Boolean(code)),
  );
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
    const historicalChange = latest && previous ? latest.close - previous.close : null;
    const historicalPerChange = latest && previous && previous.close !== 0 ? historicalChange! / previous.close * 100 : null;
    const live = liveIndexByCode.get(sector.indexCode ?? "");
    const liveValue = live?.currentValue ?? live?.close;
    return {
      ...sector,
      currentValue: typeof liveValue === "number" && Number.isFinite(liveValue) ? liveValue : latest?.close ?? null,
      change: typeof live?.change === "number" && Number.isFinite(live.change) ? live.change : historicalChange,
      perChange: typeof live?.perChange === "number" && Number.isFinite(live.perChange) ? live.perChange : historicalPerChange,
      latestDate: live?.generatedTime ?? latest?.date ?? null,
      valueSource: live ? "current snapshot" : latest ? "historical archive" : "unavailable",
    };
  });
  const pick = <T,>(result: PromiseSettledResult<T>, fallback: T): T => result.status === "fulfilled" ? result.value : fallback;
  const response = {
    symbol,
    period,
    source: usingLiveQuotes ? "YONEPSE live quote snapshot" : "YONEPSE fallback quote snapshot",
    sourceUpdatedAt: (stocks as Array<{ last_updated?: string }>).reduce((latest, stock) => stock.last_updated && stock.last_updated > latest ? stock.last_updated : latest, ""),
    sourceCheckedAt: new Date().toISOString(),
    latestHistoryDate: points.length ? points[points.length - 1].date : historyManifest.latestDate ?? null,
    status: pick(statusResult, {}),
    indices,
    summary: pick(summaryResult, []),
    topStocks: pick(topResult, {}),
    sectors,
    supplyDemand: pick(supplyDemandResult, {}),
    stocks,
    points,
    partial: !usingLiveQuotes || [indicesResult, statusResult, summaryResult, topResult, sectorsResult, supplyDemandResult, manifestResult, ltpManifestResult].some((item) => item.status === "rejected") || historyResults.some((item) => item.status === "rejected") || indexHistoryResults.some((item) => item.status === "rejected"),
  };
  return Response.json(response, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" },
  });
}
