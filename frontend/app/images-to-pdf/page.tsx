import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";

export const metadata = getPdfToolMetadata("images-to-pdf");

import Niroj77Tool from "../../components/Niroj77Tool";

export default function Page() {
return ( <div className="min-h-screen bg-slate-50 text-slate-950">
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
    </div>
  );
}
