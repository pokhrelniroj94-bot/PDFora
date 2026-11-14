/**
 * Nepali data, validator, colour, date and random tools (batch 3).
 *
 * Leaf module: no imports, erasable TypeScript only, so Node can execute it in
 * scripts/nepali-data-tools.test.mjs. The calculation helpers that already exist for the English
 * tools (CSV/JSON/YAML, calendar arithmetic, gcd, unbiased random) are INJECTED through
 * `NepaliDataDeps` instead of copied, so the English and Nepali tools share one implementation and
 * one set of security guards (for example the spreadsheet-formula guard in JSON -> CSV).
 * Only user-facing text is Nepali; English error messages from the helpers are mapped below.
 */

export type NepaliDataToolSlug =
  | "csv-to-json" | "json-to-yaml" | "json-to-csv" | "url-validator" | "email-validator"
  | "password-strength-checker" | "url-query-parser" | "color-converter" | "aspect-ratio-calculator"
  | "css-gradient-generator" | "unix-timestamp-converter" | "date-add-subtract-calculator"
  | "business-days-calculator" | "random-number-generator" | "dice-roller";

export const nepaliDataToolSlugs: readonly NepaliDataToolSlug[] = [
  "csv-to-json", "json-to-yaml", "json-to-csv", "url-validator", "email-validator",
  "password-strength-checker", "url-query-parser", "color-converter", "aspect-ratio-calculator",
  "css-gradient-generator", "unix-timestamp-converter", "date-add-subtract-calculator",
  "business-days-calculator", "random-number-generator", "dice-roller",
];

export interface NepaliDataDeps {
  csvToJson: (input: string) => string;
  jsonObjectsToCsv: (input: string) => string;
  jsonToYaml: (value: unknown) => string;
  addCalendarDays: (date: string, days: number) => string;
  businessDaysInclusive: (start: string, end: string) => number;
  gcd: (a: number, b: number) => number;
  randomIntegerBelow: (maxExclusive: number, randomUint32: () => number) => number;
  randomUint32: () => number;
}

export type NepaliToolResult = { ok: boolean; text: string };
type Values = Record<string, string>;

const ok = (text: string): NepaliToolResult => ({ ok: true, text });
const fail = (text: string): NepaliToolResult => ({ ok: false, text });
const FALLBACK_ERROR = "इनपुट मान्य छैन। ढाँचा र मान जाँचेर फेरि प्रयास गर्नुहोस्।";
const EMPTY_INPUT = "कृपया इनपुट प्रविष्ट गर्नुहोस्।";

/** Maps the English helper error messages to Nepali. Unknown messages never leak through in English. */
const errorTable: [RegExp, (match: RegExpMatchArray) => string][] = [
  [/^JSON input is too large/, () => "JSON इनपुट धेरै ठूलो छ (अधिकतम १ MB)।"],
  [/^Enter valid JSON/, () => "मान्य JSON प्रविष्ट गर्नुहोस्।"],
  [/^Input must be an array of JSON objects/, () => "इनपुट JSON object हरूको array हुनुपर्छ, जस्तै [{\"name\":\"आशा\"}]।"],
  [/^CSV export is limited to 10,000 rows/, () => "CSV निर्यात अधिकतम १०,००० पङ्क्तिमा सीमित छ।"],
  [/^CSV export is limited to 500 columns/, () => "CSV निर्यात अधिकतम ५०० स्तम्भमा सीमित छ।"],
  [/^CSV input is too large/, () => "CSV इनपुट धेरै ठूलो छ (अधिकतम १ MB)।"],
  [/^Unexpected characters after a quoted CSV field/, () => "उद्धरण चिन्हमा बन्द भएको CSV फिल्डपछि अनपेक्षित अक्षर छन्।"],
  [/^A quote may only start at the beginning of a CSV field/, () => "उद्धरण चिन्ह (\") CSV फिल्डको सुरुमा मात्र राख्न मिल्छ।"],
  [/^CSV contains an unclosed quoted field/, () => "CSV मा बन्द नगरिएको उद्धरण चिन्ह भएको फिल्ड छ।"],
  [/^Provide a header row and at least one data row/, () => "शीर्षक पङ्क्ति र कम्तीमा एउटा डेटा पङ्क्ति आवश्यक छ।"],
  [/^CSV headers cannot be empty/, () => "CSV शीर्षक खाली हुन सक्दैन।"],
  [/^CSV headers must be unique/, () => "CSV शीर्षकहरू फरक-फरक हुनुपर्छ।"],
  [/^CSV row (\d+) has (\d+) columns; expected (\d+)/, (m) => `CSV को पङ्क्ति ${toNepaliDigits(m[1])} मा ${toNepaliDigits(m[2])} स्तम्भ छन्; ${toNepaliDigits(m[3])} अपेक्षित छ।`],
  [/^Enter dates in YYYY-MM-DD format/, () => "मिति YYYY-MM-DD ढाँचामा प्रविष्ट गर्नुहोस्।"],
  [/^Enter a valid calendar date/, () => "मान्य क्यालेन्डर मिति प्रविष्ट गर्नुहोस्।"],
  [/^Enter valid calendar dates/, () => "मान्य क्यालेन्डर मिति प्रविष्ट गर्नुहोस्।"],
  [/^Enter a whole number of days/, () => "दिनको संख्या पूर्ण सङ्ख्या हुनुपर्छ।"],
  [/^Date range must not exceed 100 years/, () => "मितिको दायरा १०० वर्षभन्दा लामो हुनु हुँदैन।"],
  [/^GCD requires safe whole numbers/, () => "प्रविष्ट गरिएको मान धेरै ठूलो छ; सानो मान प्रयोग गर्नुहोस्।"],
  [/^Random range must be an integer/, () => "अनियमित दायरा १ देखि २^३२ बीचको पूर्ण सङ्ख्या हुनुपर्छ।"],
];

export function translateDataError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  for (const [pattern, build] of errorTable) {
    const match = message.match(pattern);
    if (match) return build(match);
  }
  return FALLBACK_ERROR;
}

const asciiDigits = (value: string) => value.replace(/[०-९]/gu, (digit) => String("०१२३४५६७८९".indexOf(digit)));
const parseNumber = (value: string | undefined): number => {
  const cleaned = asciiDigits((value ?? "").trim());
  return cleaned === "" ? Number.NaN : Number(cleaned);
};
const toNepaliDigits = (value: string | number) => String(value).replace(/\d/g, (digit) => "०१२३४५६७८९"[Number(digit)]);

export function runNepaliDataTool(slug: NepaliDataToolSlug, values: Values, deps: NepaliDataDeps): NepaliToolResult {
  const text = values.text ?? "";
  try {
    if (slug === "csv-to-json") {
      if (!text.trim()) return fail(EMPTY_INPUT);
      return ok(deps.csvToJson(text));
    }

    if (slug === "json-to-yaml") {
      if (!text.trim()) return fail(EMPTY_INPUT);
      let parsed: unknown;
      try { parsed = JSON.parse(text); } catch { return fail("मान्य JSON प्रविष्ट गर्नुहोस्।"); }
      return ok(deps.jsonToYaml(parsed));
    }

    if (slug === "json-to-csv") {
      if (!text.trim()) return fail(EMPTY_INPUT);
      return ok(deps.jsonObjectsToCsv(text));
    }

    if (slug === "url-validator") {
      if (!text.trim()) return fail("कृपया URL प्रविष्ट गर्नुहोस्।");
      let url: URL;
      try { url = new URL(text); } catch { return fail("URL मान्य छैन। https://example.com जस्तो पूर्ण ठेगाना प्रविष्ट गर्नुहोस्।"); }
      if (!["http:", "https:"].includes(url.protocol)) return fail("केवल HTTP र HTTPS URL समर्थित छन्।");
      return ok(`URL मान्य छ\nProtocol: ${url.protocol}\nHost: ${url.host}\nPath: ${url.pathname}\nQuery: ${url.search || "(छैन)"}`);
    }

    if (slug === "email-validator") {
      if (!text.trim()) return fail("कृपया इमेल ठेगाना प्रविष्ट गर्नुहोस्।");
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text.trim())
        ? ok("इमेलको आधारभूत बनोट मान्य देखिन्छ। कुनै इमेल पठाइएको छैन; ठेगाना वास्तवमै अस्तित्वमा छ भन्ने जाँचिएको होइन।")
        : fail("इमेलको बनोट मान्य छैन। name@example.com जस्तो ढाँचा प्रयोग गर्नुहोस्।");
    }

    if (slug === "password-strength-checker") {
      if (!text) return fail("कृपया जाँच गर्न पासवर्ड प्रविष्ट गर्नुहोस्।");
      const score = [text.length >= 12, /[A-Z]/.test(text), /[a-z]/.test(text), /\d/.test(text), /[^A-Za-z0-9]/.test(text)].filter(Boolean).length;
      const level = score >= 5 ? "बलियो" : score >= 3 ? "मध्यम" : "कमजोर";
      return ok(`पूरा भएका मापदण्ड: ${toNepaliDigits(score)}/५\nमूल्याङ्कन: ${level}\nमापदण्ड: १२+ अक्षर, ठूलो अक्षर, सानो अक्षर, अंक, विशेष चिन्ह।\nयो स्थानीय जाँचले चोरी भएका पासवर्डको डाटाबेस जाँच्दैन। वास्तविक पासवर्ड अनलाइन टुलमा नहाल्नुहोस्।`);
    }

    if (slug === "url-query-parser") {
      if (!text.trim()) return fail("कृपया पूरा URL प्रविष्ट गर्नुहोस्।");
      let url: URL;
      try { url = new URL(text); } catch { return fail("URL मान्य छैन। https://example.com/search?q=pdf जस्तो पूर्ण URL प्रविष्ट गर्नुहोस्।"); }
      const pairs = [...url.searchParams].map(([key, value]) => `${key} = ${value}`);
      return ok(`URL: ${url.origin}${url.pathname}\n${pairs.length ? pairs.join("\n") : "Query parameter फेला परेन।"}`);
    }

    if (slug === "color-converter") {
      const match = text.trim().match(/^#?([0-9a-f]{6})$/i);
      if (!match) return fail("छ अङ्कको मान्य HEX रङ प्रविष्ट गर्नुहोस्, जस्तै #0f766e।");
      const x = Number.parseInt(match[1], 16);
      const r = x >> 16, g = (x >> 8) & 255, b = x & 255;
      const rr = r / 255, gg = g / 255, bb = b / 255;
      const mx = Math.max(rr, gg, bb), mn = Math.min(rr, gg, bb), delta = mx - mn;
      let h = 0;
      if (delta) {
        if (mx === rr) h = 60 * (((gg - bb) / delta) % 6);
        else if (mx === gg) h = 60 * ((bb - rr) / delta + 2);
        else h = 60 * ((rr - gg) / delta + 4);
      }
      if (h < 0) h += 360;
      const l = (mx + mn) / 2;
      const s = delta ? delta / (1 - Math.abs(2 * l - 1)) : 0;
      return ok(`HEX: #${match[1].toUpperCase()}\nRGB: ${r}, ${g}, ${b}\nHSL: ${Math.round(h)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`);
    }

    if (slug === "aspect-ratio-calculator") {
      const w = parseNumber(values.width), h = parseNumber(values.height);
      if (!Number.isFinite(w) || !Number.isFinite(h)) return fail("चौडाइ र उचाइ दुवै मान्य सङ्ख्या हुनुपर्छ।");
      if (w <= 0 || h <= 0) return fail("चौडाइ र उचाइ शून्यभन्दा ठूला हुनुपर्छ।");
      const divisor = deps.gcd(Math.round(w * 1000), Math.round(h * 1000));
      return ok(`Aspect ratio: ${Math.round(w * 1000) / divisor}:${Math.round(h * 1000) / divisor}\nदशमलव: ${(w / h).toFixed(5)}`);
    }

    if (slug === "css-gradient-generator") {
      const a = (values.a ?? "").trim(), b = (values.b ?? "").trim();
      if (!/^#[0-9a-f]{6}$/i.test(a) || !/^#[0-9a-f]{6}$/i.test(b)) return fail("दुवै रङ छ अङ्कको मान्य HEX (#rrggbb) हुनुपर्छ।");
      const angle = parseNumber(values.angle);
      if (!Number.isFinite(angle)) return fail("कोण मान्य सङ्ख्या हुनुपर्छ।");
      return ok(`background: linear-gradient(${angle}deg, ${a}, ${b});`);
    }

    if (slug === "unix-timestamp-converter") {
      if (!text.trim()) return fail("कृपया Unix timestamp प्रविष्ट गर्नुहोस्।");
      const x = parseNumber(text);
      const date = new Date(Math.abs(x) < 1e12 ? x * 1000 : x);
      if (!Number.isFinite(x) || Number.isNaN(date.getTime())) return fail("मान्य Unix timestamp प्रविष्ट गर्नुहोस् (सेकेन्ड वा मिलिसेकेन्ड)।");
      const nepalTime = new Date(date.getTime() + 5.75 * 3600_000).toISOString().replace("T", " ").slice(0, 19);
      return ok(`UTC: ${date.toISOString()}\nनेपाल समय (UTC+५:४५): ${nepalTime}\nब्राउजरको स्थानीय समय: ${date.toString()}`);
    }

    if (slug === "date-add-subtract-calculator") {
      const days = parseNumber(values.days);
      if (!Number.isFinite(days)) return fail("दिनको संख्या मान्य सङ्ख्या हुनुपर्छ (घटाउन ऋणात्मक प्रयोग गर्नुहोस्)।");
      return ok(`नतिजा मिति: ${deps.addCalendarDays(values.date ?? "", days)}`);
    }

    if (slug === "business-days-calculator") {
      const count = deps.businessDaysInclusive(values.start ?? "", values.end ?? "");
      return ok(`कार्यदिन (सुरु र अन्तिम मिति सहित): ${count}\nशनिबार–आइतबारलाई सप्ताहन्त मानिएको छ; सार्वजनिक बिदा घटाइएको छैन। नेपालको कार्यालय तालिका फरक भए नतिजा फरक पर्न सक्छ।`);
    }

    if (slug === "random-number-generator") {
      const min = parseNumber(values.min), max = parseNumber(values.max), count = parseNumber(values.count);
      if (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(count) || max < min || count < 1 || count > 100 || max - min + 1 > 4294967296) {
        return fail("पूर्ण सङ्ख्याका सीमा प्रयोग गर्नुहोस् (न्यूनतम ≤ अधिकतम, दायरा २^३२ सम्म) र नतिजा १ देखि १०० सम्म राख्नुहोस्।");
      }
      const range = max - min + 1;
      return ok(Array.from({ length: count }, () => min + deps.randomIntegerBelow(range, deps.randomUint32)).join("\n"));
    }

    if (slug === "dice-roller") {
      const count = parseNumber(values.count);
      if (!Number.isInteger(count) || count < 1 || count > 100) return fail("पासाको संख्या १ देखि १०० सम्मको पूर्ण सङ्ख्या हुनुपर्छ।");
      const rolls = Array.from({ length: count }, () => deps.randomIntegerBelow(6, deps.randomUint32) + 1);
      return ok(`फालिएका अंक: ${rolls.join(", ")}\nजम्मा: ${rolls.reduce((sum, roll) => sum + roll, 0)}`);
    }
  } catch (error) {
    return fail(translateDataError(error));
  }
  return fail("यो उपकरण उपलब्ध छैन।");
}
