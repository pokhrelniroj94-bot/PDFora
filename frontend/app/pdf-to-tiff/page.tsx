import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("pdf-to-tiff");

export default function Page() {
  const description = "Convert every page of a PDF into a TIFF image. Download all converted page images together in a ZIP archive.";
  return <section className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF to TIFF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/pdf-to-tiff" title="PDF to TIFF" description={description} downloadName="PDFora-TIFF-Pages.zip"  /></div></div></section>;
}
