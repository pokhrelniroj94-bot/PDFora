"use client";

import { useMemo, useState } from "react";

import { detectLargePriceGaps, normalizeDailyBars, runBacktest, type QuantBar as Bar, type QuantResult as Result } from "../lib/nepse-quant.mjs";

const panel = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5";
const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";

export default function NepseAlphaLab(){
 const [symbol,setSymbol]=useState("NABIL"),[mode,setMode]=useState("sma"),[cost,setCost]=useState("0.45"),[rows,setRows]=useState<Bar[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(""),[source,setSource]=useState("");
 const [result,setResult]=useState<Result|null>(null);
 async function load(){
  setBusy(true);setError("");setResult(null);
  try{const res=await fetch("/api/nepse-market?symbol="+encodeURIComponent(symbol.trim().toUpperCase())+"&period=1Y",{cache:"no-store"});const data=await res.json();if(!res.ok)throw new Error(data.error||"Historical prices unavailable.");
   const clean=normalizeDailyBars(data.points||[]);
   if(clean.length<80)throw new Error("At least 80 daily price observations are required. This symbol has "+clean.length+".");
   setRows(clean);setSource(String(data.source||"Historical NEPSE data")+" · "+clean[0].date+" to "+clean[clean.length-1].date);
  }catch(e){setError(e instanceof Error?e.message:"Could not load stock history.");}finally{setBusy(false);}
 }
 const costRate=Math.max(0,Math.min(5,Number(cost)||0));
 const metrics=useMemo(()=>rows.length?runBacktest(rows,mode,costRate):null,[rows,mode,costRate]);
 const largeGaps=useMemo(()=>detectLargePriceGaps(rows),[rows]);
 const historyAgeDays=rows.length?Math.floor((Date.now()-Date.parse(rows[rows.length-1].date+"T00:00:00Z"))/86400000):null;
 const historyStale=historyAgeDays!==null&&historyAgeDays>7;
 const fmt=(n:number)=>n.toLocaleString(undefined,{maximumFractionDigits:2});
 return <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6">
  <header className="mb-7"><p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">PDFora · NEPSE Quant Lab</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Strategy Backtester</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Test rule-based NEPSE strategies on historical daily prices, include estimated transaction costs and compare results with a buy-and-hold benchmark. No future data is used to trigger a past trade.</p></header>
  <section className={panel}><div className="grid gap-3 sm:grid-cols-4">
   <label className="sm:col-span-1"><span className="mb-1.5 block text-xs font-bold text-slate-600">Company symbol</span><input className={input} value={symbol} onChange={e=>setSymbol(e.target.value.toUpperCase())} maxLength={16}/></label>
   <label><span className="mb-1.5 block text-xs font-bold text-slate-600">Strategy</span><select className={input} value={mode} onChange={e=>setMode(e.target.value)}><option value="sma">SMA 20/50 crossover</option><option value="rsi">RSI 14 recovery</option><option value="breakout">20-day breakout</option></select></label>
   <label><span className="mb-1.5 block text-xs font-bold text-slate-600">Estimated cost per side (%)</span><input className={input} type="number" min="0" max="5" step="0.01" value={cost} onChange={e=>setCost(e.target.value)}/></label>
   <button onClick={()=>void load()} disabled={busy||!symbol.trim()} className="self-end rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy?"Loading history…":"Load & test strategy"}</button>
  </div><p className="mt-3 text-xs leading-5 text-slate-500">Cost is a user-adjustable estimate applied to both entry and exit. Set it to include your broker commission, SEBON fee, DP charge and slippage assumptions. It is not a live fee quote.</p></section>
  {error&&<p role="alert" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{error}</p>}
  {metrics&&<div className="mt-5 space-y-4">
   <section className={panel}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-black text-slate-900">{symbol} · Backtest results</h2><p className="mt-1 text-xs text-slate-500">{source}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{mode==="sma"?"SMA crossover":mode==="rsi"?"RSI recovery":"20-day breakout"}</span></div>
    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{[["Strategy return",metrics.strategyReturn],["Buy & hold",metrics.benchmarkReturn],["Win rate",metrics.winRate],["Max drawdown",-metrics.maxDrawdown]].map(([k,v])=><div key={String(k)} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{k}</p><p className={"mt-1 text-xl font-black tabular-nums "+(Number(v)>=0?"text-slate-900":"text-rose-700")}>{fmt(Number(v))}%</p></div>)}</div>
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 text-sm"><p>Closed trades: <b>{metrics.trades.length}</b></p><p>Profit factor: <b>{Number.isFinite(metrics.profitFactor)?fmt(metrics.profitFactor):"∞"}</b></p><p>Market exposure: <b>{fmt(metrics.exposure)}%</b></p><p>Cost per side: <b>{fmt(costRate)}%</b></p></div>
   </section>
   {historyStale&&<p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-5 text-amber-950"><b>Historical data freshness warning:</b> Latest observation is {historyAgeDays} calendar days old. The backtest still runs for research, but verify the latest NEPSE trading session and do not treat these results as current-market signals.</p>}
   {largeGaps.length>0&&<p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-5 text-amber-950"><b>Corporate-action / price-gap review:</b> {largeGaps.length} daily move(s) of 20% or more were detected ({largeGaps.slice(0,4).map(g=>g.date+" "+g.changePct.toFixed(1)+"%").join(", ")}). These may reflect genuine volatility, bonus/right-share/split adjustments or source errors. Verify NEPSE disclosures and adjusted-price methodology before relying on this backtest; no automatic adjustment has been applied.</p>}
   <section className={panel}><h3 className="font-extrabold text-slate-900">Trade history</h3>{metrics.trades.length?<div className="mt-3 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="text-xs text-slate-500"><tr>{["Entry date","Exit date","Entry price","Exit price","Net return","Sessions"].map(x=><th key={x} className="border-b p-2">{x}</th>)}</tr></thead><tbody>{metrics.trades.slice().reverse().map((t,i)=><tr key={t.buyDate+"-"+t.sellDate+i}><td className="border-b p-2">{t.buyDate}</td><td className="border-b p-2">{t.sellDate}</td><td className="border-b p-2">{fmt(t.buy)}</td><td className="border-b p-2">{fmt(t.sell)}</td><td className={"border-b p-2 font-bold "+(t.returnPct>=0?"text-emerald-700":"text-rose-700")}>{fmt(t.returnPct)}%</td><td className="border-b p-2">{t.days}</td></tr>)}</tbody></table></div>:<p className="mt-3 text-sm text-slate-600">No trades triggered in this historical period. Try another strategy or symbol.</p>}</section>
  </div>}
  <aside className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950"><b>Research-only disclaimer:</b> This is a simplified educational backtest on available daily close data. Signals are evaluated after a completed daily close and filled at the next available daily close to reduce look-ahead bias. It does not model intraday fills, circuit limits, partial fills, liquidity, corporate-action adjustments, taxes in every case or survivorship bias. Historical returns do not predict future results. Verify source data before using it.</aside>
 </main>;
}
