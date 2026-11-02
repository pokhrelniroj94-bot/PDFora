export type SalaryTaxResult = {
  tax: number;
  effectiveRate: number;
  breakdown: Array<{ taxable: number; rate: number; tax: number }>;
};

/** FY 2083/84 resident natural-person bands published by Nepal IRD. */
export function calculateNepalSalaryTax(
  taxableIncome: number,
  firstBandExempt = false,
): SalaryTaxResult {
  if (!Number.isFinite(taxableIncome) || taxableIncome < 0 || taxableIncome > 1_000_000_000) {
    throw new RangeError("Taxable income must be between NPR 0 and NPR 1,000,000,000.");
  }
  const bands = [
    { limit: 1_000_000, rate: firstBandExempt ? 0 : 0.01 },
    { limit: 500_000, rate: 0.10 },
    { limit: 1_000_000, rate: 0.20 },
    { limit: 1_500_000, rate: 0.27 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.29 },
  ];
  let remaining = taxableIncome;
  let tax = 0;
  const breakdown = bands.map(({ limit, rate }) => {
    const taxable = Math.min(remaining, limit);
    remaining -= taxable;
    const bandTax = taxable * rate;
    tax += bandTax;
    return { taxable, rate, tax: bandTax };
  }).filter((item) => item.taxable > 0);
  return { tax, effectiveRate: taxableIncome > 0 ? tax / taxableIncome * 100 : 0, breakdown };
}

export function calculateSimpleInterest(principal: number, annualRatePercent: number, years: number) {
  for (const [name, value] of [["Principal", principal], ["Annual rate", annualRatePercent], ["Years", years]] as const) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(name + " must be a finite, non-negative number.");
  }
  const interest = principal * annualRatePercent * years / 100;
  return { interest, total: principal + interest };
}

function parseDateOnly(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError("Enter a valid date in YYYY-MM-DD format.");
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new RangeError("Enter a real calendar date.");
  }
  return date;
}

/** Count weekdays inclusively. weekendDays uses JavaScript UTC day numbers (Sun=0 ... Sat=6). */
export function countBusinessDays(start: string, end: string, weekendDays: number[] = [0, 6]): number {
  const from = parseDateOnly(start);
  const to = parseDateOnly(end);
  const weekends = new Set(weekendDays);
  if ([...weekends].some((day) => !Number.isInteger(day) || day < 0 || day > 6)) {
    throw new RangeError("Weekend days must be integers from 0 to 6.");
  }
  const direction = from <= to ? 1 : -1;
  let count = 0;
  for (let time = from.getTime(); direction > 0 ? time <= to.getTime() : time >= to.getTime(); time += direction * 86_400_000) {
    if (!weekends.has(new Date(time).getUTCDay())) count += direction;
  }
  return Math.abs(count);
}

export function addCalendarDays(start: string, days: number): string {
  const date = parseDateOnly(start);
  if (!Number.isSafeInteger(days)) throw new RangeError("Days must be a whole safe integer.");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export type NepalDomesticMeter = "5A" | "15A" | "30A" | "60A";
export type NepalDomesticBill = {
  energy: number;
  minimum: number;
  rebate: number;
  vat: number;
  total: number;
};

/** Nepal FY 2083/84 single-phase domestic estimate; confirm against current ERC/NEA notices. */
export function calculateNepalDomesticElectricityBill(
  units: number,
  meter: NepalDomesticMeter,
  earlyPaymentRebate = true,
): NepalDomesticBill {
  if (!Number.isFinite(units) || units < 0 || units > 100_000) {
    throw new RangeError("Monthly units must be between 0 and 100,000.");
  }
  const meterIndex = (["5A", "15A", "30A", "60A"] as const).indexOf(meter);
  if (meterIndex < 0) throw new RangeError("Choose a supported single-phase meter capacity.");
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
  let energy = 0;
  let above50Energy = 0;
  for (const band of bands) {
    const inBand = Math.max(0, Math.min(units, band.max) - prior);
    energy += inBand * band.rate;
    if (band.max > 50) above50Energy += inBand * band.rate;
    prior = band.max;
    if (units <= band.max) break;
  }
  if (meter === "5A" && units > 20) energy += 20 * 3;
  const bandIndex = units <= 20 ? 0 : units <= 30 ? 1 : units <= 50 ? 2 : units <= 100 ? 3 : units <= 250 ? 4 : 5;
  const minimum = minimumByBand[meterIndex][bandIndex];
  const subtotal = energy + minimum;
  const rebate = earlyPaymentRebate ? subtotal * 0.02 : 0;
  const vat = above50Energy * 0.05;
  return { energy, minimum, rebate, vat, total: subtotal - rebate + vat };
}
