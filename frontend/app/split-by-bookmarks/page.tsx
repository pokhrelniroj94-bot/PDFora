import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("split-by-bookmarks");

export default function Page() {
  const description = "Split a bookmarked PDF into separate PDF files using its existing bookmark destinations. Download the sections in a ZIP archive.";
  return <section className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Split PDF by Bookmarks</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/split-by-bookmarks" title="Split PDF by Bookmarks" description={description} downloadName="PDFora-Bookmark-Sections.zip" /></div></div></section>;
}
