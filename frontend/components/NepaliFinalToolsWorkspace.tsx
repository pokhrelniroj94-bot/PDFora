"use client";

import { useState } from "react";
import { runNepaliFinalTool, type NepaliDomDeps, type NepaliFinalToolSlug, type NepaliToolResult } from "../lib/i18n/nepali-final-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";
const primary = "rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white";
const secondary = "rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700";

/** Real browser DOM parsing; unit tests inject stubs, the Chromium E2E exercises this implementation. */
const domDeps: NepaliDomDeps = {
  parseXml: (raw) => {
    const doc = new DOMParser().parseFromString(raw, "application/xml");
    const issue = doc.querySelector("parsererror");
    return issue ? { errorText: issue.textContent ?? "", serialized: "" } : { errorText: null, serialized: new XMLSerializer().serializeToString(doc) };
  },
  htmlToText: (raw) => new DOMParser().parseFromString(raw, "text/html").body.textContent || "",
};

type FieldSpec = { key: string; label: string; kind?: "text" | "select"; placeholder?: string; options?: [string, string][] };
type CalcConfig = { title: string; description: string; fields: FieldSpec[]; example: Record<string, string>; action: string; note: string };

const calcConfigs: Record<"savings-goal-calculator" | "nepal-share-calculator", CalcConfig> = {
  "savings-goal-calculator": {
    title: "बचत लक्ष्य क्याल्कुलेटर",
    description: "लक्ष्य रकम, हालको बचत, अवधि र अनुमानित ब्याजदरका आधारमा नियमित रूपमा कति निक्षेप चाहिन्छ भनी अनुमान गर्नुहोस्।",
    fields: [
      { key: "target", label: "बचत लक्ष्य (NPR)", placeholder: "100000" },
      { key: "saved", label: "हालसम्मको बचत (NPR)", placeholder: "10000" },
      { key: "months", label: "लक्ष्यसम्म पुग्ने महिना", placeholder: "12" },
      { key: "rate", label: "वार्षिक ब्याजदर (%)", placeholder: "5" },
      { key: "frequency", label: "निक्षेपको आवृत्ति", kind: "select", options: [["monthly", "मासिक निक्षेप"], ["weekly", "साप्ताहिक निक्षेप"]] },
    ],
    example: { target: "100000", saved: "10000", months: "12", rate: "5", frequency: "monthly" },
    action: "गणना गर्नुहोस्",
    note: "यो अनुमान मात्र हो; बैंकको वास्तविक ब्याज, शुल्क र करले नतिजा फरक पार्न सक्छ। यो वित्तीय सल्लाह होइन।",
  },
  "nepal-share-calculator": {
    title: "NEPSE सेयर खरिद–बिक्री क्याल्कुलेटर",
    description: "सेयरको खरिद लागत, बिक्री रकम र सम्पादन गर्न मिल्ने शुल्कपछिको नाफा–नोक्सान अनुमान गर्नुहोस्।",
    fields: [
      { key: "shares", label: "सेयर सङ्ख्या (कित्ता)", placeholder: "100" },
      { key: "buy", label: "खरिद मूल्य प्रति कित्ता (NPR)", placeholder: "200" },
      { key: "sell", label: "बिक्री मूल्य प्रति कित्ता (NPR)", placeholder: "220" },
      { key: "broker", label: "ब्रोकर कमिसन (%)", placeholder: "0.36" },
      { key: "sebon", label: "SEBON शुल्क (%)", placeholder: "0.015" },
      { key: "dp", label: "DP शुल्क (NPR)", placeholder: "25" },
      { key: "cgt", label: "पूँजीगत लाभ कर (CGT) अनुमान (%)", placeholder: "5" },
    ],
    example: { shares: "100", buy: "200", sell: "220", broker: "0.36", sebon: "0.015", dp: "25", cgt: "5" },
    action: "नाफा–नोक्सान गणना गर्नुहोस्",
    note: "दरहरू सम्पादन गर्न मिल्ने अनुमान हुन्; ती प्रत्यक्ष ब्रोकर दर वा कर सल्लाह होइनन्। कमिसन स्तर, SEBON/DP शुल्क र CGT कारोबार नियम, धारण अवधि र लगानीकर्ताको वर्गमा निर्भर हुन्छन्। कारोबारअघि NEPSE/CDSC/SEBON र कर कार्यालयका हालका दर पुष्टि गर्नुहोस्।",
  },
};

function ResultPanel({ result, copyLabel = "कपी गर्नुहोस्", status, setStatus }: { result: NepaliToolResult | null; copyLabel?: string; status: string; setStatus: (value: string) => void }) {
  if (!result) return <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">नतिजा यहाँ देखिनेछ। माथिको बटन थिच्नुहोस्।</p>;
  if (!result.ok) return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900"><strong className="block">त्रुटि</strong>{result.text}</div>;
  const copy = async () => {
    try { await navigator.clipboard.writeText(result.text); setStatus("नतिजा कपी भयो।"); }
    catch { setStatus("Clipboard अनुमति उपलब्ध छैन; नतिजा हातले चयन गरेर कपी गर्नुहोस्।"); }
  };
  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite">
      <div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-teal-950">नतिजा</h3><button type="button" className="rounded-lg border border-teal-300 px-3 py-1.5 text-xs font-bold text-teal-900" onClick={copy}>{copyLabel}</button></div>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-teal-950">{result.text}</pre>
      {status ? <p role="status" className="mt-2 text-xs text-teal-900">{status}</p> : null}
    </div>
  );
}

function Calculator({ slug }: { slug: "savings-goal-calculator" | "nepal-share-calculator" }) {
  const config = calcConfigs[slug];
  const [values, setValues] = useState<Record<string, string>>(config.example);
  const [result, setResult] = useState<NepaliToolResult | null>(null);
  const [status, setStatus] = useState("");
  const update = (key: string, value: string) => { setValues((current) => ({ ...current, [key]: value })); setStatus(""); };
  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-black text-slate-950">{config.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        {config.fields.map((spec) => {
          const id = `${slug}-${spec.key}`;
          return (
            <div key={spec.key}>
              <label htmlFor={id} className={labelClass}>{spec.label}</label>
              {spec.kind === "select"
                ? <select id={id} className={field} value={values[spec.key] ?? ""} onChange={(event) => update(spec.key, event.target.value)}>{spec.options?.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select>
                : <input id={id} className={field} type="text" inputMode="decimal" placeholder={spec.placeholder} value={values[spec.key] ?? ""} onChange={(event) => update(spec.key, event.target.value)} />}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={primary} onClick={() => { setResult(runNepaliFinalTool(slug, values, domDeps)); setStatus(""); }}>{config.action}</button>
        <button type="button" className={secondary} onClick={() => { setValues(Object.fromEntries(Object.keys(config.example).map((key) => [key, key === "frequency" ? "monthly" : ""]))); setResult(null); setStatus(""); }}>हटाउनुहोस्</button>
      </div>
      <ResultPanel result={result} status={status} setStatus={setStatus} />
      <p className="text-xs leading-5 text-slate-500">{config.note} गणना तपाईंको ब्राउजरमै हुन्छ; इनपुट कुनै सर्भरमा पठाइँदैन।</p>
    </section>
  );
}

function TextTool({ slug }: { slug: "xml-formatter-validator" | "html-tag-stripper" }) {
  const isXml = slug === "xml-formatter-validator";
  const [text, setText] = useState(isXml ? '<root><item id="1">नमस्ते</item></root>' : "<h1>नमस्ते</h1><p>स्वागत छ <b>फेरि</b>।</p>");
  const [result, setResult] = useState<NepaliToolResult | null>(null);
  const [status, setStatus] = useState("");
  const inputLabel = isXml ? "XML इनपुट" : "HTML इनपुट";
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-black text-slate-950">{isXml ? "XML ढाँचा तथा मान्यता जाँचकर्ता" : "HTML Tag हटाउने टुल"}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{isXml ? "XML जाँचेर मान्य भए सफा indentation सहित सजाइएको रूपमा देखाउनुहोस्।" : "HTML बाट tag हटाएर देखिने पाठ मात्र निकाल्नुहोस्।"}</p>
      </div>
      <div>
        <label htmlFor={`${slug}-input`} className={labelClass}>{inputLabel}</label>
        <textarea id={`${slug}-input`} className={field + " min-h-44 font-mono"} spellCheck={false} value={text} onChange={(event) => { setText(event.target.value); setStatus(""); }} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={primary} onClick={() => { setResult(runNepaliFinalTool(slug, { text }, domDeps)); setStatus(""); }}>{isXml ? "XML जाँच्नुहोस् र सजाउनुहोस्" : "Tag हटाउनुहोस्"}</button>
        <button type="button" className={secondary} onClick={() => { setText(""); setResult(null); setStatus(""); }}>हटाउनुहोस्</button>
      </div>
      <ResultPanel result={result} status={status} setStatus={setStatus} />
      <p className="text-xs leading-5 text-slate-500">
        {isXml ? "जाँच तपाईंको ब्राउजरको XML पार्सरले गर्छ; DTD वा बाह्य स्रोत लोड गरिँदैन।" : "Tag हटाउनु भनेको सामग्री सुरक्षित बनाउनु होइन। नतिजालाई वेबपेजमा HTML को रूपमा सिधै राख्नु हुँदैन; पाठको रूपमा मात्र देखाउनुहोस्।"}
        {" "}इनपुट कुनै सर्भरमा पठाइँदैन।
      </p>
    </section>
  );
}

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function NotesToPdf() {
  const [title, setTitle] = useState("मेरा नोटहरू");
  const [notes, setNotes] = useState("");
  const [size, setSize] = useState("A4");
  const [fontSize, setFontSize] = useState("12");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const makePdf = () => {
    if (!notes.trim()) { setMessage({ ok: false, text: "कृपया पहिले नोट लेख्नुहोस् वा पेस्ट गर्नुहोस्।" }); return; }
    const pageSize = ["A4", "A5", "Letter"].includes(size) ? size : "A4";
    const win = window.open("", "_blank");
    if (!win) { setMessage({ ok: false, text: "यो साइटका लागि pop-up अनुमति दिनुहोस्, अनि फेरि प्रयास गर्नुहोस्।" }); return; }
    const pt = Math.max(9, Math.min(24, Number(fontSize) || 12));
    win.document.open();
    win.document.write(
      "<!doctype html><html lang='ne'><head><meta charset='utf-8'><title>" + escapeHtml(title || "नोट") + "</title>" +
      "<style>@page{size:" + pageSize + ";margin:20mm}body{font-family:'Noto Sans Devanagari','Mukta','Nirmala UI',Arial,sans-serif;color:#172033;font-size:" + pt + "pt;line-height:1.65}" +
      "h1{font-size:22pt;margin:0 0 18pt;border-bottom:1px solid #ddd;padding-bottom:10pt}pre{font:inherit;white-space:pre-wrap;overflow-wrap:anywhere;margin:0}</style></head><body>" +
      "<h1>" + escapeHtml(title || "मेरा नोटहरू") + "</h1><pre>" + escapeHtml(notes) + "</pre>" +
      "<script>window.onload=()=>{window.focus();window.print()}<\/script></body></html>",
    );
    win.document.close();
    setMessage({ ok: true, text: "प्रिन्ट विन्डो खुल्यो। PDF बनाउन गन्तव्यमा “Save as PDF” (PDF को रूपमा सुरक्षित गर्नुहोस्) चयन गर्नुहोस्।" });
  };

  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-black text-slate-950">नोट बाट PDF</h2><p className="mt-1 text-sm leading-6 text-slate-600">नोट लेख्नुहोस् वा पेस्ट गर्नुहोस्, पृष्ठ ढाँचा छान्नुहोस्, अनि ब्राउजरको प्रिन्ट विन्डोबाट PDF को रूपमा सुरक्षित गर्नुहोस्।</p></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-3"><label htmlFor="notes-title" className={labelClass}>कागजातको शीर्षक</label><input id="notes-title" className={field} value={title} onChange={(event) => { setTitle(event.target.value); setMessage(null); }} /></div>
        <div><label htmlFor="notes-size" className={labelClass}>पृष्ठ आकार</label><select id="notes-size" className={field} value={size} onChange={(event) => setSize(event.target.value)}><option value="A4">A4</option><option value="A5">A5</option><option value="Letter">Letter</option></select></div>
        <div><label htmlFor="notes-font" className={labelClass}>अक्षरको आकार (९–२४ pt)</label><input id="notes-font" className={field} type="text" inputMode="numeric" value={fontSize} onChange={(event) => setFontSize(event.target.value)} /></div>
      </div>
      <div><label htmlFor="notes-body" className={labelClass}>तपाईंका नोटहरू</label><textarea id="notes-body" className={field + " min-h-64"} value={notes} onChange={(event) => { setNotes(event.target.value); setMessage(null); }} placeholder="यहाँ नोट लेख्नुहोस्…" /></div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={primary} onClick={makePdf}>PDF बनाउनुहोस्</button>
        <button type="button" className={secondary} onClick={() => { setNotes(""); setMessage(null); }}>नोट हटाउनुहोस्</button>
      </div>
      {message ? (message.ok
        ? <p role="status" className="rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950">{message.text}</p>
        : <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900"><strong className="block">त्रुटि</strong>{message.text}</div>) : null}
      <p className="text-xs leading-5 text-slate-500">यो टुलले फाइल अपलोड गर्दैन। नोट तपाईंको ब्राउजरमै नयाँ प्रिन्ट विन्डोमा बनाइन्छ र PDF तपाईंको उपकरणमा सुरक्षित हुन्छ। पृष्ठको अन्तिम रूप तपाईंको ब्राउजर र प्रिन्टर सेटिङअनुसार फरक पर्न सक्छ।</p>
    </section>
  );
}

export default function NepaliFinalToolsWorkspace({ slug }: { slug: string }) {
  const toolSlug = slug as NepaliFinalToolSlug | "notes-to-pdf";
  if (toolSlug === "savings-goal-calculator" || toolSlug === "nepal-share-calculator") return <Calculator slug={toolSlug} />;
  if (toolSlug === "xml-formatter-validator" || toolSlug === "html-tag-stripper") return <TextTool slug={toolSlug} />;
  if (toolSlug === "notes-to-pdf") return <NotesToPdf />;
  return null;
}
