"use client";

import { useMemo, useState } from "react";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const action = "rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800";
const panel = "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-800";

export function stripHtmlToText(source: string): string {
  if (typeof DOMParser === "undefined") return source.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const document = new DOMParser().parseFromString(source, "text/html");
  return (document.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

export function formatXml(source: string): string {
  if (!source.trim()) throw new Error("XML खाली छ।");
  if (typeof DOMParser === "undefined" || typeof XMLSerializer === "undefined") throw new Error("यो ब्राउजरमा XML जाँच उपलब्ध छैन।");
  const document = new DOMParser().parseFromString(source, "application/xml");
  if (document.querySelector("parsererror")) throw new Error("XML संरचना मान्य छैन। Tag र attribute जाँच गर्नुहोस्।");
  const serialized = new XMLSerializer().serializeToString(document);
  const tokens = serialized.replace(/>\s*</g, "><").replace(/></g, ">\n<").split("\n");
  let depth = 0;
  return tokens.map((token) => {
    if (/^<\//.test(token)) depth = Math.max(0, depth - 1);
    const line = "  ".repeat(depth) + token;
    if (/^<[^!?/][^>]*[^/]?>$/.test(token) && !/<\/[^>]+>$/.test(token) && !/^<[^>]+\/>$/.test(token)) depth += 1;
    return line;
  }).join("\n");
}

export function calculateSavings(target: number, current: number, months: number, annualRate: number) {
  if (![target, current, months, annualRate].every(Number.isFinite) || target <= 0 || current < 0 || months <= 0 || annualRate < 0) {
    throw new Error("लक्ष्य, हालको बचत, अवधि र ब्याजदरका मान जाँच गर्नुहोस्।");
  }
  const remaining = Math.max(0, target - current);
  const monthlyRate = annualRate / 1200;
  const factor = monthlyRate === 0 ? months : (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  return { remaining, monthlyDeposit: remaining === 0 ? 0 : remaining / factor };
}

export function calculateShare(quantity: number, buyPrice: number, sellPrice: number, feeRate: number, taxRate: number, dpFee: number) {
  if (![quantity, buyPrice, sellPrice, feeRate, taxRate, dpFee].every(Number.isFinite) || quantity <= 0 || buyPrice < 0 || sellPrice < 0 || feeRate < 0 || taxRate < 0 || dpFee < 0) {
    throw new Error("सबै मान शून्य वा सकारात्मक र सही हुनुपर्छ।");
  }
  const buyValue = quantity * buyPrice;
  const sellValue = quantity * sellPrice;
  const gross = sellValue - buyValue;
  const fees = (buyValue + sellValue) * feeRate / 100;
  const tax = Math.max(0, gross - fees) * taxRate / 100;
  return { buyValue, sellValue, gross, fees, tax, net: gross - fees - tax - dpFee };
}

function Copy({ value }: { value: string }) {
  return <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold" onClick={() => void navigator.clipboard?.writeText(value)}>नतिजा कपी गर्नुहोस्</button>;
}

export default function NepaliRemainingToolsWorkspace({ slug }: { slug: string }) {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("100000");\n  const [notesTitle, setNotesTitle] = useState("मेरा नोटहरू");
  const [current, setCurrent] = useState("10000");
  const [months, setMonths] = useState("12");
  const [rate, setRate] = useState("0");
  const [quantity, setQuantity] = useState("100");
  const [buy, setBuy] = useState("200");
  const [sell, setSell] = useState("220");
  const [fee, setFee] = useState("0.4");
  const [tax, setTax] = useState("0");
  const [dp, setDp] = useState("25");


  const textResult = useMemo(() => {
    if (slug !== "html-tag-stripper") return "";
    return stripHtmlToText(source);
  }, [slug, source]);

  const xml = useMemo(() => {
    if (slug !== "xml-formatter-validator" || !source.trim()) return { result: "", error: "" };
    try {
      return { result: formatXml(source), error: "" };
    } catch (cause) {
      return { result: "", error: cause instanceof Error ? cause.message : "XML जाँच गर्न सकिएन।" };
    }
  }, [slug, source]);

  if (slug === "html-tag-stripper") return <section className="space-y-4">
    <div><h2 className="text-xl font-black">HTML Tag हटाउने</h2><p className="mt-1 text-sm text-slate-600">HTML snippet बाट देखिने पाठ निकाल्नुहोस्। Script चलाइँदैन र कुनै डेटा सर्भरमा पठाइँदैन।</p></div>
    <label className="block"><span className={label}>HTML कोड</span><textarea className={field + " min-h-40 font-mono"} value={source} onChange={(e) => setSource(e.target.value)} placeholder="<h1>नमस्कार</h1>" /></label>
    <div className={panel}><strong>निकालिएको पाठ</strong><p className="mt-2 whitespace-pre-wrap break-words">{textResult || "यहाँ नतिजा देखिन्छ।"}</p></div><Copy value={textResult} />
  </section>;

  if (slug === "xml-formatter-validator") {
    const result = xml.result;
    return <section className="space-y-4">
      <div><h2 className="text-xl font-black">XML फर्म्याट तथा जाँच</h2><p className="mt-1 text-sm text-slate-600">XML को syntax ब्राउजरमै जाँचेर indentation मिलाउनुहोस्।</p></div>
      <label className="block"><span className={label}>XML सामग्री</span><textarea className={field + " min-h-48 font-mono"} value={source} onChange={(e) => setSource(e.target.value)} placeholder="<root><item>नमूना</item></root>" /></label>
      {xml.error ? <p role="alert" className="text-sm font-semibold text-red-700">{xml.error}</p> : <div className={panel}><strong>फर्म्याट गरिएको XML</strong><pre className="mt-2 whitespace-pre-wrap break-words">{result || "XML लेख्नुहोस्।"}</pre></div>}
      <Copy value={result} />
    </section>;
  }

  if (slug === "notes-to-pdf") return <section className="space-y-4">
    <div><h2 className="text-xl font-black">नोटबाट PDF</h2><p className="mt-1 text-sm text-slate-600">नोट लेख्नुहोस् र ब्राउजरको Print संवादबाट Save as PDF छान्नुहोस्। नोट बाह्य सर्भरमा पठाइँदैन।</p></div>
    <label className="block"><span className={label}>शीर्षक</span><input className={field} value={notesTitle} onChange={(e) => setNotesTitle(e.target.value)} placeholder="कागजातको शीर्षक" /></label>
    <label className="block"><span className={label}>तपाईंका नोटहरू</span><textarea className={field + " min-h-64"} value={source} onChange={(e) => setSource(e.target.value)} placeholder="यहाँ नोट लेख्नुहोस्..." /></label>
    <button type="button" className={action} onClick={() => window.print()} disabled={!source.trim()}>PDF का रूपमा सुरक्षित गर्नुहोस्</button>
    <p className="text-xs text-slate-500">Print गर्दा ब्राउजरमा उपलब्ध शीर्षक र सामग्री छान्नुहोस्। पृष्ठको बाँकी UI पनि print preview मा देखिन सक्छ।</p>
    <style jsx global>{`@media print { body * { visibility: hidden !important; } [data-notes-print], [data-notes-print] * { visibility: visible !important; } [data-notes-print] { position: absolute; inset: 0; width: 100%; } }`}</style>
    <article data-notes-print className="hidden print:block"><h1 className="mb-6 text-2xl font-bold">{notesTitle || "नोटहरू"}</h1><p className="whitespace-pre-wrap">{source}</p></article>
  </section>;

  if (slug === "savings-goal-calculator") {
    let result: ReturnType<typeof calculateSavings> | null = null;
    let errorMessage = "";
    try { result = calculateSavings(Number(target), Number(current), Number(months), Number(rate)); }
    catch (cause) { errorMessage = cause instanceof Error ? cause.message : "मान जाँच गर्नुहोस्।"; }
    return <section className="space-y-4">
      <div><h2 className="text-xl font-black">बचत लक्ष्य क्याल्कुलेटर</h2><p className="mt-1 text-sm text-slate-600">लक्ष्य पूरा गर्न आवश्यक मासिक बचतको अनुमान निकाल्नुहोस्। हालको बचत र मासिक योगदान दुवैमा ब्याज मासिक रूपमा जोडिएको मानिएको छ।</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label><span className={label}>बचत लक्ष्य (रु.)</span><input className={field} type="number" min="1" value={target} onChange={(e) => setTarget(e.target.value)} /></label>
        <label><span className={label}>हालको बचत (रु.)</span><input className={field} type="number" min="0" value={current} onChange={(e) => setCurrent(e.target.value)} /></label>
        <label><span className={label}>महिना</span><input className={field} type="number" min="1" value={months} onChange={(e) => setMonths(e.target.value)} /></label>
        <label><span className={label}>वार्षिक अनुमानित ब्याज (%)</span><input className={field} type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
      </div>
      {errorMessage ? <p role="alert" className="text-sm text-red-700">{errorMessage}</p> : result && <div className={panel}>बाँकी लक्ष्य: रु. {result.remaining.toLocaleString("ne-NP", { maximumFractionDigits: 2 })}<br />आवश्यक मासिक बचत: रु. {result.monthlyDeposit.toLocaleString("ne-NP", { maximumFractionDigits: 2 })}</div>}
    </section>;
  }

  if (slug === "nepal-share-calculator") {
    let result: ReturnType<typeof calculateShare> | null = null;
    let errorMessage = "";
    try { result = calculateShare(Number(quantity), Number(buy), Number(sell), Number(fee), Number(tax), Number(dp)); }
    catch (cause) { errorMessage = cause instanceof Error ? cause.message : "मान जाँच गर्नुहोस्।"; }
    const money = (n: number) => "रु. " + n.toLocaleString("ne-NP", { maximumFractionDigits: 2 });
    return <section className="space-y-4">
      <div><h2 className="text-xl font-black">शेयर नाफा–नोक्सान क्याल्कुलेटर</h2><p className="mt-1 text-sm text-slate-600">कारोबार मूल्य र तपाईंले प्रविष्ट गरेका शुल्क/कर दरका आधारमा अनुमान निकाल्नुहोस्। दरहरू स्वतः अद्यावधिक हुँदैनन्; कारोबारअघि ब्रोकर र CDSC को हालको शुल्क जाँच्नुहोस्।</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {([[quantity,setQuantity,"कित्ता"],[buy,setBuy,"खरिद मूल्य (प्रति कित्ता)"],[sell,setSell,"बिक्री मूल्य (प्रति कित्ता)"],[fee,setFee,"कुल कारोबार शुल्क (%)"],[tax,setTax,"नाफामा कर दर (%)"],[dp,setDp,"DP शुल्क (रु.)"]] as const).map(([v,fn,title]) => <label key={title}><span className={label}>{title}</span><input className={field} type="number" min="0" step="any" value={v} onChange={(e) => fn(e.target.value)} /></label>)}
      </div>
      {errorMessage ? <p role="alert" className="text-sm text-red-700">{errorMessage}</p> : result && <div className={panel}>खरिद रकम: {money(result.buyValue)}<br />बिक्री रकम: {money(result.sellValue)}<br />कुल नाफा/नोक्सान: {money(result.gross)}<br />अनुमानित शुल्क: {money(result.fees)}<br />प्रविष्ट कर दरअनुसार कर: {money(result.tax)}<br /><strong>अनुमानित खुद नाफा/नोक्सान: {money(result.net)}</strong></div>}
    </section>;
  }

  return null;
}
