export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 20;

const BACKEND_URL = (process.env.PDFORA_BACKEND_URL || "https://pdfora-493r.onrender.com").replace(/\/$/, "");

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const isHistory = incoming.searchParams.get("history") === "1";
  const target = new URL(
    isHistory ? "/api/nepal-forex/history" : "/api/nepal-forex",
    BACKEND_URL,
  );

  if (isHistory) {
    target.searchParams.set("currency", (incoming.searchParams.get("currency") || "USD").toUpperCase());
  } else if (incoming.searchParams.has("date")) {
    target.searchParams.set("date", incoming.searchParams.get("date")!);
  }

  try {
    const upstream = await fetch(target, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(17_000),
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
          ? (isHistory ? "public, s-maxage=3600, stale-while-revalidate=7200" : "public, s-maxage=300, stale-while-revalidate=600")
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
