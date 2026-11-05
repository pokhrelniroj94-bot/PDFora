import Link from "next/link";
import ToolDirectory from "./ToolDirectory";

const site = "https://pd-fora.vercel.app";

const tools = [
  { href: "/merge-pdf", title: "PDF जोड्नुहोस् (Merge PDF)", description: "धेरै PDF फाइललाई एउटै कागजातमा जोड्नुहोस्।" },
  { href: "/split-pdf", title: "PDF छुट्याउनुहोस् (Split PDF)", description: "PDF का पृष्ठ वा पृष्ठ समूह छुट्टाछुट्टै बनाउनुहोस्।" },
  { href: "/compress-pdf", title: "PDF सानो बनाउनुहोस्", description: "अपलोड वा इमेलका लागि PDF फाइलको आकार घटाउनुहोस्।" },
  { href: "/pdf-to-word", title: "PDF बाट Word", description: "समर्थित PDF बाट सम्पादन गर्न मिल्ने Word फाइल बनाउनुहोस्।" },
  { href: "/pdf-to-jpg", title: "PDF बाट JPG", description: "PDF का पृष्ठलाई JPG image मा बदल्नुहोस्।" },
  { href: "/images-to-pdf", title: "Image बाट PDF", description: "JPG, PNG र WebP तस्बिरलाई PDF मा राख्नुहोस्।" },
];

const nepalTools = [
  { href: "/tools/nepali-date-converter", title: "नेपाली मिति रूपान्तरण", description: "विक्रम संवत् र इस्वी संवत् मिति रूपान्तरण गर्नुहोस्।" },
  { href: "/tools/nepali-unicode-typing", title: "नेपाली Unicode Typing", description: "Romanized Nepali लेखेर देवनागरी Unicode text बनाउनुहोस्।" },
  { href: "/tools/nepal-forex-rates", title: "नेपाल राष्ट्र बैंक विनिमय दर", description: "उपलब्ध पछिल्लो प्रकाशित विदेशी मुद्रा दर हेर्नुहोस्।" },
  { href: "/tools/nepal-salary-tax-calculator", title: "नेपाल तलब कर क्याल्कुलेटर", description: "आयकरको अनुमानित हिसाब गर्नुहोस्; नतिजा आधिकारिक कर निर्धारण होइन।" },
  { href: "/tools/nepal-electricity-bill-calculator", title: "NEA बिजुली बिल अनुमान", description: "समर्थित घरेलु single-phase जडानका लागि बिल अनुमान गर्नुहोस्।" },
  { href: "/tools/nepal-public-holidays-2083", title: "नेपालका सार्वजनिक बिदा २०८३", description: "राष्ट्रिय र क्षेत्रगत सार्वजनिक बिदा हेर्नुहोस्।" },
];

const faqs = [
  { q: "PDFora कसरी प्रयोग गर्ने?", a: "आफूलाई चाहिएको टुल छान्नुहोस्, आवश्यक फाइल वा विवरण दिनुहोस्, प्रक्रिया पूरा भएपछि नतिजा जाँचेर डाउनलोड गर्नुहोस्।" },
  { q: "के PDFora मोबाइलमा चल्छ?", a: "आधुनिक मोबाइल ब्राउजरबाट उपलब्ध टुलहरू प्रयोग गर्न सकिन्छ। फाइल छनोट र डाउनलोड गर्ने तरिका डिभाइसअनुसार फरक हुन सक्छ।" },
  { q: "के क्याल्कुलेटरको नतिजा आधिकारिक हुन्छ?", a: "हुँदैन। कर, बिजुली वा वित्तीय नतिजा अनुमानका लागि हुन्। महत्त्वपूर्ण निर्णय गर्नुअघि सम्बन्धित आधिकारिक निकायसँग पुष्टि गर्नुहोस्।" },
];

export default function NepaliHomePage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site },
      { "@type": "ListItem", position: 2, name: "नेपाली", item: `${site}/ne` },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main lang="ne" className="min-h-screen bg-slate-50 text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/ne" aria-current="page" className="flex items-center gap-3" aria-label="PDFora नेपाली गृहपृष्ठ">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white">P</span>
            <span className="text-xl font-black">PDFora</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm font-semibold">
            <Link href="/" className="text-slate-600 hover:text-blue-700">English</Link>
            <Link href="/tools" className="rounded-xl bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700">सबै टुलहरू</Link>
          </nav>
        </div>
      </header>

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">PDFora नेपाली</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">PDF र दैनिक कामका उपयोगी अनलाइन टुलहरू</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">PDF फाइल जोड्ने, छुट्याउने, सानो बनाउने र रूपान्तरण गर्ने काम गर्नुहोस्। नेपाली मिति, Unicode typing, विनिमय दर र अन्य नेपाल-केन्द्रित टुलहरू पनि प्रयोग गर्नुहोस्।</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/tools" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">सबै अनलाइन टुल हेर्नुहोस्</Link>
            <Link href="/merge-pdf" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-blue-500">PDF जोड्न सुरु गर्नुहोस्</Link>
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


      <ToolDirectory />
    </main>
  );
}
