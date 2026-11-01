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
export default function NepaliTypingTool() {
  const [roman, setRoman] = useState("namaste mero naam niroj ho");
  const [output, setOutput] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (window.nepalify?.format) { setReady(true); return; }
    const existing = document.querySelector<HTMLScriptElement>('script[data-nepalify-script]');
    if (existing) {
      const onLoad = () => setReady(!!window.nepalify?.format);
      const onError = () => setError("Nepali typing library could not load. Reload the page and try again.");
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", onError, { once: true });
      return () => { existing.removeEventListener("load", onLoad); existing.removeEventListener("error", onError); };
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/nepalify@0.5.0/umd/nepalify.production.min.js";
    script.async = true;
    script.dataset.nepalifyScript = "true";
    script.onload = () => {
      if (window.nepalify?.format) setReady(true);
      else setError("Nepali typing script loaded, but its API was not found. Please reload or use the Preeti converter.");
    };
    script.onerror = () => setError("Nepali typing library could not load. Check your internet connection and retry.");
    document.head.appendChild(script);
    return () => { script.onload = null; script.onerror = null; };
  }, []);
  const convert = () => {
    try {
      if (!window.nepalify?.format) throw new Error("Typing library is still loading.");
      setOutput(window.nepalify.format(roman, { layout: "romanized" }));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert the text.");
    }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(output); setError(""); }
    catch { setError("Clipboard access was blocked. Select the output and copy it manually."); }
  };
  const download = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nepali-unicode.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">Nepali Unicode Typing (Roman to Nepali)</h2><p className="mt-1 text-sm text-slate-600">Type Nepali words using English letters, then convert them into Devanagari Unicode.</p></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Romanized Nepali input</span><textarea className={field + " min-h-36"} value={roman} onChange={(e) => setRoman(e.target.value)} placeholder="namaste mero desh nepal ho"/></label>
    <div className="flex flex-wrap gap-2"><button disabled={!ready} onClick={convert} className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{ready ? "Convert to Nepali Unicode" : "Loading typing engine…"}</button><button onClick={() => { setRoman(""); setOutput(""); setError(""); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Clear</button><button onClick={() => { setRoman("namaste mero desh nepal ho. dhanyabad!"); setOutput(""); }} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Load example</button></div>
    <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Nepali Unicode output</span><textarea className={field + " min-h-36"} value={output} onChange={(e) => setOutput(e.target.value)} placeholder="नेपाली Unicode output यहाँ देखिन्छ…"/></label>
    {output && <div className="flex flex-wrap gap-2"><button onClick={() => void copy()} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Copy Nepali text</button><button onClick={download} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Download TXT</button></div>}
    {error && <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
    <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><p className="font-semibold">Examples</p><p><code>namaste</code> → नमस्ते</p><p><code>mero desh nepal ho</code> → मेरो देश नेपाल हो</p><p><code>dhanyabad</code> → धन्यवाद</p></div>
    <p className="text-xs leading-5 text-slate-500">This is phonetic transliteration, not English-to-Nepali translation. Review spelling, names and formal text. Your text is converted in the browser; the typing engine is loaded from the pinned open-source Nepalify CDN package.</p>
  </div>;
}
