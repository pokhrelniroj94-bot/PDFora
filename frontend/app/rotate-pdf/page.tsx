"use client";

import PDForaTool from "../../components/PDForaTool";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-blue-600">
              R
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Free Online PDF Tool
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Rotate PDF Online
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Rotate PDF pages online by 90, 180 or 270 degrees. PDFora lets
              you quickly change the orientation of your PDF document from
              your browser on desktop, tablet or mobile devices.
            </p>
          </div>

          {/* TOOL */}
          <div className="mt-10">
            <PDForaTool
              endpoint="/api/rotate"
              title="Rotate PDF"
              description="Rotate PDF pages by 90, 180 or 270 degrees."
              multiple={false}
              accept="application/pdf,.pdf"
              downloadName="PDFora-Rotated.pdf"
              queryField="degrees"
              queryDefault="90"
              formPlaceholder="Enter rotation angle"
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
                🔄
              </div>

              <h2 className="mt-4 text-base font-black">
                Rotate PDF Pages
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Change the orientation of your PDF pages by choosing the
                rotation angle you need.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
                ⚡
              </div>

              <h2 className="mt-4 text-base font-black">
                Fast and Simple
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload your PDF, select a rotation angle and process the file
                with a simple workflow.
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
                Rotate PDF documents from modern desktop, tablet and mobile
                browsers without installing software.
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
              Rotate your PDF in three simple steps
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
                Select the PDF document that you want to rotate.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">
                02
              </span>

              <h3 className="mt-3 text-base font-black">
                Choose the angle
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter the rotation angle such as 90, 180 or 270 degrees.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">
                03
              </span>

              <h3 className="mt-3 text-base font-black">
                Download your PDF
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Process the document and download the rotated PDF file.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black">
            Rotate PDF files online with PDFora
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora provides a simple online PDF rotation tool for changing
            the orientation of PDF documents. If a scanned document, page or
            other PDF content appears sideways or upside down, you can use
            the Rotate PDF tool to adjust its orientation.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            The tool is designed for modern desktop and mobile browsers, so
            you can rotate PDF files without installing a separate desktop
            application.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            What rotation angles can I use?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora supports common PDF rotation angles including 90, 180 and
            270 degrees. Choose the angle that correctly orients your
            document before processing it.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Is PDFora Rotate PDF free?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora currently provides its available PDF tools without
            requiring a subscription. Upload your PDF, choose the rotation
            angle and download the processed document.
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
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <h3 className="font-black">Merge PDF</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Combine multiple PDF files into one document.
              </p>
            </a>

            <a
              href="/split-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <h3 className="font-black">Split PDF</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Extract selected pages from a PDF document.
              </p>
            </a>

            <a
              href="/compress-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <h3 className="font-black">Compress PDF</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Reduce PDF file size for easier sharing and storage.
              </p>
            </a>

            <a
              href="/pdf-to-jpg"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <h3 className="font-black">PDF to JPG</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Convert PDF pages into JPG images.
              </p>
            </a>

            <a
              href="/pdf-to-word"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <h3 className="font-black">PDF to Word</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Convert PDF documents into editable Word files.
              </p>
            </a>

            <a
              href="/images-to-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
            >
              <h3 className="font-black">Images to PDF</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Convert JPG, PNG and WebP images into PDF.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
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
                How do I rotate a PDF online?
              </summary>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Upload your PDF to PDFora, enter the desired rotation angle
                and click the Rotate PDF button to process the document.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer font-black">
                Can I rotate a PDF by 90 degrees?
              </summary>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Yes. You can use a 90-degree rotation to change the
                orientation of PDF pages.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer font-black">
                Can I rotate a PDF by 180 degrees?
              </summary>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Yes. Enter 180 as the rotation angle to rotate the document
                by 180 degrees.
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <summary className="cursor-pointer font-black">
                Do I need to install software?
              </summary>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                No. PDFora is designed to work through a modern web browser
                on desktop and mobile devices.
              </p>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}