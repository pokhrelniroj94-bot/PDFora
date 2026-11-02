import type { Metadata } from "next";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Remove Attachments from PDF Online",
  description: "Remove embedded file attachments from a PDF document online. Download the updated PDF.",
  alternates: { canonical: "https://pd-fora.vercel.app/remove-attachments" },
};

export default function Page() {
  const description = "Remove embedded file attachments from a PDF document while keeping its pages.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Remove PDF Attachments</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/remove-attachments" title="Remove PDF Attachments" description={description} downloadName="PDFora-Attachments-Removed.pdf" /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to use Remove PDF Attachments</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload a PDF file (maximum 50 MB).</li><li>PDFora processes the document or extracts the available content.</li><li>Download the output file or ZIP archive.</li></ol><p className="mt-4 text-sm text-slate-600">Related tools: <a className="font-semibold text-teal-700 underline" href="/pdf-information">PDF Information</a>, <a className="font-semibold text-teal-700 underline" href="/extract-images">Extract Images</a> and <a className="font-semibold text-teal-700 underline" href="/pdf-to-text">PDF to Text</a>.</p></section></div></main>;
}
