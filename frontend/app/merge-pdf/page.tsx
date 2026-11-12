import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/PDForaTool";

export const metadata = getPdfToolMetadata("merge-pdf");

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            Free online PDF merger
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Merge PDF Files Online
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Combine 2–20 PDF files into one document. Set the file order with the
            up and down controls, merge your documents and download one PDF.
            The combined upload limit is 50 MB.
          </p>
        </div>

        <div className="mt-10">
          <PDForaTool
            endpoint="/api/merge"
            title="Merge PDF"
            description="Combine two or more PDF files into one document. Select the files, arrange their order and download the merged PDF."
            multiple
            downloadName="PDFora-Merged.pdf"
          />
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              How to merge PDF files in the right order
            </h2>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-600">
              <li>Select at least two PDF files from your device. You can merge up to 20 files in one job.</li>
              <li>Review the selected file list. Use the up and down arrow buttons beside each file to place it in the reading order you want.</li>
              <li>Remove any file you selected by mistake, then start the merge.</li>
              <li>Download the new PDF and check the first, middle and final pages before sharing it.</li>
            </ol>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              What the PDF merger supports
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-black text-slate-950">2–20 PDF files</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Combine two or more documents in one merge. The tool accepts up to 20 PDF files at a time.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-black text-slate-950">50 MB combined upload</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">The total size of all selected PDFs must stay within 50 MB, not 50 MB per file.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-black text-slate-950">Custom file order</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Move files up or down before merging. Pages inside each source PDF keep their original sequence.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-black text-slate-950">A separate output file</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Your original files on your device are not overwritten. The tool creates a new combined PDF for download.</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              When should you merge PDF files?
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Combine a report with its appendices, put invoices for one project
              into a single file, join assignment sections, or prepare one
              application document when the receiving portal asks for a single
              PDF. Keep unrelated or confidential records separate when the
              recipient requires separate uploads.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              If one source document contains pages you do not need, remove or
              extract those pages before merging. If the final file is too large
              for a portal, use <a className="font-semibold text-teal-700 underline" href="/compress-pdf">Compress PDF</a>
              and check that text and images remain readable.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              Scanned PDFs, text search and page quality
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Merging joins the existing PDF pages; it does not run optical
              character recognition (OCR). If a source file contains scanned
              page images, those pages remain images and do not become
              searchable text just because they were merged. Use an OCR tool
              separately when you need text recognition.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The merger is not a PDF compressor or editor. Open the downloaded
              result and review page order, orientation, blank pages and
              readability before sending the document.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              Frequently asked questions
            </h2>
            <div className="mt-6 space-y-5">
              <div>
                <h3 className="font-black text-slate-950">How many PDF files can I merge?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">Select at least two and up to 20 PDF files. Their combined upload size must not exceed 50 MB.</p>
              </div>
              <div>
                <h3 className="font-black text-slate-950">Can I change the order before merging?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">Yes. Use the up and down arrow buttons beside the selected file names to set the order. The merged PDF follows that file order.</p>
              </div>
              <div>
                <h3 className="font-black text-slate-950">Will merging make a scanned PDF searchable?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">No. The merger combines pages but does not perform OCR. Scanned pages remain images unless you process them with OCR separately.</p>
              </div>
              <div>
                <h3 className="font-black text-slate-950">Does the tool overwrite my original PDFs?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">No. It creates a separate merged PDF for download. Keep your source files until you have checked the output.</p>
              </div>
              <div>
                <h3 className="font-black text-slate-950">What if my merged PDF is too large?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">Keep the combined upload within 50 MB. If the output is too large for a destination, compress it after merging and verify the result.</p>
              </div>
            </div>
          </section>

          <p className="text-sm leading-7 text-slate-600">
            Need a smaller document? Try <a className="font-semibold text-teal-700 underline" href="/compress-pdf">Compress PDF</a>.
            Need only certain pages? Use <a className="font-semibold text-teal-700 underline" href="/extract-pages">Extract PDF Pages</a> or <a className="font-semibold text-teal-700 underline" href="/split-pdf">Split PDF</a>.
            Read the <a className="font-semibold text-teal-700 underline" href="/blog/merge-multiple-pdf-files-into-one-document">PDF merging guide</a> for a checklist before sharing.
          </p>
        </div>
      </section>
    </main>
  );
}
