"use client";
import {useState} from "react";
import { average, convertUnit, fractionOperation, percentageChange, simplifyRatio } from "../lib/catalog-calculations";
import { analyzeMetaTitle, analyzeMetaDescription, calculateKeywordDensity, generateRobotsTxt, generateSitemapXml, buildOpenGraphPreview } from "../lib/seo-utilities";
type F={key:string;label:string;type?:"number"|"date"|"time"|"color";value:string};
const config:Record<string,F[]> = {
"percentage-change-calculator":[{key:"a",label:"Original value",type:"number",value:"100"},{key:"b",label:"New value",type:"number",value:"120"}],
"average-calculator":[{key:"text",label:"Numbers separated by commas or spaces",value:"10, 20, 30, 40"}],
"ratio-simplifier":[{key:"a",label:"First part",type:"number",value:"12"},{key:"b",label:"Second part",type:"number",value:"18"}],
"fraction-calculator":[{key:"a",label:"First numerator",type:"number",value:"1"},{key:"b",label:"First denominator",type:"number",value:"2"},{key:"c",label:"Second numerator",type:"number",value:"1"},{key:"d",label:"Second denominator",type:"number",value:"3"},{key:"op",label:"Operation (+ - * /)",value:"+"}],
"unit-converter":[{key:"n",label:"Value",type:"number",value:"1"},{key:"from",label:"From unit (m km cm mm in ft kg g lb l ml c f)",value:"km"},{key:"to",label:"To unit",value:"m"}],
"age-calculator":[{key:"a",label:"Birth date",type:"date",value:"2000-01-01"},{key:"b",label:"Calculate as of",type:"date",value:new Date().toISOString().slice(0,10)}],
"date-difference-calculator":[{key:"a",label:"Start date",type:"date",value:new Date().toISOString().slice(0,10)},{key:"b",label:"End date",type:"date",value:new Date().toISOString().slice(0,10)}],
"time-duration-calculator":[{key:"a",label:"Start time",type:"time",value:"09:00"},{key:"b",label:"End time",type:"time",value:"17:00"}],
"remove-duplicate-lines":[{key:"text",label:"Text",value:"apple\nbanana\napple"}],
"sort-lines":[{key:"text",label:"Lines",value:"Banana\napple\nOrange"},{key:"order",label:"Order (asc or desc)",value:"asc"}],
"reverse-text":[{key:"text",label:"Text",value:"Hello world"},{key:"mode",label:"Mode (characters or words)",value:"characters"}],
"text-to-slug":[{key:"text",label:"Title or phrase",value:"My Awesome Website"}],
"whitespace-cleaner":[{key:"text",label:"Text",value:"  Remove   extra spaces  \n\n and blank lines. "}],
"character-frequency":[{key:"text",label:"Text",value:"banana"}],
"password-generator":[{key:"len",label:"Length (8–128)",type:"number",value:"20"},{key:"count",label:"Number to generate (1–10)",type:"number",value:"3"}],
"uuid-generator":[],"xml-formatter-validator":[{key:"text",label:"XML input",value:"<root><item id=\"1\">Hello</item></root>"}],"url-query-parser":[{key:"text",label:"Full URL",value:"https://example.com/search?q=pdf&page=2"}],
"html-encoder-decoder":[{key:"text",label:"HTML or plain text",value:"<h1>Hello & welcome</h1>"},{key:"mode",label:"Mode (encode or decode)",value:"encode"}],
"regex-tester":[{key:"pattern",label:"Regular expression",value:"\\bcat\\b"},{key:"flags",label:"Flags (g, i, m)",value:"gi"},{key:"text",label:"Test text",value:"Cat, catalog, cat."}],
"jwt-decoder":[{key:"text",label:"JWT token",value:""}],
"color-contrast-checker":[{key:"fg",label:"Text color",type:"color",value:"#111827"},{key:"bg",label:"Background color",type:"color",value:"#ffffff"}],
"css-minifier":[{key:"text",label:"CSS code",value:"/* sample */\n.card { color: #333; padding: 16px; }"}],
"json-to-csv":[{key:"text",label:"JSON array",value:'[{"name":"Asha","age":22},{"name":"Ravi","age":25}]'}],
"meta-title-checker":[{key:"text",label:"Page title",value:"Free Online PDF Tools - PDFora"}],
"meta-description-checker":[{key:"text",label:"Meta description",value:"Use free online tools to convert, calculate, format and manage files quickly in your browser."}],
"keyword-density-checker":[{key:"text",label:"Content",value:"Paste your page content here with the main keyword."},{key:"keyword",label:"Target keyword",value:"main keyword"}],
"robots-txt-generator":[{key:"site",label:"Sitemap URL (optional)",value:"https://example.com/sitemap.xml"},{key:"path",label:"Disallow path (optional)",value:"/admin/"}],
"sitemap-generator":[{key:"text",label:"One absolute URL per line",value:"https://example.com/\nhttps://example.com/about"}],
"open-graph-preview":[{key:"title",label:"Page title",value:"Your page title"},{key:"description",label:"Description",value:"A short summary."},{key:"image",label:"Image URL",value:"https://example.com/image.jpg"},{key:"url",label:"Page URL",value:"https://example.com/"}],
"profit-margin-calculator":[{key:"cost",label:"Cost",type:"number",value:"60"},{key:"price",label:"Selling price",type:"number",value:"100"}],
"markup-calculator":[{key:"cost",label:"Cost",type:"number",value:"60"},{key:"rate",label:"Markup (%)",type:"number",value:"40"}],
"break-even-calculator":[{key:"fixed",label:"Fixed costs",type:"number",value:"100000"},{key:"price",label:"Selling price per unit",type:"number",value:"500"},{key:"variable",label:"Variable cost per unit",type:"number",value:"300"}],
"sales-tax-calculator":[{key:"amount",label:"Amount",type:"number",value:"1000"},{key:"rate",label:"Tax rate (%)",type:"number",value:"13"},{key:"mode",label:"Mode (add or remove)",value:"add"}],
"salary-breakdown-calculator":[{key:"salary",label:"Gross monthly salary",type:"number",value:"50000"},{key:"rate",label:"Estimated deduction (%)",type:"number",value:"10"}],
"savings-goal-calculator":[{key:"target",label:"Savings target",type:"number",value:"100000"},{key:"saved",label:"Already saved",type:"number",value:"10000"},{key:"months",label:"Months to goal",type:"number",value:"12"}]
};
const escapeHtml=(s:string)=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const lum=(h:string)=>{const x=h.slice(1).match(/.{2}/g)!.map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*x[0]+.7152*x[1]+.0722*x[2];};
export default function ExtraTools({slug}:{slug:string}){
 const fields=config[slug];const [v,setV]=useState<Record<string,string>>(()=>Object.fromEntries((fields??[]).map(f=>[f.key,f.value])));
 const [out,setOut]=useState("");const [err,setErr]=useState("");
 const val=(k:string)=>v[k]??"";const num=(k:string)=>{const x=Number(val(k));if(!Number.isFinite(x))throw Error("Enter valid numbers.");return x;};
 const run=()=>{setErr("");setOut("");try{let s="";
 switch(slug){
 case "percentage-change-calculator":{const a=num("a"),b=num("b");const change=percentageChange(a,b);s=change.toFixed(2)+"% "+(b>=a?"increase":"decrease");break;}
 case "average-calculator":{const raw=val("text").trim();const values=raw?raw.split(/[\s,;]+/).map(Number):[];const stats=average(values);s="Count: "+values.length+"\nMean: "+stats.mean+"\nMedian: "+stats.median+"\nMode: "+(stats.mode.length?stats.mode.join(", "):"No repeated value")+"\nRange: "+stats.range;break;}
 case "ratio-simplifier":s=simplifyRatio(num("a"),num("b"));break;
 case "fraction-calculator":{const result=fractionOperation(num("a"),num("b"),num("c"),num("d"),val("op"));s=result.numerator+"/"+result.denominator+" = "+result.value;break;}
 case "unit-converter":{const a=val("from").toLowerCase(),b=val("to").toLowerCase();s=convertUnit(num("n"),a,b).toPrecision(8)+" "+b;if((a==="c"||a==="f")&&(b==="c"||b==="f"))s=convertUnit(num("n"),a,b).toFixed(4)+" °"+b.toUpperCase();break;}
 case "age-calculator":{const a=new Date(val("a")+"T00:00:00"),b=new Date(val("b")+"T00:00:00");if(isNaN(+a)||isNaN(+b)||b<a)throw Error("Enter valid dates in chronological order.");let y=b.getFullYear()-a.getFullYear(),m=b.getMonth()-a.getMonth(),d=b.getDate()-a.getDate();if(d<0){m--;d+=new Date(b.getFullYear(),b.getMonth(),0).getDate();}if(m<0){y--;m+=12;}s=y+" years, "+m+" months, "+d+" days";break;}
 case "date-difference-calculator":{const a=new Date(val("a")+"T00:00:00"),b=new Date(val("b")+"T00:00:00");if(isNaN(+a)||isNaN(+b))throw Error("Enter valid dates.");const d=Math.abs(Math.round((+b- +a)/86400000));s=d+" days ("+(d/7).toFixed(2)+" weeks; "+(d/30.4375).toFixed(2)+" average months)";break;}
 case "time-duration-calculator":{const t=(x:string)=>{const p=x.split(":").map(Number);return p[0]*60+p[1];};let d=t(val("b"))-t(val("a"));if(d<0)d+=1440;s=Math.floor(d/60)+" hours "+d%60+" minutes";break;}
 case "remove-duplicate-lines":{const seen=new Set<string>();s=val("text").split(/\r?\n/).filter(x=>{if(seen.has(x))return false;seen.add(x);return true;}).join("\n");break;}
 case "sort-lines":{const a=val("text").split(/\r?\n/).sort((x,y)=>x.localeCompare(y,undefined,{sensitivity:"base"}));s=(val("order")==="desc"?a.reverse():a).join("\n");break;}
 case "reverse-text":s=val("mode")==="words"?val("text").trim().split(/\s+/).reverse().join(" "):[...val("text")].reverse().join("");break;
 case "text-to-slug":s=val("text").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");break;
 case "whitespace-cleaner":s=val("text").split(/\r?\n/).map(x=>x.trim().replace(/\s+/g," ")).filter(Boolean).join("\n");break;
 case "character-frequency":{const m=new Map<string,number>();for(const c of val("text"))m.set(c,(m.get(c)||0)+1);s=[...m].sort((a,b)=>b[1]-a[1]).map(([c,n])=>(c===" "?"[space]":c)+" : "+n).join("\n");break;}
 case "password-generator":{const len=Math.max(8,Math.min(128,Math.floor(num("len")))),count=Math.max(1,Math.min(10,Math.floor(num("count")))),chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+";s=Array.from({length:count},()=>Array.from({length:len},()=>chars[crypto.getRandomValues(new Uint32Array(1))[0]%chars.length]).join("")).join("\n");break;}
 case "uuid-generator":s=Array.from({length:5},()=>crypto.randomUUID()).join("\n");break;
 case "url-query-parser":{const u=new URL(val("text"));s="URL: "+u.origin+u.pathname+"\n"+[...u.searchParams].map(([k,v])=>k+" = "+v).join("\n");if(!u.searchParams.size)s+="No query parameters found.";break;}
 case "xml-formatter-validator":{const raw=val("text");const doc=new DOMParser().parseFromString(raw,"application/xml");const issue=doc.querySelector("parsererror");if(issue)throw Error("Invalid XML: "+issue.textContent);const serializer=new XMLSerializer();const compact=serializer.serializeToString(doc);let depth=0;s=compact.replace(/></g,">\n<").split("\n").map(line=>{if(/^<\//.test(line))depth=Math.max(0,depth-1);const out="  ".repeat(depth)+line;if(/^<[^!?/][^>]*[^/]?>$/.test(line)&&!line.includes("</"))depth++;return out;}).join("\n");break;}
  case "html-encoder-decoder":{if(val("mode")==="decode"){const e=document.createElement("textarea");e.innerHTML=val("text");s=e.value;}else s=escapeHtml(val("text"));break;}
 case "regex-tester":{const r=new RegExp(val("pattern"),val("flags")),g=new RegExp(r.source,r.flags.includes("g")?r.flags:r.flags+"g"),m=[...val("text").matchAll(g)];s=m.length?m.map(x=>"Match: "+x[0]+" at index "+x.index).join("\n"):"No matches found.";break;}
 case "jwt-decoder":{const p=val("text").trim().split(".");if(p.length!==3)throw Error("A JWT must have three dot-separated parts.");const d=(x:string)=>JSON.parse(decodeURIComponent(Array.from(atob(x.replace(/-/g,"+").replace(/_/g,"/")),c=>"%"+c.charCodeAt(0).toString(16).padStart(2,"0")).join("")));s="Header:\n"+JSON.stringify(d(p[0]),null,2)+"\nPayload:\n"+JSON.stringify(d(p[1]),null,2)+"\n\nDecoding does not verify the signature.";break;}
 case "color-contrast-checker":{const a=lum(val("fg")),b=lum(val("bg")),r=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);s="Contrast ratio: "+r.toFixed(2)+":1\nWCAG AA normal text (4.5:1): "+(r>=4.5?"PASS":"FAIL")+"\nWCAG AA large text (3:1): "+(r>=3?"PASS":"FAIL")+"\nWCAG AAA normal text (7:1): "+(r>=7?"PASS":"FAIL");break;}
 case "css-minifier":s=val("text").replace(/\/\*[\s\S]*?\*\//g,"").replace(/\s+/g," ").replace(/\s*([{}:;,])\s*/g,"$1").replace(/;}/g,"}").trim();break;
 case "json-to-csv":{const a=JSON.parse(val("text"));if(!Array.isArray(a)||!a.every(x=>x&&typeof x==="object"&&!Array.isArray(x)))throw Error("Input must be an array of JSON objects.");const keys=[...new Set(a.flatMap(x=>Object.keys(x)))];const cell=(x:unknown)=>{const z=String(x??"");return /[",\n]/.test(z)?'"'+z.replace(/"/g,'""')+'"':z;};s=[keys.map(cell).join(","),...a.map(row=>keys.map(k=>cell(typeof row[k]==="object"?JSON.stringify(row[k]):row[k])).join(","))].join("\n");break;}
 case "meta-title-checker":{const report=analyzeMetaTitle(val("text"));s="Characters: "+report.characters+"\n"+report.guidance+"\nPreview: "+report.preview;break;}
 case "meta-description-checker":{const report=analyzeMetaDescription(val("text"));s="Characters: "+report.characters+"\n"+report.guidance+"\nPreview: "+report.preview;break;}
 case "keyword-density-checker":{const report=calculateKeywordDensity(val("text"),val("keyword"));s="Word count: "+report.wordCount+"\nKeyword occurrences: "+report.occurrences+"\nApproximate density: "+report.density.toFixed(2)+"%\nUse keywords naturally; no universal ideal density exists.";break;}
 case "robots-txt-generator":s=generateRobotsTxt(val("path"),val("site"));break;
 case "sitemap-generator":s=generateSitemapXml(val("text"));break;
 case "open-graph-preview":s=buildOpenGraphPreview({title:val("title"),description:val("description"),imageUrl:val("image"),pageUrl:val("url")});break;
 case "profit-margin-calculator":{const c=num("cost"),p=num("price");if(!p)throw Error("Selling price cannot be zero.");s="Gross profit: "+(p-c).toFixed(2)+"\nProfit margin: "+((p-c)/p*100).toFixed(2)+"%";break;}
 case "markup-calculator":{const c=num("cost"),r=num("rate");s="Selling price: "+(c*(1+r/100)).toFixed(2)+"\nMarkup amount: "+(c*r/100).toFixed(2);break;}
 case "break-even-calculator":{const f=num("fixed"),p=num("price"),c=num("variable");if(p<=c)throw Error("Selling price must exceed variable cost.");const q=f/(p-c);s="Break-even units: "+Math.ceil(q)+"\nBreak-even revenue: "+(q*p).toFixed(2);break;}
 case "sales-tax-calculator":{const a=num("amount"),r=num("rate")/100;if(r<0)throw Error("Tax rate cannot be negative.");const total=val("mode")==="remove"?a/(1+r):a*(1+r);s=(val("mode")==="remove"?"Before tax: ":"Total including tax: ")+total.toFixed(2)+"\nTax amount: "+(val("mode")==="remove"?a-total:total-a).toFixed(2);break;}
 case "salary-breakdown-calculator":{const a=num("salary"),r=num("rate")/100;if(r<0||r>1)throw Error("Deduction must be between 0 and 100%.");s="Gross monthly: "+a.toFixed(2)+"\nEstimated deduction: "+(a*r).toFixed(2)+"\nEstimated take-home monthly: "+(a*(1-r)).toFixed(2)+"\nEstimated take-home annual: "+(a*(1-r)*12).toFixed(2)+"\nIllustrative estimate only; not a statutory payroll calculation.";break;}
 case "savings-goal-calculator":{const t=num("target"),a=num("saved"),m=num("months");if(m<=0)throw Error("Months must be positive.");s="Remaining amount: "+Math.max(0,t-a).toFixed(2)+"\nMonthly savings needed: "+(Math.max(0,t-a)/m).toFixed(2);break;}
 default:throw Error("Tool not implemented.");
 }
 setOut(s);
 }catch(e){setErr(e instanceof Error?e.message:"Unable to process input.");}};
 if(!fields)return <p className="text-sm text-slate-600">Tool configuration missing.</p>;
 return <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2">{fields.map(f=><label key={f.key} className="block"><span className="mb-1 block text-sm font-semibold text-slate-700">{f.label}</span><input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900" type={f.type||"text"} value={v[f.key]??""} onChange={e=>setV(p=>({...p,[f.key]:e.target.value}))}/></label>)}</div><div className="flex flex-wrap gap-2"><button onClick={run} className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">Run tool</button><button onClick={()=>{setV(Object.fromEntries(fields.map(f=>[f.key,f.value])));setOut("");setErr("");}} className="rounded-xl border px-4 py-2.5 text-sm">Reset</button>{out&&<button onClick={()=>navigator.clipboard?.writeText(out)} className="rounded-xl border px-4 py-2.5 text-sm">Copy result</button>}</div>{err&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{err}</p>}{out&&<div aria-live="polite" className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-base leading-7 text-teal-950 shadow-sm sm:p-5"><pre className="whitespace-pre-wrap break-words font-sans text-base leading-7">{out}</pre></div>}</div>;
}
