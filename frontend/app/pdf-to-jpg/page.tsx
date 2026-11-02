import type { Metadata } from "next";
import { getToolGuide } from "../../lib/tool-guides";

const guide = getToolGuide("pdf-to-jpg");
export const metadata: Metadata = {
  title: `${guide?.name ?? "PDF tool"} Online`,
  description: guide ? `${guide.purpose} ${guide.keyword}. Use PDFora online and inspect the output before sharing.`.slice(0, 160) : "Use this free PDF tool online with PDFora.",
  keywords: [guide?.name ?? "PDF tool", guide?.keyword ?? "PDF tool online", "free online PDF tool"],
  alternates: { canonical: "https://pd-fora.vercel.app/pdf-to-jpg" },
  };

import Niroj77Tool from "../../components/Niroj77Tool";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-blue-600">
              J
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Free Online PDF Tool
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              PDF to JPG Converter
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Convert PDF pages into JPG images online with PDFora. Turn your
              PDF documents into easy-to-view JPG images directly from your
              browser on desktop, tablet or mobile.
            </p>
          </div>

          {/* TOOL */}
          <div className="mt-10">
            <Niroj77Tool
              endpoint="/api/pdf-to-jpg"
              title="PDF to JPG"
              description="Convert PDF pages into JPG images for easy sharing and viewing."
              multiple={false}
              downloadName="PDFora-JPG.zip"
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
                🖼️
              </div>

              <h2 className="mt-4 text-base font-black">
                Convert PDF Pages
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Turn the pages of a PDF document into JPG image files.
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
                Upload your PDF and start the conversion with a simple
                browser-based workflow.
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
                Convert PDFs from modern desktop, tablet and mobile browsers.
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
              Convert PDF to JPG in three simple steps
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
                Select the PDF document you want to convert into JPG images.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">
                02
              </span>

              <h3 className="mt-3 text-base font-black">
                Start conversion
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start the PDF to JPG conversion using the PDFora tool.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <span className="text-xs font-black text-blue-600">
                03
              </span>

              <h3 className="mt-3 text-base font-black">
                Download your images
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Download the converted JPG images after processing is
                complete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-black">
            Convert PDF to JPG online with PDFora
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora provides a simple online PDF to JPG converter for turning
            PDF pages into JPG images. JPG files can be convenient for
            previews, sharing, presentations and viewing documents on
            different devices.
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Instead of installing desktop software, you can use the PDFora
            PDF to JPG tool directly from a modern web browser. Upload your
            PDF, start the conversion and download the resulting images.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Why convert PDF to JPG?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            Converting PDF pages to JPG can be useful when you need individual
            document pages as image files. JPG images are widely supported by
            phones, computers, messaging applications and many websites.
          </p>

          <h2 className="mt-10 text-2xl font-black">
            Is PDFora PDF to JPG free?
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            PDFora currently provides its available PDF tools without
            requiring a subscription. You can use the PDF to JPG tool to
            process your document and download the resulting files.
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
                Extract selected pages from a PDF document.
              </p>
            </a>

            <a
              href="/compress-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">Compress PDF</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Reduce the size of your PDF files.
              </p>
            </a>

            <a
              href="/images-to-pdf"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-black">Images to PDF</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Convert JPG, PNG and WebP images into PDF files.
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}