import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("page-counter");

export default function Page() {
  const description = "Count the pages in a PDF and download a simple report with the page count and file size.";
  return <section className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF Page Counter</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/page-counter" title="PDF Page Counter" description={description} downloadName="PDFora-Page-Count.txt" /></div></div></section>;
}
