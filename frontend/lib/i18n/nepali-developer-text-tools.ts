export type NepaliDeveloperToolSlug =
  | "json-formatter-validator" | "base64-encoder-decoder" | "url-encoder-decoder"
  | "hash-generator" | "text-diff-checker" | "lorem-ipsum-generator"
  | "html-encoder-decoder" | "text-to-slug"
  | "text-to-binary" | "binary-to-text" | "text-to-hex" | "hex-to-text" | "morse-code-translator"
  | "camel-case-converter" | "snake-case-converter" | "kebab-case-converter" | "html-tag-stripper"
  | "json-escape-unescape" | "url-query-parser" | "url-validator" | "email-validator"
  | "password-strength-checker" | "uuid-generator";
type Values = Record<string, string>;

export function runNepaliDeveloperTool(slug: NepaliDeveloperToolSlug, values: Values): string {
  const text = values.text ?? "";
  if (slug === "json-formatter-validator") {
    try {
      const parsed = JSON.parse(text);
      return JSON.stringify(parsed, null, Math.min(8, Math.max(0, Number(values.indent ?? 2)))) ;
    } catch (error) {
      return `JSON मान्य छैन: ${error instanceof Error ? error.message : "ढाँचा जाँच गर्नुहोस्"}`;
    }
  }
  if (slug === "base64-encoder-decoder") {
    try {
      if (values.mode === "decode") {
        const normalized = text.replace(/\s+/g, "");
        const binary = atob(normalized);
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      }
      const bytes = new TextEncoder().encode(text);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return btoa(binary);
    } catch {
      return "Base64 मान्य छैन वा UTF-8 पाठ डिकोड गर्न सकिएन।";
    }
  }
  if (slug === "url-encoder-decoder") {
    try { return values.mode === "decode" ? decodeURIComponent(text) : encodeURIComponent(text); }
    catch { return "URL encoding मान्य छैन। प्रतिशत (%) encoding र अक्षरहरू जाँच गर्नुहोस्।"; }
  }
  if (slug === "html-encoder-decoder") {
    if (values.mode === "decode") {
      return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, code: string) => {
        const lower = code.toLowerCase();
        if (lower === "amp") return "&";
        if (lower === "lt") return "<";
        if (lower === "gt") return ">";
        if (lower === "quot") return '"';
        if (lower === "apos") return "'";
        if (lower === "nbsp") return "\u00a0";
        const numeric = lower.startsWith("#x") ? Number.parseInt(lower.slice(2), 16) : Number(lower.slice(1));
        try { return Number.isInteger(numeric) && numeric >= 0 && numeric <= 0x10ffff ? String.fromCodePoint(numeric) : entity; }
        catch { return entity; }
      });
    }
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  if (slug === "text-to-slug") {
    const slugged = text.normalize("NFKC").toLocaleLowerCase().trim()
      .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
    return slugged || "पाठबाट slug बनाउन अक्षर वा अंक प्रविष्ट गर्नुहोस्।";
  }
  if (slug === "lorem-ipsum-generator") {
    const count = Number(values.count ?? 2);
    if (!Number.isInteger(count) || count < 1 || count > 20) return "अनुच्छेद संख्या १ देखि २० सम्म हुनुपर्छ।";
    const seed = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    return Array.from({ length: count }, () => seed).join("\n\n");
  }
  if (slug === "text-diff-checker") {
    const left = (values.original ?? "").split("\n");
    const right = (values.modified ?? "").split("\n");
    if (left.length > 500 || right.length > 500) return "प्रत्येक पाठमा अधिकतम ५०० लाइन तुलना गर्न सकिन्छ।";
    const rows = Array.from({ length: left.length + 1 }, () => new Uint16Array(right.length + 1));
    for (let i = left.length - 1; i >= 0; i--) for (let j = right.length - 1; j >= 0; j--) {
      rows[i][j] = left[i] === right[j] ? rows[i + 1][j + 1] + 1 : Math.max(rows[i + 1][j], rows[i][j + 1]);
    }
    const output: string[] = [];
    let i = 0, j = 0;
    while (i < left.length || j < right.length) {
      if (i < left.length && j < right.length && left[i] === right[j]) { output.push(`  ${left[i]}`); i++; j++; }
      else if (j < right.length && (i === left.length || rows[i][j + 1] > rows[i + 1][j])) { output.push(`+ ${right[j++]}`); }
      else { output.push(`- ${left[i++]}`); }
    }
    return output.join("\n");
  }
  if (slug === "text-to-binary") {
    return Array.from(new TextEncoder().encode(text), (byte) => byte.toString(2).padStart(8, "0")).join(" ")
      || "रूपान्तरण गर्न पाठ प्रविष्ट गर्नुहोस्।";
  }
  if (slug === "binary-to-text") {
    const normalized = text.replace(/\s+/g, "");
    if (!normalized || !/^[01]+$/.test(normalized) || normalized.length % 8 !== 0) return "बाइनरी पाठ ८-बिट समूहमा ० र १ मात्र हुनुपर्छ।";
    try {
      const bytes = Uint8Array.from(normalized.match(/.{8}/g) ?? [], (part) => Number.parseInt(part, 2));
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch { return "बाइनरी डेटा मान्य UTF-8 पाठ होइन।"; }
  }
  if (slug === "text-to-hex") {
    return Array.from(new TextEncoder().encode(text), (byte) => byte.toString(16).padStart(2, "0")).join(" ")
      || "रूपान्तरण गर्न पाठ प्रविष्ट गर्नुहोस्।";
  }
  if (slug === "hex-to-text") {
    const normalized = text.replace(/^0x/i, "").replace(/[\s:-]/g, "");
    if (!normalized || !/^(?:[0-9a-f]{2})+$/i.test(normalized)) return "Hex डेटा दुई-दुई अंकको वैध hexadecimal समूहमा हुनुपर्छ।";
    try {
      const bytes = Uint8Array.from(normalized.match(/.{2}/g) ?? [], (part) => Number.parseInt(part, 16));
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch { return "Hex डेटा मान्य UTF-8 पाठ होइन।"; }
  }
  if (slug === "morse-code-translator") {
    const alphabet: Record<string, string> = {
      A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
      I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
      Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
      Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
      "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----."
    };
    const reverse = Object.fromEntries(Object.entries(alphabet).map(([letter, code]) => [code, letter]));
    if (values.mode === "decode") {
      const decoded = text.trim().split(/\s*\/\s*/).map((word) => word.trim().split(/\s+/).map((code) => reverse[code] ?? "?").join("")).join(" ");
      return decoded.includes("?") ? "Morse code मा नचिनिएको संकेत भेटियो।" : decoded;
    }
    const normalized = text.toUpperCase();
    if (!/^[A-Z0-9\s]+$/.test(normalized)) return "Morse रूपान्तरणका लागि A–Z, 0–9 र खाली स्थान मात्र प्रयोग गर्नुहोस्।";
    return normalized.split(/\s+/).map((word) => [...word].map((letter) => alphabet[letter]).join(" ")).join(" / ");
  }
  if (slug === "camel-case-converter" || slug === "snake-case-converter" || slug === "kebab-case-converter") {
    const parts = text.normalize("NFKC").match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
    if (!parts.length) return "रूपान्तरण गर्न शब्द प्रविष्ट गर्नुहोस्।";
    const lower = parts.map((part) => part.toLocaleLowerCase());
    if (slug === "snake-case-converter") return lower.join("_");
    if (slug === "kebab-case-converter") return lower.join("-");
    return lower[0] + lower.slice(1).map((part) => part[0].toLocaleUpperCase() + part.slice(1)).join("");
  }
  if (slug === "html-tag-stripper") {
    return text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'")
      .replace(/\s+/g, " ").trim();
  }
  if (slug === "json-escape-unescape") {
    try {
      return values.mode === "decode" ? JSON.parse('"' + text + '"') as string : JSON.stringify(text).slice(1, -1);
    } catch { return "JSON escape sequence मान्य छैन।"; }
  }
  if (slug === "url-query-parser") {
    try {
      const parsed = new URL(text);
      const params: Record<string, string | string[]> = {};
      for (const [key, value] of parsed.searchParams.entries()) {
        const current = params[key];
        params[key] = current === undefined ? value : Array.isArray(current) ? [...current, value] : [current, value];
      }
      return Object.keys(params).length ? JSON.stringify(params, null, 2) : "URL मा query parameter भेटिएन।";
    } catch { return "पूर्ण URL प्रविष्ट गर्नुहोस्, उदाहरण: https://example.com/?q=nepal"; }
  }
  if (slug === "url-validator") {
    try {
      const parsed = new URL(text);
      if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname.includes(".")) return "URL को ढाँचा मान्य छैन। HTTP वा HTTPS ठेगाना प्रयोग गर्नुहोस्।";
      return "URL को ढाँचा मान्य छ। वेबसाइट पहुँचयोग्य छ भन्ने यसले प्रमाणित गर्दैन।";
    } catch { return "URL को ढाँचा मान्य छैन। पूर्ण https:// ठेगाना प्रविष्ट गर्नुहोस्।"; }
  }
  if (slug === "email-validator") {
    const valid = text.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text);
    return valid ? "इमेलको सामान्य ढाँचा मान्य छ; मेलबक्स अस्तित्वमा छ भन्ने पुष्टि होइन।" : "इमेल ठेगानाको सामान्य ढाँचा मान्य छैन।";
  }
  if (slug === "password-strength-checker") {
    if (text.length > 128) return "पासवर्ड जाँचका लागि अधिकतम १२८ अक्षर प्रयोग गर्नुहोस्।";
    const checks = [
      text.length >= 12,
      /[a-z]/.test(text),
      /[A-Z]/.test(text),
      /\d/.test(text),
      /[^A-Za-z0-9]/.test(text)
    ];
    const score = checks.filter(Boolean).length;
    const rating = score >= 4 ? "बलियो" : score >= 3 ? "मध्यम" : "कमजोर";
    return "अनुमानित बल: " + rating + "\nपूरा भएका मापदण्ड: " + score + "/5\n" +
      "लम्बाइ १२+, सानो अक्षर, ठूलो अक्षर, अंक र विशेष चिन्हमध्ये पूरा भएका मापदण्ड गनिएका छन्। यो सुरक्षा प्रमाणीकरण होइन।";
  }
  if (slug === "uuid-generator") {
    return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : "यो ब्राउजरमा सुरक्षित UUID सुविधा उपलब्ध छैन।";
  }
  return "";
}

export async function runNepaliHashTool(text: string, algorithm: string): Promise<string> {
  const allowed = ["SHA-256", "SHA-384", "SHA-512"];
  if (!allowed.includes(algorithm)) return "SHA-256, SHA-384 वा SHA-512 मध्ये छान्नुहोस्।";
  if (!globalThis.crypto?.subtle) return "यो ब्राउजरमा सुरक्षित hash सुविधा उपलब्ध छैन।";
  const digest = await globalThis.crypto.subtle.digest(algorithm, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
