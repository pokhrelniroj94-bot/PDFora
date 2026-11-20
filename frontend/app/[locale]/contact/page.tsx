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
    return buildLocaleMetadata({ locale: "ne", path: "/contact", title: "PDFora सम्पर्क | नेपाली", description: "PDFora का टुल सहायता, सुझाव र गोपनीयता प्रश्नका लागि नेपाली सम्पर्क जानकारी।" });
  }
  if (locale === "hi" && isRoutable("hi")) {
    return buildLocaleMetadata({ locale: "hi", path: "/contact", title: "संपर्क करें | PDFora", description: "PDFora के टूल में समस्या, सुझाव और गोपनीयता संबंधी प्रश्न भेजने के तरीके देखें।" });
  }
  return { title: "Page not found", robots: { index: false, follow: true } };
}

export default async function LocalizedStaticPage({ params }: Props) {
  const { locale } = await params;
  if (locale === "ne") return <NepaliStaticPage page="contact" />;
  if (locale === "hi" && isRoutable("hi")) return <HindiStaticPage page="contact" />;
  notFound();
}
