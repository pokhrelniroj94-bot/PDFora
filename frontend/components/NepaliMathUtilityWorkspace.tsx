"use client";

import { useState } from "react";
import { runNepaliMathTool, type NepaliMathToolSlug } from "../lib/i18n/nepali-math-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const labels: Record<NepaliMathToolSlug, { title: string; description: string }> = {
  "percentage-change-calculator": { title: "प्रतिशत परिवर्तन क्याल्कुलेटर", description: "सुरुको र नयाँ मानबाट प्रतिशत वृद्धि वा कमी निकाल्नुहोस्।" },
  "average-calculator": { title: "औसत क्याल्कुलेटर", description: "अल्पविराम वा space ले छुट्याएका संख्याको औसत निकाल्नुहोस्।" },
  "ratio-simplifier": { title: "अनुपात सरल बनाउने", description: "दुई पूर्णांकको अनुपातलाई सबैभन्दा सरल रूपमा बदल्नुहोस्।" },
  "fraction-calculator": { title: "भिन्न क्याल्कुलेटर", description: "दुई भिन्न जोड्नुहोस्, घटाउनुहोस्, गुणन वा भाग गर्नुहोस्।" },
  "percentage-of-number-calculator": { title: "संख्याको प्रतिशत क्याल्कुलेटर", description: "कुनै संख्याको चाहिएको प्रतिशत निकाल्नुहोस्।" },
  "gcd-lcm-calculator": { title: "GCD तथा LCM क्याल्कुलेटर", description: "दुई पूर्णांकको महत्तम समापवर्तक र लघुत्तम समापवर्त्य निकाल्नुहोस्।" },
  "prime-number-checker": { title: "अभाज्य संख्या जाँच", description: "कुनै पूर्णांक अभाज्य हो वा होइन जाँच गर्नुहोस्।" },
  "unit-converter": { title: "एकाइ रूपान्तरण", description: "लम्बाइ र तौलका सामान्य एकाइहरूबीच रूपान्तरण गर्नुहोस्।" },
};

const inputLabels: Record<string, string> = {
  from: "सुरुको मान", to: "नयाँ मान", numbers: "संख्याहरू", a: "पहिलो मान / अंश १",
  b: "दोस्रो मान / हर १", c: "अंश २", d: "हर २", number: "संख्या",
  percentage: "प्रतिशत", amount: "रकम / परिमाण",
};

export default function NepaliMathUtilityWorkspace({ slug }: { slug: string }) {
  const [values, setValues] = useState<Record<string, string>>({
    from: "100", to: "125", numbers: "10, 20, 30", a: "1", b: "2", c: "1", d: "3",
    number: "100", percentage: "15", amount: "1", operation: "add", fromUnit: "km", toUnit: "m",
  });
  const [copyState, setCopyState] = useState("");
  if (!(slug in labels)) return null;
  const toolSlug = slug as NepaliMathToolSlug;
  const config = labels[toolSlug];
  const update = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const result = runNepaliMathTool(toolSlug, values);

  const numberField = (key: string, label = inputLabels[key], step = "any") => (
    <label className="block" key={key}><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span><input className={field} type="number" step={step} value={values[key] ?? ""} onChange={(event) => update(key, event.target.value)} /></label>
  );
  const unitOptions = [
    ["km", "किलोमिटर (km)"], ["m", "मिटर (m)"], ["cm", "सेन्टिमिटर (cm)"], ["mm", "मिलिमिटर (mm)"], ["ft", "फिट (ft)"], ["in", "इन्च (in)"],
    ["kg", "किलोग्राम (kg)"], ["g", "ग्राम (g)"], ["lb", "पाउन्ड (lb)"],
  ];

  async function copyResult() {
    try { await navigator.clipboard.writeText(result); setCopyState("नतिजा कपी भयो।"); }
    catch { setCopyState("कपी गर्न सकिएन। ब्राउजरको clipboard अनुमति जाँच गर्नुहोस्।"); }
  }

  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-black text-slate-950">{config.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p></div>
      {toolSlug === "percentage-change-calculator" && <div className="grid gap-3 sm:grid-cols-2">{numberField("from")}{numberField("to")}</div>}
      {toolSlug === "average-calculator" && <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">संख्याहरू (comma वा space ले छुट्याउनुहोस्)</span><textarea className={field + " min-h-28"} value={values.numbers} onChange={(event) => update("numbers", event.target.value)} /></label>}
      {(toolSlug === "ratio-simplifier" || toolSlug === "gcd-lcm-calculator") && <div className="grid gap-3 sm:grid-cols-2">{numberField("a", "पहिलो पूर्णांक", "1")}{numberField("b", "दोस्रो पूर्णांक", "1")}</div>}
      {toolSlug === "fraction-calculator" && <div className="space-y-3"><div className="grid gap-3 sm:grid-cols-2">{numberField("a", "भिन्न १ को अंश", "1")}{numberField("b", "भिन्न १ को हर", "1")}{numberField("c", "भिन्न २ को अंश", "1")}{numberField("d", "भिन्न २ को हर", "1")}</div><label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">गणनाको प्रकार</span><select className={field} value={values.operation} onChange={(event) => update("operation", event.target.value)}><option value="add">जोड (+)</option><option value="subtract">घटाउ (−)</option><option value="multiply">गुणन (×)</option><option value="divide">भाग (÷)</option></select></label></div>}
      {toolSlug === "percentage-of-number-calculator" && <div className="grid gap-3 sm:grid-cols-2">{numberField("number")}{numberField("percentage")}</div>}
      {toolSlug === "prime-number-checker" && numberField("number", "पूर्णांक", "1")}
      {toolSlug === "unit-converter" && <div className="grid gap-3 sm:grid-cols-2">{numberField("amount")}<label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">बाट</span><select className={field} value={values.fromUnit} onChange={(event) => update("fromUnit", event.target.value)}>{unitOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">मा</span><select className={field} value={values.toUnit} onChange={(event) => update("toUnit", event.target.value)}>{unitOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>}
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><h3 className="text-sm font-bold text-teal-950">नतिजा</h3><pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-teal-950">{result}</pre></div>
      <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => { setValues({}); setCopyState(""); }}>मानहरू हटाउनुहोस्</button><button type="button" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={copyResult}>नतिजा कपी गर्नुहोस्</button></div>
      {copyState && <p role="status" className="text-sm text-slate-600">{copyState}</p>}
      <p className="text-xs leading-5 text-slate-500">गणना प्रविष्ट गरिएको मानमा आधारित हुन्छ। वित्तीय वा शैक्षिक निर्णयअघि नतिजा पुनः जाँच गर्नुहोस्।</p>
    </section>
  );
}
