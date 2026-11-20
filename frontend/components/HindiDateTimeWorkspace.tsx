"use client";

import { useMemo, useState } from "react";

type DateSlug = "age-calculator" | "date-difference-calculator" | "time-duration-calculator";
const today = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};
const parseDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
};
const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);
const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";

function DateTimeInner({ slug, blank }: { slug: string; blank: boolean }) {
  const tool = slug as DateSlug;
  const [values, setValues] = useState<Record<string, string>>(blank ? { birth: "", asOf: "", start: "", end: "" } : {
    birth: "2000-01-15", asOf: today(), start: tool === "time-duration-calculator" ? "09:00" : "2026-01-01",
    end: tool === "time-duration-calculator" ? "17:00" : today(),
  });
  const update = (key: string, value: string) => setValues((old) => ({ ...old, [key]: value }));
  const result = useMemo(() => {
    if (tool === "time-duration-calculator") {
      const valid = (v: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
      if (!valid(values.start ?? "") || !valid(values.end ?? "")) return "कृपया दोनों समय सही रूप में दर्ज करें।";
      const minutes = (v: string) => Number(v.slice(0, 2)) * 60 + Number(v.slice(3));
      let difference = minutes(values.end) - minutes(values.start);
      if (difference < 0) difference += 1440;
      return `कुल अवधि: ${Math.floor(difference / 60)} घंटे ${difference % 60} मिनट\nकुल मिनट: ${difference}\nनोट: समाप्ति समय शुरू होने के समय से पहले होने पर अगले दिन की अवधि मानी जाती है।`;
    }
    const first = parseDate(tool === "age-calculator" ? values.birth ?? "" : values.start ?? "");
    const second = parseDate(tool === "age-calculator" ? values.asOf ?? "" : values.end ?? "");
    if (!first || !second) return "कृपया सही कैलेंडर तिथियाँ दर्ज करें।";
    if (second < first) return tool === "age-calculator" ? "गणना की तारीख जन्म तारीख से पहले नहीं हो सकती।" : "अंतिम तारीख प्रारंभ तारीख से पहले नहीं हो सकती।";
    const total = daysBetween(first, second);
    if (tool === "date-difference-calculator") return `कुल अंतर: ${total.toLocaleString("en-IN")} दिन\nसप्ताह: ${(total / 7).toFixed(2)}\nऔसत महीने: ${(total / 30.436875).toFixed(2)}\nवर्ष: ${(total / 365.2425).toFixed(2)}`;
    let years = second.getUTCFullYear() - first.getUTCFullYear();
    let months = second.getUTCMonth() - first.getUTCMonth();
    let days = second.getUTCDate() - first.getUTCDate();
    if (days < 0) {
      months -= 1;
      const previousMonthLastDay = new Date(Date.UTC(second.getUTCFullYear(), second.getUTCMonth(), 0)).getUTCDate();
      days += previousMonthLastDay;
    }
    if (months < 0) { years -= 1; months += 12; }
    return `उम्र: ${years} वर्ष, ${months} महीने और ${days} दिन\nकुल दिन: ${total.toLocaleString("en-IN")}\nकुल सप्ताह: ${(total / 7).toFixed(2)}`;
  }, [tool, values]);

  const config: Record<DateSlug, { title: string; description: string }> = {
    "age-calculator": { title: "आयु कैलकुलेटर", description: "जन्म तिथि और गणना की तारीख के आधार पर वर्ष, महीने, दिन और कुल दिनों में आयु जानें।" },
    "date-difference-calculator": { title: "तिथि अंतर कैलकुलेटर", description: "दो कैलेंडर तिथियों के बीच दिनों, सप्ताहों और औसत महीनों का अंतर निकालें।" },
    "time-duration-calculator": { title: "समय अवधि कैलकुलेटर", description: "दो समयों के बीच घंटे और मिनट निकालें; मध्यरात्रि पार करने वाली अवधि भी समर्थित है।" },
  };
  const input = (key: string, label: string, type: "date" | "time") => <label className="block" key={key}><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span><input className={field} type={type} value={values[key] ?? ""} onChange={(event) => update(key, event.target.value)} /></label>;
  return <section className="space-y-4">
    <div><h2 className="text-xl font-black text-slate-950">{config[tool].title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{config[tool].description}</p></div>
    {tool === "age-calculator" && <div className="grid gap-3 sm:grid-cols-2">{input("birth", "जन्म तिथि", "date")}{input("asOf", "किस तारीख तक आयु निकालें?", "date")}</div>}
    {tool === "date-difference-calculator" && <div className="grid gap-3 sm:grid-cols-2">{input("start", "प्रारंभ तिथि", "date")}{input("end", "अंतिम तिथि", "date")}</div>}
    {tool === "time-duration-calculator" && <div className="grid gap-3 sm:grid-cols-2">{input("start", "प्रारंभ समय", "time")}{input("end", "समाप्ति समय", "time")}</div>}
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><h3 className="text-sm font-bold text-teal-950">परिणाम</h3><pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-teal-950">{result}</pre></div>
    <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => setValues({ birth: "", asOf: "", start: "", end: "" })}>सभी मान साफ़ करें</button>
    <p className="text-xs leading-5 text-slate-500">तिथि गणना ग्रेगोरियन कैलेंडर और UTC date arithmetic पर आधारित है। समय अवधि में समाप्ति समय पहले होने पर अगला दिन माना जाता है।</p>
  </section>;
}

export default function HindiDateTimeWorkspace({ slug }: { slug: string }) {
  const [state, setState] = useState({ version: 0, blank: false });
  return <div><DateTimeInner key={state.version} slug={slug} blank={state.blank} /><div className="mt-4 flex flex-wrap gap-2"><button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => setState({ version: state.version + 1, blank: true })}>सभी मान साफ़ करें</button><button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => setState({ version: state.version + 1, blank: false })}>उदाहरण मान वापस लाएँ</button></div></div>;
}
