import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const secret = process.env.PDFORA_NEWS_CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backend = (process.env.NEXT_PUBLIC_API_URL || "https://pdfora-493r.onrender.com").replace(/\/$/, "");
  try {
    const newsResponse = await fetch(new URL("/api/nepal-market-news?refresh=1", request.url), { cache: "no-store" });
    if (!newsResponse.ok) throw new Error("News feed unavailable");
    const feed = await newsResponse.json() as { market?: Array<{title:string;link:string;publishedAt:string}>; ipo?: Array<{title:string;link:string;publishedAt:string}> };
    const stories = [...(feed.market || []), ...(feed.ipo || [])]
      .filter((story) => story.title && story.link && Number.isFinite(Date.parse(story.publishedAt)))
      .sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    const latest = stories[0];
    if (!latest) return NextResponse.json({ sent: false, reason: "No current headlines" });

    const pushResponse = await fetch(`${backend}/api/push/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.PDFORA_PUSH_CRON_SECRET || ""}` },
      body: JSON.stringify({
        id: latest.link,
        title: "Nepal Market Update",
        body: latest.title,
        url: `/nepal-market-news`,
        tag: "nepal-market-news",
      }),
      cache: "no-store",
    });
    const result = await pushResponse.json();
    if (!pushResponse.ok) throw new Error(result.detail || "Push delivery failed");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Cron failed" }, { status: 502 });
  }
}
