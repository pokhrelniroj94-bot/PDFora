import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("add-background");

export default function Page() {
  const description = "Add a subtle text background such as DRAFT to every page of a PDF.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Add PDF Background</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/add-background" title="Add PDF Background" description={description} downloadName="PDFora-Background.pdf" extraFields={[{name:"text",label:"Background text",placeholder:"DRAFT",defaultValue:"DRAFT"},{name:"color",label:"Background color (preset)",placeholder:"#E5E7EB",defaultValue:"#E5E7EB"}]}/></div></div></main>;
}
