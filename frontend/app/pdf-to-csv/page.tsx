import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("pdf-to-csv");

export default function Page() {
  const description = "Extract detected tables from a PDF into CSV format for spreadsheet workflows. Best for PDFs with selectable, clearly structured tables.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF to CSV</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/pdf-to-csv" title="PDF to CSV" description={description} downloadName="PDFora-Tables.csv" /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to use PDF to CSV</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload a PDF file (maximum 50 MB).</li><li>PDFora processes the document on the server.</li><li>Download the generated file when processing finishes.</li></ol><p className="mt-4 text-sm text-slate-600">Related PDF tools: <a className="font-semibold text-teal-700 underline" href="/pdf-information">PDF Information</a>, <a className="font-semibold text-teal-700 underline" href="/pdf-to-text">PDF to Text</a> and <a className="font-semibold text-teal-700 underline" href="/compress-pdf">Compress PDF</a>.</p></section></div></main>;
}
