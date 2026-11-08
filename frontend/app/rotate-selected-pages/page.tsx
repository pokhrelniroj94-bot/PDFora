import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import PDForaTool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("rotate-selected-pages");

export default function Page() {
  const description = "Rotate only the pages you choose. Enter page numbers separated by commas, such as 1,3,5, or enter all to rotate every page.";
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Rotate Selected PDF Pages</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">{description}</p><div className="mt-8"><PDForaTool endpoint="/api/rotate-selected-pages" title="Rotate Selected Pages" description={description} downloadName="PDFora-Rotated-Selected-Pages.pdf" extraFields={[{name:"pages",label:"Pages to rotate (e.g. 1,3,5 or all)",placeholder:"1,3,5",defaultValue:"all"},{name:"degrees",label:"Rotation degrees (90, 180 or 270)",placeholder:"90",defaultValue:"90"}]} /></div></div></main>;
}
