import type { Metadata } from "next";
import KundaliTool from "../../components/KundaliTool";

export const metadata: Metadata = {
  title: "Nepali Janma Kundali | PDFora",
  description: "Create a traditional Vedic birth chart using birth date, local birth time and birthplace. Supports Nepali, Hindi and English.",
  alternates: { canonical: "https://pd-fora.vercel.app/nepali-janma-kundali" },
  robots: { index: false, follow: true },
};

export default function NepaliJanmaKundaliPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <KundaliTool />
        <p className="mx-auto mt-6 max-w-3xl text-xs leading-6 text-slate-600">
          Traditional astrology is a cultural and interpretive practice, not a scientifically validated prediction. Birth-time or birthplace errors can change chart calculations. Do not use this tool as the sole basis for medical, financial, marriage or other consequential decisions.
        </p>
      </div>
    </div>
  );
}
