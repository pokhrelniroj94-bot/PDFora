import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import { getRequiredToolGuide } from "../../lib/tool-guides";

const guide = getRequiredToolGuide("extract-pages");
export const metadata = getPdfToolMetadata("extract-pages");

import Niroj77Tool from "../../components/Niroj77Tool";
import ToolGuide from "../../components/ToolGuide";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-blue-600">
              E
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Free Online PDF Tool
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Extract PDF Pages Online
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Extract selected pages from a PDF document and create a new PDF
              file. PDFora makes it easy to select the pages you need and
              download the result.
            </p>
          </div>

          <div className="mt-10">
            <Niroj77Tool
              endpoint="/api/extract-pages"
              title="Extract PDF Pages"
              description="Extract selected pages and create a new PDF file."
              multiple={false}
              accept="application/pdf,.pdf"
              downloadName="PDFora-Extracted-Pages.pdf"
              formField="pages"
              formPlaceholder="Enter page numbers or range, e.g. 1,3,5-8"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                📄
              </div>
              <h2 className="mt-4 text-base font-black">
                Extract Selected Pages
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose the pages you need and create a separate PDF document.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                ⚡
              </div>
              <h2 className="mt-4 text-base font-black">
                Simple Workflow
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload your PDF, enter the pages and process the document.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                📱
              </div>
              <h2 className="mt-4 text-base font-black">
                Mobile Friendly
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use PDFora from phones, tablets and desktop browsers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              How it works
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Extract PDF pages in three steps
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">01</span>
              <h3 className="mt-3 text-base font-black">
                Upload your PDF
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select the PDF containing the pages you want.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">02</span>
              <h3 className="mt-3 text-base font-black">
                Select pages
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter individual pages or page ranges to extract.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">03</span>
              <h3 className="mt-3 text-base font-black">
                Download the result
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Process the PDF and download your extracted document.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black">
            Extract pages from PDF online with PDFora
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora provides an online PDF page extraction tool for creating a
            new PDF from selected pages of an existing document. It can be
            useful when you only need certain pages from a larger PDF.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Enter the page numbers or ranges you need and process the PDF
            directly from your browser.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Is PDFora Extract Pages free?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora currently provides its available PDF tools without
            requiring a subscription.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              More PDF tools
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Try another PDF tool
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <a href="/merge-pdf" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300">
              <h3 className="font-black">Merge PDF</h3>
              <p className="mt-2 text-sm text-slate-500">
                Combine PDF files into one document.
              </p>
            </a>

            <a href="/split-pdf" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300">
              <h3 className="font-black">Split PDF</h3>
              <p className="mt-2 text-sm text-slate-500">
                Split a PDF or extract pages.
              </p>
            </a>

            <a href="/delete-pages" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300">
              <h3 className="font-black">Delete Pages</h3>
              <p className="mt-2 text-sm text-slate-500">
                Remove unwanted PDF pages.
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              FAQ
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer font-black">
                How do I extract pages from a PDF?
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Upload your PDF, enter the pages you want to extract and
                process the document.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer font-black">
                Can I extract a page range?
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                You can enter page ranges when supported by the PDFora
                processing endpoint.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer font-black">
                Do I need to install software?
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                No. PDFora works through a modern web browser.
              </p>
            </details>
          </div>
        </div>
      </section>
      <ToolGuide guide={guide} />
    </main>
  );
}