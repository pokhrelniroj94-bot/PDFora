/**
 * Nepali savings-goal, NEPSE share, XML-format and HTML-strip tools.
 *
 * These five routes were previously registered as Nepali-localized but rendered a page shell with no
 * workspace. Leaf module (no imports, erasable TypeScript) so Node can run scripts/nepali-final-tools.test.mjs.
 * Formulas mirror components/ExtraTools.tsx (savings), components/NepalTools.tsx (share) and the English
 * XML/HTML tools. DOM parsing is injected so the browser supplies DOMParser.
 */

export type NepaliFinalToolSlug = "savings-goal-calculator" | "nepal-share-calculator" | "xml-formatter-validator" | "html-tag-stripper";
export type NepaliToolResult = { ok: boolean; text: string };
type Values = Record<string, string>;

const ok = (text: string): NepaliToolResult => ({ ok: true, text });
const fail = (text: string): NepaliToolResult => ({ ok: false, text });

const asciiDigits = (value: string) => value.replace(/[०-९]/gu, (digit) => String("०१२३४५६७८९".indexOf(digit)));
/** Blank is NOT zero. Devanagari digits are accepted. */
const parse = (value: string | undefined): number => {
  const cleaned = asciiDigits((value ?? "").trim());
  return cleaned === "" ? Number.NaN : Number(cleaned);
};

const NEPALI_DIGITS = "०१२३४५६७८९";
export const toNepaliDigits = (value: string | number) => String(value).replace(/\d/g, (digit) => NEPALI_DIGITS[Number(digit)]);

/** en-IN grouping (lakh/crore) as used across Nepali finance tools. */
const money = (value: number) => value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function savingsGoal(values: Values): NepaliToolResult {
  const target = parse(values.target), saved = parse(values.saved), months = parse(values.months), annualRate = parse(values.rate);
  if (![target, saved, months, annualRate].every(Number.isFinite)) return fail("लक्ष्य, हालको बचत, महिना र ब्याजदर सबै मान्य सङ्ख्या हुनुपर्छ; खाली ठाउँ शून्य मानिँदैन।");
  if (target < 0 || saved < 0 || !Number.isSafeInteger(months) || months <= 0 || annualRate < 0 || annualRate > 100) {
    return fail("रकम ऋणात्मक हुनु हुँदैन, महिना शून्यभन्दा ठूलो पूर्ण सङ्ख्या हुनुपर्छ र वार्षिक ब्याजदर ० देखि १०० प्रतिशतभित्र हुनुपर्छ।");
  }
  const weekly = values.frequency === "weekly";
  const periodsPerYear = weekly ? 52 : 12;
  const periods = weekly ? Math.ceil((months * 52) / 12) : months;
  const periodicRate = annualRate / 100 / periodsPerYear;
  const growth = Math.pow(1 + periodicRate, periods);
  const annuityFactor = periodicRate === 0 ? periods : (growth - 1) / periodicRate;
  const futureSaved = saved * growth;
  const deposit = Math.max(0, (target - futureSaved) / annuityFactor);
  const contributions = deposit * periods;
  const projected = futureSaved + contributions;
  const interest = projected - saved - contributions;
  return ok([
    `जम्मा निक्षेप: ${weekly ? "साप्ताहिक" : "मासिक"} (${toNepaliDigits(periods)} पटक)`,
    `${weekly ? "प्रति हप्ता" : "प्रति महिना"} चाहिने निक्षेप: NPR ${money(deposit)}`,
    `लक्ष्य मितिमा हालको बचतको मूल्य: NPR ${money(futureSaved)}`,
    `अनुमानित ब्याज आम्दानी: NPR ${money(interest)}`,
    `अनुमानित कुल रकम: NPR ${money(projected)}`,
    `मान्यता: निक्षेप प्रत्येक अवधिको अन्त्यमा गरिन्छ र वार्षिक ब्याजदर ${toNepaliDigits(periodsPerYear)} अवधिमा बाँडिन्छ। बैंकको वास्तविक ब्याज, शुल्क र कर फरक हुन सक्छ।`,
  ].join("\n"));
}

export function shareProfit(values: Values): NepaliToolResult {
  const q = parse(values.shares), buy = parse(values.buy), sell = parse(values.sell);
  const br = parse(values.broker), sr = parse(values.sebon), dp = parse(values.dp), cg = parse(values.cgt);
  if (![q, buy, sell, br, sr, dp, cg].every(Number.isFinite)) return fail("सबै फिल्डमा मान्य सङ्ख्या प्रविष्ट गर्नुहोस्; खाली ठाउँ शून्य मानिँदैन।");
  if (!(q > 0) || !Number.isInteger(q)) return fail("सेयर सङ्ख्या शून्यभन्दा ठूलो पूर्ण सङ्ख्या हुनुपर्छ।");
  if (buy < 0 || sell < 0 || dp < 0) return fail("मूल्य र DP शुल्क ऋणात्मक हुनु हुँदैन।");
  if (br < 0 || br > 100 || sr < 0 || sr > 100 || cg < 0 || cg > 100) return fail("ब्रोकर कमिसन, SEBON शुल्क र CGT दर ० देखि १०० प्रतिशतभित्र हुनुपर्छ।");
  const buyValue = q * buy, sellValue = q * sell;
  const buyFees = (buyValue * (br + sr)) / 100;
  const sellFees = (sellValue * (br + sr)) / 100 + dp;
  const profit = sellValue - buyValue - buyFees - sellFees;
  const tax = (Math.max(0, profit) * cg) / 100;
  return ok([
    `खरिद मूल्य: NPR ${money(buyValue)}`,
    `अनुमानित खरिद शुल्क: NPR ${money(buyFees)}`,
    `कुल खरिद लागत: NPR ${money(buyValue + buyFees)}`,
    `बिक्री मूल्य: NPR ${money(sellValue)}`,
    `अनुमानित बिक्री शुल्क: NPR ${money(sellFees)}`,
    `CGT अघिको नाफा/नोक्सान: NPR ${money(profit)}`,
    `CGT अनुमान: NPR ${money(tax)}`,
    `CGT पछिको खुद नाफा/नोक्सान अनुमान: NPR ${money(profit - tax)}`,
  ].join("\n"));
}

export interface NepaliDomDeps {
  parseXml: (raw: string) => { errorText: string | null; serialized: string };
  htmlToText: (raw: string) => string;
}

export function formatXml(raw: string, deps: NepaliDomDeps): NepaliToolResult {
  if (!raw.trim()) return fail("कृपया XML प्रविष्ट गर्नुहोस्।");
  if (raw.length > 1_000_000) return fail("XML इनपुट धेरै ठूलो छ (अधिकतम १ MB)।");
  const { errorText, serialized } = deps.parseXml(raw);
  if (errorText !== null) return fail(`XML मान्य छैन। ब्राउजरले जनाएको समस्या: ${errorText.replace(/\s+/g, " ").trim().slice(0, 300)}`);
  let depth = 0;
  const formatted = serialized.replace(/></g, ">\n<").split("\n").map((line) => {
    if (/^<\//.test(line)) depth = Math.max(0, depth - 1);
    const out = "  ".repeat(depth) + line;
    if (/^<[^!?/][^>]*[^/]?>$/.test(line) && !line.includes("</")) depth += 1;
    return out;
  }).join("\n");
  return ok(formatted);
}

export function stripHtml(raw: string, deps: NepaliDomDeps): NepaliToolResult {
  if (!raw.trim()) return fail("कृपया HTML प्रविष्ट गर्नुहोस्।");
  if (raw.length > 1_000_000) return fail("HTML इनपुट धेरै ठूलो छ (अधिकतम १ MB)।");
  return ok(deps.htmlToText(raw));
}

export function runNepaliFinalTool(slug: NepaliFinalToolSlug, values: Values, deps: NepaliDomDeps): NepaliToolResult {
  if (slug === "savings-goal-calculator") return savingsGoal(values);
  if (slug === "nepal-share-calculator") return shareProfit(values);
  if (slug === "xml-formatter-validator") return formatXml(values.text ?? "", deps);
  if (slug === "html-tag-stripper") return stripHtml(values.text ?? "", deps);
  return fail("यो उपकरण उपलब्ध छैन।");
}
