"use client";

import { calculateOhlcvIndicators } from "../lib/nepse-quant.mjs";
type Candle={date:string;open?:number;high?:number;low?:number;close:number;volume?:number};
export default function NepseAdvancedIndicators({rows}:{rows:Candle[]}){
 const result=calculateOhlcvIndicators(rows);
 if(!result)return null;
 const fmt=(x:number|null,suffix="")=>x===null?"Unavailable":x.toFixed(2)+suffix;
 return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-extrabold text-slate-900">Advanced volatility & participation diagnostics</h3><p className="mt-1 text-xs text-slate-500">Deterministic calculations from the selected instrument&apos;s OHLCV history.</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["ATR (14)",fmt(result.atr)],["ATR / price",fmt(result.atrPct,"%")],["ADX (14)",fmt(result.adx)],["Latest volume / prior average",fmt(result.volumeRatio,"×")],["OBV direction · 20 sessions",result.obvTrend]].map(([k,v])=><div key={k} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{k}</p><p className="mt-1 text-sm font-bold text-slate-900">{v}</p></div>)}</div><p className="mt-3 text-xs leading-5 text-slate-500">ATR measures recent trading range, ADX estimates trend strength (not direction), and OBV is a cumulative price-direction/volume proxy. These indicators require reliable OHLCV; missing fields remain unavailable. A rising OBV does not prove institutional accumulation.</p></section>;
}
