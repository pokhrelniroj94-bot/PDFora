"use client";

import { useEffect, useState } from "react";

type NepalifyFormatter = {
  format: (text: string, options?: { layout?: "romanized" | "traditional" }) => string;
};

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";

export default function NepaliTypingTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
  const [roman, setRoman] = useState("namaste mero desh nepal ho");
  const [output, setOutput] = useState("");
  const [formatter, setFormatter] = useState<NepalifyFormatter["format"] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        // Nepalify 0.5.0 is published as ESM, not as a browser UMD global.
        // Keep this import external so Next.js does not try to bundle a remote URL.
        const moduleUrl: string = "https://cdn.jsdelivr.net/npm/nepalify@0.5.0/+esm";
        const loaded = await import(/* webpackIgnore: true */ moduleUrl) as {
          default?: NepalifyFormatter;
          format?: NepalifyFormatter["format"];
        };
        const api = loaded.default ?? loaded;
        if (typeof api.format !== "function") throw new Error("Nepalify format API was not exported.");
        if (active) {
          setFormatter(() => api.format);
          setError("");
        }
      } catch {
        if (active) {
          setError(ne
            ? "नेपाली टाइपिङ इन्जिन लोड भएन। इन्टरनेट जाँचेर फेरि प्रयास गर्नुहोस् वा Preeti converter प्रयोग गर्नुहोस्।"
            : "Nepali typing engine could not load. Check your connection and retry, or use the Preeti converter.");
        }
      }
    };
    void load();
    return () => { active = false; };
  }, [ne]);

  const convert = () => {
    try {
      if (!formatter) throw new Error("Typing library is still loading.");
      setOutput(formatter(roman, { layout: "romanized" }));
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
    <div><h2 className="text-lg font-bold">{ne ? "नेपाली Unicode टाइपिङ (Roman बाट नेपाली)" : "Nepali Unicode Typing (Roman to Nepali)"}</h2><p className="mt-1 text-sm text-slate-600">{ne ? "अङ्ग्रेजी अक्षरमा नेपाली शब्द लेखेर देवनागरी Unicode मा बदल्नुहोस्।" : "Type Nepali words using English letters, then convert them into Devanagari Unicode."}</p></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{ne ? "Romanized नेपाली इनपुट" : "Romanized Nepali input"}</span><textarea className={field + " min-h-36"} value={roman} onChange={(e) => setRoman(e.target.value)} placeholder="namaste mero desh nepal ho"/></label>
    <div className="flex flex-wrap gap-2"><button disabled={!formatter} onClick={convert} className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{formatter ? (ne ? "नेपाली Unicode मा बदल्नुहोस्" : "Convert to Nepali Unicode") : (ne ? "टाइपिङ इन्जिन लोड हुँदैछ…" : "Loading typing engine…")}</button><button onClick={() => { setRoman(""); setOutput(""); setError(""); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "खाली गर्नुहोस्" : "Clear"}</button><button onClick={() => { setRoman("namaste mero desh nepal ho. dhanyabad!"); setOutput(""); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "उदाहरण राख्नुहोस्" : "Load example"}</button></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{ne ? "नेपाली Unicode नतिजा" : "Nepali Unicode output"}</span><textarea className={field + " min-h-36"} value={output} onChange={(e) => setOutput(e.target.value)} placeholder={ne ? "नेपाली Unicode नतिजा यहाँ देखिन्छ…" : "Nepali Unicode output appears here…"}/></label>
    {output && <div className="flex flex-wrap gap-2"><button onClick={() => void copy()} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">{ne ? "नेपाली पाठ कपी गर्नुहोस्" : "Copy Nepali text"}</button><button onClick={download} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">{ne ? "TXT डाउनलोड गर्नुहोस्" : "Download TXT"}</button></div>}
    {error && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
    <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><p className="font-semibold">{ne ? "उदाहरणहरू" : "Examples"}</p><p><code>namaste</code> → नमस्ते</p><p><code>mero desh nepal ho</code> → मेरो देश नेपाल हो</p><p><code>dhanyabad</code> → धन्यवाद</p></div>
    <p className="text-xs leading-5 text-slate-500">{ne ? "यो ध्वनिमा आधारित लिप्यन्तरण हो, अंग्रेजीबाट नेपाली अनुवाद होइन। हिज्जे, नाम र औपचारिक पाठ जाँच्नुहोस्। पाठ ब्राउजरमै बदलिन्छ; pinned open-source Nepalify ESM package बाट टाइपिङ इन्जिन लोड हुन्छ।" : "This is phonetic transliteration, not English-to-Nepali translation. Review spelling, names and formal text. Your text is converted in the browser; the typing engine is loaded from the pinned open-source Nepalify ESM package."}</p>
  </div>;
}
