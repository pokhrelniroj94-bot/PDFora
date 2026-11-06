import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("add-background");

export default function Page() {
  const description = "Add a subtle text background such as DRAFT to every page of a PDF.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Add PDF Background</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/add-background" title="Add PDF Background" description={description} downloadName="PDFora-Background.pdf" extraFields={[{name:"text",label:"Background text",placeholder:"DRAFT",defaultValue:"DRAFT"},{name:"color",label:"Background color (preset)",placeholder:"#E5E7EB",defaultValue:"#E5E7EB"}]}/></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to use Add PDF Background</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload a PDF file (maximum 50 MB).</li><li>PDFora processes the document or extracts the available content.</li><li>Download the output file or ZIP archive.</li></ol><p className="mt-4 text-sm text-slate-600">Related tools: <a className="font-semibold text-teal-700 underline" href="/pdf-information">PDF Information</a>, <a className="font-semibold text-teal-700 underline" href="/extract-images">Extract Images</a> and <a className="font-semibold text-teal-700 underline" href="/pdf-to-text">PDF to Text</a>.</p></section></div></main>;
}
