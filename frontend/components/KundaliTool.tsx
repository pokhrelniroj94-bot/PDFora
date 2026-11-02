"use client";

import { useState } from "react";
import DateConverter from "../lib/nepali-date-converter";
import { calculateJanmaKundali, KUNDALI_PLACES, type KundaliResult } from "../lib/kundali-calculator";

const box = "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const n = (value:number, digits=2, locale="ne-NP") => new Intl.NumberFormat(locale,{maximumFractionDigits:digits}).format(value);
const HINDI_PLACES: Record<string,string> = {kathmandu:"काठमांडू",ilam:"इलाम",biratnagar:"विराटनगर",pokhara:"पोखरा",janakpur:"जनकपुर",nepalgunj:"नेपालगंज",dhangadhi:"धनगढ़ी",birgunj:"बीरगंज",dharan:"धरान",butwal:"बुटवल",bharatpur:"भरतपुर",delhi:"दिल्ली",mumbai:"मुंबई",kolkata:"कोलकाता",chennai:"चेन्नई",bengaluru:"बेंगलुरु",hyderabad:"हैदराबाद",jaipur:"जयपुर",varanasi:"वाराणसी",lucknow:"लखनऊ",ahmedabad:"अहमदाबाद",pune:"पुणे",bhopal:"भोपाल"};
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
  const num=(value:number,digits=2)=>n(value,digits,language==="ne"?"ne-NP":language==="hi"?"hi-IN":"en-IN");
  const placeText=(place:typeof KUNDALI_PLACES[number])=>language==="ne"?place.name:language==="hi"?(HINDI_PLACES[place.id]??place.en):place.en;
  const localizedCalculationError=(message:string)=>{const known:[string,string,string,string][]=[["जन्मस्थानका अक्षांश/देशान्तर मान्य छैनन्।","Birthplace coordinates are invalid.","जन्मस्थान के निर्देशांक अमान्य हैं।","जन्मस्थानका अक्षांश/देशान्तर मान्य छैनन्।"],["जन्ममिति YYYY-MM-DD ढाँचामा राख्नुहोस्।","Enter the birth date in YYYY-MM-DD format.","जन्म तिथि YYYY-MM-DD प्रारूप में दर्ज करें।","जन्ममिति YYYY-MM-DD ढाँचामा राख्नुहोस्।"],["जन्मसमय २४-घण्टाको HH:MM ढाँचामा राख्नुहोस्।","Enter the birth time in 24-hour HH:MM format.","जन्म समय २४ घंटे के HH:MM प्रारूप में दर्ज करें।","जन्मसमय २४-घण्टाको HH:MM ढाँचामा राख्नुहोस्।"],["हालको गणना १८०० देखि २१०० AD सम्मका जन्ममितिका लागि मात्र परीक्षण गरिएको छ।","The current calculation has been tested only for birth dates from 1800 through 2100 AD.","वर्तमान गणना का परीक्षण केवल 1800 से 2100 ईस्वी की जन्म तिथियों के लिए किया गया है।","हालको गणना १८०० देखि २१०० AD सम्मका जन्ममितिका लागि मात्र परीक्षण गरिएको छ।"],["जन्ममिति मान्य छैन।","The birth date is invalid.","जन्म तिथि अमान्य है।","जन्ममिति मान्य छैन।"],["भविष्यको जन्ममिति राख्न मिल्दैन।","A future birth date is not allowed.","भविष्य की जन्म तिथि स्वीकार नहीं है।","भविष्यको जन्ममिति राख्न मिल्दैन।"],["जन्मस्थानको समय क्षेत्र पत्ता लगाउन सकिएन।","The birthplace time zone could not be resolved.","जन्मस्थान का समय क्षेत्र निर्धारित नहीं हो सका।","जन्मस्थानको समय क्षेत्र पत्ता लगाउन सकिएन।"],["यो स्थानीय जन्म समय मान्य छैन। मिति र समय फेरि जाँच्नुहोस्।","This local birth time is invalid. Check the date and time.","यह स्थानीय जन्म समय अमान्य है। तिथि और समय जाँचें।","यो स्थानीय जन्म समय मान्य छैन। मिति र समय फेरि जाँच्नुहोस्।"]];const match=known.find(([ne])=>message.includes(ne));return match?tr(match[0],match[1],match[2]):message;};
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
  const changeDateSystem=(next:"BS"|"AD")=>{if(next===dateSystem)return;try{const raw=birthDate.replace(/[०-९]/g,d=>String("०१२३४५६७८९".indexOf(d))).trim();if(raw){const converted=new DateConverter(raw);const value=next==="AD"?converted.toAd():converted.toBs();setBirthDate([value.year,String(value.month).padStart(2,"0"),String(value.date).padStart(2,"0")].join("-"));}setDateSystem(next);setError("");}catch{setError(tr("यो मिति प्रणालीको समर्थित दायराभित्र मिति रूपान्तरण गर्न सकिएन। जन्ममिति जाँच्नुहोस्।","This date cannot be converted within the supported calendar range. Please check the birth date.","यह तिथि समर्थित कैलेंडर सीमा में परिवर्तित नहीं की जा सकी। कृपया जन्म तिथि जाँचें।"));}};

  const submit=()=>{
    if(busy)return;
    setError("");setResult(null);setBusy(true);
    window.setTimeout(()=>{
      try{
        if(!birthTime) throw new Error(tr("कृपया जन्मको सही समय राख्नुहोस्। लग्न र भावका लागि जन्मसमय आवश्यक हुन्छ।","Please enter the exact local birth time. Birth time is required to calculate the ascendant and houses.","कृपया जन्म का सही स्थानीय समय दर्ज करें। लग्न और भाव की गणना के लिए जन्म समय आवश्यक है।"));
        if(placeId==="custom"&&(!latitude.trim()||!longitude.trim())) throw new Error(tr("अन्य स्थान छान्दा वास्तविक अक्षांश र देशान्तर दुवै राख्नुहोस्।","For a custom place, enter both the actual latitude and longitude.","अन्य स्थान चुनने पर सही अक्षांश और देशांतर दोनों दर्ज करें।"));
        const calculated=calculateJanmaKundali({name,dateSystem,birthDate:birthDate.replace(/[०-९]/g,d=>String("०१२३४५६७८९".indexOf(d))),birthTime,placeId,placeName,latitude:Number(latitude),longitude:Number(longitude),timeZone});
        setResult(calculated);
      }catch(e){setError(e instanceof Error?localizedCalculationError(e.message):tr("कुण्डली गणना गर्न सकिएन। विवरण जाँच्नुहोस्।","Could not calculate the birth chart. Please check your details.","कुंडली की गणना नहीं हो सकी। कृपया विवरण जाँचें।"));}
      finally{setBusy(false);}
    },80);
  };

  return <div className="space-y-6">
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-bold">{tr("जन्मकुण्डली तयार गर्नुहोस्","Create your birth chart","अपनी जन्म कुंडली बनाएं")}</p><label className="text-xs font-semibold">{tr("भाषा","Language","भाषा")}<select className="ml-2 rounded-lg border border-teal-300 bg-white px-2 py-1 text-slate-900" value={language} onChange={e=>setLanguage(e.target.value as "ne"|"en"|"hi")}><option value="ne">नेपाली</option><option value="en">English</option><option value="hi">हिन्दी</option></select></label></div>
      <p className="mt-1">{tr("जन्ममिति, स्थानीय जन्मसमय र जन्मस्थान राखेर लग्न, राशि, ग्रह, नक्षत्र र विम्शोत्तरी महादशा हेर्नुहोस्।","Enter your birth date, local birth time and birthplace to calculate Lagna, Rashi, planetary positions, Nakshatra and Vimshottari Mahadasha.","जन्म तिथि, स्थानीय जन्म समय और जन्म स्थान भरकर लग्न, राशि, ग्रह स्थिति, नक्षत्र और विंशोत्तरी महादशा देखें।")}</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold text-slate-800">{tr("नाम (ऐच्छिक)","Name (optional)","नाम (वैकल्पिक)")}
        <input className={box} value={name} onChange={e=>setName(e.target.value)} placeholder={tr("पूरा नाम","Full name","पूरा नाम")}/>
      </label>
      <label className="text-sm font-semibold text-slate-800">{tr("मिति प्रणाली","Date system","तिथि प्रणाली")}
        <select className={box} value={dateSystem} onChange={e=>changeDateSystem(e.target.value as "BS"|"AD")}>
          <option value="BS">{tr("विक्रम संवत् (वि.सं.)","Bikram Sambat (BS)","विक्रम संवत (वि.सं.)")}</option><option value="AD">{tr("ईस्वी संवत् (ई.सं.)","Gregorian (AD)","ईस्वी संवत (ई.सं.)")}</option>
        </select>
      </label>
      <label className="text-sm font-semibold text-slate-800">{tr("जन्ममिति","Birth date","जन्म तिथि")} ({dateSystem==="BS"?tr("वि.सं. YYYY-MM-DD","BS YYYY-MM-DD","वि.सं. YYYY-MM-DD"):tr("ई.सं. YYYY-MM-DD","AD YYYY-MM-DD","ई.सं. YYYY-MM-DD")})
        <input className={box} value={birthDate} onChange={e=>setBirthDate(e.target.value)} placeholder={dateSystem==="BS"?"२०५८-०१-०१":"2001-04-14"} inputMode="numeric"/>
      </label>
      <label className="text-sm font-semibold text-slate-800">{tr("जन्मसमय (स्थानीय समय)","Birth time (local)","जन्म समय (स्थानीय)")}
        <input className={box} type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)}/>
        <span className="mt-1 block text-xs font-normal text-slate-500">{tr("२४-घण्टा ढाँचा, जस्तै ०६:३५ वा १८:२०","24-hour format, e.g. 06:35 or 18:20","२४ घंटे का प्रारूप, जैसे ०६:३५ या १८:२०")}</span>
      </label>
      <label className="text-sm font-semibold text-slate-800 sm:col-span-2">{tr("जन्मस्थान","Birthplace","जन्म स्थान")}
        <select className={box} value={placeId} onChange={e=>{setPlaceId(e.target.value);const selected=KUNDALI_PLACES.find(p=>p.id===e.target.value);if(e.target.value!=="custom"){const zone=selected?.timeZone??"Asia/Kathmandu";setTimeZone(zone);changeDateSystem(zone==="Asia/Kolkata"?"AD":"BS");}}}>
          {KUNDALI_PLACES.map(place=><option key={place.id} value={place.id}>{placeText(place)}</option>)}
          <option value="custom">{tr("अन्य स्थान — ठ्याक्कै निर्देशाङ्क राख्नुहोस्","Other place — enter exact coordinates","अन्य स्थान — सही निर्देशांक दर्ज करें")}</option>
        </select>
        {placeId==="custom"&&<div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-semibold">{tr("स्थानको नाम","Place name","स्थान का नाम")}<input className={box} value={placeName} onChange={e=>setPlaceName(e.target.value)} placeholder={tr("जस्तै: फिक्कल, इलाम","e.g. Fikkal, Ilam","जैसे: फिक्कल, इलाम")}/></label>
          <label className="text-xs font-semibold">{tr("अक्षांश (Latitude)","Latitude","अक्षांश (Latitude)")}<input className={box} type="number" min="-90" max="90" step="0.000001" value={latitude} onChange={e=>setLatitude(e.target.value)}/></label>
          <label className="text-xs font-semibold">{tr("देशान्तर (Longitude)","Longitude","देशांतर (Longitude)")}<input className={box} type="number" min="-180" max="180" step="0.000001" value={longitude} onChange={e=>setLongitude(e.target.value)}/></label>
          <label className="text-xs font-semibold sm:col-span-3">{tr("समय क्षेत्र (IANA time zone)","Time zone (IANA)","समय क्षेत्र (IANA)")}<input className={box} value={timeZone} onChange={e=>setTimeZone(e.target.value)} placeholder="Asia/Kolkata"/></label>
        </div>}
        <span className="mt-1 block text-xs font-normal text-slate-500">{tr("सहरका विकल्पमा सहर-केन्द्रका निर्देशाङ्क प्रयोग हुन्छन्। बढी शुद्ध लग्नका लागि जन्मस्थलको वास्तविक अक्षांश/देशान्तर राख्नुहोस्। नेपाल र भारतका समय क्षेत्र स्वतः चयन हुन्छन्।","Listed cities use city-centre coordinates. For a more precise ascendant, enter the exact birthplace coordinates. Nepal and India time zones are selected automatically.","सूचीबद्ध शहरों के लिए शहर-केंद्र के निर्देशांक उपयोग होते हैं। अधिक सटीक लग्न के लिए जन्मस्थान के वास्तविक निर्देशांक दर्ज करें। नेपाल और भारत के समय क्षेत्र अपने-आप चुने जाते हैं।")}</span>
      </label>
    </div>

    <button type="button" onClick={submit} disabled={busy} className="w-full rounded-xl bg-teal-700 px-5 py-3 font-bold text-white shadow-sm hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60">{busy?<span className="inline-flex items-center justify-center gap-2"><span className="pdfora-spinner" aria-hidden="true"/>{tr("गणना हुँदैछ…","Calculating…","गणना हो रही है…")}</span>:tr("मेरो जन्मकुण्डली बनाउनुहोस्","Generate my Kundali","मेरी कुंडली बनाएं")}</button>
    {error&&<p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

    {result&&<div className="space-y-6" id="kundali-result" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div><p className="text-xs font-bold uppercase tracking-wide text-teal-700">{tr("जन्मकुण्डली रिपोर्ट","Birth chart report","जन्म कुंडली रिपोर्ट")}</p><h2 className="mt-1 text-2xl font-black text-slate-950">{result.name||tr("जन्मकुण्डली","Birth chart","जन्म कुंडली")}</h2><p className="mt-1 text-sm text-slate-600">{result.birthDateBS.endsWith(" AD")?tr("वि.सं. उपलब्ध छैन","BS unavailable","वि.सं. उपलब्ध नहीं"):result.birthDateBS+" "+tr("वि.सं.","BS","वि.सं.")} · {result.birthDateAD} {tr("ई.सं.","AD","ई.सं.")} · {result.birthTime} · {placeId==="custom"?placeName:(KUNDALI_PLACES.find(p=>p.id===placeId)?placeText(KUNDALI_PLACES.find(p=>p.id===placeId)!):result.place)}</p></div>
        <button type="button" onClick={()=>window.print()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">{tr("प्रिन्ट / PDF","Print / PDF","प्रिंट / PDF")}</button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[[tr("लग्न","Ascendant","लग्न"),astro(result.lagna)],[tr("चन्द्र राशि","Moon sign","चंद्र राशि"),astro(result.moonSign)],[tr("जन्म नक्षत्र","Birth Nakshatra","जन्म नक्षत्र"),astro(result.janmaNakshatra)],[tr("नक्षत्र पाद","Pada","पाद"),num(result.janmaPada,0)], [tr("नवांश लग्न","Navamsa Ascendant","नवांश लग्न"),astro(result.navamsaLagna)]].map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-black text-slate-900">{value}</p></div>)}
      </div>
      <section>
        <h3 className="mb-3 text-lg font-bold text-slate-900">{tr("राशि कुण्डली (D1)","Rashi chart (D1)","राशि कुंडली (D1)")}</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {result.houses.map(house=><div key={house.house} className="min-h-24 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
            <p className="text-xs text-slate-500">{num(house.house,0)} {tr("भाव","House","भाव")}</p><p className="font-bold text-slate-900">{astro(house.sign)}</p><p className="mt-2 text-sm font-semibold text-teal-800">{house.planets.map(astro).join(" · ")||"—"}</p>
          </div>)}
        </div>
        <p className="mt-2 text-xs text-slate-500">{tr("भाव गणना: प्रत्येक राशिलाई एउटा पूरा भाव मान्ने प्रणाली। ग्रहका सङ्केत: सू सूर्य, च चन्द्र, मं मङ्गल, बु बुध, गु बृहस्पति, शु शुक्र, श शनि, रा राहु, के केतु।","House calculation: whole-sign houses, where each zodiac sign forms one complete house. Planet abbreviations: Su Sun, Mo Moon, Ma Mars, Me Mercury, Ju Jupiter, Ve Venus, Sa Saturn, Ra Rahu, Ke Ketu.","भाव गणना: पूर्ण राशि भाव प्रणाली, जिसमें प्रत्येक राशि एक पूरा भाव बनाती है। ग्रह संकेत: सू सूर्य, चं चंद्र, मं मंगल, बु बुध, गु बृहस्पति, शु शुक्र, श शनि, रा राहु, के केतु।")}</p>
      </section>
      <section>
        <h3 className="mb-3 text-lg font-bold text-slate-900">{tr("नवांश कुण्डली (D9)","Navamsa chart (D9)","नवांश कुंडली (D9)")}</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {result.navamsaHouses.map(house=><div key={house.house} className="min-h-24 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3"><p className="text-xs text-slate-500">{num(house.house,0)} {tr("भाव","House","भाव")}</p><p className="font-bold text-slate-900">{astro(house.sign)}</p><p className="mt-2 text-sm font-semibold text-indigo-800">{house.planets.map(astro).join(" · ")||"—"}</p></div>)}
        </div>
        <p className="mt-2 text-xs text-slate-500">{tr("D9 नवांश स्थिति ग्रहको निरयन देशान्तरलाई प्रत्येक राशिका नौ बराबर भागमा विभाजन गरेर निकालिन्छ।","D9 placements divide each sidereal sign into nine equal Navamsa sections.","D9 नवांश स्थिति प्रत्येक निरयन राशि को नौ समान भागों में विभाजित करके निकाली जाती है।")}</p>
      </section>
      <section>
        <h3 className="mb-3 text-lg font-bold text-slate-900">{tr("नवग्रहको स्थिति","Planetary positions","नवग्रह स्थिति")}</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600"><tr>{[tr("ग्रह","Planet","ग्रह"),tr("राशि","Sign","राशि"),tr("अंश","Degree","अंश"),tr("नक्षत्र","Nakshatra","नक्षत्र"),tr("पाद","Pada","पाद"),tr("भाव","House","भाव"),tr("गति","Motion","गति")].map(x=><th key={x} className="px-3 py-3 font-semibold">{x}</th>)}</tr></thead>
            <tbody>{result.planets.map(p=><tr key={p.key} className="border-t border-slate-100"><td className="px-3 py-3 font-semibold">{astro(p.name)}</td><td className="px-3 py-3">{astro(p.sign)}</td><td className="px-3 py-3 tabular-nums">{num(p.degree,0)}° {num(p.minute,0)}′</td><td className="px-3 py-3">{astro(p.nakshatra)}</td><td className="px-3 py-3">{num(p.pada,0)}</td><td className="px-3 py-3">{num(p.house,0)}</td><td className="px-3 py-3">{p.retrograde?tr("वक्री","Retrograde","वक्री"):tr("मार्गी","Direct","मार्गी")}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-lg font-bold text-slate-900">{tr("विम्शोत्तरी महादशा","Vimshottari Mahadasha","विंशोत्तरी महादशा")}</h3>
        <p className="mb-3 text-sm text-slate-600">{tr("हालको महादशा:","Current Mahadasha:","वर्तमान महादशा:")} <strong className="text-teal-800">{result.currentDasha==="हालको महादशा यो १२०-वर्षे चक्रबाहिर छ"?tr("हालको महादशा यो १२०-वर्षे चक्रबाहिर छ","Current date is outside this 120-year dasha cycle","वर्तमान तिथि इस १२०-वर्षीय दशा चक्र से बाहर है"):astro(result.currentDasha)}</strong></p>
        <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[480px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="px-3 py-3">{tr("महादशा स्वामी","Mahadasha lord","महादशा स्वामी")}</th><th className="px-3 py-3">{tr("अवधि सुरु","Start date","आरंभ तिथि")}</th><th className="px-3 py-3">{tr("समाप्ति मिति","End date","समाप्ति तिथि")}</th><th className="px-3 py-3">{tr("अवधि (वर्ष)","Duration (years)","अवधि (वर्ष)")}</th></tr></thead><tbody>{result.dasha.map((d,i)=><tr key={i} className={"border-t border-slate-100 "+(d.current?"bg-teal-50 font-bold":"")}><td className="px-3 py-3">{astro(d.lord)}{d.current?" · "+tr("हाल","Current","वर्तमान"):""}</td><td className="px-3 py-3">{language==="ne"?d.start:d.startAD}</td><td className="px-3 py-3">{language==="ne"?d.end:d.endAD}</td><td className="px-3 py-3">{num(d.years,2)}</td></tr>)}</tbody></table></div>
      </section>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
        <p className="font-bold text-slate-800">{tr("गणना विधि र सीमाहरू","Calculation method and limitations","गणना विधि और सीमाएं")}</p>
        <p className="mt-1">{tr("ग्रहको भूकेन्द्रीय (geocentric) प्रत्यक्ष क्रान्तिवृत्तीय देशान्तर Astronomy Engine बाट निकालिन्छ। निरयन राशि/नक्षत्रका लागि लाहिरी अयनांश, लग्नका लागि स्थानीय नाक्षत्रिक समय र पूर्ण राशि भाव, राहुका लागि मध्यम चन्द्र नोड तथा दशाका लागि विम्शोत्तरी क्रम प्रयोग हुन्छ। गणना यही ब्राउजरमा हुन्छ; जन्म विवरण सर्भरमा पठाइँदैन।","Geocentric apparent ecliptic longitudes are calculated with Astronomy Engine. The chart uses Lahiri ayanamsa, local sidereal time for the ascendant, whole-sign D1 houses, nine-part Navamsa (D9) divisions, the mean lunar node for Rahu and the Vimshottari sequence for dasha. Calculation runs in this browser; birth details are not sent to the server.","ग्रहों के भूकेन्द्रीय प्रत्यक्ष क्रांतिवृत्तीय देशांतर की गणना Astronomy Engine से होती है। निरयन राशि/नक्षत्र के लिए लाहिड़ी अयनांश, लग्न के लिए स्थानीय नाक्षत्र समय और पूर्ण राशि भाव, राहु के लिए मध्यम चंद्र नोड तथा दशा के लिए विंशोत्तरी क्रम उपयोग होता है। गणना इसी ब्राउज़र में होती है; जन्म विवरण सर्वर पर नहीं भेजे जाते।")}</p>
        <p className="mt-1">{tr("Astronomy Engine को खगोलीय मोडेलको लक्ष्य करिब ±१ arcminute हो। तर यसको नतिजा अन्य पञ्चाङ्ग सेवासँग पूर्ण रूपमा उस्तै हुन्छ भन्ने ग्यारेन्टी छैन। जन्मसमय वा स्थानको त्रुटिले लग्न र भाव बदल्न सक्छ।","Astronomy Engine documents an approximately ±1 arcminute target for its astronomical model. This does not guarantee identical results to other Panchang services. An inaccurate birth time or location can change the ascendant and houses.","Astronomy Engine अपने खगोलीय मॉडल के लिए लगभग ±१ arcminute का लक्ष्य बताता है। इससे अन्य पंचांग सेवाओं के साथ बिल्कुल समान परिणाम की गारंटी नहीं मिलती। जन्म समय या स्थान में त्रुटि से लग्न और भाव बदल सकते हैं।")}</p>
        <p className="mt-1">{tr("यो परम्परागत ज्योतिषीय गणना हो, वैज्ञानिक रूपमा प्रमाणित भविष्यवाणी होइन। विवाह, स्वास्थ्य, वित्त वा जीवनका महत्त्वपूर्ण निर्णय यसैका आधारमा नगर्नुहोस्।","This is a traditional astrological calculation, not a scientifically validated prediction. Do not base important marriage, health, financial or life decisions on it alone.","यह पारंपरिक ज्योतिषीय गणना है, वैज्ञानिक रूप से प्रमाणित भविष्यवाणी नहीं। विवाह, स्वास्थ्य, वित्त या जीवन के महत्वपूर्ण निर्णय केवल इसके आधार पर न लें।")}</p>
      </div>
    </div>}
    <style jsx global>{`@media print { body * { visibility: hidden !important; } #kundali-result, #kundali-result * { visibility: visible !important; } #kundali-result { position: absolute; inset: 0; width: 100%; padding: 12mm; } #kundali-result button { display:none !important; } }`}</style>
  </div>;
}
