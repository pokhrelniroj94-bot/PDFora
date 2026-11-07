"use client";

import { useMemo, useState } from "react";

const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const button = "rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800";
const secondary = "rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50";

const labels: Record<string, { title: string; description: string }> = {
  "word-character-counter": { title: "शब्द तथा अक्षर गणक", description: "पाठमा भएका शब्द, अक्षर, खाली स्थान र अनुच्छेदको संख्या हेर्नुहोस्।" },
  "case-converter": { title: "अक्षर शैली रूपान्तरण", description: "अङ्ग्रेजी पाठलाई uppercase, lowercase वा title case मा बदल्नुहोस्।" },
  "remove-duplicate-lines": { title: "दोहोरो लाइन हटाउने", description: "पाठबाट दोहोरिएका लाइन हटाई पहिलो आएको क्रम सुरक्षित राख्नुहोस्।" },
  "sort-lines": { title: "लाइन क्रम मिलाउने", description: "पाठका लाइनलाई वर्णक्रम वा उल्टो वर्णक्रममा मिलाउनुहोस्।" },
  "reverse-text": { title: "पाठ उल्ट्याउने", description: "अक्षरको क्रम उल्ट्याउनुहोस्।" },
  "whitespace-cleaner": { title: "खाली स्थान सफा गर्ने", description: "अतिरिक्त space, tab र खाली लाइन व्यवस्थित गर्नुहोस्।" },
  "character-frequency": { title: "अक्षर आवृत्ति गणक", description: "कुन अक्षर कति पटक आएको छ भनेर गणना गर्नुहोस्।" },
  "word-frequency-counter": { title: "शब्द आवृत्ति गणक", description: "पाठमा प्रत्येक शब्द कति पटक आएको छ भनेर हेर्नुहोस्।" },
  "reading-time-calculator": { title: "पढ्ने समय गणक", description: "शब्द संख्या र रोजिएको पढ्ने गतिका आधारमा अनुमानित समय निकाल्नुहोस्।" },
  "line-counter": { title: "लाइन गणक", description: "कुल लाइन, खाली लाइन र सामग्री भएका लाइन छुट्याउनुहोस्।" },
  "sentence-counter": { title: "वाक्य गणक", description: "अङ्ग्रेजी विरामचिह्नका आधारमा वाक्य संख्या अनुमान गर्नुहोस्।" },
};

export default function NepaliTextUtilityWorkspace({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("upper");
  const [speed, setSpeed] = useState("200");
  const config = labels[slug];
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  const words = input.trim() ? input.trim().split(/\s+/u) : [];
  const result = useMemo(() => {
    if (slug === "word-character-counter") {
      const characters = [...input].length;
      const noSpaces = [...input.replace(/\s/gu, "")].length;
      const paragraphs = input.trim() ? input.trim().split(/\n\s*\n/u).length : 0;
      return `शब्द: ${words.length}\nअक्षर (space सहित): ${characters}\nअक्षर (space बाहेक): ${noSpaces}\nअनुच्छेद: ${paragraphs}`;
    }
    if (slug === "case-converter") {
      if (mode === "lower") return input.toLowerCase();
      if (mode === "title") return input.toLowerCase().replace(/(^|[\s-])([a-z])/g, (_, gap, letter) => gap + letter.toUpperCase());
      if (mode === "sentence") return input.toLowerCase().replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (match) => match.toUpperCase());
      return input.toUpperCase();
    }
    if (slug === "remove-duplicate-lines") {
      const seen = new Set<string>();
      return lines.filter((line) => {
        const key = line.trim();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      }).join("\n");
    }
    if (slug === "sort-lines") return [...lines].sort((a, b) => a.localeCompare(b, "ne")).join("\n");
    if (slug === "reverse-text") return [...input].reverse().join("");
    if (slug === "whitespace-cleaner") return input.split("\n").map((line) => line.replace(/[\t ]+/g, " ").trim()).filter((line, index, all) => line || all[index - 1] !== "").join("\n").trim();
    if (slug === "character-frequency") {
      const counts = new Map<string, number>();
      for (const character of [...input.replace(/\s/gu, "")]) counts.set(character, (counts.get(character) ?? 0) + 1);
      return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ne")).map(([character, count]) => `${character} — ${count}`).join("\n") || "गणना गर्न पाठ लेख्नुहोस्।";
    }
    if (slug === "word-frequency-counter") {
      const counts = new Map<string, number>();
      for (const word of words) {
        const key = word.toLocaleLowerCase();
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ne")).map(([word, count]) => `${word} — ${count}`).join("\n") || "गणना गर्न पाठ लेख्नुहोस्।";
    }
    if (slug === "reading-time-calculator") {
      const minutes = words.length / Math.max(1, Number(speed));
      return `शब्द संख्या: ${words.length}\nअनुमानित पढ्ने समय: ${minutes < 1 ? Math.max(1, Math.ceil(minutes * 60)) + " सेकेन्ड" : minutes.toFixed(1) + " मिनेट"}\nपढ्ने गति: ${speed} शब्द/मिनेट`;
    }
    if (slug === "line-counter") {
      const nonEmpty = lines.filter((line) => line.trim()).length;
      return `कुल लाइन: ${input ? lines.length : 0}\nखाली लाइन: ${input ? lines.length - nonEmpty : 0}\nसामग्री भएका लाइन: ${nonEmpty}`;
    }
    if (slug === "sentence-counter") {
      const sentences = input.trim().split(/[.!?]+(?:\s+|$)/u).filter((part) => part.trim());
      return `अनुमानित वाक्य: ${input.trim() ? sentences.length : 0}\nशब्द: ${words.length}`;
    }
    return "";
  }, [input, mode, speed, slug, words.length, lines.length]);

  if (!config) return null;
  return (
    <section className="space-y-4">
      <div><h2 className="text-xl font-black text-slate-950">{config.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{config.description}</p></div>
      {slug === "case-converter" && <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">रूपान्तरण शैली</span><select className={field} value={mode} onChange={(event) => setMode(event.target.value)}><option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="title">Title Case</option><option value="sentence">Sentence case</option></select></label>}
      {slug === "reading-time-calculator" && <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">पढ्ने गति (शब्द/मिनेट)</span><select className={field} value={speed} onChange={(event) => setSpeed(event.target.value)}><option value="150">१५० — ढिलो</option><option value="200">२०० — सामान्य</option><option value="250">२५० — छिटो</option><option value="300">३०० — धेरै छिटो</option></select></label>}
      <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">आफ्नो पाठ यहाँ राख्नुहोस्</span><textarea className={field + " min-h-44 resize-y"} value={input} onChange={(event) => setInput(event.target.value)} placeholder="यहाँ पाठ टाइप वा paste गर्नुहोस्…" /></label>
      <div className="flex flex-wrap gap-2"><button type="button" className={secondary} onClick={() => setInput("")}>पाठ हटाउनुहोस्</button><button type="button" className={button} onClick={() => void navigator.clipboard?.writeText(result)}>नतिजा कपी गर्नुहोस्</button></div>
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4" aria-live="polite"><h3 className="text-sm font-bold text-teal-950">नतिजा</h3><pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-teal-950">{result || "नतिजा हेर्न माथिको बाकसमा पाठ लेख्नुहोस्।"}</pre></div>
      <p className="text-xs leading-5 text-slate-500">नोट: वाक्य गणना सामान्य अङ्ग्रेजी विरामचिह्नमा आधारित अनुमान हो। नेपाली लेखनमा पूर्णविराम (।) प्रयोग भएमा नतिजा फरक पर्न सक्छ।</p>
    </section>
  );
}
