import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("reorder-pdf");

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Reorder PDF Pages</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Rearrange PDF pages by entering their new order, such as 3,1,2.</p><div className="mt-8"><Niroj77Tool endpoint="/api/reorder" title="Reorder PDF Pages" description="Rearrange PDF pages by entering their new order, such as 3,1,2." downloadName="PDFora-reorder-pdf.pdf" formField="order" formPlaceholder="Page order (example: 3,1,2)"  /></div></div></main>;
}
