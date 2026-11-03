"use client";

import { useMemo, useState } from "react";

const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-600 focus:outline-none";
const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const panel = "rounded-2xl border border-slate-200 bg-white p-4 sm:p-6";
const esc = (value: string) => value.replace(/[&<>"]/g, (c) => c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;");

function ResumeKeywordChecker() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState(false);
  const analysis = useMemo(() => {
    const stop = new Set(["about","above","after","again","against","along","also","among","and","any","are","around","because","been","before","being","below","between","both","but","can","could","did","does","during","each","few","for","from","further","had","has","have","having","here","how","into","its","more","most","other","our","out","over","same","should","some","such","than","that","the","their","them","then","there","these","they","this","those","through","under","until","very","was","were","what","when","where","which","while","who","will","with","would","you","your"]);
    const tokens = (s: string) => (s.toLowerCase().match(/[a-z][a-z+#.-]{2,}/g) ?? []).filter((w) => !stop.has(w));
    const resumeWords = tokens(resume);
    const jobWords = tokens(job);
    const freq = new Map<string, number>();
    jobWords.forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1));
    const terms = [...freq].filter(([, count]) => count >= 1).sort((a,b) => b[1]-a[1]).slice(0, 35).map(([w]) => w);
    const found = terms.filter((w) => resumeWords.includes(w));
    const missing = terms.filter((w) => !resumeWords.includes(w));
    const sections = [
      ["Contact details", /\b(email|@|phone|mobile|linkedin)\b/i.test(resume)],
      ["Professional summary", /\b(summary|profile|objective)\b/i.test(resume)],
      ["Work experience", /\b(experience|employment|work history)\b/i.test(resume)],
      ["Education", /\b(education|university|college|degree)\b/i.test(resume)],
      ["Skills", /\b(skills|competencies|technical skills)\b/i.test(resume)],
      ["Projects or certifications", /\b(projects?|certifications?|licenses?)\b/i.test(resume)]
    ] as [string, boolean][];
    const quantified = (resume.match(/\b\d+(?:%|\+|k|m|\s*(?:people|clients|projects|users|hours|years))?\b/gi) ?? []).length;
    return { terms, found, missing, sections, quantified, wordCount: resume.trim() ? resume.trim().split(/\s+/).length : 0, coverage: terms.length ? Math.round(found.length / terms.length * 100) : 0 };
  }, [resume, job]);

  return <div className="space-y-4">
    <div className={panel}><label className="block"><span className={label}>Paste your resume text</span><textarea className={input+" min-h-56"} value={resume} onChange={(e)=>{setResume(e.target.value);setResult(false);}} placeholder="Paste the text from your CV or resume here. Remove personal contact details if you do not want to process them in this browser session."/></label><p className="mt-2 text-xs text-slate-500">Analysis runs locally in your browser. No file upload or server-side resume storage.</p></div>
    <div className={panel}><label className="block"><span className={label}>Paste the target job description</span><textarea className={input+" min-h-48"} value={job} onChange={(e)=>{setJob(e.target.value);setResult(false);}} placeholder="Paste the job description to compare relevant terms and skills."/></label></div>
    <button type="button" onClick={()=>setResult(true)} disabled={!resume.trim()||!job.trim()} className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Check resume alignment</button>
    {result && <section className={panel} aria-live="polite">
      <h2 className="text-xl font-black text-slate-950">Resume review</h2>
      <p className="mt-2 text-sm text-slate-600">Keyword coverage indicator: <strong>{analysis.coverage}%</strong> ({analysis.found.length} of {analysis.terms.length} selected job-description terms). This is a simple text comparison, not an actual ATS score or a hiring prediction.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Resume words</p><p className="text-2xl font-black">{analysis.wordCount}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Quantified details</p><p className="text-2xl font-black">{analysis.quantified}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Matched terms</p><p className="text-2xl font-black">{analysis.found.length}/{analysis.terms.length}</p></div></div>
      <h3 className="mt-5 font-bold">Resume sections detected</h3><ul className="mt-2 grid gap-2 sm:grid-cols-2">{analysis.sections.map(([name,ok])=><li key={name} className="text-sm">{ok?"✓":"○"} {name}: {ok?"Detected":"Not clearly detected"}</li>)}</ul>
      <h3 className="mt-5 font-bold">Job-description terms to review</h3><p className="mt-1 text-xs text-slate-500">Only add a skill or phrase if it accurately describes your experience.</p><div className="mt-2 flex flex-wrap gap-2">{analysis.missing.length?analysis.missing.map((w)=><span key={w} className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-900">{w}</span>):<span className="text-sm text-emerald-700">All selected terms appear in the resume text.</span>}</div>
    </section>}
  </div>;
}

function InvoiceMaker() {
  const [type,setType]=useState("Invoice");
  const [number,setNumber]=useState("INV-001");
  const [date,setDate]=useState(()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");});
  const [business,setBusiness]=useState("");
  const [customer,setCustomer]=useState("");
  const [currency,setCurrency]=useState("NPR");
  const [tax,setTax]=useState("0");
  const [description,setDescription]=useState("Professional services");
  const [quantity,setQuantity]=useState("1");
  const [price,setPrice]=useState("1000");
  const [notes,setNotes]=useState("Thank you for your business.");
  const qty=Math.max(0,Number(quantity)||0), unit=Math.max(0,Number(price)||0), rate=Math.min(100,Math.max(0,Number(tax)||0));
  const subtotal=qty*unit, taxAmount=subtotal*rate/100, total=subtotal+taxAmount;
  const valid=!!business.trim()&&!!customer.trim()&&!!number.trim()&&qty>0&&unit>=0;
  const print=()=>{
    if(!valid)return;
    const w=window.open("","_blank");
    if(!w)return;
    const money=(n:number)=>n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
    const html="<!doctype html><html><head><meta charset='utf-8'><title>"+esc(type+" "+number)+"</title><style>@page{size:A4;margin:18mm}body{font:14px Arial,sans-serif;color:#172033}h1{font-size:28px}header{display:flex;justify-content:space-between;border-bottom:2px solid #0f766e;padding-bottom:18px}.muted{color:#64748b}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:28px 0}table{width:100%;border-collapse:collapse;margin-top:28px}th,td{text-align:left;padding:12px;border-bottom:1px solid #e2e8f0}th{background:#f1f5f9}.right{text-align:right}.total{font-size:20px;font-weight:bold;color:#0f766e}footer{margin-top:42px;white-space:pre-wrap;color:#475569}</style></head><body><header><div><h1>"+esc(type)+"</h1><strong>"+esc(business)+"</strong></div><div class='right'><b>"+esc(number)+"</b><p class='muted'>Date: "+esc(date)+"</p></div></header><div class='grid'><div><p class='muted'>BILL TO</p><strong>"+esc(customer)+"</strong></div><div class='right'><p class='muted'>CURRENCY</p><strong>"+esc(currency)+"</strong></div></div><table><thead><tr><th>Description</th><th class='right'>Qty</th><th class='right'>Unit price</th><th class='right'>Amount</th></tr></thead><tbody><tr><td>"+esc(description)+"</td><td class='right'>"+qty+"</td><td class='right'>"+money(unit)+"</td><td class='right'>"+money(subtotal)+"</td></tr></tbody></table><table><tbody><tr><td>Subtotal</td><td class='right'>"+currency+" "+money(subtotal)+"</td></tr><tr><td>Tax ("+rate+"%)</td><td class='right'>"+currency+" "+money(taxAmount)+"</td></tr><tr><td class='total'>Total</td><td class='right total'>"+currency+" "+money(total)+"</td></tr></tbody></table><footer>"+esc(notes)+"</footer><script>window.onload=()=>{window.focus();window.print()}<\/script></body></html>";
    w.document.open();w.document.write(html);w.document.close();
  };
  return <div className="grid gap-5 lg:grid-cols-2">
    <div className="space-y-3"><div className="grid gap-3 sm:grid-cols-2"><label><span className={label}>Document type</span><select className={input} value={type} onChange={e=>setType(e.target.value)}><option>Invoice</option><option>Quotation</option></select></label><label><span className={label}>Document number</span><input className={input} value={number} onChange={e=>setNumber(e.target.value)} maxLength={40}/></label><label><span className={label}>Date</span><input className={input} type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label><span className={label}>Currency</span><select className={input} value={currency} onChange={e=>setCurrency(e.target.value)}>{["NPR","USD","INR","EUR","GBP"].map(x=><option key={x}>{x}</option>)}</select></label></div>
    <label className="block"><span className={label}>Business / seller name</span><input className={input} value={business} onChange={e=>setBusiness(e.target.value)} maxLength={100}/></label><label className="block"><span className={label}>Customer name</span><input className={input} value={customer} onChange={e=>setCustomer(e.target.value)} maxLength={100}/></label><label className="block"><span className={label}>Item / service description</span><input className={input} value={description} onChange={e=>setDescription(e.target.value)} maxLength={160}/></label><div className="grid grid-cols-2 gap-3"><label><span className={label}>Quantity</span><input className={input} type="number" min="0.01" step="0.01" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label><label><span className={label}>Unit price</span><input className={input} type="number" min="0" step="0.01" value={price} onChange={e=>setPrice(e.target.value)}/></label></div><label className="block"><span className={label}>Tax rate (%)</span><input className={input} type="number" min="0" max="100" step="0.01" value={tax} onChange={e=>setTax(e.target.value)}/></label><label className="block"><span className={label}>Notes / payment terms</span><textarea className={input} value={notes} onChange={e=>setNotes(e.target.value)} rows={3} maxLength={1000}/></label>
    <button type="button" disabled={!valid} onClick={print} className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">Print / Save as PDF</button><p className="text-xs text-slate-500">Creates a printable draft in your browser. Verify tax, PAN/VAT details and legal invoice requirements before issuing it as an official tax invoice.</p></div>
    <aside className={panel}><p className="text-xs font-bold uppercase tracking-widest text-teal-700">Live preview</p><h2 className="mt-2 text-2xl font-black">{type}</h2><p className="mt-1 text-sm text-slate-500">{number} · {date}</p><div className="mt-6 border-t pt-4"><p className="text-xs text-slate-500">FROM</p><p className="font-semibold">{business||"Your business name"}</p><p className="mt-4 text-xs text-slate-500">BILL TO</p><p className="font-semibold">{customer||"Customer name"}</p></div><div className="mt-6 border-t pt-4 text-sm"><p>{description||"Item description"} × {qty}</p><p className="mt-2">Subtotal <span className="float-right">{currency} {subtotal.toFixed(2)}</span></p><p className="mt-1">Tax ({rate}%) <span className="float-right">{currency} {taxAmount.toFixed(2)}</span></p><p className="mt-3 border-t pt-3 text-lg font-black">Total <span className="float-right">{currency} {total.toFixed(2)}</span></p></div></aside>
  </div>;
}

export default function NewTools({slug}:{slug:string}) {
  if(slug==="ats-resume-checker") return <ResumeKeywordChecker/>;
  if(slug==="invoice-quotation-generator") return <InvoiceMaker/>;
  return <p className="text-sm text-slate-600">This tool is not available.</p>;
}
