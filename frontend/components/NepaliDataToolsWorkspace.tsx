"use client";

import { useState } from "react";
import { csvToJson, jsonObjectsToCsv } from "../lib/catalog-text";
import { jsonToYaml, randomIntegerBelow } from "../lib/catalog-inputs";
import { addCalendarDays } from "../lib/date-time-calculations";
import { businessDaysInclusive, gcd } from "../lib/catalog-calculations";
import { runNepaliDataTool, type NepaliDataDeps, type NepaliDataToolSlug, type NepaliToolResult } from "../lib/i18n/nepali-data-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";

const randomUint32 = () => globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
const deps: NepaliDataDeps = { csvToJson, jsonObjectsToCsv, jsonToYaml, addCalendarDays, businessDaysInclusive, gcd, randomIntegerBelow, randomUint32 };

type FieldSpec = { key: string; label: string; kind?: "textarea" | "text" | "password" | "date" | "color" | "number"; placeholder?: string };
type Config = { title: string; description: string; fields: FieldSpec[]; example: Record<string, string>; action: string; note: string };

const configs: Record<NepaliDataToolSlug, Config> = {
  "csv-to-json": { title: "CSV बाट JSON", description: "पहिलो पङ्क्तिलाई शीर्षक मानेर CSV डेटालाई JSON array मा बदल्नुहोस्।", fields: [{ key: "text", label: "CSV डेटा", kind: "textarea", placeholder: "name,age\nआशा,22" }], example: { text: "name,age\nआशा,22\nरवि,25" }, action: "JSON बनाउनुहोस्", note: "उद्धरण चिन्हभित्रको comma र नयाँ लाइन समर्थित छ। अधिकतम १ MB।" },
  "json-to-yaml": { title: "JSON बाट YAML", description: "JSON डेटालाई पढ्न सजिलो YAML ढाँचामा बदल्नुहोस्।", fields: [{ key: "text", label: "JSON डेटा", kind: "textarea", placeholder: "{\"name\":\"आशा\"}" }], example: { text: '{"name":"आशा","age":22,"active":true}' }, action: "YAML बनाउनुहोस्", note: "नतिजामा कुञ्जी र मानहरू JSON शैलीमा उद्धरण चिन्हसहित देखिन सक्छन्।" },
  "json-to-csv": { title: "JSON बाट CSV", description: "JSON object हरूको array लाई Excel/Sheets मा खोल्न मिल्ने CSV मा बदल्नुहोस्।", fields: [{ key: "text", label: "JSON array", kind: "textarea", placeholder: "[{\"name\":\"आशा\"}]" }], example: { text: '[{"name":"आशा","age":22},{"name":"रवि","age":25}]' }, action: "CSV बनाउनुहोस्", note: "=, +, -, @ बाट सुरु हुने मानमा सुरक्षाका लागि अपोस्ट्रोफी (') थपिन्छ ताकि स्प्रेडसिटले सूत्र नचलाओस्। अधिकतम १०,००० पङ्क्ति र ५०० स्तम्भ।" },
  "url-validator": { title: "URL जाँचकर्ता", description: "URL को बनोट जाँचेर protocol, host, path र query छुट्याउनुहोस्।", fields: [{ key: "text", label: "URL", kind: "text", placeholder: "https://example.com/path?q=1" }], example: { text: "https://example.com/path?q=1" }, action: "URL जाँच्नुहोस्", note: "यसले बनोट मात्र जाँच्छ; पृष्ठ अस्तित्वमा छ वा सुरक्षित छ भन्ने जाँचिँदैन।" },
  "email-validator": { title: "इमेल जाँचकर्ता", description: "इमेल ठेगानाको आधारभूत बनोट मान्य छ कि छैन जाँच्नुहोस्।", fields: [{ key: "text", label: "इमेल ठेगाना", kind: "text", placeholder: "name@example.com" }], example: { text: "hello@example.com" }, action: "इमेल जाँच्नुहोस्", note: "कुनै इमेल पठाइँदैन र ठेगाना वास्तवमै सक्रिय छ भन्ने जाँचिँदैन।" },
  "password-strength-checker": { title: "पासवर्ड बल जाँचकर्ता", description: "पासवर्डले आधारभूत मापदण्ड कति पूरा गर्छ भनी स्थानीय रूपमा जाँच्नुहोस्।", fields: [{ key: "text", label: "पासवर्ड", kind: "password", placeholder: "पासवर्ड यहाँ लेख्नुहोस्" }], example: { text: "" }, action: "बल जाँच्नुहोस्", note: "यो जाँच तपाईंको ब्राउजरमै हुन्छ र पासवर्ड कतै पठाइँदैन। तैपनि आफ्नो वास्तविक पासवर्ड कुनै अनलाइन टुलमा नहाल्नु नै सुरक्षित हुन्छ।" },
  "url-query-parser": { title: "URL Query पार्सर", description: "URL भित्रका query parameter हरू कुञ्जी र मानमा छुट्याएर हेर्नुहोस्।", fields: [{ key: "text", label: "पूरा URL", kind: "text", placeholder: "https://example.com/search?q=pdf&page=2" }], example: { text: "https://example.com/search?q=pdf&page=2" }, action: "पार्स गर्नुहोस्", note: "URL मा संवेदनशील token भए सार्वजनिक रूपमा साझा नगर्नुहोस्।" },
  "color-converter": { title: "रङ रूपान्तरण (HEX → RGB/HSL)", description: "HEX रङलाई RGB र HSL मान सहित हेर्नुहोस्।", fields: [{ key: "text", label: "HEX रङ", kind: "text", placeholder: "#0f766e" }], example: { text: "#0f766e" }, action: "रूपान्तरण गर्नुहोस्", note: "# चिन्हसहित वा बिना छ अङ्कको HEX स्वीकार गरिन्छ।" },
  "aspect-ratio-calculator": { title: "Aspect Ratio क्याल्कुलेटर", description: "चौडाइ र उचाइबाट सरल aspect ratio निकाल्नुहोस्।", fields: [{ key: "width", label: "चौडाइ", kind: "text", placeholder: "1920" }, { key: "height", label: "उचाइ", kind: "text", placeholder: "1080" }], example: { width: "1920", height: "1080" }, action: "गणना गर्नुहोस्", note: "नेपाली अंक (जस्तै १९२०) पनि स्वीकार गरिन्छ।" },
  "css-gradient-generator": { title: "CSS Gradient जेनेरेटर", description: "दुई रङ र कोणबाट CSS linear-gradient कोड बनाउनुहोस्।", fields: [{ key: "a", label: "पहिलो रङ", kind: "color" }, { key: "b", label: "दोस्रो रङ", kind: "color" }, { key: "angle", label: "कोण (डिग्री)", kind: "text", placeholder: "135" }], example: { a: "#0f766e", b: "#38bdf8", angle: "135" }, action: "कोड बनाउनुहोस्", note: "तलको पूर्वावलोकनमा बनेको gradient देखिन्छ।" },
  "unix-timestamp-converter": { title: "Unix Timestamp रूपान्तरण", description: "Unix timestamp लाई UTC र नेपाल समयमा बदल्नुहोस्।", fields: [{ key: "text", label: "Unix timestamp", kind: "text", placeholder: "1793520000" }], example: { text: "1793520000" }, action: "मिति देखाउनुहोस्", note: "१२ अङ्कभन्दा सानो मानलाई सेकेन्ड र ठूलोलाई मिलिसेकेन्ड मानिन्छ।" },
  "date-add-subtract-calculator": { title: "मिति जोड्ने / घटाउने क्याल्कुलेटर", description: "कुनै मितिमा दिन थपेर वा घटाएर नयाँ मिति निकाल्नुहोस्।", fields: [{ key: "date", label: "सुरु मिति (इस्वी)", kind: "date" }, { key: "days", label: "दिनको संख्या", kind: "text", placeholder: "30" }], example: { date: "2026-11-01", days: "30" }, action: "मिति निकाल्नुहोस्", note: "घटाउन ऋणात्मक संख्या (जस्तै -७) प्रयोग गर्नुहोस्। मिति इस्वी संवत्मा छ; BS रूपान्तरणका लागि मिति रूपान्तरण टुल प्रयोग गर्नुहोस्।" },
  "business-days-calculator": { title: "कार्यदिन क्याल्कुलेटर", description: "दुई मितिबीच शनिबार–आइतबार बाहेकका कार्यदिन गन्नुहोस्।", fields: [{ key: "start", label: "सुरु मिति", kind: "date" }, { key: "end", label: "अन्तिम मिति", kind: "date" }], example: { start: "2026-11-02", end: "2026-11-30" }, action: "कार्यदिन गन्नुहोस्", note: "सार्वजनिक बिदा घटाइँदैन र दुवै मिति गणनामा पर्छन्।" },
  "random-number-generator": { title: "अनियमित सङ्ख्या जेनेरेटर", description: "दिइएको दायराभित्र सुरक्षित अनियमित पूर्ण सङ्ख्या बनाउनुहोस्।", fields: [{ key: "min", label: "न्यूनतम", kind: "text", placeholder: "1" }, { key: "max", label: "अधिकतम", kind: "text", placeholder: "100" }, { key: "count", label: "कति वटा (१–१००)", kind: "text", placeholder: "5" }], example: { min: "1", max: "100", count: "5" }, action: "सङ्ख्या बनाउनुहोस्", note: "ब्राउजरको सुरक्षित अनियमित स्रोत प्रयोग गरिन्छ, र दायराभित्र पक्षपातरहित छनोट हुन्छ।" },
  "dice-roller": { title: "पासा फाल्ने टुल", description: "१ देखि १०० वटासम्म ६-पाटे पासा फाल्नुहोस्।", fields: [{ key: "count", label: "पासाको संख्या (१–१००)", kind: "text", placeholder: "2" }], example: { count: "2" }, action: "पासा फाल्नुहोस्", note: "प्रत्येक पटक नयाँ अनियमित नतिजा आउँछ।" },
};

export default function NepaliDataToolsWorkspace({ slug }: { slug: string }) {
  const toolSlug = slug as NepaliDataToolSlug;
  const config = configs[toolSlug];
  const [values, setValues] = useState<Record<string, string>>(config ? config.example : {});
  const [result, setResult] = useState<NepaliToolResult | null>(null);
  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  if (!config) return null;

  const update = (key: string, value: string) => { setValues((current) => ({ ...current, [key]: value })); setStatus(""); };
  const run = () => { setResult(runNepaliDataTool(toolSlug, values, deps)); setStatus(""); };
  const clear = () => { setValues(Object.fromEntries(Object.keys(config.example).map((key) => [key, ""]))); setResult(null); setStatus(""); };
  const copy = async () => {
    if (!result?.ok) return;
    try { await navigator.clipboard.writeText(result.text); setStatus("नतिजा कपी भयो।"); }
    catch { setStatus("Clipboard अनुमति उपलब्ध छैन; नतिजा हातले चयन गरेर कपी गर्नुहोस्।"); }
  };
  const renderField = (spec: FieldSpec) => {
    const value = values[spec.key] ?? "";
    const id = `${toolSlug}-${spec.key}`;
    const common = { id, className: field, value, placeholder: spec.placeholder, onChange: (event: { target: { value: string } }) => update(spec.key, event.target.value) };
    return (
      <div key={spec.key}>
        <label htmlFor={id} className={labelClass}>{spec.label}</label>
        {spec.kind === "textarea" ? <textarea {...common} className={field + " min-h-40 font-mono"} spellCheck={false} />
          : spec.kind === "password" ? <div className="flex gap-2"><input {...common} type={showPassword ? "text" : "password"} autoComplete="off" spellCheck={false} /><button type="button" className="shrink-0 rounded-xl border border-slate-300 px-3 text-sm font-semibold text-slate-700" aria-pressed={showPassword} onClick={() => setShowPassword((current) => !current)}>{showPassword ? "लुकाउनुहोस्" : "देखाउनुहोस्"}</button></div>
          : spec.kind === "date" ? <input {...common} type="date" />
          : spec.kind === "color" ? <div className="flex items-center gap-2"><input id={id} type="color" aria-label={spec.label} className="h-11 w-14 rounded-lg border border-slate-300 bg-white p-1" value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"} onChange={(event) => update(spec.key, event.target.value)} /><input {...common} id={id + "-hex"} aria-label={spec.label + " (HEX)"} /></div>
          : <input {...common} type="text" inputMode={spec.kind === "number" ? "decimal" : undefined} spellCheck={false} />}
      </div>
    );
  };
  const showGradient = toolSlug === "css-gradient-generator" && result?.ok;

  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-black text-slate-950">{config.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p></div>
      <div className={config.fields.length > 1 ? "grid gap-3 sm:grid-cols-2" : "space-y-3"}>{config.fields.map(renderField)}</div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={run}>{config.action}</button>
        <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={clear}>हटाउनुहोस्</button>
      </div>
      {result ? (result.ok
        ? <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-teal-950">नतिजा</h3><button type="button" className="rounded-lg border border-teal-300 px-3 py-1.5 text-xs font-bold text-teal-900" onClick={copy}>कपी गर्नुहोस्</button></div><pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-teal-950">{result.text}</pre>{showGradient ? <div role="img" aria-label="बनेको gradient को पूर्वावलोकन" className="mt-3 h-20 rounded-xl border border-teal-200" style={{ background: `linear-gradient(${values.angle}deg, ${values.a}, ${values.b})` }} /> : null}</div>
        : <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900"><strong className="block">त्रुटि</strong>{result.text}</div>) : <p className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">नतिजा यहाँ देखिनेछ। माथि प्रविष्टि गरेर “{config.action}” थिच्नुहोस्।</p>}
      {status && <p role="status" className="text-sm text-slate-600">{status}</p>}
      <p className="text-xs leading-5 text-slate-500">{config.note} यो प्रक्रिया तपाईंको ब्राउजरमै हुन्छ; इनपुट कुनै सर्भरमा पठाइँदैन।</p>
    </section>
  );
}
