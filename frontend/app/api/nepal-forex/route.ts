export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 30;

const BACKEND_URL = (process.env.PDFORA_BACKEND_URL || "https://pdfora-493r.onrender.com").replace(/\/$/, "");
const NRB_URL = "https://www.nrb.org.np/api/forex/v1/rates";

type NrbRecord = {
  date?: string;
  published_on?: string | null;
  rates?: Array<{
    buy?: string | number;
    sell?: string | number;
    currency?: { ISO3?: string; iso3?: string; name?: string; unit?: string | number };
  }>;
};

function normalizeNrbPayload(payload: any, requestedDate: string) {
  const records = payload?.data?.payload;
  if (!Array.isArray(records)) throw new Error("NRB returned an unexpected response.");
  const valid = (records as NrbRecord[]).filter((item) => item?.date && Array.isArray(item.rates));
  const latest = valid.sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  if (!latest) throw new Error("No published NRB rate was found in the requested date range.");

  const rates = (latest.rates || []).flatMap((item) => {
    const currency = item.currency || {};
    const code = String(currency.ISO3 || currency.iso3 || "").toUpperCase();
    const name = String(currency.name || "");
    const unit = Number(currency.unit || 1);
    const buy = Number(item.buy);
    const sell = Number(item.sell);
    if (!/^[A-Z]{3}$/.test(code) || !name || !Number.isFinite(unit) || unit <= 0 ||
        !Number.isFinite(buy) || !Number.isFinite(sell) || buy <= 0 || sell <= 0) return [];
    return [{ code, name, unit, buy, sell }];
  });
  if (!rates.length) throw new Error("NRB returned no valid currency rates.");
  return {
    source: "Nepal Rastra Bank",
    requestedDate,
    rateDate: latest.date,
    publishedOn: latest.published_on || null,
    rates,
  };
}

async function fetchDirectFromNrb(requestedDate: string) {
  const end = requestedDate;
  const startDate = new Date(`${requestedDate}T00:00:00+05:45`);
  startDate.setDate(startDate.getDate() - 10);
  const from = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
  const target = new URL(NRB_URL);
  target.search = new URLSearchParams({ from, to: end, per_page: "100", page: "1" }).toString();
  const response = await fetch(target, {
    headers: {
      Accept: "application/json",
      "User-Agent": "PDForaForex/1.0 (+https://pd-fora.vercel.app)",
      Referer: "https://www.nrb.org.np/forex/",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`NRB API returned HTTP ${response.status}`);
  return normalizeNrbPayload(await response.json(), requestedDate);
}

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const requestedDate = incoming.searchParams.get("date") || new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());

  const target = new URL("/api/nepal-forex", BACKEND_URL);
  if (incoming.searchParams.has("date")) target.searchParams.set("date", requestedDate);

  try {
    const upstream = await fetch(target, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    if (upstream.ok) {
      const payload = await upstream.json();
      if (payload && Array.isArray(payload.rates) && payload.rates.length) {
        return Response.json(payload, {
          headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
        });
      }
    }
    console.warn("[nepal-forex] Render backend unavailable; trying official NRB directly", upstream.status);
  } catch (error) {
    console.warn("[nepal-forex] Render backend request failed; trying official NRB directly", error);
  }

  try {
    const payload = await fetchDirectFromNrb(requestedDate);
    return Response.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[nepal-forex] Official NRB fallback failed", error);
    return Response.json(
      { error: "Nepal Rastra Bank rates are temporarily unavailable. Please retry shortly." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
