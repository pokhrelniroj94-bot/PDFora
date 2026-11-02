export const dynamic = "force-dynamic";
export const revalidate = 0;

type Story = { title: string; link: string; publishedAt: string; source: string };
function clean(value: string) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#\d+;/g, " ").replace(/\s+/g, " ").trim();
}
async function readFeed(query: string): Promise<Story[]> {
  const url = new URL("https://news.google.com/rss/search");
  url.search = new URLSearchParams({ q: query, hl: "en-NP", gl: "NP", ceid: "NP:en" }).toString();
  const response = await fetch(url, { headers: { Accept: "application/rss+xml, application/xml, text/xml" }, signal: AbortSignal.timeout(9000), next: { revalidate: 900 } });
  if (!response.ok) throw new Error("News provider returned an error");
  const xml = await response.text();
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].slice(0, 12).map((match) => {
    const item = match[1];
    const value = (tag: string) => clean(item.match(new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + ">", "i"))?.[1] ?? "");
    const title = value("title"), link = value("link"), pubDate = value("pubDate"), source = value("source") || "Google News feed";
    const published = new Date(pubDate);
    return { title, link, publishedAt: Number.isNaN(published.getTime()) ? new Date().toISOString() : published.toISOString(), source };
  }).filter((story) => story.title && /^https:\/\//i.test(story.link));
}
export async function GET() {
  try {
    const [market, ipo] = await Promise.all([
      readFeed("NEPSE Nepal stock market shares trading"),
      readFeed("Nepal IPO FPO share allotment public issue"),
    ]);
    return Response.json({ market, ipo, updatedAt: new Date().toISOString() }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } });
  } catch {
    return Response.json({ error: "Could not load Nepal market headlines right now. Please retry or use the official links." }, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
