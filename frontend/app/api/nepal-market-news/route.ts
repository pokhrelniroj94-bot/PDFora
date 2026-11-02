export const dynamic = "force-dynamic";
export const revalidate = 0;

type Story = { title: string; link: string; publishedAt: string; source: string };
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function clean(value: string) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, " ").replace(/\s+/g, " ").trim();
}

async function readFeed(query: string): Promise<Story[]> {
  const url = new URL("https://news.google.com/rss/search");
  url.search = new URLSearchParams({ q: query, hl: "en-NP", gl: "NP", ceid: "NP:en" }).toString();
  const response = await fetch(url, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(9000),
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error("News provider returned an error");
  const xml = await response.text();
  const cutoff = Date.now() - MAX_AGE_MS;
  const stories = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match): Story | null => {
    const item = match[1];
    const value = (tag: string) => clean(item.match(new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + ">", "i"))?.[1] ?? "");
    const title = value("title");
    const link = value("link");
    const pubDate = value("pubDate");
    const source = value("source") || "Google News feed";
    const published = new Date(pubDate);
    if (!title || !/^https:\/\//i.test(link) || Number.isNaN(published.getTime()) || published.getTime() < cutoff) return null;
    return { title, link, publishedAt: published.toISOString(), source };
  }).filter((story): story is Story => story !== null);
  const unique = new Map<string, Story>();
  for (const story of stories) if (!unique.has(story.link)) unique.set(story.link, story);
  return [...unique.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 10);
}

export async function GET() {
  try {
    const [market, ipo] = await Promise.all([
      readFeed("NEPSE Nepal stock market shares trading"),
      readFeed("Nepal IPO FPO share allotment public issue"),
    ]);
    return Response.json(
      { market, ipo, updatedAt: new Date().toISOString(), maxAgeDays: 7 },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } },
    );
  } catch {
    return Response.json(
      { error: "Could not load recent Nepal market headlines right now. Please retry or use the official links." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
