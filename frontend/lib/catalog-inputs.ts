export function parseRequiredNumber(value: string): number {
  if (!value.trim()) throw new Error("Enter a number; blank fields are not treated as zero.");
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error("Enter a valid finite number.");
  return parsed;
}

export function parseNumberList(value: string): number[] {
  const input = value.trim();
  if (!input) throw new Error("Enter at least one number.");
  if (/^[,;]|[,;]\\s*[,;]|[,;]$/.test(input)) {
    throw new Error("Check the list separators; do not leave an empty value.");
  }
  const tokens = input.split(/[\\s,;]+/);
  if (tokens.length > 10000) throw new Error("Enter no more than 10,000 numbers at a time.");
  const values = tokens.map((token) => Number(token));
  if (values.some((number) => !Number.isFinite(number))) {
    throw new Error("Use only valid finite numbers separated by commas, semicolons or spaces.");
  }
  return values;
}

export function jsonToYaml(value: unknown): string {
  const scalar = (item: unknown): string => JSON.stringify(item) ?? "null";
  const emit = (item: unknown, indent: number): string => {
    const pad = " ".repeat(indent);
    if (Array.isArray(item)) {
      if (!item.length) return pad + "[]";
      return item.map((entry) => {
        if (Array.isArray(entry) && entry.length || entry && typeof entry === "object" && Object.keys(entry as object).length) {
          return pad + "-\n" + emit(entry, indent + 2);
        }
        return pad + "- " + scalar(entry);
      }).join("\n");
    }
    if (item && typeof item === "object") {
      const entries = Object.entries(item as Record<string, unknown>);
      if (!entries.length) return pad + "{}";
      return entries.map(([key, entry]) => {
        const safeKey = scalar(key);
        if (Array.isArray(entry) && entry.length || entry && typeof entry === "object" && Object.keys(entry as object).length) {
          return pad + safeKey + ":\n" + emit(entry, indent + 2);
        }
        return pad + safeKey + ": " + scalar(entry);
      }).join("\n");
    }
    return pad + scalar(item);
  };
  return emit(value, 0);
}

export function randomIntegerBelow(maxExclusive: number, randomUint32: () => number): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > 0x100000000) {
    throw new Error("Random range must be an integer between 1 and 2^32.");
  }
  const range = 0x100000000;
  const limit = Math.floor(range / maxExclusive) * maxExclusive;
  let value: number;
  do {
    value = randomUint32();
    if (!Number.isInteger(value) || value < 0 || value >= range) throw new Error("Random source must return an unsigned 32-bit integer.");
  } while (value >= limit);
  return value % maxExclusive;
}
