export const GRAMS_PER_TOLA = 11.6638038;

export interface NepalMobileNumberResult {
  digits: string;
  valid: boolean;
  local: string | null;
  international: string | null;
}

/** Validate the common 10-digit Nepal mobile-number format; this does not check SIM status. */
export function validateNepalMobileNumber(input: string): NepalMobileNumberResult {
  const compact = input.trim().replace(/[\s()-]/g, "");
  const digits = compact.startsWith("+977")
    ? compact.slice(4)
    : compact.startsWith("977")
      ? compact.slice(3)
      : compact;
  const valid = /^9[678]\d{8}$/.test(digits);
  return {
    digits,
    valid,
    local: valid ? digits : null,
    international: valid ? `+977 ${digits}` : null,
  };
}

/** Convert a non-negative weight between tola and grams using the standard factor. */
export function convertTolaGrams(value: number, from: "tola" | "gram"): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("Weight must be a finite, non-negative number.");
  }
  return from === "tola" ? value * GRAMS_PER_TOLA : value / GRAMS_PER_TOLA;
}
