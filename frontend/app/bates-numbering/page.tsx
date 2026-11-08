import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("bates-numbering");

export default function Page() {
  const description = "Add sequential Bates numbers to every page of a PDF, with a custom prefix, starting number and digit length.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Bates Numbering PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/bates-numbering" title="Bates Numbering PDF" description={description} downloadName="PDFora-Bates-Numbered.pdf" extraFields={[{name:"prefix",label:"Prefix (optional)",placeholder:"CASE-",defaultValue:"CASE-"},{name:"start",label:"Starting number",placeholder:"1",defaultValue:"1"},{name:"digits",label:"Number of digits",placeholder:"6",defaultValue:"6"}]} /></div></div></main>;
}
