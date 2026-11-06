import type { Metadata } from "next";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Render PDF Pages to PNG | PDFora",
  description: "Render every PDF page as a high-quality PNG image and download all pages in one ZIP archive.",
  alternates: { canonical: "https://pd-fora.vercel.app/extract-page-images" },
};

export default function Page() {
  const description = "Render every PDF page as a PNG image and download all pages together in a ZIP archive.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Render PDF Pages to PNG</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/extract-page-images" title="Render PDF Pages to PNG" description={description} downloadName="PDFora-Page-Images.zip" /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to render PDF pages as images</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload a PDF file (maximum 50 MB).</li><li>PDFora renders each page into a separate PNG image.</li><li>Download the output file or ZIP archive.</li></ol><p className="mt-4 text-sm text-slate-600">Related tools: <a className="font-semibold text-teal-700 underline" href="/pdf-information">PDF Information</a>, <a className="font-semibold text-teal-700 underline" href="/extract-images">Extract Images</a> and <a className="font-semibold text-teal-700 underline" href="/pdf-to-text">PDF to Text</a>.</p></section></div></main>;
}
