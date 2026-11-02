"use client";

import { useState } from "react";
import { calculateJanmaKundali, KUNDALI_PLACES, type KundaliResult } from "../lib/kundali-calculator";

const box = "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const n = (value:number, digits=2) => new Intl.NumberFormat("ne-NP",{maximumFractionDigits:digits}).format(value);

export default function KundaliTool() {
  const [name,setName]=useState("");
  const [dateSystem,setDateSystem]=useState<"BS"|"AD">("BS");
  const [birthDate,setBirthDate]=useState("२०५८-०१-०१");
  const [birthTime,setBirthTime]=useState("");
  const [placeId,setPlaceId]=useState("kathmandu");
  const [result,setResult]=useState<KundaliResult|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  const submit=()=>{
    setError("");setResult(null);setBusy(true);
    try{
      if(!birthTime) throw new Error("कृपया जन्मको सही समय राख्नुहोस्। लग्न र भावका लागि जन्मसमय आवश्यक हुन्छ।");
      const calculated=calculateJanmaKundali({name,dateSystem,birthDate:birthDate.replace(/[०-९]/g,d=>String("०१२३४५६७८९".indexOf(d))),birthTime,placeId});
      setResult(calculated);
    }catch(e){setError(e instanceof Error?e.message:"कुण्डली गणना गर्न सकिएन। विवरण जाँच्नुहोस्।");}
    finally{setBusy(false);}
  };

  return <div className="space-y-6">
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950">
      <p className="font-bold">नेपाली जन्मकुण्डली तयार गर्नुहोस्</p>
      <p className="mt-1">जन्ममिति, जन्मसमय र जन्मस्थान राखेपछि राशि कुण्डली, लग्न, नवग्रहको स्थिति, नक्षत्र र विम्शोत्तरी महादशा देखिन्छ। जन्मसमय सकेसम्म जन्मदर्ता वा परिवारको अभिलेखअनुसार राख्नुहोस्।</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold text-slate-800">नाम (ऐच्छिक)
        <input className={box} value={name} onChange={e=>setName(e.target.value)} placeholder="पूरा नाम"/>
      </label>
      <label className="text-sm font-semibold text-slate-800">मिति प्रणाली
        <select className={box} value={dateSystem} onChange={e=>{setDateSystem(e.target.value as "BS"|"AD");setBirthDate(e.target.value==="BS"?"२०५८-०१-०१":"2001-04-14");}}>
          <option value="BS">विक्रम संवत् (वि.सं.)</option><option value="AD">ईस्वी संवत् (AD)</option>
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-800">जन्ममिति ({dateSystem==="BS"?"वि.सं. YYYY-MM-DD":"AD YYYY-MM-DD"})
        <input className={box} value={birthDate} onChange={e=>setBirthDate(e.target.value)} placeholder={dateSystem==="BS"?"२०५८-०१-०१":"2001-04-14"} inputMode="numeric"/>
      </label>
      <label className="text-sm font-semibold text-slate-800">जन्मसमय (स्थानीय समय)
        <input className={box} type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)}/>
        <span className="mt-1 block text-xs font-normal text-slate-500">२४-घण्टा ढाँचा, जस्तै ०६:३५ वा १८:२०</span>
      </label>
      <label className="text-sm font-semibold text-slate-800 sm:col-span-2">जन्मस्थान
        <select className={box} value={placeId} onChange={e=>setPlaceId(e.target.value)}>
          {KUNDALI_PLACES.map(place=><option key={place.id} value={place.id}>{place.name} ({place.en})</option>)}
        </select>
        <span className="mt-1 block text-xs font-normal text-slate-500">हाल उपलब्ध स्थानका सहर-केन्द्रका निर्देशाङ्क प्रयोग हुन्छन्। गाउँ वा टाढाको स्थान भए नजिकको सहर रोज्दा लग्नको सीमामा फरक पर्न सक्छ।</span>
      </label>
    </div>

    <button type="button" onClick={submit} disabled={busy} className="w-full rounded-xl bg-teal-700 px-5 py-3 font-bold text-white shadow-sm hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60">{busy?"गणना हुँदैछ…":"मेरो जन्मकुण्डली बनाउनुहोस्"}</button>
    {error&&<p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

    {result&&<div className="space-y-6" id="kundali-result">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div><p className="text-xs font-bold uppercase tracking-wide text-teal-700">जन्मकुण्डली रिपोर्ट</p><h2 className="mt-1 text-2xl font-black text-slate-950">{result.name||"जन्मकुण्डली"}</h2><p className="mt-1 text-sm text-slate-600">{result.birthDateBS} BS · {result.birthDateAD} AD · {result.birthTime} · {result.place}</p></div>
        <button type="button" onClick={()=>window.print()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">प्रिन्ट / PDF</button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["लग्न",result.lagna],["चन्द्र राशि",result.moonSign],["जन्म नक्षत्र",result.janmaNakshatra],["नक्षत्र पाद",n(result.janmaPada,0)]].map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-black text-slate-900">{value}</p></div>)}
      </div>
      <section>
        <h3 className="mb-3 text-lg font-bold text-slate-900">राशि कुण्डली (D1)</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {result.houses.map(house=><div key={house.house} className="min-h-24 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
            <p className="text-xs text-slate-500">{n(house.house,0)} भाव</p><p className="font-bold text-slate-900">{house.sign}</p><p className="mt-2 text-sm font-semibold text-teal-800">{house.planets.join(" · ")||"—"}</p>
          </div>)}
        </div>
        <p className="mt-2 text-xs text-slate-500">भाव गणना: Whole-sign house प्रणाली। ग्रहका छोटा नाम: सू सूर्य, च चन्द्र, मं मङ्गल, बु बुध, गु बृहस्पति, शु शुक्र, श शनि, रा राहु, के केतु।</p>
      </section>
      <section>
        <h3 className="mb-3 text-lg font-bold text-slate-900">नवग्रहको स्थिति</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600"><tr>{["ग्रह","राशि","अंश","नक्षत्र","पाद","भाव","गति"].map(x=><th key={x} className="px-3 py-3 font-semibold">{x}</th>)}</tr></thead>
            <tbody>{result.planets.map(p=><tr key={p.key} className="border-t border-slate-100"><td className="px-3 py-3 font-semibold">{p.name}</td><td className="px-3 py-3">{p.sign}</td><td className="px-3 py-3 tabular-nums">{n(p.degree,0)}° {n(p.minute,0)}′</td><td className="px-3 py-3">{p.nakshatra}</td><td className="px-3 py-3">{n(p.pada,0)}</td><td className="px-3 py-3">{n(p.house,0)}</td><td className="px-3 py-3">{p.retrograde?"वक्री":"मार्गी"}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-lg font-bold text-slate-900">विम्शोत्तरी महादशा</h3>
        <p className="mb-3 text-sm text-slate-600">हालको महादशा: <strong className="text-teal-800">{result.currentDasha}</strong></p>
        <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[480px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="px-3 py-3">महादशा स्वामी</th><th className="px-3 py-3">अवधि सुरु</th><th className="px-3 py-3">समाप्ति मिति</th><th className="px-3 py-3">अवधि (वर्ष)</th></tr></thead><tbody>{result.dasha.map((d,i)=><tr key={i} className={"border-t border-slate-100 "+(d.current?"bg-teal-50 font-bold":"")}><td className="px-3 py-3">{d.lord}{d.current?" · हाल":""}</td><td className="px-3 py-3">{d.start}</td><td className="px-3 py-3">{d.end}</td><td className="px-3 py-3">{n(d.years,2)}</td></tr>)}</tbody></table></div>
      </section>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
        <p className="font-bold text-slate-800">गणना विधि र सीमाहरू</p>
        <p className="mt-1">ग्रहको भौगोलिक (geocentric) apparent ecliptic longitude Astronomy Engine बाट निकालिन्छ; निरयन राशि/नक्षत्रका लागि Lahiri/Chitrapaksha ayanamsa, लग्नका लागि स्थानीय sidereal time र whole-sign भाव, राहुका लागि mean lunar node र दशाका लागि Vimshottari क्रम प्रयोग हुन्छ। गणना browser मै हुन्छ; जन्म विवरण server मा पठाइँदैन।</p>
        <p className="mt-1">Astronomy Engine ले आफ्नो astronomical model लाई NOVAS सँग तुलना गर्दा करिब ±१ arcminute शुद्धता लक्ष्य राखेको बताउँछ। तर यसले Hamro Patro को आन्तरिक गणना विधि सार्वजनिक रूपमा पुष्टि गर्दैन; त्यसैले दुवैको नतिजा शतप्रतिशत उस्तै हुन्छ भन्ने दाबी गरिएको छैन। जन्मसमय वा स्थानको त्रुटिले लग्न/भाव बदल्न सक्छ।</p>
        <p className="mt-1">यो परम्परागत ज्योतिषीय गणना हो, वैज्ञानिक रूपमा प्रमाणित भविष्यवाणी होइन। विवाह, स्वास्थ्य, वित्त वा जीवनका महत्त्वपूर्ण निर्णय यसैका आधारमा नगर्नुहोस्।</p>
      </div>
    </div>}
    <style jsx global>{`@media print { body * { visibility: hidden !important; } #kundali-result, #kundali-result * { visibility: visible !important; } #kundali-result { position: absolute; inset: 0; width: 100%; padding: 12mm; } #kundali-result button { display:none !important; } }`}</style>
  </div>;
}
