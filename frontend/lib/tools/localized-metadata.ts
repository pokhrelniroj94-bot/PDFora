import type { Metadata } from "next";
import type { ToolInfo } from "../../components/toolCatalog";
import { isPublished, type Locale } from "../i18n/config";
import { buildLocaleMetadata } from "../i18n/metadata";
import { isLocalizedToolIndexable } from "./localized-verification";

/**
 * Metadata for /[locale]/tools/[slug].
 *
 * This helper provides catalog-sourced fallback metadata. A route may override its title and
 * description only when explicit locale-specific copy is registered. Canonical URLs are
 * self-referencing. Tool pages do not emit hreflang until equivalent translated destinations are
 * genuinely available. Robots is default-deny: index only when the locale is published AND the
 * tool is explicitly verified for that locale.
 */
export function buildLocalizedToolMetadata(locale: Locale, entry: ToolInfo): Metadata {
  const base = buildLocaleMetadata({
    locale,
    path: `/tools/${entry.slug}`,
    title: `${entry.name} | PDFora`,
    description: entry.description,
  });
  const indexable = isPublished(locale) && isLocalizedToolIndexable(locale, entry.slug);
  if (indexable) return { ...base, robots: { index: true, follow: true } };
  return {
    ...base,
    alternates: { canonical: base.alternates?.canonical },
    // Keep links crawlable while the localized page itself remains excluded from indexing.
    robots: { index: false, follow: isPublished(locale) },
  };
}

/** Used for every rejected request so a 404 never carries tool metadata or an index signal. */
export const localizedToolNotFoundMetadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};
