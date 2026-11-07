export function loanEmi(principal: number, annualRate: number, months: number): number {
  if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(annualRate) || annualRate < 0 ||
      !Number.isInteger(months) || months <= 0 || months > 1200) {
    throw new Error("Enter a positive loan amount, a non-negative interest rate and a whole-number loan term above zero.");
  }
  const monthlyRate = annualRate / 1200;
  return monthlyRate === 0
    ? principal / months
    : principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1);
}

export function sipFutureValue(monthly: number, years: number, annualRate: number, initial: number): number {
  if (![monthly, years, annualRate, initial].every(Number.isFinite) ||
      monthly < 0 || years <= 0 || years > 100 || annualRate < 0 || initial < 0) {
    throw new Error("Enter non-negative investments and return, with a term from 0 to 100 years.");
  }
  const periods = years * 12;
  const rate = annualRate / 1200;
  let value = initial * (1 + rate) ** periods;
  for (let index = 1; index <= periods; index += 1) {
    value += monthly * (1 + rate) ** (periods - index);
  }
  return value;
}

export function discountedPrice(price: number, discount: number): { final: number; saved: number } {
  if (!Number.isFinite(price) || !Number.isFinite(discount) || price < 0 || discount < 0 || discount > 100) {
    throw new Error("Enter a non-negative price and a discount from 0–100%.");
  }
  const saved = price * discount / 100;
  return { final: price - saved, saved };
}

export function percentageChange(original: number, next: number): number {
  if (!Number.isFinite(original) || !Number.isFinite(next) || original === 0) {
    throw new Error("Original value cannot be zero.");
  }
  return (next - original) / Math.abs(original) * 100;
}

export function average(values: number[]): { mean: number; median: number; mode: number[]; range: number } {
  if (!values.length || values.some((value) => !Number.isFinite(value))) throw new Error("Enter at least one valid number.");
  const sorted = [...values].sort((a, b) => a - b);
  const counts = new Map<number, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  const maximum = Math.max(...counts.values());
  return {
    mean: values.reduce((sum, value) => sum + value, 0) / values.length,
    median: sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2,
    mode: maximum === 1 ? [] : [...counts].filter(([, count]) => count === maximum).map(([value]) => value),
    range: sorted[sorted.length - 1] - sorted[0],
  };
}

export function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}

export function simplifyRatio(a: number, b: number): string {
  if (!Number.isInteger(a) || !Number.isInteger(b) || !a || !b) throw new Error("Use non-zero whole numbers.");
  const divisor = gcd(a, b);
  return `${a / divisor}:${b / divisor}`;
}

export function fractionOperation(a: number, b: number, c: number, d: number, operation: string): { numerator: number; denominator: number; value: number } {
  if (![a, b, c, d].every(Number.isSafeInteger) || !b || !d) {
    throw new Error("Use safe whole-number numerators and non-zero whole-number denominators.");
  }
  let numerator: number;
  let denominator: number;
  if (operation === "+") { numerator = a * d + c * b; denominator = b * d; }
  else if (operation === "-") { numerator = a * d - c * b; denominator = b * d; }
  else if (operation === "*") { numerator = a * c; denominator = b * d; }
  else if (operation === "/") {
    if (!c) throw new Error("Cannot divide by zero.");
    numerator = a * d; denominator = b * c;
  } else throw new Error("Operation must be +, -, * or /.");
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator === 0) {
    throw new Error("Fraction result exceeds the safe integer range.");
  }
  if (denominator < 0) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor, value: numerator / denominator };
}

export function convertUnit(value: number, from: string, to: string): number {
  if (!Number.isFinite(value)) throw new Error("Enter valid numbers.");
  const units: Record<string, [string, number]> = {
    m: ["length", 1], km: ["length", 1000], cm: ["length", 0.01], mm: ["length", 0.001],
    in: ["length", 0.0254], ft: ["length", 0.3048], kg: ["weight", 1], g: ["weight", 0.001],
    lb: ["weight", 0.45359237], l: ["volume", 1], ml: ["volume", 0.001],
  };
  if (from === "c" || from === "f" || to === "c" || to === "f") {
    if ((from !== "c" && from !== "f") || (to !== "c" && to !== "f")) {
      throw new Error("Temperature units cannot be mixed with length, weight or volume units.");
    }
    return from === to ? value : from === "c" ? value * 9 / 5 + 32 : (value - 32) * 5 / 9;
  }
  if (!units[from] || !units[to] || units[from][0] !== units[to][0]) throw new Error("Choose compatible supported units.");
  if (value < 0) throw new Error("Length, weight and volume values cannot be negative.");
  return value * units[from][1] / units[to][1];
}

export function bmi(weightKg: number, heightCm: number): number {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || weightKg <= 0 || heightCm <= 0) {
    throw new Error("Weight and height must be positive.");
  }
  return weightKg / (heightCm / 100) ** 2;
}

export function bmr(weightKg: number, heightCm: number, age: number, female: boolean): number {
  if (![weightKg, heightCm, age].every(Number.isFinite) || weightKg <= 0 || heightCm <= 0 || age <= 0) {
    throw new Error("Enter positive weight, height and age.");
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (female ? -161 : 5);
}

export function businessDaysInclusive(start: string, end: string): number {
  const parseDate = (value: string): Date => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Enter dates in YYYY-MM-DD format.");
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      throw new Error("Enter valid calendar dates.");
    }
    return date;
  };
  const current = parseDate(start);
  const target = parseDate(end);
  const direction = current <= target ? 1 : -1;
  let count = 0;
  while (direction > 0 ? current <= target : current >= target) {
    const weekday = current.getUTCDay();
    if (weekday !== 0 && weekday !== 6) count += 1;
    current.setUTCDate(current.getUTCDate() + direction);
  }
  return count;
}
