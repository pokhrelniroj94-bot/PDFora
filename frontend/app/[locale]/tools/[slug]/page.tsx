import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolWorkspace from "../../../../components/AllTools";
import { isPublished } from "../../../../lib/i18n/config";
import { getTranslator } from "../../../../lib/i18n/messages";
import { buildLocalizedToolMetadata, localizedToolNotFoundMetadata } from "../../../../lib/tools/localized-metadata";
import { resolveLocalizedToolRequest } from "../../../../lib/tools/localized-route";
import NepaliUtilityWorkspace from "../../../../components/NepaliUtilityWorkspace";
import NepaliTextUtilityWorkspace from "../../../../components/NepaliTextUtilityWorkspace";
import NepaliMathUtilityWorkspace from "../../../../components/NepaliMathUtilityWorkspace";
import NepaliDateTimeWorkspace from "../../../../components/NepaliDateTimeWorkspace";
import NepaliDeveloperTextWorkspace from "../../../../components/NepaliDeveloperTextWorkspace";
import NepalLiveTools from "../../../../components/NepalLiveTools";
import NepaliFinanceCalculatorWorkspace from "../../../../components/NepaliFinanceCalculatorWorkspace";
import AIWritingTools from "../../../../components/AIWritingTools";
import { nepaliLocalizedFinancialSlugs, nepaliLocalizedUtilitySlugs } from "../../../../lib/i18n/nepali-tool-routes";
import { nepaliLocalizedCareerSlugs } from "../../../../lib/i18n/nepali-tool-routes";

type Props = { params: Promise<{ locale: string; slug: string }> };
const nepaliTitles: Record<string, string> = {
  "nepali-digit-converter": "नेपाली अंक रूपान्तरण",
  "nepali-number-converter": "नेपाली नम्बर रूपान्तरण",
  "nepali-date-converter": "नेपाली मिति रूपान्तरण",
  "nepal-land-area-converter": "रोपनी आना क्षेत्रफल रूपान्तरण",
  "nepali-vat-calculator": "नेपाल VAT क्याल्कुलेटर",
  "neb-gpa-calculator": "NEB GPA क्याल्कुलेटर",
  "word-character-counter": "शब्द तथा अक्षर गणक",
  "case-converter": "अक्षर शैली रूपान्तरण",
  "remove-duplicate-lines": "दोहोरो लाइन हटाउने",
  "sort-lines": "लाइन क्रम मिलाउने",
  "reverse-text": "पाठ उल्ट्याउने",
  "whitespace-cleaner": "खाली स्थान सफा गर्ने",
  "character-frequency": "अक्षर आवृत्ति गणक",
  "word-frequency-counter": "शब्द आवृत्ति गणक",
  "reading-time-calculator": "पढ्ने समय गणक",
  "line-counter": "लाइन गणक",
  "sentence-counter": "वाक्य गणक",
  "percentage-change-calculator": "प्रतिशत परिवर्तन क्याल्कुलेटर",
  "average-calculator": "औसत क्याल्कुलेटर",
  "ratio-simplifier": "अनुपात सरल बनाउने",
  "fraction-calculator": "भिन्न क्याल्कुलेटर",
  "percentage-of-number-calculator": "संख्याको प्रतिशत क्याल्कुलेटर",
  "gcd-lcm-calculator": "GCD तथा LCM क्याल्कुलेटर",
  "prime-number-checker": "अभाज्य संख्या जाँच",
  "unit-converter": "एकाइ रूपान्तरण",
  "age-calculator": "उमेर क्याल्कुलेटर",
  "date-difference-calculator": "मिति अन्तर क्याल्कुलेटर",
  "time-duration-calculator": "समय अवधि क्याल्कुलेटर",
  "bmi-calculator": "BMI क्याल्कुलेटर",
  "bmr-calculator": "BMR क्याल्कुलेटर",
  "tip-calculator": "टिप क्याल्कुलेटर",
  "split-bill-calculator": "बिल बाँडफाँट क्याल्कुलेटर",
  "simple-interest-calculator": "साधारण ब्याज क्याल्कुलेटर",
  "json-formatter-validator": "JSON फर्म्याट तथा जाँच",
  "base64-encoder-decoder": "Base64 Encode / Decode",
  "url-encoder-decoder": "URL Encode / Decode",
  "hash-generator": "Hash Generator",
  "text-diff-checker": "Text Diff Checker",
  "lorem-ipsum-generator": "Lorem Ipsum Generator",
  "html-encoder-decoder": "HTML Encode / Decode",
  "text-to-slug": "Text to Slug Converter",
  "nepal-forex-rates": "नेपाल राष्ट्र बैंक विनिमय दर",
  "nepal-salary-tax-calculator": "नेपाल तलब तथा आयकर क्याल्कुलेटर",
  "nepse-dividend-calculator": "NEPSE लाभांश तथा बोनस शेयर क्याल्कुलेटर",
  "nepse-market-news": "NEPSE तथा नेपाल बजार समाचार",
  "loan-emi-calculator": "ऋण EMI क्याल्कुलेटर",
  "compound-interest-sip-calculator": "चक्रवृद्धि ब्याज तथा SIP क्याल्कुलेटर",
  "discount-percentage-calculator": "छुट प्रतिशत क्याल्कुलेटर",
  "ai-resume-writer": "AI रिजुमे लेखक",
  "ai-cover-letter-generator": "AI कभर लेटर जेनेरेटर",
  "ai-humanizer": "AI पाठ परिष्कार तथा पुनर्लेखन",
};
const nepaliDescriptions: Record<string, string> = {
  "nepali-digit-converter": "अङ्ग्रेजी अंकलाई नेपाली देवनागरी अंकमा र नेपाली अंकलाई अङ्ग्रेजी अंकमा रूपान्तरण गर्नुहोस्।",
  "nepali-number-converter": "नम्बरलाई नेपाली अंकमा देखाउनुहोस् र नेपाली लाख तथा करोडको ढाँचा जाँच्नुहोस्।",
  "nepali-date-converter": "विक्रम संवत् र इस्वी संवत्का मितिहरूबीच रूपान्तरण गर्नुहोस् र समर्थित मिति दायरा जाँच्नुहोस्।",
  "nepal-land-area-converter": "रोपनी, आना, पैसा र दामलाई वर्गफुट तथा वर्गमिटरमा रूपान्तरण गर्नुहोस्।",
  "nepali-vat-calculator": "नेपालको १३ प्रतिशत VAT थप्नुहोस् वा VAT सहितको रकमबाट आधार मूल्य र कर छुट्याउनुहोस्।",
  "neb-gpa-calculator": "विषयको credit hour र grade point प्रयोग गरेर credit-weighted NEB GPA अनुमान गर्नुहोस्।",
  "word-character-counter": "शब्द, अक्षर, खाली स्थान र अनुच्छेदको संख्या गणना गर्नुहोस्।",
  "case-converter": "अङ्ग्रेजी पाठलाई uppercase, lowercase वा title case मा बदल्नुहोस्।",
  "remove-duplicate-lines": "दोहोरिएका लाइन हटाएर पहिलो आएको क्रम सुरक्षित राख्नुहोस्।",
  "sort-lines": "पाठका लाइनलाई वर्णक्रममा मिलाउनुहोस्।",
  "reverse-text": "पाठको अक्षर क्रम उल्ट्याउनुहोस्।",
  "whitespace-cleaner": "अतिरिक्त space, tab र खाली लाइन व्यवस्थित गर्नुहोस्।",
  "character-frequency": "पाठमा प्रत्येक अक्षर कति पटक आएको छ गणना गर्नुहोस्।",
  "word-frequency-counter": "पाठमा प्रत्येक शब्दको आवृत्ति गणना गर्नुहोस्।",
  "reading-time-calculator": "शब्द संख्या र पढ्ने गतिका आधारमा अनुमानित समय निकाल्नुहोस्।",
  "line-counter": "कुल, खाली र सामग्री भएका लाइन छुट्याउनुहोस्।",
  "sentence-counter": "विरामचिह्नका आधारमा वाक्य संख्या अनुमान गर्नुहोस्।",
  "percentage-change-calculator": "सुरुको र नयाँ मानबाट प्रतिशत वृद्धि वा कमी निकाल्नुहोस्।",
  "average-calculator": "अल्पविराम वा space ले छुट्याएका संख्याको औसत निकाल्नुहोस्।",
  "ratio-simplifier": "दुई पूर्णांकको अनुपातलाई सबैभन्दा सरल रूपमा बदल्नुहोस्।",
  "fraction-calculator": "दुई भिन्न जोड्नुहोस्, घटाउनुहोस्, गुणन वा भाग गर्नुहोस्।",
  "percentage-of-number-calculator": "कुनै संख्याको चाहिएको प्रतिशत निकाल्नुहोस्।",
  "gcd-lcm-calculator": "दुई पूर्णांकको महत्तम समापवर्तक र लघुत्तम समापवर्त्य निकाल्नुहोस्।",
  "prime-number-checker": "कुनै पूर्णांक अभाज्य हो वा होइन जाँच गर्नुहोस्।",
  "unit-converter": "लम्बाइ र तौलका सामान्य एकाइहरूबीच रूपान्तरण गर्नुहोस्।",
  "age-calculator": "जन्म मिति र गणना मितिका आधारमा वर्ष, महिना, दिन र कुल दिन निकाल्नुहोस्।",
  "date-difference-calculator": "दुई मितिबीचको दिन, हप्ता र औसत महिनाको अन्तर निकाल्नुहोस्।",
  "time-duration-calculator": "दुई समयबीचको घण्टा र मिनेट निकाल्नुहोस्; राति पार हुने समय पनि समर्थन गर्छ।",
  "bmi-calculator": "तौल र उचाइबाट वयस्कको BMI र सामान्य screening वर्ग निकाल्नुहोस्; यो चिकित्सकीय निदान होइन।",
  "bmr-calculator": "उमेर, उचाइ, तौल र Mifflin–St Jeor सूत्रबाट आधारभूत दैनिक ऊर्जा खर्च अनुमान गर्नुहोस्।",
  "tip-calculator": "बिल रकम, टिप प्रतिशत र व्यक्ति संख्याबाट टिप तथा प्रति व्यक्ति रकम निकाल्नुहोस्।",
  "split-bill-calculator": "कुल बिललाई व्यक्तिको संख्याले बराबर बाँडेर प्रति व्यक्ति रकम निकाल्नुहोस्।",
  "simple-interest-calculator": "मूलधन, वार्षिक ब्याजदर र अवधिबाट साधारण ब्याज तथा कुल रकम निकाल्नुहोस्।",
  "json-formatter-validator": "JSON डेटा मान्य छ कि छैन जाँच्नुहोस् र पढ्न सजिलो गरी फर्म्याट गर्नुहोस्।",
  "base64-encoder-decoder": "UTF-8 पाठलाई Base64 मा बदल्नुहोस् वा Base64 बाट पाठ निकाल्नुहोस्।",
  "url-encoder-decoder": "URL मा प्रयोग हुने विशेष अक्षर encode वा decode गर्नुहोस्।",
  "hash-generator": "पाठको SHA-256, SHA-384 वा SHA-512 hash स्थानीय ब्राउजरमै निकाल्नुहोस्।",
  "text-diff-checker": "दुई पाठ तुलना गरी थपिएका, हटाइएका र उस्तै लाइन देखाउनुहोस्।",
  "lorem-ipsum-generator": "डिजाइन तथा लेआउट परीक्षणका लागि नमुना placeholder पाठ बनाउनुहोस्।",
  "html-encoder-decoder": "HTML का विशेष अक्षर encode वा समर्थित entity decode गर्नुहोस्।",
  "text-to-slug": "पाठलाई URL-friendly slug मा बदल्नुहोस्; नेपाली Unicode अक्षर सुरक्षित रहन्छन्।",
  "nepal-forex-rates": "नेपाल राष्ट्र बैंकबाट उपलब्ध खरिद तथा बिक्री विनिमय दर हेर्नुहोस् र NPR रूपान्तरणको अनुमान जाँच्नुहोस्।",
  "nepal-salary-tax-calculator": "नेपालको लागू कर-ब्यान्ड र प्रविष्ट गरिएको आम्दानीका आधारमा तलब करको अनुमान निकाल्नुहोस्।",
  "nepse-dividend-calculator": "शेयर संख्याबाट नगद लाभांश, withholding tax र बोनस शेयरको अनुमान निकाल्नुहोस्।",
  "nepse-market-news": "प्रकाशन मिति र स्रोतसहित उपलब्ध नेपाल शेयर बजार तथा IPO समाचार हेर्नुहोस्।",
  "loan-emi-calculator": "ऋण रकम, ब्याजदर र अवधिबाट मासिक EMI, कुल ब्याज र कुल भुक्तानीको अनुमान निकाल्नुहोस्।",
  "compound-interest-sip-calculator": "मासिक SIP, अवधि र अपेक्षित प्रतिफलबाट लगानीको अनुमानित भविष्य मूल्य र लाभ जाँच्नुहोस्।",
  "discount-percentage-calculator": "मूल्य र छुट प्रतिशतबाट छुट रकम, अन्तिम मूल्य र प्रतिशत परिवर्तन निकाल्नुहोस्।",
  "ai-resume-writer": "तपाईंको वास्तविक अनुभवबाट ATS-अनुकूल रिजुमे सामग्री तयार गर्नुहोस्।",
  "ai-cover-letter-generator": "वास्तविक अनुभव र कामको विवरणबाट व्यावसायिक कभर लेटर तयार गर्नुहोस्।",
  "ai-humanizer": "अर्थ र तथ्य जोगाउँदै पाठलाई स्वाभाविक र स्पष्ट शैलीमा पुनर्लेखन गर्नुहोस्।",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const request = resolveLocalizedToolRequest(locale, slug);
  if (request.status !== "ok") return localizedToolNotFoundMetadata;
  const metadata = buildLocalizedToolMetadata(request.locale, request.implementation.entry);
  if (request.locale === "ne" && (nepaliLocalizedUtilitySlugs.includes(request.implementation.slug as (typeof nepaliLocalizedUtilitySlugs)[number]) || nepaliLocalizedFinancialSlugs.includes(request.implementation.slug as (typeof nepaliLocalizedFinancialSlugs)[number]) || nepaliLocalizedCareerSlugs.includes(request.implementation.slug as (typeof nepaliLocalizedCareerSlugs)[number]))) {
    return {
      ...metadata,
      title: `${nepaliTitles[request.implementation.slug]} | PDFora`,
      description: nepaliDescriptions[request.implementation.slug] ?? metadata.description,
    };
  }
  return metadata;
}

/**
 * Localized catalog-tool route (/ne/tools/<slug>, /ar/tools/<slug>, ...). English stays at the
 * unprefixed /tools/<slug> and is not touched.
 *
 * Only slugs accepted by the tool adapter render; everything else is a 404 (no fallback tool).
 * The tool itself is the existing ToolWorkspace, unchanged, so calculations, uploads and APIs
 * behave exactly as in English. Its interface is not translated yet, so it is declared as
 * English (lang="en", dir="ltr"), a notice says so, and the page stays noindex until the tool is
 * listed in lib/tools/localized-verification.ts. No JSON-LD is emitted (the English structured
 * data must not be attached to a localized URL).
 */
export default async function LocalizedToolPage({ params }: Props) {
  const { locale, slug } = await params;
  const request = resolveLocalizedToolRequest(locale, slug);
  if (request.status !== "ok") notFound();
  const t = await getTranslator(request.locale, ["common"]);
  const toolSlug = request.implementation.slug;
  if (request.locale === "ne" && ["word-character-counter", "case-converter", "remove-duplicate-lines", "sort-lines", "reverse-text", "whitespace-cleaner", "character-frequency", "word-frequency-counter", "reading-time-calculator", "line-counter", "sentence-counter"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली टेक्स्ट टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliTextUtilityWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["json-formatter-validator", "base64-encoder-decoder", "url-encoder-decoder", "hash-generator", "text-diff-checker", "lorem-ipsum-generator", "html-encoder-decoder", "text-to-slug"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली Developer तथा Text Tools</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliDeveloperTextWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["age-calculator", "date-difference-calculator", "time-duration-calculator"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली मिति तथा समय टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliDateTimeWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && ["percentage-change-calculator", "average-calculator", "ratio-simplifier", "fraction-calculator", "percentage-of-number-calculator", "gcd-lcm-calculator", "prime-number-checker", "unit-converter", "bmi-calculator", "bmr-calculator", "tip-calculator", "split-bill-calculator", "simple-interest-calculator"].includes(toolSlug)) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली गणित टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">{nepaliDescriptions[toolSlug]}</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliMathUtilityWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && nepaliLocalizedUtilitySlugs.includes(toolSlug as (typeof nepaliLocalizedUtilitySlugs)[number])) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली उपयोगी टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">यो पृष्ठका मुख्य निर्देशन र नतिजा नेपालीमा उपलब्ध छन्।</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliUtilityWorkspace slug={toolSlug} /></section></main>;
  }
  if (request.locale === "ne" && nepaliLocalizedCareerSlugs.includes(toolSlug as (typeof nepaliLocalizedCareerSlugs)[number])) {
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली करियर तथा AI टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">वास्तविक विवरण प्रयोग गर्नुहोस्, AI नतिजा जाँच गर्नुहोस् र गोप्य जानकारी नपठाउनुहोस्।</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><AIWritingTools slug={toolSlug} locale="ne" /></section></main>;
  }
  if (request.locale === "ne" && nepaliLocalizedFinancialSlugs.includes(toolSlug as (typeof nepaliLocalizedFinancialSlugs)[number])) {
    if (["loan-emi-calculator", "compound-interest-sip-calculator", "discount-percentage-calculator"].includes(toolSlug)) {
      return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली वित्तीय टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepaliFinanceCalculatorWorkspace slug={toolSlug} /></section></main>;
    }
    return <main lang="ne" dir="ltr" className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6"><div className="mb-7"><p className="text-xs font-black uppercase tracking-widest text-teal-700">नेपाली वित्तीय टुल</p><h1 className="mt-2 text-3xl font-black text-slate-950">{nepaliTitles[toolSlug]}</h1><p className="mt-2 text-slate-600">आधिकारिक स्रोत वा स्पष्ट गणना धारणासहितको नेपाली इन्टरफेस। बजार र दरसम्बन्धी डेटा उपलब्ध नभएमा त्यसैको सूचना देखाइन्छ।</p></div><section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><NepalLiveTools slug={toolSlug} locale="ne" /></section></main>;
  }
  return (
    <>
      <div role="note" className="mx-auto mt-4 w-full max-w-4xl space-y-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {!isPublished(request.locale) && <p>{t("common.previewBanner")}</p>}
        <p>
          {t("common.toolEnglishNotice")}{" "}
          <Link href={`/tools/${toolSlug}`} lang="en" hrefLang="en" className="font-semibold underline">
            {t("common.viewEnglishTool")}
          </Link>
        </p>
      </div>
      <div lang="en" dir="ltr">
        <ToolWorkspace slug={toolSlug} />
      </div>
    </>
  );
}
