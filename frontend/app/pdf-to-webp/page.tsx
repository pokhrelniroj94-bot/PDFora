import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "PDF to WebP Online | Niroj77",
  description: "Convert PDF pages into WebP images and download them together as a ZIP file.",
  alternates: { canonical: "https://pd-fora.vercel.app/pdf-to-webp" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF to WebP</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Convert PDF pages into WebP images and download them together as a ZIP file.</p><div className="mt-8"><Niroj77Tool endpoint="/api/pdf-to-webp" title="PDF to WebP" description="Convert PDF pages into WebP images and download them together as a ZIP file." downloadName="Niroj77-pdf-to-webp.pdf"  extraFields={[{name:"quality",label:"Image quality (1–100)",defaultValue:"85"}]} /></div></div></main>;
}
