import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Remove Blank PDF Pages Online",
  description: "Detect and remove pages that contain no selectable text, images or vector drawings.",
  alternates: { canonical: "https://pd-fora.vercel.app/remove-blank-pages" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Remove Blank PDF Pages</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Detect and remove pages that contain no selectable text, images or vector drawings.</p><div className="mt-8"><Niroj77Tool endpoint="/api/remove-blank-pages" title="Remove Blank PDF Pages" description="Detect and remove pages that contain no selectable text, images or vector drawings." downloadName="PDFora-Without-Blank-Pages.pdf"  /></div></div></main>;
}
