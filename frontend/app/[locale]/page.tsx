import type { Metadata } from "next";
import Link from "next/link";
import NepaliHomePage from "../../components/NepaliHomePage";
import { notFound } from "next/navigation";
import LanguageSwitcher from "../../components/i18n/LanguageSwitcher";
import { isLocale, isPublished, isRoutable, localeInfo } from "../../lib/i18n/config";
import { getTranslator } from "../../lib/i18n/messages";
import { buildLocaleMetadata } from "../../lib/i18n/metadata";
import { getSwitcherOptions } from "../../lib/i18n/switcher";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || !isRoutable(locale)) return { title: "Page not found", robots: { index: false, follow: true } };
  if (locale === "ne") return buildLocaleMetadata({ locale, path: "/", title: "निःशुल्क PDF टुल, नेपालका क्याल्कुलेटर र उपयोगी उपकरण", description: "PDF जोड्नुहोस्, छुट्याउनुहोस्, कम्प्रेस र रूपान्तरण गर्नुहोस्। नेपालका क्याल्कुलेटर, नेपाली मिति र दैनिक उपयोगी उपकरण प्रयोग गर्नुहोस्।" });
  const t = await getTranslator(locale);
  return buildLocaleMetadata({ locale, path: "/", title: t("seo.home.title"), description: t("seo.home.description") });
}

/**
 * Published Nepali uses its complete localized homepage. Other locales remain unpublished
 * until their dictionaries and genuinely localized content have passed review.
 */
export default async function LocalizedHomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale) || !isRoutable(locale)) notFound();
  if (locale === "ne") return <NepaliHomePage />;
  const t = await getTranslator(locale);
  const info = localeInfo[locale];
  return (
    <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      {!isPublished(locale) && (
        <p role="note" className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t("common.previewBanner")}
        </p>
      )}
      <div className="mb-8 flex items-center justify-between gap-4">
        <span className="text-lg font-bold text-teal-800">{t("common.siteName")}</span>
        <LanguageSwitcher
          current={locale}
          options={getSwitcherOptions("/")}
          label={t("accessibility.languageSwitcher")}
          currentLabel={t("accessibility.currentLanguage", { name: info.nativeName })}
        />
      </div>
      <h1 className="text-3xl font-bold text-slate-900">{t("common.tagline")}</h1>
      <p className="mt-6">
        <Link href="/" hrefLang="en" lang="en" className="font-semibold text-blue-700 underline">
          {t("common.viewEnglish")}
        </Link>
      </p>
    </main>
  );
}
