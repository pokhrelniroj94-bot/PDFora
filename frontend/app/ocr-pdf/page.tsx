import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCR PDF Online",
  description: "PDF text recognition is not currently available on PDFora.",
  alternates: { canonical: "https://pd-fora.vercel.app/ocr-pdf" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">OCR PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">PDF text recognition is not currently available on PDFora.</p><p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">This tool is temporarily unavailable. Please check back later for updates.</p></div></main>;
}
