export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 60;

const BACKEND_URL = (process.env.PDFORA_BACKEND_URL || "https://pdfora-493r.onrender.com").replace(/\/$/, "");

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const wantsHistory = incoming.searchParams.get("history") === "1";
  const target = new URL(wantsHistory ? "/api/nepal-forex/history" : "/api/nepal-forex", BACKEND_URL);
  const requestedDate = incoming.searchParams.get("date");
  const currency = incoming.searchParams.get("currency");
  if (requestedDate && !wantsHistory) target.searchParams.set("date", requestedDate);
  if (wantsHistory && currency) target.searchParams.set("currency", currency);

  try {
    const upstream = await fetch(target, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(55_000),
    });
    const body = await upstream.text();
    let payload: unknown;
    try {
      payload = JSON.parse(body);
    } catch {
      payload = { error: "Forex service returned an invalid response." };
    }
    return Response.json(payload, {
      status: upstream.status,
      headers: {
        "Cache-Control": upstream.ok
          ? "public, s-maxage=300, stale-while-revalidate=600"
          : "no-store",
      },
    });
  } catch (error) {
    console.error("[nepal-forex] Render backend request failed", error);
    return Response.json(
      { error: "Nepal Rastra Bank forex service is temporarily unavailable. Please retry later." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
