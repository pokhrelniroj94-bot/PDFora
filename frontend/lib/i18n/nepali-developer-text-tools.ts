export type NepaliDeveloperToolSlug =
  | "json-formatter-validator" | "base64-encoder-decoder" | "url-encoder-decoder"
  | "hash-generator" | "text-diff-checker" | "lorem-ipsum-generator"
  | "html-encoder-decoder" | "text-to-slug";
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
  return "";
}

export async function runNepaliHashTool(text: string, algorithm: string): Promise<string> {
  const allowed = ["SHA-256", "SHA-384", "SHA-512"];
  if (!allowed.includes(algorithm)) return "SHA-256, SHA-384 वा SHA-512 मध्ये छान्नुहोस्।";
  if (!globalThis.crypto?.subtle) return "यो ब्राउजरमा सुरक्षित hash सुविधा उपलब्ध छैन।";
  const digest = await globalThis.crypto.subtle.digest(algorithm, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
