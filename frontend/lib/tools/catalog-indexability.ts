/**
 * Default-deny indexability for catalogue utility landing pages.
 *
 * A tool can be indexed only when it has a dedicated, reviewed page guide
 * (specific workflow, real example/formula, supported-input limits and
 * meaningful accuracy caveats), not merely unique metadata or templated
 * category advice. Add slugs only after editorial and functional review.
 */
export const indexableCatalogToolSlugs: ReadonlySet<string> = new Set([
  "nepse-technical-analysis",
  "nepali-date-converter",
  "nepali-vat-calculator",
  "nepali-number-converter",
  "nepal-phone-validator",
  "gold-tola-gram-converter",
  "nepali-digit-converter",
  "nepali-calendar",
  "loksewa-photo-resizer",
  "preeti-unicode-converter",
  "nepal-salary-tax-calculator",
  "nepal-electricity-bill-calculator",
  "nepal-public-holidays-2083",
  "nepali-unicode-typing",
  "neb-gpa-calculator",
  "nepal-land-area-converter",
  "nepal-share-calculator",
]);

export function isCatalogToolIndexable(slug: string): boolean {
  return indexableCatalogToolSlugs.has(slug);
}
