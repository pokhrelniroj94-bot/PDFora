import Link from "next/link";
import { toolCatalog } from "./toolCatalog";
import type { ToolGuide as ToolGuideData } from "../lib/tool-guides";

export default function ToolGuide({ guide }: { guide: ToolGuideData }) {
  return (
    <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-black text-slate-950">
        How to use {guide.name}
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">{guide.purpose}</p>
      <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600">
        {guide.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
      <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <strong>Before downloading:</strong> {guide.caution}
      </p>
      {guide.related.length>0&&<div className="mt-6 border-t border-slate-200 pt-5"><h3 className="text-base font-bold text-slate-900">Related PDF tools</h3><ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-teal-700">{guide.related.map((slug)=>{const tool=toolCatalog.find((item)=>item.slug===slug);return tool?<li key={slug}><Link href={"/"+slug} className="hover:underline">{tool.name} →</Link></li>:null;})}</ul></div>}
    </section>
  );
}
