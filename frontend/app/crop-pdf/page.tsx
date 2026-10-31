import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Crop PDF Online | Niroj77",
  description: "Crop page margins from your PDF. Enter margin in points (36 points = half an inch).",
  alternates: { canonical: "https://pd-fora.vercel.app/crop-pdf" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Crop PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Crop page margins from your PDF. Enter margin in points (36 points = half an inch).</p><div className="mt-8"><Niroj77Tool endpoint="/api/crop" title="Crop PDF" description="Crop page margins from your PDF. Enter margin in points (36 points = half an inch)." downloadName="Niroj77-crop-pdf.pdf" formField="margin" formPlaceholder="Margin in points (default 36)" extraFields={[{name:"pages",label:"Pages (all or e.g. 1,3,5)",defaultValue:"all"}]} /></div></div></main>;
}
