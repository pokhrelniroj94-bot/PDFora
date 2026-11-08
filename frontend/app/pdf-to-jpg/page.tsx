import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";

export const metadata = getPdfToolMetadata("pdf-to-jpg");

import Niroj77Tool from "../../components/Niroj77Tool";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
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
    </div>
  );
}
