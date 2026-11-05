import type { ReactNode } from "react";

type ToolEntry = { title: string; description: string; example: string; accuracy: string; workflow: string; mistakes: string };
type GuideEntry = { purpose: string; steps: string[]; caution: string };
type CalculatorEntry = { formula: string; inputs: string[]; outputs: string[]; assumptions: string };
type FAQEntry = { q: string; a: string };

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
    <h2 className="text-xl font-bold text-slate-950">{title}</h2>
    <div className="mt-3 space-y-3 leading-7 text-slate-700">{children}</div>
  </section>;
}

/** Renders only explicitly localized content; no English SEO fallback is used. */
export default function LocalizedToolContent({
  tool, guide, calculator, faqs, labels
}: {
  tool: ToolEntry;
  guide?: GuideEntry;
  calculator?: CalculatorEntry;
  faqs: FAQEntry[];
  labels: { overview: string; example: string; workflow: string; accuracy: string; mistakes: string; steps: string; caution: string; formula: string; inputs: string; outputs: string; assumptions: string; faqs: string };
}) {
  return <article className="mx-auto w-full max-w-4xl space-y-5 px-4 pb-14 sm:px-6">
    <header className="py-5">
      <h1 className="text-3xl font-black leading-tight text-slate-950">{tool.title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-8 text-slate-700">{tool.description}</p>
    </header>
    <Section title={labels.example}><p>{tool.example}</p></Section>
    <Section title={labels.workflow}><p>{tool.workflow}</p></Section>
    <Section title={labels.accuracy}><p>{tool.accuracy}</p></Section>
    <Section title={labels.mistakes}><p>{tool.mistakes}</p></Section>
    {guide && <Section title={labels.overview}>
      <p>{guide.purpose}</p>
      <h3 className="font-semibold text-slate-900">{labels.steps}</h3>
      <ol className="list-decimal space-y-2 ps-6">{guide.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
      <h3 className="font-semibold text-slate-900">{labels.caution}</h3>
      <p>{guide.caution}</p>
    </Section>}
    {calculator && <Section title={labels.formula}>
      <p>{calculator.formula}</p>
      <h3 className="font-semibold text-slate-900">{labels.inputs}</h3>
      <ul className="list-disc ps-6">{calculator.inputs.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3 className="font-semibold text-slate-900">{labels.outputs}</h3>
      <ul className="list-disc ps-6">{calculator.outputs.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3 className="font-semibold text-slate-900">{labels.assumptions}</h3>
      <p>{calculator.assumptions}</p>
    </Section>}
    <Section title={labels.faqs}>
      {faqs.map((item, index) => <div key={index} className="border-b border-slate-100 pb-3 last:border-0">
        <h3 className="font-semibold text-slate-950">{item.q}</h3><p className="mt-1">{item.a}</p>
      </div>)}
    </Section>
  </article>;
}
