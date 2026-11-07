"use client";

import { useEffect, useMemo, useState } from "react";

type Candle = { date: string; close: number; volume?: number };
type Stock = Record<string, unknown>;
type Sector = Record<string, unknown>;
type Payload = { points?: Candle[]; stocks?: Stock[]; sectors?: Sector[]; stockSummary?: Record<string, unknown> | null; source?: string; sourceUpdatedAt?: string | null; quoteStale?: boolean };
const pickNumber = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) { const n = Number(row[key]); if (row[key] !== null && row[key] !== undefined && row[key] !== "" && Number.isFinite(n)) return n; }
  return null;
};
const pickText = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) if (typeof row[key] === "string" && String(row[key]).trim()) return String(row[key]);
  return "";
};
const pct = (n: number | null) => n === null ? "Unavailable" : (n > 0 ? "+" : "") + n.toFixed(2) + "%";
function average(values: number[]) { return values.length ? values.reduce((a,b)=>a+b,0)/values.length : null; }
function ema(values: number[], period: number) { const k=2/(period+1); return values.reduce((acc,v,i)=>{acc.push(i? v*k+acc[i-1]*(1-k):v);return acc;},[] as number[]); }
function marketRegime(rows: Candle[]) {
  const clean=rows.filter(x=>x && /^\d{4}-\d{2}-\d{2}$/.test(x.date) && Number.isFinite(x.close) && x.close>0).sort((a,b)=>a.date.localeCompare(b.date));
  if(clean.length<50) return {label:"Insufficient history",tone:"amber",ret20:null as number|null,ret50:null as number|null,vol:null as number|null,close:null as number|null,ema20:null as number|null,ema50:null as number|null,asOf:clean.at(-1)?.date||"Unavailable"};
  const closes=clean.map(x=>x.close), e20=ema(closes,20),e50=ema(closes,50),last=closes.length-1;
  const ret20=(closes[last]/closes[last-20]-1)*100,ret50=(closes[last]/closes[last-50]-1)*100;
  const returns=closes.slice(-21).slice(1).map((v,i)=>v/closes.slice(-21)[i]-1);
  const mean=average(returns)||0, vol=Math.sqrt(average(returns.map(x=>(x-mean)**2))||0)*Math.sqrt(252)*100;
  const up=closes[last]>e20[last]&&e20[last]>e50[last]&&ret20>0;
  const down=closes[last]<e20[last]&&e20[last]<e50[last]&&ret20<0;
  return {label:up?"Bullish trend":down?"Bearish trend":"Sideways / mixed",tone:up?"green":down?"rose":"amber",ret20,ret50,vol,close:closes[last],ema20:e20[last],ema50:e50[last],asOf:clean[last].date};
}
export default function NepseMarketContext({symbol,selectedPoints}:{symbol:string;selectedPoints:Candle[]}) {
  const [payload,setPayload]=useState<Payload|null>(null),[busy,setBusy]=useState(true),[error,setError]=useState("");
  useEffect(()=>{
    let active=true;
    fetch("/api/nepse-market?symbol=NEPSE&period=1Y",{cache:"no-store"}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||"Market context unavailable");return d as Payload;})
      .then(d=>{if(active)setPayload(d);}).catch(e=>{if(active)setError(e instanceof Error?e.message:"Market context unavailable");}).finally(()=>{if(active)setBusy(false);});
    return ()=>{active=false;};
  },[]);
  const regime=useMemo(()=>marketRegime(payload?.points||[]),[payload]);
  const breadth=useMemo(()=>{
    const stocks=(payload?.stocks||[]).filter(row=>!["NEPSE","SENSIND","FLOATIND","SENSFLTIND"].includes(pickText(row,["symbol"]).toUpperCase()));
    let up=0,down=0,flat=0,turnover=0,volume=0,validTurnover=0,validVolume=0;
    for(const row of stocks){const change=pickNumber(row,["percent_change","changePercent","percentageChange"]);if(change===null)continue;if(change>0.05)up++;else if(change<-.05)down++;else flat++;const t=pickNumber(row,["turnover","totalTradeValue","amount"]);if(t!==null&&t>=0){turnover+=t;validTurnover++;}const v=pickNumber(row,["volume","totalTradeQuantity","tradedShares"]);if(v!==null&&v>=0){volume+=v;validVolume++;}}
    const total=up+down+flat;
    return {up,down,flat,total,ratio:total?(up-down)/total*100:null,turnover:validTurnover?turnover:null,volume:validVolume?volume:null};
  },[payload]);
  const sectors=useMemo(()=> (payload?.sectors||[]).map(row=>({name:pickText(row,["indexName","name","sectorName","index"]),change:pickNumber(row,["perChange","changePercent","percentageChange","change"]),turnover:pickNumber(row,["turnover","totalTradeValue"]),breadth:pickNumber(row,["advances","advanced"])})).filter(x=>x.name&&x.change!==null).sort((a,b)=>(b.change||0)-(a.change||0)).slice(0,6),[payload]);
  const relative=useMemo(()=>{
    const index=payload?.points||[], stock=selectedPoints||[];
    if(symbol.toUpperCase()==="NEPSE")return {stockReturn:null,indexReturn:null,excess:null,note:"Selected instrument is the NEPSE index."};
    const aligned=stock.filter(s=>index.some(i=>i.date===s.date));
    if(aligned.length<20)return {stockReturn:null,indexReturn:null,excess:null,note:"Not enough overlapping observations for a reliable relative-strength comparison."};
    const start=aligned[Math.max(0,aligned.length-21)],end=aligned[aligned.length-1], indexStart=index.find(x=>x.date===start.date),indexEnd=index.find(x=>x.date===end.date);
    if(!indexStart||!indexEnd||start.close<=0||indexStart.close<=0)return {stockReturn:null,indexReturn:null,excess:null,note:"Relative-strength data is incomplete."};
    const a=(end.close/start.close-1)*100,b=(indexEnd.close/indexStart.close-1)*100;
    return {stockReturn:a,indexReturn:b,excess:a-b,note:"Trailing 20 overlapping trading observations; historical relative strength, not a forecast."};
  },[payload,selectedPoints,symbol]);
  if(busy)return <section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-extrabold text-slate-900">Market regime & breadth</h3><p className="mt-2 text-sm text-slate-500">Calculating market-wide context from NEPSE index and stock snapshot…</p></section>;
  if(error||!payload)return <section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-extrabold text-slate-900">Market regime & breadth</h3><p className="mt-2 text-sm text-amber-800">{error||"Market-wide snapshot unavailable"}. Company technical analysis remains separate.</p></section>;
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">Market regime, breadth & sector rotation</h3><p className="mt-1 text-xs text-slate-500">Independent deterministic context · {regime.asOf}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{payload.quoteStale?"Quote snapshot may be stale":"Market snapshot received"}</span></div>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[["Market regime",regime.label],["NEPSE 20-session return",pct(regime.ret20)],["NEPSE 50-session return",pct(regime.ret50)],["Annualized 20-session volatility",regime.vol===null?"Unavailable":regime.vol.toFixed(2)+"%"]].map(([k,v])=><div key={k} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{k}</p><p className="mt-1 text-sm font-bold text-slate-900">{v}</p></div>)}
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div><h4 className="text-sm font-bold text-slate-800">Market breadth · listed stocks</h4><div className="mt-2 grid grid-cols-3 gap-2 text-center">{[["Advancers",breadth.up],["Decliners",breadth.down],["Unchanged",breadth.flat]].map(([k,v])=><div key={String(k)} className="rounded-lg border border-slate-100 p-3"><p className="text-xs text-slate-500">{k}</p><p className="mt-1 text-lg font-black">{v}</p></div>)}</div><p className="mt-2 text-xs text-slate-500">{breadth.total?breadth.total+" stocks with usable daily change; breadth ratio "+pct(breadth.ratio):"Breadth data unavailable from the provider."} · Turnover {breadth.turnover===null?"Unavailable":breadth.turnover.toLocaleString()} · Volume {breadth.volume===null?"Unavailable":breadth.volume.toLocaleString()}</p></div>
      <div><h4 className="text-sm font-bold text-slate-800">Leading sectors by daily change</h4>{sectors.length?<ul className="mt-2 space-y-2">{sectors.map(s=><li key={s.name} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"><span className="font-medium text-slate-700">{s.name}</span><strong className={s.change!>=0?"text-emerald-700":"text-rose-700"}>{pct(s.change)}</strong></li>)}</ul>:<p className="mt-2 text-xs text-slate-500">Sector data unavailable; no ranking inferred.</p>}</div>
    </div>
    <div className="mt-4 rounded-xl border border-slate-100 p-3"><h4 className="text-sm font-bold text-slate-800">Relative strength · {symbol}</h4><p className="mt-1 text-sm text-slate-700">Stock: {pct(relative.stockReturn)} · NEPSE: {pct(relative.indexReturn)} · Excess return: {pct(relative.excess)}</p><p className="mt-1 text-xs text-slate-500">{relative.note}</p></div>
    <p className="mt-3 text-xs text-slate-500">Sector rotation here is a daily relative-performance snapshot, not confirmed fund-flow data. Breadth and volume depend on upstream field coverage. Source: {payload.source||"NEPSE market data provider"}.</p>
  </section>;
}
