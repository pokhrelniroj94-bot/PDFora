import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("add-blank-pages");

export default function Page() {
  const description = "Add one or more blank pages to the end of your PDF. The new pages use the dimensions of the last page in your document.";
  return <section className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Add Blank Pages to PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/add-blank-pages" title="Add Blank Pages" description={description} downloadName="PDFora-Blank-Pages-Added.pdf" extraFields={[{name:"count",label:"Number of blank pages to add",placeholder:"1",defaultValue:"1"}]} /></div></div></section>;
}
