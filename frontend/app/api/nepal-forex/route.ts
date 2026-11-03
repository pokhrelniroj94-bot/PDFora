export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 30;

const BACKEND_URL = (process.env.PDFORA_BACKEND_URL || "https://pdfora-493r.onrender.com").replace(/\/$/, "");
const NRB_URL = "https://www.nrb.org.np/api/forex/v1/rates";

type NormalizedRate = { code: string; name: string; unit: number; buy: number; sell: number };
type NrbRecord = {
  date?: string;
  published_on?: string | null;
  rates?: Array<{
    buy?: string | number;
    sell?: string | number;
    currency?: { ISO3?: string; iso3?: string; name?: string; unit?: string | number };
  }>;
};

function toRateList(items: any[]): NormalizedRate[] {
  return items.flatMap((item) => {
    const currency = item?.currency || {};
    const code = String(item?.code || item?.iso3 || currency.ISO3 || currency.iso3 || "").toUpperCase();
    const name = String(item?.name || item?.currencyName || currency.name || "");
    const unit = Number(item?.unit ?? currency.unit ?? 1);
    const buy = Number(item?.buy);
    const sell = Number(item?.sell);
    if (!/^[A-Z]{3}$/.test(code) || !name || !Number.isFinite(unit) || unit <= 0 ||
        !Number.isFinite(buy) || !Number.isFinite(sell) || buy <= 0 || sell <= 0) return [];
    return [{ code, name, unit, buy, sell }];
  });
}

function normalizeNrbPayload(payload: any, requestedDate: string) {
  if (payload?.status?.code && Number(payload.status.code) !== 200) {
    throw new Error(`NRB API body status ${payload.status.code}`);
  }
  const records = payload?.data?.payload;
  if (!Array.isArray(records)) throw new Error("NRB returned no published snapshots for this date range.");
  const valid = (records as NrbRecord[]).filter((item) => item?.date && Array.isArray(item.rates));
  const latest = [...valid].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  if (!latest) throw new Error("No published NRB rate was found in the requested date range.");
  const rates = toRateList(latest.rates || []);
  if (!rates.length) throw new Error("NRB returned a snapshot but no valid currency rates.");
  return {
    source: "Nepal Rastra Bank",
    requestedDate,
    rateDate: latest.date,
    publishedOn: latest.published_on || null,
    rates,
  };
}

function normalizeBackendPayload(payload: any, requestedDate: string) {
  const rawRates = Array.isArray(payload?.rates) ? payload.rates : [];
  const rates = toRateList(rawRates);
  if (!rates.length) throw new Error("Render forex response did not contain valid normalized rates.");
  return {
    source: payload.source || "Nepal Rastra Bank",
    requestedDate: payload.requestedDate || requestedDate,
    rateDate: payload.rateDate || payload.date || requestedDate,
    publishedOn: payload.publishedOn || payload.published_on || null,
    rates,
  };
}

async function fetchDirectFromNrb(requestedDate: string) {
  // Use UTC date arithmetic so the Vercel runtime timezone cannot shift the range.
  const [year, month, day] = requestedDate.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day));
  start.setUTCDate(start.getUTCDate() - 21);
  const from = [
    start.getUTCFullYear(),
    String(start.getUTCMonth() + 1).padStart(2, "0"),
    String(start.getUTCDate()).padStart(2, "0"),
  ].join("-");
  const target = new URL(NRB_URL);
  target.search = new URLSearchParams({ from, to: requestedDate, per_page: "100", page: "1" }).toString();
  const response = await fetch(target, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 PDForaForex/1.1",
      Referer: "https://www.nrb.org.np/forex/",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`NRB API returned HTTP ${response.status}`);
  return normalizeNrbPayload(await response.json(), requestedDate);
}

async function fetchFromBackend(requestedDate: string) {
  const target = new URL("/api/nepal-forex", BACKEND_URL);
  target.searchParams.set("date", requestedDate);
  const response = await fetch(target, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Forex backend returned HTTP ${response.status}`);
  return normalizeBackendPayload(await response.json(), requestedDate);
}

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const requestedDate = incoming.searchParams.get("date") || new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(requestedDate)) {
    return Response.json({ error: "Date must use YYYY-MM-DD format." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const parsedDate = new Date(requestedDate + "T00:00:00Z");
  if (!Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== requestedDate) {
    return Response.json({ error: "Date is not a valid calendar date." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  // Prefer the official NRB feed. Only use the Render mirror if NRB is unreachable.
  try {
    const payload = await fetchDirectFromNrb(requestedDate);
    return Response.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (nrbError) {
    console.warn("[nepal-forex] Direct NRB request failed; trying Render mirror.");
  }

  try {
    const payload = await fetchFromBackend(requestedDate);
    return Response.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (backendError) {
    console.error("[nepal-forex] Both NRB and Render forex sources failed.");
    return Response.json(
      { error: "Official NRB rates could not be reached right now. Please refresh in a moment." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
