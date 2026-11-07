"use client";

import { useState } from "react";
import { runNepaliDateTimeTool, type NepaliDateTimeSlug } from "../lib/i18n/nepali-date-time-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const localToday = () => { const now = new Date(); return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10); };
const configs: Record<NepaliDateTimeSlug, { title: string; description: string }> = {
  "age-calculator": { title: "उमेर क्याल्कुलेटर", description: "जन्म मिति र गणना मितिका आधारमा वर्ष, महिना, दिन र कुल दिन निकाल्नुहोस्।" },
  "date-difference-calculator": { title: "मिति अन्तर क्याल्कुलेटर", description: "दुई मितिबीचको दिन, हप्ता र औसत महिनाको अन्तर निकाल्नुहोस्।" },
  "time-duration-calculator": { title: "समय अवधि क्याल्कुलेटर", description: "दुई समयबीचको घण्टा र मिनेट निकाल्नुहोस्; राति पार हुने समय पनि समर्थन गर्छ।" },
};

export default function NepaliDateTimeWorkspace({ slug }: { slug: string }) {
  const toolSlug = slug as NepaliDateTimeSlug;
  const [values, setValues] = useState<Record<string, string>>({
    birth: "2000-01-15", asOf: localToday(),
    start: toolSlug === "time-duration-calculator" ? "09:00" : "2026-01-01",
    end: toolSlug === "time-duration-calculator" ? "17:00" : "2026-11-07",
  });
  const [copied, setCopied] = useState(false);
  const update = (key: string, value: string) => { setValues((current) => ({ ...current, [key]: value })); setCopied(false); };
  const result = runNepaliDateTimeTool(toolSlug, values);
  const config = configs[toolSlug];
  const input = (key: string, label: string, type: "date" | "time") => (
    <label className="block" key={key}><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span><input className={field} type={type} value={values[key] ?? ""} onChange={(event) => update(key, event.target.value)} /></label>
  );
  if (!config) return null;
  async function copy() {
    try { await navigator.clipboard.writeText(result); setCopied(true); }
    catch { setCopied(false); }
  }
  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-black text-slate-950">{config.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p></div>
      {toolSlug === "age-calculator" && <div className="grid gap-3 sm:grid-cols-2">{input("birth", "जन्म मिति", "date")}{input("asOf", "कुन मितिसम्म उमेर निकाल्ने?", "date")}</div>}
      {toolSlug === "date-difference-calculator" && <div className="grid gap-3 sm:grid-cols-2">{input("start", "सुरु मिति", "date")}{input("end", "अन्त्य मिति", "date")}</div>}
      {toolSlug === "time-duration-calculator" && <div className="grid gap-3 sm:grid-cols-2">{input("start", "सुरु समय", "time")}{input("end", "अन्त्य समय", "time")}</div>}
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><h3 className="text-sm font-bold text-teal-950">नतिजा</h3><pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-teal-950">{result}</pre></div>
      <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => { setValues({}); setCopied(false); }}>मानहरू हटाउनुहोस्</button><button type="button" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={copy}>नतिजा कपी गर्नुहोस्</button></div>
      <p className="text-xs leading-5 text-slate-500">{copied ? "नतिजा कपी भयो।" : "मिति गणना ग्रेगोरियन क्यालेन्डर र UTC date arithmetic मा आधारित छ। नेपाली BS मिति चाहिँ छुट्टै मिति रूपान्तरण टुलबाट जाँच्नुहोस्।"}</p>
    </section>
  );
}
