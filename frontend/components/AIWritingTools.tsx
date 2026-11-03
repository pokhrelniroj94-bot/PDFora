"use client";

import { useState } from "react";

type Props = { slug: string };
type Values = Record<string, string>;

const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";
const panelClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7";

export default function AIWritingTools({ slug }: Props) {
  const [values, setValues] = useState<Values>({});
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key: string, value: string) => setValues((old) => ({ ...old, [key]: value }));
  const value = (key: string) => values[key] ?? "";
  const humanizer = slug === "ai-humanizer";
  const cover = slug === "ai-cover-letter-generator";
  const title = humanizer ? "AI Humanizer & Text Rewriter" : cover ? "AI Cover Letter Generator" : "AI Resume Writer";
  const description = humanizer
    ? "Rewrite text in a natural, clear voice while preserving its meaning and facts."
    : cover
      ? "Create a tailored, professional cover letter from your real experience and a job description."
      : "Generate an ATS-readable resume summary, skills section and experience bullets from your real background.";

  const field = (key: string, label: string, placeholder: string, multiline = false) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {multiline
        ? <textarea className={inputClass + " min-h-28 resize-y"} value={value(key)} onChange={(event) => set(key, event.target.value)} placeholder={placeholder} />
        : <input className={inputClass} value={value(key)} onChange={(event) => set(key, event.target.value)} placeholder={placeholder} />}
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
      if (!response.ok) throw new Error(payload.error || "The AI request could not be completed.");
      setResult(String(payload.text || ""));
      if (!payload.text) throw new Error("The AI provider returned an empty result.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
    localStorage.setItem("pdfora-ai-resume-draft", JSON.stringify(draft));
    window.location.href = "/resume-builder";
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
        <p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">PDFora AI Studio · Free AI</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </header>

      <section className={panelClass}>
        {humanizer ? (
          <div className="space-y-4">
            {field("text", "Text to rewrite", "Paste your paragraph, essay, email or draft here…", true)}
            <label className="block"><span className={labelClass}>Writing style</span><select className={inputClass} value={value("style") || "Natural and clear"} onChange={(event) => set("style", event.target.value)}><option>Natural and clear</option><option>Professional</option><option>Academic</option><option>Friendly and conversational</option><option>Simple English</option></select></label>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {field("name", "Full name", "Your name")}
            {field("role", "Target job title", "e.g. Finance Assistant")}
            {cover && field("company", "Company name", "Company / organisation")}
            {field("skills", cover ? "Relevant skills and education" : "Skills", "List your real skills, qualifications and tools…", true)}
            {field("experience", "Experience / projects", "Describe roles, responsibilities, projects and real achievements…", true)}
            {field("education", "Education", "Degree, institution and graduation year…", true)}
            {field("jobDescription", "Job description", "Paste the job description to tailor the content…", true)}
            <label className="block"><span className={labelClass}>Writing style</span><select className={inputClass} value={value("style") || "Professional"} onChange={(event) => set("style", event.target.value)}><option>Professional</option><option>Concise and confident</option><option>Formal</option><option>Entry-level / fresh graduate</option></select></label>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => void generate()} disabled={busy || (humanizer ? !value("text").trim() : !value("role").trim())} className="rounded-xl bg-teal-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">
            {busy ? "Generating…" : humanizer ? "Humanize text" : cover ? "Generate cover letter" : "Generate resume content"}
          </button>
          <span className="text-xs text-slate-500">No paid AI fallback. If the free quota is unavailable, this tool pauses.</span>
        </div>
      </section>

      {error && <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}
      {result && <section className={panelClass}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-extrabold text-slate-900">Your result</h2><div className="flex gap-2"><button type="button" onClick={copyResult} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50">Copy</button><button type="button" onClick={downloadResult} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">Download TXT</button></div></div>
        <textarea aria-label="Generated result" className={inputClass + " min-h-80 leading-7"} value={result} onChange={(event) => setResult(event.target.value)} />
        <p className="mt-3 text-xs text-slate-500">Review all details before using. AI may make mistakes. Never include achievements or qualifications you cannot verify.</p>
        {!humanizer && !cover && <button type="button" onClick={useInResumeBuilder} className="mt-4 inline-flex rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800">Use this draft in Resume Builder →</button>}
      </section>}

      <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
        <strong className="text-slate-800">Privacy:</strong> Text submitted here is sent to the configured Cloudflare AI provider for processing. Do not paste passwords, identity numbers or confidential documents. The service is unavailable until the owner configures a Cloudflare Workers Free account and restricted AI token.
      </aside>
    </div>
  );
}
