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
