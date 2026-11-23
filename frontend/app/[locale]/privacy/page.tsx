import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HindiStaticPage from "../../../components/HindiStaticPage";
import NepaliStaticPage from "../../../components/NepaliStaticPage";
import { isRoutable } from "../../../lib/i18n/config";
import { buildLocaleMetadata } from "../../../lib/i18n/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "ne") {
    return buildLocaleMetadata({ locale: "ne", path: "/privacy", title: "नेपाली गोपनीयता नीति | PDFora", description: "PDFora ले फाइल, कुकी, विज्ञापन र तेस्रो पक्षका सेवासँग सम्बन्धित जानकारी कसरी सम्हाल्छ भन्ने नेपाली नीति।" });
  }
  if (locale === "hi" && isRoutable("hi")) {
    return buildLocaleMetadata({ locale: "hi", path: "/privacy", title: "हिंदी गोपनीयता नीति | PDFora", description: "PDFora में फ़ाइल प्रोसेसिंग, तकनीकी जानकारी, कुकी और विज्ञापन से जुड़े गोपनीयता विवरण पढ़ें।" });
  }
  return { title: "Page not found", robots: { index: false, follow: true } };
}

export default async function LocalizedStaticPage({ params }: Props) {
  const { locale } = await params;
  if (locale === "ne") return <NepaliStaticPage page="privacy" />;
  if (locale === "hi" && isRoutable("hi")) return <HindiStaticPage page="privacy" />;
  notFound();
}
