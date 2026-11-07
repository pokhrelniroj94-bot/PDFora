"use client";

import { useState } from "react";
import { runNepaliDeveloperTool, runNepaliHashTool, type NepaliDeveloperToolSlug } from "../lib/i18n/nepali-developer-text-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const configs: Record<NepaliDeveloperToolSlug, { title: string; description: string }> = {
  "json-formatter-validator": { title: "JSON फर्म्याट तथा जाँच", description: "JSON डेटा मान्य छ कि छैन जाँच्नुहोस् र पढ्न सजिलो गरी फर्म्याट गर्नुहोस्।" },
  "base64-encoder-decoder": { title: "Base64 Encode / Decode", description: "UTF-8 पाठलाई Base64 मा बदल्नुहोस् वा Base64 बाट पाठ निकाल्नुहोस्।" },
  "url-encoder-decoder": { title: "URL Encode / Decode", description: "URL मा प्रयोग हुने विशेष अक्षर encode वा decode गर्नुहोस्।" },
  "hash-generator": { title: "Hash Generator", description: "पाठको SHA-256, SHA-384 वा SHA-512 hash स्थानीय ब्राउजरमै निकाल्नुहोस्।" },
  "text-diff-checker": { title: "Text Diff Checker", description: "दुई पाठ तुलना गरी थपिएका, हटाइएका र उस्तै लाइन देखाउनुहोस्।" },
  "lorem-ipsum-generator": { title: "Lorem Ipsum Generator", description: "डिजाइन तथा लेआउट परीक्षणका लागि नमुना placeholder पाठ बनाउनुहोस्।" },
  "html-encoder-decoder": { title: "HTML Encode / Decode", description: "HTML का विशेष अक्षर encode वा समर्थित entity decode गर्नुहोस्।" },
  "text-to-slug": { title: "Text to Slug Converter", description: "पाठलाई URL-friendly slug मा बदल्नुहोस्; नेपाली Unicode अक्षर सुरक्षित रहन्छन्।" },
};
const labels: Record<string, string> = { text: "पाठ वा JSON", original: "पहिलो / पुरानो पाठ", modified: "दोस्रो / नयाँ पाठ" };

export default function NepaliDeveloperTextWorkspace({ slug }: { slug: string }) {
  const toolSlug = slug as NepaliDeveloperToolSlug;
  const config = configs[toolSlug];
  const [values, setValues] = useState<Record<string, string>>({ text: '{"name":"PDFora","language":"नेपाली"}', mode: "encode", indent: "2", count: "2", original: "पहिलो लाइन\nपुरानो पाठ", modified: "पहिलो लाइन\nनयाँ पाठ", algorithm: "SHA-256" });
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  if (!config) return null;
  const update = (key: string, value: string) => { setValues((current) => ({ ...current, [key]: value })); setStatus(""); };
  const run = async () => {
    setBusy(true); setStatus("");
    try {
      const output = toolSlug === "hash-generator"
        ? await runNepaliHashTool(values.text ?? "", values.algorithm ?? "SHA-256")
        : runNepaliDeveloperTool(toolSlug, values);
      setResult(output);
    } catch {
      setResult("प्रक्रिया पूरा गर्न सकिएन। प्रविष्टि जाँचेर फेरि प्रयास गर्नुहोस्।");
    } finally { setBusy(false); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(result); setStatus("नतिजा कपी भयो।"); }
    catch { setStatus("Clipboard अनुमति उपलब्ध छैन।"); }
  };
  const textarea = (key: string, title = labels[key] ?? key) => <label className="block" key={key}><span className="mb-1.5 block text-sm font-semibold text-slate-700">{title}</span><textarea className={field + " min-h-36 font-mono"} value={values[key] ?? ""} onChange={(event) => update(key, event.target.value)} /></label>;
  const select = (key: string, title: string, options: [string, string][]) => <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">{title}</span><select className={field} value={values[key] ?? options[0][0]} onChange={(event) => update(key, event.target.value)}>{options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>;
  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-black text-slate-950">{config.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p></div>
      {toolSlug === "text-diff-checker" ? <div className="grid gap-3 sm:grid-cols-2">{textarea("original")}{textarea("modified")}</div> : textarea("text")}
      {toolSlug === "base64-encoder-decoder" || toolSlug === "url-encoder-decoder" || toolSlug === "html-encoder-decoder" ? select("mode", "कार्य", [["encode", "Encode (रूपान्तरण)"], ["decode", "Decode (फिर्ता रूपान्तरण)"]]) : null}
      {toolSlug === "json-formatter-validator" ? select("indent", "Indent आकार", [["2", "२ खाली स्थान"], ["4", "४ खाली स्थान"], ["0", "Compact"]]) : null}
      {toolSlug === "lorem-ipsum-generator" ? <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">अनुच्छेद संख्या (१–२०)</span><input className={field} type="number" min="1" max="20" value={values.count} onChange={(event) => update("count", event.target.value)} /></label> : null}
      {toolSlug === "hash-generator" ? select("algorithm", "Hash algorithm", [["SHA-256", "SHA-256"], ["SHA-384", "SHA-384"], ["SHA-512", "SHA-512"]]) : null}
      <div className="flex flex-wrap gap-2"><button type="button" disabled={busy} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60" onClick={run}>{busy ? "प्रक्रिया हुँदैछ…" : "रूपान्तरण / गणना गर्नुहोस्"}</button><button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => { setValues({ text: "", mode: "encode", indent: "2", count: "2", original: "", modified: "", algorithm: "SHA-256" }); setResult(""); setStatus(""); }}>हटाउनुहोस्</button></div>
      {result && <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-teal-950">नतिजा</h3><button type="button" className="rounded-lg border border-teal-300 px-3 py-1.5 text-xs font-bold text-teal-900" onClick={copy}>कपी गर्नुहोस्</button></div><pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-teal-950">{result}</pre></div>}
      {status && <p role="status" className="text-sm text-slate-600">{status}</p>}
      <p className="text-xs leading-5 text-slate-500">यी रूपान्तरणहरू तपाईंको ब्राउजरमा हुन्छन्। Hash लाई पासवर्ड भण्डारण वा प्रमाणीकरणको सुरक्षित विकल्प नमान्नुहोस्; संवेदनशील डेटा अनलाइन उपकरणमा नहाल्नुहोस्।</p>
    </section>
  );
}
