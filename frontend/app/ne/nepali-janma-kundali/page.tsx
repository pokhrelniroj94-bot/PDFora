import type { Metadata } from "next";
import KundaliTool from "../../../components/KundaliTool";

export const metadata: Metadata = {
  title: "नेपाली जन्मकुण्डली | PDFora",
  description: "जन्म मिति, स्थानीय समय र जन्मस्थानका आधारमा परम्परागत वैदिक जन्मकुण्डली तयार गर्नुहोस्।",
  alternates: { canonical: "https://pd-fora.vercel.app/ne/nepali-janma-kundali" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-5 text-center text-2xl font-black">नेपाली जन्मकुण्डली</h1>
        <KundaliTool />
        <p className="mx-auto mt-6 max-w-4xl text-xs leading-6 text-slate-600">यो परम्परागत ज्योतिषीय गणना हो, वैज्ञानिक रूपमा प्रमाणित भविष्यवाणी होइन। फरक पञ्चाङ्ग वा परम्परामा विधि र व्याख्या फरक हुन सक्छ। महत्त्वपूर्ण जीवन, स्वास्थ्य, वित्त वा विवाहसम्बन्धी निर्णय यसैका आधारमा नगर्नुहोस्।</p>
      </div>
    </div>
  );
}
