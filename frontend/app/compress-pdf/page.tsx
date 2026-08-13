"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
return ( <main className="min-h-screen bg-slate-50 text-slate-950"> <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16"> <div className="mx-auto max-w-5xl"> <div className="mx-auto max-w-3xl text-center"> <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-blue-600">
C </div>

```
        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
          Free Online PDF Tool
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Compress PDF Online
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Compress PDF files online and reduce their file size for easier
          sharing, uploading and storage. PDFora provides a simple,
          browser-based PDF compression workflow for phones, tablets and
          computers.
        </p>
      </div>

      <div className="mt-10">
        <PDForaTool
          endpoint="/api/compress"
          title="Compress PDF"
          description="Reduce the file size of your PDF for easier sharing and storage."
          multiple={false}
          downloadName="PDFora-Compressed.pdf"
        />
      </div>
    </div>
  </section>

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
            Make large PDF documents smaller and easier to upload, store
            and share.
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
            Upload your PDF, start the compression process and download the
            resulting file.
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
            Use PDFora from modern mobile, tablet and desktop browsers
            without installing software.
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
            Start the PDF compression process through the PDFora tool.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <span className="text-xs font-black text-blue-600">03</span>

          <h3 className="mt-3 text-base font-black">
            Download your PDF
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Download the resulting compressed PDF document.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section className="bg-white px-4 py-14 sm:px-6">
    <div className="mx-auto max-w-4xl">
      <h2 className="text-2xl font-black">
        Compress PDF files online with PDFora
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        PDFora provides an online PDF compressor designed to help reduce
        the size of PDF documents. Smaller PDF files can be easier to
        upload to websites, attach to emails, send through messaging
        applications and store on your devices.
      </p>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        The Compress PDF tool works through your web browser, so you do not
        need to install a separate desktop application. You can access
        PDFora from compatible phones, tablets and computers.
      </p>

      <h2 className="mt-10 text-2xl font-black">
        Why compress a PDF?
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        Large PDF files can take longer to upload, download and share.
        Compressing a PDF can help reduce its size and make document
        handling more convenient when file-size limits are important.
      </p>

      <h2 className="mt-10 text-2xl font-black">
        Is PDFora PDF Compressor free?
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        PDFora currently provides its available PDF tools without requiring
        a subscription. Upload your document, use the Compress PDF tool
        and download the processed file.
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="/merge-pdf"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
        >
          <h3 className="font-black">Merge PDF</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Combine multiple PDF files into one document.
          </p>
        </a>

        <a
          href="/split-pdf"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
        >
          <h3 className="font-black">Split PDF</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Extract selected pages from a PDF document.
          </p>
        </a>

        <a
          href="/pdf-to-word"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
        >
          <h3 className="font-black">PDF to Word</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Convert PDF documents into editable Word files.
          </p>
        </a>

        <a
          href="/pdf-to-jpg"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
        >
          <h3 className="font-black">PDF to JPG</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Convert PDF pages into JPG images.
          </p>
        </a>
      </div>
    </div>
  </section>
</main>

);
}
