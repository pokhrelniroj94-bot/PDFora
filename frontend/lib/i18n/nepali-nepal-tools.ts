export const GRAMS_PER_TOLA = 11.6638038;

export interface NepalMobileNumberResult {
  digits: string;
  valid: boolean;
  local: string | null;
  international: string | null;
}

/** Validate the common 10-digit Nepal mobile-number format; this does not check SIM status. */
export function validateNepalMobileNumber(input: string): NepalMobileNumberResult {
  const asciiInput = input.replace(/[०-९]/g, (digit) => String("०१२३४५६७८९".indexOf(digit)));
  const compact = asciiInput.trim().replace(/[\s()-]/g, "");
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

export interface NepalElectricityBillEstimate {
  energyCharge: number;
  minimumCharge: number;
  earlyPaymentRebate: number;
  vatEstimate: number;
  estimatedTotal: number;
}

/** Reproduces the site's disclosed single-phase domestic estimate; not an official bill. */
export function estimateNepalDomesticElectricityBill(
  units: number,
  meter: "5A" | "15A" | "30A" | "60A",
  applyEarlyPaymentRebate: boolean,
): NepalElectricityBillEstimate {
  if (!Number.isFinite(units) || units < 0 || units > 100000) {
    throw new RangeError("Monthly units must be between 0 and 100,000.");
  }
  const meterIndex = ["5A", "15A", "30A", "60A"].indexOf(meter);
  if (meterIndex < 0) throw new RangeError("Unsupported meter capacity.");
  const minimumByBand = [
    [30, 50, 50, 75, 100, 150],
    [50, 75, 75, 100, 125, 175],
    [75, 100, 100, 125, 150, 200],
    [125, 125, 125, 150, 200, 250],
  ];
  const bands = [
    { max: 20, rate: [0, 4, 5, 6][meterIndex] },
    { max: 30, rate: 6.5 },
    { max: 50, rate: 8 },
    { max: 100, rate: 9.5 },
    { max: 250, rate: 9.5 },
    { max: Number.POSITIVE_INFINITY, rate: 11 },
  ];
  let prior = 0;
  let energyCharge = 0;
  let above50Energy = 0;
  for (const band of bands) {
    const inBand = Math.max(0, Math.min(units, band.max) - prior);
    energyCharge += inBand * band.rate;
    if (band.max > 50) above50Energy += inBand * band.rate;
    prior = band.max;
    if (units <= band.max) break;
  }
  if (meter === "5A" && units > 20) energyCharge += 20 * 3;
  const bandIndex = units <= 20 ? 0 : units <= 30 ? 1 : units <= 50 ? 2 : units <= 100 ? 3 : units <= 250 ? 4 : 5;
  const minimumCharge = minimumByBand[meterIndex][bandIndex];
  const subtotal = energyCharge + minimumCharge;
  const earlyPaymentRebate = applyEarlyPaymentRebate ? subtotal * 0.02 : 0;
  const vatEstimate = above50Energy * 0.05;
  return {
    energyCharge,
    minimumCharge,
    earlyPaymentRebate,
    vatEstimate,
    estimatedTotal: subtotal - earlyPaymentRebate + vatEstimate,
  };
}
