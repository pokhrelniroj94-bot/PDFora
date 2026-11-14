"use client";

import { useState } from "react";
import { runNepaliEncodingCaseTool, type NepaliEncodingCaseToolSlug, type NepaliToolResult } from "../lib/i18n/nepali-encoding-case-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

type Config = {
  title: string;
  description: string;
  inputLabel: string;
  placeholder: string;
  example: Record<string, string>;
  modes?: [string, string][];
  numeric?: { key: string; label: string; placeholder: string }[];
  note: string;
};

const configs: Record<NepaliEncodingCaseToolSlug, Config> = {
  "text-to-binary": { title: "पाठबाट बाइनरी", description: "कुनै पनि पाठ (नेपाली सहित) UTF-8 बाइटमा बदली ८-bit बाइनरी समूहमा देखाउनुहोस्।", inputLabel: "पाठ", placeholder: "यहाँ पाठ लेख्नुहोस्", example: { text: "नमस्ते" }, note: "नेपाली अक्षरले धेरै बाइट लिन्छन्, त्यसैले एउटा अक्षरको बाइनरी एकभन्दा बढी समूहमा देखिन सक्छ।" },
  "binary-to-text": { title: "बाइनरीबाट पाठ", description: "खाली स्थानले छुट्याइएका ८-bit बाइनरी समूहलाई UTF-8 पाठमा फर्काउनुहोस्।", inputLabel: "बाइनरी (८-bit समूह)", placeholder: "01001000 01101001", example: { text: "01001000 01101001" }, note: "प्रत्येक समूहमा ठ्याक्कै ८ वटा ० वा १ हुनुपर्छ।" },
  "text-to-hex": { title: "पाठबाट Hexadecimal", description: "पाठलाई UTF-8 बाइटमा बदली hexadecimal (आधार १६) मा देखाउनुहोस्।", inputLabel: "पाठ", placeholder: "यहाँ पाठ लेख्नुहोस्", example: { text: "Hello" }, note: "नतिजामा प्रत्येक बाइट दुई अक्षरको hex जोडाका रूपमा देखिन्छ।" },
  "hex-to-text": { title: "Hexadecimal बाट पाठ", description: "Hex बाइट जोडालाई UTF-8 पाठमा फर्काउनुहोस्।", inputLabel: "Hex बाइट जोडा", placeholder: "48 65 6c 6c 6f", example: { text: "48 65 6c 6c 6f" }, note: "खाली स्थान, comma, colon वा hyphen ले जोडा छुट्याउन सकिन्छ।" },
  "morse-code-translator": { title: "मोर्स कोड अनुवादक", description: "अङ्ग्रेजी अक्षर र अंकलाई मोर्स कोडमा बदल्नुहोस् वा मोर्स कोडबाट पाठ निकाल्नुहोस्।", inputLabel: "पाठ वा मोर्स कोड", placeholder: "SOS HELP", example: { text: "SOS HELP", mode: "encode" }, modes: [["encode", "पाठबाट मोर्स कोड"], ["decode", "मोर्स कोडबाट पाठ"]], note: "मोर्स कोडमा शब्दहरू \"/\" ले छुट्याइन्छन्। नेपाली अक्षर समर्थित छैनन्।" },
  "camel-case-converter": { title: "camelCase रूपान्तरण", description: "पाठलाई प्रोग्रामिङमा प्रयोग हुने camelCase नाममा बदल्नुहोस्।", inputLabel: "पाठ", placeholder: "convert this phrase", example: { text: "Convert this phrase" }, note: "नेपाली र अन्य Unicode अक्षर सुरक्षित रहन्छन्; अङ्ग्रेजी अक्षरका accent हटाइन्छन्।" },
  "snake-case-converter": { title: "snake_case रूपान्तरण", description: "पाठलाई underscore ले जोडिएको snake_case नाममा बदल्नुहोस्।", inputLabel: "पाठ", placeholder: "convert this phrase", example: { text: "Convert this phrase" }, note: "camelCase बाट पनि शब्द छुट्याइन्छ, जस्तै helloWorld → hello_world।" },
  "kebab-case-converter": { title: "kebab-case रूपान्तरण", description: "पाठलाई hyphen ले जोडिएको kebab-case नाममा बदल्नुहोस्।", inputLabel: "पाठ", placeholder: "convert this phrase", example: { text: "Convert this phrase" }, note: "URL, CSS class र फाइल नामका लागि उपयोगी।" },
  "json-escape-unescape": { title: "JSON Escape / Unescape", description: "पाठलाई JSON string मा सुरक्षित बनाउनुहोस् वा escape गरिएको string खोल्नुहोस्।", inputLabel: "पाठ", placeholder: "पाठ यहाँ राख्नुहोस्", example: { text: "पहिलो लाइन\nदोस्रो \"लाइन\"", mode: "escape" }, modes: [["escape", "Escape (सुरक्षित बनाउने)"], ["unescape", "Unescape (खोल्ने)"]], note: "नयाँ लाइन, उद्धरण चिन्ह र backslash \\n, \\\" र \\\\ मा बदलिन्छन्।" },
  "px-rem-converter": { title: "px ↔ rem रूपान्तरण", description: "CSS मा px र rem एकाइबीच रूपान्तरण गर्नुहोस्।", inputLabel: "", placeholder: "", example: { value: "24", root: "16", mode: "px-to-rem" }, modes: [["px-to-rem", "px बाट rem"], ["rem-to-px", "rem बाट px"]], numeric: [{ key: "value", label: "मान", placeholder: "24" }, { key: "root", label: "Root font size (px)", placeholder: "16" }], note: "ब्राउजरको सामान्य root font size १६ px हो।" },
  "roman-numeral-converter": { title: "रोमन अंक रूपान्तरण", description: "१ देखि ३९९९ सम्मका सङ्ख्या र रोमन अंकबीच रूपान्तरण गर्नुहोस्।", inputLabel: "सङ्ख्या वा रोमन अंक", placeholder: "२०२६ वा MMXXVI", example: { text: "2026" }, note: "नेपाली अंक (जस्तै २०२६) पनि स्वीकार गरिन्छ।" },
};

const emptyValues = (example: Record<string, string>): Record<string, string> => Object.fromEntries(Object.keys(example).map((key) => [key, key === "mode" ? example[key] : ""]));

export default function NepaliEncodingCaseWorkspace({ slug }: { slug: string }) {
  const toolSlug = slug as NepaliEncodingCaseToolSlug;
  const config = configs[toolSlug];
  const [values, setValues] = useState<Record<string, string>>(config ? config.example : {});
  const [result, setResult] = useState<NepaliToolResult | null>(null);
  const [status, setStatus] = useState("");
  if (!config) return null;

  const update = (key: string, value: string) => { setValues((current) => ({ ...current, [key]: value })); setStatus(""); };
  const run = () => { setResult(runNepaliEncodingCaseTool(toolSlug, values)); setStatus(""); };
  const clear = () => { setValues(emptyValues(config.example)); setResult(null); setStatus(""); };
  const copy = async () => {
    if (!result?.ok) return;
    try { await navigator.clipboard.writeText(result.text); setStatus("नतिजा कपी भयो।"); }
    catch { setStatus("Clipboard अनुमति उपलब्ध छैन; नतिजा हातले चयन गरेर कपी गर्नुहोस्।"); }
  };
  const swap = () => {
    if (!result?.ok || !config.modes) return;
    const next = config.modes.find(([value]) => value !== values.mode);
    if (!next) return;
    setValues((current) => ({ ...current, text: result.text, mode: next[0] }));
    setResult(null);
    setStatus("नतिजा इनपुटमा सारियो; उल्टो दिशा चयन गरिएको छ।");
  };

  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-black text-slate-950">{config.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p></div>
      {config.modes ? <label className="block"><span className={labelClass}>कार्य</span><select className={field} value={values.mode ?? config.modes[0][0]} onChange={(event) => update("mode", event.target.value)}>{config.modes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label> : null}
      {config.numeric
        ? <div className="grid gap-3 sm:grid-cols-2">{config.numeric.map((item) => <label className="block" key={item.key}><span className={labelClass}>{item.label}</span><input className={field} type="text" inputMode="decimal" placeholder={item.placeholder} value={values[item.key] ?? ""} onChange={(event) => update(item.key, event.target.value)} /></label>)}</div>
        : toolSlug === "roman-numeral-converter" || toolSlug.endsWith("-case-converter")
          ? <label className="block"><span className={labelClass}>{config.inputLabel}</span><input className={field} type="text" placeholder={config.placeholder} value={values.text ?? ""} onChange={(event) => update("text", event.target.value)} /></label>
          : <label className="block"><span className={labelClass}>{config.inputLabel}</span><textarea className={field + " min-h-36 font-mono"} placeholder={config.placeholder} value={values.text ?? ""} onChange={(event) => update("text", event.target.value)} /></label>}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={run}>रूपान्तरण गर्नुहोस्</button>
        <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={clear}>हटाउनुहोस्</button>
        {config.modes && result?.ok ? <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={swap}>नतिजा इनपुटमा सार्नुहोस्</button> : null}
      </div>
      {result ? (result.ok
        ? <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-teal-950">नतिजा</h3><button type="button" className="rounded-lg border border-teal-300 px-3 py-1.5 text-xs font-bold text-teal-900" onClick={copy}>कपी गर्नुहोस्</button></div><pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-teal-950">{result.text}</pre></div>
        : <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900"><strong className="block">त्रुटि</strong>{result.text}</div>) : <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">नतिजा यहाँ देखिनेछ। माथि प्रविष्टि गरेर “रूपान्तरण गर्नुहोस्” थिच्नुहोस्।</p>}
      {status && <p role="status" className="text-sm text-slate-600">{status}</p>}
      <p className="text-xs leading-5 text-slate-500">{config.note} यो रूपान्तरण तपाईंको ब्राउजरमै हुन्छ; पाठ कुनै सर्भरमा पठाइँदैन।</p>
    </section>
  );
}
