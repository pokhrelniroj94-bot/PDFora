"use client";

import { useState } from "react";
import { calculateJanmaKundali, KUNDALI_PLACES, type KundaliInput } from "../lib/kundali-calculator";
import { calculateAshtakoota, ASHTAKOOTA_SOURCE, ASHTAKOOTA_SOURCE_URL, type GunaMilanResult } from "../lib/ashtakoota-calculator";

type Language = "ne"|"hi"|"en";
type PersonForm = { name:string; dateSystem:"AD"|"BS"; birthDate:string; birthTime:string; placeId:string };
const initial = (name:string):PersonForm => ({name,dateSystem:"AD",birthDate:"2000-01-01",birthTime:"12:00",placeId:"kathmandu"});
const copy = {
 ne:{title:"परम्परागत ३६ गुण मिलान",desc:"दुलही र दुलहाको चन्द्र राशि तथा जन्म नक्षत्रका आधारमा अष्टकूट मिलान गर्नुहोस्।",bride:"दुलहीको जन्म विवरण",groom:"दुलहाको जन्म विवरण",name:"नाम (ऐच्छिक)",date:"जन्म मिति",system:"मिति प्रणाली",time:"स्थानीय जन्म समय",place:"जन्मस्थान",calculate:"३६ गुण मिलान गर्नुहोस्",total:"कुल गुण",of:"मध्ये",koota:"कूट",score:"प्राप्त अंक",brideValue:"दुलही",groomValue:"दुलहा",detail:"परम्परागत आधार",exception:"परम्परागत अपवाद / परिहार",source:"प्रयोग गरिएको ग्रन्थीय तालिका",caveat:"यो परम्परागत ज्योतिषीय गणना हो, वैज्ञानिक रूपमा प्रमाणित अनुकूलता परीक्षण होइन। १८ गुणलाई धेरै परिवारले परम्परागत न्यूनतम मान्छन्, तर यसलाई निश्चित पास/फेल वा विवाह सफलताको ग्यारेन्टी नमान्नुहोस्।",basis:"तालिका स्रोत र गणना विधि",sourceNote:"वश्य र योनि तालिकामा ग्रन्थ/संस्करणअनुसार फरक हुन सक्छ। यो उपकरणले माथि उल्लेख गरिएको Muhurta Chintamani convention प्रयोग गर्छ र कूटगत कच्चा अंकलाई छुट्टै देखाउँछ।",error:"गणना गर्न सकिएन"},
 hi:{title:"पारंपरिक ३६ गुण मिलान",desc:"वधू और वर की चंद्र राशि तथा जन्म नक्षत्र के आधार पर अष्टकूट मिलान करें।",bride:"वधू का जन्म विवरण",groom:"वर का जन्म विवरण",name:"नाम (वैकल्पिक)",date:"जन्म तिथि",system:"तिथि प्रणाली",time:"स्थानीय जन्म समय",place:"जन्म स्थान",calculate:"३६ गुण मिलान करें",total:"कुल गुण",of:"में से",koota:"कूट",score:"प्राप्त अंक",brideValue:"वधू",groomValue:"वर",detail:"पारंपरिक आधार",exception:"पारंपरिक अपवाद / परिहार",source:"उपयोग की गई शास्त्रीय तालिका",caveat:"यह पारंपरिक ज्योतिषीय गणना है, वैज्ञानिक रूप से प्रमाणित अनुकूलता परीक्षण नहीं। १८ गुण को कई परिवार पारंपरिक न्यूनतम मानते हैं, लेकिन इसे निश्चित पास/फेल या विवाह की सफलता की गारंटी न मानें।",basis:"तालिका स्रोत और गणना पद्धति",sourceNote:"वश्य और योनि तालिकाएँ ग्रंथ/संस्करण के अनुसार अलग हो सकती हैं। यह उपकरण ऊपर बताए गए Muhurta Chintamani convention का उपयोग करता है और प्रत्येक कूट का मूल अंक अलग दिखाता है।",error:"गणना नहीं हो सकी"},
 en:{title:"Traditional 36-Guna Matching",desc:"Compare the bride's and groom's Moon signs and birth nakshatras using the Ashtakoota method.",bride:"Bride's birth details",groom:"Groom's birth details",name:"Name (optional)",date:"Birth date",system:"Date system",time:"Local birth time",place:"Birthplace",calculate:"Calculate 36-guna match",total:"Total score",of:"out of",koota:"Koota",score:"Score",brideValue:"Bride",groomValue:"Groom",detail:"Traditional basis",exception:"Traditional exceptions / Parihara",source:"Classical table convention",caveat:"This is a traditional astrological calculation, not a scientifically validated compatibility test. Many families use 18 as a conventional minimum, but it is not a pass/fail verdict or a guarantee of marital success.",basis:"Table sources and calculation method",sourceNote:"Vashya and Yoni tables vary across texts and editions. This tool follows the named Muhurta Chintamani convention above and reports raw koota scores separately.",error:"Could not calculate"}
};
export default function GunaMilanTool(){
 const [language,setLanguage]=useState<Language>("ne");
 const [bride,setBride]=useState<PersonForm>(initial(""));
 const [groom,setGroom]=useState<PersonForm>(initial(""));
 const [result,setResult]=useState<GunaMilanResult|null>(null);
 const [error,setError]=useState("");
 const t=copy[language];
 const update=(who:"bride"|"groom",key:keyof PersonForm,value:string)=>{
  const setter=who==="bride"?setBride:setGroom;
  setter(old=>({...old,[key]:value}));
 };
 const fieldClass="mt-1 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100";
 const person=(who:"bride"|"groom",data:PersonForm)=> <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
  <h3 className="mb-4 text-lg font-bold text-slate-900">{who==="bride"?t.bride:t.groom}</h3>
  <div className="grid gap-3 sm:grid-cols-2">
   <label className="text-sm font-semibold text-slate-700 sm:col-span-2">{t.name}<input className={fieldClass} value={data.name} onChange={e=>update(who,"name",e.target.value)} placeholder=""/></label>
   <label className="text-sm font-semibold text-slate-700">{t.system}<select className={fieldClass} value={data.dateSystem} onChange={e=>update(who,"dateSystem",e.target.value)}><option value="AD">Gregorian (AD)</option><option value="BS">Bikram Sambat (BS)</option></select></label>
   <label className="text-sm font-semibold text-slate-700">{t.date}<input type="date" inputMode="numeric" className={fieldClass} value={data.birthDate} onChange={e=>update(who,"birthDate",e.target.value)}/><span className="mt-1 block text-xs font-normal text-slate-500">{data.dateSystem==="BS"?"Enter BS date in YYYY-MM-DD format.":"Enter Gregorian date."}</span></label>
   <label className="text-sm font-semibold text-slate-700">{t.time}<input type="time" className={fieldClass} value={data.birthTime} onChange={e=>update(who,"birthTime",e.target.value)}/></label>
   <label className="text-sm font-semibold text-slate-700">{t.place}<select className={fieldClass} value={data.placeId} onChange={e=>update(who,"placeId",e.target.value)}>{KUNDALI_PLACES.map(p=><option key={p.id} value={p.id}>{p.name} — {p.en}</option>)}</select></label>
  </div>
 </section>;
 const calculate=()=>{
  setError("");setResult(null);
  try{
   const make=(p:PersonForm):KundaliInput=>({name:p.name,dateSystem:p.dateSystem,birthDate:p.birthDate,birthTime:p.birthTime,placeId:p.placeId});
   const b=calculateJanmaKundali(make(bride));
   const g=calculateJanmaKundali(make(groom));
   setResult(calculateAshtakoota(b,g));
  }catch(e){setError(e instanceof Error?e.message:t.error);}
 };
 const fmt=(n:number)=>new Intl.NumberFormat(language==="ne"?"ne-NP":language==="hi"?"hi-IN":"en-IN",{maximumFractionDigits:1}).format(n);
 const total=result?.total??0;
 return <div className="space-y-5">
  <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black text-slate-950">{t.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{t.desc}</p></div><div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1" aria-label="Language"><button type="button" onClick={()=>setLanguage("ne")} aria-pressed={language==="ne"} className={"rounded-lg px-3 py-2 text-xs font-bold "+(language==="ne"?"bg-teal-700 text-white":"text-slate-700")}>नेपाली</button><button type="button" onClick={()=>setLanguage("hi")} aria-pressed={language==="hi"} className={"rounded-lg px-3 py-2 text-xs font-bold "+(language==="hi"?"bg-teal-700 text-white":"text-slate-700")}>हिन्दी</button><button type="button" onClick={()=>setLanguage("en")} aria-pressed={language==="en"} className={"rounded-lg px-3 py-2 text-xs font-bold "+(language==="en"?"bg-teal-700 text-white":"text-slate-700")}>English</button></div></div>
  <div className="grid gap-4 md:grid-cols-2">{person("bride",bride)}{person("groom",groom)}</div>
  <button type="button" onClick={calculate} className="w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">{t.calculate}</button>
  {error&&<p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{t.error}: {error}</p>}
  {result&&<div id="guna-milan-result" className="space-y-5 rounded-2xl border border-teal-200 bg-white p-4 sm:p-6">
   <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-sm font-semibold text-slate-500">{t.total}</p><p className="mt-1 text-4xl font-black tabular-nums text-teal-800">{fmt(total)} <span className="text-base font-semibold text-slate-500">{t.of} 36</span></p></div><div className="rounded-xl bg-slate-50 p-3 text-sm"><p><b>{t.brideValue}:</b> {result.bride.moonSign} · {result.bride.janmaNakshatra} ({result.bride.janmaPada})</p><p className="mt-1"><b>{t.groomValue}:</b> {result.groom.moonSign} · {result.groom.janmaNakshatra} ({result.groom.janmaPada})</p></div></div>
   <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="px-3 py-3">{t.koota}</th><th className="px-3 py-3">{t.brideValue}</th><th className="px-3 py-3">{t.groomValue}</th><th className="px-3 py-3">{t.detail}</th><th className="px-3 py-3 text-right">{t.score}</th></tr></thead><tbody>{result.scores.map(s=><tr key={s.key} className="border-t border-slate-100"><th className="px-3 py-3 font-semibold text-slate-900">{s[language]} <span className="font-normal text-slate-500">({s.max})</span></th><td className="px-3 py-3">{s.brideValue}</td><td className="px-3 py-3">{s.groomValue}</td><td className="px-3 py-3 text-slate-600">{s.note}</td><td className="px-3 py-3 text-right font-bold tabular-nums">{fmt(s.score)} / {s.max}</td></tr>)}</tbody><tfoot className="border-t-2 border-slate-200 bg-slate-50"><tr><th className="px-3 py-3" colSpan={4}>{t.total}</th><th className="px-3 py-3 text-right tabular-nums">{fmt(total)} / 36</th></tr></tfoot></table></div>
   {result.exceptions.length>0&&<section className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 className="font-bold text-amber-950">{t.exception}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-900">{result.exceptions.map((x,i)=><li key={i}>{x}</li>)}</ul></section>}
   <p className="text-xs leading-5 text-slate-600">{t.caveat}</p>
   <button type="button" onClick={()=>window.print()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Print / Save PDF</button>
  </div>}
  <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600"><h3 className="font-bold text-slate-800">{t.basis}</h3><p className="mt-1">{ASHTAKOOTA_SOURCE}</p><a className="mt-2 inline-block font-semibold text-teal-800 underline" href={ASHTAKOOTA_SOURCE_URL} target="_blank" rel="noreferrer">{t.source}</a><p className="mt-2">{t.sourceNote}</p><p className="mt-2">Moon positions are calculated by PDFora's browser-based Janma Kundali engine (Astronomy Engine with a Lahiri/Chitrapaksha approximation). City-centre coordinates and the approximate ayanamsha can affect boundary cases; use the correct local birth time and birthplace.</p></section>
  <style jsx global>{`@media print { body * { visibility:hidden !important; } #guna-milan-result,#guna-milan-result * { visibility:visible !important; } #guna-milan-result { position:absolute; inset:0; width:100%; padding:10mm; } #guna-milan-result button { display:none !important; } }`}</style>
 </div>;
}
