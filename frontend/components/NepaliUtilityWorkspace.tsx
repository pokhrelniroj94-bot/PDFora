"use client";

import { useState } from "react";
import DateConverter from "../lib/nepali-date-converter";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const nepaliDigits = (value: string) => value.replace(/\d/g, (digit) => "०१२३४५६७८९"[Number(digit)]);
const number = (value: string) => Number(value);
const money = (value: number) => `रु ${value.toLocaleString("ne-NP", { maximumFractionDigits: 2 })}`;

function Input({ title, value, onChange, type = "text" }: { title: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block"><span className={label}>{title}</span><input className={field} type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Result({ children }: { children: React.ReactNode }) {
  return <div aria-live="polite" className="whitespace-pre-wrap rounded-2xl border border-teal-200 bg-teal-50 p-4 text-base leading-7 text-teal-950">{children}</div>;
}

export default function NepaliUtilityWorkspace({ slug }: { slug: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [subjects, setSubjects] = useState([{ name: "विषय १", credit: "3", grade: "3.2" }]);
  const set = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const value = (key: string, fallback: string) => values[key] ?? fallback;

  if (slug === "nepali-digit-converter") {
    const text = value("text", "नेपाल 2083 साल");
    const nepali = text.replace(/[0-9]/g, (digit) => "०१२३४५६७८९"[Number(digit)]);
    const english = text.replace(/[०-९]/g, (digit) => String("०१२३४५६७८९".indexOf(digit)));
    return <section className="space-y-4"><h2 className="text-xl font-black">नेपाली अंक रूपान्तरण</h2><p className="text-sm leading-6 text-slate-600">अङ्ग्रेजी ०–९ र नेपाली देवनागरी अंकबीच रूपान्तरण गर्नुहोस्। बाँकी अक्षर जस्ताको तस्तै रहन्छन्।</p><Input title="टेक्स्ट वा अंक" value={text} onChange={(next) => set("text", next)} /><Result>नेपाली अंक: {nepali}{"\n"}अङ्ग्रेजी अंक: {english}</Result><button type="button" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={() => void navigator.clipboard?.writeText(english)}>अङ्ग्रेजी अंक कपी गर्नुहोस्</button></section>;
  }

  if (slug === "nepali-number-converter") {
    const raw = value("number", "1234567");
    const parsed = Number(raw.replace(/,/g, ""));
    const words = Number.isFinite(parsed) ? new Intl.NumberFormat("en-IN").format(parsed) : "मान्य अंक प्रविष्ट गर्नुहोस्।";
    return <section className="space-y-4"><h2 className="text-xl font-black">नेपाली नम्बर रूपान्तरण</h2><p className="text-sm leading-6 text-slate-600">नम्बरलाई नेपाली अंकमा देखाउनुहोस् र लाख तथा करोडको ढाँचा जाँच्नुहोस्।</p><Input title="नम्बर" value={raw} onChange={(next) => set("number", next)} type="text" /><Result>नेपाली अंक: {nepaliDigits(raw)}{"\n"}अङ्ग्रेजी ढाँचा: {words}</Result></section>;
  }

  if (slug === "nepali-date-converter") {
    const mode = value("mode", "ad-bs");
    const date = value("date", "2026-04-14");
    let result = "";
    try {
      const converter = new DateConverter(date);
      const converted = mode === "ad-bs" ? converter.toBs() : converter.toAd();
      result = mode === "ad-bs" ? `${converted.year}-${String(converted.month).padStart(2, "0")}-${String(converted.date).padStart(2, "0")}` : `${converted.year}-${String(converted.month).padStart(2, "0")}-${String(converted.date).padStart(2, "0")}`;
    } catch {
      result = "मिति ढाँचा YYYY-MM-DD मा प्रविष्ट गर्नुहोस्।";
    }
    return <section className="space-y-4"><h2 className="text-xl font-black">विक्रम संवत् ↔ इस्वी संवत् मिति रूपान्तरण</h2><p className="text-sm leading-6 text-slate-600">AD र BS मिति रूपान्तरण गर्नुहोस्। समर्थित दायरा पुस्तकालयमा आधारित BS १९७५–२०९९ हो।</p><label><span className={label}>रूपान्तरण दिशा</span><select className={field} value={mode} onChange={(event) => set("mode", event.target.value)}><option value="ad-bs">AD बाट BS</option><option value="bs-ad">BS बाट AD</option></select></label><Input title="मिति (YYYY-MM-DD)" value={date} onChange={(next) => set("date", next)} /><Result>रूपान्तरण भएको मिति: {result}</Result></section>;
  }

  if (slug === "nepal-land-area-converter") {
    const ropani = number(value("ropani", "1"));
    const aana = number(value("aana", "0"));
    const paisa = number(value("paisa", "0"));
    const daam = number(value("daam", "0"));
    const total = (ropani * 16 + aana + paisa / 4 + daam / 16) * 342.25;
    return <section className="space-y-4"><h2 className="text-xl font-black">रोपनी–आना–पैसा–दाम क्षेत्रफल रूपान्तरण</h2><p className="text-sm leading-6 text-slate-600">पहाडी जग्गाको परम्परागत एकाइलाई वर्गफुट र वर्गमिटरमा रूपान्तरण गर्नुहोस्। १ रोपनी = ५४७६ वर्गफुट मानिएको छ।</p><div className="grid gap-3 sm:grid-cols-2"><Input title="रोपनी" value={value("ropani", "1")} onChange={(next) => set("ropani", next)} type="number" /><Input title="आना" value={value("aana", "0")} onChange={(next) => set("aana", next)} type="number" /><Input title="पैसा" value={value("paisa", "0")} onChange={(next) => set("paisa", next)} type="number" /><Input title="दाम" value={value("daam", "0")} onChange={(next) => set("daam", next)} type="number" /></div><Result>वर्गफुट: {Number.isFinite(total) ? total.toLocaleString("ne-NP", { maximumFractionDigits: 2 }) : "मान्य मान प्रविष्ट गर्नुहोस्।"}{"\n"}वर्गमिटर: {Number.isFinite(total) ? (total / 10.7639104167).toLocaleString("ne-NP", { maximumFractionDigits: 2 }) : "—"}</Result></section>;
  }

  if (slug === "nepali-vat-calculator") {
    const amount = number(value("amount", "1000"));
    const mode = value("mode", "add");
    const vat = 0.13;
    const total = mode === "add" ? amount * (1 + vat) : amount / (1 + vat);
    const tax = mode === "add" ? total - amount : amount - total;
    return <section className="space-y-4"><h2 className="text-xl font-black">नेपाल VAT क्याल्कुलेटर</h2><p className="text-sm leading-6 text-slate-600">१३% VAT थप्नुहोस् वा VAT सहितको रकमबाट आधार मूल्य निकाल्नुहोस्।</p><Input title={mode === "add" ? "VAT अघि मूल्य (रु)" : "VAT सहितको रकम (रु)"} value={value("amount", "1000")} onChange={(next) => set("amount", next)} type="number" /><label><span className={label}>गणनाको प्रकार</span><select className={field} value={mode} onChange={(event) => set("mode", event.target.value)}><option value="add">मूल्यमा VAT थप्ने</option><option value="remove">VAT छुट्याउने</option></select></label><Result>आधार मूल्य: {money(mode === "add" ? amount : total)}{"\n"}VAT (१३%): {money(Math.abs(tax))}{"\n"}कुल रकम: {money(mode === "add" ? total : amount)}</Result><p className="text-xs leading-5 text-slate-500">यो सामान्य १३% अनुमान हो। विशेष वस्तु, कर छुट वा आधिकारिक कर विवरणका लागि IRD को हालको नियम जाँच गर्नुहोस्।</p></section>;
  }

  if (slug === "neb-gpa-calculator") {
    const total = subjects.reduce((sum, subject) => sum + number(subject.credit), 0);
    const weighted = subjects.reduce((sum, subject) => sum + number(subject.credit) * number(subject.grade), 0);
    const gpa = total > 0 ? weighted / total : 0;
    return <section className="space-y-4"><h2 className="text-xl font-black">NEB GPA क्याल्कुलेटर</h2><p className="text-sm leading-6 text-slate-600">प्रत्येक विषयको credit hour र grade point राखेर credit-weighted GPA निकाल्नुहोस्।</p><div className="space-y-2">{subjects.map((subject, index) => <div key={index} className="grid grid-cols-[minmax(0,1fr)_70px_90px] gap-2"><input aria-label={`${index + 1} औँ विषय`} className={field} value={subject.name} onChange={(event) => setSubjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} /><input aria-label={`${index + 1} औँ credit`} className={field} type="number" value={subject.credit} onChange={(event) => setSubjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, credit: event.target.value } : item))} /><input aria-label={`${index + 1} औँ grade point`} className={field} type="number" min="0" max="4" step="0.1" value={subject.grade} onChange={(event) => setSubjects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, grade: event.target.value } : item))} /></div>)}</div><div className="flex flex-wrap gap-2"><button type="button" className="rounded-lg border px-3 py-2 text-sm font-semibold" onClick={() => setSubjects((current) => [...current, { name: `विषय ${current.length + 1}`, credit: "3", grade: "3.2" }])}>+ विषय थप्नुहोस्</button><button type="button" className="rounded-lg border px-3 py-2 text-sm font-semibold" onClick={() => setSubjects((current) => current.length > 1 ? current.slice(0, -1) : current)}>अन्तिम विषय हटाउनुहोस्</button></div><Result>अनुमानित GPA: {gpa.toFixed(2)} / 4.00{"\n"}कुल credit hour: {total.toFixed(2)}{"\n"}कुल weighted point: {weighted.toFixed(2)}</Result><p className="text-xs leading-5 text-slate-500">Grade point scale कार्यक्रमअनुसार फरक हुन सक्छ। आफ्नो grade sheet मा भएको credit र grade point प्रयोग गर्नुहोस्।</p></section>;
  }

  return null;
}

export const nepaliLocalizedUtilitySlugs = new Set(["nepali-digit-converter", "nepali-number-converter", "nepali-date-converter", "nepal-land-area-converter", "nepali-vat-calculator", "neb-gpa-calculator"]);
