"use client";

import { useState } from "react";
import { hindiBusinessToolSlugs, runHindiBusinessTool, type HindiBusinessToolSlug } from "../lib/i18n/hindi-business-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";

export const hindiBusinessConfigs: Record<HindiBusinessToolSlug, { title: string; description: string; fields: Array<[string, string]> }> = {
  "profit-margin-calculator": { title: "लाभ मार्जिन कैलकुलेटर", description: "बिक्री राशि और लागत से लाभ या हानि तथा बिक्री पर आधारित मार्जिन निकालें।", fields: [["revenue", "बिक्री राशि (NPR)"], ["cost", "कुल लागत (NPR)"]] },
  "markup-calculator": { title: "मार्कअप कैलकुलेटर", description: "लागत पर मार्कअप प्रतिशत जोड़कर बिक्री मूल्य और मार्जिन निकालें।", fields: [["cost", "लागत (NPR)"], ["markup", "लागत पर जोड़ा जाने वाला प्रतिशत (%)"]] },
  "break-even-calculator": { title: "ब्रेक-ईवन कैलकुलेटर", description: "स्थिर लागत, प्रति इकाई परिवर्ती लागत और बिक्री मूल्य से लागत निकलने की मात्रा जानें।", fields: [["fixed", "कुल स्थिर लागत (NPR)"], ["variable", "प्रति इकाई परिवर्ती लागत (NPR)"], ["price", "प्रति इकाई बिक्री मूल्य (NPR)"]] },
  "sales-tax-calculator": { title: "बिक्री कर कैलकुलेटर", description: "आपके दिए कर दर से कर की राशि और कर सहित मूल्य निकालें।", fields: [["price", "कर से पहले का मूल्य (NPR)"], ["rate", "कर दर (%)"]] },
  "salary-breakdown-calculator": { title: "वेतन विवरण कैलकुलेटर", description: "मासिक कुल वेतन से आपके दिए कर, भविष्य निधि और अन्य कटौतियाँ घटाएँ।", fields: [["gross", "मासिक कुल वेतन (NPR)"], ["tax", "कर कटौती (NPR)"], ["provident", "भविष्य निधि कटौती (NPR)"], ["other", "अन्य कटौती (NPR)"]] },
  "commission-calculator": { title: "कमीशन कैलकुलेटर", description: "बिक्री राशि और कमीशन प्रतिशत से कमीशन की राशि निकालें।", fields: [["sales", "बिक्री राशि (NPR)"], ["rate", "कमीशन दर (%)"]] },
  "hourly-to-salary-calculator": { title: "प्रति घंटा दर से वेतन कैलकुलेटर", description: "प्रति घंटा दर, साप्ताहिक कार्य-घंटे और वर्ष के कार्य-सप्ताह से साप्ताहिक, मासिक और वार्षिक आय का अनुमान लगाएँ।", fields: [["hourly", "प्रति घंटा दर (NPR)"], ["hours", "साप्ताहिक कार्य-घंटे"], ["weeks", "वर्ष में कार्य-सप्ताह"]] },
};

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
