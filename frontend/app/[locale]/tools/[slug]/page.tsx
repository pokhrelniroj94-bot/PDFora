import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolWorkspace from "../../../../components/AllTools";
import { isPublished } from "../../../../lib/i18n/config";
import { getTranslator } from "../../../../lib/i18n/messages";
import { buildLocalizedToolMetadata, localizedToolNotFoundMetadata } from "../../../../lib/tools/localized-metadata";
import { resolveLocalizedToolRequest } from "../../../../lib/tools/localized-route";
import NepaliUtilityWorkspace from "../../../../components/NepaliUtilityWorkspace";
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
