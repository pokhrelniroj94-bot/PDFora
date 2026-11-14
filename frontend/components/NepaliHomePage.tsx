import Link from "next/link";
import { localizedOrFallbackPath } from "../lib/i18n/routing";
import { nepaliPdfRoutes } from "../lib/i18n/nepali-pdf-routes";
import { nepaliToolNames } from "../lib/i18n/pdf-tool-names-ne";
import { nepaliToolGuides } from "../lib/i18n/tool-guides-ne";

const pdfTools = Object.keys(nepaliPdfRoutes).map((slug) => ({
  slug,
  name: nepaliToolNames[slug],
  description: nepaliToolGuides[slug]?.purpose ?? "PDF कागजात व्यवस्थापनका लागि अनलाइन टुल।",
}));

const faqs = [
  ["PDFora निःशुल्क हो?", "हाल उपलब्ध PDF टुलहरू सदस्यता बिना प्रयोग गर्न सकिन्छ।"],
  ["फाइलहरू कहाँ प्रक्रिया हुन्छन्?", "PDF प्रक्रिया गर्न फाइलहरू अस्थायी रूपमा PDFora को सुरक्षित ब्याकएन्डमा पठाइन्छन्।"],
  ["के मोबाइलबाट प्रयोग गर्न सकिन्छ?", "हो। PDFora मोबाइल, ट्याब्लेट र डेस्कटप ब्राउजरमा चल्ने गरी बनाइएको छ।"],
] as const;

export default function NepaliHomePage() {
  const fallback = (path: string) => localizedOrFallbackPath(path, "ne");
  return (
    <main id="main" lang="ne" dir="ltr" className="nepali-home flex-1 text-slate-950">
      <section className="nepali-hero relative isolate overflow-hidden px-4 py-16 text-white sm:px-6 sm:py-24">
        <div className="nepali-hero-glow" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-3xl">
            <p className="nepali-eyebrow inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold tracking-wide">
              <span aria-hidden="true">✦</span> नेपालमैत्री डिजिटल कार्यक्षेत्र
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.15] sm:text-6xl">तपाईंको भाषा, तपाईंको काम — अब अझ सजिलो।</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-orange-50/85 sm:text-lg">
              PDF सम्पादनदेखि दैनिक हिसाबकिताबसम्म, नेपाली प्रयोगकर्ताका आवश्यकतासँग मिल्ने सरल र भरपर्दो अनलाइन टुलहरू।
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#pdf-tools" className="nepali-primary-cta rounded-2xl px-6 py-3.5 font-extrabold">PDF टुलहरू हेर्नुहोस् <span aria-hidden="true">↗</span></Link>
              <Link href={fallback("/tools")} className="nepali-secondary-cta rounded-2xl px-6 py-3.5 font-bold">सबै टुलहरू</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-orange-50/75">
              <span>✓ निःशुल्क प्रयोग</span><span>✓ मोबाइलमैत्री</span><span>✓ स्पष्ट नेपाली निर्देशन</span>
            </div>
          </div>
          <div className="nepali-mountain-card relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] p-5 sm:p-7" aria-label="हिमाल र नेपाली भू-दृश्यबाट प्रेरित सजावट">
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-extrabold tracking-widest text-orange-100/80">HIMALAYAN EDITION</span>
              <span className="nepali-sun" aria-hidden="true" />
            </div>
            <svg className="nepali-mountain-art relative z-10 mt-4 w-full" viewBox="0 0 440 250" role="img" aria-label="हिमालका चुचुरा र पहाडी तहहरूको चित्र">
              <path d="M0 190 85 78 135 135 218 34 315 154 360 100 440 190Z" fill="#e8e4d8"/>
              <path d="m85 78 26 34-26-8-25 31Zm133-44 37 53-39-19-28 19Zm142 66 24 34-27-12-18 18Z" fill="#fffaf0"/>
              <path d="M0 190 105 128 176 190 268 108 350 190 440 135 440 250 0 250Z" fill="#5b806c"/>
              <path d="M0 218 105 171 190 218 300 160 440 215 440 250 0 250Z" fill="#315a4a"/>
              <path d="M0 230Q105 195 210 230T440 220" fill="none" stroke="#d8a15d" strokeWidth="3" opacity=".9"/>
            </svg>
            <div className="relative z-10 mt-1 flex items-end justify-between border-t border-white/20 pt-4">
              <div><p className="text-2xl font-black">४९</p><p className="text-xs font-semibold text-orange-50/75">नेपाली PDF टुलहरू</p></div>
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-orange-50">नेपालीमै सेवा</span>
            </div>
          </div>
        </div>
        <div className="nepali-hero-ridge" aria-hidden="true" />
      </section>

      <section id="pdf-tools" aria-labelledby="nepali-pdf-tools" className="nepali-tools-section mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="nepali-section-kicker text-xs font-black tracking-widest">हाम्रो उपयोगी संग्रह</p>
        <h2 id="nepali-pdf-tools" className="mt-2 text-3xl font-black">नेपालीमा उपलब्ध PDF टुलहरू</h2>
        <p className="mt-3 max-w-2xl text-slate-600">यहाँ ४९ वटा PDF टुलका नेपाली नाम, मुख्य निर्देशन र प्रयोगका विकल्प उपलब्ध छन्। आफ्नो कामअनुसार टुल छानेर प्रयोग गर्नुहोस्।</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pdfTools.map(({ slug, name, description }) => (
            <Link key={slug} href={`/ne/${slug}`} className="nepali-tool-card group rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-1">
              <div className="mb-4 flex items-center justify-between"><span className="nepali-card-mark" aria-hidden="true">◈</span><span className="nepali-card-index text-xs font-bold">PDF TOOL</span></div><h3 className="font-extrabold">{name}</h3>
              <p className="mt-2 text-sm leading-6">{description}</p>
              <span className="nepali-card-link mt-4 inline-flex items-center gap-2 text-sm font-extrabold">टुल खोल्नुहोस् <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="nepali-more-tools" className="nepali-more-section border-y px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 id="nepali-more-tools" className="text-2xl font-black">अन्य पृष्ठहरूबारे स्पष्ट जानकारी</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            PDF टुलका थप विकल्प, नेपालका क्याल्कुलेटर, बजार र लेखहरू हेर्न सबै टुलको सूची खोल्नुहोस्। हरेक टुलमा उपलब्ध वास्तविक विकल्पअनुसार मात्र काम गर्नुहोस्।
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={fallback("/tools")} className="rounded-xl border border-teal-200 px-4 py-2.5 font-bold text-teal-800">सबै टुलहरू</Link>
            <Link href={fallback("/blog")} className="rounded-xl border border-slate-300 px-4 py-2.5 font-bold text-slate-700">गाइड तथा लेखहरू</Link>
            <Link href={fallback("/about")} className="rounded-xl border border-slate-300 px-4 py-2.5 font-bold text-slate-700">PDFora बारेमा</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="nepali-faq" className="nepali-faq-section mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 id="nepali-faq" className="text-2xl font-black">सोधिने प्रश्नहरू</h2>
        <div className="nepali-faq-list mt-5 divide-y rounded-2xl border">
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
