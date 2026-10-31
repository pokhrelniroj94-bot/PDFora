import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "PDF to PNG Online | Niroj77",
  description: "Convert each PDF page into a high-resolution PNG image. Download all pages as a ZIP file.",
  alternates: { canonical: "https://pd-fora.vercel.app/pdf-to-png" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF to PNG</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Convert each PDF page into a high-resolution PNG image. Download all pages as a ZIP file.</p><div className="mt-8"><Niroj77Tool endpoint="/api/pdf-to-png" title="PDF to PNG" description="Convert each PDF page into a high-resolution PNG image. Download all pages as a ZIP file." downloadName="Niroj77-PNG.zip"   /></div></div></main>;
}
