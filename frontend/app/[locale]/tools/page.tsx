import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  nepaliLocalizedCareerSlugs,
  nepaliLocalizedFinancialSlugs,
  nepaliLocalizedPublicInfoSlugs,
  nepaliLocalizedUtilitySlugs,
} from "../../../lib/i18n/nepali-tool-routes";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
  title: "नेपाली अनलाइन टुलहरूको सूची | PDFora",
  description: "PDF, नेपाली मिति, लेखन, गणना, वित्त, नेपालका उपयोगिता र करियरसम्बन्धी नेपाली इन्टरफेस भएका उपकरणहरू एउटै सूचीमा खोज्नुहोस्।",
  alternates: { canonical: "https://pd-fora.vercel.app/ne/tools" },
  robots: { index: false, follow: true },
};

const names: Record<string, string> = {
  "nepali-digit-converter":"नेपाली अंक रूपान्तरण","nepali-number-converter":"नेपाली संख्या रूपान्तरण","nepali-date-converter":"वि.सं. र ई.सं. मिति रूपान्तरण",
  "nepal-land-area-converter":"रोपनी–आना–पैसा–दाम रूपान्तरण","nepali-vat-calculator":"नेपाल VAT हिसाब","neb-gpa-calculator":"NEB GPA हिसाब",
  "word-character-counter":"शब्द तथा अक्षर गणक","case-converter":"अक्षर शैली रूपान्तरण","remove-duplicate-lines":"दोहोरो लाइन हटाउने","sort-lines":"लाइन क्रम मिलाउने",
  "reverse-text":"पाठ उल्ट्याउने","whitespace-cleaner":"खाली स्थान सफा गर्ने","character-frequency":"अक्षर आवृत्ति गणक","word-frequency-counter":"शब्द आवृत्ति गणक",
  "reading-time-calculator":"पढ्ने समय गणक","line-counter":"लाइन गणक","sentence-counter":"वाक्य गणक","email-extractor":"इमेल ठेगाना निकाल्ने",
  "url-extractor":"वेब ठेगाना निकाल्ने","phone-number-extractor":"फोन नम्बर निकाल्ने","number-extractor":"संख्या निकाल्ने","hashtag-extractor":"ह्यासट्याग निकाल्ने",
  "remove-duplicate-words":"दोहोरो शब्द हटाउने","find-replace-text":"पाठ खोज्ने र बदल्ने","palindrome-checker":"उल्टो पढ्दा उस्तै हुने शब्द जाँच","acronym-generator":"संक्षिप्त नाम बनाउने",
  "percentage-change-calculator":"प्रतिशत परिवर्तन हिसाब","average-calculator":"औसत हिसाब","ratio-simplifier":"अनुपात सरल बनाउने","fraction-calculator":"भिन्न हिसाब",
  "percentage-of-number-calculator":"संख्याको प्रतिशत हिसाब","gcd-lcm-calculator":"GCD तथा LCM हिसाब","prime-number-checker":"अभाज्य संख्या जाँच","unit-converter":"एकाइ रूपान्तरण",
  "age-calculator":"उमेर हिसाब","date-difference-calculator":"मिति अन्तर हिसाब","time-duration-calculator":"समय अवधि हिसाब","bmi-calculator":"BMI हिसाब",
  "bmr-calculator":"BMR हिसाब","tip-calculator":"टिप हिसाब","split-bill-calculator":"बिल बाँडफाँट","simple-interest-calculator":"साधारण ब्याज हिसाब",
  "profit-margin-calculator":"नाफा मार्जिन हिसाब","markup-calculator":"Markup हिसाब","break-even-calculator":"ब्रेक-इभेन हिसाब","sales-tax-calculator":"बिक्री कर हिसाब",
  "salary-breakdown-calculator":"तलब विवरण हिसाब","commission-calculator":"कमिसन हिसाब","hourly-to-salary-calculator":"घण्टाको ज्यालाबाट तलब हिसाब",
  "json-formatter-validator":"JSON ढाँचा तथा जाँच","base64-encoder-decoder":"Base64 रूपान्तरण","url-encoder-decoder":"URL Encode तथा Decode",
  "hash-generator":"Hash बनाउने","text-diff-checker":"दुई पाठ तुलना","lorem-ipsum-generator":"नमुना पाठ बनाउने","html-encoder-decoder":"HTML Encode तथा Decode",
  "text-to-slug":"पाठबाट URL Slug बनाउने","nepal-phone-validator":"नेपाल मोबाइल नम्बर जाँच","gold-tola-gram-converter":"तोला र ग्राम रूपान्तरण",
  "nepali-calendar":"नेपाली पात्रो","loksewa-photo-resizer":"लोकसेवा फोटो आकार मिलाउने","nepse-technical-analysis":"NEPSE प्राविधिक विश्लेषण",
  "nepal-forex-rates":"नेपाल राष्ट्र बैंक विनिमय दर","nepal-salary-tax-calculator":"नेपाल तलब तथा आयकर हिसाब",
  "nepse-dividend-calculator":"NEPSE लाभांश तथा बोनस शेयर हिसाब","nepse-market-news":"NEPSE तथा बजार समाचार",
  "loan-emi-calculator":"ऋण EMI हिसाब","compound-interest-sip-calculator":"चक्रवृद्धि ब्याज तथा SIP हिसाब","discount-percentage-calculator":"छुट प्रतिशत हिसाब",
  "nepal-electricity-bill-calculator":"विद्युत् बिल क्याल्कुलेटर","nepal-public-holidays-2083":"नेपालका सार्वजनिक बिदा २०८३",
  "ai-resume-writer":"AI रिजुमे लेखक","ai-cover-letter-generator":"AI कभर लेटर लेखक","ai-humanizer":"AI पाठ परिष्कार",
};

const pdfTools = [
  ["merge-pdf","PDF फाइल जोड्नुहोस्"],["split-pdf","PDF पृष्ठ छुट्याउनुहोस्"],["compress-pdf","PDF को आकार घटाउनुहोस्"],
  ["pdf-to-word","PDF लाई Word मा बदल्नुहोस्"],["pdf-to-jpg","PDF लाई JPG तस्बिरमा बदल्नुहोस्"],["rotate-pdf","PDF का पृष्ठ घुमाउनुहोस्"],
  ["reorder-pdf","PDF पृष्ठको क्रम मिलाउनुहोस्"],["images-to-pdf","तस्बिरबाट PDF बनाउनुहोस्"],["protect-pdf","PDF मा पासवर्ड राख्नुहोस्"],
] as const;

const groups = [
  { title: "नेपालका सेवा तथा वित्तीय उपकरण", slugs: [...nepaliLocalizedFinancialSlugs, ...nepaliLocalizedPublicInfoSlugs, "nepal-phone-validator", "gold-tola-gram-converter", "nepali-calendar"] },
  { title: "नेपाली लेखन तथा पाठ उपकरण", slugs: ["nepali-unicode-typing", ...nepaliLocalizedUtilitySlugs.filter((slug) => ["word-character-counter","case-converter","remove-duplicate-lines","sort-lines","reverse-text","whitespace-cleaner","character-frequency","word-frequency-counter","reading-time-calculator","line-counter","sentence-counter","email-extractor","url-extractor","phone-number-extractor","number-extractor","hashtag-extractor","remove-duplicate-words","find-replace-text","palindrome-checker","acronym-generator"].includes(slug))] },
  { title: "गणना तथा मिति उपकरण", slugs: nepaliLocalizedUtilitySlugs.filter((slug) => ["nepali-digit-converter","nepali-number-converter","nepali-date-converter","nepal-land-area-converter","nepali-vat-calculator","neb-gpa-calculator","percentage-change-calculator","average-calculator","ratio-simplifier","fraction-calculator","percentage-of-number-calculator","gcd-lcm-calculator","prime-number-checker","unit-converter","age-calculator","date-difference-calculator","time-duration-calculator","bmi-calculator","bmr-calculator","tip-calculator","split-bill-calculator","simple-interest-calculator","profit-margin-calculator","markup-calculator","break-even-calculator","sales-tax-calculator","salary-breakdown-calculator","commission-calculator","hourly-to-salary-calculator"].includes(slug)) },
  { title: "डेभलपर उपकरण", slugs: nepaliLocalizedUtilitySlugs.filter((slug) => ["json-formatter-validator","base64-encoder-decoder","url-encoder-decoder","hash-generator","text-diff-checker","lorem-ipsum-generator","html-encoder-decoder","text-to-slug"].includes(slug)) },
  { title: "करियर तथा AI उपकरण", slugs: [...nepaliLocalizedCareerSlugs] },
];

function ToolLink({ slug, title }: { slug: string; title?: string }) {
  return <Link href={slug === "nepse-technical-analysis" ? "/ne/nepse-technical-analysis" : slug.startsWith("nepali-janma") || slug === "nepali-guna-milan" ? `/ne/${slug}` : `/ne/tools/${slug}`} className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-sm">
    <span className="font-bold text-slate-900 group-hover:text-teal-800">{title ?? names[slug] ?? slug.replaceAll("-", " ")}</span>
    <span className="mt-2 block text-xs font-semibold text-teal-700">उपकरण खोल्नुहोस् →</span>
  </Link>;
}

export default async function NepaliToolsDirectory({ params }: Props) {
  const { locale } = await params;
  if (locale !== "ne") notFound();
  return <main lang="ne" className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6">
    <header className="mb-10">
      <p className="text-sm font-bold text-teal-700">PDFora · नेपाली टुल संग्रह</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">नेपालीमा उपलब्ध अनलाइन उपकरणहरू</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">PDF व्यवस्थापन, नेपालका दैनिक उपयोगिता, गणना, लेखन, मिति, वित्त र करियरसम्बन्धी उपकरणहरू यहाँबाट खोल्नुहोस्। हरेक उपकरणको नतिजा प्रयोग गर्नुअघि विवरण जाँच्नुहोस्; वित्तीय तथा शैक्षिक हिसाब अनुमानका लागि हुन्।</p>
    </header>
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-extrabold">PDF उपकरणहरू</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{pdfTools.map(([slug,title]) => <ToolLink key={slug} slug={slug} title={title}/>)}</div>
    </section>
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-extrabold">बजार तथा NEPSE विश्लेषण</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><ToolLink slug="nepse-technical-analysis" title="NEPSE प्राविधिक विश्लेषण"/></div>
    </section>
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-extrabold">जन्मकुण्डली तथा परम्परागत ज्योतिष</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ToolLink slug="nepali-janma-kundali" title="वैदिक जन्मकुण्डली"/>
        <ToolLink slug="nepali-guna-milan" title="३६ गुण मिलान"/>
      </div>
    </section>
    {groups.map((group) => <section className="mb-10" key={group.title}>
      <h2 className="mb-4 text-xl font-extrabold">{group.title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from(new Set(group.slugs)).map((slug) => <ToolLink key={slug} slug={slug}/>)}</div>
    </section>)}
    <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">सूचना: सबै उपकरणका प्रत्येक सहायक सन्देश र त्रुटि अझै पूर्ण रूपमा नेपालीमा नहुन सक्छन्। अपूर्ण अनुवाद भएका पृष्ठमा भाषा fallback स्पष्ट रूपमा देखाइन्छ।</p>
  </main>;
}
