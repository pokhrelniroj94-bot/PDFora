"use client";

import { useState } from "react";
import { runNepaliBusinessTool, type NepaliBusinessToolSlug } from "../lib/i18n/nepali-business-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const configs: Record<NepaliBusinessToolSlug, { title: string; description: string; fields: Array<[string, string]> }> = {
  "profit-margin-calculator": { title: "नाफा मार्जिन क्याल्कुलेटर", description: "बिक्री रकम र लागतबाट नाफा वा घाटा तथा बिक्रीमा आधारित मार्जिन निकाल्नुहोस्।", fields: [["revenue","बिक्री रकम (NPR)"],["cost","कुल लागत (NPR)"]] },
  "markup-calculator": { title: "Markup क्याल्कुलेटर", description: "लागतमा markup प्रतिशत थपेर बिक्री मूल्य र मार्जिन निकाल्नुहोस्।", fields: [["cost","लागत (NPR)"],["markup","Markup (%)"]] },
  "break-even-calculator": { title: "ब्रेक-इभेन क्याल्कुलेटर", description: "स्थिर लागत, प्रति एकाइ चल लागत र बिक्री मूल्यबाट लागत उठ्ने मात्रा निकाल्नुहोस्।", fields: [["fixed","कुल स्थिर लागत (NPR)"],["variable","प्रति एकाइ चल लागत (NPR)"],["price","प्रति एकाइ बिक्री मूल्य (NPR)"]] },
  "sales-tax-calculator": { title: "बिक्री कर क्याल्कुलेटर", description: "आफूले दिएको करदर प्रयोग गरी कर रकम र करसहितको मूल्य निकाल्नुहोस्।", fields: [["price","करअघिको मूल्य (NPR)"],["rate","करदर (%)"]] },
  "salary-breakdown-calculator": { title: "तलब विवरण क्याल्कुलेटर", description: "मासिक कुल तलबबाट तपाईंले दिएको कर, सञ्चय कोष र अन्य कटौती घटाउनुहोस्।", fields: [["gross","मासिक कुल तलब (NPR)"],["tax","कर कटौती (NPR)"],["provident","सञ्चय कोष/निवृत्तिभरण कटौती (NPR)"],["other","अन्य कटौती (NPR)"]] },
  "commission-calculator": { title: "कमिसन क्याल्कुलेटर", description: "बिक्री रकम र कमिसन प्रतिशतबाट कमिसन रकम निकाल्नुहोस्।", fields: [["sales","बिक्री रकम (NPR)"],["rate","कमिसन दर (%)"]] },
  "hourly-to-salary-calculator": { title: "घण्टाको ज्यालाबाट तलब क्याल्कुलेटर", description: "प्रति घण्टा दर, साप्ताहिक कामको समय र वर्षका काम गर्ने हप्ताबाट अनुमान निकाल्नुहोस्।", fields: [["hourly","प्रति घण्टा दर (NPR)"],["hours","प्रति हप्ता घण्टा"],["weeks","प्रति वर्ष काम गर्ने हप्ता"]] },
};
const defaults: Record<string,string> = { revenue:"200000", cost:"150000", markup:"30", fixed:"100000", variable:"250", price:"500", rate:"13", gross:"50000", tax:"2500", provident:"3000", other:"500", sales:"100000", hourly:"500", hours:"40", weeks:"48" };
export default function NepaliBusinessCalculatorWorkspace({ slug }: { slug: string }) {
  const config = configs[slug as NepaliBusinessToolSlug];
  const [values,setValues] = useState<Record<string,string>>(defaults);
  if (!config) return null;
  const result = runNepaliBusinessTool(slug as NepaliBusinessToolSlug, values);
  return <section className="space-y-4">
    <div><h2 className="text-xl font-black text-slate-950">{config.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p></div>
    <div className="grid gap-3 sm:grid-cols-2">{config.fields.map(([key,label]) => <label key={key} className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span><input className={field} type="number" min="0" step="any" value={values[key] ?? ""} onChange={(event)=>setValues(current=>({...current,[key]:event.target.value}))}/></label>)}</div>
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><h3 className="text-sm font-bold text-teal-950">नतिजा</h3><pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-teal-950">{result}</pre></div>
    <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={()=>setValues(defaults)}>उदाहरण मान पुनः राख्नुहोस्</button>
    <p className="text-xs leading-5 text-slate-500">यी सामान्य गणितीय अनुमान हुन्। कर, लेखा, तलब नीति वा वास्तविक व्यवसायिक निर्णयका लागि लागू नियम र आधिकारिक अभिलेख जाँच गर्नुहोस्।</p>
  </section>;
}
