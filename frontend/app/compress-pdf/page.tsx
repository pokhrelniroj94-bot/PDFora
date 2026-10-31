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
              C
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Free Online PDF Tool
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Compress PDF Online
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Compress PDF files online and reduce their file size for easier
              sharing, uploading and storage. Niroj77 provides a simple way to
              optimize PDF documents from your browser.
            </p>
          </div>

          {/* TOOL */}
          <div className="mt-10">
            <Niroj77Tool
              endpoint="/api/compress"
              title="Compress PDF"
              description="Reduce PDF file size for easier sharing, uploading and storage."
              multiple={false}
              downloadName="Niroj77-Compressed.pdf"
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
                📉
              </div>

              <h2 className="mt-4 text-base font-black">
                Reduce PDF Size
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Make PDF documents smaller and easier to upload, store and
                share.
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
                Upload your PDF, start compression and download the processed
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
                Use Niroj77 from modern desktop, tablet and mobile browsers.
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
              Compress your PDF in three simple steps
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">01</span>

              <h3 className="mt-3 text-base font-black">
                Upload your PDF
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select the PDF document you want to compress.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">02</span>

              <h3 className="mt-3 text-base font-black">
                Compress the file
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start the PDF compression process with the Niroj77 tool.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">03</span>

              <h3 className="mt-3 text-base font-black">
                Download your PDF
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Download the compressed PDF after processing is complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black">
            Compress PDF files online with Niroj77
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Niroj77 provides an online PDF compressor for reducing the size of
            PDF documents. Smaller PDF files can be easier to upload, share
            through email or messaging services, and store on your devices.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            The Niroj77 Compress PDF tool is designed to provide a simple
            browser-based workflow. Select your PDF, process the document and
            download the resulting file.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Why compress a PDF?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Large PDF files can take longer to upload and may be difficult to
            share when a service has file-size limits. Compressing a PDF can
            help reduce its size and make the document more convenient to
            handle.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Is Niroj77 Compress PDF free?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Niroj77 currently provides its available PDF tools without requiring
            a subscription. You can use the Compress PDF tool to process your
            document and download the resulting PDF.
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

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                Extract pages from a PDF document.
              </p>
            </a>

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
              href="/images-to-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">Images to PDF</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Convert images into a PDF document.
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}