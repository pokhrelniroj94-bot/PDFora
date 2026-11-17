/** Canonical production URL helpers shared by metadata, sitemap and robots. */
export const PRODUCTION_ORIGIN = "https://pd-fora.vercel.app" as const;

export function normalizeSeoPath(path: string): string {
  const value = path.split(/[?#]/, 1)[0]?.trim() || "/";
  const parts = value.split("/").filter(Boolean);
  return parts.length ? "/" + parts.join("/") : "/";
}

/** Always emits a production URL; preview hostnames must never become canonicals. */
export function productionUrl(path: string): string {
  const normalized = normalizeSeoPath(path);
  return normalized === "/" ? PRODUCTION_ORIGIN : PRODUCTION_ORIGIN + normalized;
}

/** True only for Vercel preview builds; local tests remain deterministic. */
export function isVercelPreview(): boolean {
  return process.env.VERCEL_ENV === "preview";
}
