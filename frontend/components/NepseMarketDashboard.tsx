"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NepalMarketNews from "./NepalMarketNews";

type Stock = { symbol: string; name: string; ltp: number; previous_close: number; change: number; percent_change: number; high: number; low: number; volume: number; turnover: number; trades: number; last_updated?: string };
type Index = { index: string; currentValue?: number; close: number; high: number; low: number; previousClose: number; change: number; perChange: number; generatedTime?: string };
type Point = { date: string; close: number; open?: number; high?: number; low?: number; volume?: number; turnover?: number; trades?: number };
type Summary = { detail: string; value: number | string };
type TopMover = { symbol: string; ltp?: number; pointChange?: number; percentageChange?: number; securityName?: string };
type DepthRow = { symbol: string; securityName?: string; totalQuantity: number; totalOrder: number };
type MarketData = { symbol: string; source: string; sourceUpdatedAt: string; dataCoverage?: { stockQuotes?: string; indexCards?: string; marketSummary?: string; topMovers?: string; sectorIndices?: string; supplyDemand?: string; historicalCharts?: string }; latestHistoryDate: string | null; status: { is_open?: boolean; last_checked?: string }; indices: Index[]; summary: Summary[]; topStocks: Record<string, TopMover[]>; supplyDemand: { supplyList?: DepthRow[]; demandList?: DepthRow[] }; sectors: Array<{ indexName?: string; indexCode?: string; description?: string; currentValue?: number | null; change?: number | null; perChange?: number | null; latestDate?: string | null }>; stocks: Stock[]; points: Point[]; partial?: boolean; quoteStale?: boolean; error?: string };
const n = (v: unknown, digits = 2) => typeof v === "number" && Number.isFinite(v) ? v.toLocaleString("en-IN", { maximumFractionDigits: digits }) : "—";
const money = (v: unknown) => typeof v === "number" && Number.isFinite(v) ? "Rs. " + v.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "—";
const pctClass = (v: number) => v > 0 ? "text-emerald-700" : v < 0 ? "text-rose-700" : "text-slate-600";
const card = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5";
const indexCodeByName: Record<string, string> = {
  "NEPSE Index": "NEPSE", "Sensitive Index": "SENSIND", "Float Index": "FLOATIND",
  "Sensitive Float Index": "SENSFLTIND", "Banking SubIndex": "BANKSUBIND",
  "Development Bank Index": "DEVBANKIND", "Finance Index": "FININD",
  "Hotels And Tourism Index": "HOTELIND", "HydroPower Index": "HYDPOWIND",
  "Investment Index": "INVIDX", "Life Insurance Index": "LIFINSIND",
  "Manufacturing And Processing": "MANPROCIND", "Microfinance Index": "MICRFININD",
  "Mutual Fund Index": "MUTUALIND", "Non Life Insurance Index": "NONLIFIND",
  "Others Index": "OTHERSIND", "Trading Index": "TRDIND",
};
const indexSymbols = new Set(Object.values(indexCodeByName));
function formatDate(value?: string | null) { if (!value) return "—"; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" }); }

function MarketChart({ points, symbol, style }: { points: Point[]; symbol: string; style: "line" | "candles" }) {
  if (!points.length) return <div className="grid h-72 place-items-center rounded-xl bg-slate-50 text-sm text-slate-500">Historical chart data is not available for this symbol and period yet.</div>;
  const width = 1000, height = 300, left = 54, right = 18, top = 18, bottom = 28;
  const values = points.flatMap(p => [p.close, p.high ?? p.close, p.low ?? p.close]).filter(Number.isFinite);
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
  const x = (i: number) => left + (i / Math.max(points.length - 1, 1)) * (width - left - right);
  const y = (v: number) => top + ((max - v) / range) * (height - top - bottom);
  const path = points.map((p, i) => (i ? "L" : "M") + x(i).toFixed(1) + "," + y(p.close).toFixed(1)).join(" ");
  const area = path + " L" + x(points.length - 1) + "," + (height - bottom) + " L" + x(0) + "," + (height - bottom) + " Z";
  const ma = points.map((_, i) => {
    const slice = points.slice(Math.max(0, i - 19), i + 1);
    return slice.reduce((sum, p) => sum + p.close, 0) / slice.length;
  });
  const maPath = ma.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + "," + y(v).toFixed(1)).join(" ");
  const ticks = Array.from({ length: 5 }, (_, i) => min + range * i / 4);
  const maxVol = Math.max(...points.map(p => p.volume ?? 0), 1);
  return <div className="space-y-2">
    <div className="overflow-hidden rounded-xl bg-slate-950 p-2 sm:p-4">
      <svg viewBox={"0 0 " + width + " " + height} className="w-full" role="img" aria-label={symbol + " historical price chart"}>
        {ticks.map((v, i) => <g key={i}><line x1={left} x2={width-right} y1={y(v)} y2={y(v)} stroke="#334155" strokeDasharray="4 6"/><text x={left-9} y={y(v)+4} textAnchor="end" fontSize="13" fill="#94a3b8">{v.toFixed(0)}</text></g>)}
        {style === "candles" && indexSymbols.has(symbol) ? points.map((p, i) => {
          const up = (p.close ?? 0) >= (p.open ?? p.close ?? 0);
          const candleW = Math.max(3, Math.min(16, (width-left-right) / points.length * .58));
          const topY = y(Math.max(p.open ?? p.close, p.close));
          const bottomY = y(Math.min(p.open ?? p.close, p.close));
          return <g key={p.date}><line x1={x(i)} x2={x(i)} y1={y(p.high ?? p.close)} y2={y(p.low ?? p.close)} stroke={up ? "#34d399" : "#fb7185"} strokeWidth="2"/><rect x={x(i)-candleW/2} y={topY} width={candleW} height={Math.max(2,bottomY-topY)} fill={up ? "#10b981" : "#f43f5e"} rx="1"/></g>;
        }) : <><path d={area} fill="#0d9488" opacity=".17"/><path d={path} fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/><path d={maPath} fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="7 5"/></>}
        <text x={left} y={height-5} fill="#94a3b8" fontSize="12">{points[0].date}</text>
        <text x={width-right} y={height-5} textAnchor="end" fill="#94a3b8" fontSize="12">{points[points.length-1].date}</text>
      </svg>
    </div>
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500"><span className="inline-flex items-center gap-2"><span className="h-2 w-5 rounded bg-teal-500"/>{style === "candles" && symbol === "NEPSE" ? "OHLC candles" : "Closing price"}</span>{!(style === "candles" && symbol === "NEPSE") && <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 border-t-2 border-dashed border-amber-500"/>20-session average</span>}<span>{points.length} sessions</span></div>
    <div className="overflow-hidden rounded-xl bg-slate-50 p-2"><p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Volume</p><svg viewBox={"0 0 " + width + " 84"} className="w-full" role="img" aria-label={symbol + " daily volume chart"}>{points.map((p,i)=>{const w=Math.max(2,(width-left-right)/points.length*.65);const h=(p.volume??0)/maxVol*65;return <rect key={p.date} x={x(i)-w/2} y={76-h} width={w} height={h} rx="1" fill="#0f766e" opacity=".7"/>;})}</svg></div>
  </div>;
}

export default function NepseMarketDashboard() {
  const pathname = usePathname();
  const isNepali = pathname === "/ne/market" || pathname?.startsWith("/ne/market/");
  const [symbol,setSymbol]=useState("NEPSE");
  const [symbolInput,setSymbolInput]=useState("NEPSE");
  const [period,setPeriod]=useState("3M");
  const [chartStyle,setChartStyle]=useState<"line"|"candles">("candles");
  const [query,setQuery]=useState("");
  const [sort,setSort]=useState("turnover");
  const [watchlist,setWatchlist]=useState<string[]>([]);
  const [watchlistInput,setWatchlistInput]=useState("");
  const [watchlistLoaded,setWatchlistLoaded]=useState(false);
  const [data,setData]=useState<MarketData|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{
    try {
      const stored=JSON.parse(window.localStorage.getItem("pdfora-nepse-watchlist")||"[]");
      if(Array.isArray(stored)) setWatchlist([...new Set(stored.filter((item):item is string=>typeof item==="string"&&/^[A-Z0-9]{2,16}$/.test(item)))].slice(0,20));
    } catch { setWatchlist([]); }
    setWatchlistLoaded(true);
  },[]);
  useEffect(()=>{
    if(watchlistLoaded) window.localStorage.setItem("pdfora-nepse-watchlist",JSON.stringify(watchlist));
  },[watchlist,watchlistLoaded]);
  const addWatchlistSymbol=(raw:string)=>{
    const next=raw.trim().toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,16);
    if(next.length<2||watchlist.includes(next)||watchlist.length>=20) return;
    setWatchlist(items=>[...items,next]);
    setWatchlistInput("");
  };
  const load=useCallback(async (nextSymbol=symbol,nextPeriod=period) => {
    try {
      const response=await fetch("/api/nepse-market?symbol="+encodeURIComponent(nextSymbol)+"&period="+nextPeriod,{cache:"no-store"});
      const json=await response.json() as MarketData;
      if(!response.ok) throw new Error(json.error||"Market data unavailable.");
      setData(json); setError("");
    } catch(e) { setError(e instanceof Error?e.message:"Market data temporarily unavailable."); }
    finally { setLoading(false); }
  },[symbol,period]);
  useEffect(()=>{
    let active=true;
    const refresh=async()=>{
      try {
        const response=await fetch("/api/nepse-market?symbol="+encodeURIComponent(symbol)+"&period="+period,{cache:"no-store"});
        const json=await response.json() as MarketData;
        if(!response.ok) throw new Error(json.error||"Market data unavailable.");
        if(active){setData(json);setError("");}
      } catch(e) {
        if(active) setError(e instanceof Error?e.message:"Market data temporarily unavailable.");
      } finally {
        if(active) setLoading(false);
      }
    };
    void refresh();
    const timer=window.setInterval(()=>void refresh(),60*1000);
    return()=>{active=false;window.clearInterval(timer);};
  },[symbol,period]);
  const stocks=useMemo(()=>{
    const filtered=(data?.stocks??[]).filter(s=>(s.symbol+" "+s.name).toLowerCase().includes(query.toLowerCase()));
    return [...filtered].sort((a,b)=>sort==="gainers"?b.percent_change-a.percent_change:sort==="losers"?a.percent_change-b.percent_change:sort==="volume"?b.volume-a.volume:b.turnover-a.turnover).slice(0,40);
  },[data,query,sort]);
  const selectedIndex=data?.indices.find(i=>indexCodeByName[i.index]===symbol);
  const mainIndex=selectedIndex??data?.indices.find(i=>i.index.toLowerCase().includes("nepse index"))??data?.indices[0];
  const selectedStock=data?.stocks.find(s=>s.symbol===symbol);
  const selectedSector=data?.sectors.find(s=>s.indexCode===symbol);
  const headline=selectedStock?selectedStock.name:selectedIndex?.index??selectedSector?.indexName??"NEPSE Index";
  const value=selectedStock?.ltp??selectedIndex?.currentValue??selectedSector?.currentValue??mainIndex?.currentValue??mainIndex?.close;
  const change=selectedStock?.change??selectedIndex?.change??selectedSector?.change??mainIndex?.change??0;
  const changePct=selectedStock?.percent_change??selectedIndex?.perChange??selectedSector?.perChange??mainIndex?.perChange??0;
  const metrics=(data?.summary??[]).slice(0,4);
  const chooseSymbol=(next:string)=>{setSymbol(next);setSymbolInput(next);setChartStyle(indexSymbols.has(next)?"candles":"line");setLoading(true);};
  return <main className="min-h-screen bg-slate-50 text-slate-950">
    <section className="bg-[#071b1b] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-semibold text-teal-200 hover:underline">← PDFora home</Link>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-teal-300">PDFora Market Desk</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{isNepali ? "NEPSE बजार ड्यासबोर्ड" : "NEPSE Market Dashboard"}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Market snapshot, index and stock charts, sector performance, top movers, company price history and rules-based technical risk analysis.</p><Link href="/tools/nepse-technical-analysis" className="mt-4 inline-flex rounded-xl border border-teal-300/40 bg-teal-300/10 px-4 py-2.5 text-sm font-bold text-teal-200 transition hover:bg-teal-300/20">Open NEPSE Technical Analysis & Risk Lab →</Link></div><div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm"><span className={"mr-2 inline-block h-2 w-2 rounded-full "+(data?.status?.is_open?"bg-emerald-400":"bg-slate-400")}/>{data?.status?.is_open?"Market reported open":"Market reported closed / snapshot"}<p className="mt-1 text-xs text-slate-400">Dashboard checks for quote updates every 60 seconds; source timestamps are shown below</p></div></div>
      </div>
    </section>
    <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6">
      {error&&<div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error} <a href="https://www.nepalstock.com.np/" target="_blank" rel="noreferrer" className="font-bold underline">Open official NEPSE</a></div>}
      {data?.partial&&<p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Some secondary market datasets did not load. Core quotes and index data are still available.</p>}
      {data?.quoteStale&&<p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-5 text-amber-950">Warning: the upstream NEPSE quote snapshot is old or has no verifiable update time. These figures may not represent the latest trading session. Do not rely on them as live prices; verify on the official NEPSE site.</p>}
      {data?.dataCoverage&&<section aria-label="Market data source coverage" className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600"><p className="font-bold text-slate-800">Data freshness and source coverage</p><p className="mt-1">Stock quotes: {data.dataCoverage.stockQuotes}. Index cards, market summary, top movers and supply/demand: YONEPSE public snapshot (not independently verified as live). Sector indices and historical charts: archived daily data.</p><p className="mt-1">The dashboard refreshes its request every 60 seconds; that does not mean every upstream dataset refreshes every 60 seconds.</p></section>}
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">Stock quote source: {data?.source??"YONEPSE public dataset"} · Latest quote: {formatDate(data?.sourceUpdatedAt)}</p><button onClick={()=>{setLoading(true);void load(symbol,period);}} disabled={loading} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{loading?(isNepali?"लोड हुँदैछ…":"Loading…"):(isNepali?"बजार डेटा अद्यावधिक गर्नुहोस्":"Refresh market data")}</button></div>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{(data?.indices??[]).map(idx=><button key={idx.index} onClick={()=>chooseSymbol(indexCodeByName[idx.index]??"NEPSE")} className={"rounded-2xl border bg-white p-4 text-left shadow-sm "+((indexCodeByName[idx.index]??"NEPSE")===symbol?"border-teal-400 ring-1 ring-teal-100":"border-slate-200")}><p className="text-xs font-semibold text-slate-500">{idx.index}</p><p className="mt-2 text-2xl font-black tabular-nums">{n(idx.currentValue??idx.close)}</p><p className={"mt-1 text-sm font-bold "+pctClass(idx.perChange)}>{idx.change>0?"+":""}{n(idx.change)} ({idx.perChange>0?"+":""}{n(idx.perChange)}%)</p></button>)}</section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(m=><div key={m.detail} className={card}><p className="text-xs font-semibold text-slate-500">{m.detail}</p><p className="mt-2 text-xl font-black tabular-nums">{typeof m.value==="number"?n(m.value,0):m.value}</p></div>)}</section>
      <section className={card}>
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wide text-teal-700">Price chart</p><h2 className="mt-1 text-xl font-black">{headline}</h2><p className="mt-1 text-sm text-slate-500">{symbol} · {period} history · Latest archive date: {data?.latestHistoryDate??"—"}</p></div><div className="text-right"><p className="text-2xl font-black tabular-nums">{money(value)}</p><p className={"text-sm font-bold "+pctClass(changePct)}>{change>0?"+":""}{n(change)} ({changePct>0?"+":""}{n(changePct)}%)</p></div></div>
        <div className="mt-4 flex flex-wrap gap-2"><label className="sr-only" htmlFor="market-symbol">Stock symbol</label><input id="market-symbol" value={symbolInput} onChange={e=>setSymbolInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,16))} onKeyDown={e=>{if(e.key==="Enter"&&symbolInput.length>=2)chooseSymbol(symbolInput)}} className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Symbol e.g. NABIL"/><button onClick={()=>{if(symbolInput.length>=2)chooseSymbol(symbolInput);}} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white">Load chart</button><div className="flex rounded-lg bg-slate-100 p-1">{["1M","3M","1Y"].map(p=><button key={p} onClick={()=>{setLoading(true);setPeriod(p);}} className={"rounded-md px-3 py-1.5 text-xs font-bold "+(period===p?"bg-white shadow":"text-slate-600")}>{p}</button>)}</div>{indexSymbols.has(symbol)&&<div className="flex rounded-lg bg-slate-100 p-1"><button onClick={()=>setChartStyle("candles")} className={"rounded-md px-3 py-1.5 text-xs font-bold "+(chartStyle==="candles"?"bg-white shadow":"text-slate-600")}>Candles</button><button onClick={()=>setChartStyle("line")} className={"rounded-md px-3 py-1.5 text-xs font-bold "+(chartStyle==="line"?"bg-white shadow":"text-slate-600")}>Line</button></div>}</div>
        <div className="mt-5">{loading&&!data?<p className="py-20 text-center text-sm text-slate-500">Loading market chart…</p>:<MarketChart points={data?.points??[]} symbol={symbol} style={chartStyle}/>}</div>
        <p className="mt-3 text-xs leading-5 text-slate-500">The stock quote table uses the source identified above; the unofficial NEPSE session feed is accepted only when its timestamp is within 20 minutes. Index cards, market summary, top movers and supply/demand still use YONEPSE snapshots; sector indices and historical charts use archived daily data. The dashboard checks for updates every 60 seconds, but upstream refresh timing varies. This is not an exchange-authorized tick-by-tick trading terminal.</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className={card}><h2 className="text-lg font-black">Top gainers</h2><div className="mt-3 space-y-2">{(data?.topStocks?.top_gainer??[]).slice(0,8).map(s=><button key={s.symbol} onClick={()=>chooseSymbol(s.symbol)} className="flex w-full justify-between gap-3 border-b border-slate-100 py-2 text-left text-sm last:border-0"><span className="font-bold">{s.symbol}</span><span className="font-bold text-emerald-700">+{n(s.percentageChange)}%</span></button>)}{!data?.topStocks?.top_gainer?.length&&<p className="text-sm text-slate-500">Gainer list unavailable in this snapshot.</p>}</div></div>
        <div className={card}><h2 className="text-lg font-black">Top losers</h2><div className="mt-3 space-y-2">{(data?.topStocks?.top_loser??[]).slice(0,8).map(s=><button key={s.symbol} onClick={()=>chooseSymbol(s.symbol)} className="flex w-full justify-between gap-3 border-b border-slate-100 py-2 text-left text-sm last:border-0"><span className="font-bold">{s.symbol}</span><span className="font-bold text-rose-700">{n(s.percentageChange)}%</span></button>)}{!data?.topStocks?.top_loser?.length&&<p className="text-sm text-slate-500">Loser list unavailable in this snapshot.</p>}</div></div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {([["demandList",isNepali?"उच्च माग":"Highest demand","text-emerald-700"],["supplyList","Highest supply","text-rose-700"]] as const).map(([key,title,tone])=><div className={card} key={key}><h2 className="text-lg font-black">{title}</h2><p className="mt-1 text-xs text-slate-500">Aggregated queued quantity and order count by security</p><div className="mt-3 space-y-2">{(data?.supplyDemand?.[key]??[]).slice(0,10).map(row=><button type="button" key={row.symbol} onClick={()=>chooseSymbol(row.symbol)} className="flex w-full items-center justify-between gap-3 border-b border-slate-100 py-2 text-left text-sm last:border-0"><span><span className="font-bold">{row.symbol}</span><span className="ml-2 text-xs text-slate-500">{row.securityName}</span></span><span className={"shrink-0 text-right font-bold tabular-nums "+tone}>{n(row.totalQuantity,0)}<span className="block text-[10px] font-medium text-slate-400">{n(row.totalOrder,0)} orders</span></span></button>)}{!data?.supplyDemand?.[key]?.length&&<p className="text-sm text-slate-500">Supply/demand data is unavailable in this snapshot.</p>}</div></div>)}
      </section>
      <section className={card} aria-labelledby="nepse-watchlist-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 id="nepse-watchlist-title" className="text-xl font-black">{isNepali?"मेरो NEPSE वाचलिस्ट":"My NEPSE watchlist"}</h2><p className="mt-1 text-sm text-slate-500">{isNepali?"आफ्ना मनपर्ने सूचक र कम्पनी ब्राउजरमै सुरक्षित राख्नुहोस्।":"Save up to 20 symbols in this browser. Your list is not uploaded to a server."}</p></div>
          <form className="flex w-full max-w-sm gap-2" onSubmit={event=>{event.preventDefault();addWatchlistSymbol(watchlistInput);}}>
            <label className="sr-only" htmlFor="nepse-watchlist-symbol">{isNepali?"कम्पनी संकेत":"Add a symbol"}</label>
            <input id="nepse-watchlist-symbol" value={watchlistInput} onChange={event=>setWatchlistInput(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,16))} placeholder="e.g. NABIL" maxLength={16} className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm"/>
            <button type="submit" disabled={watchlist.length>=20||watchlistInput.trim().length<2||watchlist.includes(watchlistInput.trim().toUpperCase())} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">{isNepali?"थप्नुहोस्":"Add"}</button>
          </form>
        </div>
        {watchlist.length===0?<p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">{isNepali?"माथि कम्पनी संकेत लेखेर वाचलिस्ट सुरु गर्नुहोस्।":"Add a listed-company symbol to start your watchlist."}</p>:<div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {watchlist.map(code=>{const stock=data?.stocks.find(item=>item.symbol===code);return <div key={code} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
            <button type="button" onClick={()=>chooseSymbol(code)} className="min-w-0 flex-1 text-left"><span className="block font-black text-teal-800">{code}</span><span className="block truncate text-xs text-slate-500">{stock?.name|| (isNepali?"हालको स्न्यापसटमा मूल्य उपलब्ध छैन":"No quote in the current snapshot")}</span>{stock&&<span className="mt-1 block text-sm font-bold tabular-nums">{money(stock.ltp)} <span className={pctClass(stock.percent_change)}>{stock.percent_change>0?"+":""}{n(stock.percent_change)}%</span></span>}</button>
            <button type="button" onClick={()=>setWatchlist(items=>items.filter(item=>item!==code))} aria-label={(isNepali?"वाचलिस्टबाट हटाउनुहोस् ":"Remove from watchlist ")+code} className="rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50">×</button>
          </div>;})}
        </div>}
        <p className="mt-3 text-xs text-slate-500">{isNepali?"सूची यस ब्राउजरको local storage मा मात्र रहन्छ।":"Stored locally in this browser only; displayed prices still depend on the upstream snapshot and its timestamp."}</p>
      </section>
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black">{isNepali?"सूचीबद्ध कम्पनीहरू":"Listed companies"}</h2><p className="mt-1 text-sm text-slate-500">Search by symbol or company name. Select a row to load its price chart.</p></div><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search NABIL, NICA, bank…" className="w-full max-w-sm rounded-xl border border-slate-300 px-3 py-2.5 text-sm"/></div>
        <div className="mt-4 flex flex-wrap gap-2">{[["turnover","Turnover"],["gainers","Gainers"],["losers","Losers"],["volume","Volume"]].map(([key,label])=><button key={key} onClick={()=>setSort(key)} className={"rounded-full px-3 py-2 text-xs font-bold "+(sort===key?"bg-teal-700 text-white":"bg-slate-100 text-slate-700")}>{label}</button>)}</div>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="p-3">Symbol</th><th className="p-3">Company</th><th className="p-3 text-right">LTP</th><th className="p-3 text-right">Change</th><th className="p-3 text-right">Volume</th><th className="p-3 text-right">Turnover</th></tr></thead><tbody>{stocks.map(s=><tr key={s.symbol} className={"cursor-pointer border-t border-slate-100 hover:bg-teal-50 "+(symbol===s.symbol?"bg-teal-50":"")} onClick={()=>chooseSymbol(s.symbol)}><td className="p-3 font-black text-teal-800">{s.symbol}</td><td className="max-w-[280px] truncate p-3 text-slate-600">{s.name}</td><td className="p-3 text-right font-semibold tabular-nums">{n(s.ltp)}</td><td className={"p-3 text-right font-bold tabular-nums "+pctClass(s.percent_change)}>{s.percent_change>0?"+":""}{n(s.percent_change)}%</td><td className="p-3 text-right tabular-nums">{n(s.volume,0)}</td><td className="p-3 text-right tabular-nums">{money(s.turnover)}</td></tr>)}</tbody></table></div>
        <p className="mt-3 text-xs text-slate-500">Showing up to 40 matching securities from the current source snapshot.</p>
      </section>
      <section className={card}><h2 className="text-xl font-black">Sector indices</h2><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{(data?.sectors??[]).map(s=><button type="button" key={s.indexCode??s.indexName} onClick={()=>chooseSymbol(s.indexCode??"NEPSE")} className={"rounded-xl p-3 text-left "+(symbol===s.indexCode?"bg-teal-50 ring-1 ring-teal-300":"bg-slate-50 hover:bg-teal-50")}><p className="font-semibold">{s.indexName??s.indexCode}</p><p className="mt-1 text-sm font-semibold tabular-nums">{s.currentValue!==null&&s.currentValue!==undefined?n(s.currentValue):"—"}</p><p className={"mt-1 text-xs font-bold "+pctClass(s.perChange??0)}>{s.perChange!==null&&s.perChange!==undefined?(s.perChange>0?"+":"")+n(s.perChange)+"%":"Change unavailable"}</p><p className="mt-1 text-xs text-slate-500">{s.description??"Sector reference"}</p></button>)}</div></section>
      <section className={card}><h2 className="text-xl font-black">Nepal market updates</h2><div className="mt-4"><NepalMarketNews/></div><div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold"><Link href="/tools/nepse-market-news" className="text-teal-700 underline">NEPSE & IPO news</Link><Link href="/tools/nepse-dividend-calculator" className="text-teal-700 underline">Dividend calculator</Link><Link href="/tools/nepal-share-calculator" className="text-teal-700 underline">Share profit calculator</Link><a href="https://www.nepalstock.com.np/" target="_blank" rel="noreferrer" className="text-teal-700 underline">Official NEPSE</a></div></section>
      <p className="pb-8 text-xs leading-5 text-slate-500">Data source: YONEPSE public dataset, which republishes exchange and community data. Verify prices, notices and corporate actions with NEPSE before making investment decisions. PDFora does not provide investment advice.</p>
    </div>
  </main>;
}
