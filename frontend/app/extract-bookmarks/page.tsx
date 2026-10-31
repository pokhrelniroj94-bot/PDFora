import type { Metadata } from "next";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Extract PDF Bookmarks Online Free | PDFora",
  description: "Extract PDF bookmarks and table of contents with page numbers into a text report. Free online PDF bookmark extractor.",
  alternates: { canonical: "https://pd-fora.vercel.app/extract-bookmarks" },
};

export default function Page() {
  const description = "Extract the table of contents and bookmarks from a PDF into a downloadable text file, including bookmark titles and page numbers.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Extract PDF Bookmarks</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/extract-bookmarks" title="Extract PDF Bookmarks" description={description} downloadName="PDFora-Bookmarks.txt" /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to extract PDF bookmarks</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload a PDF that contains bookmarks or a table of contents.</li><li>PDFora reads the bookmark titles and destination page numbers.</li><li>Download the bookmark list as a text file.</li></ol><p className="mt-4 text-sm text-slate-600">Related tools: <a className="font-semibold text-teal-700 underline" href="/pdf-information">PDF Information</a>, <a className="font-semibold text-teal-700 underline" href="/page-counter">PDF Page Counter</a> and <a className="font-semibold text-teal-700 underline" href="/merge-pdf">Merge PDF</a>.</p></section></div></main>;
}
