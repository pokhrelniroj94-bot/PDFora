import type { Metadata } from "next";
import MarketIntelligence from "../../../components/MarketIntelligence";

export const metadata: Metadata = {
  title: "NEPSE प्राविधिक विश्लेषण | PDFora",
  description: "उपलब्ध ऐतिहासिक NEPSE मूल्य तथ्याङ्कबाट प्रवृत्ति, RSI, EMA, MACD, अस्थिरता तथा समर्थन र प्रतिरोध स्तरको शैक्षिक विश्लेषण गर्नुहोस्।",
  alternates: { canonical: "https://pd-fora.vercel.app/ne/nepse-technical-analysis" },
  robots: { index: false, follow: true },
};

export default function NepaliNepseTechnicalAnalysisPage() {
  return <main lang="ne" className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 sm:px-6">
    <header className="mb-7">
      <p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली वित्तीय तथा बजार विश्लेषण</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">NEPSE प्राविधिक विश्लेषण</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">उपलब्ध ऐतिहासिक मूल्य तथ्याङ्कबाट प्रवृत्ति, RSI, EMA, MACD, अस्थिरता, जोखिम तथा समर्थन र प्रतिरोध स्तरको नियममा आधारित विश्लेषण गर्नुहोस्। तथ्याङ्क अपूर्ण, पुरानो वा अपर्याप्त भएमा विश्लेषण उपलब्ध नहुन सक्छ।</p>
      <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-900">यो शैक्षिक विश्लेषण उपकरण हो, व्यक्तिगत लगानी सल्लाह वा मूल्यको निश्चित भविष्यवाणी होइन। निर्णय गर्नुअघि आधिकारिक बजार स्रोत र आफ्नै जोखिम क्षमता जाँच्नुहोस्।</p>
    </header>
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-7">
      <MarketIntelligence />
    </section>
    <p className="mt-5 text-xs leading-6 text-slate-500">नोट: विश्लेषण इन्टरफेसका केही प्राविधिक शब्द हाल अंग्रेजीमा देखिन सक्छन्। तिनको नेपाली अनुवाद र प्रयोगकर्ता परीक्षण बाँकी छ।</p>
  </main>;
}
