import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, isRoutable, localeInfo } from "../../lib/i18n/config";

/**
 * Wrapper for every non-English locale route (/ne, /ar, ...). English is served from the
 * unprefixed routes and is never rendered here.
 *
 * The root proxy forwards the active locale to app/layout.tsx, which sets document-level
 * lang/dir. This wrapper also scopes direction for locale-specific content and components.
 *
 * Locales that are not published return 404 unless PDFORA_I18N_PREVIEW=1 is set on the server.
 */
export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || !isRoutable(locale)) notFound();
  const info = localeInfo[locale];
  return (
    <div lang={info.htmlLang} dir={info.dir} data-locale={locale} className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
