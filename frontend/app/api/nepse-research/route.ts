export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = "https://raw.githubusercontent.com/Shubhamnpk/yonepse/main";
type Json = Record<string, unknown>;

async function readJson(path: string): Promise<unknown> {
  const response = await fetch(BASE + path, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error("UPSTREAM_" + response.status);
  return response.json();
}

function collectMatching(value: unknown, symbol: string, output: Json[], depth = 0): void {
  if (depth > 8 || output.length >= 80 || value == null) return;
  if (Array.isArray(value)) {
    for (const item of value) collectMatching(item, symbol, output, depth + 1);
    return;
  }
  if (typeof value !== "object") return;
  const row = value as Json;
  const ownSymbol = String(row.symbol ?? row.SYMBOL ?? row.securitySymbol ?? row.scrip ?? row.ticker ?? "").trim().toUpperCase();
  if (ownSymbol === symbol) output.push(row);
  for (const [key, child] of Object.entries(row)) {
    if (key.toUpperCase() === symbol && child && typeof child === "object") {
      if (Array.isArray(child)) for (const item of child) if (item && typeof item === "object") output.push(item as Json);
      else output.push(child as Json);
    } else if (child && typeof child === "object") collectMatching(child, symbol, output, depth + 1);
    if (output.length >= 80) break;
  }
}

function compact(value: unknown, max = 18_000): unknown {
  const seen = new WeakSet<object>();
  const clean = (input: unknown, depth: number): unknown => {
    if (input == null || typeof input === "string" || typeof input === "number" || typeof input === "boolean") return input;
    if (depth > 5) return undefined;
    if (Array.isArray(input)) return input.slice(-30).map((item) => clean(item, depth + 1)).filter((item) => item !== undefined);
    if (typeof input === "object") {
      if (seen.has(input as object)) return undefined;
      seen.add(input as object);
      const result: Json = {};
      for (const [key, child] of Object.entries(input as Json).slice(0, 70)) {
        const next = clean(child, depth + 1);
        if (next !== undefined) result[key] = next;
      }
      return result;
    }
    return undefined;
  };
  const result = clean(value, 0);
  const serialized = JSON.stringify(result);
  if (serialized.length <= max) return result;
  return { truncated: true, preview: serialized.slice(0, max) };
}

export async function GET(request: Request) {
  const symbol = (new URL(request.url).searchParams.get("symbol") || "").trim().toUpperCase();
  if (!/^[A-Z0-9&.-]{2,16}$/.test(symbol) || ["NEPSE", "SENSIND", "FLOATIND", "SENSFLTIND", "BANKSUBIND", "DEVBANKIND", "FININD", "HOTELIND", "HYDPOWIND", "INVIDX", "LIFINSIND", "MANPROCIND", "MICRFININD", "MUTUALIND", "NONLIFIND", "OTHERSIND", "TRDIND"].includes(symbol)) {
    return Response.json({ error: "Enter a listed company symbol, not a market index." }, { status: 400 });
  }

  const sources = [
    ["company financials", "/data/company/financials.json"],
    ["company profile", "/data/company/profiles.json"],
    ["dividend history", "/data/dividend/history.json"],
    ["exchange disclosures", "/data/notify/disclosures.json"],
    ["exchange notices", "/data/notify/notices.json"],
  ] as const;

  const results = await Promise.allSettled(sources.map(([, path]) => readJson(path)));
  const sections: Record<string, unknown> = {};
  const sourceStatus: Array<{ source: string; available: boolean }> = [];
  let matchedRecords = 0;
  results.forEach((result, index) => {
    const [label] = sources[index];
    if (result.status !== "fulfilled") {
      sourceStatus.push({ source: label, available: false });
      return;
    }
    const rows: Json[] = [];
    collectMatching(result.value, symbol, rows);
    const unique = Array.from(new Map(rows.map((row) => [JSON.stringify(row), row])).values()).slice(0, 20);
    sections[label] = compact(unique, 9000);
    matchedRecords += unique.length;
    sourceStatus.push({ source: label, available: true });
  });

  return Response.json({
    symbol,
    fetchedAt: new Date().toISOString(),
    provider: "YONEPSE public dataset (independent community project; not an official NEPSE API)",
    sourceStatus,
    matchedRecords,
    research: sections,
    notice: matchedRecords
      ? "Only records explicitly matched to this symbol are included. Missing records mean unavailable from this dataset, not zero or negative."
      : "No company-specific records were matched. Do not infer company fundamentals or disclosures from missing data.",
  }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
