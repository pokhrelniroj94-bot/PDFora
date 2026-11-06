import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("flatten-pdf");

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Flatten PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Attempt to apply form widgets and remove annotations. Results can vary by PDF type.</p><div className="mt-8"><Niroj77Tool endpoint="/api/flatten" title="Flatten PDF" description="Attempt to apply form widgets and remove annotations. Results can vary by PDF type." downloadName="PDFora-flatten-pdf.pdf"   /></div></div></main>;
}
