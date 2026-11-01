import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCR PDF Online | PDFora",
  description: "OCR is currently unavailable until the server has Tesseract and language data installed.",
  alternates: { canonical: "https://pd-fora.vercel.app/ocr-pdf" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">OCR PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">OCR is currently unavailable until the server has Tesseract and language data installed.</p><p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">OCR is not enabled on the current backend yet. This page will become functional after the OCR engine and language packs are installed on the server.</p></div></main>;
}
