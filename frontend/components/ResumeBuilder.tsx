"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Entry = { id: string; school: string; degree: string; place: string; dates: string };
type Job = { id: string; role: string; company: string; dates: string; details: string };
const templates = [
  { id: "harvard", name: "Harvard Classic", note: "ATS-friendly · traditional", color: "#172554" },
  { id: "modern", name: "Modern Sidebar", note: "Two-column · contemporary", color: "#0f766e" },
  { id: "executive", name: "Executive", note: "Premium · leadership", color: "#7c2d12" },
  { id: "minimal", name: "Minimal", note: "Clean · elegant", color: "#334155" },
  { id: "creative", name: "Creative Accent", note: "Bold · visual", color: "#6d28d9" },
  { id: "europass", name: "Europass Inspired", note: "Structured · detailed", color: "#1d4ed8" },
  { id: "corporate", name: "Corporate Gray", note: "Business · understated", color: "#475569" },
  { id: "elegant", name: "Elegant Serif", note: "Editorial · refined", color: "#713f12" },
  { id: "compact", name: "Compact ATS", note: "Space-saving · ATS-friendly", color: "#1e293b" },
  { id: "tech", name: "Technology", note: "Digital · skills-forward", color: "#0369a1" },
  { id: "finance", name: "Finance Analyst", note: "Formal · analytical", color: "#14532d" },
  { id: "graduate", name: "Graduate Starter", note: "Entry-level · education-first", color: "#4338ca" },
  { id: "academic", name: "Academic CV", note: "Research · publications", color: "#7f1d1d" },
  { id: "bold", name: "Bold Header", note: "Strong · confident", color: "#be123c" },
  { id: "clean-two-column", name: "Clean Two Column", note: "Balanced · scannable", color: "#0e7490" },
  { id: "navy", name: "Navy Professional", note: "Classic · dependable", color: "#1e3a8a" },
  { id: "emerald", name: "Emerald Profile", note: "Fresh · modern", color: "#047857" },
  { id: "monochrome", name: "Monochrome", note: "Black & white · timeless", color: "#18181b" },
  { id: "warm", name: "Warm Minimal", note: "Soft · approachable", color: "#9a3412" },
  { id: "international", name: "International Profile", note: "Global · structured", color: "#3730a3" },
];
const uid = () => Math.random().toString(36).slice(2, 9);
const initialEntry = (): Entry => ({ id: uid(), school: "", degree: "", place: "", dates: "" });
const initialJob = (): Job => ({ id: uid(), role: "", company: "", dates: "", details: "" });

const nepaliTemplateCopy: Record<string, { name: string; note: string }> = {
  harvard: { name: "हार्वर्ड क्लासिक", note: "ATS-अनुकूल · परम्परागत" },
  modern: { name: "आधुनिक साइडबार", note: "दुई स्तम्भ · समसामयिक" },
  executive: { name: "कार्यकारी", note: "प्रिमियम · नेतृत्व" },
  minimal: { name: "मिनिमल", note: "सफा · आकर्षक" },
  creative: { name: "क्रिएटिभ एक्सेन्ट", note: "साहसी · दृश्यात्मक" },
  europass: { name: "युरोपास प्रेरित", note: "व्यवस्थित · विस्तृत" },
  corporate: { name: "कर्पोरेट ग्रे", note: "व्यावसायिक · संयमित" },
  elegant: { name: "एलिगेन्ट सेरिफ", note: "सम्पादकीय · परिष्कृत" },
  compact: { name: "कम्प्याक्ट ATS", note: "स्थान बचत · ATS-अनुकूल" },
  tech: { name: "प्रविधि", note: "डिजिटल · सीप केन्द्रित" },
  finance: { name: "वित्त विश्लेषक", note: "औपचारिक · विश्लेषणात्मक" },
  graduate: { name: "स्नातक सुरुवात", note: "प्रारम्भिक तह · शिक्षामुखी" },
  academic: { name: "शैक्षिक CV", note: "अनुसन्धान · प्रकाशन" },
  bold: { name: "साहसी हेडर", note: "बलियो · आत्मविश्वासी" },
  "clean-two-column": { name: "सफा दुई स्तम्भ", note: "सन्तुलित · सजिलै पढिने" },
  navy: { name: "नेभी व्यावसायिक", note: "क्लासिक · भरपर्दो" },
  emerald: { name: "एमराल्ड प्रोफाइल", note: "ताजा · आधुनिक" },
  monochrome: { name: "मोनोक्रोम", note: "कालो र सेतो · कालजयी" },
  warm: { name: "न्यानो मिनिमल", note: "कोमल · सहज" },
  international: { name: "अन्तर्राष्ट्रिय प्रोफाइल", note: "विश्वव्यापी · व्यवस्थित" },
};

type ResumeBuilderProps = { locale?: "en" | "ne" };

export default function ResumeBuilder({ locale = "en" }: ResumeBuilderProps) {
  const ne = locale === "ne";
  const copy = {
    studio: ne ? "PDFora करियर स्टुडियो" : "PDFora Career Studio",
    title: ne ? "व्यावसायिक रिजुमे बिल्डर" : "Professional Resume Builder",
    description: ne ? "२० व्यावसायिक टेम्प्लेट, प्रत्यक्ष पूर्वावलोकन र A4 PDF निर्यातसहित तयार CV बनाउनुहोस्।" : "Build a polished, job-ready CV with 20 professional templates, live preview and print-ready A4 PDF export.",
    aiWrite: ne ? "AI बाट CV सामग्री लेख्नुहोस् ↗" : "AI write CV content ↗",
    cover: ne ? "कभर लेटर ↗" : "Cover letter ↗",
    download: ne ? "CV PDF डाउनलोड गर्नुहोस् ↗" : "Download CV as PDF ↗",
    assistant: ne ? "AI CV सहायक" : "AI CV Assistant",
    improveTitle: ne ? "AI बाट आफ्नो CV सुधार्नुहोस्" : "Improve your CV with AI",
    improveDescription: ne ? "तपाईंको लक्षित पद, सीप, शिक्षा र अनुभव प्रयोग गरी बलियो सारांश र ATS-अनुकूल बुँदा तयार गर्छ। तपाईंको सम्पर्क विवरण र फोटो पठाइँदैन।" : "Uses your target role, skills, education and experience to draft a stronger summary and ATS-friendly bullet points. Your contact details and photo are not sent.",
    improving: ne ? "CV सुधार हुँदैछ…" : "Improving CV…",
    improve: ne ? "AI बाट CV सुधार्नुहोस्" : "Improve CV with AI",
    consent: ne ? "मेरो लक्षित पद, सीप, शिक्षा र अनुभवको पाठ प्रशोधनका लागि कन्फिगर गरिएको AI प्रदायकलाई पठाउन सहमत छु। म गोप्य जानकारी समावेश गर्ने छैन।" : "I agree to send my target role, skills, education and experience text to the configured AI provider for processing. I will not include confidential information.",
    suggestions: ne ? "लागू गर्नुअघि AI सुझाव जाँच गर्नुहोस्" : "Review AI suggestions before applying",
    useSummary: ne ? "यो सारांश प्रयोग गर्नुहोस्" : "Use this summary",
    useSkills: ne ? "यी सीप प्रयोग गर्नुहोस्" : "Use these skills",
    useBullets: ne ? "यी बुँदा प्रयोग गर्नुहोस्" : "Use these bullets",
    personal: ne ? "१. व्यक्तिगत विवरण" : "1. Personal details",
    identity: ne ? "सम्पर्क र पहिचान" : "Contact & identity",
    summary: ne ? "२. व्यावसायिक सारांश" : "2. Professional summary",
    experience: ne ? "३. कामको अनुभव" : "3. Work experience",
    education: ne ? "४. शिक्षा" : "4. Education",
    additional: ne ? "५. सीप तथा थप जानकारी" : "5. Skills & additional information",
    addExperience: ne ? "+ अनुभव थप्नुहोस्" : "+ Add experience",
    addEducation: ne ? "+ शिक्षा थप्नुहोस्" : "+ Add education",
    remove: ne ? "हटाउनुहोस्" : "Remove",
    preview: ne ? "प्रत्यक्ष CV पूर्वावलोकन" : "Live CV preview",
    previewHint: ne ? "टाइप गर्दा अद्यावधिक हुन्छ · A4 प्रिन्ट ढाँचा" : "Updates as you type · A4 print layout",
    export: ne ? "PDF निर्यात" : "Export PDF",
    printHint: ne ? "ब्राउजरको print dialog मा “Save as PDF” छान्नुहोस्। A4 कागज र चयन गरिएको रङ देखाउन background graphics सक्षम गर्नुहोस्।" : "Choose “Save as PDF” in your browser’s print dialog. Use A4 paper and enable background graphics for the selected colour layout.",
  };
  const templateText = (t: typeof templates[number]) => ne ? nepaliTemplateCopy[t.id] : t;
  const [template, setTemplate] = useState("harvard");
  const [accent, setAccent] = useState("#0f766e");
  const [font, setFont] = useState("Arial");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [education, setEducation] = useState<Entry[]>([initialEntry()]);
  const [jobs, setJobs] = useState<Job[]>([initialJob()]);
  const [projects, setProjects] = useState("");
  const [certifications, setCertifications] = useState("");
  const [references, setReferences] = useState("");
  const [aiDraftNotice, setAiDraftNotice] = useState("");
  const [aiConsent, setAiConsent] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<{ summary: string; skills: string; experience: string } | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = sessionStorage.getItem("pdfora-ai-resume-draft");
        if (!saved) return;
        const draft = JSON.parse(saved) as { summary?: string; skills?: string; experience?: string };
        if (draft.summary) setSummary(draft.summary);
        if (draft.skills) setSkills(draft.skills.replace(/\r?\n/g, ", "));
        if (draft.experience) setJobs((rows) => rows.map((row, index) => index === 0 ? { ...row, details: draft.experience || "" } : row));
        setAiDraftNotice(ne ? "AI मस्यौदा आयात भयो। CV निर्यात गर्नुअघि प्रत्येक खण्ड जाँच र सम्पादन गर्नुहोस्।" : "AI draft imported. Review and edit every section before exporting your CV.");
        sessionStorage.removeItem("pdfora-ai-resume-draft");
      } catch {
        sessionStorage.removeItem("pdfora-ai-resume-draft");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [ne]);
  const [photo, setPhoto] = useState("");
  const [photoError, setPhotoError] = useState("");
  const loadPhoto = (file?: File) => {
    setPhotoError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError(ne ? "JPG, PNG वा WebP तस्बिर मात्र प्रयोग गर्नुहोस्।" : "Use a JPG, PNG or WebP image only.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError(ne ? "प्रोफाइल तस्बिर २ MB वा कम हुनुपर्छ।" : "Profile photo must be 2 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => setPhotoError(ne ? "छानिएको तस्बिर पढ्न सकिएन।" : "The selected photo could not be read.");
    reader.readAsDataURL(file);
  };
  const skillList = useMemo(() => skills.split(/[,\n]/).map(s => s.trim()).filter(Boolean), [skills]);
  const updateEducation = (id: string, key: keyof Entry, value: string) => setEducation(rows => rows.map(row => row.id === id ? { ...row, [key]: value } : row));
  const updateJob = (id: string, key: keyof Job, value: string) => setJobs(rows => rows.map(row => row.id === id ? { ...row, [key]: value } : row));
  const input = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
  const label = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500";
  const field = (title: string, value: string, setter: (v: string) => void, placeholder = "") => <label className="block"><span className={label}>{title}</span><input className={input} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} /></label>;
  const area = (title: string, value: string, setter: (v: string) => void, placeholder = "") => <label className="block"><span className={label}>{title}</span><textarea className={input + " min-h-24 resize-y"} value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} /></label>;
  const generateCvWithAi = async () => {
    if (!role.trim() || aiBusy || !aiConsent) return;
    setAiBusy(true);
    setAiError("");
    setAiDraftNotice("");
    setAiSuggestions(null);
    try {
      const experience = jobs.map((job) => [job.role, job.company, job.dates, job.details].filter(Boolean).join(" · ")).filter(Boolean).join("\n");
      const educationText = education.map((item) => [item.degree, item.school, item.place, item.dates].filter(Boolean).join(" · ")).filter(Boolean).join("\n");
      const response = await fetch("/api/ai-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "ai-resume-writer", role, skills, experience, education: educationText, style: "Professional and ATS-friendly" }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || (ne ? "AI ले अहिले CV सुधार्न सकेन।" : "AI could not improve this CV right now."));
      const draft: string = typeof payload.text === "string" ? payload.text.trim() : "";
      if (!draft) throw new Error(ne ? "AI ले खाली CV मस्यौदा पठायो।" : "AI returned an empty CV draft.");
      const lines: string[] = draft.split("\n");
      const headings = ["Professional Summary", "Core Skills", "Experience Bullets", "Optional ATS Keywords"];
      const normalize = (line: string) => line.trim().replaceAll("#", "").replaceAll("*", "").replace(/:$/, "").trim().toLowerCase();
      const extract = (heading: string) => {
        const start = lines.findIndex((line: string) => normalize(line) === heading.toLowerCase());
        if (start < 0) return "";
        const end = lines.findIndex((line: string, index: number) => index > start && headings.some((item) => normalize(line) === item.toLowerCase()));
        return lines.slice(start + 1, end < 0 ? lines.length : end).join("\n").trim();
      };
      const nextSummary = extract("Professional Summary");
      const nextSkills = extract("Core Skills");
      const nextExperience = extract("Experience Bullets");
      if (!nextSummary && !nextSkills && !nextExperience) throw new Error(ne ? "AI ले अपेक्षित ढाँचामा नतिजा पठाएन। छुट्टै AI रिजुमे लेखक प्रयोग गरी नतिजा जाँच गर्नुहोस्।" : "AI returned an unexpected format. Please use the separate AI Resume Writer and review its output.");
      setAiSuggestions({ summary: nextSummary, skills: nextSkills, experience: nextExperience });
      setAiDraftNotice(ne ? "AI मस्यौदा तल तयार छ। लागू गर्ने सुझाव छान्नुहोस्; तपाईंका विद्यमान CV फिल्डहरू परिवर्तन भएका छैनन्।" : "AI draft is ready below. Choose which suggestions to apply; your existing CV fields have not been overwritten.");
    } catch (error) {
      setAiError(error instanceof Error ? error.message : (ne ? "AI CV सहायता अस्थायी रूपमा उपलब्ध छैन।" : "AI CV assistance is temporarily unavailable."));
    } finally {
      setAiBusy(false);
    }
  };
  const print = () => window.print();
  const heading = (title: string) => <h3 className="mb-3 mt-6 border-b pb-2 text-sm font-extrabold uppercase tracking-widest" style={{ color: accent, borderColor: accent + "55" }}>{title}</h3>;
  const section = (en: string, nepali: string) => ne ? nepali : en;

  return <main lang={ne ? "ne" : "en"} className={(ne ? "font-nepali " : "") + "mx-auto min-h-screen max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8"}>
    {aiDraftNotice && <div role="status" className="no-print mb-5 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm font-medium text-teal-900">{aiDraftNotice}</div>}
    <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">{copy.studio}</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{copy.title}</h1><p className="mt-2 max-w-2xl text-slate-600">{copy.description}</p></div>
      <div className="no-print flex flex-wrap gap-2"><a href={ne ? "/ne/tools/ai-resume-writer" : "/tools/ai-resume-writer"} className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-extrabold text-teal-800 transition hover:bg-teal-100">{copy.aiWrite}</a><a href={ne ? "/ne/tools/ai-cover-letter-generator" : "/tools/ai-cover-letter-generator"} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50">{copy.cover}</a><button aria-label={copy.download} onClick={print} className="rounded-xl bg-teal-700 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800">{copy.download}</button></div>
    </div>
    <div className="no-print mb-6 rounded-2xl border border-teal-200 bg-teal-50/60 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wide text-teal-800">{copy.assistant}</p><h2 className="mt-1 text-lg font-extrabold text-slate-950">{copy.improveTitle}</h2><p className="mt-1 max-w-2xl text-sm text-slate-600">{copy.improveDescription}</p></div><button type="button" onClick={() => void generateCvWithAi()} disabled={aiBusy || !aiConsent || !role.trim()} className="rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{aiBusy ? copy.improving : copy.improve}</button></div>
      <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-600"><input aria-label={ne ? "AI प्रशोधन सहमति" : "AI processing consent"} type="checkbox" checked={aiConsent} onChange={(event) => setAiConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-teal-700" /><span>{copy.consent}</span></label>
      {aiError && <p role="alert" className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{aiError}</p>}
      {aiSuggestions && <div className="mt-4 space-y-3 rounded-xl border border-teal-200 bg-white p-4">
        <p className="text-sm font-extrabold text-slate-900">{copy.suggestions}</p>
        {aiSuggestions.summary && <div><p className="mb-1 text-xs font-bold uppercase text-slate-500">{section("Professional summary", "व्यावसायिक सारांश")}</p><p className="whitespace-pre-wrap text-sm text-slate-700">{aiSuggestions.summary}</p><button type="button" onClick={() => { setSummary(aiSuggestions.summary); setAiDraftNotice(ne ? "AI सारांश लागू भयो। निर्यात गर्नुअघि जाँच गर्नुहोस्।" : "AI summary applied. Review it before exporting."); }} className="mt-2 rounded-lg border border-teal-300 px-3 py-2 text-xs font-bold text-teal-800">{copy.useSummary}</button></div>}
        {aiSuggestions.skills && <div className="border-t border-slate-100 pt-3"><p className="mb-1 text-xs font-bold uppercase text-slate-500">{section("Core skills", "मुख्य सीप")}</p><p className="whitespace-pre-wrap text-sm text-slate-700">{aiSuggestions.skills}</p><button type="button" onClick={() => { setSkills(aiSuggestions.skills.replace(/\r?\n/g, ", ")); setAiDraftNotice(ne ? "AI सीप लागू भए। निर्यात गर्नुअघि जाँच गर्नुहोस्।" : "AI skills applied. Review them before exporting."); }} className="mt-2 rounded-lg border border-teal-300 px-3 py-2 text-xs font-bold text-teal-800">{copy.useSkills}</button></div>}
        {aiSuggestions.experience && <div className="border-t border-slate-100 pt-3"><p className="mb-1 text-xs font-bold uppercase text-slate-500">{section("Experience bullets", "अनुभवका बुँदा")}</p><p className="whitespace-pre-wrap text-sm text-slate-700">{aiSuggestions.experience}</p><button type="button" onClick={() => { setJobs((rows) => rows.length ? rows.map((row, index) => index === 0 ? { ...row, details: aiSuggestions.experience } : row) : [{ ...initialJob(), details: aiSuggestions.experience }]); setAiDraftNotice(ne ? "AI अनुभवका बुँदा लागू भए। निर्यात गर्नुअघि प्रत्येक तथ्य जाँच गर्नुहोस्।" : "AI experience bullets applied. Verify every fact before exporting."); }} className="mt-2 rounded-lg border border-teal-300 px-3 py-2 text-xs font-bold text-teal-800">{copy.useBullets}</button></div>}
      </div>}
    </div>
    <div className="no-print mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map(t => { const localized = templateText(t); return <button key={t.id} aria-label={`${localized.name}${template === t.id ? ` — ${ne ? "चयन गरिएको" : "Selected"}` : ""}`} onClick={() => setTemplate(t.id)} className={"rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md " + (template === t.id ? "border-teal-600 bg-teal-50 ring-2 ring-teal-100" : "border-slate-200 bg-white")}>
        <div className="mb-2 flex h-20 overflow-hidden rounded-lg border border-slate-200 bg-white"><div className="w-[28%]" style={{ background: t.id === "modern" || t.id === "creative" ? t.color : "#f1f5f9" }} /><div className="flex-1 p-2"><div className="mb-2 h-2 w-2/3 rounded" style={{ background: t.color }} /><div className="mb-1 h-1 w-full rounded bg-slate-200" /><div className="mb-1 h-1 w-4/5 rounded bg-slate-200" /><div className="mt-3 h-1 w-1/2 rounded bg-slate-300" /></div></div><span className="block text-sm font-extrabold text-slate-900">{localized.name}</span><span className="text-xs text-slate-500">{localized.note}</span>{template === t.id && <span className="ml-2 text-xs font-bold text-teal-700">{ne ? "चयन गरिएको ✓" : "Selected ✓"}</span>}
      </button>; })}
    </div>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(560px,1.08fr)]">
      <section className="no-print space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-extrabold text-slate-900">{copy.personal}</h2><span className="text-xs text-slate-400">{copy.identity}</span></div>
          <div className="grid gap-4 sm:grid-cols-2">{field(ne ? "पूरा नाम" : "Full name", name, setName, ne ? "जस्तै: अलेक्स मोर्गन" : "e.g. Alex Morgan")}{field(ne ? "व्यावसायिक पद" : "Professional title", role, setRole, ne ? "जस्तै: वित्त स्नातक" : "e.g. Finance Graduate")}{field(ne ? "इमेल" : "Email", email, setEmail, "alex@email.com")}{field(ne ? "फोन" : "Phone", phone, setPhone, "+977 98XXXXXXXX")}{field(ne ? "शहर / देश" : "City / Country", location, setLocation, ne ? "काठमाडौं, नेपाल" : "Kathmandu, Nepal")}{field(ne ? "वेबसाइट / LinkedIn" : "Website / LinkedIn", website, setWebsite, "linkedin.com/in/yourname")}</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="block"><span className={label}>{ne ? "प्रोफाइल तस्बिर (ऐच्छिक)" : "Profile photo (optional)"}</span><input aria-label={ne ? "प्रोफाइल तस्बिर छान्नुहोस्" : "Choose profile photo"} className={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => loadPhoto(e.target.files?.[0])} />{photoError && <p role="alert" className="mt-1 text-xs text-rose-700">{photoError}</p>}</label><label className="block"><span className={label}>{ne ? "एक्सेन्ट रङ" : "Accent colour"}</span><div className="flex gap-2"><input aria-label={ne ? "एक्सेन्ट रङ छान्नुहोस्" : "Choose accent colour"} type="color" value={accent} onChange={e=>setAccent(e.target.value)} className="h-10 w-14 rounded-lg border border-slate-200" /><select aria-label={ne ? "CV फन्ट" : "CV font"} className={input} value={font} onChange={e=>setFont(e.target.value)}><option>Arial</option><option>Georgia</option><option>Helvetica</option><option>Times New Roman</option>{ne && <option value="Noto Sans Devanagari">Noto Sans Devanagari</option>}</select></div></label></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="mb-4 text-lg font-extrabold text-slate-900">{copy.summary}</h2>{area(ne ? "तपाईंको परिचय" : "About you", summary, setSummary, ne ? "आफ्नो अनुभव, बलिया पक्ष र लक्षित पदबारे २–४ छोटा वाक्य लेख्नुहोस्।" : "Write 2–4 concise sentences about your experience, strengths and target role.")}</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-extrabold text-slate-900">{copy.experience}</h2><button aria-label={copy.addExperience} onClick={()=>setJobs(rows=>[...rows,initialJob()])} className="rounded-lg border border-teal-200 px-3 py-2 text-xs font-bold text-teal-800 hover:bg-teal-50">{copy.addExperience}</button></div>{jobs.map((j,i)=><div key={j.id} className="mb-4 rounded-xl bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><b className="text-sm">{ne ? `पद ${i+1}` : `Position ${i+1}`}</b><button aria-label={`${copy.remove} ${ne ? `पद ${i+1}` : `position ${i+1}`}`} onClick={()=>setJobs(rows=>rows.filter(x=>x.id!==j.id))} className="text-xs font-bold text-rose-600">{copy.remove}</button></div><div className="grid gap-3 sm:grid-cols-2">{field(ne ? "पदको नाम" : "Job title",j.role,v=>updateJob(j.id,"role",v),ne ? "जस्तै: लेखा सहायक" : "e.g. Accounts Assistant")}{field(ne ? "कम्पनी" : "Company",j.company,v=>updateJob(j.id,"company",v),ne ? "कम्पनीको नाम" : "Company name")}{field(ne ? "मिति" : "Dates",j.dates,v=>updateJob(j.id,"dates",v),ne ? "जनवरी २०२४ – हालसम्म" : "Jan 2024 – Present")}</div><div className="mt-3">{area(ne ? "उपलब्धि र जिम्मेवारी (प्रति लाइन एक)" : "Achievements & responsibilities (one per line)",j.details,v=>updateJob(j.id,"details",v),ne ? "• मासिक प्रतिवेदन तयार गरेँ\n• सुधार गरेँ..." : "• Prepared monthly reports\n• Improved...")}</div></div>)}</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-extrabold text-slate-900">{copy.education}</h2><button aria-label={copy.addEducation} onClick={()=>setEducation(rows=>[...rows,initialEntry()])} className="rounded-lg border border-teal-200 px-3 py-2 text-xs font-bold text-teal-800 hover:bg-teal-50">{copy.addEducation}</button></div>{education.map((e,i)=><div key={e.id} className="mb-3 rounded-xl bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><b className="text-sm">{ne ? `शिक्षा ${i+1}` : `Education ${i+1}`}</b><button aria-label={`${copy.remove} ${ne ? `शिक्षा ${i+1}` : `education ${i+1}`}`} onClick={()=>setEducation(rows=>rows.filter(x=>x.id!==e.id))} className="text-xs font-bold text-rose-600">{copy.remove}</button></div><div className="grid gap-3 sm:grid-cols-2">{field(ne ? "डिग्री / योग्यता" : "Degree / qualification",e.degree,v=>updateEducation(e.id,"degree",v),ne ? "BBA, व्यवसाय प्रशासनमा स्नातक" : "BBA, Bachelor of Business Administration")}{field(ne ? "शैक्षिक संस्था" : "Institution",e.school,v=>updateEducation(e.id,"school",v),ne ? "विश्वविद्यालय / कलेज" : "University / College")}{field(ne ? "स्थान" : "Location",e.place,v=>updateEducation(e.id,"place",v),ne ? "इलाम, नेपाल" : "Ilam, Nepal")}{field(ne ? "मिति" : "Dates",e.dates,v=>updateEducation(e.id,"dates",v),ne ? "२०२३ – २०२७" : "2023 – 2027")}</div></div>)}</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="mb-4 text-lg font-extrabold text-slate-900">{copy.additional}</h2><div className="grid gap-4 sm:grid-cols-2">{area(ne ? "सीप (अल्पविरामले छुट्याउनुहोस्)" : "Skills (comma separated)",skills,setSkills,ne ? "वित्तीय विश्लेषण, Excel, सञ्चार" : "Financial analysis, Excel, Communication")}{area(ne ? "भाषाहरू" : "Languages",languages,setLanguages,ne ? "नेपाली (मातृभाषा), अंग्रेजी (व्यावसायिक)" : "Nepali (Native), English (Professional)")}{area(ne ? "परियोजनाहरू" : "Projects",projects,setProjects,ne ? "परियोजनाको नाम — तपाईंले बनाएको कुरा र नतिजा" : "Project name — what you built and the result")}{area(ne ? "प्रमाणपत्रहरू" : "Certifications",certifications,setCertifications,ne ? "पाठ्यक्रम / प्रमाणपत्र — प्रदायक, वर्ष" : "Course / certificate — issuer, year")}{area(ne ? "सन्दर्भ (ऐच्छिक)" : "References (optional)",references,setReferences,ne ? "आवश्यक परे उपलब्ध गराइनेछ" : "Available upon request")}</div></div>
      </section>
      <section className="min-w-0 xl:sticky xl:top-4">
        <div className="no-print mb-3 flex items-center justify-between"><div><h2 className="font-extrabold text-slate-900">{copy.preview}</h2><p className="text-xs text-slate-500">{copy.previewHint}</p></div><button aria-label={copy.export} onClick={print} className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white">{copy.export}</button></div>
        <article id="resume-paper" lang={ne ? "ne" : "en"} className={"resume-paper mx-auto min-h-[800px] w-full max-w-[794px] overflow-hidden bg-white text-slate-800 shadow-[0_20px_70px_rgba(15,23,42,.14)] " + (["modern","creative","tech","finance","clean-two-column","navy","emerald"].includes(template) ? "resume-sidebar" : "")} style={{ fontFamily: ne ? '"Noto Sans Devanagari", "Nirmala UI", Mangal, Arial, sans-serif' : font }}>
          {(["modern","creative","tech","finance","clean-two-column","navy","emerald"].includes(template)) ? <div className="grid min-h-[1123px] grid-cols-[31%_69%]">
            <div className="p-7">{summary && <>{heading(section("Profile", "परिचय"))}<p className="whitespace-pre-line text-sm leading-6">{summary}</p></>}{jobs.some(j=>j.role||j.company) && <>{heading(section("Experience", "अनुभव"))}{jobs.filter(j=>j.role||j.company).map(j=><div className="mb-4" key={j.id}><div className="flex justify-between gap-2"><b>{j.role}</b><span className="text-xs text-slate-500">{j.dates}</span></div><p className="text-sm">{j.company}</p><p className="mt-1 whitespace-pre-line text-xs leading-5">{j.details}</p></div>)}</>}{education.some(e=>e.degree||e.school) && <>{heading(section("Education", "शिक्षा"))}{education.filter(e=>e.degree||e.school).map(e=><div className="mb-3" key={e.id}><b className="text-sm">{e.degree}</b><p className="text-sm">{e.school} {e.place && "· "+e.place}</p><p className="text-xs text-slate-500">{e.dates}</p></div>)}</>}{projects && <>{heading(section("Projects", "परियोजनाहरू"))}<p className="whitespace-pre-line text-sm">{projects}</p></>}{certifications && <>{heading(section("Certifications", "प्रमाणपत्रहरू"))}<p className="whitespace-pre-line text-sm">{certifications}</p></>}{references && <>{heading(section("References", "सन्दर्भहरू"))}<p className="whitespace-pre-line text-sm">{references}</p></>}</div>
          </div> : <div className="p-10">
            <header className="border-b-2 pb-5 text-center" style={{borderColor:accent}}>{photo && <Image src={photo} alt={ne ? "प्रोफाइल तस्बिर" : "Profile"} width={80} height={80} unoptimized className="mx-auto mb-3 h-20 w-20 rounded-full object-cover" />}<h2 className="text-3xl font-black tracking-tight" style={{color:accent}}>{name || (ne ? "तपाईंको नाम" : "Your Name")}</h2><p className="mt-1 text-base font-semibold">{role || (ne ? "व्यावसायिक पद" : "Professional Title")}</p><p className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-600">{[email,phone,location,website].filter(Boolean).map(x=><span key={x}>{x}</span>)}</p></header>
            {summary && <>{heading(section("Professional Summary", "व्यावसायिक सारांश"))}<p className="whitespace-pre-line text-sm leading-6">{summary}</p></>}
            {jobs.some(j=>j.role||j.company) && <>{heading(section("Professional Experience", "व्यावसायिक अनुभव"))}{jobs.filter(j=>j.role||j.company).map(j=><div className="mb-4" key={j.id}><div className="flex justify-between gap-3"><b className="text-sm">{j.role}</b><span className="text-xs text-slate-500">{j.dates}</span></div><p className="text-sm italic">{j.company}</p><p className="mt-1 whitespace-pre-line text-sm leading-5">{j.details}</p></div>)}</>}
            {education.some(e=>e.degree||e.school) && <>{heading(section("Education", "शिक्षा"))}{education.filter(e=>e.degree||e.school).map(e=><div className="mb-3" key={e.id}><div className="flex justify-between gap-3"><b className="text-sm">{e.degree}</b><span className="text-xs text-slate-500">{e.dates}</span></div><p className="text-sm">{e.school}{e.place && " · "+e.place}</p></div>)}</>}
            {skillList.length>0 && <>{heading(section("Core Skills", "मुख्य सीप"))}<p className="text-sm leading-6">{skillList.join("  •  ")}</p></>}
            {languages && <>{heading(section("Languages", "भाषाहरू"))}<p className="whitespace-pre-line text-sm">{languages}</p></>}
            {projects && <>{heading(section("Projects", "परियोजनाहरू"))}<p className="whitespace-pre-line text-sm leading-6">{projects}</p></>}
            {certifications && <>{heading(section("Certifications", "प्रमाणपत्रहरू"))}<p className="whitespace-pre-line text-sm leading-6">{certifications}</p></>}
            {references && <>{heading(section("References", "सन्दर्भहरू"))}<p className="whitespace-pre-line text-sm">{references}</p></>}
          </div>}
        </article>
        <p className="no-print mt-3 text-center text-xs text-slate-500">{copy.printHint}</p>
      </section>
    </div>
    <style jsx global>{`
      @media print {
        @page { size: A4; margin: 0; }
        html, body { background: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body * { visibility: hidden !important; }
        #resume-paper, #resume-paper * { visibility: visible !important; }
        #resume-paper { position: absolute !important; left: 0 !important; top: 0 !important; width: 210mm !important; min-height: 297mm !important; max-width: none !important; margin: 0 !important; box-shadow: none !important; }
        .no-print { display: none !important; }
      }
    `}</style>
  </main>;
}
