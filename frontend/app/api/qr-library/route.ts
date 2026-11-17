const QR_LIBRARY_URLS = [
  "https://cdn.jsdelivr.net/npm/qrcode@1.5.4/lib/browser.min.js",
  "https://unpkg.com/qrcode@1.5.4/lib/browser.min.js",
] as const;

// Serve the pinned, public QR library from the same origin. QR payloads are never
// sent to this endpoint; it only returns the static JavaScript library.
export const revalidate = 86400;

export async function GET() {
  for (const url of QR_LIBRARY_URLS) {
    try {
      const upstream = await fetch(url, {
        headers: { accept: "application/javascript, text/javascript, */*;q=0.1" },
        cache: "force-cache",
        signal: AbortSignal.timeout(8000),
      });
      if (!upstream.ok || !upstream.body) continue;

      return new Response(upstream.body, {
        status: 200,
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      // Try the next pinned upstream; never accept a caller-provided URL.
    }
  }

  return new Response("QR library temporarily unavailable", {
    status: 503,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
