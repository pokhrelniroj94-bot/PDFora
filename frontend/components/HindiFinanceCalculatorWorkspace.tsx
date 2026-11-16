"use client";

import { useState } from "react";
import { loanEmi } from "../lib/catalog-calculations";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const money = (value: number) => `NPR ${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
function NumberInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span><input className={field} type="number" min="0" step="any" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
export default function HindiFinanceCalculatorWorkspace({ slug }: { slug: string }) {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("10");
  const [months, setMonths] = useState("60");
  const [monthly, setMonthly] = useState("5000");
  const [years, setYears] = useState("10");
  const [initial, setInitial] = useState("0");
  const [price, setPrice] = useState("1000");
  const [discount, setDiscount] = useState("20");
  const p = Number(principal), annual = Number(rate), term = Number(months);
  const validLoan = [p, annual, term].every(Number.isFinite) && p > 0 && annual >= 0 && annual <= 100 && Number.isInteger(term) && term > 0 && term <= 1200;
  let emi: number | null = null;
  let emiError = "";
  if (validLoan) { try { emi = loanEmi(p, annual, term); } catch (error) { emiError = error instanceof Error ? error.message : "कृपया ऋण का विवरण जाँचें।"; } }
  const sipMonthly = Number(monthly), sipYears = Number(years), starting = Number(initial);
  const sipValid = [sipMonthly, sipYears, annual, starting].every(Number.isFinite) && sipMonthly >= 0 && sipYears > 0 && sipYears <= 100 && annual >= 0 && annual <= 100 && starting >= 0;
  const periods = sipYears * 12, monthlyRate = annual / 1200;
  let futureValue = sipValid ? starting * (1 + monthlyRate) ** periods : 0;
  if (sipValid) for (let index = 1; index <= periods; index += 1) futureValue += sipMonthly * (1 + monthlyRate) ** (periods - index);
  const originalPrice = Number(price), discountRate = Number(discount);
  const discountValid = Number.isFinite(originalPrice) && Number.isFinite(discountRate) && originalPrice >= 0 && discountRate >= 0 && discountRate <= 100;
  const heading = slug === "loan-emi-calculator" ? "ऋण EMI कैलकुलेटर" : slug === "compound-interest-sip-calculator" ? "चक्रवृद्धि ब्याज और SIP कैलकुलेटर" : "छूट प्रतिशत कैलकुलेटर";
  if (slug === "loan-emi-calculator") return <section className="space-y-4">
    <div><h2 className="text-xl font-black text-slate-950">{heading}</h2><p className="mt-1 text-sm text-slate-600">ऋण राशि, वार्षिक ब्याज दर और अवधि से मासिक किस्त तथा कुल ब्याज का अनुमान लगाएँ।</p></div>
    <div className="grid gap-3 sm:grid-cols-3"><NumberInput label="ऋण राशि (NPR)" value={principal} onChange={setPrincipal}/><NumberInput label="वार्षिक ब्याज दर (%)" value={rate} onChange={setRate}/><NumberInput label="अवधि (महीने)" value={months} onChange={setMonths}/></div>
    {emi !== null ? <div aria-live="polite" className="rounded-xl bg-teal-50 p-4 text-sm leading-7 text-teal-950">मासिक EMI: <b>{money(emi)}</b><br/>कुल भुगतान: <b>{money(emi * term)}</b><br/>कुल ब्याज: <b>{money(emi * term - p)}</b></div> : <p role="alert" className="text-sm text-red-700">{emiError || "सकारात्मक ऋण राशि, 0–100% ब्याज दर और 1–1200 महीनों की अवधि दर्ज करें।"}</p>}
    <p className="text-xs leading-5 text-slate-500">यह समान मासिक किस्त का अनुमान है। बैंक शुल्क, बीमा, कर और वास्तविक पुनर्भुगतान अनुसूची अलग हो सकती है।</p>
  </section>;
  if (slug === "compound-interest-sip-calculator") return <section className="space-y-4">
    <div><h2 className="text-xl font-black text-slate-950">{heading}</h2><p className="mt-1 text-sm text-slate-600">मासिक निवेश, शुरुआती राशि, अवधि और अनुमानित वार्षिक प्रतिफल से भविष्य मूल्य का अनुमान निकालें।</p></div>
    <div className="grid gap-3 sm:grid-cols-2"><NumberInput label="मासिक SIP (NPR)" value={monthly} onChange={setMonthly}/><NumberInput label="अवधि (वर्ष)" value={years} onChange={setYears}/><NumberInput label="अनुमानित वार्षिक प्रतिफल (%)" value={rate} onChange={setRate}/><NumberInput label="शुरुआती निवेश (NPR)" value={initial} onChange={setInitial}/></div>
    {sipValid ? <div aria-live="polite" className="rounded-xl bg-teal-50 p-4 text-sm leading-7 text-teal-950">अनुमानित भविष्य मूल्य: <b>{money(futureValue)}</b><br/>कुल निवेश: <b>{money(starting + sipMonthly * periods)}</b><br/>अनुमानित लाभ: <b>{money(futureValue - starting - sipMonthly * periods)}</b></div> : <p role="alert" className="text-sm text-red-700">गैर-ऋणात्मक निवेश और 0–100% प्रतिफल तथा 1–100 वर्ष की अवधि दर्ज करें।</p>}
    <p className="text-xs leading-5 text-slate-500">गणना में हर महीने के अंत में निवेश और स्थिर मासिक प्रतिफल माना गया है। वास्तविक बाजार प्रतिफल की गारंटी नहीं है।</p>
  </section>;
  if (slug === "discount-percentage-calculator") return <section className="space-y-4">
    <div><h2 className="text-xl font-black text-slate-950">{heading}</h2><p className="mt-1 text-sm text-slate-600">मूल कीमत और छूट प्रतिशत से बचत तथा अंतिम कीमत निकालें।</p></div>
    <div className="grid gap-3 sm:grid-cols-2"><NumberInput label="मूल कीमत (NPR)" value={price} onChange={setPrice}/><NumberInput label="छूट (%)" value={discount} onChange={setDiscount}/></div>
    {discountValid ? <div aria-live="polite" className="rounded-xl bg-teal-50 p-4 text-sm leading-7 text-teal-950">छूट के बाद कीमत: <b>{money(originalPrice * (1 - discountRate / 100))}</b><br/>कुल बचत: <b>{money(originalPrice * discountRate / 100)}</b></div> : <p role="alert" className="text-sm text-red-700">0 से 100 प्रतिशत के बीच मान्य छूट दर्ज करें।</p>}
  </section>;
  return <p role="alert" className="text-sm text-slate-600">यह वित्तीय कैलकुलेटर उपलब्ध नहीं है।</p>;
}
