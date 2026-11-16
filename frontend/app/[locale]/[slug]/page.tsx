import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PDForaTool from "../../../components/PDForaTool";
import Niroj77Tool from "../../../components/Niroj77Tool";
import ToolGuide from "../../../components/ToolGuide";
import { isLocale, isRoutable, type Locale } from "../../../lib/i18n/config";
import { nepaliToolGuides } from "../../../lib/i18n/tool-guides-ne";
import { nepaliToolNames } from "../../../lib/i18n/pdf-tool-names-ne";
import { hindiToolGuides } from "../../../lib/i18n/tool-guides-hi";
import { hindiToolNames } from "../../../lib/i18n/pdf-tool-names-hi";
import { getNepaliPdfRoute, nepaliPdfRoutes } from "../../../lib/i18n/nepali-pdf-routes";
import { buildLocaleMetadata } from "../../../lib/i18n/metadata";
import NepseMarketDashboard from "../../../components/NepseMarketDashboard";
import ResumeBuilder from "../../../components/ResumeBuilder";
import NepaliStaticPage from "../../../components/NepaliStaticPage";

type Props = { params: Promise<{ locale: string; slug: string }> };

type PdfLocaleCopy = {
  names: Record<string, string>;
  guides: Record<string, { purpose: string; steps: string[]; caution: string }>;
  badge: string;
};

/** Locales that have dedicated PDF tool pages. Hindi stays unpublished (404 / noindex) until the publishing gate passes. */
const pdfLocaleCopy: Partial<Record<Locale, PdfLocaleCopy>> = {
  ne: { names: nepaliToolNames, guides: nepaliToolGuides, badge: "PDFora नेपाली PDF टुल" },
  hi: { names: hindiToolNames, guides: hindiToolGuides, badge: "PDFora हिंदी PDF टूल" },
};

function getPdfLocaleCopy(locale: string): PdfLocaleCopy | undefined {
  return isLocale(locale) ? pdfLocaleCopy[locale] : undefined;
}

export function generateStaticParams() {
  const nepali = [...Object.keys(nepaliPdfRoutes), "market", "resume-builder", "privacy", "terms", "about", "contact"].map((slug) => ({ locale: "ne", slug }));
  const hindi = isRoutable("hi") ? Object.keys(nepaliPdfRoutes).map((slug) => ({ locale: "hi", slug })) : [];
  return [...nepali, ...hindi];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale === "ne" && slug === "market") {
    return buildLocaleMetadata({
      locale,
      path: "/market",
      title: "NEPSE बजार ड्यासबोर्ड | PDFora",
      description: "NEPSE सूचकाङ्क, शेयर मूल्य, बजारका बढेका/घटेका शेयर र ऐतिहासिक चार्टको नेपाली ड्यासबोर्ड।",
    });
  }
  if (locale === "ne" && slug === "resume-builder") {
    return buildLocaleMetadata({
      locale,
      path: "/resume-builder",
      title: "नेपाली रिजुमे बिल्डर तथा CV टेम्प्लेट | PDFora",
      description: "२० व्यावसायिक टेम्प्लेट, प्रत्यक्ष A4 पूर्वावलोकन र PDF निर्यातसहित नेपाली रिजुमे तथा CV बनाउनुहोस्।",
    });
  }
  const staticMetadata: Record<string, { title: string; description: string }> = {
    privacy: { title: "नेपाली गोपनीयता नीति | PDFora", description: "PDFora ले फाइल, कुकी, AI र तेस्रो पक्षका सेवासँग सम्बन्धित जानकारी कसरी सम्हाल्छ भन्ने नेपाली नीति।" },
    terms: { title: "नेपाली सेवा सर्तहरू | PDFora", description: "PDFora का सेवा प्रयोग, फाइल, उपलब्धता र दायित्वसम्बन्धी नेपाली सर्तहरू।" },
    about: { title: "PDFora बारेमा | नेपाली", description: "PDFora का PDF टुल, नेपाल उपयोगी क्याल्कुलेटर र प्लेटफर्मको उद्देश्यबारे नेपाली जानकारी।" },
    contact: { title: "PDFora सम्पर्क | नेपाली", description: "PDFora का टुल सहायता, सुझाव र गोपनीयता प्रश्नका लागि नेपाली सम्पर्क जानकारी।" },
  };
  if (locale === "ne" && staticMetadata[slug]) {
    return buildLocaleMetadata({ locale, path: `/${slug}`, ...staticMetadata[slug] });
  }
  const route = getNepaliPdfRoute(slug);
  const pdfCopy = getPdfLocaleCopy(locale);
  if (!route || !pdfCopy || !isLocale(locale)) return { title: "Page not found", robots: { index: false, follow: true } };
  const name = pdfCopy.names[slug] ?? route.title;
  const guide = pdfCopy.guides[slug];
  return buildLocaleMetadata({
    locale,
    path: `/${slug}`,
    title: `${name} | PDFora`,
    description: guide?.purpose ?? route.description,
  });
}

export default async function NepaliPdfToolPage({ params }: Props) {
  const { locale, slug } = await params;
  if (locale === "ne" && slug === "market") {
    return <NepseMarketDashboard locale="ne" />;
  }
  if (locale === "ne" && slug === "resume-builder") {
    return <ResumeBuilder locale="ne" />;
  }
  if (locale === "ne" && ["privacy", "terms", "about", "contact"].includes(slug)) {
    return <NepaliStaticPage page={slug as "privacy" | "terms" | "about" | "contact"} />;
  }
  const route = getNepaliPdfRoute(slug);
  const pdfCopy = getPdfLocaleCopy(locale);
  if (!pdfCopy || !isLocale(locale) || !isRoutable(locale) || !route) notFound();

  const guide = pdfCopy.guides[slug];
  const localizedName = pdfCopy.names[slug] ?? route.title;
  const localizedDescription = guide?.purpose ?? route.description;
  const commonProps = {
    endpoint: route.endpoint,
    title: localizedName,
    description: localizedDescription,
    multiple: route.multiple,
    accept: route.accept,
    downloadName: route.downloadName,
    fieldName: route.fieldName,
    formField: route.formField,
    formPlaceholder: route.formPlaceholder,
    queryField: route.queryField,
    queryDefault: route.queryDefault,
  };

  return (
    <main lang={locale} className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">{pdfCopy.badge}</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-5xl">{localizedName}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">{localizedDescription}</p>
        </header>
        <div className="mt-8">
          {route.component === "pdfora" ? <PDForaTool {...commonProps} /> : <Niroj77Tool {...commonProps} extraFields={route.extraFields} />}
        </div>
        {guide && <ToolGuide locale={locale} guide={{ ...guide, slug, name: localizedName, keyword: "", related: [], blogSlug: "" }} />}
      </div>
    </main>
  );
}
