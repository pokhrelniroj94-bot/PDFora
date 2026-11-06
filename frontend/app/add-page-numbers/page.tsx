import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("add-page-numbers");

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Add Page Numbers</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Add page numbers to every page of your PDF.</p><div className="mt-8"><Niroj77Tool endpoint="/api/page-numbers" title="Add Page Numbers" description="Add page numbers to every page of your PDF." downloadName="PDFora-add-page-numbers.pdf"  extraFields={[{name:"position",label:"Position",defaultValue:"bottom-center"},{name:"start_number",label:"Starting number",defaultValue:"1"},{name:"skip_first",label:"Skip first page (true/false)",defaultValue:"false"},{name:"font_size",label:"Font size",defaultValue:"11"}]} /></div></div></main>;
}
