import type { Metadata } from "next";
import Link from "next/link";

const site = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "निःशुल्क PDF उपकरण र नेपालका उपयोगी अनलाइन टुलहरू | PDFora",
  description: "PDF जोड्ने, छुट्याउने, कम्प्रेस गर्ने र रूपान्तरण गर्ने नेपाली अनलाइन टुलहरू। नेपाली मिति, मुद्रा विनिमय, कर, NEPSE र दैनिक उपयोगिताहरू एउटै ठाउँमा।",
  alternates: { canonical: `${site}/ne`, languages: { en: site, ne: `${site}/ne`, "x-default": site } },
  openGraph: { type: "website", title: "PDFora नेपाली — निःशुल्क PDF र दैनिक उपयोगी टुलहरू", description: "कागजात व्यवस्थापन, नेपालका गणना उपकरण र दैनिक डिजिटल कामका उपयोगी टुलहरू।", url: `${site}/ne`, siteName: "PDFora", locale: "ne_NP", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora नेपाली अनलाइन टुलहरू" }] },
  twitter: { card: "summary_large_image", title: "PDFora नेपाली — निःशुल्क अनलाइन टुलहरू", description: "PDF व्यवस्थापन र नेपालका उपयोगी अनलाइन उपकरणहरू।", images: ["/opengraph-image"] },
};

const pdfTools = [
  { href: "/ne/merge-pdf", title: "PDF फाइल जोड्नुहोस्", description: "धेरै PDF कागजातलाई एउटै फाइलमा मिलाउनुहोस्।" },
  { href: "/ne/split-pdf", title: "PDF पृष्ठ छुट्याउनुहोस्", description: "चाहिएका पृष्ठ वा पृष्ठ समूह छुट्टाछुट्टै फाइलमा निकाल्नुहोस्।" },
  { href: "/ne/compress-pdf", title: "PDF को आकार घटाउनुहोस्", description: "साझा गर्न वा भण्डारण गर्न सजिलो बनाउन PDF फाइल कम्प्रेस गर्नुहोस्।" },
  { href: "/ne/pdf-to-word", title: "PDF लाई Word मा बदल्नुहोस्", description: "समर्थित PDF बाट सम्पादन गर्न मिल्ने Word कागजात तयार गर्नुहोस्।" },
  { href: "/ne/pdf-to-jpg", title: "PDF लाई JPG तस्बिरमा बदल्नुहोस्", description: "PDF का पृष्ठलाई छुट्टाछुट्टै JPG तस्बिरका रूपमा निकाल्नुहोस्।" },
  { href: "/ne/rotate-pdf", title: "PDF का पृष्ठ घुमाउनुहोस्", description: "उल्टो वा तेर्सो भएका पृष्ठको दिशा मिलाउनुहोस्।" },
  { href: "/ne/reorder-pdf", title: "PDF पृष्ठको क्रम मिलाउनुहोस्", description: "कागजातका पृष्ठलाई आवश्यक क्रममा राख्नुहोस्।" },
  { href: "/ne/images-to-pdf", title: "तस्बिरबाट PDF बनाउनुहोस्", description: "समर्थित तस्बिरहरूलाई एउटै PDF कागजातमा राख्नुहोस्।" },
  { href: "/ne/protect-pdf", title: "PDF मा पासवर्ड राख्नुहोस्", description: "समर्थित PDF कागजातमा पासवर्ड सुरक्षा थप्नुहोस्।" },
];

const nepalTools = [
  { href: "/ne/nepali-janma-kundali", title: "वैदिक जन्मकुण्डली", description: "जन्म मिति, समय र स्थानका आधारमा परम्परागत कुण्डली विवरण तयार गर्नुहोस्। ज्योतिषीय व्याख्या निश्चित भविष्यवाणी होइन।" },
  { href: "/ne/nepali-guna-milan", title: "३६ गुण मिलान", description: "दुई जनाको जन्म विवरणबाट परम्परागत अष्टकूट गुण मिलान हेर्नुहोस्। यसलाई सम्बन्धको एकमात्र आधार नबनाउनुहोस्।" },
  { href: "/ne/tools/nepali-date-converter", title: "विक्रम संवत् मिति रूपान्तरण", description: "विक्रम संवत् (वि.सं.) र इस्वी संवत् (ई.सं.) बीच मिति परिवर्तन गर्नुहोस्।" },
  { href: "/ne/tools/nepali-unicode-typing", title: "नेपाली युनिकोड टाइपिङ", description: "रोमन अक्षरमा नेपाली लेखेर देवनागरी युनिकोड पाठ तयार गर्नुहोस्।" },
  { href: "/ne/tools/nepal-forex-rates", title: "नेपाल राष्ट्र बैंकको विनिमय दर", description: "उपलब्ध पछिल्लो प्रकाशित विदेशी मुद्रा खरिद तथा बिक्री दर हेर्नुहोस्।" },
  { href: "/ne/tools/nepal-salary-tax-calculator", title: "नेपाल तलब तथा आयकर हिसाब", description: "आम्दानीका आधारमा अनुमानित कर गणना गर्नुहोस्; अन्तिम कर निर्धारण होइन।" },
  { href: "/ne/tools/nepal-electricity-bill-calculator", title: "आधिकारिक ERC बिजुली बिल क्याल्कुलेटर", description: "विद्युत् नियमन आयोगको अद्यावधिक आधिकारिक क्याल्कुलेटर खोल्नुहोस्।" },
  { href: "/ne/tools/nepal-public-holidays-2083", title: "नेपालका सार्वजनिक बिदा २०८३", description: "२०८३ सालका राष्ट्रिय तथा क्षेत्रगत सार्वजनिक बिदाको विवरण हेर्नुहोस्।" },
  { href: "/ne/tools/nepse-technical-analysis", title: "NEPSE प्राविधिक विश्लेषण", description: "उपलब्ध बजार तथ्याङ्कका सूचक हेर्नुहोस्; कुनै पनि संकेत लगानीको सुनिश्चित सल्लाह होइन।" },
];

const faqs = [
  { q: "PDFora कसरी प्रयोग गर्ने?", a: "सबै टुलको सूचीबाट आवश्यक उपकरण छान्नुहोस्। टुलले मागेको फाइल वा विवरण दिनुहोस्, देखाइएको प्रक्रिया पूरा गर्नुहोस् र डाउनलोड गर्नुअघि नतिजा जाँच गर्नुहोस्। केही उपकरणमा फाइलको प्रकार वा आकारसम्बन्धी सीमा हुन सक्छ।" },
  { q: "के PDFora मोबाइल र कम्प्युटर दुवैमा चल्छ?", a: "PDFora आधुनिक मोबाइल, ट्याब्लेट र कम्प्युटर ब्राउजरमा प्रयोग गर्न मिल्ने गरी तयार गरिएको हो। ठूलो फाइल प्रशोधन गर्दा उपकरणको मेमोरी, इन्टरनेट र ब्राउजरअनुसार गति फरक हुन सक्छ।" },
  { q: "के सबै टुल पूर्ण रूपमा नेपाली भाषामा छन्?", a: "होमपेज र स्पष्ट रूपमा नेपालीमा समीक्षा गरिएका टुलहरू नेपालीमा उपलब्ध छन्। केही अन्य टुल वा लेखमा अंग्रेजी सामग्री बाँकी हुन सक्छ; त्यस्ता पृष्ठलाई पूर्ण नेपाली अनुवाद भएको भनेर दाबी गरिएको छैन।" },
  { q: "के क्याल्कुलेटरको नतिजा आधिकारिक हुन्छ?", a: "हुँदैन। कर, बिजुली, वित्त र बजारसम्बन्धी गणना जानकारी तथा अनुमानका लागि हुन्। नियम वा दर परिवर्तन हुन सक्छन्, त्यसैले महत्त्वपूर्ण विवरण सम्बन्धित आधिकारिक स्रोतबाट पुष्टि गर्नुहोस्।" },
  { q: "मेरो PDF नतिजा डाउनलोड गर्नुअघि के जाँच्नुपर्छ?", a: "पृष्ठको क्रम, अक्षर, तस्बिर, तालिका र फाइल खुल्ने अवस्था जाँच्नुहोस्। संवेदनशील वा कानुनी कागजात प्रयोग गर्नुअघि नतिजा मूल फाइलसँग तुलना गर्नुहोस्।" },
];

export default async function NepaliHomePage({ searchParams }: { searchParams?: Promise<{ from?: string }> }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "गृहपृष्ठ", item: `${site}/ne` },
    { "@type": "ListItem", position: 2, name: "नेपाली टुलहरू", item: `${site}/ne/tools` },
  ] };
  const pageSchema = { "@context": "https://schema.org", "@type": "WebPage", name: "PDFora नेपाली — निःशुल्क PDF र दैनिक उपयोगी अनलाइन टुलहरू", description: "PDF व्यवस्थापन, नेपाली मिति, वित्तीय गणना र नेपाल-केन्द्रित दैनिक डिजिटल उपकरणहरू।", url: `${site}/ne`, inLanguage: "ne-NP", isPartOf: { "@id": `${site}/#website` } };

  return <main lang="ne" className="min-h-screen bg-slate-50 text-slate-900">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/ne" className="flex items-center gap-3" aria-label="PDFora गृहपृष्ठ"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white">P</span><span className="text-xl font-black">PDFora</span></Link>
        <nav aria-label="मुख्य नेभिगेसन" className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          <Link href="/ne/tools" className="text-slate-700 hover:text-blue-700">सबै टुलहरू</Link>
          <Link href="/ne/blog" className="text-slate-700 hover:text-blue-700">मार्गदर्शिका</Link>
          <Link href="/" className="text-slate-600 hover:text-blue-700">English</Link>
        </nav>
      </div>
    </header>
    {resolvedSearchParams?.from && <div role="status" className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">तपाईंले खोज्नुभएको पृष्ठको पूर्ण नेपाली संस्करण अहिले उपलब्ध छैन। हाल उपलब्ध नेपाली पृष्ठ वा अङ्ग्रेजी संस्करण प्रयोग गर्नुहोस्।</div>}

    <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-bold tracking-wider text-blue-700">नेपाली भाषामा डिजिटल सहयोग</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">PDF र दैनिक कामका उपयोगी अनलाइन टुलहरू</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">कागजात जोड्ने, छुट्याउने, आकार घटाउने र रूपान्तरण गर्ने काम अनलाइनमै गर्नुहोस्। नेपाली मिति, युनिकोड टाइपिङ, विनिमय दर, कर तथा अन्य नेपाल-केन्द्रित उपयोगी उपकरण पनि एउटै ठाउँमा पाउनुहोस्।</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/ne/tools" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">सम्पूर्ण टुल सूची हेर्नुहोस्</Link>
          <Link href="/ne/merge-pdf" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-blue-500">PDF जोड्न सुरु गर्नुहोस्</Link>
        </div>
        <p className="mt-5 text-xs leading-6 text-slate-500">फाइल वा गणनाको नतिजा प्रयोग गर्नुअघि सधैँ आफैँ जाँच गर्नुहोस्। वित्तीय र ज्योतिषीय उपकरणका नतिजा निश्चित निर्णय वा भविष्यवाणी होइनन्।</p>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">लोकप्रिय PDF उपकरणहरू</h2><p className="mt-2 text-sm leading-7 text-slate-600">सामान्य कागजात व्यवस्थापन र रूपान्तरणका लागि उपयोगी उपकरणहरू।</p></div><Link href="/ne/tools" className="text-sm font-bold text-blue-700 underline underline-offset-4">सबै PDF टुल हेर्नुहोस्</Link></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{pdfTools.map((tool) => <Link key={tool.href} href={tool.href} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md"><h3 className="font-bold">{tool.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p><span className="mt-4 inline-block text-sm font-bold text-blue-700">उपकरण खोल्नुहोस् →</span></Link>)}</div>
    </section>

    <section className="border-y border-slate-200 bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl"><div className="mb-6"><h2 className="text-2xl font-black">नेपालका उपयोगी अनलाइन टुलहरू</h2><p className="mt-2 text-sm leading-7 text-slate-600">नेपालमा मिति, कर, बिजुली बिल, विनिमय दर र बजार जानकारीका लागि उपयोगी उपकरणहरू।</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{nepalTools.map((tool) => <Link key={tool.href} href={tool.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-400 hover:bg-white"><h3 className="font-bold">{tool.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p><span className="mt-4 inline-block text-sm font-bold text-blue-700">उपकरण खोल्नुहोस् →</span></Link>)}</div>
      </div>
    </section>

    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6"><h2 className="text-2xl font-black">PDFora कसरी प्रयोग गर्ने?</h2><p className="mt-2 text-sm leading-7 text-slate-600">केही सरल चरणमा आवश्यक उपकरण चलाउनुहोस्।</p></div>
      <ol className="grid gap-4 sm:grid-cols-3">
        <li className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-sm font-black text-blue-700">१</span><h3 className="mt-2 font-bold">उपकरण छान्नुहोस्</h3><p className="mt-2 text-sm leading-6 text-slate-600">सबै टुलको सूचीबाट आफ्नो कामसँग मिल्ने उपकरण खोल्नुहोस्।</p></li>
        <li className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-sm font-black text-blue-700">२</span><h3 className="mt-2 font-bold">फाइल वा विवरण दिनुहोस्</h3><p className="mt-2 text-sm leading-6 text-slate-600">स्क्रिनमा देखिएका निर्देशनअनुसार फाइल छान्नुहोस् वा आवश्यक विवरण भर्नुहोस्।</p></li>
        <li className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-sm font-black text-blue-700">३</span><h3 className="mt-2 font-bold">नतिजा जाँच्नुहोस्</h3><p className="mt-2 text-sm leading-6 text-slate-600">डाउनलोड वा प्रयोग गर्नुअघि फाइल र गणनाको नतिजा आफैँ पुष्टि गर्नुहोस्।</p></li>
      </ol>
    </section>

    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h2 className="text-2xl font-black">सोधिने प्रश्नहरू</h2>
      <div className="mt-5 space-y-3">{faqs.map((faq) => <details key={faq.q} className="rounded-xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-bold">{faq.q}</summary><p className="mt-3 text-sm leading-7 text-slate-600">{faq.a}</p></details>)}</div>
    </section>

    <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-center text-sm text-slate-300">
      <p>© 2026 PDFora — उपयोगी अनलाइन टुलहरू</p>
      <nav aria-label="फुटर नेभिगेसन" className="mt-3 flex flex-wrap justify-center gap-4">
        <Link href="/ne/tools" className="underline underline-offset-4">सबै टुलहरू</Link><Link href="/ne/blog" className="underline underline-offset-4">गाइड तथा ट्युटोरियल</Link><Link href="/ne/about" className="underline underline-offset-4">PDFora बारेमा</Link><Link href="/ne/contact" className="underline underline-offset-4">सम्पर्क</Link><Link href="/ne/privacy" className="underline underline-offset-4">गोपनीयता नीति</Link><Link href="/ne/terms" className="underline underline-offset-4">सेवाका सर्तहरू</Link><Link href="/" className="underline underline-offset-4">English</Link>
      </nav>
    </footer>
  </main>;
}
