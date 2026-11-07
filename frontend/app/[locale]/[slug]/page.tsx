import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PDForaTool from "../../../components/PDForaTool";
import Niroj77Tool from "../../../components/Niroj77Tool";
import ToolGuide from "../../../components/ToolGuide";
import { isLocale, isRoutable } from "../../../lib/i18n/config";
import { nepaliToolGuides } from "../../../lib/i18n/tool-guides-ne";
import { nepaliToolNames } from "../../../lib/i18n/pdf-tool-names-ne";
import { getNepaliPdfRoute, nepaliPdfRoutes } from "../../../lib/i18n/nepali-pdf-routes";
import { buildLocaleMetadata } from "../../../lib/i18n/metadata";
import NepseMarketDashboard from "../../../components/NepseMarketDashboard";
import ResumeBuilder from "../../../components/ResumeBuilder";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [...Object.keys(nepaliPdfRoutes), "market", "resume-builder"].map((slug) => ({ locale: "ne", slug }));
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
  const route = getNepaliPdfRoute(slug);
  if (!route || locale !== "ne") return { title: "Page not found", robots: { index: false, follow: true } };
  const name = nepaliToolNames[slug] ?? route.title;
  const guide = nepaliToolGuides[slug];
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
  const route = getNepaliPdfRoute(slug);
  if (locale !== "ne" || !isLocale(locale) || !isRoutable(locale) || !route) notFound();

  const guide = nepaliToolGuides[slug];
  const localizedName = nepaliToolNames[slug] ?? route.title;
  const localizedDescription = guide?.purpose ?? route.description;
  const commonProps = {
    endpoint: route.endpoint,
    title: localizedName,
    description: localizedDescription,
    multiple: route.multiple,
    downloadName: route.downloadName,
    queryField: route.queryField,
    queryDefault: route.queryDefault,
  };

  return (
    <main lang="ne" className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">PDFora नेपाली PDF टुल</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-5xl">{nepaliToolNames[slug] ?? route.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">{localizedDescription}</p>
        </header>
        <div className="mt-8">
          {route.component === "pdfora" ? <PDForaTool {...commonProps} /> : <Niroj77Tool {...commonProps} />}
        </div>
        {guide && <ToolGuide guide={{ ...guide, slug, name: localizedName, keyword: "", related: [], blogSlug: "" }} />}
      </div>
    </main>
  );
}
