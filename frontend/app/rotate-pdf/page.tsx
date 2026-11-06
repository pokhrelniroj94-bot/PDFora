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
    </main>
  );
}
