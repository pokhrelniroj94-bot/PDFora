import Link from "next/link";
import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import { getRequiredToolGuide } from "../../lib/tool-guides";
import Niroj77Tool from "../../components/Niroj77Tool";
import ToolGuide from "../../components/ToolGuide";

const guide = getRequiredToolGuide("rotate-pdf");
export const metadata = getPdfToolMetadata("rotate-pdf");

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Rotate PDF Pages Online</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">Rotate PDF pages by 90, 180 or 270 degrees to correct sideways or upside-down pages. Select the rotation angle, process your file and inspect the downloaded PDF.</p>
        </header>
        <Niroj77Tool
          endpoint="/api/rotate"
          title="Rotate PDF Online"
          description="Rotate PDF pages online by 90, 180, or 270 degrees and download the corrected PDF quickly and easily."
          multiple={false}
          accept="application/pdf,.pdf"
          downloadName="PDFora-Rotated.pdf"
          queryField="degrees"
          queryDefault="90"
        />
      </section>
      <ToolGuide guide={guide} />
      <section className="mx-auto max-w-4xl px-4 pb-14 sm:px-6">
        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <section>
            <h2 className="text-2xl font-black">Choose the correct PDF rotation angle</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">Use 90° or 270° to turn a sideways page into portrait or landscape orientation. Use 180° when a page is upside down. The correct direction depends on how the source page is currently positioned, so inspect the downloaded result before replacing your original.</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
              <li><strong>90°:</strong> quarter-turn clockwise.</li>
              <li><strong>180°:</strong> half-turn to correct an upside-down page.</li>
              <li><strong>270°:</strong> quarter-turn in the opposite direction.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-black">How to rotate a PDF online</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
              <li>Choose a PDF file from your device and upload it to the Rotate PDF tool above.</li>
              <li>Select the angle that corrects the current page orientation.</li>
              <li>Run the rotation and download the processed PDF.</li>
              <li>Open the result in a PDF reader and check the first, middle and last pages, including any pages that were already landscape.</li>
            </ol>
          </section>
          <section>
            <h2 className="text-2xl font-black">Rotate every page or only selected pages?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">Rotate PDF applies the selected angle across the document. This is useful when every scanned page was saved in the wrong orientation. If a report contains a mixture of correctly oriented pages and a few sideways pages, use <Link className="font-semibold text-teal-700 underline" href="/rotate-selected-pages">Rotate Selected Pages</Link> instead, then verify that unchanged pages keep their original orientation. For a step-by-step walkthrough, see the <Link className="font-semibold text-teal-700 underline" href="/blog/rotate-pdf-guide-online">Rotate PDF guide</Link>.</p>
          </section>
          <section>
            <h2 className="text-2xl font-black">PDF rotation: common questions</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
              <div><h3 className="font-bold text-slate-900">Does rotating a PDF change its text?</h3><p>Rotation changes the page orientation, not the wording. Still inspect forms, annotations, signatures and page layout after processing.</p></div>
              <div><h3 className="font-bold text-slate-900">Can I rotate only one page?</h3><p>Use the selected-pages tool when only some pages need a correction. This page is intended for rotating the document pages together.</p></div>
              <div><h3 className="font-bold text-slate-900">Will the rotation reduce PDF quality?</h3><p>Page rotation normally changes orientation rather than intentionally reducing image resolution. Check the output file and keep an untouched original copy.</p></div>
              <div><h3 className="font-bold text-slate-900">What should I do if a page turns the wrong way?</h3><p>Try the opposite quarter-turn angle, download a fresh result from the original file and review all pages before sharing it.</p></div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
