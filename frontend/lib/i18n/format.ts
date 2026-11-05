import { localeInfo, type Locale } from "./config";

/**
 * Formatting helpers. Digits default to Latin (0-9) in every locale so calculator and
 * tool output never changes numerals unexpectedly (Nepal tools, filenames, tables).
 * Pass digits: "native" only for purely decorative display.
 */
export type DigitMode = "latn" | "native";

export function intlTag(locale: Locale, digits: DigitMode = "latn"): string {
  const base = localeInfo[locale].intl;
  return digits === "latn" ? `${base}-u-nu-latn` : base;
}

export function formatNumber(locale: Locale, value: number, options: Intl.NumberFormatOptions & { digits?: DigitMode } = {}): string {
  const { digits, ...rest } = options;
  return new Intl.NumberFormat(intlTag(locale, digits), rest).format(value);
}

/** `currency` is an ISO 4217 code such as "NPR" or "USD". The amount is never converted. */
export function formatCurrency(locale: Locale, value: number, currency: string, options: Intl.NumberFormatOptions & { digits?: DigitMode } = {}): string {
  const { digits, ...rest } = options;
  return new Intl.NumberFormat(intlTag(locale, digits), { style: "currency", currency, ...rest }).format(value);
}

/**
 * Gregorian dates only. Bikram Sambat (BS) dates come from lib/nepali-date-converter
 * and must keep using that logic; this helper must not be used to derive them.
 */
export function formatDate(locale: Locale, value: Date | number, options: Intl.DateTimeFormatOptions & { digits?: DigitMode } = { dateStyle: "medium" }): string {
  const { digits, ...rest } = options;
  return new Intl.DateTimeFormat(intlTag(locale, digits), { calendar: "gregory", ...rest }).format(value);
}
