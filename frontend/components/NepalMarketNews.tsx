"use client";

import { useCallback, useEffect, useState } from "react";

type Story = { title: string; link: string; publishedAt: string; source: string };
type Feed = { market: Story[]; ipo: Story[]; updatedAt: string; warning?: string };
type GlobalFeed = { groups: Array<{ id: string; label: string; stories: Story[] }>; updatedAt: string; warning?: string; partial?: boolean };

function StoryList({ title, stories, locale = "en" }: { title: string; stories: Story[]; locale?: "en" | "ne" }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <h2 className="text-lg font-black text-slate-900">{title}</h2>
    {stories.length ? <ul className="mt-3 divide-y divide-slate-100">{stories.map((story, index) => <li key={story.link + index} className="py-3 first:pt-0 last:pb-0">
      <a href={story.link} target="_blank" rel="noopener noreferrer" className="font-semibold leading-6 text-slate-900 underline-offset-4 hover:text-teal-700 hover:underline">{story.title}</a>
      <p className="mt-1 text-xs text-slate-500">{story.source} · {new Date(story.publishedAt).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" })}</p>
    </li>)}    </ul> : <p className="mt-3 text-sm text-slate-500">{locale === "ne" ? "फिडबाट हालैका समाचार आएनन्। पुनः प्रयास गर्नुहोस् वा तलका स्रोत खोल्नुहोस्।" : "No recent stories were returned by the feed. Try refreshing or use the source links below."}</p>}
  </section>;
}

export default function NepalMarketNews({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
  const copy = ne ? {
    title: "विश्व समाचार र नेपाल बजार समाचार",
    description: "विश्व समाचार खोज र नेपाल बजारका सूचनाबाट आएका निःशुल्क RSS शीर्षकहरू। शीर्षकले मूल प्रकाशकको पृष्ठ खोल्छ र फिड १० मिनेटमा अद्यावधिक हुन्छ।",
    refresh: "समाचार अद्यावधिक गर्नुहोस्",
    refreshing: "अद्यावधिक हुँदैछ…",
    region: "समाचार क्षेत्र",
    worldTab: "विश्व समाचार",
    nepalTab: "नेपाल बजार",
    loading: "नयाँ शीर्षकहरू लोड हुँदैछन्…",
    unavailable: "समाचार फिड अस्थायी रूपमा उपलब्ध छैन।",
    world: "विश्वका प्रमुख समाचार",
    market: "NEPSE तथा बजार अद्यावधिक",
    ipo: "IPO, FPO तथा बाँडफाँट अद्यावधिक",
    empty: "फिडबाट हालैका समाचार आएनन्। पुनः प्रयास गर्नुहोस् वा तलका स्रोत खोल्नुहोस्।",
    checked: "फिड जाँच गरिएको समय",
    verify: "महत्त्वपूर्ण जानकारी मूल प्रकाशकसँग जाँच गर्नुहोस्।",
  } : {
    title: "World News & Nepal Market News",
    description: "Free RSS headlines from global news searches and Nepal market disclosures. Headlines link to their original publishers; feeds refresh every 10 minutes.",
    refresh: "Refresh news",
    refreshing: "Refreshing…",
    region: "News region",
    worldTab: "World news",
    nepalTab: "Nepal market",
    loading: "Loading the latest headlines…",
    unavailable: "News feed is temporarily unavailable.",
    world: "Top world headlines",
    market: "NEPSE & Market Updates",
    ipo: "IPO, FPO & Allotment Updates",
    empty: "No recent stories were returned by the feed. Try refreshing or use the source links below.",
    checked: "Feed checked",
    verify: "Verify important information with the original publisher.",
  };
  const unavailable = copy.unavailable;
  const [feed, setFeed] = useState<Feed | null>(null);
  const [globalFeed, setGlobalFeed] = useState<GlobalFeed | null>(null);
  const [activeTab, setActiveTab] = useState<"world" | "nepal">("world");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeed = useCallback(async () => {
    const response = await fetch("/api/nepal-market-news", { cache: "no-store" });
    const json = await response.json() as Feed & { error?: string };
    if (!response.ok) throw new Error(json.error || unavailable);
    return json;
  }, [unavailable]);

  const fetchGlobalFeed = useCallback(async () => {
    const response = await fetch("/api/global-news", { cache: "no-store" });
    const json = await response.json() as GlobalFeed & { error?: string };
    if (!response.ok) throw new Error(json.error || unavailable);
    return json;
  }, [unavailable]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [nepalResult, worldResult] = await Promise.allSettled([fetchFeed(), fetchGlobalFeed()]);
        if (!active) return;
        if (nepalResult.status === "fulfilled") setFeed(nepalResult.value);
        if (worldResult.status === "fulfilled") setGlobalFeed(worldResult.value);
        if (nepalResult.status === "rejected" && worldResult.status === "rejected") throw new Error(unavailable);
        setError("");
      } catch (e: unknown) {
        if (active) setError(e instanceof Error ? e.message : unavailable);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    const timer = window.setInterval(() => { void load(); }, 10 * 60 * 1000);
    return () => { active = false; window.clearInterval(timer); };
  }, [fetchFeed, fetchGlobalFeed, unavailable]);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const [nepalResult, worldResult] = await Promise.allSettled([fetchFeed(), fetchGlobalFeed()]);
      if (nepalResult.status === "fulfilled") setFeed(nepalResult.value);
      if (worldResult.status === "fulfilled") setGlobalFeed(worldResult.value);
      if (nepalResult.status === "rejected" && worldResult.status === "rejected") throw new Error(unavailable);
    } catch (e) {
      setError(e instanceof Error ? e.message : unavailable);
    } finally {
      setLoading(false);
    }
  }

  const worldGroups = globalFeed?.groups ?? [];
  const selectedWorld = worldGroups.find((group) => group.id === "world")?.stories ?? [];
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-black text-slate-950">{copy.title}</h2><p className="mt-1 text-sm text-slate-600">{copy.description}</p></div>
      <button type="button" onClick={refresh} disabled={loading} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60">{loading ? copy.refreshing : copy.refresh}</button>
    </div>
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={copy.region}>
      <button type="button" role="tab" aria-selected={activeTab === "world"} onClick={() => setActiveTab("world")} className={"rounded-full px-4 py-2 text-sm font-bold " + (activeTab === "world" ? "bg-teal-700 text-white" : "border border-slate-300 bg-white text-slate-700")}>{copy.worldTab}</button>
      <button type="button" role="tab" aria-selected={activeTab === "nepal"} onClick={() => setActiveTab("nepal")} className={"rounded-full px-4 py-2 text-sm font-bold " + (activeTab === "nepal" ? "bg-teal-700 text-white" : "border border-slate-300 bg-white text-slate-700")}>{copy.nepalTab}</button>
    </div>
    {loading && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{copy.loading}</p>}
    {error && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{error}</p>}
    {activeTab === "world" && globalFeed?.warning && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{globalFeed.warning}</p>}
    {activeTab === "world" && globalFeed && <div className="space-y-4">
      <StoryList title={copy.world} stories={selectedWorld} locale={locale}/>
      <div className="grid gap-4 lg:grid-cols-2">{worldGroups.filter((group) => group.id !== "world").map((group) => <StoryList key={group.id} title={group.label} stories={group.stories} locale={locale}/>)}</div>
      <p className="text-xs text-slate-500">{copy.checked}: {new Date(globalFeed.updatedAt).toLocaleString("en-NP")}. {copy.verify} Only the latest 7 days are included.</p>
    </div>}
    {activeTab === "nepal" && feed?.warning && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{feed.warning}</p>}
    {activeTab === "nepal" && feed && <><div className="grid gap-4 lg:grid-cols-2"><StoryList title={copy.market} stories={feed.market} locale={locale}/><StoryList title={copy.ipo} stories={feed.ipo} locale={locale}/></div><p className="text-xs text-slate-500">{copy.checked}: {new Date(feed.updatedAt).toLocaleString("en-NP")}. {ne ? "बजारसम्बन्धी जानकारी NEPSE, SEBON, CDSC वा सम्बन्धित कम्पनीसँग जाँच गर्नुहोस्।" : "Verify market-sensitive information with NEPSE, SEBON, CDSC or the issuing company."}</p></>}
    <div className="flex flex-wrap gap-4 text-sm font-semibold"><a className="text-teal-700 underline" href="https://www.nepalstock.com/" target="_blank" rel="noopener noreferrer">NEPSE official</a><a className="text-teal-700 underline" href="https://www.sebon.gov.np/" target="_blank" rel="noopener noreferrer">SEBON official</a><a className="text-teal-700 underline" href="https://meroshare.cdsc.com.np/" target="_blank" rel="noopener noreferrer">Mero Share</a></div>
  </div>;
}
