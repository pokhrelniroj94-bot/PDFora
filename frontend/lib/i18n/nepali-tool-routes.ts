export const nepaliLocalizedUtilitySlugs = [
  "nepali-digit-converter",
  "nepali-number-converter",
  "nepali-date-converter",
  "nepal-land-area-converter",
  "nepali-vat-calculator",
  "neb-gpa-calculator",
] as const;

export type NepaliLocalizedUtilitySlug = (typeof nepaliLocalizedUtilitySlugs)[number];
