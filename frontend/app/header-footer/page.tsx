import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Add Header or Footer Online",
  description: "Add a text header to each page of your PDF.",
  alternates: { canonical: "https://pd-fora.vercel.app/header-footer" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Add Header or Footer</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Add a text header to each page of your PDF.</p><div className="mt-8"><Niroj77Tool endpoint="/api/header-footer" title="Add Header or Footer" description="Add a text header to each page of your PDF." downloadName="PDFora-header-footer.pdf" formField="header" formPlaceholder="Header text" extraFields={[{name:"footer",label:"Footer text"},{name:"font_size",label:"Font size",defaultValue:"10"}]}  /></div></div></main>;
}
