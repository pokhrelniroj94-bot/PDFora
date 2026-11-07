"use client";

import { useMemo } from "react";
type Candle={date:string;open?:number;high?:number;low?:number;close:number;volume?:number};
export default function NepseAdvancedIndicators({rows}:{rows:Candle[]}){
 const result=useMemo(()=>{
  const clean=rows.filter(x=>Number.isFinite(x.close)&&x.close>0).sort((a,b)=>a.date.localeCompare(b.date));
  const last=clean.at(-1); if(!last)return null;
  const candles=clean.slice(-30);
  const full=candles.length>=30&&candles.every(x=>Number.isFinite(x.high)&&Number.isFinite(x.low));
  let atr:number|null=null,adx:number|null=null;
  if(full){
   const tr:number[]=[],plus:number[]=[],minus:number[]=[];
   for(let i=1;i<candles.length;i++){const a=candles[i],p=candles[i-1],up=a.high!-p.high!,down=p.low!-a.low!;tr.push(Math.max(a.high!-a.low!,Math.abs(a.high!-p.close),Math.abs(a.low!-p.close)));plus.push(up>down&&up>0?up:0);minus.push(down>up&&down>0?down:0);}
   const n=14; if(tr.length>=n){atr=tr.slice(-n).reduce((a,b)=>a+b,0)/n;let st=tr.slice(0,n).reduce((a,b)=>a+b,0),sp=plus.slice(0,n).reduce((a,b)=>a+b,0),sm=minus.slice(0,n).reduce((a,b)=>a+b,0);const dx:number[]=[];for(let i=n;i<tr.length;i++){st=st-st/n+tr[i];sp=sp-sp/n+plus[i];sm=sm-sm/n+minus[i];const p=st?100*sp/st:0,m=st?100*sm/st:0;dx.push(p+m?100*Math.abs(p-m)/(p+m):0);}if(dx.length>=n)adx=dx.slice(-n).reduce((a,b)=>a+b,0)/n;}
  }
  const volumes=clean.slice(-21).map(x=>x.volume);
  const avg=volumes.length>=10?volumes.slice(0,-1).filter((v):v is number=>typeof v==="number"&&Number.isFinite(v)).reduce((a,b)=>a+b,0)/volumes.slice(0,-1).filter((v):v is number=>typeof v==="number"&&Number.isFinite(v)).length:null;
  const volumeRatio=avg&&avg>0&&typeof last.volume==="number"?last.volume/avg:null;
  const obv=clean.every(x=>typeof x.volume==="number"&&Number.isFinite(x.volume))?clean.reduce((acc,x,i)=>{const d=i===0?0:x.close>clean[i-1].close?1:x.close<clean[i-1].close?-1:0;acc.push((acc[i-1]||0)+d*(x.volume||0));return acc;},[] as number[]):[];
  const obvTrend=obv.length>=21?(obv.at(-1)!>obv[obv.length-21]?"Rising":obv.at(-1)!<obv[obv.length-21]?"Falling":"Flat"):"Unavailable";
  return {atr,adx,volumeRatio,obvTrend,atrPct:atr===null?null:atr/last.close*100};
 },[rows]);
 if(!result)return null;
 const fmt=(x:number|null,suffix="")=>x===null?"Unavailable":x.toFixed(2)+suffix;
 return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold text-slate-900">Advanced volatility & participation diagnostics</h3><p className="mt-1 text-xs text-slate-500">Deterministic calculations from the selected instrument&apos;s OHLCV history.</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["ATR (14)",fmt(result.atr)],["ATR / price",fmt(result.atrPct,"%")],["ADX (14)",fmt(result.adx)],["Latest volume / prior average",fmt(result.volumeRatio,"×")],["OBV direction · 20 sessions",result.obvTrend]].map(([k,v])=><div key={k} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{k}</p><p className="mt-1 text-sm font-bold text-slate-900">{v}</p></div>)}</div><p className="mt-3 text-xs leading-5 text-slate-500">ATR measures recent trading range, ADX estimates trend strength (not direction), and OBV is a cumulative price-direction/volume proxy. These indicators require reliable OHLCV; missing fields remain unavailable. A rising OBV does not prove institutional accumulation.</p></section>;
}
