"use client";

import { useEffect, useMemo, useState } from "react";

const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100";
const label = "mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500";
export default function CoverLetterMakerTool() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState("");
  const [company,setCompany]=useState(""); const [role,setRole]=useState(""); const [manager,setManager]=useState("Hiring Manager");
  const [skills,setSkills]=useState(""); const [experience,setExperience]=useState(""); const [motivation,setMotivation]=useState("");
  const [tone,setTone]=useState("professional"); const [copied,setCopied]=useState(false);
  const letter=useMemo(()=> {
    const greeting=manager.trim()||"Hiring Manager";
    const intro="I am writing to apply for the "+(role.trim()||"position")+" at "+(company.trim()||"your organization")+".";
    const profile=experience.trim()||"I am motivated to contribute, learn quickly and take responsibility for delivering quality work.";
    const strengths=skills.trim()? " My relevant skills include "+skills.trim()+".":"";
    const why=motivation.trim()||"I am interested in this opportunity because it aligns with my strengths and professional goals.";
    const close=tone==="warm"?"I would appreciate the opportunity to discuss how I could contribute to your team. Thank you for your time and consideration.":"I welcome the opportunity to discuss how my background and abilities can support your team. Thank you for considering my application.";
    return [name.trim()||"Your Name", [email,phone].filter(Boolean).join(" | "), "", new Date().toLocaleDateString(), "", "Dear "+greeting+",", "", intro+" "+profile+strengths, "", why, "", close, "", "Sincerely,", name.trim()||"Your Name"].join("\n");
  },[name,email,phone,company,role,manager,skills,experience,motivation,tone]);
  const [draft,setDraft]=useState(letter); useEffect(()=>setDraft(letter),[letter]);
  async function copy(){try{await navigator.clipboard.writeText(draft);setCopied(true);window.setTimeout(()=>setCopied(false),1800);}catch{setCopied(false);}}
  function download(){const url=URL.createObjectURL(new Blob([draft],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="cover-letter.txt";a.click();URL.revokeObjectURL(url);}
  return <div className="space-y-5">
    <div><h2 className="text-xl font-black text-slate-950">Cover Letter Generator</h2><p className="mt-1 text-sm text-slate-600">Fill in your details to create an editable, job-specific cover letter. Review every claim before sending.</p></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label><span className={label}>Your full name</span><input className={input} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>
      <label><span className={label}>Email</span><input className={input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
      <label><span className={label}>Phone</span><input className={input} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+977 ..."/></label>
      <label><span className={label}>Company / organization</span><input className={input} value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company name"/></label>
      <label><span className={label}>Job title</span><input className={input} value={role} onChange={e=>setRole(e.target.value)} placeholder="e.g. Finance Assistant"/></label>
      <label><span className={label}>Recipient</span><input className={input} value={manager} onChange={e=>setManager(e.target.value)} placeholder="Hiring Manager"/></label>
      <label className="sm:col-span-2"><span className={label}>Relevant skills</span><input className={input} value={skills} onChange={e=>setSkills(e.target.value)} placeholder="Excel, communication, data analysis..."/></label>
      <label className="sm:col-span-2"><span className={label}>Experience / education / achievements</span><textarea className={input} rows={3} value={experience} onChange={e=>setExperience(e.target.value)} placeholder="Describe your relevant experience or education. Use specific, truthful examples."/></label>
      <label className="sm:col-span-2"><span className={label}>Why do you want this job?</span><textarea className={input} rows={3} value={motivation} onChange={e=>setMotivation(e.target.value)} placeholder="Explain why this role and organization interest you."/></label>
      <label><span className={label}>Tone</span><select className={input} value={tone} onChange={e=>setTone(e.target.value)}><option value="professional">Professional</option><option value="warm">Warm and confident</option></select></label>
    </div>
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-slate-900">Live cover letter preview</h3><div className="flex gap-2"><button type="button" onClick={()=>void copy()} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold">{copied?"Copied ✓":"Copy letter"}</button><button type="button" onClick={download} className="min-h-10 rounded-lg bg-teal-700 px-3 text-sm font-bold text-white">Download .txt</button></div></div><textarea aria-label="Edit generated cover letter" className={input+" min-h-[420px] whitespace-pre-wrap font-serif leading-7"} value={letter} onChange={e=>{const lines=e.target.value.split("\n");if(lines.length>0)setMotivation(lines.slice(9,10).join(""));}} readOnly /></section>
    <p className="text-xs leading-5 text-slate-500">This is a drafting assistant, not an AI fact checker. Add measurable achievements, tailor the letter to the vacancy and remove any statement that is not true.</p>
  </div>;
}
