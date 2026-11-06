import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("extract-images");

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Extract Images from PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Extract embedded images from a PDF into a ZIP archive.</p><div className="mt-8"><Niroj77Tool endpoint="/api/extract-images" title="Extract Images from PDF" description="Extract embedded images from a PDF into a ZIP archive." downloadName="PDFora-Extracted-Images.zip"  /></div></div></main>;
}
