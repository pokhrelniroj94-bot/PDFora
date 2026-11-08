import type { Metadata } from "next";
import GunaMilanTool from "../../components/GunaMilanTool";

export const metadata: Metadata = {
  title: "Traditional 36 Guna Milan | PDFora",
  description: "Compare two birth charts using a documented traditional Ashtakoota 36-guna calculation in Nepali, Hindi and English.",
  alternates: { canonical: "https://pd-fora.vercel.app/nepali-guna-milan" },
  robots: { index: false, follow: true },
};

export default function NepaliGunaMilanPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-5 text-center text-2xl font-black">परम्परागत ३६ गुण मिलान</h1>
        <GunaMilanTool />
        <p className="mx-auto mt-6 max-w-4xl text-xs leading-6 text-slate-600">
          This calculator implements a documented traditional Ashtakoota reference table. Practices and interpretations differ across regional traditions; the score is not a scientific compatibility test and should not determine a marriage or relationship decision on its own.
        </p>
      </div>
    </div>
  );
}
