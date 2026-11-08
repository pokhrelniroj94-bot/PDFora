import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("remove-pdf-links");

export default function Page() {
  const description = "Remove clickable hyperlinks from PDF pages while keeping the visible page content intact.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Remove PDF Links</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/remove-links" title="Remove PDF Links" description={description} downloadName="PDFora-Links-Removed.pdf" /></div></div></main>;
}
