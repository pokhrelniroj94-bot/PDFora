export function loanEmi(principal: number, annualRate: number, months: number): number {
  if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(annualRate) || annualRate < 0 ||
      !Number.isSafeInteger(months) || months <= 0 || months > 1200) {
    throw new Error("Enter a positive loan amount, a non-negative interest rate and a whole-number loan term above zero.");
  }
  const monthlyRate = annualRate / 1200;
  const payment = monthlyRate === 0
    ? principal / months
    : principal * monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate));
  if (!Number.isFinite(payment)) throw new Error("The EMI result exceeds the supported numeric range.");
  return payment;
}

export function sipFutureValue(monthly: number, years: number, annualRate: number, initial: number): number {
  if (![monthly, years, annualRate, initial].every(Number.isFinite) ||
      monthly < 0 || years <= 0 || years > 100 || annualRate < 0 || initial < 0) {
    throw new Error("Enter non-negative investments and return, with a term from 0 to 100 years.");
  }
  const periods = years * 12;
  if (!Number.isSafeInteger(periods)) throw new Error("Investment term must resolve to a whole number of months.");
  const rate = annualRate / 1200;
  const exponent = periods * Math.log1p(rate);
  const growth = Math.exp(exponent);
  const contributionGrowth = rate === 0 ? periods : Math.expm1(exponent) / rate;
  const value = initial * growth + monthly * contributionGrowth;
  if (!Number.isFinite(value)) throw new Error("The projected value exceeds the supported numeric range.");
  return value;
}

export function discountedPrice(price: number, discount: number): { final: number; saved: number } {
  if (!Number.isFinite(price) || !Number.isFinite(discount) || price < 0 || discount < 0 || discount > 100) {
    throw new Error("Enter a non-negative price and a discount from 0–100%.");
  }
  const saved = price * (discount / 100);
  const final = price - saved;
  if (!Number.isFinite(saved) || !Number.isFinite(final)) throw new Error("Discount result exceeds the supported numeric range.");
  return { final, saved };
}

export function percentageChange(original: number, next: number): number {
  if (!Number.isFinite(original) || !Number.isFinite(next) || original === 0) {
    throw new Error("Original value cannot be zero.");
  }
  const baseline = Math.abs(original);
  const change = next / baseline - original / baseline;
  const percentage = change * 100;
  if (!Number.isFinite(percentage)) throw new Error("Percentage change exceeds the supported numeric range.");
  return percentage;
}

export function average(values: number[]): { mean: number; median: number; mode: number[]; range: number } {
  if (!values.length || values.some((value) => !Number.isFinite(value))) throw new Error("Enter at least one valid number.");
  const sorted = [...values].sort((a, b) => a - b);
  const counts = new Map<number, number>();
  let maximum = 0;
  for (const value of values) {
    const count = (counts.get(value) ?? 0) + 1;
    counts.set(value, count);
    if (count > maximum) maximum = count;
  }
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2
    ? sorted[middle]
    : sorted[middle - 1] / 2 + sorted[middle] / 2;
  const mean = values.reduce((sum, value) => sum + value / values.length, 0);
  const range = sorted[sorted.length - 1] - sorted[0];
  if (![mean, median, range].every(Number.isFinite)) throw new Error("Statistics exceed the supported numeric range.");
  return {
    mean,
    median,
    mode: maximum === 1 ? [] : [...counts].filter(([, count]) => count === maximum).map(([value]) => value),
    range,
  };
}

export function gcd(a: number, b: number): number {
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) throw new Error("GCD requires safe whole numbers.");
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right !== 0) {
    const remainder = left % right;
    left = right;
    right = remainder;
  }
  return left;
}

function bigintGcd(a: bigint, b: bigint): bigint {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) {
    const remainder = left % right;
    left = right;
    right = remainder;
  }
  return left || 1n;
}

export function simplifyRatio(a: number, b: number): string {
  if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || b === 0) {
    throw new Error("Use safe whole numbers and a non-zero second value.");
  }
  let numerator = BigInt(a);
  let denominator = BigInt(b);
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = bigintGcd(numerator, denominator);
  return `${numerator / divisor}:${denominator / divisor}`;
}

export function fractionOperation(a: number, b: number, c: number, d: number, operation: string): { numerator: number; denominator: number; value: number } {
  if (![a, b, c, d].every(Number.isSafeInteger) || b === 0 || d === 0) {
    throw new Error("Use safe whole-number numerators and non-zero whole-number denominators.");
  }
  const leftNumerator = BigInt(a);
  const leftDenominator = BigInt(b);
  const rightNumerator = BigInt(c);
  const rightDenominator = BigInt(d);
  let numerator: bigint;
  let denominator: bigint;
  if (operation === "+") { numerator = leftNumerator * rightDenominator + rightNumerator * leftDenominator; denominator = leftDenominator * rightDenominator; }
  else if (operation === "-") { numerator = leftNumerator * rightDenominator - rightNumerator * leftDenominator; denominator = leftDenominator * rightDenominator; }
  else if (operation === "*") { numerator = leftNumerator * rightNumerator; denominator = leftDenominator * rightDenominator; }
  else if (operation === "/") {
    if (rightNumerator === 0n) throw new Error("Cannot divide by zero.");
    numerator = leftNumerator * rightDenominator;
    denominator = leftDenominator * rightNumerator;
  } else throw new Error("Operation must be +, -, *, or /.");
  if (denominator === 0n) throw new Error("Fraction denominator cannot be zero.");
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = bigintGcd(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  const maxSafe = BigInt(Number.MAX_SAFE_INTEGER);
  if (reducedNumerator > maxSafe || reducedNumerator < -maxSafe || reducedDenominator > maxSafe) {
    throw new Error("Fraction result exceeds the safe integer range.");
  }
  const resultNumerator = Number(reducedNumerator);
  const resultDenominator = Number(reducedDenominator);
  const value = resultNumerator / resultDenominator;
  if (!Number.isFinite(value)) throw new Error("Fraction value exceeds the supported numeric range.");
  return { numerator: resultNumerator, denominator: resultDenominator, value };
}

export function convertUnit(value: number, from: string, to: string): number {
  if (!Number.isFinite(value)) throw new Error("Enter valid numbers.");
  const units: Record<string, [string, number]> = {
    m: ["length", 1], km: ["length", 1000], cm: ["length", 0.01], mm: ["length", 0.001],
    in: ["length", 0.0254], ft: ["length", 0.3048], kg: ["weight", 1], g: ["weight", 0.001],
    lb: ["weight", 0.45359237], l: ["volume", 1], ml: ["volume", 0.001],
  };
  let converted: number;
  if (from === "c" || from === "f" || to === "c" || to === "f") {
    if ((from !== "c" && from !== "f") || (to !== "c" && to !== "f")) {
      throw new Error("Temperature units cannot be mixed with length, weight or volume units.");
    }
    converted = from === to ? value : from === "c" ? value * 9 / 5 + 32 : (value - 32) * 5 / 9;
  } else {
    if (!units[from] || !units[to] || units[from][0] !== units[to][0]) throw new Error("Choose compatible supported units.");
    if (value < 0) throw new Error("Length, weight and volume values cannot be negative.");
    converted = value * units[from][1] / units[to][1];
  }
  if (!Number.isFinite(converted)) throw new Error("Converted value exceeds the supported numeric range.");
  return converted;
}

export function bmi(weightKg: number, heightCm: number): number {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || weightKg <= 0 || heightCm <= 0) {
    throw new Error("Weight and height must be positive.");
  }
  const result = weightKg / (heightCm / 100) ** 2;
  if (!Number.isFinite(result)) throw new Error("BMI result exceeds the supported numeric range.");
  return result;
}

export function bmr(weightKg: number, heightCm: number, age: number, female: boolean): number {
  if (![weightKg, heightCm, age].every(Number.isFinite) || weightKg <= 0 || heightCm <= 0 || !Number.isSafeInteger(age) || age <= 0) {
    throw new Error("Enter positive weight, height and age.");
  }
  const result = 10 * weightKg + 6.25 * heightCm - 5 * age + (female ? -161 : 5);
  if (!Number.isFinite(result)) throw new Error("BMR result exceeds the supported numeric range.");
  return result;
}

export function businessDaysInclusive(start: string, end: string): number {
  const parseDate = (value: string): Date => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Enter dates in YYYY-MM-DD format.");
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(0);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCFullYear(year, month - 1, day);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      throw new Error("Enter valid calendar dates.");
    }
    return date;
  };
  const current = parseDate(start);
  const target = parseDate(end);
  if (Math.abs(target.getTime() - current.getTime()) > 36525 * 24 * 60 * 60 * 1000) {
    throw new Error("Date range must not exceed 100 years.");
  }
  const direction = current <= target ? 1 : -1;
  let count = 0;
  while (direction > 0 ? current <= target : current >= target) {
    const weekday = current.getUTCDay();
    if (weekday !== 0 && weekday !== 6) count += 1;
    current.setUTCDate(current.getUTCDate() + direction);
  }
  return count;
}

