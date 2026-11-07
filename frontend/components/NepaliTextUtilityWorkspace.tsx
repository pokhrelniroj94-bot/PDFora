"use client";

import { useState } from "react";
import { runNepaliTextTool, type NepaliTextToolSlug } from "../lib/i18n/nepali-text-tools";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const button = "rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800";
const secondary = "rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50";

const labels: Record<NepaliTextToolSlug, { title: string; description: string }> = {
  "word-character-counter": { title: "शब्द तथा अक्षर गणक", description: "पाठमा भएका शब्द, अक्षर, खाली स्थान र अनुच्छेदको संख्या हेर्नुहोस्।" },
  "case-converter": { title: "अक्षर शैली रूपान्तरण", description: "अङ्ग्रेजी पाठलाई uppercase, lowercase वा title case मा बदल्नुहोस्।" },
  "remove-duplicate-lines": { title: "दोहोरो लाइन हटाउने", description: "पाठबाट दोहोरिएका लाइन हटाई पहिलो आएको क्रम सुरक्षित राख्नुहोस्।" },
  "sort-lines": { title: "लाइन क्रम मिलाउने", description: "पाठका लाइनलाई नेपाली वर्णक्रममा मिलाउनुहोस्।" },
  "reverse-text": { title: "पाठ उल्ट्याउने", description: "पाठका Unicode अक्षरको क्रम उल्ट्याउनुहोस्।" },
  "whitespace-cleaner": { title: "खाली स्थान सफा गर्ने", description: "अतिरिक्त space, tab र खाली लाइन व्यवस्थित गर्नुहोस्।" },
  "character-frequency": { title: "अक्षर आवृत्ति गणक", description: "कुन अक्षर कति पटक आएको छ भनेर गणना गर्नुहोस्।" },
  "word-frequency-counter": { title: "शब्द आवृत्ति गणक", description: "पाठमा प्रत्येक शब्द कति पटक आएको छ भनेर हेर्नुहोस्।" },
  "reading-time-calculator": { title: "पढ्ने समय गणक", description: "शब्द संख्या र रोजिएको पढ्ने गतिका आधारमा अनुमानित समय निकाल्नुहोस्।" },
  "line-counter": { title: "लाइन गणक", description: "कुल लाइन, खाली लाइन र सामग्री भएका लाइन छुट्याउनुहोस्।" },
  "sentence-counter": { title: "वाक्य गणक", description: "अङ्ग्रेजी विरामचिह्न र नेपाली पूर्णविरामका आधारमा वाक्य संख्या अनुमान गर्नुहोस्।" },
};

export default function NepaliTextUtilityWorkspace({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"upper" | "lower" | "title" | "sentence">("upper");
  const [speed, setSpeed] = useState("200");
  const [copyState, setCopyState] = useState("");
  if (!(slug in labels)) return null;
  const toolSlug = slug as NepaliTextToolSlug;
  const config = labels[toolSlug];
  const result = runNepaliTextTool(toolSlug, input, { caseMode: mode, wordsPerMinute: Number(speed) });

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result);
      setCopyState("नतिजा कपी भयो।");
    } catch {
      setCopyState("कपी गर्न सकिएन। ब्राउजरको clipboard अनुमति जाँच गर्नुहोस्।");
    }
  }

  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-black text-slate-950">{config.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p></div>
      {toolSlug === "case-converter" && <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">रूपान्तरण शैली</span><select className={field} value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}><option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="title">Title Case</option><option value="sentence">Sentence case</option></select></label>}
      {toolSlug === "reading-time-calculator" && <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">पढ्ने गति (शब्द/मिनेट)</span><select className={field} value={speed} onChange={(event) => setSpeed(event.target.value)}><option value="150">१५० — ढिलो</option><option value="200">२०० — सामान्य</option><option value="250">२५० — छिटो</option><option value="300">३०० — धेरै छिटो</option></select></label>}
      <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">आफ्नो पाठ यहाँ राख्नुहोस्</span><textarea className={field + " min-h-44 resize-y"} value={input} onChange={(event) => setInput(event.target.value)} placeholder="यहाँ पाठ टाइप वा paste गर्नुहोस्…" /></label>
      <div className="flex flex-wrap gap-2"><button type="button" className={secondary} onClick={() => { setInput(""); setCopyState(""); }}>पाठ हटाउनुहोस्</button><button type="button" className={button} onClick={copyResult}>नतिजा कपी गर्नुहोस्</button></div>
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><h3 className="text-sm font-bold text-teal-950">नतिजा</h3><pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-teal-950">{result || "नतिजा हेर्न माथिको बाकसमा पाठ लेख्नुहोस्।"}</pre></div>
      {copyState && <p role="status" className="text-sm text-slate-600">{copyState}</p>}
      <p className="text-xs leading-5 text-slate-500">नोट: पढ्ने समय रोजिएको शब्द/मिनेटको आधारमा अनुमान हो। वाक्य गणनाले नेपाली पूर्णविराम र सामान्य अङ्ग्रेजी विरामचिह्न चिन्छ; यो व्याकरणीय विश्लेषण होइन।</p>
    </section>
  );
}
