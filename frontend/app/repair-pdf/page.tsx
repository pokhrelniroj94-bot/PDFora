import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Repair PDF Online",
  description: "Attempt to rewrite a damaged PDF. Repair is best-effort and cannot recover every corrupted file.",
  alternates: { canonical: "https://pd-fora.vercel.app/repair-pdf" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Repair PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Attempt to rewrite a damaged PDF. Repair is best-effort and cannot recover every corrupted file.</p><div className="mt-8"><Niroj77Tool endpoint="/api/repair" title="Repair PDF" description="Attempt to rewrite a damaged PDF. Repair is best-effort and cannot recover every corrupted file." downloadName="PDFora-repair-pdf.pdf"   /></div></div></main>;
}
