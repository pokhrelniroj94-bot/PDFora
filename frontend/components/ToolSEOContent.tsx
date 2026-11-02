"use client";

import Link from "next/link";
import AdsterraNative from "../app/components/AdsterraNative";
import { getToolGuide } from "../lib/tool-guides";
export default function ToolSEOContent({ slug }: { slug: string }) {
  const guide = getToolGuide(slug);
  if (!guide) return null;
  const outputLabels: Record<string, string> = {
    "pdf-to-word": "editable Word document (.docx)",
    "pdf-to-excel": "Excel workbook (.xlsx)",
    "pdf-to-jpg": "ZIP file containing JPG images",
    "pdf-to-png": "ZIP file containing PNG images",
    "pdf-to-webp": "ZIP file containing WebP images",
    "pdf-to-tiff": "ZIP file containing TIFF images",
    "pdf-to-bmp": "ZIP file containing BMP images",
    "images-to-pdf": "PDF document",
    "pdf-to-text": "plain-text file (.txt)",
    "pdf-to-html": "HTML file",
    "pdf-to-markdown": "Markdown file (.md)",
    "pdf-to-json": "JSON file",
    "pdf-to-csv": "CSV file",
    "extract-images": "ZIP file containing extracted images",
    "extract-page-images": "ZIP file containing page images",
    "extract-fonts": "ZIP file containing supported font files",
    "extract-bookmarks": "bookmark export file",
    "page-counter": "page-count report",
    "pdf-information": "PDF information report",
    "compare-pdf": "PDF comparison report",
  };
  const outputLabel = outputLabels[slug] ?? "updated PDF";
  const faqs = [
    { q: `What does ${guide.name} do?`, a: guide.purpose },
    { q: `How do I use ${guide.name} online?`, a: guide.steps.join(" ") },
    { q: `What should I check after using ${guide.name}?`, a: guide.caution },
    { q: "Which PDF tasks may I need next?", a: `Depending on your document workflow, related tasks include ${guide.related.map((item) => item.replace(/-/g, " ")).join(", ")}. Keep the original PDF and inspect each processed file before sharing it.` },
    { q: "Can I use this PDF tool on a phone?", a: "The tool is available in modern mobile browsers. File selection and download behaviour can vary by device, browser and available storage." },
    { q: "Should I keep a copy of the original PDF?", a: "Yes. Keep an untouched copy until you have opened and checked the final file and confirmed that it contains the pages and information you need." }
  ];
  const pageUrl = `https://pd-fora.vercel.app/${slug}`;
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  const howToSchema = { "@context": "https://schema.org", "@type": "HowTo", name: `How to use ${guide.name}`, description: guide.purpose, step: guide.steps.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: `Step ${index + 1}`, text: step })) };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://pd-fora.vercel.app/" }, { "@type": "ListItem", position: 2, name: "PDF Tools", item: "https://pd-fora.vercel.app/tools" }, { "@type": "ListItem", position: 3, name: guide.name, item: pageUrl }] };
  const softwareSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: guide.name, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", description: guide.purpose, url: pageUrl, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };
  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6"><div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">PDFora practical guide</p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">What does {guide.name} do?</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{guide.purpose}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">People search for phrases such as “{guide.keyword}” when they need to prepare a document for study, work, record keeping or an online submission. This guide explains the purpose of the operation, how to prepare a source file, what to check after processing and which limitations may affect the result. The exact controls are the ones displayed in the tool workspace above.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">Before you begin, open the original PDF and check that it contains the correct pages. If the document is important, save an untouched backup. Check whether the receiving website has a maximum file size, page count, page dimension or other PDF requirement. Preparing the right source file is often more useful than repeating the operation after a preventable input mistake.</p>
      </section>
      <AdsterraNative />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">How to use {guide.name} step by step</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-8 text-slate-700">
          <li>Open the {guide.name} workspace on this page and choose the PDF you want to process.</li>
          {guide.steps.map((step) => <li key={step}>{step}</li>)}
          <li>Wait until processing has finished, download the {outputLabel} and open it in the appropriate application to check the result.</li>
          <li>Compare the affected pages with your original document before sharing, printing or submitting the output.</li>
        </ol>
        <p className="mt-4 text-sm leading-8 text-slate-700">Use the controls that are actually available in the workspace. Different PDF operations have different settings, so do not assume that a page-selection option, compression level or editing control exists unless it is shown on this tool page.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">When is this PDF operation useful?</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{guide.purpose} It may be useful when organising an assignment, preparing a report, arranging business records or meeting a document upload requirement. The best workflow depends on the source file and the reason you need to change it.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">For example, a student may need a document in a particular order before uploading it to a college portal. An office worker may need to prepare a report for colleagues. A person keeping personal records may want a cleaner document that is easier to review. In every case, follow the recipient&apos;s instructions first; a technically valid PDF may still be rejected if it does not meet the required format.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">If you are handling a large bundle, work on a copy and process a small sample first. This makes it easier to identify an unexpected change before it affects the whole document.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">PDF quality, compatibility and limitations</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">{guide.caution}</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">PDF is a container format. A file may include selectable text, scanned page images, embedded fonts, bookmarks, form fields, annotations, hyperlinks and digital signatures. A particular operation may not preserve every feature in every document. Scanned pages can behave differently from text-based pages, and password protection or file damage can prevent processing.</p>
        <p className="mt-4 text-sm leading-8 text-slate-700">If the output is intended for printing, inspect page dimensions, margins and image clarity. If it is intended for reading on screen, check that text is legible and links or bookmarks work where relevant. If it contains a digital signature, confirm whether the operation changes the signed content or invalidates the signature before using the result.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">Tips for a reliable result</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-8 text-slate-700">
          <li>Keep an untouched copy of the original PDF until the final file has been checked.</li><li>Use a clear filename so you can distinguish the source document from the processed version.</li><li>Check the file size and page count before and after processing if those details matter.</li><li>Open the downloaded file in another PDF reader rather than relying only on a success message.</li><li>Review pages with tables, small text, images, stamps, signatures and handwritten notes carefully.</li><li>For an official upload, follow the receiving organisation&apos;s current requirements.</li>
        </ul>
        <p className="mt-4 text-sm leading-8 text-slate-700">If you do not get the expected result, stop before overwriting the original. Recheck the selected file and settings, then try again with a fresh copy where appropriate. Avoid running repeated operations on the only copy of an important document.</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">Privacy and safe document handling</h2>
        <p className="mt-4 text-sm leading-8 text-slate-700">Upload only files you are authorised to process. Files required by PDF tools are sent to PDFora’s backend for temporary processing; review the <Link href="/privacy" className="font-semibold text-violet-700 underline">Privacy Policy</Link> before uploading sensitive documents.</p>
      </section>
      
      
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-black text-slate-950">Frequently asked questions</h2>
        <div className="mt-5 space-y-5">{faqs.map((item) => <div key={item.q}><h3 className="font-bold text-slate-950">{item.q}</h3><p className="mt-2 text-sm leading-8 text-slate-600">{item.a}</p></div>)}</div>
      </section>
      <section className="rounded-3xl border border-violet-100 bg-violet-50 p-6 sm:p-8">
        <h2 className="text-xl font-black text-slate-950">Related PDF tools and guides</h2>
        <p className="mt-3 text-sm leading-8 text-slate-700">Some PDF tasks are easier when completed in a sensible order. You may want to organise or prepare a document first, complete the main operation, and then inspect the final result. Use only the steps required for your document rather than applying every available operation.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/blog/${guide.blogSlug}`} className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white hover:bg-violet-800">Read the complete {guide.name} guide</Link>
          {guide.related.map((slug) => { const related = getToolGuide(slug); return related ? <Link key={slug} href={`/${slug}`} className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-bold text-violet-800 hover:bg-violet-100">{related.name}</Link> : null; })}
        </div>
      </section>
    </div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /></article>
  );
}
