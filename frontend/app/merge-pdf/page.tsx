import type { Metadata } from "next";
import PDForaTool from "../../components/PDForaTool";

export const metadata: Metadata = {
  title: "Merge PDF Online Free",
  description:
    "Merge multiple PDF files into one PDF online for free. Combine PDF documents quickly and easily with PDFora. No software installation required.",
  keywords: [
    "merge PDF",
    "merge PDF online",
    "merge PDF free",
    "combine PDF",
    "combine PDF files",
    "PDF merger",
    "merge multiple PDFs",
  ],
  alternates: {
    canonical: "https://pd-fora.vercel.app/merge-pdf",
  },
  };

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            PDFora PDF Tools
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Merge PDF Online
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Combine multiple PDF files into one document quickly and easily.
            Upload your PDF files, arrange them in the order you want, and
            create one combined PDF.
          </p>
        </div>

        <div className="mt-10">
          <PDForaTool
            endpoint="/api/merge"
            title="Merge PDF"
            description="Combine multiple PDF files into one PDF document."
            multiple
            downloadName="PDFora-Merged.pdf"
          />
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              How to merge PDF files
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-600">
                  1
                </div>

                <h3 className="mt-3 font-black text-slate-950">
                  Select your PDFs
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose two or more PDF files that you want to combine.
                </p>
              </div>

              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-600">
                  2
                </div>

                <h3 className="mt-3 font-black text-slate-950">
                  Arrange the files
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Put your PDF files in the order you want them to appear.
                </p>
              </div>

              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-600">
                  3
                </div>

                <h3 className="mt-3 font-black text-slate-950">
                  Merge and download
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Start the process and download your combined PDF document.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              Free online PDF merger
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              PDFora makes it easy to combine multiple PDF documents into a
              single file. Whether you are combining documents for work,
              school, applications, reports or personal use, you can merge
              your files directly from your browser without installing
              desktop software.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Use the PDFora Merge PDF tool to combine multiple documents into
              one organized PDF file. The tool is designed to work across
              modern desktop and mobile browsers.
            </p>
          </section>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">
              Frequently asked questions
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-black text-slate-950">
                  Can I merge multiple PDF files?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Yes. Select multiple PDF files and combine them into a
                  single PDF document.
                </p>
              </div>

              <div>
                <h3 className="font-black text-slate-950">
                  Is PDFora Merge PDF free?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  PDFora provides this PDF merging tool online without
                  requiring desktop software installation.
                </p>
              </div>

              <div>
                <h3 className="font-black text-slate-950">
                  Do I need to install software?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No. The tool works through a modern web browser on desktop,
                  tablet and mobile devices.
                </p>
              </div>

              <div>
                <h3 className="font-black text-slate-950">
                  What can I use a merged PDF for?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  You can combine reports, assignments, applications,
                  invoices, scanned documents and other PDF files into one
                  document.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}