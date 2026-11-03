export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 30;

const BACKEND_URL = (process.env.PDFORA_BACKEND_URL || "https://pdfora-493r.onrender.com").replace(/\/$/, "");
const NRB_URL = "https://www.nrb.org.np/api/forex/v1/rates";

type JsonRecord = Record<string, unknown>;
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

function asRecord(value: unknown): JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function toRateList(items: unknown[]): NormalizedRate[] {
  return items.flatMap((value) => {
    const item = asRecord(value);
    const currency = asRecord(item.currency);
    const code = String(item.code || item.iso3 || currency.ISO3 || currency.iso3 || "").toUpperCase();
    const name = String(item.name || item.currencyName || currency.name || "");
    const unit = Number(item.unit ?? currency.unit ?? 1);
    const buy = Number(item.buy);
    const sell = Number(item.sell);
    if (!/^[A-Z]{3}$/.test(code) || !name || !Number.isFinite(unit) || unit <= 0 ||
        !Number.isFinite(buy) || !Number.isFinite(sell) || buy <= 0 || sell <= 0) return [];
    return [{ code, name, unit, buy, sell }];
  });
}

function normalizeNrbPayload(payload: unknown, requestedDate: string) {
  const root = asRecord(payload);
  const status = asRecord(root.status);
  if (status.code && Number(status.code) !== 200) {
    throw new Error(`NRB API body status ${String(status.code)}`);
  }
  const data = asRecord(root.data);
  const records = data.payload;
  if (!Array.isArray(records)) throw new Error("NRB returned no published snapshots for this date range.");
  const valid = (records as unknown[]).filter((value): value is NrbRecord & { date: string; rates: NonNullable<NrbRecord["rates"]> } => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const item = value as NrbRecord;
    return typeof item.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && Array.isArray(item.rates);
  });
  const latest = [...valid].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  if (!latest || typeof latestDate !== "string") throw new Error("No published NRB rate was found in the requested date range.");
  const latestDate = latest.date;
  const rates = toRateList(latest.rates || []);
  if (!rates.length) throw new Error("NRB returned a snapshot but no valid currency rates.");
  return {
    source: "Nepal Rastra Bank",
    requestedDate,
    rateDate: latestDate,
    publishedOn: latest.published_on || null,
    rates,
    isStale: latestDate < requestedDate,
    notice: latestDate < requestedDate ? `NRB has not published a rate for ${requestedDate}; showing the latest available official rate dated ${latestDate}.` : undefined,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeBackendPayload(payload: unknown, requestedDate: string) {
  const root = asRecord(payload);
  const rawRates = Array.isArray(root.rates) ? root.rates : [];
  const rates = toRateList(rawRates);
  if (!rates.length) throw new Error("Render forex response did not contain valid normalized rates.");
  return {
    source: typeof root.source === "string" ? root.source : "Nepal Rastra Bank",
    requestedDate: typeof root.requestedDate === "string" ? root.requestedDate : requestedDate,
    rateDate: typeof root.rateDate === "string" ? root.rateDate : typeof root.date === "string" ? root.date : requestedDate,
    publishedOn: typeof root.publishedOn === "string" ? root.publishedOn : typeof root.published_on === "string" ? root.published_on : null,
    rates,
    isStale: (typeof root.rateDate === "string" ? root.rateDate : typeof root.date === "string" ? root.date : requestedDate) < requestedDate,
    notice: (typeof root.rateDate === "string" ? root.rateDate : typeof root.date === "string" ? root.date : requestedDate) < requestedDate ? `Showing the latest available NRB reference rate dated ${typeof root.rateDate === "string" ? root.rateDate : typeof root.date === "string" ? root.date : requestedDate}; requested date was ${requestedDate}.` : undefined,
    updatedAt: new Date().toISOString(),
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
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`NRB API returned HTTP ${response.status}`);
  return normalizeNrbPayload(await response.json(), requestedDate);
}

async function fetchFromOfficialPage(requestedDate: string) {
  const response = await fetch("https://www.nrb.org.np/forex/", {
    headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0 PDForaForex/1.2" },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`NRB published page returned HTTP ${response.status}`);
  const html = await response.text();
  if (html.length > 2_000_000) throw new Error("NRB published page response was unexpectedly large.");

  const strip = (value: string) => value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ").trim();
  const pageText = strip(html);
  const dateMatch = pageText.match(/Showing Exchange Rate for\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
  const parsedDate = dateMatch ? new Date(dateMatch[1]) : null;
  const rateDate = parsedDate && Number.isFinite(parsedDate.getTime())
    ? parsedDate.toISOString().slice(0, 10)
    : "";
  if (!rateDate) throw new Error("Could not determine the publication date on NRB's official forex page.");

  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  const rates: NormalizedRate[] = [];
  for (const row of rows) {
    const cells = [...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)]
      .map((cell) => strip(cell[1]));
    if (cells.length < 4) continue;
    const codeMatch = cells[0].match(/^([A-Za-z]{3})\b/);
    const code = codeMatch?.[1]?.toUpperCase() || "";
    const unit = Number(cells[1].replace(/,/g, ""));
    const buy = Number(cells[2].replace(/,/g, ""));
    const sell = Number(cells[3].replace(/,/g, ""));
    if (!/^[A-Z]{3}$/.test(code) || !Number.isFinite(unit) || unit <= 0 ||
        !Number.isFinite(buy) || !Number.isFinite(sell) || buy <= 0 || sell <= 0) continue;
    rates.push({ code, name: cells[0].replace(/^[A-Za-z]{3}\s*[-(]?\s*/, "").replace(/\)?$/, "").trim() || code, unit, buy, sell });
  }
  const unique = [...new Map(rates.map((rate) => [rate.code, rate])).values()];
  if (unique.length < 10) throw new Error("NRB official page did not contain enough valid currency rows.");
  // This page exposes only its currently published table, not an arbitrary historical date.
  // For today's request, a previous working day's published rate is valid and is marked stale.
  const todayInNepal = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  if (requestedDate !== rateDate && requestedDate !== todayInNepal) {
    throw new Error("NRB's published-page fallback only supports today's currently displayed rate date.");
  }
  return {
    source: "Nepal Rastra Bank official published page",
    requestedDate,
    rateDate,
    publishedOn: rateDate,
    rates: unique,
    fallback: true,
    isStale: rateDate < requestedDate,
    notice: rateDate < requestedDate ? `NRB has not published a new rate for ${requestedDate}; the latest official published rate is dated ${rateDate}.` : undefined,
    updatedAt: new Date().toISOString(),
  };
}

async function fetchFromBackend(requestedDate: string) {
  const target = new URL("/api/nepal-forex", BACKEND_URL);
  target.searchParams.set("date", requestedDate);
  const response = await fetch(target, {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(18_000),
  });
  if (!response.ok) throw new Error(`Forex backend returned HTTP ${response.status}`);
  return normalizeBackendPayload(await response.json(), requestedDate);
}

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const dateParam = incoming.searchParams.get("date");
  if (dateParam && !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return Response.json({ error: "Date must use YYYY-MM-DD format." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (dateParam) {
    const parsed = new Date(dateParam + "T00:00:00Z");
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateParam) {
      return Response.json({ error: "Invalid calendar date." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
    const todayInNepal = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date());
    if (dateParam > todayInNepal) {
      return Response.json({ error: "Future exchange-rate dates are not supported in Nepal time." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }
  }
  const requestedDate = incoming.searchParams.get("date") || new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  // Try the official API and (for today's request only) the official published
  // page concurrently. This avoids serial 10s + 10s waits when one NRB path fails.
  const todayInNepal = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const officialAttempts: Promise<unknown>[] = [
    fetchDirectFromNrb(requestedDate),
  ];
  if (requestedDate === todayInNepal) officialAttempts.push(fetchFromOfficialPage(requestedDate));
  try {
    const payload = await Promise.any(officialAttempts);
    return Response.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
    });
  } catch {
    console.warn("[nepal-forex] Official NRB API/page sources unavailable; trying the Render mirror.");
  }

  try {
    const payload = await fetchFromBackend(requestedDate);
    return Response.json({ ...payload, fallback: true }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
    });
  } catch (backendError) {
    console.error("[nepal-forex] NRB and Render forex sources failed:", backendError instanceof Error ? backendError.message : "unknown error");
    return Response.json(
      { error: "Official NRB rates could not be reached right now. Please refresh in a moment." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
