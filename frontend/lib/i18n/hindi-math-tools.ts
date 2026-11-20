export type HindiMathToolSlug =
  | "percentage-change-calculator" | "average-calculator" | "ratio-simplifier"
  | "fraction-calculator" | "percentage-of-number-calculator" | "gcd-lcm-calculator"
  | "prime-number-checker" | "unit-converter" | "bmi-calculator" | "bmr-calculator" | "tip-calculator" | "split-bill-calculator" | "simple-interest-calculator";

export const hindiMathToolSlugs: readonly HindiMathToolSlug[] = [
  "percentage-change-calculator", "average-calculator", "ratio-simplifier",
  "fraction-calculator", "percentage-of-number-calculator", "gcd-lcm-calculator",
  "prime-number-checker", "unit-converter", "bmi-calculator", "bmr-calculator",
  "tip-calculator", "split-bill-calculator", "simple-interest-calculator",
];

export type HindiMathInputs = Record<string, string>;

const parse = (value: string) => (value.trim() === "" ? NaN : Number(value));
const gcd = (left: number, right: number): number => {
  let a = Math.abs(Math.trunc(left));
  let b = Math.abs(Math.trunc(right));
  while (b !== 0) [a, b] = [b, a % b];
  return a;
};
/** Lakh/crore digit grouping (1,00,000) with Western numerals, which is also the usual grouping in Nepal. Money is shown as NPR, matching the Nepali tools; no currency conversion is done. */
const num = (value: number) => (Number.isFinite(value) ? value.toLocaleString("en-IN", { maximumFractionDigits: 8 }) : "—");
const rupees = (value: number) => `NPR ${num(value)}`;
const lengthToMeters: Record<string, number> = { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 };
const massToGrams: Record<string, number> = { g: 1, kg: 1000, lb: 453.59237 };

/**
 * Hindi-language runner for the shared math calculators. The formulas are identical to the
 * English and Nepali versions; only the messages, number grouping and currency symbol differ.
 */
export function runHindiMathTool(slug: HindiMathToolSlug, values: HindiMathInputs): string {
  if (slug === "percentage-change-calculator") {
    const from = parse(values.from ?? "");
    const to = parse(values.to ?? "");
    if (!Number.isFinite(from) || !Number.isFinite(to)) return "कृपया दोनों मान्य संख्याएँ दर्ज करें।";
    if (from === 0) return to === 0 ? "प्रतिशत परिवर्तन: 0% (कोई बदलाव नहीं)।" : "शुरुआती मान 0 होने के कारण प्रतिशत परिवर्तन की गणना नहीं की जा सकती।";
    const change = ((to - from) / Math.abs(from)) * 100;
    if (!Number.isFinite(change)) return "दर्ज किया गया मान बहुत बड़ा है।";
    return `अंतर: ${num(to - from)}\nप्रतिशत परिवर्तन: ${num(change)}%\nस्थिति: ${change > 0 ? "बढ़ोतरी" : change < 0 ? "कमी" : "कोई बदलाव नहीं"}`;
  }
  if (slug === "average-calculator") {
    const raw = (values.numbers ?? "").split(/[\s,;]+/).filter(Boolean);
    const numbers = raw.map(Number);
    if (!raw.length || numbers.some((n) => !Number.isFinite(n))) return "कृपया कॉमा या स्पेस से अलग की हुई मान्य संख्याएँ दर्ज करें।";
    const sum = numbers.reduce((total, n) => total + n, 0);
    if (!Number.isFinite(sum)) return "संख्याओं का योग निकालने के लिए मान बहुत बड़े हैं।";
    return `संख्याओं की गिनती: ${numbers.length}\nयोग: ${num(sum)}\nऔसत: ${num(sum / numbers.length)}`;
  }
  if (slug === "ratio-simplifier") {
    const a = parse(values.a ?? "");
    const b = parse(values.b ?? "");
    if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a < 0 || b < 0 || (a === 0 && b === 0)) return "दोनों मान 0 या ऋणात्मक न हों; पूर्ण संख्याएँ दर्ज करें।";
    const divisor = gcd(a, b);
    return `सरलतम अनुपात: ${a / divisor} : ${b / divisor}\nमहत्तम समापवर्तक: ${divisor}`;
  }
  if (slug === "fraction-calculator") {
    const a = parse(values.a ?? ""), b = parse(values.b ?? ""), c = parse(values.c ?? ""), d = parse(values.d ?? "");
    const operation = values.operation ?? "add";
    if (![a, b, c, d].every(Number.isSafeInteger) || b === 0 || d === 0) return "अंश और हर पूर्ण संख्याएँ होनी चाहिए और हर 0 नहीं हो सकता।";
    if (operation === "divide" && c === 0) return "0 अंश वाले भिन्न से भाग नहीं दिया जा सकता।";
    let numerator = 0, denominator = 1;
    if (operation === "add") { numerator = a * d + c * b; denominator = b * d; }
    else if (operation === "subtract") { numerator = a * d - c * b; denominator = b * d; }
    else if (operation === "multiply") { numerator = a * c; denominator = b * d; }
    else { numerator = a * d; denominator = b * c; }
    if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator)) return "भिन्न की गणना सुरक्षित पूर्ण संख्या सीमा से बड़ी हो गई।";
    if (denominator < 0) { numerator *= -1; denominator *= -1; }
    const divisor = gcd(numerator, denominator) || 1;
    numerator /= divisor; denominator /= divisor;
    return `सरल रूप: ${numerator}/${denominator}\nदशमलव: ${num(numerator / denominator)}`;
  }
  if (slug === "percentage-of-number-calculator") {
    const number = parse(values.number ?? ""), percentage = parse(values.percentage ?? "");
    if (!Number.isFinite(number) || !Number.isFinite(percentage)) return "कृपया मान्य संख्या और प्रतिशत दर्ज करें।";
    return `${num(number)} का ${num(percentage)}% = ${num(number * percentage / 100)}`;
  }
  if (slug === "gcd-lcm-calculator") {
    const a = parse(values.a ?? ""), b = parse(values.b ?? "");
    if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || (a === 0 && b === 0)) return "दो पूर्ण संख्याएँ दर्ज करें; दोनों 0 नहीं हो सकतीं।";
    const divisor = gcd(a, b);
    const multiple = divisor === 0 ? 0 : Math.abs((a / divisor) * b);
    if (!Number.isSafeInteger(multiple)) return "LCM सुरक्षित पूर्ण संख्या सीमा से बड़ा हो गया।";
    return `महत्तम समापवर्तक (GCD): ${divisor}\nलघुत्तम समापवर्त्य (LCM): ${multiple}`;
  }
  if (slug === "prime-number-checker") {
    const value = parse(values.number ?? "");
    if (!Number.isSafeInteger(value) || value < 0) return "कृपया मान्य ऋणेतर पूर्ण संख्या दर्ज करें।";
    if (value < 2) return `${value} अभाज्य संख्या नहीं है।`;
    if (value > 1_000_000_000_000) return "इस जाँच के लिए संख्या 1,00,000,00,00,000 (10¹²) से छोटी या उसके बराबर होनी चाहिए।";
    for (let divisor = 2; divisor <= Math.sqrt(value); divisor += 1) if (value % divisor === 0) return `${value} अभाज्य संख्या नहीं है।\n${divisor} से पूरा भाग जाता है।`;
    return `${value} अभाज्य संख्या है।`;
  }
  if (slug === "unit-converter") {
    const amount = parse(values.amount ?? "");
    const from = values.fromUnit ?? "m", to = values.toUnit ?? "km";
    if (!Number.isFinite(amount)) return "कृपया मान्य संख्या दर्ज करें।";
    const fromFactor = lengthToMeters[from] ?? massToGrams[from];
    const toFactor = lengthToMeters[to] ?? massToGrams[to];
    const sameDimension = Boolean(lengthToMeters[from] && lengthToMeters[to]) || Boolean(massToGrams[from] && massToGrams[to]);
    if (!sameDimension || !fromFactor || !toFactor) return "एक ही प्रकार की इकाइयाँ चुनें (लंबाई या वज़न)।";
    const converted = amount * fromFactor / toFactor;
    if (!Number.isFinite(converted)) return "रूपांतरण का परिणाम संख्या सीमा से बाहर है।";
    return `${num(amount)} ${from} = ${num(converted)} ${to}`;
  }
  if (slug === "bmi-calculator") {
    const weight = parse(values.weight ?? ""), heightCm = parse(values.height ?? "");
    if (!Number.isFinite(weight) || !Number.isFinite(heightCm) || weight < 10 || weight > 300 || heightCm < 50 || heightCm > 250) return "वज़न 10–300 kg और लंबाई 50–250 cm के बीच की मान्य संख्या होनी चाहिए।";
    const bmi = weight / ((heightCm / 100) ** 2);
    const category = bmi < 18.5 ? "कम वज़न" : bmi < 25 ? "सामान्य सीमा" : bmi < 30 ? "अधिक वज़न" : "मोटापे की सीमा";
    return `BMI: ${num(bmi)} kg/m²\nश्रेणी: ${category}\nयह वयस्कों के लिए केवल एक सामान्य स्क्रीनिंग संकेतक है, चिकित्सकीय निदान नहीं।`;
  }
  if (slug === "bmr-calculator") {
    const weight = parse(values.weight ?? ""), height = parse(values.height ?? ""), age = parse(values.age ?? "");
    if (!Number.isFinite(weight) || !Number.isFinite(height) || !Number.isInteger(age) || weight < 10 || weight > 300 || height < 50 || height > 250 || age < 18 || age > 100) return "वज़न 10–300 kg, लंबाई 50–250 cm और आयु 18–100 वर्ष होनी चाहिए।";
    const base = 10 * weight + 6.25 * height - 5 * age;
    const bmr = base + (values.sex === "female" ? -161 : 5);
    return `अनुमानित BMR: ${num(bmr)} kcal/दिन\nयह आराम की अवस्था में शरीर द्वारा खर्च की जाने वाली ऊर्जा का सूत्र-आधारित अनुमान है, व्यक्तिगत आहार सलाह नहीं।`;
  }
  if (slug === "tip-calculator") {
    const bill = parse(values.bill ?? ""), tip = parse(values.tip ?? ""), people = parse(values.people ?? "1");
    if (![bill, tip, people].every(Number.isFinite) || bill < 0 || tip < 0 || tip > 100 || !Number.isInteger(people) || people < 1 || people > 1000) return "बिल 0 या अधिक, टिप 0–100% और व्यक्तियों की संख्या 1–1000 के बीच की पूर्ण संख्या होनी चाहिए।";
    const gratuity = bill * tip / 100, total = bill + gratuity;
    return `टिप की राशि: ${rupees(gratuity)}\nकुल बिल: ${rupees(total)}\nप्रति व्यक्ति: ${rupees(total / people)}`;
  }
  if (slug === "split-bill-calculator") {
    const total = parse(values.total ?? ""), people = parse(values.people ?? "");
    if (!Number.isFinite(total) || total < 0 || !Number.isInteger(people) || people < 1 || people > 1000) return "कुल बिल 0 या अधिक और व्यक्तियों की संख्या 1–1000 के बीच की पूर्ण संख्या होनी चाहिए।";
    return `कुल बिल: ${rupees(total)}\nव्यक्तियों की संख्या: ${people}\nप्रति व्यक्ति देय राशि: ${rupees(total / people)}`;
  }
  if (slug === "simple-interest-calculator") {
    const principal = parse(values.principal ?? ""), rate = parse(values.rate ?? ""), years = parse(values.years ?? "");
    if (![principal, rate, years].every(Number.isFinite) || principal <= 0 || rate < 0 || years < 0 || years > 100) return "मूलधन धनात्मक, ब्याज दर 0 या अधिक और अवधि 0–100 वर्ष के बीच होनी चाहिए।";
    const interest = principal * rate * years / 100;
    return `साधारण ब्याज: ${rupees(interest)}\nकुल राशि: ${rupees(principal + interest)}\nसूत्र: मूलधन × दर × समय ÷ 100`;
  }
  return "";
}

/** Titles and field labels live here (not in the "use client" component) so the server route can read them. */
export const hindiMathTitles: Record<HindiMathToolSlug, { title: string; description: string }> = {
  "percentage-change-calculator": { title: "प्रतिशत परिवर्तन कैलकुलेटर", description: "शुरुआती और नए मान से प्रतिशत बढ़ोतरी या कमी निकालें।" },
  "average-calculator": { title: "औसत कैलकुलेटर", description: "कॉमा या स्पेस से अलग की गई संख्याओं का औसत निकालें।" },
  "ratio-simplifier": { title: "अनुपात सरल करने वाला टूल", description: "दो पूर्ण संख्याओं के अनुपात को सरलतम रूप में बदलें।" },
  "fraction-calculator": { title: "भिन्न कैलकुलेटर", description: "दो भिन्नों को जोड़ें, घटाएँ, गुणा करें या भाग दें।" },
  "percentage-of-number-calculator": { title: "संख्या का प्रतिशत कैलकुलेटर", description: "किसी संख्या का मनचाहा प्रतिशत निकालें।" },
  "gcd-lcm-calculator": { title: "GCD और LCM कैलकुलेटर", description: "दो पूर्ण संख्याओं का महत्तम समापवर्तक और लघुत्तम समापवर्त्य निकालें।" },
  "prime-number-checker": { title: "अभाज्य संख्या जाँच", description: "जाँचें कि कोई पूर्ण संख्या अभाज्य है या नहीं।" },
  "unit-converter": { title: "इकाई रूपांतरण", description: "लंबाई और वज़न की सामान्य इकाइयों के बीच रूपांतरण करें।" },
  "bmi-calculator": { title: "BMI कैलकुलेटर", description: "वज़न और लंबाई से वयस्क का BMI अनुमानित करें; यह चिकित्सकीय निदान नहीं है।" },
  "bmr-calculator": { title: "BMR कैलकुलेटर", description: "आयु, लंबाई, वज़न और सूत्र के विकल्प से बुनियादी ऊर्जा खर्च का अनुमान लगाएँ।" },
  "tip-calculator": { title: "टिप कैलकुलेटर", description: "बिल, टिप प्रतिशत और व्यक्तियों की संख्या से प्रति व्यक्ति राशि निकालें।" },
  "split-bill-calculator": { title: "बिल बाँटने वाला कैलकुलेटर", description: "कुल बिल को व्यक्तियों में बराबर बाँटें।" },
  "simple-interest-calculator": { title: "साधारण ब्याज कैलकुलेटर", description: "मूलधन, वार्षिक ब्याज दर और अवधि से साधारण ब्याज निकालें।" },
};
