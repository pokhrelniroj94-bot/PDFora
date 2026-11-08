import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("pdf-to-bmp");

export default function Page() {
  const description = "Convert each PDF page into a BMP image and download all pages in a ZIP archive.";
  return <section className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">PDF to BMP</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/pdf-to-bmp" title="PDF to BMP" description={description} downloadName="PDFora-BMP-Pages.zip" /></div></div></section>;
}
