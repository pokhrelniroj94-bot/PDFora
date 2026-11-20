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
    return buildLocaleMetadata({ locale: "ne", path: "/about", title: "PDFora बारेमा | नेपाली", description: "PDFora का PDF टुल, नेपाल उपयोगी क्याल्कुलेटर र प्लेटफर्मको उद्देश्यबारे नेपाली जानकारी।" });
  }
  if (locale === "hi" && isRoutable("hi")) {
    return buildLocaleMetadata({ locale: "hi", path: "/about", title: "हमारे बारे में | PDFora", description: "PDFora के उद्देश्य, उपलब्ध PDF टूल और ऑनलाइन उपयोगिताओं के बारे में जानें।" });
  }
  return { title: "Page not found", robots: { index: false, follow: true } };
}

export default async function LocalizedStaticPage({ params }: Props) {
  const { locale } = await params;
  if (locale === "ne") return <NepaliStaticPage page="about" />;
  if (locale === "hi" && isRoutable("hi")) return <HindiStaticPage page="about" />;
  notFound();
}
