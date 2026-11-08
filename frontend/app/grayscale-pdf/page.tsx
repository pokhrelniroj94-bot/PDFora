import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("grayscale-pdf");

export default function Page() {
  return <section className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Grayscale PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Convert PDF pages to grayscale. Pages are rasterized, so selectable text may not be preserved.</p><div className="mt-8"><Niroj77Tool endpoint="/api/grayscale" title="Grayscale PDF" description="Convert PDF pages to grayscale. Pages are rasterized, so selectable text may not be preserved." downloadName="PDFora-grayscale-pdf.pdf"   /></div></div></section>;
}
