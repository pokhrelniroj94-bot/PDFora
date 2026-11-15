import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("remove-pdf-metadata");

export default function Page() {
  const description = "Remove document properties such as title, author, subject, creator and keywords from a PDF file to help protect document privacy.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Remove PDF Metadata</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/remove-metadata" title="Remove PDF Metadata" description={description} downloadName="PDFora-Metadata-Removed.pdf" /></div></div></main>;
}
