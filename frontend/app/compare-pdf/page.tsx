import type { Metadata } from "next";
import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = { title: "Compare PDF Files Online", description: "Compare the selectable text in two PDF documents and download a difference report with Niroj77.", keywords: ["compare PDF files", "PDF comparison online", "compare two PDF documents"], alternates: { canonical: "/compare-pdf" } };


export const metadata: Metadata = {
  title: "Compare PDF Online | Niroj77",
  description: "Compare selectable text from two PDF files and download a difference report.",
  alternates: { canonical: "https://pd-fora.vercel.app/compare-pdf" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Compare PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Compare selectable text from two PDF files and download a difference report.</p><div className="mt-8"><Niroj77Tool endpoint="/api/compare" title="Compare PDF" description="Compare selectable text from two PDF files and download a difference report." downloadName="Niroj77-PDF-Comparison.txt" multiple={true} fieldName="files" accept="application/pdf,.pdf" /></div></div></main>;
}
