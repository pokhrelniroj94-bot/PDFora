export const dynamic = "force-dynamic";
export const revalidate = 0;

function nepalToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get("date") || nepalToday();
  if (!validDate(requested)) {
    return Response.json({ error: "Date must be a valid YYYY-MM-DD value." }, { status: 400 });
  }

  const end = new Date(`${requested}T00:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 10);
  const from = start.toISOString().slice(0, 10);

  try {
    const upstream = new URL("https://www.nrb.org.np/api/forex/v1/rates");
    upstream.search = new URLSearchParams({
      page: "1",
      per_page: "100",
      from,
      to: requested,
    }).toString();

    const response = await fetch(upstream, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) {
      return Response.json({ error: `Nepal Rastra Bank returned HTTP ${response.status}. Please try again later.` }, { status: 502 });
    }

    const payload = await response.json() as {
      data?: { payload?: Array<{ date?: string; published_on?: string; rates?: Array<{ currency?: { ISO3?: string; name?: string; unit?: number }; buy?: number | string; sell?: number | string }> }> | null };
    };
    const records = Array.isArray(payload.data?.payload) ? payload.data.payload : [];
    const latest = records
      .filter((item) => item.date && Array.isArray(item.rates))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];

    if (!latest) {
      return Response.json({
        error: "NRB has not published a rate for this date range. Try again on the next working day.",
        requestedDate: requested,
      }, { status: 404 });
    }

    const rates = (latest.rates ?? []).map((item) => ({
      code: item.currency?.ISO3 ?? "",
      name: item.currency?.name ?? "",
      unit: Number(item.currency?.unit ?? 1),
      buy: Number(item.buy),
      sell: Number(item.sell),
    })).filter((item) => /^[A-Z]{3}$/.test(item.code) && item.unit > 0 && Number.isFinite(item.buy) && Number.isFinite(item.sell));

    return Response.json({
      source: "Nepal Rastra Bank",
      requestedDate: requested,
      rateDate: latest.date,
      publishedOn: latest.published_on ?? null,
      rates,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return Response.json({ error: "Could not connect to the Nepal Rastra Bank rates service. Please retry." }, { status: 502 });
  }
}
