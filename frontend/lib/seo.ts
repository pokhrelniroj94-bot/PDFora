import { SITE_URL } from "./i18n/config";

/** Canonical production URL shared by metadata, sitemap and robots. */
export const PRODUCTION_ORIGIN = SITE_URL;

export function normalizeSeoPath(path: string): string {
  const value = path.split(/[?#]/, 1)[0]?.trim() || "/";
  const parts = value.split("/").filter(Boolean);
  return parts.length ? "/" + parts.join("/") : "/";
}

/** Always emits the production host; never derive canonicals from request headers. */
export function productionUrl(path: string): string {
  const normalized = normalizeSeoPath(path);
  return normalized === "/" ? PRODUCTION_ORIGIN : PRODUCTION_ORIGIN + normalized;
}

/** Vercel preview builds are always excluded from indexing. */
export function isVercelPreview(): boolean {
  return process.env.VERCEL_ENV === "preview";
}
