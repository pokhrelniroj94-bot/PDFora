import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("pdf-to-csv");

export default function Page() {
  const description = "Extract detected tables from a PDF into CSV format for spreadsheet workflows. Best for PDFs with selectable, clearly structured tables.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF to CSV</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/pdf-to-csv" title="PDF to CSV" description={description} downloadName="PDFora-Tables.csv" /></div></div></main>;
}
