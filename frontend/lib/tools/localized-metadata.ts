import type { Metadata } from "next";
import type { ToolInfo } from "../../components/toolCatalog";
import { isPublished, type Locale } from "../i18n/config";
import { buildLocaleMetadata } from "../i18n/metadata";
import { isLocalizedToolIndexable } from "./localized-verification";

/**
 * Metadata for /[locale]/tools/[slug].
 *
 * Title and description come only from the catalog entry (the English source text), because no
 * reviewed localized tool copy exists yet; nothing is machine-written here. The canonical is
 * self-referencing (never English, never the homepage). hreflang is only emitted by
 * buildLocaleMetadata when a genuine published translation is registered, which is not the case
 * for tool pages today. Robots is default-deny: index only when the locale is published AND the
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
