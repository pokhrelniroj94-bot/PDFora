import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LanguageSwitcher from "../../components/i18n/LanguageSwitcher";
import { isLocale, isPublished, localeFallbackCopy, localeInfo } from "../../lib/i18n/config";
import { getTranslator } from "../../lib/i18n/messages";
import { buildLocaleMetadata } from "../../lib/i18n/metadata";
import { getSwitcherOptions } from "../../lib/i18n/switcher";
import NepaliHomePage from "../../components/NepaliHomePage";

type Props = { params: Promise<{ locale: string }>; searchParams?: Promise<{ from?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return { title: "Page not found", robots: { index: false, follow: true } };
  if (!isPublished(locale)) {
    const copy = localeFallbackCopy[locale];
    return { title: copy.title, description: copy.message, robots: { index: false, follow: true }, alternates: { canonical: `https://pd-fora.vercel.app/${locale}` } };
  }
  const t = await getTranslator(locale);
  return buildLocaleMetadata({ locale, path: "/", title: t("seo.home.title"), description: t("seo.home.description") });
}

/**
 * Phase 2 locale home SHELL. It proves routing, dictionary loading, language switching and
 * RTL isolation. It is not the translated homepage (Phase 3) and is only reachable for
 * unpublished locales when PDFORA_I18N_PREVIEW=1 (noindex, no hreflang).
 */
export default async function LocalizedHomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  if (!isPublished(locale)) {
    const copy = localeFallbackCopy[locale];
    const from = searchParams ? (await searchParams).from : undefined;
    return (
      <main id="main" lang={localeInfo[locale].htmlLang} dir={localeInfo[locale].dir} className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-900">{copy.title}</h1>
        <p className="mt-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-4 text-amber-900">{copy.message}</p>
        <Link href={from && from.startsWith("/") ? from : "/"} hrefLang="en" lang="en" className="mt-8 inline-block font-semibold text-blue-700 underline">{copy.back}</Link>
      </main>
    );
  }
  const t = await getTranslator(locale);
  const info = localeInfo[locale];
  if (locale === "ne") return <NepaliHomePage />;
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
