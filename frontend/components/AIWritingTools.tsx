"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { slug: string; locale?: "en" | "ne"; nestedHeading?: boolean };
type Values = Record<string, string>;

const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";
const panelClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7";

export default function AIWritingTools({ slug, locale = "en", nestedHeading = false }: Props) {
  const Heading = nestedHeading ? "h2" : "h1";
  const ne = locale === "ne";
  const router = useRouter();
  const [values, setValues] = useState<Values>({});
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const set = (key: string, value: string) => setValues((old) => ({ ...old, [key]: value }));
  const value = (key: string) => values[key] ?? "";
  const humanizer = slug === "ai-humanizer";
  const cover = slug === "ai-cover-letter-generator";
  const title = ne
    ? humanizer ? "AI पाठ परिष्कार तथा पुनर्लेखन" : cover ? "AI कभर लेटर जेनेरेटर" : "AI रिजुमे लेखक"
    : humanizer ? "AI Humanizer & Text Rewriter" : cover ? "AI Cover Letter Generator" : "AI Resume Writer";
  const description = ne
    ? humanizer ? "अर्थ र तथ्य जोगाउँदै पाठलाई स्वाभाविक र स्पष्ट शैलीमा पुनर्लेखन गर्नुहोस्।" : cover ? "तपाईंको वास्तविक अनुभव र कामको विवरणबाट लक्षित व्यावसायिक कभर लेटर तयार गर्नुहोस्।" : "तपाईंको वास्तविक पृष्ठभूमिबाट ATS-अनुकूल रिजुमे सारांश, सीप र अनुभवका बुँदा तयार गर्नुहोस्।"
    : humanizer ? "Rewrite text in a natural, clear voice while preserving its meaning and facts."
      : cover ? "Create a tailored, professional cover letter from your real experience and a job description."
      : "Generate an ATS-readable resume summary, skills section and experience bullets from your real background.";

  const field = (key: string, label: string, placeholder: string, multiline = false) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {multiline
        ? <textarea maxLength={humanizer ? 5000 : key === "jobDescription" ? 2200 : 1800} className={inputClass + " min-h-28 resize-y"} value={value(key)} onChange={(event) => set(key, event.target.value)} placeholder={placeholder} />
        : <input maxLength={180} className={inputClass} value={value(key)} onChange={(event) => set(key, event.target.value)} placeholder={placeholder} />}
    </label>
  );

  async function generate() {
    setBusy(true);
    setError("");
    setResult("");
    try {
      const response = await fetch("/api/ai-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: slug, ...values }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || (ne ? "AI अनुरोध पूरा हुन सकेन।" : "The AI request could not be completed."));
      setResult(String(payload.text || ""));
      if (!payload.text) throw new Error(ne ? "AI प्रदायकले खाली नतिजा पठायो।" : "The AI provider returned an empty result.");
    } catch (err) {
      setError(err instanceof Error ? err.message : (ne ? "केही समस्या भयो। फेरि प्रयास गर्नुहोस्।" : "Something went wrong. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  function copyResult() {
    void navigator.clipboard?.writeText(result);
  }

  function useInResumeBuilder() {
    const headings = ["Professional Summary", "Core Skills", "Experience Bullets", "Optional ATS Keywords"];
    const sections: Record<string, string> = {};
    let current = "";
    for (const line of result.split(/\r?\n/)) {
      const normalized = line.trim().replace(/^#{1,3}\s*/, "").replace(/:$/, "").trim();
      const heading = headings.find((item) => item.toLowerCase() === normalized.toLowerCase());
      if (heading) { current = heading; sections[current] = ""; continue; }
      if (current) sections[current] += (sections[current] ? "\n" : "") + line;
    }
    const draft = {
      summary: (sections["Professional Summary"] || "").trim(),
      skills: (sections["Core Skills"] || "").trim(),
      experience: (sections["Experience Bullets"] || "").trim(),
      raw: result,
    };
    try {
      sessionStorage.setItem("pdfora-ai-resume-draft", JSON.stringify({ summary: draft.summary, skills: draft.skills, experience: draft.experience }));
    } catch {
      setError(ne ? "ब्राउजरले यो मस्यौदा अस्थायी रूपमा सार्न सकेन। पाठ प्रतिलिपि गरेर Resume Builder मा टाँस्नुहोस्।" : "Your browser could not temporarily transfer this draft. Copy the text and paste it into Resume Builder instead.");
      return;
    }
    router.push("/resume-builder");
  }

  function downloadResult() {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = humanizer ? "pdfora-humanized-text.txt" : cover ? "pdfora-cover-letter.txt" : "pdfora-ai-resume-content.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">{ne ? "PDFora AI स्टुडियो · निःशुल्क AI" : "PDFora AI Studio · Free AI"}</p>
        <Heading className="mt-2 text-3xl font-black tracking-tight text-slate-950">{title}</Heading>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </header>

      <section className={panelClass}>
        {humanizer ? (
          <div className="space-y-4">
            {field("text", ne ? "पुनर्लेखन गर्नुपर्ने पाठ" : "Text to rewrite", ne ? "अनुच्छेद, निबन्ध, इमेल वा मस्यौदा टाँस्नुहोस्…" : "Paste your paragraph, essay, email or draft here…", true)}
            <label className="block"><span className={labelClass}>{ne ? "लेखन शैली" : "Writing style"}</span><select className={inputClass} value={value("style") || "Natural and clear"} onChange={(event) => set("style", event.target.value)}><option value="Natural and clear">{ne ? "स्वाभाविक र स्पष्ट" : "Natural and clear"}</option><option value="Professional">{ne ? "व्यावसायिक" : "Professional"}</option><option value="Academic">{ne ? "शैक्षिक" : "Academic"}</option><option value="Friendly and conversational">{ne ? "मैत्रीपूर्ण र संवादात्मक" : "Friendly and conversational"}</option><option value="Simple English">{ne ? "सरल अंग्रेजी" : "Simple English"}</option></select></label>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {field("name", ne ? "पूरा नाम" : "Full name", ne ? "तपाईंको नाम" : "Your name")}
            {field("role", ne ? "लक्षित पद" : "Target job title", "e.g. Finance Assistant")}
            {cover && field("company", ne ? "कम्पनीको नाम" : "Company name", ne ? "कम्पनी / संस्था" : "Company / organisation")}
            {field("skills", cover ? (ne ? "सम्बन्धित सीप र शिक्षा" : "Relevant skills and education") : (ne ? "सीप" : "Skills"), ne ? "वास्तविक सीप, योग्यता र उपकरण लेख्नुहोस्…" : "List your real skills, qualifications and tools…", true)}
            {field("experience", ne ? "अनुभव / परियोजना" : "Experience / projects", ne ? "भूमिका, जिम्मेवारी, परियोजना र वास्तविक उपलब्धि लेख्नुहोस्…" : "Describe roles, responsibilities, projects and real achievements…", true)}
            {field("education", ne ? "शिक्षा" : "Education", ne ? "डिग्री, संस्था र उत्तीर्ण वर्ष…" : "Degree, institution and graduation year…", true)}
            {field("jobDescription", ne ? "कामको विवरण" : "Job description", ne ? "सामग्री मिलाउन कामको विवरण टाँस्नुहोस्…" : "Paste the job description to tailor the content…", true)}
            <label className="block"><span className={labelClass}>{ne ? "लेखन शैली" : "Writing style"}</span><select className={inputClass} value={value("style") || "Professional"} onChange={(event) => set("style", event.target.value)}><option value="Professional">{ne ? "व्यावसायिक" : "Professional"}</option><option value="Concise and confident">{ne ? "छोटो र आत्मविश्वासी" : "Concise and confident"}</option><option value="Formal">{ne ? "औपचारिक" : "Formal"}</option><option value="Entry-level / fresh graduate">{ne ? "नयाँ स्नातक / प्रारम्भिक तह" : "Entry-level / fresh graduate"}</option></select></label>
          </div>
        )}
        <label className="mt-5 flex items-start gap-2 text-sm leading-5 text-slate-600"><input type="checkbox" checked={privacyConsent} onChange={(event) => setPrivacyConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-teal-700" /><span>{ne ? "मैले पठाएको पाठ Cloudflare Workers AI मा प्रशोधनका लागि जाने कुरा बुझें। पासवर्ड, सरकारी परिचयपत्र नम्बर, बैंक विवरण वा गोप्य जानकारी पठाउने छैन।" : "I understand that the text I submit will be sent to Cloudflare Workers AI for processing. I will not submit passwords, government ID numbers, financial account details or confidential information."}</span></label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => void generate()} disabled={busy || !privacyConsent || (humanizer ? !value("text").trim() : !value("role").trim())} className="rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">
            {busy ? (ne ? "तयार हुँदैछ…" : "Generating…") : humanizer ? (ne ? "पाठ परिष्कार गर्नुहोस्" : "Humanize text") : cover ? (ne ? "कभर लेटर तयार गर्नुहोस्" : "Generate cover letter") : (ne ? "रिजुमे सामग्री तयार गर्नुहोस्" : "Generate resume content")}
          </button>
          <span className="text-xs text-slate-500">{ne ? "सशुल्क AI fallback छैन। निःशुल्क quota उपलब्ध नभएमा टुल रोकिन्छ।" : "No paid AI fallback. If the free quota is unavailable, this tool pauses."}</span>
        </div>
      </section>

      {error && <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}
      {result && <section className={panelClass}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-extrabold text-slate-900">{ne ? "तपाईंको नतिजा" : "Your result"}</h2><div className="flex gap-2"><button type="button" onClick={copyResult} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50">{ne ? "प्रतिलिपि" : "Copy"}</button><button type="button" onClick={downloadResult} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">{ne ? "TXT डाउनलोड" : "Download TXT"}</button></div></div>
        <textarea aria-label={ne ? "तयार गरिएको नतिजा" : "Generated result"} className={inputClass + " min-h-80 leading-7"} value={result} onChange={(event) => setResult(event.target.value)} />
        <p className="mt-3 text-xs text-slate-500">{ne ? "प्रयोग गर्नुअघि सबै विवरण जाँच गर्नुहोस्। AI ले गल्ती गर्न सक्छ। प्रमाणित गर्न नसकिने उपलब्धि वा योग्यता नथप्नुहोस्।" : "Review all details before using. AI may make mistakes. Never include achievements or qualifications you cannot verify."}</p>
        {!humanizer && !cover && <button type="button" onClick={useInResumeBuilder} className="mt-4 inline-flex rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800">{ne ? "यो मस्यौदा Resume Builder मा प्रयोग गर्नुहोस् →" : "Use this draft in Resume Builder →"}</button>}
      </section>}

      <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
        <strong className="text-slate-800">{ne ? "गोपनीयता:" : "Privacy:"}</strong> {ne ? "पठाइएको पाठ प्रशोधनका लागि कन्फिगर गरिएको Cloudflare AI प्रदायकलाई पठाइन्छ। पासवर्ड, परिचयपत्र नम्बर वा गोप्य कागजात नटाँस्नुहोस्।" : "Text submitted here is sent to the configured Cloudflare AI provider for processing. Do not paste passwords, identity numbers or confidential documents."} {ne ? "PDFora ले prompt वा तयार पाठ जानाजानी बचत गर्दैन।" : "PDFora does not intentionally save prompts or generated text."}
      </aside>
    </div>
  );
}
