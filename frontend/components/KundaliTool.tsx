"use client";

import { useState } from "react";
import { calculateJanmaKundali, KUNDALI_PLACES, type KundaliResult } from "../lib/kundali-calculator";

const box = "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const n = (value:number, digits=2) => new Intl.NumberFormat("ne-NP",{maximumFractionDigits:digits}).format(value);
const ASTRO_NAMES: Record<string, { en: string; hi: string }> = {
  "सूर्य":{en:"Sun",hi:"सूर्य"},"चन्द्र":{en:"Moon",hi:"चंद्र"},"मङ्गल":{en:"Mars",hi:"मंगल"},"बुध":{en:"Mercury",hi:"बुध"},"बृहस्पति":{en:"Jupiter",hi:"बृहस्पति"},"शुक्र":{en:"Venus",hi:"शुक्र"},"शनि":{en:"Saturn",hi:"शनि"},"राहु":{en:"Rahu",hi:"राहु"},"केतु":{en:"Ketu",hi:"केतु"},
  "मेष":{en:"Aries",hi:"मेष"},"वृष":{en:"Taurus",hi:"वृषभ"},"मिथुन":{en:"Gemini",hi:"मिथुन"},"कर्कट":{en:"Cancer",hi:"कर्क"},"सिंह":{en:"Leo",hi:"सिंह"},"कन्या":{en:"Virgo",hi:"कन्या"},"तुला":{en:"Libra",hi:"तुला"},"वृश्चिक":{en:"Scorpio",hi:"वृश्चिक"},"धनु":{en:"Sagittarius",hi:"धनु"},"मकर":{en:"Capricorn",hi:"मकर"},"कुम्भ":{en:"Aquarius",hi:"कुंभ"},"मीन":{en:"Pisces",hi:"मीन"},
  "अश्विनी":{en:"Ashwini",hi:"अश्विनी"},"भरणी":{en:"Bharani",hi:"भरणी"},"कृत्तिका":{en:"Krittika",hi:"कृत्तिका"},"रोहिणी":{en:"Rohini",hi:"रोहिणी"},"मृगशिरा":{en:"Mrigashira",hi:"मृगशिरा"},"आर्द्रा":{en:"Ardra",hi:"आर्द्रा"},"पुनर्वसु":{en:"Punarvasu",hi:"पुनर्वसु"},"पुष्य":{en:"Pushya",hi:"पुष्य"},"आश्लेषा":{en:"Ashlesha",hi:"आश्लेषा"},"मघा":{en:"Magha",hi:"मघा"},"पूर्वाफाल्गुनी":{en:"Purva Phalguni",hi:"पूर्वाफाल्गुनी"},"उत्तराफाल्गुनी":{en:"Uttara Phalguni",hi:"उत्तराफाल्गुनी"},"हस्त":{en:"Hasta",hi:"हस्त"},"चित्रा":{en:"Chitra",hi:"चित्रा"},"स्वाती":{en:"Swati",hi:"स्वाती"},"विशाखा":{en:"Vishakha",hi:"विशाखा"},"अनुराधा":{en:"Anuradha",hi:"अनुराधा"},"ज्येष्ठा":{en:"Jyeshtha",hi:"ज्येष्ठा"},"मूल":{en:"Mula",hi:"मूल"},"पूर्वाषाढा":{en:"Purva Ashadha",hi:"पूर्वाषाढ़ा"},"उत्तराषाढा":{en:"Uttara Ashadha",hi:"उत्तराषाढ़ा"},"श्रवण":{en:"Shravana",hi:"श्रवण"},"धनिष्ठा":{en:"Dhanishta",hi:"धनिष्ठा"},"शतभिषा":{en:"Shatabhisha",hi:"शतभिषा"},"पूर्वाभाद्रपदा":{en:"Purva Bhadrapada",hi:"पूर्वाभाद्रपद"},"उत्तराभाद्रपदा":{en:"Uttara Bhadrapada",hi:"उत्तराभाद्रपद"},"रेवती":{en:"Revati",hi:"रेवती"},
  "सू":{en:"Su",hi:"सू"},"च":{en:"Mo",hi:"चं"},"मं":{en:"Ma",hi:"मं"},"बु":{en:"Me",hi:"बु"},"गु":{en:"Ju",hi:"गु"},"शु":{en:"Ve",hi:"शु"},"श":{en:"Sa",hi:"श"},"रा":{en:"Ra",hi:"रा"},"के":{en:"Ke",hi:"के"}
};

export default function KundaliTool() {
  const [name,setName]=useState("");
  const [language,setLanguage]=useState<"ne"|"en"|"hi">("ne");
  const tr=(ne:string,en:string,hi:string)=>language==="ne"?ne:language==="hi"?hi:en;
  const astro=(value:string)=>language==="ne"?value:(ASTRO_NAMES[value]?.[language]??value);
  const [dateSystem,setDateSystem]=useState<"BS"|"AD">("BS");
  const [birthDate,setBirthDate]=useState("२०५८-०१-०१");
  const [birthTime,setBirthTime]=useState("");
  const [placeId,setPlaceId]=useState("kathmandu");
  const [placeName,setPlaceName]=useState("");
  const [latitude,setLatitude]=useState("");
  const [longitude,setLongitude]=useState("");
  const [timeZone,setTimeZone]=useState("Asia/Kathmandu");
  const [result,setResult]=useState<KundaliResult|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  const submit=()=>{
    setError("");setResult(null);setBusy(true);
    try{
      if(!birthTime) throw new Error("कृपया जन्मको सही समय राख्नुहोस्। लग्न र भावका लागि जन्मसमय आवश्यक हुन्छ।");
      if(placeId==="custom"&&(!latitude.trim()||!longitude.trim())) throw new Error("अन्य स्थान छान्दा वास्तविक अक्षांश र देशान्तर दुवै राख्नुहोस्। खाली मानलाई शून्य मानेर गलत कुण्डली बनाइँदैन।");
      const calculated=calculateJanmaKundali({name,dateSystem,birthDate:birthDate.replace(/[०-९]/g,d=>String("०१२३४५६७८९".indexOf(d))),birthTime,placeId,placeName,latitude:Number(latitude),longitude:Number(longitude),timeZone});
      setResult(calculated);
    }catch(e){setError(e instanceof Error?e.message:"कुण्डली गणना गर्न सकिएन। विवरण जाँच्नुहोस्।");}
    finally{setBusy(false);}
  };

  return <div className="space-y-6">
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-bold">{tr("जन्मकुण्डली तयार गर्नुहोस्","Create your birth chart","अपनी जन्म कुंडली बनाएं")}</p><label className="text-xs font-semibold">{tr("भाषा","Language","भाषा")}<select className="ml-2 rounded-lg border border-teal-300 bg-white px-2 py-1 text-slate-900" value={language} onChange={e=>setLanguage(e.target.value as "ne"|"en"|"hi")}><option value="ne">नेपाली</option><option value="en">English</option><option value="hi">हिन्दी</option></select></label></div>
      <p className="mt-1">{tr("जन्ममिति, स्थानीय जन्मसमय र जन्मस्थान राखेर लग्न, राशि, ग्रह, नक्षत्र र विम्शोत्तरी महादशा हेर्नुहोस्।","Enter your birth date, local birth time and birthplace to calculate Lagna, Rashi, planetary positions, Nakshatra and Vimshottari Mahadasha.","जन्म तिथि, स्थानीय जन्म समय और जन्म स्थान भरकर लग्न, राशि, ग्रह स्थिति, नक्षत्र और विंशोत्तरी महादशा देखें।")}</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold text-slate-800">{tr("नाम (ऐच्छिक)","Name (optional)","नाम (वैकल्पिक)")}
        <input className={box} value={name} onChange={e=>setName(e.target.value)} placeholder="पूरा नाम"/>
      </label>
      <label className="text-sm font-semibold text-slate-800">{tr("मिति प्रणाली","Date system","तिथि प्रणाली")}
        <select className={box} value={dateSystem} onChange={e=>{setDateSystem(e.target.value as "BS"|"AD");setBirthDate(e.target.value==="BS"?"२०५८-०१-०१":"2001-04-14");}}>
          <option value="BS">विक्रम संवत् (वि.सं.)</option><option value="AD">Gregorian (AD)</option>
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-800">{tr("जन्ममिति","Birth date","जन्म तिथि")} ({dateSystem==="BS"?"वि.सं. YYYY-MM-DD":"AD YYYY-MM-DD"})
        <input className={box} value={birthDate} onChange={e=>setBirthDate(e.target.value)} placeholder={dateSystem==="BS"?"२०५८-०१-०१":"2001-04-14"} inputMode="numeric"/>
      </label>
      <label className="text-sm font-semibold text-slate-800">{tr("जन्मसमय (स्थानीय समय)","Birth time (local)","जन्म समय (स्थानीय)")}
        <input className={box} type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)}/>
        <span className="mt-1 block text-xs font-normal text-slate-500">२४-घण्टा ढाँचा, जस्तै ०६:३५ वा १८:२०</span>
      </label>
      <label className="text-sm font-semibold text-slate-800 sm:col-span-2">{tr("जन्मस्थान","Birthplace","जन्म स्थान")}
        <select className={box} value={placeId} onChange={e=>{setPlaceId(e.target.value);const selected=KUNDALI_PLACES.find(p=>p.id===e.target.value);if(selected?.timeZone)setTimeZone(selected.timeZone);if(e.target.value==="delhi"||e.target.value==="mumbai"||e.target.value==="kolkata"||e.target.value==="chennai"||e.target.value==="bengaluru"||e.target.value==="hyderabad"||e.target.value==="jaipur"||e.target.value==="varanasi"||e.target.value==="lucknow"||e.target.value==="ahmedabad"||e.target.value==="pune"||e.target.value==="bhopal"){setDateSystem("AD");setBirthDate("2001-04-14");}else if(e.target.value!=="custom"){setDateSystem("BS");setBirthDate("२०५८-०१-०१");}}}>
          {KUNDALI_PLACES.map(place=><option key={place.id} value={place.id}>{place.name} ({place.en})</option>)}
          <option value="custom">अन्य स्थान — ठ्याक्कै निर्देशाङ्क राख्नुहोस्</option>
        </select>
        {placeId==="custom"&&<div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-semibold">{tr("स्थानको नाम","Place name","स्थान का नाम")}<input className={box} value={placeName} onChange={e=>setPlaceName(e.target.value)} placeholder="जस्तै: फिक्कल, इलाम"/></label>
          <label className="text-xs font-semibold">{tr("अक्षांश (Latitude)","Latitude","अक्षांश (Latitude)")}<input className={box} type="number" min="-90" max="90" step="0.000001" value={latitude} onChange={e=>setLatitude(e.target.value)}/></label>
          <label className="text-xs font-semibold">{tr("देशान्तर (Longitude)","Longitude","देशांतर (Longitude)")}<input className={box} type="number" min="-180" max="180" step="0.000001" value={longitude} onChange={e=>setLongitude(e.target.value)}/></label>
          <label className="text-xs font-semibold sm:col-span-3">{tr("समय क्षेत्र (IANA time zone)","Time zone (IANA)","समय क्षेत्र (IANA)")}<input className={box} value={timeZone} onChange={e=>setTimeZone(e.target.value)} placeholder="Asia/Kolkata"/></label>
        </div>}
        <span className="mt-1 block text-xs font-normal text-slate-500">सहरका विकल्पमा सहर-केन्द्रका निर्देशाङ्क प्रयोग हुन्छन्। बढी शुद्ध लग्नका लागि जन्मस्थलको वास्तविक latitude/longitude राख्न सक्नुहुन्छ। नेपालका सहरमा Asia/Kathmandu र भारतका सहरमा Asia/Kolkata स्वतः प्रयोग हुन्छ। अन्य देशका लागि निर्देशाङ्कसँगै सही IANA time zone राख्नुहोस्।</span>
      </label>
    </div>

    <button type="button" onClick={submit} disabled={busy} className="w-full rounded-xl bg-teal-700 px-5 py-3 font-bold text-white shadow-sm hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60">{busy?tr("गणना हुँदैछ…","Calculating…","गणना हो रही है…"):tr("मेरो जन्मकुण्डली बनाउनुहोस्","Generate my Kundali","मेरी कुंडली बनाएं")}</button>
    {error&&<p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

    {result&&<div className="space-y-6" id="kundali-result">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div><p className="text-xs font-bold uppercase tracking-wide text-teal-700">{tr("जन्मकुण्डली रिपोर्ट","Birth chart report","जन्म कुंडली रिपोर्ट")}</p><h2 className="mt-1 text-2xl font-black text-slate-950">{result.name||"जन्मकुण्डली"}</h2><p className="mt-1 text-sm text-slate-600">{result.birthDateBS} BS · {result.birthDateAD} AD · {result.birthTime} · {result.place}</p></div>
        <button type="button" onClick={()=>window.print()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">{tr("प्रिन्ट / PDF","Print / PDF","प्रिंट / PDF")}</button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[[tr("लग्न","Ascendant","लग्न"),astro(result.lagna)],[tr("चन्द्र राशि","Moon sign","चंद्र राशि"),astro(result.moonSign)],[tr("जन्म नक्षत्र","Birth Nakshatra","जन्म नक्षत्र"),astro(result.janmaNakshatra)],[tr("नक्षत्र पाद","Pada","पाद"),n(result.janmaPada,0)]].map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-black text-slate-900">{value}</p></div>)}
      </div>
      <section>
        <h3 className="mb-3 text-lg font-bold text-slate-900">{tr("राशि कुण्डली (D1)","Rashi chart (D1)","राशि कुंडली (D1)")}</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {result.houses.map(house=><div key={house.house} className="min-h-24 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
            <p className="text-xs text-slate-500">{n(house.house,0)} भाव</p><p className="font-bold text-slate-900">{astro(house.sign)}</p><p className="mt-2 text-sm font-semibold text-teal-800">{house.planets.map(astro).join(" · ")||"—"}</p>
          </div>)}
        </div>
        <p className="mt-2 text-xs text-slate-500">भाव गणना: Whole-sign house प्रणाली। ग्रहका छोटा नाम: सू सूर्य, च चन्द्र, मं मङ्गल, बु बुध, गु बृहस्पति, शु शुक्र, श शनि, रा राहु, के केतु।</p>
      </section>
      <section>
        <h3 className="mb-3 text-lg font-bold text-slate-900">{tr("नवग्रहको स्थिति","Planetary positions","नवग्रह स्थिति")}</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600"><tr>{["ग्रह","राशि","अंश","नक्षत्र","पाद","भाव","गति"].map(x=><th key={x} className="px-3 py-3 font-semibold">{x}</th>)}</tr></thead>
            <tbody>{result.planets.map(p=><tr key={p.key} className="border-t border-slate-100"><td className="px-3 py-3 font-semibold">{astro(p.name)}</td><td className="px-3 py-3">{astro(p.sign)}</td><td className="px-3 py-3 tabular-nums">{n(p.degree,0)}° {n(p.minute,0)}′</td><td className="px-3 py-3">{astro(p.nakshatra)}</td><td className="px-3 py-3">{n(p.pada,0)}</td><td className="px-3 py-3">{n(p.house,0)}</td><td className="px-3 py-3">{p.retrograde?tr("वक्री","Retrograde","वक्री"):tr("मार्गी","Direct","मार्गी")}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-lg font-bold text-slate-900">{tr("विम्शोत्तरी महादशा","Vimshottari Mahadasha","विंशोत्तरी महादशा")}</h3>
        <p className="mb-3 text-sm text-slate-600">{tr("हालको महादशा:","Current Mahadasha:","वर्तमान महादशा:")} <strong className="text-teal-800">{astro(result.currentDasha)}</strong></p>
        <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[480px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="px-3 py-3">महादशा स्वामी</th><th className="px-3 py-3">अवधि सुरु</th><th className="px-3 py-3">समाप्ति मिति</th><th className="px-3 py-3">अवधि (वर्ष)</th></tr></thead><tbody>{result.dasha.map((d,i)=><tr key={i} className={"border-t border-slate-100 "+(d.current?"bg-teal-50 font-bold":"")}><td className="px-3 py-3">{astro(d.lord)}{d.current?" · "+tr("हाल","Current","वर्तमान"):""}</td><td className="px-3 py-3">{d.start}</td><td className="px-3 py-3">{d.end}</td><td className="px-3 py-3">{n(d.years,2)}</td></tr>)}</tbody></table></div>
      </section>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
        <p className="font-bold text-slate-800">{tr("गणना विधि र सीमाहरू","Calculation method and limitations","गणना विधि और सीमाएं")}</p>
        <p className="mt-1">ग्रहको भौगोलिक (geocentric) apparent ecliptic longitude Astronomy Engine बाट निकालिन्छ; निरयन राशि/नक्षत्रका लागि Lahiri/Chitrapaksha ayanamsa, लग्नका लागि स्थानीय sidereal time र whole-sign भाव, राहुका लागि mean lunar node र दशाका लागि Vimshottari क्रम प्रयोग हुन्छ। गणना browser मै हुन्छ; जन्म विवरण server मा पठाइँदैन।</p>
        <p className="mt-1">Astronomy Engine ले आफ्नो astronomical model लाई NOVAS सँग तुलना गर्दा करिब ±१ arcminute शुद्धता लक्ष्य राखेको बताउँछ। तर यसले Hamro Patro को आन्तरिक गणना विधि सार्वजनिक रूपमा पुष्टि गर्दैन; त्यसैले दुवैको नतिजा शतप्रतिशत उस्तै हुन्छ भन्ने दाबी गरिएको छैन। जन्मसमय वा स्थानको त्रुटिले लग्न/भाव बदल्न सक्छ।</p>
        <p className="mt-1">यो परम्परागत ज्योतिषीय गणना हो, वैज्ञानिक रूपमा प्रमाणित भविष्यवाणी होइन। विवाह, स्वास्थ्य, वित्त वा जीवनका महत्त्वपूर्ण निर्णय यसैका आधारमा नगर्नुहोस्।</p>
      </div>
    </div>}
    <style jsx global>{`@media print { body * { visibility: hidden !important; } #kundali-result, #kundali-result * { visibility: visible !important; } #kundali-result { position: absolute; inset: 0; width: 100%; padding: 12mm; } #kundali-result button { display:none !important; } }`}</style>
  </div>;
}
