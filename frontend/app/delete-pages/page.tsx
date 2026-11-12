import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";

export const metadata = getPdfToolMetadata("delete-pages");

import Niroj77Tool from "../../components/Niroj77Tool";
import ToolGuide from "../../components/ToolGuide";
import { getRequiredToolGuide } from "../../lib/tool-guides";

const guide = getRequiredToolGuide("delete-pages");

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-blue-600">
              D
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Free Online PDF Tool
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Delete Pages from PDF Online Free</h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Remove selected, blank or duplicate pages from a PDF copy. Enter individual page numbers or ranges, such as 2,4,6-8, then download and review the updated document.
            </p>
          </div>

          <div className="mt-10">
            <Niroj77Tool
              endpoint="/api/delete-pages"
              title="Delete PDF Pages"
              description="Remove unwanted pages from a PDF document."
              multiple={false}
              accept="application/pdf,.pdf"
              downloadName="PDFora-Deleted-Pages.pdf"
              formField="pages"
              formPlaceholder="Enter pages or ranges, e.g. 2,4,6-8"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                ✂️
              </div>
              <h2 className="mt-4 text-base font-black">
                Remove Selected Pages
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Remove unwanted pages from your PDF and create a cleaner
                document.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                ✓
              </div>
              <h2 className="mt-4 text-base font-black">
                Simple Workflow
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload your PDF, enter the pages to remove and process the
                document.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                📱
              </div>
              <h2 className="mt-4 text-base font-black">
                Works on Any Device
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use the tool from modern desktop, tablet and mobile browsers.
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
              Delete PDF pages in three simple steps
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">01</span>
              <h3 className="mt-3 text-base font-black">
                Upload your PDF
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select the PDF document you want to edit.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">02</span>
              <h3 className="mt-3 text-base font-black">
                Enter page numbers
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter page numbers using commas for separate pages or a hyphen for a continuous range, for example 2,4,6-8. Use the PDF viewer page position rather than printed page labels.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">03</span>
              <h3 className="mt-3 text-base font-black">
                Download your PDF
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Process the file and download the updated PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black">
            Delete pages from PDF online for free with PDFora
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Use this page when you want to remove selected pages while keeping the rest of a PDF together. Common tasks include deleting a blank scan, removing an outdated form page, or taking out an accidental duplicate before sending a document. Work from a copy of the original so you can return to the untouched file if you remove the wrong page.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Enter page numbers such as 2,4,6-8 in the page field. Commas separate individual pages and a hyphen represents a range. Confirm the page numbers against the PDF viewer before processing; printed page numbers inside a document may not match the viewer’s page count.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Is PDFora Delete Pages free?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            After deleting pages, use Split PDF to create separate files from selected page ranges, Extract Pages to keep only chosen pages, or Reorder PDF if the remaining pages need a different sequence.
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
                Combine multiple PDF files into one document.
              </p>
            </a>

            <a href="/split-pdf" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300">
              <h3 className="font-black">Split PDF</h3>
              <p className="mt-2 text-sm text-slate-500">
                Extract selected pages from a PDF.
              </p>
            </a>

            <a href="/compress-pdf" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300">
              <h3 className="font-black">Compress PDF</h3>
              <p className="mt-2 text-sm text-slate-500">Reduce PDF file size.</p>
            </a>
            <a href="/extract-pages" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300"><h3 className="font-black">Extract Pages</h3><p className="mt-2 text-sm text-slate-500">Save selected pages as a new PDF.</p></a>
            <a href="/reorder-pdf" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300"><h3 className="font-black">Reorder PDF</h3><p className="mt-2 text-sm text-slate-500">Change the order of the remaining pages.</p></a>
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
                How can I remove pages from a PDF online?
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Upload your PDF, enter the page numbers you want to remove, and click the delete button. PDFora processes the file online and creates a new PDF without the selected pages.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer font-black">
                Can I delete multiple pages from a PDF?
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Yes. You can enter multiple page numbers, such as 2,4,6, to remove several unwanted pages from the same PDF.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer font-black">
                Is PDFora free to use and do I need to install software?
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Yes. PDFora provides this PDF page removal tool online without requiring a subscription or software installation. You can use it from a modern desktop, tablet, or mobile browser.
              </p>
            </details>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6"><h2 className="text-xl font-black">PDF page management reference</h2><p className="mt-2 text-sm leading-6 text-slate-600">For another explanation of page numbering, document restrictions and page deletion workflows, see the <a className="font-semibold text-blue-700 underline" href="https://helpx.adobe.com/acrobat/desktop/edit-documents/organize-pages/delete-pages.html" target="_blank" rel="noopener noreferrer">Adobe Acrobat guide to deleting PDF pages</a>. The steps may differ between software; this reference is not an endorsement or a requirement to use Acrobat.</p></section>
      <div className="mx-auto max-w-4xl px-4 pb-10 sm:px-6"><ToolGuide guide={guide}/></div>
    </main>
  );
}




