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

const YONEPSE = "https://shubhamnpk.github.io/yonepse";
async function readYonepse<T>(path: string): Promise<T> {
  const response = await fetch(YONEPSE + path, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(9000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("YONEPSE feed unavailable");
  return response.json() as Promise<T>;
}
async function readOfficialStories() {
  const [disclosuresResult, messagesResult, ipoResult] = await Promise.allSettled([
    readYonepse<Array<{ id?: number; symbol?: string; title?: string; publishedAt?: string; source?: string; documents?: Array<{ fileUrl?: string }> }>>("/data/notify/disclosures.json"),
    readYonepse<Array<{ id?: number; symbol?: string; title?: string; publishedAt?: string; fileUrl?: string }>>("/data/notify/exchange_messages.json"),
    readYonepse<Array<{ company?: string; url?: string; announcement_date?: string; scraped_at?: string; date_range?: string; full_text?: string }>>("/data/ipo/upcoming.json"),
  ]);
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const market: Story[] = [];
  if (disclosuresResult.status === "fulfilled") {
    for (const item of disclosuresResult.value) {
      const date = new Date(item.publishedAt || "");
      const link = item.documents?.[0]?.fileUrl || "https://www.nepalstock.com.np/";
      if (item.title && /^https:\/\//i.test(link) && !Number.isNaN(date.getTime()) && date.getTime() >= cutoff) {
        market.push({ title: (item.symbol ? item.symbol + " — " : "") + item.title, link, publishedAt: date.toISOString(), source: "NEPSE disclosure" });
      }
    }
  }
  if (messagesResult.status === "fulfilled") {
    for (const item of messagesResult.value) {
      const date = new Date(item.publishedAt || "");
      const link = item.fileUrl || "https://www.nepalstock.com.np/";
      if (item.title && /^https:\/\//i.test(link) && !Number.isNaN(date.getTime()) && date.getTime() >= cutoff) {
        market.push({ title: (item.symbol ? item.symbol + " — " : "") + item.title, link, publishedAt: date.toISOString(), source: "NEPSE exchange message" });
      }
    }
  }
  const ipo: Story[] = ipoResult.status === "fulfilled" ? ipoResult.value.map((item) => {
    const date = new Date(item.scraped_at || item.announcement_date || "");
    return item.company && item.url && /^https:\/\//i.test(item.url) && !Number.isNaN(date.getTime())
      ? { title: item.company + (item.date_range ? " — " + item.date_range : "") + " (IPO notice)", link: item.url, publishedAt: date.toISOString(), source: "IPO notice" }
      : null;
  }).filter((item): item is Story => item !== null) : [];
  return {
    market: [...new Map(market.map((item) => [item.link + item.title, item])).values()].sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,10),
    ipo: [...new Map(ipo.map((item) => [item.link, item])).values()].sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,10),
    failed: [disclosuresResult,messagesResult,ipoResult].some((item)=>item.status==="rejected"),
  };
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

export async function GET(request: Request) {
  try {
    const refresh = new URL(request.url).searchParams.get("refresh") === "1";
    const [marketToday, marketWeek, ipoToday, ipoWeek, officialResult] = await Promise.allSettled([
      readFeed("NEPSE Nepal stock market shares trading when:1d"),
      readFeed("NEPSE Nepal stock market shares trading when:7d"),
      readFeed("Nepal IPO FPO share allotment public issue when:1d"),
      readFeed("Nepal IPO FPO share allotment public issue when:7d"),
      readOfficialStories(),
    ]);
    const official = officialResult.status === "fulfilled" ? officialResult.value : { market: [], ipo: [], failed: true };
    const mergeRecent = (...groups: (Story[] | undefined)[]) => [...new Map(groups.flat().map((story) => [story.link, story])).values()]
      .sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,10);
    const market = mergeRecent(
      marketToday.status === "fulfilled" ? marketToday.value : [],
      marketWeek.status === "fulfilled" ? marketWeek.value : [],
      official.market,
    );
    const ipo = mergeRecent(
      ipoToday.status === "fulfilled" ? ipoToday.value : [],
      ipoWeek.status === "fulfilled" ? ipoWeek.value : [],
      official.ipo,
    );
    if (market.length === 0 && ipo.length === 0) {
      throw new Error("Google News and NEPSE public news feeds are temporarily unavailable");
    }
    const failed = [marketToday, marketWeek, ipoToday, ipoWeek].some((item) => item.status === "rejected") || official.failed;
    const warning = failed
      ? "Some news providers are unavailable. Available headlines are shown; try refresh later for newer updates."
      : undefined;
    return Response.json(
      { market, ipo, updatedAt: new Date().toISOString(), maxAgeDays: 7, warning },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    return Response.json(
      { error: "Could not load recent Nepal market headlines right now. Please retry or use the official links." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
