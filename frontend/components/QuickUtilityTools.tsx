"use client";

import { useState } from "react";
import { bmi, bmr, businessDaysInclusive, gcd } from "../lib/catalog-calculations";
import { addCalendarDays } from "../lib/date-time-calculations";

type Values = Record<string, string>;
const defaults: Record<string, Values> = {
"word-frequency-counter":{text:"Tools save time. Useful tools save time."},
"reading-time-calculator":{text:"Paste your article here.",wpm:"200"},
"line-counter":{text:"First line\nSecond line\n\nFirst line"},
"sentence-counter":{text:"This is one sentence. Here is another! Is this the third?"},
"email-extractor":{text:"Contact hello@example.com or support@example.org"},
"url-extractor":{text:"Visit https://example.com and https://example.org/help"},
"phone-number-extractor":{text:"Call +977-9812345678 or 01-5551234"},
"number-extractor":{text:"Invoice 2026 total 1250.50, tax 13%"},
"hashtag-extractor":{text:"Launching #PDFora today! #productivity #tools"},
"remove-duplicate-words":{text:"the the quick brown fox fox"},
"find-replace-text":{text:"Hello world. Hello again.",find:"Hello",replace:"Hi"},
"text-to-binary":{text:"Hello"},"binary-to-text":{text:"01001000 01101001"},
"text-to-hex":{text:"Hello"},"hex-to-text":{text:"48 65 6c 6c 6f"},
"morse-code-translator":{text:"SOS HELP",mode:"encode"},
"palindrome-checker":{text:"Never odd or even"},"acronym-generator":{text:"National Aeronautics and Space Administration"},
"camel-case-converter":{text:"Convert this phrase"},"snake-case-converter":{text:"Convert this phrase"},"kebab-case-converter":{text:"Convert this phrase"},
"html-tag-stripper":{text:"<h1>Hello</h1><p>Welcome <b>back</b>.</p>"},
"csv-to-json":{text:"name,age\nAsha,22\nRavi,25"},"json-to-yaml":{text:'{"name":"Asha","age":22,"active":true}'},
"json-escape-unescape":{text:"Line one\nLine two",mode:"escape"},"url-validator":{text:"https://example.com/path?q=1"},
"email-validator":{text:"hello@example.com"},"password-strength-checker":{text:"Example-Strong-Password-2026"},
"bmi-calculator":{weight:"65",height:"170"},"bmr-calculator":{weight:"65",height:"170",age:"25",sex:"male"},
"tip-calculator":{bill:"2500",tip:"10",people:"2"},"split-bill-calculator":{bill:"3000",extra:"0",people:"3"},
"simple-interest-calculator":{principal:"10000",rate:"8",years:"3"},"commission-calculator":{sales:"100000",rate:"5"},
"hourly-to-salary-calculator":{wage:"15",hours:"40"},"percentage-of-number-calculator":{value:"250",rate:"15"},
"gcd-lcm-calculator":{a:"24",b:"36"},"prime-number-checker":{n:"97"},
"random-number-generator":{min:"1",max:"100",count:"5"},"dice-roller":{count:"2"},
"unix-timestamp-converter":{text:"1793520000"},"date-add-subtract-calculator":{date:"2026-11-01",days:"30"},
"business-days-calculator":{start:"2026-11-01",end:"2026-11-30"},
"px-rem-converter":{value:"24",root:"16",mode:"px-to-rem"},
"aspect-ratio-calculator":{width:"1920",height:"1080"},"color-converter":{text:"#0f766e"},
"css-gradient-generator":{a:"#0f766e",b:"#38bdf8",angle:"135"},"roman-numeral-converter":{text:"2026"}
};
const labels: Record<string, string> = {text:"Text or input",wpm:"Reading speed (words/min)",find:"Find",replace:"Replace with",mode:"Mode",weight:"Weight (kg)",height:"Height (cm)",age:"Age (years)",sex:"Sex (male/female)",bill:"Bill amount",tip:"Tip (%)",people:"People",extra:"Extra amount",principal:"Principal",rate:"Rate (%)",years:"Years",sales:"Sales amount",wage:"Hourly wage",hours:"Hours per week",value:"Value",a:"First value / colour",b:"Second value / colour",n:"Integer",min:"Minimum",max:"Maximum",count:"Count",date:"Starting date",days:"Days to add/subtract",start:"Start date",end:"End date",root:"Root font size (px)",width:"Width (px)",angle:"Angle (degrees)"};
const numeric = new Set(["wpm","weight","height","age","bill","tip","people","extra","principal","rate","years","sales","wage","hours","value","a","b","n","min","max","count","days","root","width","angle"]);
const words=(s:string)=>s.trim().split(/\s+/).filter(Boolean);
const tokens=(s:string)=>s.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase().match(/[a-z0-9]+/g)||[];
const morse:Record<string,string>={a:".-",b:"-...",c:"-.-.",d:"-..",e:".",f:"..-.",g:"--.",h:"....",i:"..",j:".---",k:"-.-",l:".-..",m:"--",n:"-.",o:"---",p:".--.",q:"--.-",r:".-.",s:"...",t:"-",u:"..-",v:"...-",w:".--",x:"-..-",y:"-.--",z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----."," ":"/"};
const romanPairs:[number,string][]=[[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
function toRoman(value:number){let n=value,out="";for(const [v,s] of romanPairs)while(n>=v){out+=s;n-=v;}return out;}
function fromRoman(s:string){const map:Record<string,number>={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};let n=0;for(let i=0;i<s.length;i++){const v=map[s[i]],next=map[s[i+1]]||0;if(!v)throw Error("Invalid Roman numeral.");n+=v<next?-v:v;}if(n<1||n>3999||toRoman(n)!==s)throw Error("Use a canonical Roman numeral from I to MMMCMXCIX.");return n;}
export default function QuickUtilityTools({slug}:{slug:string}) {
 const initial=defaults[slug]||{text:""};const [v,setV]=useState<Values>(initial);const [out,setOut]=useState("");const [error,setError]=useState("");
 const get=(k:string)=>v[k]??"";const n=(k:string)=>{const x=Number(get(k));if(!Number.isFinite(x))throw Error("Enter valid numbers.");return x;};
 const run=()=>{setError("");setOut("");try{const t=get("text");let result="";
 switch(slug){
 case "word-frequency-counter":{const m=new Map<string,number>();words(t.toLowerCase().replace(/[^\p{L}\p{N}'-]+/gu," ")).forEach(w=>m.set(w,(m.get(w)||0)+1));result=[...m].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([w,c])=>w+" — "+c).join("\n")||"No words found.";break;}
 case "reading-time-calculator":{const count=words(t).length,wpm=Math.max(1,n("wpm"));result=count+" words\nEstimated reading time: "+(count===0?"0 seconds":count/wpm<1?Math.max(1,Math.ceil(count/wpm*60))+" seconds":(count/wpm).toFixed(1)+" minutes");break;}
 case "line-counter":{const a=t.length?t.split(/\r?\n/):[];result="Total lines: "+a.length+"\nNon-empty: "+a.filter(x=>x.trim()).length+"\nUnique: "+new Set(a).size;break;}
 case "sentence-counter":{const a=t.trim().split(/[.!?]+(?=\s|$)/).filter(x=>x.trim()),w=words(t).length;result="Sentences: "+a.length+"\nWords: "+w+"\nAverage words per sentence: "+(a.length?(w/a.length).toFixed(1):"0");break;}
 case "email-extractor":result=[...new Set(t.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)||[])].join("\n")||"No email addresses found.";break;
 case "url-extractor":result=[...new Set(t.match(/https?:\/\/[^\s<>()\[\]{}"']+/gi)||[])].join("\n")||"No URLs found.";break;
 case "phone-number-extractor":result=[...new Set(t.match(/(?:\+?\d[\d\s().-]{6,}\d)/g)||[])].map(x=>x.trim()).join("\n")||"No phone-like numbers found.";break;
 case "number-extractor":result=(t.match(/[-+]?\d+(?:[,.]\d+)?/g)||[]).join("\n")||"No numbers found.";break;
 case "hashtag-extractor":result=[...new Set(t.match(/#[\p{L}\p{N}_]+/gu)||[])].join("\n")||"No hashtags found.";break;
 case "remove-duplicate-words":{const seen=new Set<string>();result=words(t).filter(w=>{const k=w.toLocaleLowerCase();if(seen.has(k))return false;seen.add(k);return true;}).join(" ");break;}
 case "find-replace-text":if(!get("find"))throw Error("Enter the text to find.");result=t.split(get("find")).join(get("replace"));break;
 case "text-to-binary":result=Array.from(new TextEncoder().encode(t)).map(b=>b.toString(2).padStart(8,"0")).join(" ");break;
 case "binary-to-text":{const a=t.trim().split(/[\s,]+/);if(!a.length||a.some(x=>!/^[01]{8}$/.test(x)))throw Error("Enter 8-bit binary bytes separated by spaces.");result=new TextDecoder("utf-8",{fatal:true}).decode(new Uint8Array(a.map(x=>parseInt(x,2))));break;}
 case "text-to-hex":result=Array.from(new TextEncoder().encode(t)).map(b=>b.toString(16).padStart(2,"0")).join(" ");break;
 case "hex-to-text":{const a=t.trim().split(/[\s,:-]+/).filter(Boolean);if(!a.length||a.some(x=>!/^[0-9a-f]{2}$/i.test(x)))throw Error("Enter hexadecimal byte pairs, e.g. 48 65 6c 6c 6f.");result=new TextDecoder("utf-8",{fatal:true}).decode(new Uint8Array(a.map(x=>parseInt(x,16))));break;}
 case "morse-code-translator":{if(get("mode")==="decode"){const rev=Object.fromEntries(Object.entries(morse).map(([k,x])=>[x,k]));result=t.trim().split(/\s*\/\s*/).map(p=>p.trim().split(/\s+/).map(x=>rev[x]||"?").join("")).join(" ");}else result=[...t.toLowerCase()].map(c=>morse[c]||"").join(" ");break;}
 case "palindrome-checker":{const x=t.toLowerCase().replace(/[^\p{L}\p{N}]/gu,"");result=x.length>0&&x===Array.from(x).reverse().join("")?"Palindrome":"Not a palindrome";break;}
 case "acronym-generator":result=words(t).map(w=>w[0]?.toUpperCase()||"").join("");break;
 case "camel-case-converter":result=tokens(t).map((w,i)=>i?w[0].toUpperCase()+w.slice(1):w).join("");break;
 case "snake-case-converter":result=tokens(t).join("_");break;
 case "kebab-case-converter":result=tokens(t).join("-");break;
 case "html-tag-stripper":result=new DOMParser().parseFromString(t,"text/html").body.textContent||"";break;
 case "csv-to-json":{const lines=t.split(/\r?\n/).filter(Boolean);if(lines.length<2)throw Error("Provide a header row and at least one data row.");const parse=(line:string)=>{const a:string[]=[];let cell="",q=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'&&q&&line[i+1]==='"'){cell+='"';i++;}else if(c==='"')q=!q;else if(c===","&&!q){a.push(cell);cell="";}else cell+=c;}a.push(cell);return a;};const h=parse(lines[0]);result=JSON.stringify(lines.slice(1).map(line=>{const row=parse(line);return Object.fromEntries(h.map((k,i)=>[k,row[i]??""]));}),null,2);break;}
 case "json-to-yaml":{const obj=JSON.parse(t);const emit=(x:unknown,indent=0):string=>{const pad=" ".repeat(indent);if(Array.isArray(x))return x.map(z=>pad+"- "+(z&&typeof z==="object"?"\n"+emit(z,indent+2):JSON.stringify(z))).join("\n");if(x&&typeof x==="object")return Object.entries(x).map(([k,z])=>pad+k+": "+(z&&typeof z==="object"?"\n"+emit(z,indent+2):JSON.stringify(z))).join("\n");return pad+String(x);};result=emit(obj);break;}
 case "json-escape-unescape":result=get("mode")==="unescape"?JSON.parse(t.trim().startsWith('"')?t.trim():'"'+t+'"'):JSON.stringify(t).slice(1,-1);break;
 case "url-validator":{const u=new URL(t);if(!["http:","https:"].includes(u.protocol))throw Error("Only HTTP and HTTPS URLs are supported.");result="Valid URL\nProtocol: "+u.protocol+"\nHost: "+u.host+"\nPath: "+u.pathname+"\nQuery: "+u.search;break;}
 case "email-validator":result=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t.trim())?"Basic email syntax looks valid. No email was sent.":"Invalid email syntax.";break;
 case "password-strength-checker":{const score=[t.length>=12,/[A-Z]/.test(t),/[a-z]/.test(t),/\d/.test(t),/[^A-Za-z0-9]/.test(t)].filter(Boolean).length;result="Criteria met: "+score+"/5\nAssessment: "+(score>=5?"Strong":score>=3?"Moderate":"Weak")+"\nThis local check does not test breached-password databases.";break;}
 case "bmi-calculator":{const value=bmi(n("weight"),n("height"));result="BMI: "+value.toFixed(1)+"\nAdult screening category: "+(value<18.5?"Underweight":value<25?"Healthy range":value<30?"Overweight":"Obesity range")+"\nBMI is not a diagnosis.";break;}
 case "bmr-calculator":{const value=bmr(n("weight"),n("height"),n("age"),get("sex").toLowerCase()==="female");result="Estimated BMR: "+Math.round(value)+" kcal/day (Mifflin–St Jeor estimate).";break;}
 case "tip-calculator":{const b=n("bill"),r=n("tip"),p=n("people");if(b<0||r<0||p<1)throw Error("Enter non-negative bill/tip and at least one person.");result="Tip: "+(b*r/100).toFixed(2)+"\nTotal: "+(b*(1+r/100)).toFixed(2)+"\nPer person: "+(b*(1+r/100)/p).toFixed(2);break;}
 case "split-bill-calculator":{const b=n("bill")+n("extra"),p=n("people");if(b<0||p<1)throw Error("Enter a non-negative bill and at least one person.");result="Total: "+b.toFixed(2)+"\nPer person: "+(b/p).toFixed(2);break;}
 case "simple-interest-calculator":{const p=n("principal"),r=n("rate"),y=n("years");if(p<0||r<0||y<0)throw Error("Values cannot be negative.");const i=p*r*y/100;result="Simple interest: "+i.toFixed(2)+"\nTotal amount: "+(p+i).toFixed(2);break;}
 case "commission-calculator":{const s=n("sales"),r=n("rate");if(s<0||r<0)throw Error("Values cannot be negative.");result="Commission: "+(s*r/100).toFixed(2);break;}
 case "hourly-to-salary-calculator":{const w=n("wage"),h=n("hours");if(w<0||h<0||h>168)throw Error("Enter valid wage and 0–168 hours/week.");const y=w*h*52;result="Weekly: "+(w*h).toFixed(2)+"\nMonthly average: "+(y/12).toFixed(2)+"\nAnnual: "+y.toFixed(2)+"\nBefore tax; assumes 52 paid weeks.";break;}
 case "percentage-of-number-calculator":{const x=n("value"),r=n("rate");result=r+"% of "+x+" = "+(x*r/100).toFixed(4);break;}
 case "gcd-lcm-calculator":{const a=n("a"),b=n("b");if(!Number.isInteger(a)||!Number.isInteger(b)||(!a&&!b))throw Error("Enter integers; at least one must be non-zero.");const g=gcd(a,b);result="GCD: "+g+"\nLCM: "+(a&&b?Math.abs(a*b)/g:0);break;}
 case "prime-number-checker":{const x=n("n");if(!Number.isInteger(x)||x<0)throw Error("Enter a non-negative integer.");let prime=x>=2;for(let i=2;i<=Math.sqrt(x)&&prime;i++)if(x%i===0)prime=false;result=x+" is "+(prime?"prime":"not prime");break;}
 case "random-number-generator":{const min=Math.ceil(n("min")),max=Math.floor(n("max")),count=Math.max(1,Math.min(100,Math.floor(n("count"))));if(max<min||max-min+1>4294967296)throw Error("Enter a valid integer range up to 2^32 values.");const range=max-min+1,limit=Math.floor(4294967296/range)*range;const pick=()=>{let x=0;do{x=crypto.getRandomValues(new Uint32Array(1))[0];}while(x>=limit);return min+x%range;};result=Array.from({length:count},pick).join("\n");break;}
 case "dice-roller":{const count=Math.max(1,Math.min(100,Math.floor(n("count")))),rolls=Array.from({length:count},()=>crypto.getRandomValues(new Uint32Array(1))[0]%6+1);result="Rolls: "+rolls.join(", ")+"\nTotal: "+rolls.reduce((a,b)=>a+b,0);break;}
 case "unix-timestamp-converter":{const x=Number(t),d=new Date(Math.abs(x)<1e12?x*1000:x);if(!Number.isFinite(x)||isNaN(+d))throw Error("Enter a valid Unix timestamp.");result="UTC: "+d.toISOString()+"\nLocal: "+d.toString();break;}
 case "date-add-subtract-calculator":{result=addCalendarDays(get("date"),n("days"));break;}
 case "business-days-calculator":result="Weekdays (inclusive): "+businessDaysInclusive(get("start"),get("end"))+"\nPublic holidays are not excluded.";break;
 case "px-rem-converter":{const x=n("value"),root=n("root");if(root<=0)throw Error("Root font size must be positive.");result=get("mode")==="rem-to-px"?(x*root).toFixed(4)+" px":(x/root).toFixed(4)+" rem";break;}
 case "aspect-ratio-calculator":{const w=n("width"),h=n("height");if(w<=0||h<=0)throw Error("Width and height must be positive.");const g=gcd(Math.round(w*1000),Math.round(h*1000));result="Aspect ratio: "+Math.round(w*1000)/g+":"+Math.round(h*1000)/g+"\nDecimal: "+(w/h).toFixed(5);break;}
 case "color-converter":{const m=t.trim().match(/^#?([0-9a-f]{6})$/i);if(!m)throw Error("Enter a six-digit HEX colour.");const x=parseInt(m[1],16),r=x>>16,g=(x>>8)&255,b=x&255,rr=r/255,gg=g/255,bb=b/255,mx=Math.max(rr,gg,bb),mn=Math.min(rr,gg,bb),delta=mx-mn;let h=0;if(delta){if(mx===rr)h=60*(((gg-bb)/delta)%6);else if(mx===gg)h=60*((bb-rr)/delta+2);else h=60*((rr-gg)/delta+4);}if(h<0)h+=360;const l=(mx+mn)/2,s=delta?delta/(1-Math.abs(2*l-1)):0;result="HEX: #"+m[1].toUpperCase()+"\nRGB: "+r+", "+g+", "+b+"\nHSL: "+Math.round(h)+"°, "+Math.round(s*100)+"%, "+Math.round(l*100)+"%";break;}
 case "css-gradient-generator":if(!/^#[0-9a-f]{6}$/i.test(get("a"))||!/^#[0-9a-f]{6}$/i.test(get("b")))throw Error("Choose valid six-digit HEX colours.");result="background: linear-gradient("+n("angle")+"deg, "+get("a")+", "+get("b")+");";break;
 case "roman-numeral-converter":{const x=t.trim();if(/^\d+$/.test(x)){const value=Number(x);if(value<1||value>3999)throw Error("Enter an integer from 1 to 3999.");result=toRoman(value);}else result=String(fromRoman(x.toUpperCase()));break;}
 default:throw Error("This utility is not available yet. Please use the directory to find another tool.");
 }
 setOut(result);
 }catch(e){setError(e instanceof Error?e.message:"Could not process this input.");}};
 if(!initial)return <p className="text-sm text-slate-600">This tool is not configured.</p>;
 return <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
  <div className="grid gap-4 sm:grid-cols-2">{Object.entries(v).map(([key,value])=><label key={key} className="block"><span className="mb-1 block text-sm font-semibold text-slate-700">{labels[key]||key}</span><input className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900" type={key==="date"||key==="start"||key==="end"?"date":slug==="css-gradient-generator"&&(key==="a"||key==="b")?"color":"text"} inputMode={numeric.has(key)?"decimal":"text"} value={value} onChange={e=>setV(p=>({...p,[key]:e.target.value}))}/></label>)}</div>
  <div className="flex flex-wrap gap-2"><button onClick={run} className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">Run tool</button><button onClick={()=>{setV(initial);setOut("");setError("");}} className="rounded-xl border px-4 py-2.5 text-sm">Reset</button>{out&&<button onClick={()=>navigator.clipboard?.writeText(out)} className="rounded-xl border px-4 py-2.5 text-sm">Copy result</button>}</div>
  {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  {out&&<div aria-live="polite" className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-base leading-7 text-teal-950 shadow-sm sm:p-5"><pre className="whitespace-pre-wrap break-words font-sans text-base leading-7">{out}</pre></div>}
  <p className="text-xs leading-5 text-slate-500">Runs in your browser. Check important results independently. This tool does not send your input to a server.</p>
 </div>;
}
