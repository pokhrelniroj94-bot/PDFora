"use client";
import { useState } from "react";
const field="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const label="mb-1.5 block text-sm font-semibold text-slate-700";
const titles:Record<string,string>={"json-formatter-validator":"JSON फ़ॉर्मेटर और वैलिडेटर","base64-encoder-decoder":"Base64 एन्कोडर / डिकोडर","url-encoder-decoder":"URL एन्कोडर / डिकोडर","hash-generator":"हैश जनरेटर","text-diff-checker":"टेक्स्ट अंतर जाँच","lorem-ipsum-generator":"Lorem Ipsum जनरेटर","html-encoder-decoder":"HTML एन्कोडर / डिकोडर","text-to-slug":"टेक्स्ट से URL Slug"};
export default function HindiDeveloperToolsWorkspace({slug}:{slug:string}){
 const [source,setSource]=useState(""),[second,setSecond]=useState(""),[mode,setMode]=useState("encode"),[output,setOutput]=useState(""),[error,setError]=useState(""),[count,setCount]=useState("3");
 const run=()=>{
  setError("");setOutput("");
  try{
   if(slug==="json-formatter-validator"){const parsed=JSON.parse(source);setOutput(JSON.stringify(parsed,null,2));}
   else if(slug==="base64-encoder-decoder"){
    if(mode==="encode"){const bytes=new TextEncoder().encode(source);let binary="";bytes.forEach(b=>binary+=String.fromCharCode(b));setOutput(btoa(binary));}
    else{const binary=atob(source.trim());const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));setOutput(new TextDecoder("utf-8",{fatal:true}).decode(bytes));}
   }else if(slug==="url-encoder-decoder")setOutput(mode==="encode"?encodeURIComponent(source):decodeURIComponent(source));
   else if(slug==="html-encoder-decoder"){
    if(mode==="encode")setOutput(source.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"));
    else{const area=document.createElement("textarea");area.innerHTML=source;setOutput(area.value);}
   }else if(slug==="text-to-slug")setOutput(source.toLocaleLowerCase("en").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));
   else if(slug==="text-diff-checker"){
    const a=source.split(/\r?\n/),b=second.split(/\r?\n/),max=Math.max(a.length,b.length),rows=[];
    for(let i=0;i<max;i++){if(a[i]===b[i])rows.push("  "+(a[i]??""));else{if(a[i]!==undefined)rows.push("- "+a[i]);if(b[i]!==undefined)rows.push("+ "+b[i]);}}
    setOutput(rows.join("\n")||"दोनों पाठ समान हैं।");
   }else if(slug==="lorem-ipsum-generator"){
    const n=Math.max(1,Math.min(20,Math.floor(Number(count)||1))),sentence="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    setOutput(Array.from({length:n},()=>sentence).join("\n\n"));
   }
  }catch(e){setError(e instanceof Error?e.message:"इनपुट संसाधित नहीं हो सका।");}
 };
 const makeHash=async()=>{setError("");try{const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(source));setOutput(Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join(""));}catch{setError("इस ब्राउज़र में सुरक्षित SHA-256 सुविधा उपलब्ध नहीं है।");}};
 return <section className="space-y-4"><div><h2 className="text-xl font-black">{titles[slug]||"हिन्दी डेवलपर टूल"}</h2><p className="mt-1 text-sm text-slate-600">सभी रूपांतरण आपके ब्राउज़र में होते हैं। पासवर्ड, API key या निजी टोकन साझा न करें।</p></div>
 {["base64-encoder-decoder","url-encoder-decoder","html-encoder-decoder"].includes(slug)&&<label><span className={label}>क्रिया</span><select className={field} value={mode} onChange={e=>setMode(e.target.value)}><option value="encode">Encode</option><option value="decode">Decode</option></select></label>}
 {slug==="lorem-ipsum-generator"&&<label><span className={label}>पैराग्राफ की संख्या (1–20)</span><input className={field} type="number" min="1" max="20" value={count} onChange={e=>setCount(e.target.value)}/></label>}
 <label><span className={label}>{slug==="json-formatter-validator"?"JSON दर्ज करें":"इनपुट पाठ"}</span><textarea className={field+" min-h-40"} value={source} onChange={e=>setSource(e.target.value)} placeholder="यहाँ पाठ दर्ज करें…"/></label>
 {slug==="text-diff-checker"&&<label><span className={label}>दूसरा पाठ</span><textarea className={field+" min-h-32"} value={second} onChange={e=>setSecond(e.target.value)}/></label>}
 <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={()=>slug==="hash-generator"?void makeHash():run()}>{slug==="hash-generator"?"SHA-256 बनाएँ":"चलाएँ"}</button><button type="button" className="rounded-xl border px-4 py-2.5 text-sm" onClick={()=>{setSource("");setSecond("");setOutput("");setError("");}}>साफ़ करें</button></div>
 {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
 {output&&<div className="rounded-2xl border border-teal-200 bg-teal-50 p-4"><h3 className="text-sm font-bold text-teal-950">परिणाम</h3><pre className="mt-2 whitespace-pre-wrap break-all font-sans text-sm leading-7 text-teal-950">{output}</pre><button type="button" className="mt-3 text-sm font-semibold underline" onClick={()=>void navigator.clipboard?.writeText(output)}>कॉपी करें</button></div>}
 <p className="text-xs leading-5 text-slate-500">Base64 एन्क्रिप्शन नहीं है। JWT या hash परिणाम की सुरक्षा/हस्ताक्षर सत्यापन इस टूल का उद्देश्य नहीं है।</p></section>;
}
