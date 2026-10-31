import type { Metadata } from "next";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Add Bookmarks to PDF Online | PDFora",
  description: "Add clickable bookmarks to PDF documents by entering page numbers and titles. Create a navigable PDF table of contents online.",
  alternates: { canonical: "https://pd-fora.vercel.app/add-bookmarks" },
};

export default function Page() {
  const description = "Add a clickable table of contents to a PDF. Enter one page number and bookmark title per line in page:title format.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Add Bookmarks to PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/add-bookmarks" title="Add Bookmarks to PDF" description={description} downloadName="PDFora-Bookmarks-Added.pdf" extraFields={[{name:"bookmarks",label:"Bookmarks (one per line: page:title)",placeholder:"1:Introduction\n5:Chapter One\n12:Conclusion",defaultValue:"1:Introduction",multiline:true}]} /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to use Add Bookmarks to PDF</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload your PDF file.</li><li>Enter the requested settings, if any.</li><li>Process the document and download the result.</li></ol><p className="mt-4 text-sm text-slate-600">Related tools: <a className="font-semibold text-teal-700 underline" href="/pdf-information">PDF Information</a>, <a className="font-semibold text-teal-700 underline" href="/extract-bookmarks">Extract Bookmarks</a> and <a className="font-semibold text-teal-700 underline" href="/add-page-numbers">Add Page Numbers</a>.</p></section></div></main>;
}
