"use client";
import { useMemo, useState } from "react";
const field="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const label="mb-1.5 block text-sm font-semibold text-slate-700";
const titles:Record<string,string>={
 "word-character-counter":"शब्द और अक्षर गणक","case-converter":"अक्षर शैली कनवर्टर","remove-duplicate-lines":"दोहराई गई पंक्तियाँ हटाएँ","sort-lines":"पंक्तियाँ क्रमबद्ध करें","reverse-text":"पाठ उलटें","whitespace-cleaner":"अतिरिक्त रिक्त स्थान साफ़ करें","character-frequency":"अक्षर आवृत्ति गणक","word-frequency-counter":"शब्द आवृत्ति गणक","reading-time-calculator":"पढ़ने का समय कैलकुलेटर","line-counter":"पंक्ति गणक","sentence-counter":"वाक्य गणक","email-extractor":"ईमेल पता निकालें","url-extractor":"URL निकालें","phone-number-extractor":"फोन नंबर निकालें","number-extractor":"संख्याएँ निकालें","hashtag-extractor":"हैशटैग निकालें","remove-duplicate-words":"दोहराए गए शब्द हटाएँ","find-replace-text":"खोजें और बदलें","palindrome-checker":"Palindrome जाँच","acronym-generator":"संक्षिप्त नाम बनाएँ"
};
export default function HindiTextToolsWorkspace({slug}:{slug:string}){
 const [source,setSource]=useState(""),[find,setFind]=useState(""),[replace,setReplace]=useState(""),[caseMode,setCaseMode]=useState("upper");
 const result=useMemo(()=>{
  const lines=source.split(/\r?\n/),words=source.trim()?source.trim().split(/[\s]+/u):[];
  if(slug==="word-character-counter")return "शब्द: "+words.length+"\nअक्षर (space सहित): "+source.length+"\nअक्षर (space बिना): "+Array.from(source.replace(/\s/gu,"")).length+"\nपंक्तियाँ: "+(source?lines.length:0);
  if(slug==="case-converter")return caseMode==="upper"?source.toLocaleUpperCase("hi"):caseMode==="lower"?source.toLocaleLowerCase("hi"):caseMode==="title"?source.toLocaleLowerCase("hi").replace(/(^|\s)\p{L}/gu,m=>m.toLocaleUpperCase("hi")):source.replace(/\b\p{L}/gu,m=>m.toLocaleUpperCase("hi"));
  if(slug==="remove-duplicate-lines")return [...new Set(lines)].join("\n");
  if(slug==="sort-lines")return lines.slice().sort((a,b)=>a.localeCompare(b,"hi")).join("\n");
  if(slug==="reverse-text")return Array.from(source).reverse().join("");
  if(slug==="whitespace-cleaner")return lines.map(line=>line.replace(/[\t ]+/g," ").trim()).filter((line,i)=>line!==""||i===0).join("\n").trim();
  if(slug==="character-frequency"){const map=new Map<string,number>();for(const ch of Array.from(source)){if(!/\s/u.test(ch))map.set(ch,(map.get(ch)||0)+1);}return [...map].sort((a,b)=>b[1]-a[1]).map(([ch,n])=>ch+" : "+n).join("\n")||"विश्लेषण के लिए पाठ दर्ज करें।";}
  if(slug==="word-frequency-counter"){const map=new Map<string,number>();for(const word of words){const key=word.toLocaleLowerCase("hi").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,"");if(key)map.set(key,(map.get(key)||0)+1);}return [...map].sort((a,b)=>b[1]-a[1]).map(([w,n])=>w+" : "+n).join("\n")||"विश्लेषण के लिए पाठ दर्ज करें।";}
  if(slug==="reading-time-calculator")return "कुल शब्द: "+words.length+"\nअनुमानित पढ़ने का समय: "+Math.max(1,Math.ceil(words.length/200))+" मिनट (200 शब्द/मिनट के आधार पर)।";
  if(slug==="line-counter")return "कुल पंक्तियाँ: "+(source?lines.length:0)+"\nगैर-खाली पंक्तियाँ: "+lines.filter(x=>x.trim()).length;
  if(slug==="sentence-counter")return "अनुमानित वाक्य: "+(source.match(/[^.!?。！？]+[.!?。！？]+|[^.!?。！？]+$/gu)||[]).filter(x=>x.trim()).length;
  if(slug==="email-extractor")return [...new Set(source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)||[])].join("\n")||"कोई ईमेल पता नहीं मिला।";
  if(slug==="url-extractor")return [...new Set(source.match(/https?:\/\/[^\s<>"']+/gi)||[])].join("\n")||"कोई URL नहीं मिला।";
  if(slug==="phone-number-extractor")return [...new Set(source.match(/(?:\+?\d[\d\s().-]{7,}\d)/g)||[])].join("\n")||"कोई संभावित फोन नंबर नहीं मिला।";
  if(slug==="number-extractor")return source.match(/-?\d+(?:[.,]\d+)?/g)?.join("\n")||"कोई संख्या नहीं मिली।";
  if(slug==="hashtag-extractor")return [...new Set(source.match(/#[\p{L}\p{N}_]+/gu)||[])].join("\n")||"कोई hashtag नहीं मिला।";
  if(slug==="remove-duplicate-words")return [...new Set(words)].join(" ");
  if(slug==="find-replace-text")return find?source.split(find).join(replace):source;
  if(slug==="palindrome-checker"){const clean=source.toLocaleLowerCase("hi").replace(/[^\p{L}\p{N}]/gu,"");return clean?("यह "+(clean===Array.from(clean).reverse().join("")?"Palindrome है।":"Palindrome नहीं है।")):"पाठ दर्ज करें।";}
  if(slug==="acronym-generator")return words.map(w=>Array.from(w)[0]||"").join("").toLocaleUpperCase("hi");
  return "";
 },[slug,source,find,replace,caseMode]);
 const copy=()=>{void navigator.clipboard?.writeText(result);};
 return <section className="space-y-4"><div><h2 className="text-xl font-black text-slate-950">{titles[slug]||"हिन्दी टेक्स्ट टूल"}</h2><p className="mt-1 text-sm text-slate-600">पाठ आपके ब्राउज़र में ही प्रोसेस होता है। संवेदनशील जानकारी ऑनलाइन साझा न करें।</p></div>
 {slug==="case-converter"&&<label><span className={label}>रूपांतरण शैली</span><select className={field} value={caseMode} onChange={e=>setCaseMode(e.target.value)}><option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="title">Title Case</option><option value="sentence">Sentence Case</option></select></label>}
 {slug==="find-replace-text"&&<div className="grid gap-3 sm:grid-cols-2"><label><span className={label}>खोजें</span><input className={field} value={find} onChange={e=>setFind(e.target.value)}/></label><label><span className={label}>इससे बदलें</span><input className={field} value={replace} onChange={e=>setReplace(e.target.value)}/></label></div>}
 <label className="block"><span className={label}>अपना पाठ दर्ज करें</span><textarea className={field+" min-h-48"} value={source} onChange={e=>setSource(e.target.value)} placeholder="यहाँ पाठ लिखें या पेस्ट करें…"/></label>
 <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><h3 className="text-sm font-bold text-teal-950">परिणाम</h3><pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-teal-950">{result}</pre></div>
 <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={copy}>परिणाम कॉपी करें</button><button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold" onClick={()=>{setSource("");setFind("");setReplace("");}}>साफ़ करें</button></div>
 <p className="text-xs leading-5 text-slate-500">ईमेल, URL और फोन नंबर निकालने वाले टूल केवल सामान्य pattern पहचानते हैं; वे पते या नंबर की वैधता/मालिकाना पुष्टि नहीं करते।</p></section>;
}
