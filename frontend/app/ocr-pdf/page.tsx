import type { Metadata } from "next";
import OcrTool from "../../components/OcrTool";

export const metadata: Metadata = {
  title: "OCR PDF Online",
  description: "Recognize Nepali, English and Hindi text in scanned PDFs and images. Download searchable PDFs or extracted text.",
  alternates: { canonical: "https://pd-fora.vercel.app/ocr-pdf" },
  openGraph: { type: "website", url: "https://pd-fora.vercel.app/ocr-pdf", siteName: "PDFora", title: "OCR PDF Online – Nepali, English and Hindi Text Recognition | PDFora", description: "Recognize Nepali, English and Hindi text in scanned PDFs and images. Download searchable PDFs or extracted text.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora OCR PDF text recognition" }] },
  twitter: { card: "summary_large_image", title: "OCR PDF Online – Nepali, English and Hindi Text Recognition | PDFora", description: "Recognize Nepali, English and Hindi text in scanned PDFs and images. Download searchable PDFs or extracted text.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-5xl"><h1 className="text-center text-3xl font-black sm:text-5xl">OCR PDF & Image to Text</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Recognize Nepali, English and Hindi text in scanned PDFs and images. Download searchable PDFs or extracted text.</p><div className="mt-8"><OcrTool /></div></div></main>;
}
