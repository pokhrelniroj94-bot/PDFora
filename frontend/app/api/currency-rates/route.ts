export const dynamic = "force-dynamic";
export const revalidate = 0;

const SUPPORTED = new Set(["USD", "NPR", "INR", "EUR", "GBP", "AUD", "CAD", "JPY", "CNY", "AED", "SAR"]);
const MAX_AGE = 60 * 60;

type RatePayload = {
  result?: string;
  success?: boolean;
  base_code?: string;
  base?: string;
  time_last_update_utc?: string;
  time_last_update_unix?: number;
  rates?: Record<string, unknown>;
};

function normalize(payload: RatePayload, base: string, source: string) {
  const rates = payload.rates;
  if (!rates || typeof rates !== "object" || Array.isArray(rates)) {
    throw new Error("Provider response did not contain rates.");
  }
  const normalized: Record<string, number> = {};
  for (const code of SUPPORTED) {
    const value = Number(rates[code]);
    if (Number.isFinite(value) && value > 0) normalized[code] = value;
  }
  if (!normalized[base]) normalized[base] = 1;
  if (Object.keys(normalized).length < 2) throw new Error("Provider returned too few supported rates.");
  return {
    base,
    rates: normalized,
    updatedAt: payload.time_last_update_utc || (payload.time_last_update_unix ? new Date(payload.time_last_update_unix * 1000).toISOString() : null),
    source,
  };
}

async function fetchProvider(url: string, base: string, source: string) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Provider HTTP " + response.status);
  const payload = await response.json() as RatePayload;
  if (payload.result && payload.result !== "success") throw new Error("Provider reported an unsuccessful response.");
  if (payload.success === false) throw new Error("Provider reported an unsuccessful response.");
  return normalize(payload, base, source);
}

export async function GET(request: Request) {
  const base = (new URL(request.url).searchParams.get("base") || "USD").toUpperCase();
  if (!SUPPORTED.has(base)) {
    return Response.json({ error: "Unsupported base currency." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  try {
    let payload;
    try {
      payload = await fetchProvider(
        "https://open.er-api.com/v6/latest/" + encodeURIComponent(base),
        base,
        "ExchangeRate-API",
      );
    } catch {
      payload = await fetchProvider(
        "https://api.exchangerate-api.com/v4/latest/" + encodeURIComponent(base),
        base,
        "ExchangeRate-API fallback",
      );
    }
    return Response.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=" + MAX_AGE + ", stale-while-revalidate=300" },
    });
  } catch {
    return Response.json(
      { error: "Exchange-rate providers are temporarily unavailable. Please try again shortly." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
