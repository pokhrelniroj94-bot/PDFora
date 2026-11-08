import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/PDForaTool";

export const metadata = getPdfToolMetadata("merge-pdf");

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            PDFora PDF Tools
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Merge PDF Online
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Combine multiple PDF files into one document. Select your files,
            arrange their order, and download the merged PDF.
          </p>
        </header>
        <div className="mt-10">
          <PDForaTool
            endpoint="/api/merge"
            title="Merge PDF"
            description="Combine multiple PDF files into one PDF document."
            multiple
            downloadName="PDFora-Merged.pdf"
          />
        </div>
      </section>
    </div>
  );
}
