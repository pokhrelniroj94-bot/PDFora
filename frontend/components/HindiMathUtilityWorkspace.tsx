"use client";

import { useState } from "react";
import { hindiMathToolSlugs, runHindiMathTool, type HindiMathToolSlug } from "../lib/i18n/hindi-math-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const label = "mb-1.5 block text-sm font-semibold text-slate-700";

const hindiMathTitles: Record<HindiMathToolSlug, { title: string; description: string }> = {
  "percentage-change-calculator": { title: "प्रतिशत परिवर्तन कैलकुलेटर", description: "शुरुआती और नए मान से प्रतिशत बढ़ोतरी या कमी निकालें।" },
  "average-calculator": { title: "औसत कैलकुलेटर", description: "कॉमा या स्पेस से अलग की गई संख्याओं का औसत निकालें।" },
  "ratio-simplifier": { title: "अनुपात सरल करने वाला टूल", description: "दो पूर्ण संख्याओं के अनुपात को सरलतम रूप में बदलें।" },
  "fraction-calculator": { title: "भिन्न कैलकुलेटर", description: "दो भिन्नों को जोड़ें, घटाएँ, गुणा करें या भाग दें।" },
  "percentage-of-number-calculator": { title: "संख्या का प्रतिशत कैलकुलेटर", description: "किसी संख्या का मनचाहा प्रतिशत निकालें।" },
  "gcd-lcm-calculator": { title: "GCD और LCM कैलकुलेटर", description: "दो पूर्ण संख्याओं का महत्तम समापवर्तक और लघुत्तम समापवर्त्य निकालें।" },
  "prime-number-checker": { title: "अभाज्य संख्या जाँच", description: "जाँचें कि कोई पूर्ण संख्या अभाज्य है या नहीं।" },
  "unit-converter": { title: "इकाई रूपांतरण", description: "लंबाई और वज़न की सामान्य इकाइयों के बीच रूपांतरण करें।" },
  "bmi-calculator": { title: "BMI कैलकुलेटर", description: "वज़न और लंबाई से वयस्क का BMI अनुमानित करें; यह चिकित्सकीय निदान नहीं है।" },
  "bmr-calculator": { title: "BMR कैलकुलेटर", description: "आयु, लंबाई, वज़न और सूत्र के विकल्प से बुनियादी ऊर्जा खर्च का अनुमान लगाएँ।" },
  "tip-calculator": { title: "टिप कैलकुलेटर", description: "बिल, टिप प्रतिशत और व्यक्तियों की संख्या से प्रति व्यक्ति राशि निकालें।" },
  "split-bill-calculator": { title: "बिल बाँटने वाला कैलकुलेटर", description: "कुल बिल को व्यक्तियों में बराबर बाँटें।" },
  "simple-interest-calculator": { title: "साधारण ब्याज कैलकुलेटर", description: "मूलधन, वार्षिक ब्याज दर और अवधि से साधारण ब्याज निकालें।" },
};

const inputLabels: Record<string, string> = {
  from: "शुरुआती मान", to: "नया मान", number: "संख्या", percentage: "प्रतिशत (%)", amount: "मात्रा",
  weight: "वज़न (kg)", height: "लंबाई (cm)", age: "आयु (वर्ष)", bill: "बिल राशि (NPR)", tip: "टिप (%)",
  people: "व्यक्तियों की संख्या", total: "कुल बिल (NPR)", principal: "मूलधन (NPR)", rate: "वार्षिक ब्याज दर (%)", years: "अवधि (वर्ष)",
};

const unitOptions: [string, string][] = [
  ["km", "किलोमीटर (km)"], ["m", "मीटर (m)"], ["cm", "सेंटीमीटर (cm)"], ["mm", "मिलीमीटर (mm)"], ["ft", "फ़ुट (ft)"], ["in", "इंच (in)"],
  ["kg", "किलोग्राम (kg)"], ["g", "ग्राम (g)"], ["lb", "पाउंड (lb)"],
];

const exampleValues: Record<string, string> = {
  from: "100", to: "125", numbers: "10, 20, 30", a: "1", b: "2", c: "1", d: "3",
  number: "100", percentage: "15", amount: "1", operation: "add", fromUnit: "km", toUnit: "m",
  weight: "65", height: "170", age: "25", sex: "male", bill: "1000", tip: "10", people: "2", total: "2400",
  principal: "100000", rate: "10", years: "2",
};

export function isHindiMathSlug(slug: string): slug is HindiMathToolSlug {
  return (hindiMathToolSlugs as readonly string[]).includes(slug);
}

export default function HindiMathUtilityWorkspace({ slug }: { slug: string }) {
  const [values, setValues] = useState<Record<string, string>>(exampleValues);
  const [copyState, setCopyState] = useState("");
  if (!isHindiMathSlug(slug)) return null;
  const config = hindiMathTitles[slug];
  const update = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const result = runHindiMathTool(slug, values);

  const numberField = (key: string, text = inputLabels[key], step = "any") => (
    <label className="block" key={key}>
      <span className={label}>{text}</span>
      <input className={field} type="number" inputMode="decimal" step={step} value={values[key] ?? ""} onChange={(event) => update(key, event.target.value)} />
    </label>
  );
  const unitSelect = (key: "fromUnit" | "toUnit", text: string) => (
    <label className="block">
      <span className={label}>{text}</span>
      <select className={field} value={values[key] ?? ""} onChange={(event) => update(key, event.target.value)}>
        {unitOptions.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
      </select>
    </label>
  );

  async function copyResult() {
    try { await navigator.clipboard.writeText(result); setCopyState("परिणाम कॉपी हो गया।"); }
    catch { setCopyState("कॉपी नहीं हो सका। ब्राउज़र की क्लिपबोर्ड अनुमति जाँचें।"); }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-black text-slate-950">{config.title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p>
      </div>
      {slug === "percentage-change-calculator" && <div className="grid gap-3 sm:grid-cols-2">{numberField("from")}{numberField("to")}</div>}
      {slug === "average-calculator" && (
        <label className="block">
          <span className={label}>संख्याएँ (कॉमा या स्पेस से अलग करें)</span>
          <textarea className={field + " min-h-28"} value={values.numbers ?? ""} onChange={(event) => update("numbers", event.target.value)} />
        </label>
      )}
      {(slug === "ratio-simplifier" || slug === "gcd-lcm-calculator") && <div className="grid gap-3 sm:grid-cols-2">{numberField("a", "पहली पूर्ण संख्या", "1")}{numberField("b", "दूसरी पूर्ण संख्या", "1")}</div>}
      {slug === "fraction-calculator" && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">{numberField("a", "पहले भिन्न का अंश", "1")}{numberField("b", "पहले भिन्न का हर", "1")}{numberField("c", "दूसरे भिन्न का अंश", "1")}{numberField("d", "दूसरे भिन्न का हर", "1")}</div>
          <label className="block">
            <span className={label}>गणना का प्रकार</span>
            <select className={field} value={values.operation ?? "add"} onChange={(event) => update("operation", event.target.value)}>
              <option value="add">जोड़ (+)</option><option value="subtract">घटाव (−)</option><option value="multiply">गुणा (×)</option><option value="divide">भाग (÷)</option>
            </select>
          </label>
        </div>
      )}
      {slug === "percentage-of-number-calculator" && <div className="grid gap-3 sm:grid-cols-2">{numberField("number")}{numberField("percentage")}</div>}
      {slug === "prime-number-checker" && numberField("number", "पूर्ण संख्या", "1")}
      {(slug === "bmi-calculator" || slug === "bmr-calculator") && (
        <div className="grid gap-3 sm:grid-cols-2">
          {numberField("weight")}{numberField("height")}
          {slug === "bmr-calculator" && (
            <>
              {numberField("age", inputLabels.age, "1")}
              <label className="block">
                <span className={label}>सूत्र का विकल्प</span>
                <select className={field} value={values.sex ?? "male"} onChange={(event) => update("sex", event.target.value)}>
                  <option value="male">पुरुष सूत्र</option><option value="female">महिला सूत्र</option>
                </select>
              </label>
            </>
          )}
        </div>
      )}
      {slug === "tip-calculator" && <div className="grid gap-3 sm:grid-cols-3">{numberField("bill")}{numberField("tip")}{numberField("people", inputLabels.people, "1")}</div>}
      {slug === "split-bill-calculator" && <div className="grid gap-3 sm:grid-cols-2">{numberField("total")}{numberField("people", inputLabels.people, "1")}</div>}
      {slug === "simple-interest-calculator" && <div className="grid gap-3 sm:grid-cols-3">{numberField("principal")}{numberField("rate")}{numberField("years")}</div>}
      {slug === "unit-converter" && <div className="grid gap-3 sm:grid-cols-2">{numberField("amount")}{unitSelect("fromUnit", "इस इकाई से")}{unitSelect("toUnit", "इस इकाई में")}</div>}
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite">
        <h3 className="text-sm font-bold text-teal-950">परिणाम</h3>
        <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-teal-950">{result}</pre>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => { setValues({ operation: "add", fromUnit: "km", toUnit: "m", sex: "male" }); setCopyState(""); }}>सभी मान साफ़ करें</button>
        <button type="button" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700" onClick={() => { setValues(exampleValues); setCopyState(""); }}>उदाहरण मान वापस लाएँ</button>
        <button type="button" className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white" onClick={copyResult}>परिणाम कॉपी करें</button>
      </div>
      {copyState && <p role="status" className="text-sm text-slate-600">{copyState}</p>}
      <p className="text-xs leading-5 text-slate-500">गणना आपके दर्ज किए गए मानों पर आधारित है। वित्तीय या स्वास्थ्य संबंधी निर्णय से पहले परिणाम दोबारा जाँच लें।</p>
    </section>
  );
}
