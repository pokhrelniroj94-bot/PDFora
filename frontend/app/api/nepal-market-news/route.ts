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
    next: { revalidate: 900 },
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
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
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
    // scraped_at is ingestion time, not publication time. Do not present it as a fresh announcement.
    const date = new Date(item.announcement_date || "");
    return item.company && item.url && /^https:\/\//i.test(item.url) && !Number.isNaN(date.getTime()) && date.getTime() <= Date.now() && date.getTime() >= cutoff
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
    const requestedSymbol = (new URL(request.url).searchParams.get("symbol") || "").trim().toUpperCase();
    const safeSymbol = /^[A-Z0-9&.-]{2,16}$/.test(requestedSymbol) ? requestedSymbol : "";
    const [marketResult, ipoResult, officialResult, companyResult] = await Promise.allSettled([
      readFeed("NEPSE Nepal stock market shares trading"),
      readFeed("Nepal IPO FPO share allotment public issue"),
      readOfficialStories(),
      safeSymbol ? readFeed(`${safeSymbol} Nepal company shares stock NEPSE`) : Promise.resolve([] as Story[]),
    ]);
    const official = officialResult.status === "fulfilled" ? officialResult.value : { market: [], ipo: [], failed: true };
    const market = [
      ...(marketResult.status === "fulfilled" ? marketResult.value : []),
      ...(companyResult.status === "fulfilled" ? companyResult.value : []),
      ...official.market,
    ].sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,10);
    const ipo = [
      ...(ipoResult.status === "fulfilled" ? ipoResult.value : []),
      ...official.ipo,
    ].sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,10);
    if (market.length === 0 && ipo.length === 0) {
      throw new Error("Google News and NEPSE public news feeds are temporarily unavailable");
    }
    const warning = marketResult.status === "rejected" || ipoResult.status === "rejected" || companyResult.status === "rejected" || official.failed
      ? "Some providers are unavailable. Headlines from the working sources are still shown."
      : undefined;
    return Response.json(
      { market, ipo, updatedAt: new Date().toISOString(), maxAgeDays: 30, warning },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } },
    );
  } catch {
    return Response.json(
      { error: "Could not load recent Nepal market headlines right now. Please retry or use the official links." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
