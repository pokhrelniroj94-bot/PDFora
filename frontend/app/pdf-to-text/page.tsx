import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "PDF to Text Online",
  description: "Extract selectable text from each PDF page into a downloadable TXT file. Scanned pages require OCR.",
  alternates: { canonical: "https://pd-fora.vercel.app/pdf-to-text" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF to Text</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Extract selectable text from each PDF page into a downloadable TXT file. Scanned pages require OCR.</p><div className="mt-8"><Niroj77Tool endpoint="/api/pdf-to-text" title="PDF to Text" description="Extract selectable text from each PDF page into a downloadable TXT file. Scanned pages require OCR." downloadName="PDFora-Extracted-Text.txt"   /></div></div></main>;
}
