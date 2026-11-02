import Link from "next/link";
import { allTools, type Tool } from "../lib/tool-directory";

type CategoryKey = "pdf" | "calculators" | "nepal";

const config: Record<CategoryKey, { title: string; description: string }> = {
  pdf: { title: "PDF Tools", description: "Merge, split, compress, convert, edit, organize and protect PDF documents." },
  calculators: { title: "Calculators", description: "Financial, business, math, health and everyday calculators in one place." },
  nepal: { title: "Nepal Tools", description: "Nepali calendar, BS/AD dates, Panchang, Kundali, NEPSE and Nepal-focused utilities." },
};

function belongsToCategory(tool: Tool, category: CategoryKey) {
  if (category === "pdf") return tool.kind === "pdf" || tool.slug === "notes-to-pdf";
  if (category === "calculators") {
    return tool.category === "Calculators" || /calculator/i.test(tool.slug) || /calculator/i.test(tool.name);
  }
  return (
    /^(nepal-|nepali-|nepse-|neb-|loksewa-|preeti-|gold-tola)/i.test(tool.slug) ||
    ["Nepal Tools", "Panchang & Tithi", "Kundali & Astrology", "NEPSE"].includes(tool.category)
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={tool.href} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg">
      <span className="text-xs font-bold uppercase tracking-wide text-teal-700">{tool.category}</span>
      <h2 className="mt-2 font-bold text-slate-900 group-hover:text-teal-800">{tool.name}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
      <span className="mt-4 inline-flex text-sm font-bold text-teal-700">Open tool →</span>
    </Link>
  );
}

export default function ToolCategoryPage({ category }: { category: CategoryKey }) {
  const tools = allTools.filter((tool) => belongsToCategory(tool, category));
  const { title, description } = config[category];
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav aria-label="Tool categories" className="mb-8 flex flex-wrap gap-2">
        <Link href="/tools" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-400 hover:text-teal-800">All Tools</Link>
        <Link href="/tools/calculators" aria-current={category === "calculators" ? "page" : undefined} className={category === "calculators" ? "rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white" : "rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-400"}>Calculators</Link>
        <Link href="/tools/pdf" aria-current={category === "pdf" ? "page" : undefined} className={category === "pdf" ? "rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white" : "rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-400"}>PDF Tools</Link>
        <Link href="/tools/nepal" aria-current={category === "nepal" ? "page" : undefined} className={category === "nepal" ? "rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white" : "rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-400"}>Nepal Tools</Link>
      </nav>
      <header className="mb-8">
        <p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">PDFora toolbox</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
        <p className="mt-3 text-sm font-semibold text-teal-700">{tools.length} tools in this category</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
      </div>
      <p className="mt-10 text-sm text-slate-600">Looking for something else? <Link href="/tools" className="font-bold text-teal-700 underline underline-offset-4">Browse all PDFora tools</Link>.</p>
    </main>
  );
}
