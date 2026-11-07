import Link from "next/link";
import { localizedOrFallbackPath } from "../lib/i18n/routing";

const pdfTools = [
  ["merge-pdf", "PDF जोड्नुहोस्", "धेरै PDF फाइललाई एउटै फाइलमा जोड्नुहोस्।"],
  ["split-pdf", "PDF छुट्याउनुहोस्", "PDF का पृष्ठ वा भाग छुट्टाछुट्टै निकाल्नुहोस्।"],
  ["compress-pdf", "PDF सानो बनाउनुहोस्", "साझा गर्न सजिलो हुने गरी PDF को आकार घटाउनुहोस्।"],
  ["rotate-pdf", "PDF घुमाउनुहोस्", "PDF का सबै पृष्ठको दिशा परिवर्तन गर्नुहोस्।"],
  ["pdf-to-word", "PDF बाट Word", "टेक्स्ट भएको PDF लाई सम्पादनयोग्य Word फाइलमा बदल्नुहोस्।"],
  ["pdf-to-jpg", "PDF बाट JPG", "PDF का पृष्ठलाई JPG तस्बिरका रूपमा डाउनलोड गर्नुहोस्।"],
] as const;

const faqs = [
  ["PDFora निःशुल्क हो?", "हाल उपलब्ध PDF टुलहरू सदस्यता बिना प्रयोग गर्न सकिन्छ।"],
  ["फाइलहरू कहाँ प्रक्रिया हुन्छन्?", "PDF प्रक्रिया गर्न फाइलहरू अस्थायी रूपमा PDFora को सुरक्षित ब्याकएन्डमा पठाइन्छन्।"],
  ["के मोबाइलबाट प्रयोग गर्न सकिन्छ?", "हो। PDFora मोबाइल, ट्याब्लेट र डेस्कटप ब्राउजरमा चल्ने गरी बनाइएको छ।"],
] as const;

export default function NepaliHomePage() {
  const fallback = (path: string) => localizedOrFallbackPath(path, "ne");
  return (
    <main id="main" lang="ne" dir="ltr" className="flex-1 bg-[#f5f7f6] text-slate-950">
      <section className="bg-[#071b1b] px-4 py-14 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold tracking-wide text-teal-200">PDFora — दैनिक डिजिटल टुलहरू</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">काम सजिलो बनाउने PDF र उपयोगी टुलहरू</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
            PDF सम्पादन, रूपान्तरण र नेपालका उपयोगी गणना टुलहरू एउटै सरल अनलाइन कार्यक्षेत्रमा प्रयोग गर्नुहोस्।
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#pdf-tools" className="rounded-2xl bg-teal-400 px-5 py-3 font-extrabold text-[#062321]">PDF टुलहरू हेर्नुहोस्</Link>
            <Link href={fallback("/tools")} className="rounded-2xl border border-white/20 px-5 py-3 font-bold text-white">सबै टुलहरू</Link>
          </div>
        </div>
      </section>

      <section id="pdf-tools" aria-labelledby="nepali-pdf-tools" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-xs font-black uppercase tracking-widest text-teal-700">अनुवादित PDF टुलहरू</p>
        <h2 id="nepali-pdf-tools" className="mt-2 text-3xl font-black">नेपालीमा उपलब्ध PDF टुलहरू</h2>
        <p className="mt-3 max-w-2xl text-slate-600">यी छ वटा PDF पृष्ठमा नाम, निर्देशन, फारम र प्रक्रिया सन्देश नेपालीमा समीक्षा गरिएका छन्।</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pdfTools.map(([slug, name, description]) => (
            <Link key={slug} href={`/ne/${slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300">
              <h3 className="font-extrabold text-slate-900">{name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              <span className="mt-4 inline-block text-sm font-bold text-teal-700">टुल खोल्नुहोस् →</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="nepali-more-tools" className="border-y border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 id="nepali-more-tools" className="text-2xl font-black">अन्य पृष्ठहरूबारे स्पष्ट जानकारी</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            अन्य PDF, क्याल्कुलेटर, बजार, AI र लेखसम्बन्धी पृष्ठहरू अझै पूर्ण नेपाली अनुवाद भएका छैनन्। तलको लिंकबाट अनुरोध गरिएको पृष्ठ सुरक्षित रूपमा हेर्न सकिन्छ; अनुवाद उपलब्ध नभए स्पष्ट fallback देखाइन्छ।
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={fallback("/tools")} className="rounded-xl border border-teal-200 px-4 py-2.5 font-bold text-teal-800">सबै टुलहरू</Link>
            <Link href={fallback("/blog")} className="rounded-xl border border-slate-300 px-4 py-2.5 font-bold text-slate-700">गाइड तथा लेखहरू</Link>
            <Link href={fallback("/about")} className="rounded-xl border border-slate-300 px-4 py-2.5 font-bold text-slate-700">PDFora बारेमा</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="nepali-faq" className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 id="nepali-faq" className="text-2xl font-black">सोधिने प्रश्नहरू</h2>
        <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {faqs.map(([question, answer]) => (
            <details key={question} className="p-5">
              <summary className="cursor-pointer font-bold">{question}</summary>
              <p className="mt-3 leading-7 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
