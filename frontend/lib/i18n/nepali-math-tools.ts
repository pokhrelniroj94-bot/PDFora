export type NepaliMathToolSlug =
  | "percentage-change-calculator" | "average-calculator" | "ratio-simplifier"
  | "fraction-calculator" | "percentage-of-number-calculator" | "gcd-lcm-calculator"
  | "prime-number-checker" | "unit-converter" | "bmi-calculator" | "bmr-calculator" | "tip-calculator" | "split-bill-calculator" | "simple-interest-calculator";

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
    if (!Number.isFinite(change)) return "प्रविष्ट गरिएको मानको दायरा धेरै ठूलो छ।";
    return `परिवर्तन: ${moneyNumber(to - from)}\nप्रतिशत परिवर्तन: ${moneyNumber(change)}%\nस्थिति: ${change > 0 ? "वृद्धि" : change < 0 ? "घटेको" : "परिवर्तन छैन"}`;
  }
  if (slug === "average-calculator") {
    const raw = (values.numbers ?? "").split(/[\s,;]+/).filter(Boolean);
    const numbers = raw.map(Number);
    if (!raw.length || numbers.some((number) => !Number.isFinite(number))) return "कृपया comma वा space ले छुट्याएका मान्य संख्या प्रविष्ट गर्नुहोस्।";
    const sum = numbers.reduce((total, number) => total + number, 0);
    if (!Number.isFinite(sum)) return "संख्याहरूको जम्मा गणना गर्न दायरा धेरै ठूलो छ।";
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
    if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) return "भिन्नको गणना सुरक्षित पूर्णांक सीमाभन्दा ठूलो भयो।";
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
    if (!Number.isSafeInteger(multiple)) return "LCM सुरक्षित पूर्णांक सीमाभन्दा ठूलो भयो।";
    return `महत्तम समापवर्तक (GCD): ${divisor}\nलघुत्तम समापवर्त्य (LCM): ${multiple}`;
  }
  if (slug === "prime-number-checker") {
    const value = parse(values.number ?? "");
    if (!Number.isSafeInteger(value) || value < 0) return "मान्य गैर-ऋणात्मक पूर्णांक प्रविष्ट गर्नुहोस्।";
    if (value < 2) return `${value} अभाज्य संख्या होइन।`;
    if (value > 1_000_000_000_000) return "यो जाँचका लागि संख्या १,०००,०००,०००,००० भन्दा सानो हुनुपर्छ।";
    for (let divisor = 2; divisor <= Math.sqrt(value); divisor += 1) if (value % divisor === 0) return `${value} अभाज्य संख्या होइन।\n${divisor} ले निःशेष भाग गर्छ।`;
    return `${value} अभाज्य संख्या हो।`;
  }
  if (slug === "unit-converter") {
    const amount = parse(values.amount ?? "");
    const from = values.fromUnit ?? "m", to = values.toUnit ?? "km";
    if (!Number.isFinite(amount)) return "कृपया मान्य संख्या प्रविष्ट गर्नुहोस्।";
    const fromFactor = lengthToMeters[from] ?? massToGrams[from];
    const toFactor = lengthToMeters[to] ?? massToGrams[to];
    const sameDimension = Boolean(lengthToMeters[from] && lengthToMeters[to]) || Boolean(massToGrams[from] && massToGrams[to]);
    if (!sameDimension || !fromFactor || !toFactor) return "एउटै प्रकारका एकाइ छान्नुहोस् (लम्बाइ वा तौल)।";
    const converted = amount * fromFactor / toFactor;
    if (!Number.isFinite(converted)) return "रूपान्तरणको नतिजा संख्या सीमाभन्दा बाहिर छ।";
    return `${moneyNumber(amount)} ${from} = ${moneyNumber(converted)} ${to}`;
  }

  if (slug === "bmi-calculator") {
    const weight = parse(values.weight ?? ""), heightCm = parse(values.height ?? "");
    if (!Number.isFinite(weight) || !Number.isFinite(heightCm) || weight < 10 || weight > 300 || heightCm < 50 || heightCm > 250) return "तौल १०–३०० kg र उचाइ ५०–२५० cm बीचको मान्य संख्या हुनुपर्छ।";
    const bmi = weight / ((heightCm / 100) ** 2);
    const category = bmi < 18.5 ? "कम तौल" : bmi < 25 ? "सामान्य दायरा" : bmi < 30 ? "बढी तौल" : "मोटोपना दायरा";
    return `BMI: ${moneyNumber(bmi)} kg/m²\\nवर्ग: ${category}\\nयो वयस्कका लागि सामान्य screening सूचक मात्र हो; निदान होइन।`;
  }
  if (slug === "bmr-calculator") {
    const weight = parse(values.weight ?? ""), height = parse(values.height ?? ""), age = parse(values.age ?? "");
    if (!Number.isFinite(weight) || !Number.isFinite(height) || !Number.isInteger(age) || weight < 10 || weight > 300 || height < 50 || height > 250 || age < 18 || age > 100) return "तौल १०–३०० kg, उचाइ ५०–२५० cm र उमेर १८–१०० वर्ष हुनुपर्छ।";
    const base = 10 * weight + 6.25 * height - 5 * age;
    const bmr = base + (values.sex === "female" ? -161 : 5);
    return `अनुमानित BMR: ${moneyNumber(bmr)} kcal/day\\nयो आराम अवस्थामा शरीरले खर्च गर्ने ऊर्जाको सूत्रमा आधारित अनुमान हो, व्यक्तिगत आहार सल्लाह होइन।`;
  }
  if (slug === "tip-calculator") {
    const bill = parse(values.bill ?? ""), tip = parse(values.tip ?? ""), people = parse(values.people ?? "1");
    if (![bill, tip, people].every(Number.isFinite) || bill < 0 || tip < 0 || tip > 100 || !Number.isInteger(people) || people < 1 || people > 1000) return "बिल ० वा बढी, टिप ०–१००% र व्यक्ति १–१००० बीचको पूर्णांक हुनुपर्छ।";
    const gratuity = bill * tip / 100, total = bill + gratuity;
    return `टिप रकम: NPR ${moneyNumber(gratuity)}\\nकुल बिल: NPR ${moneyNumber(total)}\\nप्रति व्यक्ति: NPR ${moneyNumber(total / people)}`;
  }
  if (slug === "split-bill-calculator") {
    const total = parse(values.total ?? ""), people = parse(values.people ?? "");
    if (!Number.isFinite(total) || total < 0 || !Number.isInteger(people) || people < 1 || people > 1000) return "कुल बिल ० वा बढी र व्यक्ति संख्या १–१००० बीचको पूर्णांक हुनुपर्छ।";
    return `कुल बिल: NPR ${moneyNumber(total)}\\nव्यक्ति संख्या: ${people}\\nप्रति व्यक्ति तिर्नुपर्ने: NPR ${moneyNumber(total / people)}`;
  }
  if (slug === "simple-interest-calculator") {
    const principal = parse(values.principal ?? ""), rate = parse(values.rate ?? ""), years = parse(values.years ?? "");
    if (![principal, rate, years].every(Number.isFinite) || principal <= 0 || rate < 0 || years < 0 || years > 100) return "मूलधन सकारात्मक, ब्याजदर ० वा बढी र अवधि ०–१०० वर्ष हुनुपर्छ।";
    const interest = principal * rate * years / 100;
    return `साधारण ब्याज: NPR ${moneyNumber(interest)}\\nकुल रकम: NPR ${moneyNumber(principal + interest)}\\nसूत्र: मूलधन × दर × अवधि ÷ १००`;
  }
  return "";
}
