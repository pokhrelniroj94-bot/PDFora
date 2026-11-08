import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";

export const metadata = getPdfToolMetadata("pdf-to-word");

import Niroj77Tool from "../../components/Niroj77Tool";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-blue-600">
              W
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Free Online PDF Converter
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              PDF to Word Converter
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Convert PDF files to editable Word documents online with PDFora.
              Upload your PDF, process it in your browser and download the
              converted Word document quickly and easily.
            </p>
          </div>

          {/* TOOL */}
          <div className="mt-10">
            <Niroj77Tool
              endpoint="/api/pdf-to-word"
              title="PDF to Word"
              description="Convert your PDF into an editable Word document."
              multiple={false}
              accept="application/pdf,.pdf"
              downloadName="PDFora-Converted.docx"
              fieldName="file"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
