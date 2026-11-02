export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = "https://shubhamnpk.github.io/yonepse";
type Json = Record<string, unknown>;
async function read<T>(path: string): Promise<T> {
  const response = await fetch(BASE + path, {
    headers: { Accept: "application/json" },
    next: { revalidate: 900 },
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
  const [stocksResult, indicesResult, statusResult, summaryResult, topResult, sectorsResult, manifestResult] = await Promise.allSettled([
    read<unknown[]>("/data/nepse_data.json"),
    read<unknown[]>("/data/market/indices.json"),
    read<Json>("/data/market/status.json"),
    read<unknown[]>("/data/market/summary.json"),
    read<Json>("/data/market/top_stocks.json"),
    read<unknown[]>("/data/market/sector_indices.json"),
    read<{ availableMonths?: string[]; latestDate?: string }>("/data/indices/manifest.json"),
  ]);
  const stocks = stocksResult.status === "fulfilled" && Array.isArray(stocksResult.value) ? stocksResult.value : [];
  const indices = indicesResult.status === "fulfilled" && Array.isArray(indicesResult.value) ? indicesResult.value : [];
  if (!stocks.length || !indices.length) {
    return Response.json(
      { error: "NEPSE market snapshot is temporarily unavailable. Please retry or visit the official NEPSE market page." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
  const manifest = manifestResult.status === "fulfilled" ? manifestResult.value : { availableMonths: [] };
  const availableMonths = Array.isArray(manifest.availableMonths) ? manifest.availableMonths : [];
  const selectedMonths = availableMonths.slice(-monthCount(period));
  const historyKind = symbol === "NEPSE" ? "indices" : "ltp";
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
      if (symbol === "NEPSE") {
        points.push({ date, close, open: Number(row[2]), high: Number(row[3]), low: Number(row[4]), turnover: Number(row[5]), volume: Number(row[6]), trades: Number(row[7]) });
      } else {
        points.push({ date, close, volume: Number(row[2]), turnover: Number(row[3]), trades: Number(row[4]) });
      }
    }
  }
  points.sort((a, b) => a.date.localeCompare(b.date));
  const pick = <T,>(result: PromiseSettledResult<T>, fallback: T): T => result.status === "fulfilled" ? result.value : fallback;
  const response = {
    symbol,
    period,
    source: "YONEPSE public dataset",
    sourceUpdatedAt: (stocks as Array<{ last_updated?: string }>).reduce((latest, stock) => stock.last_updated && stock.last_updated > latest ? stock.last_updated : latest, ""),
    latestHistoryDate: points.at(-1)?.date ?? manifest.latestDate ?? null,
    status: pick(statusResult, {}),
    indices,
    summary: pick(summaryResult, []),
    topStocks: pick(topResult, {}),
    sectors: pick(sectorsResult, []),
    stocks,
    points,
    partial: [statusResult, summaryResult, topResult, sectorsResult, manifestResult].some((item) => item.status === "rejected") || historyResults.some((item) => item.status === "rejected"),
  };
  return Response.json(response, {
    headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" },
  });
}
