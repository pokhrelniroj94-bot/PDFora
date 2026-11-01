import type { Metadata } from "next";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Extract Fonts from PDF Online | PDFora",
  description: "Extract embedded font files from PDF documents and download available fonts in a ZIP archive.",
  alternates: { canonical: "https://pd-fora.vercel.app/extract-fonts" },
};

export default function Page() {
  const description = "Extract embedded font files from a PDF when the document contains extractable embedded fonts.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Extract Fonts from PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/extract-fonts" title="Extract Fonts from PDF" description={description} downloadName="PDFora-Fonts.zip" /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to use Extract Fonts from PDF</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload a PDF file (maximum 50 MB).</li><li>PDFora processes the document or extracts the available content.</li><li>Download the output file or ZIP archive.</li></ol><p className="mt-4 text-sm text-slate-600">Related tools: <a className="font-semibold text-teal-700 underline" href="/pdf-information">PDF Information</a>, <a className="font-semibold text-teal-700 underline" href="/extract-images">Extract Images</a> and <a className="font-semibold text-teal-700 underline" href="/pdf-to-text">PDF to Text</a>.</p></section></div></main>;
}
