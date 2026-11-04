"use client";

import { useMemo, useState } from "react";
import { toolUi } from "../lib/tool-ui-i18n";

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

export default function ResumeBuilder({locale="en"}:{locale?:string}) {
  const tr=(source:string)=>toolUi(locale,source);
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
  const [photo, setPhoto] = useState("");
  const selected = templates.find(t => t.id === template)!;
  const skillList = useMemo(() => skills.split(/[,\n]/).map(s => s.trim()).filter(Boolean), [skills]);
  const updateEducation = (id: string, key: keyof Entry, value: string) => setEducation(rows => rows.map(row => row.id === id ? { ...row, [key]: value } : row));
  const updateJob = (id: string, key: keyof Job, value: string) => setJobs(rows => rows.map(row => row.id === id ? { ...row, [key]: value } : row));
  const input = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";
  const label = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500";
  const field = (title: string, value: string, setter: (v: string) => void, placeholder = "") => <label className="block"><span className={label}>{tr(title)}</span><input className={input} value={value} onChange={e => setter(e.target.value)} placeholder={tr(placeholder)} /></label>;
  const area = (title: string, value: string, setter: (v: string) => void, placeholder = "") => <label className="block"><span className={label}>{tr(title)}</span><textarea className={input + " min-h-24 resize-y"} value={value} onChange={e => setter(e.target.value)} placeholder={tr(placeholder)} /></label>;
  const print = () => window.print();
  const heading = (title: string) => <h3 className="mb-3 mt-6 border-b pb-2 text-sm font-extrabold uppercase tracking-widest" style={{ color: accent, borderColor: accent + "55" }}>{title}</h3>;

  return <main className="mx-auto min-h-screen max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
    <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">PDFora Career Studio</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Professional Resume Builder</h1><p className="mt-2 max-w-2xl text-slate-600">Build a polished, job-ready CV with live preview, six layouts and print-ready A4 PDF export.</p></div>
      <button onClick={print} className="no-print rounded-xl bg-teal-700 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800">{tr("Download CV as PDF")} ↗</button>
    </div>
    <div className="no-print mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map(t => <button key={t.id} onClick={() => setTemplate(t.id)} className={"rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md " + (template === t.id ? "border-teal-600 bg-teal-50 ring-2 ring-teal-100" : "border-slate-200 bg-white")}>
        <div className="mb-2 flex h-20 overflow-hidden rounded-lg border border-slate-200 bg-white"><div className="w-[28%]" style={{ background: t.id === "modern" || t.id === "creative" ? t.color : "#f1f5f9" }} /><div className="flex-1 p-2"><div className="mb-2 h-2 w-2/3 rounded" style={{ background: t.color }} /><div className="mb-1 h-1 w-full rounded bg-slate-200" /><div className="mb-1 h-1 w-4/5 rounded bg-slate-200" /><div className="mt-3 h-1 w-1/2 rounded bg-slate-300" /></div></div><span className="block text-sm font-extrabold text-slate-900">{t.name}</span><span className="text-xs text-slate-500">{t.note}</span>{template === t.id && <span className="ml-2 text-xs font-bold text-teal-700">Selected ✓</span>}
      </button>)}
    </div>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(560px,1.08fr)]">
      <section className="no-print space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-extrabold text-slate-900">1. Personal details</h2><span className="text-xs text-slate-400">Contact & identity</span></div>
          <div className="grid gap-4 sm:grid-cols-2">{field("Full name", name, setName, "e.g. Alex Morgan")}{field("Professional title", role, setRole, "e.g. Finance Graduate")}{field("Email", email, setEmail, "alex@email.com")}{field("Phone", phone, setPhone, "+977 98XXXXXXXX")}{field("City / Country", location, setLocation, "Kathmandu, Nepal")}{field("Website / LinkedIn", website, setWebsite, "linkedin.com/in/yourname")}</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="block"><span className={label}>Profile photo (optional)</span><input className={input} type="file" accept="image/*" onChange={e => { const f=e.target.files?.[0]; if(f){const reader=new FileReader();reader.onload=()=>setPhoto(String(reader.result));reader.readAsDataURL(f);} }} /></label><label className="block"><span className={label}>Accent colour</span><div className="flex gap-2"><input type="color" value={accent} onChange={e=>setAccent(e.target.value)} className="h-10 w-14 rounded-lg border border-slate-200" /><select className={input} value={font} onChange={e=>setFont(e.target.value)}><option>Arial</option><option>Georgia</option><option>Helvetica</option><option>Times New Roman</option></select></div></label></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="mb-4 text-lg font-extrabold text-slate-900">2. Professional summary</h2>{area("About you", summary, setSummary, "Write 2–4 concise sentences about your experience, strengths and target role.")}</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-extrabold text-slate-900">3. Work experience</h2><button onClick={()=>setJobs(rows=>[...rows,initialJob()])} className="rounded-lg border border-teal-200 px-3 py-2 text-xs font-bold text-teal-800 hover:bg-teal-50">+ Add experience</button></div>{jobs.map((j,i)=><div key={j.id} className="mb-4 rounded-xl bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><b className="text-sm">Position {i+1}</b><button onClick={()=>setJobs(rows=>rows.filter(x=>x.id!==j.id))} className="text-xs font-bold text-rose-600">Remove</button></div><div className="grid gap-3 sm:grid-cols-2">{field("Job title",j.role,v=>updateJob(j.id,"role",v),"e.g. Accounts Assistant")}{field("Company",j.company,v=>updateJob(j.id,"company",v),"Company name")}{field("Dates",j.dates,v=>updateJob(j.id,"dates",v),"Jan 2024 – Present")}</div><div className="mt-3">{area("Achievements & responsibilities (one per line)",j.details,v=>updateJob(j.id,"details",v),"• Prepared monthly reports\n• Improved...")}</div></div>)}</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-extrabold text-slate-900">4. Education</h2><button onClick={()=>setEducation(rows=>[...rows,initialEntry()])} className="rounded-lg border border-teal-200 px-3 py-2 text-xs font-bold text-teal-800 hover:bg-teal-50">+ Add education</button></div>{education.map((e,i)=><div key={e.id} className="mb-3 rounded-xl bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><b className="text-sm">Education {i+1}</b><button onClick={()=>setEducation(rows=>rows.filter(x=>x.id!==e.id))} className="text-xs font-bold text-rose-600">Remove</button></div><div className="grid gap-3 sm:grid-cols-2">{field("Degree / qualification",e.degree,v=>updateEducation(e.id,"degree",v),"BBA, Bachelor of Business Administration")}{field("Institution",e.school,v=>updateEducation(e.id,"school",v),"University / College")}{field("Location",e.place,v=>updateEducation(e.id,"place",v),"Ilam, Nepal")}{field("Dates",e.dates,v=>updateEducation(e.id,"dates",v),"2023 – 2027")}</div></div>)}</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="mb-4 text-lg font-extrabold text-slate-900">5. Skills & additional information</h2><div className="grid gap-4 sm:grid-cols-2">{area("Skills (comma separated)",skills,setSkills,"Financial analysis, Excel, Communication")}{area("Languages",languages,setLanguages,"Nepali (Native), English (Professional)")}{area("Projects",projects,setProjects,"Project name — what you built and the result")}{area("Certifications",certifications,setCertifications,"Course / certificate — issuer, year")}{area("References (optional)",references,setReferences,"Available upon request")}</div></div>
      </section>
      <section className="min-w-0 xl:sticky xl:top-4">
        <div className="no-print mb-3 flex items-center justify-between"><div><h2 className="font-extrabold text-slate-900">Live CV preview</h2><p className="text-xs text-slate-500">Updates as you type · A4 print layout</p></div><button onClick={print} className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white">{tr("Export PDF")}</button></div>
        <article id="resume-paper" className={"resume-paper mx-auto min-h-[800px] w-full max-w-[794px] overflow-hidden bg-white text-slate-800 shadow-[0_20px_70px_rgba(15,23,42,.14)] " + (["modern","creative","tech","finance","clean-two-column","navy","emerald"].includes(template) ? "resume-sidebar" : "")} style={{ fontFamily: font }}>
          {(["modern","creative","tech","finance","clean-two-column","navy","emerald"].includes(template)) ? <div className="grid min-h-[1123px] grid-cols-[31%_69%]">
            <aside className="p-6 text-white" style={{background:accent}}>{photo && <img src={photo} alt="Profile" className="mb-5 h-24 w-24 rounded-full object-cover" />}<h1 className="break-words text-2xl font-black leading-tight">{name || "Your Name"}</h1><p className="mt-2 text-sm opacity-90">{role || "Professional Title"}</p><div className="mt-7 space-y-2 break-words text-xs">{[email,phone,location,website].filter(Boolean).map(x=><p key={x}>{x}</p>)}</div><h3 className="mt-8 border-b border-white/40 pb-2 text-xs font-extrabold uppercase tracking-widest">Skills</h3><ul className="mt-3 space-y-2 text-xs">{skillList.map(s=><li key={s}>• {s}</li>)}</ul>{languages && <><h3 className="mt-8 border-b border-white/40 pb-2 text-xs font-extrabold uppercase tracking-widest">Languages</h3><p className="mt-3 whitespace-pre-line text-xs">{languages}</p></>}</aside>
            <div className="p-7">{summary && <>{heading("Profile")}<p className="whitespace-pre-line text-sm leading-6">{summary}</p></>}{jobs.some(j=>j.role||j.company) && <>{heading("Experience")}{jobs.filter(j=>j.role||j.company).map(j=><div className="mb-4" key={j.id}><div className="flex justify-between gap-2"><b>{j.role}</b><span className="text-xs text-slate-500">{j.dates}</span></div><p className="text-sm">{j.company}</p><p className="mt-1 whitespace-pre-line text-xs leading-5">{j.details}</p></div>)}</>}{education.some(e=>e.degree||e.school) && <>{heading("Education")}{education.filter(e=>e.degree||e.school).map(e=><div className="mb-3" key={e.id}><b className="text-sm">{e.degree}</b><p className="text-sm">{e.school} {e.place && "· "+e.place}</p><p className="text-xs text-slate-500">{e.dates}</p></div>)}</>}{projects && <>{heading("Projects")}<p className="whitespace-pre-line text-sm">{projects}</p></>}{certifications && <>{heading("Certifications")}<p className="whitespace-pre-line text-sm">{certifications}</p></>}{references && <>{heading("References")}<p className="whitespace-pre-line text-sm">{references}</p></>}</div>
          </div> : <div className="p-10">
            <header className="border-b-2 pb-5 text-center" style={{borderColor:accent}}>{photo && <img src={photo} alt="Profile" className="mx-auto mb-3 h-20 w-20 rounded-full object-cover" />}<h1 className="text-3xl font-black tracking-tight" style={{color:accent}}>{name || "Your Name"}</h1><p className="mt-1 text-base font-semibold">{role || "Professional Title"}</p><p className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-600">{[email,phone,location,website].filter(Boolean).map(x=><span key={x}>{x}</span>)}</p></header>
            {summary && <>{heading("Professional Summary")}<p className="whitespace-pre-line text-sm leading-6">{summary}</p></>}
            {jobs.some(j=>j.role||j.company) && <>{heading("Professional Experience")}{jobs.filter(j=>j.role||j.company).map(j=><div className="mb-4" key={j.id}><div className="flex justify-between gap-3"><b className="text-sm">{j.role}</b><span className="text-xs text-slate-500">{j.dates}</span></div><p className="text-sm italic">{j.company}</p><p className="mt-1 whitespace-pre-line text-sm leading-5">{j.details}</p></div>)}</>}
            {education.some(e=>e.degree||e.school) && <>{heading("Education")}{education.filter(e=>e.degree||e.school).map(e=><div className="mb-3" key={e.id}><div className="flex justify-between gap-3"><b className="text-sm">{e.degree}</b><span className="text-xs text-slate-500">{e.dates}</span></div><p className="text-sm">{e.school}{e.place && " · "+e.place}</p></div>)}</>}
            {skillList.length>0 && <>{heading("Core Skills")}<p className="text-sm leading-6">{skillList.join("  •  ")}</p></>}
            {languages && <>{heading("Languages")}<p className="whitespace-pre-line text-sm">{languages}</p></>}
            {projects && <>{heading("Projects")}<p className="whitespace-pre-line text-sm leading-6">{projects}</p></>}
            {certifications && <>{heading("Certifications")}<p className="whitespace-pre-line text-sm leading-6">{certifications}</p></>}
            {references && <>{heading("References")}<p className="whitespace-pre-line text-sm">{references}</p></>}
          </div>}
        </article>
        <p className="no-print mt-3 text-center text-xs text-slate-500">Choose “Save as PDF” in your browser’s print dialog. Use A4 paper and enable background graphics for the selected colour layout.</p>
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
