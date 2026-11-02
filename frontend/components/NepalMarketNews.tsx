"use client";

import { useCallback, useEffect, useState } from "react";

type Story = { title: string; link: string; publishedAt: string; source: string };
type Feed = { market: Story[]; ipo: Story[]; updatedAt: string; warning?: string };

function StoryList({ title, stories }: { title: string; stories: Story[] }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <h2 className="text-lg font-black text-slate-900">{title}</h2>
    {stories.length ? <ul className="mt-3 divide-y divide-slate-100">{stories.map((story, index) => <li key={story.link + index} className="py-3 first:pt-0 last:pb-0">
      <a href={story.link} target="_blank" rel="noopener noreferrer" className="font-semibold leading-6 text-slate-900 underline-offset-4 hover:text-teal-700 hover:underline">{story.title}</a>
      <p className="mt-1 text-xs text-slate-500">{story.source} · {new Date(story.publishedAt).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" })}</p>
    </li>)}</ul> : <p className="mt-3 text-sm text-slate-500">No recent stories were returned by the feed. Try refreshing or use the source links below.</p>}
  </section>;
}

export default function NepalMarketNews() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeed = useCallback(async () => {
    const response = await fetch("/api/nepal-market-news", { cache: "no-store" });
    const json = await response.json() as Feed & { error?: string };
    if (!response.ok) throw new Error(json.error || "News feed is temporarily unavailable.");
    return json;
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const json = await fetchFeed();
        if (active) { setFeed(json); setError(""); }
      } catch (e: unknown) {
        if (active) setError(e instanceof Error ? e.message : "News feed is temporarily unavailable.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    const timer = window.setInterval(() => { void load(); }, 15 * 60 * 1000);
    return () => { active = false; window.clearInterval(timer); };
  }, [fetchFeed]);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      setFeed(await fetchFeed());
    } catch (e) {
      setError(e instanceof Error ? e.message : "News feed is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-black text-slate-950">Nepal Stock Market & IPO News</h2><p className="mt-1 text-sm text-slate-600">Recent Nepal market headlines combine Google News with NEPSE company disclosures, exchange messages and IPO notices. Updates automatically every 15 minutes; source and publication time are shown for each item.</p></div>
      <button type="button" onClick={refresh} disabled={loading} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60">{loading ? "Refreshing…" : "Refresh news"}</button>
    </div>
    {loading && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Loading the latest headlines…</p>}
    {error && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{error}</p>}
    {feed?.warning && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{feed.warning}</p>}
    {feed && <><div className="grid gap-4 lg:grid-cols-2"><StoryList title="NEPSE & Market Updates" stories={feed.market}/><StoryList title="IPO, FPO & Allotment Updates" stories={feed.ipo}/></div><p className="text-xs text-slate-500">Feed checked: {new Date(feed.updatedAt).toLocaleString("en-NP")}. Headlines include available official disclosures and IPO notices from the last 30 days alongside recent Google News results. Duplicates are removed; verify market-sensitive information with NEPSE, SEBON, CDSC or the issuing company.</p></>}
    <div className="flex flex-wrap gap-4 text-sm font-semibold"><a className="text-teal-700 underline" href="https://www.nepalstock.com/" target="_blank" rel="noopener noreferrer">NEPSE official</a><a className="text-teal-700 underline" href="https://www.sebon.gov.np/" target="_blank" rel="noopener noreferrer">SEBON official</a><a className="text-teal-700 underline" href="https://meroshare.cdsc.com.np/" target="_blank" rel="noopener noreferrer">Mero Share</a></div>
  </div>;
}
