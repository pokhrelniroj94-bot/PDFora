"use client";

import { useState } from "react";
import { calculateJanmaKundali, KUNDALI_PLACES, type KundaliInput } from "../lib/kundali-calculator";
import { calculateAshtakoota, ASHTAKOOTA_SOURCE, ASHTAKOOTA_SOURCE_URL, type GunaMilanResult } from "../lib/ashtakoota-calculator";

type Language = "ne"|"hi"|"en";
type PersonForm = { name:string; dateSystem:"AD"|"BS"; birthDate:string; birthTime:string; placeId:string };
const initial = (name:string):PersonForm => ({name,dateSystem:"AD",birthDate:"2000-01-01",birthTime:"12:00",placeId:"kathmandu"});
const copy = {
 ne:{title:"परम्परागत ३६ गुण मिलान",desc:"दुलही र दुलहाको चन्द्र राशि तथा जन्म नक्षत्रका आधारमा अष्टकूट मिलान गर्नुहोस्।",bride:"दुलहीको जन्म विवरण",groom:"दुलहाको जन्म विवरण",name:"नाम (ऐच्छिक)",date:"जन्म मिति",system:"मिति प्रणाली",time:"स्थानीय जन्म समय",place:"जन्मस्थान",calculate:"३६ गुण मिलान गर्नुहोस्",total:"कुल गुण",of:"मध्ये",koota:"कूट",score:"प्राप्त अंक",brideValue:"दुलही",groomValue:"दुलहा",detail:"परम्परागत आधार",exception:"परम्परागत अपवाद / परिहार",source:"प्रयोग गरिएको ग्रन्थीय तालिका",caveat:"यो परम्परागत ज्योतिषीय गणना हो, वैज्ञानिक रूपमा प्रमाणित अनुकूलता परीक्षण होइन। १८ गुणलाई धेरै परिवारले परम्परागत न्यूनतम मान्छन्, तर यसलाई निश्चित पास/फेल वा विवाह सफलताको ग्यारेन्टी नमान्नुहोस्।",basis:"तालिका स्रोत र गणना विधि",sourceNote:"वश्य र योनि तालिकामा ग्रन्थ/संस्करणअनुसार फरक हुन सक्छ। यो उपकरणले माथि उल्लेख गरिएको Muhurta Chintamani convention प्रयोग गर्छ र कूटगत कच्चा अंकलाई छुट्टै देखाउँछ। मङ्गल दोष तथा दक्षिण भारतीय राज्जु मिलान यसमा समावेश छैन।",error:"गणना गर्न सकिएन"},
 hi:{title:"पारंपरिक ३६ गुण मिलान",desc:"वधू और वर की चंद्र राशि तथा जन्म नक्षत्र के आधार पर अष्टकूट मिलान करें।",bride:"वधू का जन्म विवरण",groom:"वर का जन्म विवरण",name:"नाम (वैकल्पिक)",date:"जन्म तिथि",system:"तिथि प्रणाली",time:"स्थानीय जन्म समय",place:"जन्म स्थान",calculate:"३६ गुण मिलान करें",total:"कुल गुण",of:"में से",koota:"कूट",score:"प्राप्त अंक",brideValue:"वधू",groomValue:"वर",detail:"पारंपरिक आधार",exception:"पारंपरिक अपवाद / परिहार",source:"उपयोग की गई शास्त्रीय तालिका",caveat:"यह पारंपरिक ज्योतिषीय गणना है, वैज्ञानिक रूप से प्रमाणित अनुकूलता परीक्षण नहीं। १८ गुण को कई परिवार पारंपरिक न्यूनतम मानते हैं, लेकिन इसे निश्चित पास/फेल या विवाह की सफलता की गारंटी न मानें।",basis:"तालिका स्रोत और गणना पद्धति",sourceNote:"वश्य और योनि तालिकाएँ ग्रंथ/संस्करण के अनुसार अलग हो सकती हैं। यह उपकरण ऊपर बताए गए Muhurta Chintamani convention का उपयोग करता है और प्रत्येक कूट का मूल अंक अलग दिखाता है। इसमें मंगल दोष और दक्षिण भारतीय रज्जु मिलान शामिल नहीं हैं।",error:"गणना नहीं हो सकी"},
 en:{title:"Traditional 36-Guna Matching",desc:"Compare the bride's and groom's Moon signs and birth nakshatras using the Ashtakoota method.",bride:"Bride's birth details",groom:"Groom's birth details",name:"Name (optional)",date:"Birth date",system:"Date system",time:"Local birth time",place:"Birthplace",calculate:"Calculate 36-guna match",total:"Total score",of:"out of",koota:"Koota",score:"Score",brideValue:"Bride",groomValue:"Groom",detail:"Traditional basis",exception:"Traditional exceptions / Parihara",source:"Classical table convention",caveat:"This is a traditional astrological calculation, not a scientifically validated compatibility test. Many families use 18 as a conventional minimum, but it is not a pass/fail verdict or a guarantee of marital success.",basis:"Table sources and calculation method",sourceNote:"Vashya and Yoni tables vary across texts and editions. This tool follows the named Muhurta Chintamani convention above and reports raw koota scores separately. Mangal Dosha and South Indian Rajju matching are not included.",error:"Could not calculate"}
};
export default function GunaMilanTool(){
 const [language,setLanguage]=useState<Language>("ne");
 const [bride,setBride]=useState<PersonForm>(initial(""));
 const [groom,setGroom]=useState<PersonForm>(initial(""));
 const [result,setResult]=useState<GunaMilanResult|null>(null);
 const [error,setError]=useState("");

 const t=copy[language];
 const terms:Record<string,{ne:string;hi:string}>={
  Brahmin:{ne:"ब्राह्मण",hi:"ब्राह्मण"},Kshatriya:{ne:"क्षत्रिय",hi:"क्षत्रिय"},Vaishya:{ne:"वैश्य",hi:"वैश्य"},Shudra:{ne:"शूद्र",hi:"शूद्र"},
  Dvipada:{ne:"द्विपद",hi:"द्विपद"},Chatushpada:{ne:"चतुष्पद",hi:"चतुष्पद"},Jalachara:{ne:"जलचर",hi:"जलचर"},Keeta:{ne:"कीट",hi:"कीट"},
  Deva:{ne:"देव",hi:"देव"},Manushya:{ne:"मनुष्य",hi:"मनुष्य"},Rakshasa:{ne:"राक्षस",hi:"राक्षस"},
  Adi:{ne:"आदि",hi:"आदि"},Madhya:{ne:"मध्य",hi:"मध्य"},Antya:{ne:"अन्त्य",hi:"अंत्य"},
  Horse:{ne:"घोडा",hi:"घोड़ा"},Elephant:{ne:"हात्ती",hi:"हाथी"},Sheep:{ne:"भेडा",hi:"भेड़"},Serpent:{ne:"सर्प",hi:"सर्प"},Dog:{ne:"कुकुर",hi:"कुत्ता"},Cat:{ne:"बिरालो",hi:"बिल्ली"},Rat:{ne:"मुसा",hi:"चूहा"},Cow:{ne:"गाई",hi:"गाय"},Buffalo:{ne:"भैंसी",hi:"भैंस"},Tiger:{ne:"बाघ",hi:"बाघ"},Deer:{ne:"मृग",hi:"हिरण"},Monkey:{ne:"बाँदर",hi:"बंदर"},Mongoose:{ne:"न्याउरी मुसा",hi:"नेवला"},Lion:{ne:"सिंह",hi:"सिंह"},
  Aries:{ne:"मेष",hi:"मेष"},Taurus:{ne:"वृष",hi:"वृषभ"},Gemini:{ne:"मिथुन",hi:"मिथुन"},Cancer:{ne:"कर्कट",hi:"कर्क"},Leo:{ne:"सिंह",hi:"सिंह"},Virgo:{ne:"कन्या",hi:"कन्या"},Libra:{ne:"तुला",hi:"तुला"},Scorpio:{ne:"वृश्चिक",hi:"वृश्चिक"},Sagittarius:{ne:"धनु",hi:"धनु"},Capricorn:{ne:"मकर",hi:"मकर"},Aquarius:{ne:"कुम्भ",hi:"कुंभ"},Pisces:{ne:"मीन",hi:"मीन"},
  Sun:{ne:"सूर्य",hi:"सूर्य"},Moon:{ne:"चन्द्र",hi:"चंद्र"},Mars:{ne:"मङ्गल",hi:"मंगल"},Mercury:{ne:"बुध",hi:"बुध"},Jupiter:{ne:"बृहस्पति",hi:"बृहस्पति"},Venus:{ne:"शुक्र",hi:"शुक्र"},Saturn:{ne:"शनि",hi:"शनि"},
 };
 const signs:Record<string,{en:string;hi:string}>={"मेष":{en:"Aries",hi:"मेष"},"वृष":{en:"Taurus",hi:"वृषभ"},"मिथुन":{en:"Gemini",hi:"मिथुन"},"कर्कट":{en:"Cancer",hi:"कर्क"},"सिंह":{en:"Leo",hi:"सिंह"},"कन्या":{en:"Virgo",hi:"कन्या"},"तुला":{en:"Libra",hi:"तुला"},"वृश्चिक":{en:"Scorpio",hi:"वृश्चिक"},"धनु":{en:"Sagittarius",hi:"धनु"},"मकर":{en:"Capricorn",hi:"मकर"},"कुम्भ":{en:"Aquarius",hi:"कुंभ"},"मीन":{en:"Pisces",hi:"मीन"}};
 const nakshatras:Record<string,{en:string;hi:string}>={"अश्विनी":{en:"Ashwini",hi:"अश्विनी"},"भरणी":{en:"Bharani",hi:"भरणी"},"कृत्तिका":{en:"Krittika",hi:"कृत्तिका"},"रोहिणी":{en:"Rohini",hi:"रोहिणी"},"मृगशिरा":{en:"Mrigashira",hi:"मृगशिरा"},"आर्द्रा":{en:"Ardra",hi:"आर्द्रा"},"पुनर्वसु":{en:"Punarvasu",hi:"पुनर्वसु"},"पुष्य":{en:"Pushya",hi:"पुष्य"},"आश्लेषा":{en:"Ashlesha",hi:"आश्लेषा"},"मघा":{en:"Magha",hi:"मघा"},"पूर्वाफाल्गुनी":{en:"Purva Phalguni",hi:"पूर्वाफाल्गुनी"},"उत्तराफाल्गुनी":{en:"Uttara Phalguni",hi:"उत्तराफाल्गुनी"},"हस्त":{en:"Hasta",hi:"हस्त"},"चित्रा":{en:"Chitra",hi:"चित्रा"},"स्वाती":{en:"Swati",hi:"स्वाती"},"विशाखा":{en:"Vishakha",hi:"विशाखा"},"अनुराधा":{en:"Anuradha",hi:"अनुराधा"},"ज्येष्ठा":{en:"Jyeshtha",hi:"ज्येष्ठा"},"मूल":{en:"Mula",hi:"मूल"},"पूर्वाषाढा":{en:"Purva Ashadha",hi:"पूर्वाषाढ़ा"},"उत्तराषाढा":{en:"Uttara Ashadha",hi:"उत्तराषाढ़ा"},"श्रवण":{en:"Shravana",hi:"श्रवण"},"धनिष्ठा":{en:"Dhanishta",hi:"धनिष्ठा"},"शतभिषा":{en:"Shatabhisha",hi:"शतभिषा"},"पूर्वाभाद्रपदा":{en:"Purva Bhadrapada",hi:"पूर्वाभाद्रपद"},"उत्तराभाद्रपदा":{en:"Uttara Bhadrapada",hi:"उत्तराभाद्रपद"},"रेवती":{en:"Revati",hi:"रेवती"}};
 const localValue=(value:string)=>language==="en"?value:(terms[value]?.[language]??value);
 const localSign=(value:string)=>language==="ne"?value:(signs[value]?.[language]??value);
 const localNak=(value:string)=>language==="ne"?value:(nakshatras[value]?.[language]??value);
 const noteText=(key:string)=>{
  const n:Record<string,{ne:string;hi:string;en:string}>={
   varna:{ne:"चन्द्र राशिको वर्ण; दुलहाको वर्ण दुलहीको बराबर वा उच्च भए १ अंक।",hi:"चंद्र राशि का वर्ण; वर का वर्ण वधू के समान या उच्च होने पर १ अंक।",en:"Moon-sign Varna; 1 point when the groom's class is equal to or higher than the bride's."},
   vashya:{ne:"मুহूर्त चिन्तामणिको चार-वर्गीय वश्य तालिका।",hi:"मुहूर्त चिंतामणि की चार-वर्गीय वश्य तालिका।",en:"Four-class Vashya matrix from the cited Muhurta Chintamani convention."},
   tara:{ne:"दुवै दिशाबाट नक्षत्र गन्ती; विपत् (३), प्रत्यक् (५) र नैधन (७) अशुभ मानिन्छन्।",hi:"दोनों दिशाओं में नक्षत्र गणना; विपत् (३), प्रत्यक् (५) और नैधन (७) अशुभ माने जाते हैं।",en:"Count both directions; Vipat (3), Pratyak (5) and Naidhana (7) are unfavourable."},
   yoni:{ne:"सुधारिएको मुहूर्त चिन्तामणि १४×१४ योनि तालिका; अन्य संस्करणमा भिन्नता हुन सक्छ।",hi:"संशोधित मुहूर्त चिंतामणि १४×१४ योनि तालिका; अन्य संस्करणों में अंतर हो सकता है।",en:"Corrected Muhurta Chintamani 14×14 Yoni matrix; other editions may differ."},
   grahaMaitri:{ne:"दुवै चन्द्र राशिका स्वामी ग्रहबीचको नैसर्गिक मित्रता।",hi:"दोनों चंद्र राशियों के स्वामी ग्रहों की प्राकृतिक मित्रता।",en:"Natural friendship between the two Moon-sign lords."},
   gana:{ne:"दुलहीको पङ्क्ति र दुलहाको स्तम्भ प्रयोग हुन्छ; तालिका उल्ट्याउनु हुँदैन।",hi:"वधू की पंक्ति और वर का स्तंभ लिया जाता है; तालिका को उलटना नहीं चाहिए।",en:"Bride row and groom column; this directional table must not be transposed."},
   bhakoot:{ne:"२/१२, ५/९ वा ६/८ राशि सम्बन्ध जाँचिन्छ; परिहार भए छुट्टै देखाइन्छ।",hi:"२/१२, ५/९ या ६/८ राशि संबंध जाँचा जाता है; परिहार अलग दिखाया जाता है।",en:"Checks 2/12, 5/9 or 6/8 sign relationships; parihara is reported separately."},
   nadi:{ne:"दुवै जन्म नक्षत्रको नाडी समान भए नाडी दोष मानिन्छ; परिहार छुट्टै देखाइन्छ।",hi:"दोनों जन्म नक्षत्रों की नाड़ी समान होने पर नाड़ी दोष माना जाता है; परिहार अलग दिखाया जाता है।",en:"Same birth-star Nadi is flagged; parihara is reported separately."}
  };
  return n[key]?.[language]??"";
 };
 const localException=(value:string)=>{
  if(language==="en") return value;
  if(value.startsWith("Bhakoot parihara:")) return language==="ne"?"भकूट परिहार: दुवै चन्द्र राशिका स्वामी समान वा परस्पर मित्र छन्। कच्चा अंक परिवर्तन गरिएको छैन।":"भकूट परिहार: दोनों चंद्र राशि के स्वामी समान या परस्पर मित्र हैं। मूल अंक नहीं बदला गया है।";
  if(value.startsWith("Gana parihara:")) return language==="ne"?"गण परिहार: राशि र नवांशका स्वामी ग्रह परस्पर मित्र छन्। कच्चा अंक परिवर्तन गरिएको छैन।":"गण परिहार: राशि और नवांश के स्वामी ग्रह परस्पर मित्र हैं। मूल अंक नहीं बदला गया है।";
  if(value.startsWith("Nadi parihara:")) return language==="ne"?"नाडी परिहार: एउटै राशि तर फरक नक्षत्र, वा एउटै नक्षत्र तर फरक राशि छ। कच्चा अंक परिवर्तन गरिएको छैन।":"नाड़ी परिहार: राशि समान पर नक्षत्र अलग, या नक्षत्र समान पर राशि अलग है। मूल अंक नहीं बदला गया है।";
  return language==="ne"?"एउटै राशि र नक्षत्र तर फरक पादको परम्परागत अवस्था।":"समान राशि और नक्षत्र लेकिन अलग पाद की पारंपरिक स्थिति।";
 };

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
   <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-sm font-semibold text-slate-500">{t.total}</p><p className="mt-1 text-4xl font-black tabular-nums text-teal-800">{fmt(total)} <span className="text-base font-semibold text-slate-500">{t.of} 36</span></p></div><div className="rounded-xl bg-slate-50 p-3 text-sm"><p><b>{t.brideValue}:</b> {localSign(result.bride.moonSign)} · {localNak(result.bride.janmaNakshatra)} ({result.bride.janmaPada})</p><p className="mt-1"><b>{t.groomValue}:</b> {localSign(result.groom.moonSign)} · {localNak(result.groom.janmaNakshatra)} ({result.groom.janmaPada})</p></div></div>
   <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="px-3 py-3">{t.koota}</th><th className="px-3 py-3">{t.brideValue}</th><th className="px-3 py-3">{t.groomValue}</th><th className="px-3 py-3">{t.detail}</th><th className="px-3 py-3 text-right">{t.score}</th></tr></thead><tbody>{result.scores.map(s=><tr key={s.key} className="border-t border-slate-100"><th className="px-3 py-3 font-semibold text-slate-900">{s[language]} <span className="font-normal text-slate-500">({s.max})</span></th><td className="px-3 py-3">{localValue(s.brideValue)}</td><td className="px-3 py-3">{localValue(s.groomValue)}</td><td className="px-3 py-3 text-slate-600">{noteText(s.key)}</td><td className="px-3 py-3 text-right font-bold tabular-nums">{fmt(s.score)} / {s.max}</td></tr>)}</tbody><tfoot className="border-t-2 border-slate-200 bg-slate-50"><tr><th className="px-3 py-3" colSpan={4}>{t.total}</th><th className="px-3 py-3 text-right tabular-nums">{fmt(total)} / 36</th></tr></tfoot></table></div>
   {result.exceptions.length>0&&<section className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 className="font-bold text-amber-950">{t.exception}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-900">{result.exceptions.map((x,i)=><li key={i}>{localException(x)}</li>)}</ul></section>}
   <p className="text-xs leading-5 text-slate-600">{t.caveat}</p>
   <button type="button" onClick={()=>window.print()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Print / Save PDF</button>
  </div>}
  <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600"><h3 className="font-bold text-slate-800">{t.basis}</h3><p className="mt-1">{ASHTAKOOTA_SOURCE}</p><a className="mt-2 inline-block font-semibold text-teal-800 underline" href={ASHTAKOOTA_SOURCE_URL} target="_blank" rel="noreferrer">{t.source}</a><p className="mt-2">{t.sourceNote}</p><p className="mt-2">Moon positions are calculated by PDFora's browser-based Janma Kundali engine (Astronomy Engine with a Lahiri/Chitrapaksha approximation). City-centre coordinates and the approximate ayanamsha can affect boundary cases; use the correct local birth time and birthplace.</p></section>
  <style jsx global>{`@media print { body * { visibility:hidden !important; } #guna-milan-result,#guna-milan-result * { visibility:visible !important; } #guna-milan-result { position:absolute; inset:0; width:100%; padding:10mm; } #guna-milan-result button { display:none !important; } }`}</style>
 </div>;
}
