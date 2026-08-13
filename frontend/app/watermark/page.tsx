"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-blue-600">
              W
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Free Online PDF Tool
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Add Watermark to PDF Online
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Add a custom text watermark to your PDF document online.
              PDFora provides a simple way to watermark PDF files directly
              from your browser.
            </p>
          </div>

          <div className="mt-10">
            <PDForaTool
              endpoint="/api/watermark"
              title="Watermark PDF"
              description="Add a custom text watermark to a PDF document."
              multiple={false}
              accept="application/pdf,.pdf"
              downloadName="PDFora-Watermarked.pdf"
              formField="text"
              formPlaceholder="Enter watermark text"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                💧
              </div>
              <h2 className="mt-4 text-base font-black">
                Custom Text
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add your own text as a watermark to your PDF document.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                ⚡
              </div>
              <h2 className="mt-4 text-base font-black">
                Easy to Use
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload a PDF, enter your watermark and process the file.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                📱
              </div>
              <h2 className="mt-4 text-base font-black">
                Browser Based
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use the watermark tool from desktop and mobile browsers.
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
              Watermark your PDF in three steps
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">01</span>
              <h3 className="mt-3 text-base font-black">
                Upload your PDF
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select the PDF document you want to watermark.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">02</span>
              <h3 className="mt-3 text-base font-black">
                Enter watermark text
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter the text you want to add to the document.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">03</span>
              <h3 className="mt-3 text-base font-black">
                Download your PDF
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Process the document and download the watermarked PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black">
            Add a watermark to PDF online with PDFora
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora provides an online PDF watermark tool that lets you add
            custom text to a PDF document. Watermarks can be useful for
            identifying documents, adding ownership information or marking
            files for a particular purpose.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Upload your PDF, enter the watermark text and process the
            document directly through your browser.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Is PDFora Watermark PDF free?
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

            <a href="/compress-pdf" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300">
              <h3 className="font-black">Compress PDF</h3>
              <p className="mt-2 text-sm text-slate-500">
                Reduce PDF file size.
              </p>
            </a>

            <a href="/rotate-pdf" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300">
              <h3 className="font-black">Rotate PDF</h3>
              <p className="mt-2 text-sm text-slate-500">
                Rotate PDF pages online.
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
                How do I add a watermark to a PDF?
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Upload your PDF, enter the watermark text and process the
                document using the PDFora Watermark tool.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer font-black">
                Can I use custom watermark text?
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Yes. Enter the text you want to use in the watermark field
                before processing your PDF.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer font-black">
                Do I need to install software?
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                No. PDFora is designed to work through a modern web browser.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}