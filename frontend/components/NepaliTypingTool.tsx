"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    nepalify?: {
      format: (text: string, options?: { layout?: "romanized" | "traditional" }) => string;
    };
  }
}
const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
export default function NepaliTypingTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
  const [roman, setRoman] = useState("kiMkr/tv/ybimuX/");
  const [output, setOutput] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (window.nepalify?.format) { Promise.resolve().then(() => setReady(true)); return; }
    const existing = document.querySelector<HTMLScriptElement>('script[data-nepalify-script]');
    if (existing) {
      if (existing.dataset.loaded === "true" && window.nepalify?.format) { Promise.resolve().then(() => setReady(true)); return; }
      const onLoad = () => { existing.dataset.loaded = "true"; setReady(!!window.nepalify?.format); };
      const onError = () => setError(ne ? "नेपाली टाइपिङ इन्जिन लोड भएन। पृष्ठ पुनःलोड गरेर प्रयास गर्नुहोस्।" : "Nepali typing library could not load. Reload the page and try again.");
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", onError, { once: true });
      return () => { existing.removeEventListener("load", onLoad); existing.removeEventListener("error", onError); };
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/nepalify@0.5.0/umd/nepalify.production.min.js";
    script.async = true;
    script.dataset.nepalifyScript = "true";
    script.onload = () => {
      script.dataset.loaded = "true";
      if (window.nepalify?.format) setReady(true);
      else setError(ne ? "टाइपिङ script लोड भयो तर API भेटिएन। पृष्ठ पुनःलोड गर्नुहोस् वा Preeti converter प्रयोग गर्नुहोस्।" : "Nepali typing script loaded, but its API was not found. Please reload or use the Preeti converter.");
    };
    script.onerror = () => setError(ne ? "नेपाली टाइपिङ library लोड भएन। इन्टरनेट जाँचेर फेरि प्रयास गर्नुहोस्।" : "Nepali typing library could not load. Check your internet connection and retry.");
    document.head.appendChild(script);
    return () => { script.onload = null; script.onerror = null; };
  }, [ne]);
  const convert = () => {
    try {
      if (!window.nepalify?.format) throw new Error("Typing library is still loading.");
      setOutput(window.nepalify.format(roman, { layout: "romanized" }));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : ne ? "पाठ रूपान्तरण गर्न सकिएन।" : "Could not convert the text.");
    }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(output); setError(""); }
    catch { setError(ne ? "Clipboard अनुमति रोकियो। नतिजा छानेर आफैँ कपी गर्नुहोस्।" : "Clipboard access was blocked. Select the output and copy it manually."); }
  };
  const download = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nepali-unicode.txt";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">{ne ? "नेपाली Unicode टाइपिङ (Roman बाट नेपाली)" : "Nepali Unicode Typing (Roman to Nepali)"}</h2><p className="mt-1 text-sm text-slate-600">{ne ? "Nepalify Romanized keyboard layout का कुञ्जीहरू प्रयोग गरेर देवनागरी Unicode बनाउनुहोस्।" : "Enter keys using the Nepalify Romanized keyboard layout to produce Devanagari Unicode."}</p></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{ne ? "Romanized नेपाली इनपुट" : "Romanized Nepali input"}</span><textarea className={field + " min-h-36"} value={roman} onChange={(e) => setRoman(e.target.value)} placeholder="kiMkr/tv/ybimuX/"/></label>
    <div className="flex flex-wrap gap-2"><button disabled={!ready} onClick={convert} className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{ready ? (ne ? "नेपाली Unicode मा बदल्नुहोस्" : "Convert to Nepali Unicode") : (ne ? "टाइपिङ इन्जिन लोड हुँदैछ…" : "Loading typing engine…")}</button><button onClick={() => { setRoman(""); setOutput(""); setError(""); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "खाली गर्नुहोस्" : "Clear"}</button><button onClick={() => { setRoman("kiMkr/tv/ybimuX/"); setOutput(""); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "उदाहरण राख्नुहोस्" : "Load example"}</button></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{ne ? "नेपाली Unicode नतिजा" : "Nepali Unicode output"}</span><textarea className={field + " min-h-36"} value={output} onChange={(e) => setOutput(e.target.value)} placeholder={ne ? "नेपाली Unicode नतिजा यहाँ देखिन्छ…" : "Nepali Unicode output appears here…"}/></label>
    {output && <div className="flex flex-wrap gap-2"><button onClick={() => void copy()} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">{ne ? "नेपाली पाठ कपी गर्नुहोस्" : "Copy Nepali text"}</button><button onClick={download} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "TXT डाउनलोड गर्नुहोस्" : "Download TXT"}</button></div>}
    {error && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
    <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><p className="font-semibold">{ne ? "उदाहरणहरू" : "Examples"}</p><p><code>kiMkr/tv/ybimuX/</code> → किंकर्तव्यविमुढ्</p><p>{ne ? "ठ्याक्कै कुञ्जी मिलाउन Romanized layout को अभ्यास गर्नुहोस्।" : "Use the exact Romanized layout key sequence; this is not predictive Roman-to-Nepali spelling."}</p></div>
    <p className="text-xs leading-5 text-slate-500">{ne ? "यो Nepalify Romanized keyboard layout हो; कुनै पनि अंग्रेजी हिज्जेलाई आफैँ अनुमान गरेर नेपाली बनाउने प्रणाली होइन। हिज्जे, नाम र औपचारिक पाठ जाँच्नुहोस्। पाठ ब्राउजरमै बदलिन्छ; टाइपिङ इन्जिन pinned open-source Nepalify CDN बाट लोड हुन्छ।" : "This follows the Nepalify Romanized keyboard layout; it is not predictive transliteration of arbitrary English spellings. Review spelling, names and formal text. Your text is converted in the browser; the typing engine is loaded from the pinned open-source Nepalify CDN package."}</p>
  </div>;
}
