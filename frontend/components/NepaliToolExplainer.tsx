import { nepaliToolExplainers } from "../lib/i18n/nepali-tool-explainers";

export default function NepaliToolExplainer({ slug }: { slug: string }) {
  const data = nepaliToolExplainers[slug];
  if (!data) return null;
  return (
    <article lang="ne" className="mx-auto max-w-4xl space-y-6 px-4 pb-14 sm:px-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">यो टुलले के गर्छ</h2>
        <p className="mt-3 leading-8 text-slate-700">{data.intro}</p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">प्रयोग गर्ने तरिका</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 leading-8 text-slate-700">{data.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">उदाहरण</h2>
        <p className="mt-3 leading-8 text-slate-700">{data.example}</p>
      </section>
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">ध्यान दिनुपर्ने कुरा</h2>
        <p className="mt-3 leading-8 text-slate-700">{data.caution}</p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">बारम्बार सोधिने प्रश्न</h2>
        <div className="mt-4 space-y-4">{data.faqs.map((f) => <div key={f.q}><h3 className="font-bold text-slate-900">{f.q}</h3><p className="mt-1 leading-7 text-slate-700">{f.a}</p></div>)}</div>
      </section>
    </article>
  );
}
