import Link from "next/link";
import { getToolGuide } from "../../lib/tool-guides";

export default function ToolSEOContent({ slug }: { slug: string }) {
  const guide = getToolGuide(slug);
  if (!guide) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do I ${guide.name.toLowerCase()} online?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Open PDFora's ${guide.name} tool, select the source PDF, use the available controls, process the file and review the downloaded result.`,
        },
      },
      {
        "@type": "Question",
        name: "Can I use this PDF tool on my phone?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PDFora is available in modern mobile browsers. The exact file-selection experience depends on your device and browser.",
        },
      },
      {
        "@type": "Question",
        name: "What should I check after processing a PDF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Open the downloaded file and review page order, text, images, page dimensions and important signatures or references. Keep the original PDF until the output is verified.",
        },
      },
    ],
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-12 sm:px-6">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">PDFora how-to guide</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">How to {guide.name.toLowerCase()} online with PDFora</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{guide.purpose}</p>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-700">
            {guide.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Tips for a better PDF result</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{guide.caution}</p>
          <p className="mt-4 text-sm leading-7 text-slate-600">Before sharing or submitting the processed file, open it in a PDF reader and compare the pages that matter with your original. Keep a backup until you have confirmed that the result is complete and readable.</p>
          <h3 className="mt-5 font-black text-slate-950">When is this tool useful?</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{guide.purpose} It can help prepare documents for study, office work, record keeping and online submissions, depending on the requirements of the receiving service.</p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-black text-slate-950">Frequently asked questions</h2>
          <div className="mt-5 space-y-5">
            <div>
              <h3 className="font-bold text-slate-950">How do I {guide.name.toLowerCase()} online?</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Open PDFora&apos;s {guide.name} tool, select the source PDF, use the available controls, process the file and review the downloaded result.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-950">Can I use PDFora {guide.name} on my phone?</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">PDFora is available in modern mobile browsers. The exact file-selection experience depends on your device and browser.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-950">Will the processed PDF look exactly like the original?</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">That depends on the operation and source document. Always inspect the output, especially pages with complex layouts, images, tables or signatures.</p>
            </div>
            <div>
              <h3 className="font-bold text-slate-950">What should I do if the result is not correct?</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Keep the original file, confirm it is a valid PDF, review the selected settings and try again. Some protected, damaged or unusual PDFs may not be fully supported.</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-violet-100 bg-violet-50 p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-950">More PDF guides and related tools</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">Read the detailed tutorial for this task or continue with a related PDF workflow.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={`/blog/${guide.blogSlug}`} className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white hover:bg-violet-800">Read the complete guide</Link>
            {guide.related.map((slug) => {
              const related = getToolGuide(slug);
              return related ? <Link key={slug} href={`/${slug}`} className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-bold text-violet-800 hover:bg-violet-100">{related.name}</Link> : null;
            })}
          </div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}
