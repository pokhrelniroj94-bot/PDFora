import type { Metadata } from "next";
import Link from "next/link";

const site = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "नि:शुल्क PDF उपकरण र नेपालका अनलाइन टुलहरू",
  description: "PDF मर्ज, स्प्लिट, कम्प्रेस र रूपान्तरण गर्नुहोस्। नेपाली मिति, Unicode typing, विदेशी विनिमय दर र अन्य उपयोगी नेपाल टुलहरू प्रयोग गर्नुहोस्।",
  alternates: { canonical: `${site}/ne`, languages: { en: site, ne: `${site}/ne`, "x-default": site } },
  openGraph: {
    type: "website",
    title: "PDFora नेपाली — PDF Tools र नेपालका उपयोगी टुलहरू",
    description: "PDF सम्बन्धी काम र नेपालका दैनिक उपयोगी अनलाइन टुलहरू एउटै ठाउँमा।",
    url: `${site}/ne`,
    siteName: "PDFora",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora नेपाली अनलाइन टुलहरू" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFora नेपाली — नि:शुल्क अनलाइन टुलहरू",
    description: "PDF मर्ज, कम्प्रेस, रूपान्तरण र नेपालका उपयोगी टुलहरू।",
    images: ["/opengraph-image"],
  },
};

const tools = [
  { href: "/ne/merge-pdf", title: "PDF जोड्नुहोस् (Merge PDF)", description: "धेरै PDF फाइललाई एउटै कागजातमा जोड्नुहोस्।" },
  { href: "/ne/split-pdf", title: "PDF छुट्याउनुहोस् (Split PDF)", description: "PDF का पृष्ठ वा पृष्ठ समूह छुट्टाछुट्टै बनाउनुहोस्।" },
  { href: "/ne/compress-pdf", title: "PDF सानो बनाउनुहोस्", description: "अपलोड वा इमेलका लागि PDF फाइलको आकार घटाउनुहोस्।" },
  { href: "/ne/pdf-to-word", title: "PDF बाट Word", description: "समर्थित PDF बाट सम्पादन गर्न मिल्ने Word फाइल बनाउनुहोस्।" },
  { href: "/ne/pdf-to-jpg", title: "PDF बाट JPG", description: "PDF का पृष्ठलाई JPG image मा बदल्नुहोस्।" },
  { href: "/ne/rotate-pdf", title: "PDF पृष्ठ घुमाउनुहोस्", description: "गलत दिशामा भएका PDF पृष्ठलाई सही दिशामा घुमाउनुहोस्।" },
];

const nepalTools = [
  { href: "/ne/tools/nepali-date-converter", title: "नेपाली मिति रूपान्तरण", description: "विक्रम संवत् र इस्वी संवत् मिति रूपान्तरण गर्नुहोस्।" },
  { href: "/ne/tools/nepali-unicode-typing", title: "नेपाली Unicode Typing", description: "Romanized Nepali लेखेर देवनागरी Unicode text बनाउनुहोस्।" },
  { href: "/ne/tools/nepal-forex-rates", title: "नेपाल राष्ट्र बैंक विनिमय दर", description: "उपलब्ध पछिल्लो प्रकाशित विदेशी मुद्रा दर हेर्नुहोस्।" },
  { href: "/ne/tools/nepal-salary-tax-calculator", title: "नेपाल तलब कर क्याल्कुलेटर", description: "आयकरको अनुमानित हिसाब गर्नुहोस्; नतिजा आधिकारिक कर निर्धारण होइन।" },
  { href: "/ne/tools/nepal-electricity-bill-calculator", title: "आधिकारिक ERC बिजुली बिल क्याल्कुलेटर", description: "अद्यावधिक महसुल र जडान विवरणसहित ERC को आधिकारिक क्याल्कुलेटर खोल्नुहोस्।" },
  { href: "/ne/tools/nepal-public-holidays-2083", title: "नेपालका सार्वजनिक बिदा २०८३", description: "राष्ट्रिय र क्षेत्रगत सार्वजनिक बिदा हेर्नुहोस्।" },
];

const faqs = [
  { q: "PDFora कसरी प्रयोग गर्ने?", a: "आफूलाई चाहिएको टुल छान्नुहोस्, आवश्यक फाइल वा विवरण दिनुहोस्, प्रक्रिया पूरा भएपछि नतिजा जाँचेर डाउनलोड गर्नुहोस्।" },
  { q: "के PDFora मोबाइलमा चल्छ?", a: "आधुनिक मोबाइल ब्राउजरबाट उपलब्ध टुलहरू प्रयोग गर्न सकिन्छ। फाइल छनोट र डाउनलोड गर्ने तरिका डिभाइसअनुसार फरक हुन सक्छ।" },
  { q: "के क्याल्कुलेटरको नतिजा आधिकारिक हुन्छ?", a: "हुँदैन। कर, बिजुली वा वित्तीय नतिजा अनुमानका लागि हुन्। महत्त्वपूर्ण निर्णय गर्नुअघि सम्बन्धित आधिकारिक निकायसँग पुष्टि गर्नुहोस्।" },
];

export default async function NepaliHomePage({ searchParams }: { searchParams?: Promise<{ from?: string }> }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "गृहपृष्ठ", item: `${site}/ne` },
      { "@type": "ListItem", position: 2, name: "नेपाली", item: `${site}/ne` },
    ],
  };
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "PDFora नेपाली — PDF र दैनिक कामका उपयोगी अनलाइन टुलहरू",
    description: "PDF मर्ज, स्प्लिट, कम्प्रेस र रूपान्तरण गर्नुहोस्। नेपाली मिति र नेपालका उपयोगी अनलाइन टुलहरू प्रयोग गर्नुहोस्।",
    url: `${site}/ne`,
    inLanguage: "ne-NP",
    isPartOf: { "@id": `${site}/#website` },
  };

  return (
    <main lang="ne" className="min-h-screen bg-slate-50 text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/ne" className="flex items-center gap-3" aria-label="PDFora गृहपृष्ठ">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white">P</span>
            <span className="text-xl font-black">PDFora</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm font-semibold">
            <Link href="/" className="text-slate-600 hover:text-blue-700">English</Link>
            <Link href="/ne/tools" className="rounded-xl bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700">सबै टुलहरू</Link>
          </nav>
        </div>
      </header>
      {resolvedSearchParams?.from && (
        <div role="status" className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
          यो पृष्ठको नेपाली अनुवाद अझै उपलब्ध छैन। तपाईंलाई नेपाली होमपेज देखाइएको छ; अनुवाद उपलब्ध भएका पृष्ठहरूबाट मात्र भाषा परिवर्तन गर्दा उही पृष्ठ कायम रहन्छ।
        </div>
      )}

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">PDFora नेपाली</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">PDF र दैनिक कामका उपयोगी अनलाइन टुलहरू</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">PDF फाइल जोड्ने, छुट्याउने, सानो बनाउने र रूपान्तरण गर्ने काम गर्नुहोस्। नेपाली मिति, Unicode typing, विनिमय दर र अन्य नेपाल-केन्द्रित टुलहरू पनि प्रयोग गर्नुहोस्।</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/ne/tools" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">सबै अनलाइन टुल हेर्नुहोस्</Link>
            <Link href="/ne/merge-pdf" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-blue-500">PDF जोड्न सुरु गर्नुहोस्</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-black">लोकप्रिय PDF टुलहरू</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">आफ्नो कामअनुसार टुल छान्नुहोस्। नतिजा डाउनलोड गर्नुअघि फाइल जाँच गर्नुहोस्।</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md">
              <h3 className="font-bold">{tool.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
              <span className="mt-4 inline-block text-sm font-bold text-blue-700">टुल खोल्नुहोस् →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black">नेपालका उपयोगी अनलाइन टुलहरू</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">नेपालमा मिति, कर, बिजुली बिल र अन्य दैनिक कामका लागि उपयोगी टुलहरू।</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nepalTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-400 hover:bg-white">
                <h3 className="font-bold">{tool.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
                <span className="mt-4 inline-block text-sm font-bold text-blue-700">टुल खोल्नुहोस् →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-black">सोधिने प्रश्नहरू</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="rounded-xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer font-bold">{faq.q}</summary>
              <p className="mt-3 text-sm leading-7 text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-center text-sm text-slate-300">
        <p>© 2026 PDFora — उपयोगी अनलाइन टुलहरू</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link href="/ne/privacy" className="underline underline-offset-4">गोपनीयता नीति</Link>
          <Link href="/ne/terms" className="underline underline-offset-4">सेवाका सर्तहरू</Link>
          <Link href="/" className="underline underline-offset-4">English</Link>
        </div>
      </footer>
    </main>
  );
}
