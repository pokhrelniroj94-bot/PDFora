import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, localeInfo } from "../../lib/i18n/config";

/**
 * Wrapper for every non-English locale route (/ne, /ar, ...). English is served from the
 * unprefixed routes and is never rendered here.
 *
 * The proxy/root layout pair sets the initial HTML lang and dir. This wrapper keeps the
 * locale available to nested components and provides a defense-in-depth direction boundary.
 */
export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const info = localeInfo[locale];
  return (
    <div lang={info.htmlLang} dir={info.dir} data-locale={locale} className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
