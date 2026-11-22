"use client";

import { useState } from "react";
import { format } from "../lib/vendor/nepalify";

// Nepalify's "romanized" layout is a KEYBOARD LAYOUT, not phonetic transliteration.
// The runtime is vendored in lib/vendor/nepalify (ISC license), so conversion is synchronous
// and runs entirely in the browser with no network request.
const EXAMPLE_INPUT = "nms/te mero deS nepal ho";
const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const convertText = (text: string) => format(text, { layout: "romanized" });

const KEY_GROUPS: { en: string; ne: string; keys: string }[] = [
  { en: "Consonants", ne: "व्यञ्जन", keys: "kKgG<cCjJYqQxXNtTdDnpPbBmyrlvsSzh" },
  { en: "Vowel signs (after a consonant)", ne: "मात्रा (व्यञ्जनपछि)", keys: "aiIuUeEowR" },
  { en: "Independent vowels", ne: "स्वतन्त्र स्वर", keys: "HA[{fF]}OWZ" },
  { en: "Halant and marks", ne: "हलन्त र चिह्न", keys: "/MV|." },
];

export default function NepaliTypingTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
  const [roman, setRoman] = useState(EXAMPLE_INPUT);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setOutput(convertText(roman));
      setError("");
    } catch (e) {
      setOutput("");
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
    <div><h2 className="text-lg font-bold">{ne ? "नेपाली Unicode टाइपिङ (Roman बाट नेपाली)" : "Nepali Unicode Typing (Roman to Nepali)"}</h2><p className="mt-1 text-sm text-slate-600">{ne ? "रोमनाइज्ड कीबोर्ड लेआउट प्रयोग गरेर देवनागरी Unicode मा बदल्नुहोस्। सबै रूपान्तरण तपाईंको ब्राउजरमै हुन्छ।" : "Type with the Romanized Nepali keyboard layout and convert to Devanagari Unicode. All conversion happens locally in your browser."}</p></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{ne ? "Romanized नेपाली इनपुट" : "Romanized Nepali input"}</span><textarea className={field + " min-h-36"} value={roman} onChange={(e) => setRoman(e.target.value)} placeholder={EXAMPLE_INPUT}/></label>
    <div className="flex flex-wrap gap-2"><button onClick={convert} className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white">{ne ? "नेपाली Unicode मा बदल्नुहोस्" : "Convert to Nepali Unicode"}</button><button onClick={() => { setRoman(""); setOutput(""); setError(""); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "खाली गर्नुहोस्" : "Clear"}</button><button onClick={() => { setRoman(EXAMPLE_INPUT); setOutput(""); setError(""); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "उदाहरण राख्नुहोस्" : "Load example"}</button></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{ne ? "नेपाली Unicode नतिजा" : "Nepali Unicode output"}</span><textarea className={field + " min-h-36"} value={output} onChange={(e) => setOutput(e.target.value)} placeholder={ne ? "नेपाली Unicode नतिजा यहाँ देखिन्छ…" : "Nepali Unicode output appears here…"}/></label>
    {output && <div className="flex flex-wrap gap-2"><button onClick={() => void copy()} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">{ne ? "नेपाली पाठ कपी गर्नुहोस्" : "Copy Nepali text"}</button><button onClick={download} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "TXT डाउनलोड गर्नुहोस्" : "Download TXT"}</button></div>}
    {error && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
    <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><p className="font-semibold">{ne ? "उदाहरणहरू" : "Examples"}</p>{["nms/te", "mero", "deS", "nepal", "Dn/yvad"].map((k) => <p key={k}><code>{k}</code> → {convertText(k)}</p>)}</div>
    <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><p className="font-semibold">{ne ? "कुञ्जी गाइड" : "Key guide"}</p>{KEY_GROUPS.map((g) => <p key={g.en} className="mt-1"><span className="font-medium">{ne ? g.ne : g.en}:</span> {Array.from(g.keys).map((k) => <span key={k} className="mr-2 inline-block"><code>{k}</code>={convertText(k)}</span>)}</p>)}</div>
    <p className="text-xs leading-5 text-slate-500">{ne ? "यो कीबोर्ड-लेआउट रूपान्तरण हो, ध्वनिमा आधारित लिप्यन्तरण होइन: व्यञ्जनले अन्तर्निहित ‘अ’ राख्दैन, र ‘/’ ले हलन्त बनाउँछ (उदाहरण: namaste → नामासते, nms/te → नमस्ते)। हिज्जे र नाम जाँच्नुहोस्।" : "This is a keyboard-layout conversion, not phonetic transliteration: consonants carry no inherent “a” and “/” makes a halant (for example namaste → नामासते, while nms/te → नमस्ते). Please review spelling and names."}</p>
  </div>;
}
