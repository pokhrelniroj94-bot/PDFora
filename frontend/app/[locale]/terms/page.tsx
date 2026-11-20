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
    return buildLocaleMetadata({ locale: "ne", path: "/terms", title: "नेपाली सेवा सर्तहरू | PDFora", description: "PDFora का सेवा प्रयोग, फाइल, उपलब्धता र दायित्वसम्बन्धी नेपाली सर्तहरू।" });
  }
  if (locale === "hi" && isRoutable("hi")) {
    return buildLocaleMetadata({ locale: "hi", path: "/terms", title: "सेवा की शर्तें | PDFora", description: "PDFora टूल इस्तेमाल करने की शर्तें, उपयोगकर्ता जिम्मेदारियाँ और सेवा सीमाएँ पढ़ें।" });
  }
  return { title: "Page not found", robots: { index: false, follow: true } };
}

export default async function LocalizedStaticPage({ params }: Props) {
  const { locale } = await params;
  if (locale === "ne") return <NepaliStaticPage page="terms" />;
  if (locale === "hi" && isRoutable("hi")) return <HindiStaticPage page="terms" />;
  notFound();
}
