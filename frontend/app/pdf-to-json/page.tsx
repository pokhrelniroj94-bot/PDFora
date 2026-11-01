import type { Metadata } from "next";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "PDF to JSON Converter Online | PDFora",
  description: "Convert PDF text and page layout into structured JSON with page numbers and text coordinates. Free online PDF to JSON tool.",
  alternates: { canonical: "https://pd-fora.vercel.app/pdf-to-json" },
};

export default function Page() {
  const description = "Extract text blocks, page numbers, page dimensions and text positions from a PDF into structured JSON data.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF to JSON</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/pdf-to-json" title="PDF to JSON" description={description} downloadName="PDFora-Text.json" /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to use PDF to JSON</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload a PDF file (maximum 50 MB).</li><li>PDFora processes the document on the server.</li><li>Download the generated file when processing finishes.</li></ol><p className="mt-4 text-sm text-slate-600">Related PDF tools: <a className="font-semibold text-teal-700 underline" href="/pdf-information">PDF Information</a>, <a className="font-semibold text-teal-700 underline" href="/pdf-to-text">PDF to Text</a> and <a className="font-semibold text-teal-700 underline" href="/compress-pdf">Compress PDF</a>.</p></section></div></main>;
}
