"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { allTools } from "../lib/tool-directory";

const aliases: Record<string, string> = {
  "merge-pdf": "join combine multiple pdf files jodnu milaunu ekai file",
  "split-pdf": "divide separate pages tukra chhuttaunu",
  "compress-pdf": "reduce shrink smaller size mb file ghataunu",
  "pdf-to-word": "doc docx edit text word ma convert",
  "pdf-to-excel": "xlsx spreadsheet table excel ma convert",
  "images-to-pdf": "photo picture jpg png scan image pdf banaunu",
  "pdf-to-jpg": "pdf pages photo image jpg jpeg",
  "rotate-pdf": "turn ghumau direction page sidha",
  "delete-pages": "remove erase hataunu page",
  "extract-pages": "save selected pages nikalnu",
  "protect-pdf": "password lock secure encrypt surakshit",
  "unlock-pdf": "remove password open unlock",
  "sign-pdf": "signature हस्ताक्षर sign document",
  "watermark": "stamp logo text chhap",
  "nepal-salary-tax-calculator": "income tax salary talab kar calculator nepal 2083",
  "loan-emi-calculator": "loan home car bike monthly installment kista emi",
  "nepal-share-calculator": "nepse share stock buy sell broker commission profit loss",
  "nepse-dividend-calculator": "bonus cash dividend share",
  "nepal-forex-rates": "currency exchange dollar usd npr rate nrB",
  "nepali-date-converter": "bs ad bikram sambat english date miti convert",
  "nepali-calendar": "patro tithi calendar date festival",
  "nepali-unicode-typing": "nepali type roman english keyboard unicode देवनागरी",
  "preeti-unicode-converter": "preeti font unicode nepali convert",
  "loksewa-photo-resizer": "loksewa photo size passport image resize",
  "image-compressor": "photo image compress reduce size kb mb",
  "image-format-converter": "jpg png webp convert photo",
  "notes-to-pdf": "write notes text notebook pdf banaunu",
  "qr-code-generator": "qr scan code create link",
  "password-generator": "secure random password",
  "word-counter": "count words characters text",
  "json-formatter": "format validate json developer code",
};

const taskShortcuts = [
  { label: "Work with PDFs", icon: "📄", query: "pdf" },
  { label: "Convert files", icon: "🔄", query: "convert" },
  { label: "Images & photos", icon: "🖼️", query: "image" },
  { label: "Nepal utilities", icon: "🇳🇵", query: "nepal" },
  { label: "Money & finance", icon: "💰", query: "finance" },
  { label: "Text & writing", icon: "✍️", query: "text" },
];

const popularSlugs = [
  "merge-pdf", "compress-pdf", "pdf-to-word", "images-to-pdf",
  "loan-emi-calculator", "nepali-date-converter", "nepal-share-calculator",
  "nepali-unicode-typing",
];

const categoryIcons: Record<string, string> = {
  Organize: "🗂️", Convert: "🔄", Edit: "✏️", Security: "🔐",
  Extract: "📤", Analyze: "🔎", Optimize: "⚡", Nepal: "🇳🇵",
  Finance: "💰", Text: "✍️", Developer: "⌨️", Image: "🖼️",
  SEO: "🎯", Math: "➗", Business: "📊", PDF: "📄",
};

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function SmartToolCenter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"recommended" | "az">("recommended");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    allTools.forEach((tool) => counts.set(tool.category, (counts.get(tool.category) ?? 0) + 1));
    const pdfCount = allTools.filter((tool) => tool.kind === "pdf").length;
    return [
      { name: "All", count: allTools.length },
      { name: "PDF", count: pdfCount },
      ...Array.from(counts, ([name, count]) => ({ name, count }))
        .filter((item) => item.name !== "PDF")
        .sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }, []);

  const filtered = useMemo(() => {
    const tokens = normalize(query).split(" ").filter(Boolean);
    const result = allTools.filter((tool) => {
      const categoryMatch = category === "All" || tool.category === category || (category === "PDF" && tool.kind === "pdf");
      const haystack = normalize([tool.name, tool.description, tool.category, tool.keywords, tool.slug.replaceAll("-", " "), aliases[tool.slug] ?? ""].join(" "));
      return categoryMatch && tokens.every((token) => haystack.includes(token));
    });
    if (sort === "az") result.sort((a, b) => a.name.localeCompare(b.name));
    else result.sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)) || a.name.localeCompare(b.name));
    return result;
  }, [query, category, sort]);

  const popular = popularSlugs
    .map((slug) => allTools.find((tool) => tool.slug === slug))
    .filter((tool) => tool && (
      category === "All" ||
      (category === "PDF" ? tool.kind === "pdf" : tool.category === category)
    ));

  function chooseTask(task: string) {
    setQuery(task);
    setCategory("All");
    document.getElementById("tool-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-lg" aria-label="PDFora home">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 text-base font-black text-white shadow-sm">P</span>
            <span className="truncate text-lg font-black tracking-tight text-slate-950">PDFora</span>
          </Link>
          <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link href="/ne" lang="ne" className="inline-flex min-h-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-[11px] font-extrabold text-blue-800 transition hover:border-blue-400 hover:bg-blue-100 sm:px-3 sm:text-xs">नेपाली</Link>
            <Link href="/market" className="inline-flex min-h-9 items-center justify-center rounded-lg border border-teal-200 bg-teal-50 px-2.5 text-[11px] font-bold text-teal-800 transition hover:border-teal-400 hover:bg-teal-100 sm:px-3 sm:text-xs"><span aria-hidden="true">📈</span><span className="ml-1 hidden sm:inline">Market</span></Link>
            <Link href="/tools" aria-current="page" className="inline-flex min-h-9 items-center justify-center rounded-lg bg-slate-950 px-3 text-[11px] font-bold text-white shadow-sm transition hover:bg-slate-800 sm:px-4 sm:text-xs">Tools</Link>
          </nav>
        </div>
      </header>
      <section className="pdfora-enter relative overflow-hidden bg-[#082321] px-4 py-12 text-white sm:px-6 sm:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[.2em] text-teal-200">PDFora · Smart Tool Center</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">What would you like to do?</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Search by tool name or simply describe your task. Find PDF, image, finance, Nepal and everyday utility tools in one place.</p>
          <form className="mt-7 flex max-w-3xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20 sm:flex-row" onSubmit={(event) => { event.preventDefault(); document.getElementById("tool-results")?.scrollIntoView({ behavior: "smooth" }); }}>
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <span className="text-xl text-slate-400" aria-hidden="true">⌕</span>
              <input type="search" autoComplete="off" aria-controls="tool-results" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “compress PDF”, “photo size”, “salary tax”..." aria-label="Search all tools" className="h-12 w-full min-w-0 border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0" />
              {query && <button type="button" onClick={() => setQuery("")} className="rounded-lg px-2 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100" aria-label="Clear search">Clear</button>}
            </label>
            <button className="rounded-xl bg-teal-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-teal-800" type="submit">Find a tool</button>
          </form>
          <p className="mt-3 text-xs text-slate-400">Search across {allTools.length} tools · No account needed for browsing</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <section aria-labelledby="task-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div><p className="text-xs font-black uppercase tracking-widest text-teal-700">Start with a task</p><h2 id="task-heading" className="mt-1 text-xl font-black">What do you need help with?</h2></div>
            <span className="text-xs text-slate-500">Tap a shortcut to explore</span>
          </div>
          <div className="pdfora-stagger grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {taskShortcuts.map((task) => <button type="button" key={task.label} onClick={() => chooseTask(task.query)} className="group flex min-h-24 flex-col items-start justify-center rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md"><span className="text-2xl" aria-hidden="true">{task.icon}</span><span className="mt-2 text-sm font-bold text-slate-800 group-hover:text-teal-800">{task.label}</span></button>)}
          </div>
        </section>

        {!query && category === "All" && <section className="mt-10" aria-labelledby="popular-heading">
          <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-widest text-orange-600">Quick access</p><h2 id="popular-heading" className="mt-1 text-xl font-black">Popular tools</h2></div><span className="text-xs text-slate-500">Frequently used starting points</span></div>
          <div className="pdfora-stagger grid grid-cols-2 gap-3 sm:grid-cols-4">
            {popular.map((tool) => tool && <Link key={tool.href} href={tool.href} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-400 hover:shadow-md"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl" aria-hidden="true">{tool.icon || categoryIcons[tool.category] || "🛠️"}</span><span className="min-w-0"><span className="block text-sm font-bold text-slate-900 group-hover:text-teal-800">{tool.name}</span><span className="mt-1 block text-xs text-slate-500">{tool.category}</span></span><span className="ml-auto text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-700" aria-hidden="true">→</span></Link>)}
          </div>
        </section>}

        <section id="tool-results" className="mt-10 scroll-mt-6" aria-labelledby="results-heading">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="text-xs font-black uppercase tracking-widest text-teal-700">Complete directory</p><h2 id="results-heading" className="mt-1 text-2xl font-black">Find your tool</h2><p className="mt-1 text-sm text-slate-600" aria-live="polite">Showing <strong>{filtered.length}</strong> of {allTools.length} tools{query ? <> for “{query}”</> : null}{category !== "All" ? <> in {category}</> : null}.</p></div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">Sort <select value={sort} onChange={(event) => setSort(event.target.value as "recommended" | "az")} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"><option value="recommended">Recommended</option><option value="az">A to Z</option></select></label>
          </div>

          <div role="group" className="mt-5 flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Filter tools by category">
            {categories.map((item) => <button type="button" key={item.name} onClick={() => setCategory(item.name)} aria-pressed={category === item.name} className={"shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition " + (category === item.name ? "bg-teal-800 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:text-teal-800")}>{item.name}<span className={"ml-2 text-xs " + (category === item.name ? "text-teal-100" : "text-slate-400")}>{item.count}</span></button>)}
          </div>

          {filtered.length ? <div className="pdfora-stagger mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((tool) => <Link key={tool.href} href={tool.href} className="tool-directory-card group flex min-h-44 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-400">
              <div className="flex items-center justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl" aria-hidden="true">{tool.icon || categoryIcons[tool.category] || "🛠️"}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{tool.category}</span></div>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900 group-hover:text-teal-800">{tool.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{tool.description}</p>
              <span className="mt-auto pt-4 text-xs font-bold text-teal-700">Open tool <span aria-hidden="true">→</span></span>
            </Link>)}
          </div> : <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><span className="text-4xl" aria-hidden="true">🔎</span><h3 className="mt-3 text-lg font-black">No matching tools yet</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Try a shorter phrase, a different keyword, or choose another category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="mt-5 rounded-xl bg-teal-800 px-5 py-3 text-sm font-bold text-white hover:bg-teal-900">Show all {allTools.length} tools</button></div>}
        </section>

        <p className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 text-center text-xs leading-5 text-slate-500">Tip: Search using a task such as “make PDF smaller”, “convert image”, “calculate EMI” or “Nepali date”. You can also browse by category above.</p>
      </div>
    </main>
  );
}
