import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("remove-annotations");

export default function Page() {
  const description = "Remove comments, highlights, sticky notes and other PDF annotations while keeping the page content.";
  return <section className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Remove PDF Annotations</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/remove-annotations" title="Remove PDF Annotations" description={description} downloadName="PDFora-Annotations-Removed.pdf" /></div></div></section>;
}
