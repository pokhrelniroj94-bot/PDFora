const romanPairs: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"],
  [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"],
  [5, "V"], [4, "IV"], [1, "I"],
];

export function toRoman(value: number): string {
  if (!Number.isSafeInteger(value) || value < 1 || value > 3999) {
    throw new Error("Enter a whole number from 1 to 3999.");
  }
  let remaining = value;
  let output = "";
  for (const [amount, symbol] of romanPairs) {
    while (remaining >= amount) {
      output += symbol;
      remaining -= amount;
    }
  }
  return output;
}

export function fromRoman(input: string): number {
  const value = input.trim().toUpperCase();
  if (!value || !/^[IVXLCDM]+$/.test(value)) throw new Error("Enter a valid Roman numeral.");
  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let index = 0; index < value.length; index += 1) {
    const current = values[value[index]];
    const next = values[value[index + 1]] ?? 0;
    total += current < next ? -current : current;
  }
  if (total < 1 || total > 3999 || toRoman(total) !== value) {
    throw new Error("Use canonical Roman numeral notation from I to MMMCMXCIX.");
  }
  return total;
}

export function convertRomanNumeral(input: string): string {
  const value = input.trim();
  if (!value) throw new Error("Enter a number or Roman numeral.");
  if (/^\\d+$/.test(value)) return toRoman(Number(value));
  return String(fromRoman(value));
}
