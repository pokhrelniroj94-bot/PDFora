import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("delete-pages");

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              PDFora PDF Tools
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Delete Pages from PDF Online
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Remove selected pages from a PDF by entering their page numbers.
              Keep the original file and check the downloaded document before sharing it.
            </p>
          </header>
          <div className="mt-10">
            <Niroj77Tool
              endpoint="/api/delete-pages"
              title="Delete PDF Pages"
              description="Remove selected pages from a PDF document."
              multiple={false}
              accept="application/pdf,.pdf"
              downloadName="PDFora-Deleted-Pages.pdf"
              formField="pages"
              formPlaceholder="Enter page numbers, e.g. 2,4,6"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
