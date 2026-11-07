import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import { getRequiredToolGuide } from "../../lib/tool-guides";
import Niroj77Tool from "../../components/Niroj77Tool";
import ToolGuide from "../../components/ToolGuide";

const guide = getRequiredToolGuide("pdf-to-excel");
export const metadata = getPdfToolMetadata("pdf-to-excel");

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
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

      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-base font-black">Best for selectable tables</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Text-based PDFs with clear rows and columns are generally easier
              to convert than photographed or scanned pages.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-base font-black">Review the workbook</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Check column alignment, decimal places, dates, negative values
              and totals before sorting, filtering or analysing the data.
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-base font-black">Keep the source file</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Retain an untouched copy of the PDF so you can compare extracted
              figures and correct any conversion errors.
            </p>
          </article>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-10">
          <section>
            <h2 className="text-2xl font-black">How to convert a PDF table to Excel</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-slate-700">
              <li>Choose a PDF that contains a table with readable text and clear row and column boundaries.</li>
              <li>Upload the PDF using the converter above and start the conversion.</li>
              <li>Download the generated XLSX workbook after processing finishes.</li>
              <li>Open the workbook in Excel or a compatible spreadsheet application and compare representative rows with the PDF.</li>
              <li>Correct any shifted columns, merged headings, date formats or numeric values before relying on the data.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-black">What affects PDF-to-Excel accuracy?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              PDF pages are designed to preserve the appearance of a document,
              not necessarily its underlying spreadsheet structure. A table
              may be stored as selectable text, positioned characters, vector
              lines or a single scanned image. The extraction result depends on
              how the original PDF was created and how clearly its rows and
              columns are represented.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
              <li><strong>Selectable text:</strong> usually provides a better starting point because characters can be read directly.</li>
              <li><strong>Scanned pages:</strong> may require OCR before table extraction; OCR can misread digits, punctuation and symbols.</li>
              <li><strong>Complex layouts:</strong> multi-line headers, merged cells, footnotes and tables spanning pages may need manual repair.</li>
              <li><strong>Numeric data:</strong> verify decimal separators, minus signs, percentages, dates and totals rather than assuming they were interpreted correctly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">When should you use another format?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              If you only need plain rows and columns for importing into a
              database or another application, CSV may be more suitable. If
              you need to preserve paragraphs and page layout, a document
              format may be a better choice. For a scanned document, run OCR
              first where available and review the recognised text before
              extracting figures.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
              <a className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-blue-700 hover:bg-slate-50" href="/pdf-to-csv">PDF to CSV</a>
              <a className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-blue-700 hover:bg-slate-50" href="/pdf-to-text">PDF to Text</a>
              <a className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-blue-700 hover:bg-slate-50" href="/pdf-to-word">PDF to Word</a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black">Privacy and document handling</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Upload only documents you are authorised to process. Avoid
              submitting files containing passwords, financial account
              credentials or confidential personal information unless you
              have reviewed the service's privacy information and are
              comfortable using the tool. Download your result and keep your
              own backup of important source documents.
            </p>
            <a className="mt-3 inline-block text-sm font-semibold text-blue-700 underline" href="/privacy">Read the PDFora Privacy Policy</a>
          </section>

          <section>
            <h2 className="text-2xl font-black">PDF to Excel: common questions</h2>
            <div className="mt-5 space-y-5">
              <div>
                <h3 className="font-bold">Can every PDF be converted accurately?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">No. Results depend on the source document. Scans, unusual fonts, multi-column layouts and merged cells can require OCR or manual correction.</p>
              </div>
              <div>
                <h3 className="font-bold">Will the Excel file look exactly like the PDF?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">Not necessarily. The goal is to extract usable spreadsheet data; page styling, exact spacing and complex visual formatting may not be preserved.</p>
              </div>
              <div>
                <h3 className="font-bold">What should I verify before using the numbers?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">Compare totals and sample rows with the original PDF. Pay particular attention to decimal points, commas, negative amounts, dates and column alignment.</p>
              </div>
              <div>
                <h3 className="font-bold">What if the PDF contains only scanned images?</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700">A scanned page has no directly selectable text. OCR may be needed first, and recognised values should be checked carefully because similar characters can be confused.</p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black">How to use PDF to Excel</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{guide.purpose}</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600">
            {guide.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <strong>Before using the workbook:</strong> {guide.caution}
          </p>
        </div>
      </section>
      <ToolGuide guide={guide} />
    </main>
  );
}
