export type NepaliMathToolSlug =
  | "percentage-change-calculator" | "average-calculator" | "ratio-simplifier"
  | "fraction-calculator" | "percentage-of-number-calculator" | "gcd-lcm-calculator"
  | "prime-number-checker" | "unit-converter";

export type NepaliMathInputs = Record<string, string>;
const parse = (value: string) => value.trim() === "" ? NaN : Number(value);
const gcd = (left: number, right: number): number => {
  let a = Math.abs(Math.trunc(left));
  let b = Math.abs(Math.trunc(right));
  while (b !== 0) [a, b] = [b, a % b];
  return a;
};
const moneyNumber = (value: number) => Number.isFinite(value) ? value.toLocaleString("en-US", { maximumFractionDigits: 8 }) : "—";
const lengthToMeters: Record<string, number> = { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 };
const massToGrams: Record<string, number> = { g: 1, kg: 1000, lb: 453.59237 };

export function runNepaliMathTool(slug: NepaliMathToolSlug, values: NepaliMathInputs): string {
  if (slug === "percentage-change-calculator") {
    const from = parse(values.from ?? "");
    const to = parse(values.to ?? "");
    if (!Number.isFinite(from) || !Number.isFinite(to)) return "कृपया दुवै मान्य संख्या प्रविष्ट गर्नुहोस्।";
    if (from === 0) return to === 0 ? "प्रतिशत परिवर्तन: ०% (परिवर्तन छैन)।" : "सुरुको मान ० भएकाले प्रतिशत परिवर्तन गणना गर्न सकिँदैन।";
    const change = ((to - from) / Math.abs(from)) * 100;
    return `परिवर्तन: ${moneyNumber(to - from)}\nप्रतिशत परिवर्तन: ${moneyNumber(change)}%\nस्थिति: ${change > 0 ? "वृद्धि" : change < 0 ? "घटेको" : "परिवर्तन छैन"}`;
  }
  if (slug === "average-calculator") {
    const raw = (values.numbers ?? "").split(/[\s,;]+/).filter(Boolean);
    const numbers = raw.map(Number);
    if (!raw.length || numbers.some((number) => !Number.isFinite(number))) return "कृपया comma वा space ले छुट्याएका मान्य संख्या प्रविष्ट गर्नुहोस्।";
    const sum = numbers.reduce((total, number) => total + number, 0);
    return `संख्या: ${numbers.length}\nजम्मा: ${moneyNumber(sum)}\nऔसत: ${moneyNumber(sum / numbers.length)}`;
  }
  if (slug === "ratio-simplifier") {
    const a = parse(values.a ?? "");
    const b = parse(values.b ?? "");
    if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a < 0 || b < 0 || (a === 0 && b === 0)) return "० वा ऋणात्मक दुवै अनुपात नदिनुहोस्; पूर्णांक प्रविष्ट गर्नुहोस्।";
    const divisor = gcd(a, b);
    return `सरल अनुपात: ${a / divisor} : ${b / divisor}\nसाझा भाजक: ${divisor}`;
  }
  if (slug === "fraction-calculator") {
    const a = parse(values.a ?? ""), b = parse(values.b ?? ""), c = parse(values.c ?? ""), d = parse(values.d ?? "");
    const operation = values.operation ?? "add";
    if (![a, b, c, d].every(Number.isSafeInteger) || b === 0 || d === 0) return "अंश र हर पूर्णांक हुनुपर्छ र हर ० हुनु हुँदैन।";
    if (operation === "divide" && c === 0) return "० अंश भएको भिन्नले भाग गर्न मिल्दैन।";
    let numerator = 0, denominator = 1;
    if (operation === "add") { numerator = a * d + c * b; denominator = b * d; }
    else if (operation === "subtract") { numerator = a * d - c * b; denominator = b * d; }
    else if (operation === "multiply") { numerator = a * c; denominator = b * d; }
    else { numerator = a * d; denominator = b * c; }
    if (denominator < 0) { numerator *= -1; denominator *= -1; }
    const divisor = gcd(numerator, denominator) || 1;
    numerator /= divisor; denominator /= divisor;
    return `सरल नतिजा: ${numerator}/${denominator}\nदशमलव: ${moneyNumber(numerator / denominator)}`;
  }
  if (slug === "percentage-of-number-calculator") {
    const number = parse(values.number ?? ""), percentage = parse(values.percentage ?? "");
    if (!Number.isFinite(number) || !Number.isFinite(percentage)) return "कृपया मान्य संख्या र प्रतिशत प्रविष्ट गर्नुहोस्।";
    return `${moneyNumber(number)} को ${moneyNumber(percentage)}% = ${moneyNumber(number * percentage / 100)}`;
  }
  if (slug === "gcd-lcm-calculator") {
    const a = parse(values.a ?? ""), b = parse(values.b ?? "");
    if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || (a === 0 && b === 0)) return "दुई पूर्णांक प्रविष्ट गर्नुहोस्; दुवै ० हुन सक्दैनन्।";
    const divisor = gcd(a, b);
    const multiple = divisor === 0 ? 0 : Math.abs((a / divisor) * b);
    return `महत्तम समापवर्तक (GCD): ${divisor}\nलघुत्तम समापवर्त्य (LCM): ${multiple}`;
  }
  if (slug === "prime-number-checker") {
    const value = parse(values.number ?? "");
    if (!Number.isSafeInteger(value) || value < 0) return "० वा ऋणात्मक होइन, मान्य गैर-ऋणात्मक पूर्णांक प्रविष्ट गर्नुहोस्।";
    if (value < 2) return `${value} अभाज्य संख्या होइन।`;
    for (let divisor = 2; divisor <= Math.sqrt(value); divisor += 1) if (value % divisor === 0) return `${value} अभाज्य संख्या होइन।\n${divisor} ले निःशेष भाग गर्छ।`;
    return `${value} अभाज्य संख्या हो।`;
  }
  if (slug === "unit-converter") {
    const amount = parse(values.amount ?? "");
    const from = values.from ?? "m", to = values.to ?? "km";
    if (!Number.isFinite(amount)) return "कृपया मान्य संख्या प्रविष्ट गर्नुहोस्।";
    const fromFactor = lengthToMeters[from] ?? massToGrams[from];
    const toFactor = lengthToMeters[to] ?? massToGrams[to];
    const sameDimension = Boolean(lengthToMeters[from] && lengthToMeters[to]) || Boolean(massToGrams[from] && massToGrams[to]);
    if (!sameDimension || !fromFactor || !toFactor) return "एउटै प्रकारका एकाइ छान्नुहोस् (लम्बाइ वा तौल)।";
    return `${moneyNumber(amount)} ${from} = ${moneyNumber(amount * fromFactor / toFactor)} ${to}`;
  }
  return "";
}
