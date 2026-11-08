import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("pdf-to-excel");

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-lg font-black text-green-700">
              XLSX
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-green-700">
              Spreadsheet conversion
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Convert PDF Tables to Excel
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Turn readable tables in a PDF into an editable XLSX workbook.
              Upload a document, run the conversion and check the extracted
              rows and values against the original before using the spreadsheet.
            </p>
          </div>
          <div className="mt-10">
            <Niroj77Tool
              endpoint="/api/pdf-to-excel"
              title="PDF to Excel"
              description="Extract available PDF table data into an editable Excel workbook."
              multiple={false}
              accept="application/pdf,.pdf"
              downloadName="PDFora-Converted.xlsx"
              fieldName="file"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
