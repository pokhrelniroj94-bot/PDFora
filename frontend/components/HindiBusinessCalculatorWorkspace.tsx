"use client";

import { useState } from "react";
import { hindiBusinessConfigs, hindiBusinessToolSlugs, runHindiBusinessTool, type HindiBusinessToolSlug } from "../lib/i18n/hindi-business-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";


const defaults: Record<string, string> = { revenue: "200000", cost: "150000", markup: "30", fixed: "100000", variable: "250", price: "500", rate: "13", gross: "50000", tax: "2500", provident: "3000", other: "500", sales: "100000", hourly: "500", hours: "40", weeks: "48" };

export function isHindiBusinessSlug(slug: string): slug is HindiBusinessToolSlug {
  return (hindiBusinessToolSlugs as readonly string[]).includes(slug);
}

export default function HindiBusinessCalculatorWorkspace({ slug }: { slug: string }) {
  const [values, setValues] = useState<Record<string, string>>(defaults);
  const [copyState, setCopyState] = useState("");
  if (!isHindiBusinessSlug(slug)) return null;
  const config = hindiBusinessConfigs[slug];
  const result = runHindiBusinessTool(slug, values);

  async function copyResult() {
    try { await navigator.clipboard.writeText(result); setCopyState("परिणाम कॉपी हो गया।"); }
    catch { setCopyState("कॉपी नहीं हो सका। ब्राउज़र की क्लिपबोर्ड अनुमति जाँचें।"); }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-black text-slate-950">{config.title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {config.fields.map(([key, text]) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">{text}</span>
            <input className={field} type="number" inputMode="decimal" min="0" step="any" value={values[key] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} />
          </label>
        ))}
      </div>
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite">
        <h3 className="text-sm font-bold text-teal-950">परिणाम</h3>
        <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-teal-950">{result}</pre>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => { setValues({}); setCopyState(""); }}>सभी मान साफ़ करें</button>
        <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => { setValues(defaults); setCopyState(""); }}>उदाहरण मान वापस लाएँ</button>
        <button type="button" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={copyResult}>परिणाम कॉपी करें</button>
      </div>
      {copyState && <p role="status" className="text-sm text-slate-600">{copyState}</p>}
      <p className="text-xs leading-5 text-slate-500">ये सामान्य गणितीय अनुमान हैं। कर, लेखांकन, वेतन नीति या वास्तविक व्यावसायिक निर्णय से पहले लागू नियम और आधिकारिक अभिलेख जाँचें।</p>
    </section>
  );
}
