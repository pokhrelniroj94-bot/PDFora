export const dynamic = "force-dynamic";
export const revalidate = 0;

type Story = { title: string; link: string; publishedAt: string; source: string };
type FeedGroup = { id: string; label: string; stories: Story[] };

const FEEDS = [
  { id: "world", label: "World", query: "world news" },
  { id: "business", label: "Business", query: "global business economy markets news" },
  { id: "technology", label: "Technology", query: "global technology science AI news" },
  { id: "science", label: "Science", query: "science climate space research news" },
  { id: "health", label: "Health", query: "global health medical public health news" },
  { id: "sports", label: "Sports", query: "international sports news" },
] as const;

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_XML_BYTES = 1_500_000;

function clean(value: string) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code: string) => {
      const number = Number(code);
      return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : " ";
    }).replace(/\s+/g, " ").trim();
}

async function readFeed(query: string): Promise<Story[]> {
  const url = new URL("https://news.google.com/rss/search");
  url.search = new URLSearchParams({ q: query, hl: "en-US", gl: "US", ceid: "US:en" }).toString();
  const response = await fetch(url, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(9000),
    next: { revalidate: 600 },
  });
  if (!response.ok) throw new Error("GLOBAL_NEWS_PROVIDER_HTTP_" + response.status);
  const xml = await response.text();
  if (xml.length > MAX_XML_BYTES) throw new Error("GLOBAL_NEWS_FEED_TOO_LARGE");
  const cutoff = Date.now() - MAX_AGE_MS;
  const stories = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match): Story | null => {
    const item = match[1];
    const value = (tag: string) => clean(item.match(new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + ">", "i"))?.[1] ?? "");
    const title = value("title");
    const link = value("link");
    const published = new Date(value("pubDate"));
    const source = value("source") || "Google News";
    if (!title || !/^https:\/\//i.test(link) || Number.isNaN(published.getTime()) || published.getTime() > Date.now() + 5 * 60_000 || published.getTime() < cutoff) return null;
    return { title, link, publishedAt: published.toISOString(), source };
  }).filter((story): story is Story => story !== null);
  const unique = new Map<string, Story>();
  for (const story of stories) if (!unique.has(story.link)) unique.set(story.link, story);
  return [...unique.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 12);
}

export async function GET() {
  const results = await Promise.allSettled(FEEDS.map((feed) => readFeed(feed.query)));
  const groups: FeedGroup[] = FEEDS.flatMap((feed, index) => {
    const result = results[index];
    return result.status === "fulfilled" ? [{ id: feed.id, label: feed.label, stories: result.value }] : [];
  });
  const totalStories = groups.reduce((sum, group) => sum + group.stories.length, 0);
  if (!totalStories) {
    return Response.json(
      { error: "Global news feeds are temporarily unavailable. Please retry later.", groups: [], updatedAt: new Date().toISOString() },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
  return Response.json({
    groups,
    updatedAt: new Date().toISOString(),
    maxAgeDays: 7,
    partial: groups.length !== FEEDS.length,
    warning: groups.length !== FEEDS.length ? "Some global news categories could not be loaded. Available categories are still shown." : undefined,
    provider: "Google News RSS",
  }, { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" } });
}
