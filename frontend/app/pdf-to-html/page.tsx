import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("pdf-to-html");

export default function Page() {
  return <section className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF to HTML</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Extract selectable PDF text into a simple HTML document. Scanned pages require OCR.</p><div className="mt-8"><Niroj77Tool endpoint="/api/pdf-to-html" title="PDF to HTML" description="Extract selectable PDF text into a simple HTML document. Scanned pages require OCR." downloadName="PDFora-PDF-to-HTML.html"  /></div></div></section>;
}
