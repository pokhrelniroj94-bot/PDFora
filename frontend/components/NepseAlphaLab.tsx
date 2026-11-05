"use client";

import { useMemo, useState } from "react";

type Bar = { date: string; close: number; volume?: number };
type Trade = { buyDate: string; sellDate: string; buy: number; sell: number; returnPct: number; days: number };
type Result = { trades: Trade[]; strategyReturn: number; benchmarkReturn: number; winRate: number; maxDrawdown: number; profitFactor: number; exposure: number; equity: number[] };

const panel = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5";
const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const average = (v: number[]) => v.length ? v.reduce((a,b)=>a+b,0)/v.length : 0;
function sma(v:number[], n:number, i:number) { return i+1<n ? null : average(v.slice(i-n+1,i+1)); }
function rsi(v:number[], i:number, n=14) {
  if(i<n) return null;
  let gain=0,loss=0;
  for(let j=i-n+1;j<=i;j++){const d=v[j]-v[j-1];gain+=Math.max(d,0);loss+=Math.max(-d,0);}
  if(loss===0) return 100;
  return 100-100/(1+(gain/n)/(loss/n));
}
function runBacktest(rows:Bar[], mode:string, costPct:number):Result {
  const trades:Trade[]=[]; let cash=1, units=0, entry=0, entryDate="", entryIndex=0;
  const equity:number[]=[];
  for(let i=51;i<rows.length;i++){
    const closes=rows.map(x=>x.close), p=closes[i], signalIndex=i-1, signalPrice=closes[signalIndex];
    const s20=sma(closes,20,signalIndex), s50=sma(closes,50,signalIndex), p20=sma(closes,20,signalIndex-1), p50=sma(closes,50,signalIndex-1);
    const r=rsi(closes,signalIndex), priorR=rsi(closes,signalIndex-1);
    let buy=false, sell=false;
    if(mode==="sma"){buy=!!(s20&&s50&&p20&&p50&&s20>s50&&p20<=p50);sell=!!(s20&&s50&&p20&&p50&&s20<s50&&p20>=p50);}
    else if(mode==="rsi"){buy=!!(r!==null&&priorR!==null&&priorR<30&&r>=30);sell=!!(r!==null&&r>=70);}
    else {const high=Math.max(...closes.slice(signalIndex-20,signalIndex));buy=signalPrice>high&&signalPrice>closes[signalIndex-1];sell=signalPrice<sma(closes,20,signalIndex)!;}
    if(units===0&&buy){entry=p*(1+costPct/100);units=cash/entry;cash=0;entryDate=rows[i].date;entryIndex=i;}
    else if(units>0&&(sell||i===rows.length-1)){
      const exit=p*(1-costPct/100), value=units*exit, ret=(exit/entry-1)*100;
      trades.push({buyDate:entryDate,sellDate:rows[i].date,buy:entry,sell:exit,returnPct:ret,days:i-entryIndex});
      cash=value;units=0;
    }
    equity.push(cash+units*p);
  }
  const final=equity[equity.length-1]??1, peakSeries:number[]=[];let peak=1,maxDD=0;
  for(const x of equity){peak=Math.max(peak,x);peakSeries.push(x);maxDD=Math.max(maxDD,(peak-x)/peak*100);}
  const wins=trades.filter(t=>t.returnPct>0), grossWin=wins.reduce((a,t)=>a+t.returnPct,0), grossLoss=Math.abs(trades.filter(t=>t.returnPct<0).reduce((a,t)=>a+t.returnPct,0));
  return {trades,strategyReturn:(final-1)*100,benchmarkReturn:(rows[rows.length-1].close/rows[50].close-1)*100,winRate:trades.length?wins.length/trades.length*100:0,maxDrawdown:maxDD,profitFactor:grossLoss?grossWin/grossLoss:grossWin?Infinity:0,exposure:equity.length?trades.reduce((a,t)=>a+t.days,0)/equity.length*100:0,equity:peakSeries};
}

export default function NepseAlphaLab(){
 const [symbol,setSymbol]=useState("NABIL"),[mode,setMode]=useState("sma"),[cost,setCost]=useState("0.45"),[rows,setRows]=useState<Bar[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(""),[source,setSource]=useState("");
 async function load(){
  setBusy(true);setError("");
  try{const res=await fetch("/api/nepse-market?symbol="+encodeURIComponent(symbol.trim().toUpperCase())+"&period=1Y",{cache:"no-store"});const data=await res.json();if(!res.ok)throw new Error(data.error||"Historical prices unavailable.");
   const clean=(data.points||[]).map((p:Record<string,unknown>)=>({date:String(p.date||""),close:Number(p.close),volume:Number(p.volume)||undefined})).filter((p:Bar)=>p.date&&Number.isFinite(p.close)&&p.close>0).sort((a:Bar,b:Bar)=>a.date.localeCompare(b.date));
   if(clean.length<80)throw new Error("At least 80 daily price observations are required. This symbol has "+clean.length+".");
   setRows(clean);setSource(String(data.source||"Historical NEPSE data")+" · "+clean[0].date+" to "+clean[clean.length-1].date);
  }catch(e){setError(e instanceof Error?e.message:"Could not load stock history.");}finally{setBusy(false);}
 }
 const metrics=useMemo(()=>rows.length?runBacktest(rows,mode,Math.max(0,Math.min(5,Number(cost)||0))):null,[rows,mode,cost]);
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
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 text-sm"><p>Closed trades: <b>{metrics.trades.length}</b></p><p>Profit factor: <b>{Number.isFinite(metrics.profitFactor)?fmt(metrics.profitFactor):"∞"}</b></p><p>Market exposure: <b>{fmt(metrics.exposure)}%</b></p><p>Cost per side: <b>{fmt(Number(cost)||0)}%</b></p></div>
   </section>
   <section className={panel}><h3 className="font-extrabold text-slate-900">Trade history</h3>{metrics.trades.length?<div className="mt-3 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="text-xs text-slate-500"><tr>{["Entry date","Exit date","Entry price","Exit price","Net return","Sessions"].map(x=><th key={x} className="border-b p-2">{x}</th>)}</tr></thead><tbody>{metrics.trades.slice().reverse().map((t,i)=><tr key={t.buyDate+"-"+t.sellDate+i}><td className="border-b p-2">{t.buyDate}</td><td className="border-b p-2">{t.sellDate}</td><td className="border-b p-2">{fmt(t.buy)}</td><td className="border-b p-2">{fmt(t.sell)}</td><td className={"border-b p-2 font-bold "+(t.returnPct>=0?"text-emerald-700":"text-rose-700")}>{fmt(t.returnPct)}%</td><td className="border-b p-2">{t.days}</td></tr>)}</tbody></table></div>:<p className="mt-3 text-sm text-slate-600">No trades triggered in this historical period. Try another strategy or symbol.</p>}</section>
  </div>}
  <aside className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950"><b>Research-only disclaimer:</b> This is a simplified educational backtest on available daily close data. Signals are evaluated after a completed daily close and filled at the next available daily close to reduce look-ahead bias. It does not model intraday fills, circuit limits, partial fills, liquidity, corporate-action adjustments, taxes in every case or survivorship bias. Historical returns do not predict future results. Verify source data before using it.</aside>
 </main>;
}
