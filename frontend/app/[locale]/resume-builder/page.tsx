import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResumeBuilder from "../../../components/ResumeBuilder";
import { isLocale, isPublished } from "../../../lib/i18n/config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "ne" || !isPublished(locale)) {
    return { title: "Page not found", robots: { index: false, follow: true } };
  }
  return {
    title: "व्यावसायिक रिजुमे बिल्डर | PDFora",
    description: "नेपाली निर्देशनसहित २० व्यावसायिक CV टेम्प्लेटमा आफ्नो विवरण भर्नुहोस्, प्रत्यक्ष पूर्वावलोकन हेर्नुहोस् र PDF का रूपमा सुरक्षित गर्नुहोस्।",
    alternates: { canonical: "https://pd-fora.vercel.app/ne/resume-builder" },
    robots: { index: false, follow: true },
  };
}

export default async function NepaliResumeBuilderPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "ne" || !isPublished(locale)) notFound();
  return <ResumeBuilder locale="ne" />;
}
