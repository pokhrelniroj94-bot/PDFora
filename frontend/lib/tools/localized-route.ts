import { isLocale, isRoutable, type Locale } from "../i18n/config";
import { resolveCatalogTool, type ToolImplementation, type ToolRejectionReason } from "./adapter";

export type LocalizedToolNotFoundReason = "invalid-locale" | "locale-not-served" | ToolRejectionReason;

export type LocalizedToolRequest =
  | { status: "ok"; locale: Locale; implementation: ToolImplementation }
  | { status: "not-found"; reason: LocalizedToolNotFoundReason };

/**
 * Validates the raw route params of /[locale]/tools/[slug].
 * - "invalid-locale": not a supported locale code at all.
 * - "locale-not-served": a real locale that this deployment does not serve (English is served
 *   unprefixed; unpublished locales are served only with PDFORA_I18N_PREVIEW=1).
 * - otherwise the adapter's rejection reason (unknown tool, PDF root tool, placeholder, ...).
 * Every non-"ok" result must become a 404; there is no fallback tool.
 */
export function resolveLocalizedToolRequest(localeParam: unknown, slugParam: unknown): LocalizedToolRequest {
  if (!isLocale(localeParam)) return { status: "not-found", reason: "invalid-locale" };
  if (!isRoutable(localeParam)) return { status: "not-found", reason: "locale-not-served" };
  const resolution = resolveCatalogTool(slugParam);
  if (!resolution.ok) return { status: "not-found", reason: resolution.reason };
  return { status: "ok", locale: localeParam, implementation: resolution.implementation };
}
