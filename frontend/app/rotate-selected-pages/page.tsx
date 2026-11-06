import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("rotate-selected-pages");

export default function Page() {
  const description = "Rotate only the pages you choose. Enter page numbers separated by commas, such as 1,3,5, or enter all to rotate every page.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Rotate Selected PDF Pages</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/rotate-selected-pages" title="Rotate Selected Pages" description={description} downloadName="PDFora-Rotated-Selected-Pages.pdf" extraFields={[{name:"pages",label:"Pages to rotate (e.g. 1,3,5 or all)",placeholder:"1,3,5",defaultValue:"all"},{name:"degrees",label:"Rotation degrees (90, 180 or 270)",placeholder:"90",defaultValue:"90"}]} /></div><section className="mt-10 rounded-2xl bg-white p-6"><h2 className="text-xl font-bold">How to rotate selected PDF pages</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600"><li>Upload your PDF.</li><li>Enter page numbers separated by commas, or use all.</li><li>Choose 90, 180 or 270 degrees and process the file.</li></ol><p className="mt-4 text-sm text-slate-600">For rotating every page with the standard workflow, use <a className="font-semibold text-teal-700 underline" href="/rotate-pdf">Rotate PDF</a>. You can also <a className="font-semibold text-teal-700 underline" href="/reorder-pdf">reorder PDF pages</a>.</p></section></div></main>;
}
