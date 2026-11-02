import type { Metadata } from "next";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "PDF Information Tool Online Free",
  description: "Get PDF file information including page count, size, dimensions, title, author and encryption status. Download a detailed report.",
  alternates: { canonical: "https://pd-fora.vercel.app/pdf-information" },
};

export default function Page() {
  const description = "View PDF details including page count, file size, page dimensions, document metadata and encryption status.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF Information</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/pdf-info" title="PDF Information" description={description} downloadName="PDFora-Information.txt" /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to use this PDF tool</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Choose the PDF file from your device.</li><li>Wait while PDFora processes the document.</li><li>Download the generated report or updated PDF.</li></ol><p className="mt-4 text-sm text-slate-600">Explore related tools: <a className="font-semibold text-teal-700 underline" href="/compress-pdf">Compress PDF</a>, <a className="font-semibold text-teal-700 underline" href="/merge-pdf">Merge PDF</a> and <a className="font-semibold text-teal-700 underline" href="/pdf-to-text">PDF to Text</a>.</p></section></div></main>;
}
