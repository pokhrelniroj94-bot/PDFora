export const dynamic = "force-dynamic";
export const revalidate = 0;
// Allow time for the official NRB API plus the official HTML fallback on cold starts.
export const maxDuration = 30;

type Rate = { code: string; name: string; unit: number; buy: number; sell: number };
type RateResponse = { source: string; requestedDate: string; rateDate: string; publishedOn: string | null; rates: Rate[] };

function nepalToday() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function stripHtml(value: string) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}
type NrbRateRecord = { date?: string; published_on?: string; rates?: Array<{ currency?: { ISO3?: string; iso3?: string; name?: string; unit?: number | string }; buy?: number | string; sell?: number | string }> };
type NrbRatePayload = { status?: { code?: number }; data?: { payload?: NrbRateRecord[] | null } };
function describeFetchError(error: unknown): string {
  const details: string[] = [];
  let current: unknown = error;
  for (let depth = 0; depth < 4 && current; depth++) {
    if (current instanceof Error) {
      details.push(current.name + ": " + current.message);
      current = (current as Error & { cause?: unknown }).cause;
    } else {
      details.push(String(current));
      break;
    }
  }
  return details.join(" <- ").slice(0, 500) || "unknown fetch error";
}


async function fetchNrbJson(from: string, to: string): Promise<NrbRatePayload | null> {
  const endpoint = new URL("https://www.nrb.org.np/api/forex/v1/rates");
  endpoint.search = new URLSearchParams({ from, to, per_page: "100", page: "1" }).toString();
  // NRB is the only data authority here. Retry transient upstream failures, but never
  // replace a failed official response with a third-party exchange-rate feed.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; PDForaForex/1.0; +https://pd-fora.vercel.app)",
          Referer: "https://www.nrb.org.np/forex/",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        console.warn("[nepal-forex] NRB API returned HTTP", response.status, "attempt", attempt + 1);
      } else {
        const payload = await response.json() as NrbRatePayload;
        if (payload.status?.code === 200 || payload.data?.payload) return payload;
        console.warn("[nepal-forex] NRB API returned an unexpected/empty payload", payload.status?.code);
      }
    } catch (error) {
      console.warn("[nepal-forex] NRB API request failed", attempt + 1, endpoint.hostname, describeFetchError(error));
    }
    if (attempt < 1) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return null;
}

async function fetchJsonRates(from: string, to: string): Promise<RateResponse | null> {
  const payload = await fetchNrbJson(from, to);
  const records = Array.isArray(payload?.data?.payload) ? payload.data.payload : [];
  const latest = records.filter((item) => item.date && Array.isArray(item.rates)).sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  if (!latest) return null;
  const rates = (latest.rates ?? []).map((item) => ({
    code: String(item.currency?.ISO3 ?? item.currency?.iso3 ?? "").toUpperCase(),
    name: String(item.currency?.name ?? ""), unit: Number(item.currency?.unit ?? 1), buy: Number(item.buy), sell: Number(item.sell),
  })).filter((item) => /^[A-Z]{3}$/.test(item.code) && item.name && Number.isFinite(item.unit) && item.unit > 0 && Number.isFinite(item.buy) && Number.isFinite(item.sell));
  return rates.length ? { source: "Nepal Rastra Bank", requestedDate: to, rateDate: latest.date!, publishedOn: latest.published_on ?? null, rates } : null;
}
async function fetchOfficialPageRates(requestedDate: string): Promise<RateResponse | null> {
  const response = await fetch("https://www.nrb.org.np/forex/", { headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0 PDFora exchange-rate reader" }, cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!response.ok) {
    console.warn("[nepal-forex] NRB official page returned HTTP", response.status);
    return null;
  }
  const html = await response.text();
  const dateMatch = stripHtml(html).match(/Showing Exchange Rate for ([A-Za-z]+\s+\d{1,2},\s+\d{4})/i);
  if (!dateMatch) return null;
  const parsedDate = new Date(dateMatch[1]);
  if (Number.isNaN(parsedDate.getTime())) return null;
  const rates: Rate[] = [];
  const rows = html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
  for (const row of rows) {
    const cells = [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((match) => stripHtml(match[1]));
    if (cells.length < 4) continue;
    const currency = cells[0].match(/\b([a-z]{3})\s*\(([^)]+)\)/i);
    if (!currency) continue;
    const unit = Number(cells[1].replace(/,/g, "")), buy = Number(cells[2].replace(/,/g, "")), sell = Number(cells[3].replace(/,/g, ""));
    if (Number.isFinite(unit) && unit > 0 && Number.isFinite(buy) && Number.isFinite(sell)) rates.push({ code: currency[1].toUpperCase(), name: currency[2].trim(), unit, buy, sell });
  }
  return rates.length ? { source: "Nepal Rastra Bank (official published page)", requestedDate, rateDate: parsedDate.toISOString().slice(0, 10), publishedOn: null, rates } : null;
}

async function fetchJsonHistory(currencyCode: string): Promise<{ source: string; currency: string; history: Array<{ date: string; buy: number; sell: number }> } | null> {
  const end = new Date(nepalToday() + "T00:00:00Z");
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 90);
  const payload = await fetchNrbJson(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
  const records = Array.isArray(payload?.data?.payload) ? payload.data.payload : [];
  const history = records.flatMap((record) => {
    const item = (record.rates ?? []).find((rate) => String(rate.currency?.ISO3 ?? rate.currency?.iso3 ?? "").toUpperCase() === currencyCode);
    const unit = Number(item?.currency?.unit ?? 1), buy = Number(item?.buy), sell = Number(item?.sell);
    return record.date && item && Number.isFinite(unit) && unit > 0 && Number.isFinite(buy) && Number.isFinite(sell)
      ? [{ date: record.date, buy: buy / unit, sell: sell / unit }] : [];
  }).sort((a, b) => a.date.localeCompare(b.date));
  return history.length ? { source: "Nepal Rastra Bank", currency: currencyCode, history } : null;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.get("history") === "1") {
    const currency = (params.get("currency") || "USD").toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) return Response.json({ error: "Invalid currency code." }, { status: 400 });
    try {
      const history = await fetchJsonHistory(currency);
      if (!history) return Response.json({ error: "NRB historical rates are not available for this currency and period." }, { status: 502 });
      return Response.json(history, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } });
    } catch {
      return Response.json({ error: "Could not retrieve NRB historical rates. Please retry later." }, { status: 502 });
    }
  }
  const requested = new URL(request.url).searchParams.get("date") || nepalToday();
  if (!validDate(requested)) return Response.json({ error: "Date must be a valid YYYY-MM-DD value." }, { status: 400 });
  const end = new Date(`${requested}T00:00:00Z`), start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 10);
  const from = start.toISOString().slice(0, 10);
  let result: RateResponse | null = null;
  try { result = await fetchJsonRates(from, requested); } catch { /* NRB JSON API may be temporarily unreachable */ }
  if (!result && requested === nepalToday()) {
    try { result = await fetchOfficialPageRates(requested); }
    catch (error) { console.warn("[nepal-forex] NRB official HTML fallback failed", describeFetchError(error)); }
  }
  if (!result) return Response.json({ error: "Could not retrieve published rates from Nepal Rastra Bank. Please retry or open the official NRB page." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  return Response.json(result, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
