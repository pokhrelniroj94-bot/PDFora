"use client";

import { useState } from "react";
import { loanEmi, sipFutureValue } from "../lib/catalog-calculations";

const field = "w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm";
const npr = (value: number) => `NPR ${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span><input className={field} type="number" min="0" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

export default function NepaliFinanceCalculatorWorkspace({ slug }: { slug: string }) {
  const [principal, setPrincipal] = useState("1000000");
  const [rate, setRate] = useState("10");
  const [months, setMonths] = useState("60");
  const [monthly, setMonthly] = useState("5000");
  const [years, setYears] = useState("10");
  const [initial, setInitial] = useState("0");
  const [price, setPrice] = useState("1000");
  const [discount, setDiscount] = useState("20");
  const p = Number(principal), annual = Number(rate), term = Number(months);
  const emiValid = Number.isFinite(p) && Number.isFinite(annual) && Number.isInteger(term) && p > 0 && annual >= 0 && term > 0 && term <= 1200;
  let emi: number | null = null;
  let emiError = "सकारात्मक ऋण रकम, मान्य ब्याज दर र पूर्ण महिनाको अवधि लेख्नुहोस्।";
  try {
    if (emiValid) emi = loanEmi(p, annual, term);
  } catch (error) {
    emiError = error instanceof Error ? error.message : "मान्य ऋण विवरण लेख्नुहोस्।";
  }
  const sipMonthly = Number(monthly), sipYears = Number(years), starting = Number(initial);
  const sipValid = Number.isFinite(sipMonthly) && Number.isFinite(sipYears) && Number.isFinite(annual) && Number.isFinite(starting) &&
    sipMonthly >= 0 && sipYears > 0 && sipYears <= 100 && annual >= 0 && starting >= 0;
  const periods = sipYears * 12;
  let futureValue: number | null = null;
  let sipError = "गैर-नकारात्मक लगानी र प्रतिफल तथा १ देखि १०० वर्षसम्मको अवधि लेख्नुहोस्।";
  try {
    if (sipValid) futureValue = sipFutureValue(sipMonthly, sipYears, annual, starting);
  } catch (error) {
    sipError = error instanceof Error ? error.message : "लगानीको अनुमानित मूल्य गणना गर्न सकिएन।";
  }
  const originalPrice = Number(price), discountRate = Number(discount);
  const discountValid = originalPrice >= 0 && discountRate >= 0 && discountRate <= 100;

  if (slug === "loan-emi-calculator") return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">ऋण EMI क्याल्कुलेटर</h2><p className="mt-1 text-sm text-slate-600">ऋण रकम, वार्षिक ब्याज र अवधिका आधारमा मासिक किस्ता गणना गर्नुहोस्।</p></div>
    <div className="grid gap-3 sm:grid-cols-3"><Input label="ऋण रकम (NPR)" value={principal} onChange={setPrincipal}/><Input label="वार्षिक ब्याज दर (%)" value={rate} onChange={setRate}/><Input label="अवधि (महिना)" value={months} onChange={setMonths}/></div>
    {emi !== null ? <div aria-live="polite" className="rounded-xl bg-teal-50 p-4 text-sm leading-7 text-teal-950">मासिक EMI: <b>{npr(emi)}</b><br/>कुल भुक्तानी: <b>{npr(emi * term)}</b><br/>कुल ब्याज: <b>{npr(emi * term - p)}</b></div> : <p role="alert" className="text-sm text-red-700">{emiError}</p>}
    <p className="text-xs leading-5 text-slate-500">यो समान मासिक किस्ताको अनुमान हो। बैंकका शुल्क, बीमा, कर र वास्तविक पुनर्भुक्ति तालिका फरक हुन सक्छ।</p>
  </div>;

  if (slug === "compound-interest-sip-calculator") return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">चक्रवृद्धि ब्याज तथा SIP क्याल्कुलेटर</h2><p className="mt-1 text-sm text-slate-600">मासिक लगानी, प्रारम्भिक रकम, अवधि र अपेक्षित वार्षिक प्रतिफलबाट भविष्यको अनुमान निकाल्नुहोस्।</p></div>
    <div className="grid gap-3 sm:grid-cols-2"><Input label="मासिक SIP (NPR)" value={monthly} onChange={setMonthly}/><Input label="अवधि (वर्ष)" value={years} onChange={setYears}/><Input label="अपेक्षित वार्षिक प्रतिफल (%)" value={rate} onChange={setRate}/><Input label="प्रारम्भिक लगानी (NPR)" value={initial} onChange={setInitial}/></div>
    {futureValue !== null ? <div aria-live="polite" className="rounded-xl bg-teal-50 p-4 text-sm leading-7 text-teal-950">अनुमानित भविष्य मूल्य: <b>{npr(futureValue)}</b><br/>कुल लगानी: <b>{npr(starting + sipMonthly * periods)}</b><br/>अनुमानित लाभ: <b>{npr(futureValue - starting - sipMonthly * periods)}</b></div> : <p role="alert" className="text-sm text-red-700">{sipError}</p>}
    <p className="text-xs leading-5 text-slate-500">महिनाको अन्त्यमा लगानी र स्थिर मासिक प्रतिफल मानिएको छ। यो प्रतिफलको ग्यारेन्टी होइन।</p>
  </div>;

  if (slug === "discount-percentage-calculator") return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">छुट प्रतिशत क्याल्कुलेटर</h2><p className="mt-1 text-sm text-slate-600">मूल मूल्य र छुट प्रतिशतबाट अन्तिम मूल्य तथा बचत निकाल्नुहोस्।</p></div>
    <div className="grid gap-3 sm:grid-cols-2"><Input label="मूल्य (NPR)" value={price} onChange={setPrice}/><Input label="छुट (%)" value={discount} onChange={setDiscount}/></div>
    {discountValid ? <div aria-live="polite" className="rounded-xl bg-teal-50 p-4 text-sm leading-7 text-teal-950">छुटपछि मूल्य: <b>{npr(originalPrice * (1 - discountRate / 100))}</b><br/>बचत: <b>{npr(originalPrice * discountRate / 100)}</b></div> : <p role="alert" className="text-sm text-red-700">० देखि १०० प्रतिशतसम्मको मान्य छुट लेख्नुहोस्।</p>}
  </div>;

  return <p role="alert" className="text-sm text-slate-600">यो वित्तीय क्याल्कुलेटर उपलब्ध छैन।</p>;
}
