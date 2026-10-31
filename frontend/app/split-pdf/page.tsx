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
              S
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Free Online PDF Tool
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Split PDF Online
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Split PDF files online and extract the pages you need into a
              separate PDF document. Niroj77 makes splitting PDFs simple, fast
              and easy to use on phones, tablets and computers.
            </p>
          </div>

          {/* TOOL */}
          <div className="mt-10">
            <Niroj77Tool
              endpoint="/api/split"
              title="Split PDF"
              description="Split a PDF or extract selected pages into a new PDF document."
              multiple={false}
              downloadName="Niroj77-Split.pdf"
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
                📄
              </div>

              <h2 className="mt-4 text-base font-black">
                Extract PDF Pages
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Separate the pages you need from a PDF and create a new
                document.
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
                Upload your PDF, choose the pages you need and download the
                resulting document.
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
                Use Niroj77 from your phone, tablet or desktop browser without
                installing software.
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
              Split your PDF in three simple steps
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">01</span>

              <h3 className="mt-3 text-base font-black">
                Upload your PDF
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select the PDF file you want to split.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">02</span>

              <h3 className="mt-3 text-base font-black">
                Choose the pages
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Select the pages or page range you want to extract.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">03</span>

              <h3 className="mt-3 text-base font-black">
                Download your PDF
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Process the document and download your new PDF file.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black">
            Split PDF files online with Niroj77
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Niroj77 provides a simple online PDF splitter for extracting pages
            from PDF documents. Whether you need to separate specific pages,
            remove unnecessary sections or create a smaller document, you can
            use the Split PDF tool directly from your browser.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Niroj77 is designed to work across modern desktop and mobile
            browsers. No desktop application is required to access the tool.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Is Niroj77 Split PDF free?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Niroj77 currently provides its available PDF tools without
            requiring a subscription. Upload your PDF, process it with the
            Split PDF tool and download the resulting document.
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
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="text-lg font-black text-blue-600">M</div>
              <h3 className="mt-3 font-black">Merge PDF</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Combine multiple PDF files into one document.
              </p>
              <div className="mt-4 text-sm font-bold text-blue-600">
                Open tool →
              </div>
            </a>

            <a
              href="/compress-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="text-lg font-black text-blue-600">C</div>
              <h3 className="mt-3 font-black">Compress PDF</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Reduce PDF file size for easier sharing and storage.
              </p>
              <div className="mt-4 text-sm font-bold text-blue-600">
                Open tool →
              </div>
            </a>

            <a
              href="/pdf-to-word"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="text-lg font-black text-blue-600">W</div>
              <h3 className="mt-3 font-black">PDF to Word</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Convert PDF documents into editable Word files.
              </p>
              <div className="mt-4 text-sm font-bold text-blue-600">
                Open tool →
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-4 py-14 sm:px-6">
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
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-black">
                Can I split a PDF online for free?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Niroj77 currently provides its available PDF tools without
                requiring a subscription.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-black">
                Can I use the Split PDF tool on my phone?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Yes. Niroj77 is designed to work with modern mobile, tablet and
                desktop browsers.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-black">
                Do I need to install software?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                No. The tool is available directly through your web browser.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-black">
                What can I do with Split PDF?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                You can use the tool to extract selected pages from a PDF and
                create a separate PDF document.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-slate-950 px-4 py-14 text-white sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">
            Need to split another PDF?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Use Niroj77 to quickly extract the pages you need from your PDF
            documents.
          </p>

          <a
            href="#top"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-200"
          >
            Split PDF Now
          </a>
        </div>
      </section>
    </main>
  );
}