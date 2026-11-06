import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import { getToolGuide } from "../../lib/tool-guides";

const guide = getToolGuide("pdf-to-excel");
export const metadata = getPdfToolMetadata("pdf-to-excel");

import Niroj77Tool from "../../components/Niroj77Tool";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-lg font-black text-green-600">
              X
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Free Online PDF Converter
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              PDF to Excel Converter
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Convert PDF files to editable Excel spreadsheets online with
              PDFora. Extract tables and text from your PDF and download the
              result as an Excel XLSX file quickly and easily.
            </p>
          </div>

          {/* TOOL */}
          <div className="mt-10">
            <Niroj77Tool
              endpoint="/api/pdf-to-excel"
              title="PDF to Excel"
              description="Convert your PDF into an editable Excel spreadsheet."
              multiple={false}
              accept="application/pdf,.pdf"
              downloadName="PDFora-Converted.xlsx"
              fieldName="file"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg">
                XLS
              </div>

              <h2 className="mt-4 text-base font-black">
                Editable Excel Spreadsheet
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Convert PDF content into an Excel XLSX spreadsheet that you
                can edit, organize and continue working with.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg">
                T
              </div>

              <h2 className="mt-4 text-base font-black">
                Extract PDF Tables
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Extract readable tables from PDF documents and place the data
                into Excel worksheets.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg">
                W
              </div>

              <h2 className="mt-4 text-base font-black">
                Works Across Devices
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use PDFora from modern desktop, tablet and mobile browsers
                without installing additional software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-slate-200 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-green-600">
              How it works
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Convert PDF to Excel in three simple steps
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-green-600">
                01
              </span>

              <h3 className="mt-3 text-base font-black">
                Upload your PDF
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select the PDF document containing the tables or data you want
                to convert to Excel.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-green-600">
                02
              </span>

              <h3 className="mt-3 text-base font-black">
                Convert the file
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start the PDF to Excel conversion using the PDFora converter.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-green-600">
                03
              </span>

              <h3 className="mt-3 text-base font-black">
                Download Excel
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Download the generated XLSX spreadsheet and open it in Excel
                or another compatible spreadsheet application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black">
            Convert PDF to Excel online
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora provides a free online PDF to Excel converter for users who
            need to turn PDF documents into editable Excel spreadsheets.
            Upload a PDF and convert readable tables and text into an XLSX
            file that can be opened and edited in spreadsheet software.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Converting PDF to Excel can be useful for invoices, reports,
            financial documents, lists, statements and other PDF files that
            contain structured information.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Why convert PDF to Excel?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDF files are convenient for sharing and viewing, but extracting
            data from them can be difficult. Converting a PDF to Excel makes
            the information easier to organize, edit, sort and analyze in a
            spreadsheet.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            What can PDFora PDF to Excel convert?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora can extract readable tables when tables are detected in the
            PDF. When no table is detected, readable text can be placed into
            Excel worksheets so that the content can still be accessed and
            edited.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Is PDFora PDF to Excel free?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora currently provides its available PDF tools without
            requiring a subscription. Upload a PDF and use the PDF to Excel
            converter to generate a downloadable XLSX spreadsheet.
          </p>
        </div>
      </section>

      {/* RELATED TOOLS */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-green-600">
              More PDF tools
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Try another PDF tool
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <a
              href="/pdf-to-word"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">PDF to Word</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Convert PDF documents into editable Word files.
              </p>
            </a>

            <a
              href="/merge-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">Merge PDF</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Combine multiple PDF files into one document.
              </p>
            </a>

            <a
              href="/split-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">Split PDF</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Extract selected pages from a PDF document.
              </p>
            </a>

            <a
              href="/compress-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">Compress PDF</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Reduce PDF file size for easier sharing and storage.
              </p>
            </a>

            <a
              href="/pdf-to-jpg"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">PDF to JPG</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Convert PDF pages into JPG images.
              </p>
            </a>

            <a
              href="/images-to-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">Images to PDF</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create a PDF document from JPG, PNG or WebP images.
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
