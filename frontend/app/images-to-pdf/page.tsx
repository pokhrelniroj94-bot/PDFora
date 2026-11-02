import type { Metadata } from "next";
import { getToolGuide } from "../../lib/tool-guides";

const guide = getToolGuide("images-to-pdf");
export const metadata: Metadata = {
  title: `${guide?.name ?? "PDF tool"} Online`,
  description: guide ? `${guide.purpose} Use PDFora online and inspect the output before sharing.`.slice(0, 160) : "Use this free PDF tool online with PDFora.",
  keywords: [guide?.name ?? "PDF tool", guide?.keyword ?? "PDF tool online", "free online PDF tool"],
  alternates: { canonical: "https://pd-fora.vercel.app/images-to-pdf" },
  };

import Niroj77Tool from "../../components/Niroj77Tool";

export default function Page() {
return ( <main className="min-h-screen bg-slate-50 text-slate-950">
{/* HERO */} <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16"> <div className="mx-auto max-w-5xl"> <div className="mx-auto max-w-3xl text-center"> <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-lg font-black text-blue-600">
I </div>

        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
          Free Online PDF Tool
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Images to PDF Online
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Convert JPG, JPEG, PNG and WebP images into a single PDF
          document online. PDFora makes it simple to combine multiple
          images into one PDF file from your phone, tablet or computer.
        </p>
      </div>

      {/* TOOL */}
      <div className="mt-10">
        <Niroj77Tool
          endpoint="/api/images-to-pdf"
          title="Images to PDF"
          description="Convert JPG, PNG and WebP images into a single PDF document."
          multiple
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          downloadName="PDFora-Images.pdf"
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
            Convert Multiple Images
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Select multiple JPG, PNG or WebP images and combine them into
            one PDF document.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg">
            ⚡
          </div>

          <h2 className="mt-4 text-base font-black">
            Simple and Fast
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload your images and create a PDF with a straightforward
            workflow designed for everyday document tasks.
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
            Use PDFora from modern desktop, tablet and mobile browsers
            without installing additional software.
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
          Convert images to PDF in three simple steps
        </h2>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <span className="text-xs font-black text-blue-600">01</span>

          <h3 className="mt-3 text-base font-black">
            Select your images
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose the JPG, JPEG, PNG or WebP images you want to convert.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <span className="text-xs font-black text-blue-600">02</span>

          <h3 className="mt-3 text-base font-black">
            Upload your images
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload your selected images to the PDFora Images to PDF tool.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <span className="text-xs font-black text-blue-600">03</span>

          <h3 className="mt-3 text-base font-black">
            Download your PDF
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Process the images and download the generated PDF document.
          </p>
        </div>
      </div>
    </div>
  </section>

  {/* SEO CONTENT */}
  <section className="bg-white px-4 py-14 sm:px-6">
    <div className="mx-auto max-w-4xl">
      <h2 className="text-2xl font-black">
        Convert images to PDF online with PDFora
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        PDFora provides a simple online Images to PDF converter for
        turning pictures into a PDF document. You can select multiple
        images and combine them into a single PDF file directly from your
        browser.
      </p>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        The tool supports common image formats including JPG, JPEG, PNG
        and WebP. It is useful for combining scanned documents, photos,
        receipts, notes, forms and other images into a single PDF file.
      </p>

      <h2 className="mt-10 text-2xl font-black">
        How to convert JPG to PDF?
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        To convert JPG images to PDF, open the Images to PDF tool, select
        your JPG or JPEG files, upload them and start the conversion.
        PDFora creates a single PDF document from the selected images.
      </p>

      <h2 className="mt-10 text-2xl font-black">
        How to convert PNG to PDF?
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        Select one or more PNG images using the PDFora Images to PDF tool.
        After uploading the images, process them to create a PDF document
        that can be downloaded to your device.
      </p>

      <h2 className="mt-10 text-2xl font-black">
        Is PDFora Images to PDF free?
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        PDFora currently provides its available PDF tools without
        requiring a subscription. You can use the Images to PDF tool to
        convert supported image files into a PDF document.
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/pdf-to-jpg"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
        >
          <h3 className="font-black">PDF to JPG</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Convert PDF pages into JPG images.
          </p>

          <span className="mt-4 inline-block text-sm font-bold text-blue-600">
            Open tool →
          </span>
        </a>

        <a
          href="/merge-pdf"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
        >
          <h3 className="font-black">Merge PDF</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Combine multiple PDF files into one document.
          </p>

          <span className="mt-4 inline-block text-sm font-bold text-blue-600">
            Open tool →
          </span>
        </a>

        <a
          href="/compress-pdf"
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
        >
          <h3 className="font-black">Compress PDF</h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Reduce PDF file size for easier sharing and storage.
          </p>

          <span className="mt-4 inline-block text-sm font-bold text-blue-600">
            Open tool →
          </span>
        </a>
      </div>
    </div>
  </section>
</main>

);
}
