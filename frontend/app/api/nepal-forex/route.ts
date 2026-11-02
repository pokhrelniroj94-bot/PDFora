export const dynamic = "force-dynamic";
export const revalidate = 0;

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
async function fetchJsonRates(from: string, to: string): Promise<RateResponse | null> {
  const endpoint = new URL("https://www.nrb.org.np/api/forex/v1/rates");
  endpoint.search = new URLSearchParams({ page: "1", per_page: "100", from, to }).toString();
  const response = await fetch(endpoint, { headers: { Accept: "application/json", "User-Agent": "PDFora-NRB-Forex/1.0" }, cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (!response.ok) return null;
  const payload = await response.json() as { data?: { payload?: Array<{ date?: string; published_on?: string; rates?: Array<{ currency?: { ISO3?: string; iso3?: string; name?: string; unit?: number | string }; buy?: number | string; sell?: number | string }> }> | null } };
  const records = Array.isArray(payload.data?.payload) ? payload.data.payload : [];
  const latest = records.filter((item) => item.date && Array.isArray(item.rates)).sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  if (!latest) return null;
  const rates = (latest.rates ?? []).map((item) => ({
    code: String(item.currency?.ISO3 ?? item.currency?.iso3 ?? "").toUpperCase(),
    name: String(item.currency?.name ?? ""), unit: Number(item.currency?.unit ?? 1), buy: Number(item.buy), sell: Number(item.sell),
  })).filter((item) => /^[A-Z]{3}$/.test(item.code) && item.name && Number.isFinite(item.unit) && item.unit > 0 && Number.isFinite(item.buy) && Number.isFinite(item.sell));
  return rates.length ? { source: "Nepal Rastra Bank", requestedDate: to, rateDate: latest.date!, publishedOn: latest.published_on ?? null, rates } : null;
}
async function fetchOfficialPageRates(requestedDate: string): Promise<RateResponse | null> {
  const response = await fetch("https://www.nrb.org.np/forex/", { headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0 PDFora exchange-rate reader" }, cache: "no-store", signal: AbortSignal.timeout(10000) });
  if (!response.ok) return null;
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
export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("date") || nepalToday();
  if (!validDate(requested)) return Response.json({ error: "Date must be a valid YYYY-MM-DD value." }, { status: 400 });
  const end = new Date(`${requested}T00:00:00Z`), start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 10);
  const from = start.toISOString().slice(0, 10);
  let result: RateResponse | null = null;
  try { result = await fetchJsonRates(from, requested); } catch { /* NRB JSON API may be temporarily unreachable */ }
  if (!result && requested === nepalToday()) {
    try { result = await fetchOfficialPageRates(requested); } catch { /* try the official HTML page as fallback */ }
  }
  if (!result) return Response.json({ error: "Could not retrieve published rates from Nepal Rastra Bank. Please retry or open the official NRB page." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  return Response.json(result, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}
