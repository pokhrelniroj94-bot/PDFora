import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, isRoutable, localeInfo } from "../../lib/i18n/config";

/**
 * Wrapper for every non-English locale route (/ne, /ar, ...). English is served from the
 * unprefixed routes and is never rendered here.
 *
 * The <html> element still belongs to app/layout.tsx (lang="en"); this wrapper carries the
 * locale's lang and dir so Arabic RTL applies to Arabic pages only. Moving <html lang/dir>
 * itself into a per-locale root layout is planned for Phase 3 (see docs/i18n/ARCHITECTURE.md).
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
