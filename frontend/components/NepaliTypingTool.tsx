"use client";

import { useState } from "react";
import { formatNepaliRomanized } from "../lib/nepali-typing";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";

export default function NepaliTypingTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
  const [roman, setRoman] = useState("nms/te");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setOutput(formatNepaliRomanized(roman));
      setError("");
    } catch {
      setError(ne ? "पाठ रूपान्तरण गर्न सकिएन।" : "Could not convert the text. Please try again.");
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
    <div><h2 className="text-lg font-bold">{ne ? "नेपाली Unicode टाइपिङ (Romanized किबोर्ड)" : "Nepali Unicode Typing (Romanized keyboard)"}</h2><p className="mt-1 text-sm text-slate-600">{ne ? "अङ्ग्रेजी अक्षरमा नेपाली शब्द लेखेर देवनागरी Unicode मा बदल्नुहोस्।" : "Type with the Nepalify romanized keyboard layout and convert the key sequence into Devanagari Unicode."}</p></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{ne ? "Romanized किबोर्ड इनपुट" : "Romanized keyboard input"}</span><textarea className={field + " min-h-36"} value={roman} onChange={(e) => setRoman(e.target.value)} placeholder="nms/te"/></label>
    <div className="flex flex-wrap gap-2"><button onClick={convert} className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">{ne ? "नेपाली Unicode मा बदल्नुहोस्" : "Convert to Nepali Unicode"}</button><button onClick={() => { setRoman(""); setOutput(""); setError(""); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "खाली गर्नुहोस्" : "Clear"}</button><button onClick={() => { setRoman("nms/te"); setOutput(""); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "उदाहरण राख्नुहोस्" : "Load example"}</button></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{ne ? "नेपाली Unicode नतिजा" : "Nepali Unicode output"}</span><textarea className={field + " min-h-36"} value={output} onChange={(e) => setOutput(e.target.value)} placeholder={ne ? "नेपाली Unicode नतिजा यहाँ देखिन्छ…" : "Nepali Unicode output appears here…"}/></label>
    {output && <div className="flex flex-wrap gap-2"><button onClick={() => void copy()} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">{ne ? "नेपाली पाठ कपी गर्नुहोस्" : "Copy Nepali text"}</button><button onClick={download} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "TXT डाउनलोड गर्नुहोस्" : "Download TXT"}</button></div>}
    {error && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
    <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><p className="font-semibold">{ne ? "उदाहरणहरू" : "Examples"}</p><p><code>nms/te</code> → नमस्ते</p></div>
    <p className="text-xs leading-5 text-slate-500">{ne ? "यो Nepalify को romanized keyboard layout हो, साधारण अंग्रेजी शब्दको स्वचालित अनुवाद होइन। उदाहरणको key sequence nms/te ले नमस्ते बनाउँछ। पाठ र इन्जिन यही ब्राउजरमा चल्छन्; बाह्य CDN चाहिँदैन।" : "This uses the Nepalify romanized keyboard layout, not automatic English-to-Nepali translation. For example, the key sequence nms/te produces नमस्ते. The text and engine stay in your browser; no third-party CDN request is needed."}</p>
  </div>;
}
