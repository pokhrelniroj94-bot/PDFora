/**
 * Nepali encoding, case-conversion and unit tools (batch 2).
 *
 * Leaf module: no imports, erasable TypeScript only, so scripts/nepali-encoding-case-tools.test.mjs
 * can execute it directly under Node type stripping.
 *
 * Behaviour mirrors the English implementations in components/QuickUtilityTools.tsx and
 * lib/roman-numerals.ts. Differences are deliberate and documented inline:
 *  - validation and error messages are Nepali;
 *  - case converters also accept Devanagari and other Unicode letters (the English tool only keeps a-z/0-9);
 *  - empty input returns an explicit Nepali message instead of an empty result.
 */

export type NepaliEncodingCaseToolSlug =
  | "text-to-binary" | "binary-to-text" | "text-to-hex" | "hex-to-text"
  | "morse-code-translator" | "camel-case-converter" | "snake-case-converter" | "kebab-case-converter"
  | "json-escape-unescape" | "px-rem-converter" | "roman-numeral-converter";

export const nepaliEncodingCaseToolSlugs: readonly NepaliEncodingCaseToolSlug[] = [
  "text-to-binary", "binary-to-text", "text-to-hex", "hex-to-text",
  "morse-code-translator", "camel-case-converter", "snake-case-converter", "kebab-case-converter",
  "json-escape-unescape", "px-rem-converter", "roman-numeral-converter",
];

export type NepaliToolResult = { ok: boolean; text: string };
type Values = Record<string, string>;

const ok = (text: string): NepaliToolResult => ({ ok: true, text });
const fail = (text: string): NepaliToolResult => ({ ok: false, text });

const EMPTY_TEXT = "कृपया पाठ प्रविष्ट गर्नुहोस्।";

const morse: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---",
  k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
  u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  " ": "/",
};
const morseReverse: Record<string, string> = Object.fromEntries(Object.entries(morse).map(([letter, code]) => [code, letter]));

const utf8Decoder = () => new TextDecoder("utf-8", { fatal: true });
const bytesOf = (text: string) => Array.from(new TextEncoder().encode(text));

/** Splits text into lowercase word tokens. Keeps any Unicode letters, marks and digits. */
export function caseTokens(text: string): string[] {
  const normalized = text.normalize("NFKD").replace(/[̀-ͯ]/gu, "").normalize("NFC");
  const separated = normalized.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2");
  return separated.toLocaleLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
}

const capitalizeFirst = (word: string) => {
  const chars = Array.from(word);
  return chars.length ? chars[0].toLocaleUpperCase() + chars.slice(1).join("") : word;
};

const romanPairs: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"],
  [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(value: number): string {
  let rest = value;
  let output = "";
  for (const [amount, symbol] of romanPairs) while (rest >= amount) { output += symbol; rest -= amount; }
  return output;
}

function fromRoman(input: string): number | null {
  const value = input.trim().toUpperCase();
  if (!value || !/^[IVXLCDM]+$/.test(value)) return null;
  const numerals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < value.length; i += 1) {
    const current = numerals[value[i]];
    const next = numerals[value[i + 1]] ?? 0;
    total += current < next ? -current : current;
  }
  if (total < 1 || total > 3999 || toRoman(total) !== value) return null;
  return total;
}

/** Converts Devanagari digits to ASCII so Nepali users can type numbers naturally. */
const asciiDigits = (value: string) => value.replace(/[०-९]/gu, (digit) => String("०१२३४५६७८९".indexOf(digit)));

const parseNumber = (value: string | undefined): number => {
  const cleaned = asciiDigits((value ?? "").trim());
  return cleaned === "" ? Number.NaN : Number(cleaned);
};

export function runNepaliEncodingCaseTool(slug: NepaliEncodingCaseToolSlug, values: Values): NepaliToolResult {
  const text = values.text ?? "";

  if (slug === "text-to-binary") {
    if (!text) return fail(EMPTY_TEXT);
    return ok(bytesOf(text).map((byte) => byte.toString(2).padStart(8, "0")).join(" "));
  }

  if (slug === "binary-to-text") {
    const groups = text.trim().split(/[\s,]+/).filter(Boolean);
    if (!groups.length) return fail("कृपया ८-bit बाइनरी समूह प्रविष्ट गर्नुहोस्।");
    if (groups.some((group) => !/^[01]{8}$/.test(group))) return fail("प्रत्येक समूहमा ठ्याक्कै ८ वटा ० वा १ हुनुपर्छ, र समूहहरू खाली स्थानले छुट्याउनुहोस्। उदाहरण: 01001000 01101001");
    try { return ok(utf8Decoder().decode(new Uint8Array(groups.map((group) => Number.parseInt(group, 2))))); }
    catch { return fail("यी बाइटहरू मान्य UTF-8 पाठ होइनन्।"); }
  }

  if (slug === "text-to-hex") {
    if (!text) return fail(EMPTY_TEXT);
    return ok(bytesOf(text).map((byte) => byte.toString(16).padStart(2, "0")).join(" "));
  }

  if (slug === "hex-to-text") {
    const pairs = text.trim().split(/[\s,:-]+/).filter(Boolean);
    if (!pairs.length) return fail("कृपया hexadecimal बाइट जोडा प्रविष्ट गर्नुहोस्।");
    if (pairs.some((pair) => !/^[0-9a-f]{2}$/i.test(pair))) return fail("प्रत्येक समूहमा ठ्याक्कै २ वटा hexadecimal अक्षर (०–९, a–f) हुनुपर्छ। उदाहरण: 48 65 6c 6c 6f");
    try { return ok(utf8Decoder().decode(new Uint8Array(pairs.map((pair) => Number.parseInt(pair, 16))))); }
    catch { return fail("यी बाइटहरू मान्य UTF-8 पाठ होइनन्।"); }
  }

  if (slug === "morse-code-translator") {
    if (!text.trim()) return fail(EMPTY_TEXT);
    if (values.mode === "decode") {
      const decoded = text.trim().split(/\s*\/\s*/).map((word) => word.trim().split(/\s+/).map((code) => morseReverse[code] ?? "?").join("")).join(" ");
      return ok(decoded.includes("?") ? `${decoded}\n\nनोट: "?" चिन्हले चिन्न नसकिएको मोर्स कोड जनाउँछ।` : decoded);
    }
    const lower = Array.from(text.toLowerCase());
    const unsupported = lower.filter((char) => morse[char] === undefined);
    const encoded = lower.map((char) => morse[char] ?? "").join(" ");
    if (!encoded.trim()) return fail("मोर्स कोडले अङ्ग्रेजी अक्षर (a–z) र अंक (०–९) मात्र समर्थन गर्छ। नेपाली अक्षर रूपान्तरण गर्न सकिँदैन।");
    return ok(unsupported.length ? `${encoded}\n\nनोट: समर्थन नगरिएका ${unsupported.length} अक्षर/चिन्ह छोडिएका छन् (मोर्स कोडमा केवल a–z र ०–९ मिल्छ)।` : encoded);
  }

  if (slug === "camel-case-converter" || slug === "snake-case-converter" || slug === "kebab-case-converter") {
    const tokens = caseTokens(text);
    if (!tokens.length) return fail("रूपान्तरण गर्न कम्तीमा एउटा अक्षर वा अंक भएको पाठ प्रविष्ट गर्नुहोस्।");
    if (slug === "camel-case-converter") return ok(tokens.map((word, index) => (index ? capitalizeFirst(word) : word)).join(""));
    return ok(tokens.join(slug === "snake-case-converter" ? "_" : "-"));
  }

  if (slug === "json-escape-unescape") {
    if (!text) return fail(EMPTY_TEXT);
    if (values.mode === "unescape") {
      try {
        const trimmed = text.trim();
        const parsed: unknown = JSON.parse(trimmed.startsWith('"') ? trimmed : `"${text}"`);
        return typeof parsed === "string" ? ok(parsed) : fail("Unescape का लागि मान्य JSON string चाहिन्छ।");
      } catch {
        return fail("मान्य JSON escape अनुक्रम फेला परेन। \\n, \\\" र \\u0939 जस्ता अनुक्रम जाँच गर्नुहोस्।");
      }
    }
    return ok(JSON.stringify(text).slice(1, -1));
  }

  if (slug === "px-rem-converter") {
    const value = parseNumber(values.value);
    const root = parseNumber(values.root);
    if (!Number.isFinite(value)) return fail("कृपया मान्य मान प्रविष्ट गर्नुहोस्।");
    if (!Number.isFinite(root) || root <= 0) return fail("Root font size धनात्मक संख्या हुनुपर्छ (सामान्यतया १६ px)।");
    return ok(values.mode === "rem-to-px" ? `${(value * root).toFixed(4)} px` : `${(value / root).toFixed(4)} rem`);
  }

  if (slug === "roman-numeral-converter") {
    const input = asciiDigits(text.trim());
    if (!input) return fail("कृपया सङ्ख्या वा रोमन अंक प्रविष्ट गर्नुहोस्।");
    if (/^\d+$/.test(input)) {
      const number = Number(input);
      if (!Number.isSafeInteger(number) || number < 1 || number > 3999) return fail("१ देखि ३९९९ सम्मको पूर्ण सङ्ख्या प्रविष्ट गर्नुहोस्।");
      return ok(toRoman(number));
    }
    const converted = fromRoman(input);
    return converted === null ? fail("मान्य रोमन अंक प्रविष्ट गर्नुहोस्। I देखि MMMCMXCIX सम्मको मानक ढाँचा मात्र समर्थित छ।") : ok(String(converted));
  }

  return fail("यो उपकरण उपलब्ध छैन।");
}
