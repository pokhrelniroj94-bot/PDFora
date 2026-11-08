import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("unlock-pdf");

export default function Page() {
  return <section className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Unlock PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Remove PDF password protection when you know the correct password.</p><div className="mt-8"><Niroj77Tool endpoint="/api/unlock" title="Unlock PDF" description="Remove PDF password protection when you know the correct password." downloadName="PDFora-unlock-pdf.pdf" formField="password" formPlaceholder="Existing PDF password"  /></div></div></section>;
}
