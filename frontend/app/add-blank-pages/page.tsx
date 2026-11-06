import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("add-blank-pages");

export default function Page() {
  const description = "Add one or more blank pages to the end of your PDF. The new pages use the dimensions of the last page in your document.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Add Blank Pages to PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/add-blank-pages" title="Add Blank Pages" description={description} downloadName="PDFora-Blank-Pages-Added.pdf" extraFields={[{name:"count",label:"Number of blank pages to add",placeholder:"1",defaultValue:"1"}]} /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to add blank PDF pages</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload a PDF file.</li><li>Enter a number from 1 to 50.</li><li>Select Add Blank Pages and download the updated PDF.</li></ol><p className="mt-4 text-sm text-slate-600">You may also need <a className="font-semibold text-teal-700 underline" href="/merge-pdf">Merge PDF</a>, <a className="font-semibold text-teal-700 underline" href="/reorder-pdf">Reorder PDF</a> or <a className="font-semibold text-teal-700 underline" href="/delete-pages">Delete PDF Pages</a>.</p></section></div></main>;
}
