"use client";

import { useState } from "react";
import { getNepaliExtraTextToolCopy, runNepaliExtraTextTool, type NepaliExtraTextToolSlug } from "../lib/i18n/nepali-extra-text-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const tools: NepaliExtraTextToolSlug[] = ["email-extractor", "url-extractor", "phone-number-extractor", "number-extractor", "hashtag-extractor", "remove-duplicate-words", "find-replace-text", "palindrome-checker", "acronym-generator"];

export default function NepaliExtraTextWorkspace({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  if (!tools.includes(slug as NepaliExtraTextToolSlug)) return null;
  const toolSlug = slug as NepaliExtraTextToolSlug;
  const copy = getNepaliExtraTextToolCopy(toolSlug);
  const run = () => {
    setResult(runNepaliExtraTextTool(toolSlug, input, find, replace));
    setStatus("");
  };
  const copyResult = async () => {
    try { await navigator.clipboard.writeText(result); setStatus("नतिजा कपी भयो।"); }
    catch { setStatus("कपी गर्न सकिएन। ब्राउजरको clipboard अनुमति जाँच गर्नुहोस्।"); }
  };
  return <section className="space-y-4">
    <div><h2 className="text-xl font-black text-slate-950">{copy.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{copy.description}</p><p className="mt-2 text-sm leading-6 text-slate-700">{copy.purpose}</p></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">पाठ वा सामग्री</span><textarea className={field + " min-h-40 resize-y"} value={input} onChange={(event) => setInput(event.target.value)} placeholder="यहाँ पाठ टाइप वा paste गर्नुहोस्…" /></label>
    {toolSlug === "find-replace-text" && <div className="grid gap-3 sm:grid-cols-2">
      <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">खोज्नुपर्ने पाठ</span><input className={field} value={find} onChange={(event) => setFind(event.target.value)} /></label>
      <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">यसले बदल्नुहोस्</span><input className={field} value={replace} onChange={(event) => setReplace(event.target.value)} /></label>
    </div>}
    <div className="flex flex-wrap gap-2">
      <button type="button" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={run}>प्रक्रिया गर्नुहोस्</button>
      <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => { setInput(""); setFind(""); setReplace(""); setResult(""); setStatus(""); }}>हटाउनुहोस्</button>
      <button type="button" disabled={!result} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50" onClick={copyResult}>नतिजा कपी गर्नुहोस्</button>
    </div>
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><h3 className="text-sm font-bold text-teal-950">नतिजा</h3><pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-teal-950">{result || "प्रक्रिया गरेपछि नतिजा यहाँ देखिन्छ।"}</pre></div>
    {status && <p role="status" className="text-sm text-slate-600">{status}</p>}
    <section className="rounded-xl border border-slate-200 p-4"><h3 className="text-sm font-bold text-slate-900">प्रयोग गर्ने तरिका</h3><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-700">{copy.steps.map((step) => <li key={step}>{step}</li>)}</ol><p className="mt-3 text-sm leading-6 text-slate-700">{copy.example}</p><h3 className="mt-3 text-sm font-bold text-slate-900">सीमितता</h3><p className="mt-1 text-sm leading-6 text-slate-700">{copy.limitation}</p></section><p className="text-xs leading-5 text-slate-500">सबै प्रशोधन तपाईंको ब्राउजरमै हुन्छ। यस टुलले कुनै वेबसाइटमा अनुरोध पठाउँदैन।</p>
  </section>;
}
