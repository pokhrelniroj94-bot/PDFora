import type { Metadata } from "next";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "PDF to TIFF Converter Online | PDFora",
  description: "Convert PDF pages to TIFF images online. Download high-quality TIFF page images in one ZIP archive with PDFora.",
  alternates: { canonical: "https://pd-fora.vercel.app/pdf-to-tiff" },
};

export default function Page() {
  const description = "Convert every page of a PDF into a TIFF image. Download all converted page images together in a ZIP archive.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF to TIFF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/pdf-to-tiff" title="PDF to TIFF" description={description} downloadName="PDFora-TIFF-Pages.zip"  /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to use PDF to TIFF</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload your PDF file.</li><li>Enter the requested settings, if any.</li><li>Process the document and download the result.</li></ol><p className="mt-4 text-sm text-slate-600">Related tools: <a className="font-semibold text-teal-700 underline" href="/pdf-information">PDF Information</a>, <a className="font-semibold text-teal-700 underline" href="/extract-bookmarks">Extract Bookmarks</a> and <a className="font-semibold text-teal-700 underline" href="/add-page-numbers">Add Page Numbers</a>.</p></section></div></main>;
}
