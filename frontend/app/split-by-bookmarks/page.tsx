import type { Metadata } from "next";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Split PDF by Bookmarks Online | PDFora",
  description: "Split a PDF into separate files using existing bookmarks and download the sections as a ZIP archive.",
  alternates: { canonical: "https://pd-fora.vercel.app/split-by-bookmarks" },
};

export default function Page() {
  const description = "Split a bookmarked PDF into separate PDF files using its existing bookmark destinations. Download the sections in a ZIP archive.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Split PDF by Bookmarks</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/split-by-bookmarks" title="Split PDF by Bookmarks" description={description} downloadName="PDFora-Bookmark-Sections.zip" /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to use Split PDF by Bookmarks</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload a PDF file (maximum 50 MB).</li><li>PDFora processes the document or extracts the available content.</li><li>Download the output file or ZIP archive.</li></ol><p className="mt-4 text-sm text-slate-600">Related tools: <a className="font-semibold text-teal-700 underline" href="/pdf-information">PDF Information</a>, <a className="font-semibold text-teal-700 underline" href="/extract-images">Extract Images</a> and <a className="font-semibold text-teal-700 underline" href="/pdf-to-text">PDF to Text</a>.</p></section></div></main>;
}
