import type { Metadata } from "next";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Render PDF Pages to PNG | PDFora",
  description: "Render every PDF page as a high-quality PNG image and download all pages in one ZIP archive.",
  alternates: { canonical: "https://pd-fora.vercel.app/extract-page-images" },
};

export default function Page() {
  const description = "Render every PDF page as a PNG image and download all pages together in a ZIP archive.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Render PDF Pages to PNG</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/extract-page-images" title="Render PDF Pages to PNG" description={description} downloadName="PDFora-Page-Images.zip" /></div></div></main>;
}
