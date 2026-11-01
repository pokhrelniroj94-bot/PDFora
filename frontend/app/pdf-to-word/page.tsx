"use client";

import Niroj77Tool from "../../components/Niroj77Tool";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
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

      {/* FEATURES */}
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                📝
              </div>

              <h2 className="mt-4 text-base font-black">
                Editable Word Documents
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Turn your PDF into a Word document that you can edit and
                continue working with.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                ⚡
              </div>

              <h2 className="mt-4 text-base font-black">
                Simple Conversion
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload your PDF, start the conversion and download the
                resulting Word file.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                📱
              </div>

              <h2 className="mt-4 text-base font-black">
                Works Across Devices
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use PDFora from modern desktop, tablet and mobile browsers
                without installing software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-slate-200 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              How it works
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Convert PDF to Word in three simple steps
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">
                01
              </span>

              <h3 className="mt-3 text-base font-black">
                Upload your PDF
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select the PDF document you want to convert into Word format.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">
                02
              </span>

              <h3 className="mt-3 text-base font-black">
                Convert the file
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start the PDF to Word conversion using the PDFora converter.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">
                03
              </span>

              <h3 className="mt-3 text-base font-black">
                Download Word
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Download the converted Word document and continue editing it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black">
            Convert PDF to Word online
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora provides an online PDF to Word converter for users who need
            to turn PDF documents into editable Word files. Instead of
            manually recreating the content, upload your PDF and use the
            converter to create a Word document.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            The PDF to Word tool is designed for everyday document tasks such
            as editing text, updating documents and continuing work on content
            that was originally saved as a PDF.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Why convert PDF to Word?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDF files are useful for sharing and preserving documents, but
            editing them can sometimes be less convenient than editing a Word
            document. Converting a PDF to Word can make it easier to modify
            text and continue working with the document.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Is PDFora PDF to Word free?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora currently provides its available PDF tools without
            requiring a subscription. You can upload a PDF and use the PDF to
            Word tool to generate a downloadable Word document.
          </p>
        </div>
      </section>

      {/* RELATED TOOLS */}
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

            <a
              href="/rotate-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">Rotate PDF</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Rotate PDF pages by different angles.
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}