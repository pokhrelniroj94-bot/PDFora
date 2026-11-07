export type NepaliTextToolSlug =
  | "word-character-counter" | "case-converter" | "remove-duplicate-lines"
  | "sort-lines" | "reverse-text" | "whitespace-cleaner" | "character-frequency"
  | "word-frequency-counter" | "reading-time-calculator" | "line-counter" | "sentence-counter"
  | "email-extractor" | "url-extractor" | "phone-number-extractor" | "number-extractor"
  | "hashtag-extractor" | "remove-duplicate-words" | "find-replace-text"
  | "palindrome-checker" | "acronym-generator";

export type NepaliTextToolOptions = {
  caseMode?: "upper" | "lower" | "title" | "sentence";
  wordsPerMinute?: number;
  findText?: string;
  replaceText?: string;
};

const wordsIn = (input: string) => input.match(/[\p{L}\p{M}\p{N}]+(?:['’][\p{L}\p{M}\p{N}]+)*/gu) ?? [];
const linesIn = (input: string) => input.replace(/\r\n?/g, "\n").split("\n");

export function runNepaliTextTool(slug: NepaliTextToolSlug, input: string, options: NepaliTextToolOptions = {}): string {
  const words = wordsIn(input);
  const lines = linesIn(input);
  if (slug === "word-character-counter") {
    const paragraphs = input.trim() ? input.trim().split(/\n\s*\n/u).length : 0;
    return `शब्द: ${words.length}\nअक्षर (space सहित): ${[...input].length}\nअक्षर (space बाहेक): ${[...input.replace(/\s/gu, "")].length}\nअनुच्छेद: ${paragraphs}`;
  }
  if (slug === "case-converter") {
    const mode = options.caseMode ?? "upper";
    if (mode === "lower") return input.toLowerCase();
    if (mode === "title") return input.toLowerCase().replace(/(^|[\s-])([a-z])/g, (_, gap: string, letter: string) => gap + letter.toUpperCase());
    if (mode === "sentence") return input.toLowerCase().replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (match) => match.toUpperCase());
    return input.toUpperCase();
  }
  if (slug === "remove-duplicate-lines") {
    const seen = new Set<string>();
    return lines.filter((line) => {
      const key = line.trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).join("\n");
  }
  if (slug === "sort-lines") {
    const trailingNewline = input.endsWith("\n");
    const sortable = trailingNewline ? lines.slice(0, -1) : lines;
    const sorted = [...sortable].sort((a, b) => a.localeCompare(b, "ne"));
    return sorted.join("\n") + (trailingNewline ? "\n" : "");
  }
  if (slug === "reverse-text") return [...input].reverse().join("");
  if (slug === "whitespace-cleaner") return input.split("\n").map((line) => line.replace(/[\t ]+/g, " ").trim()).filter(Boolean).join("\n").trim();
  if (slug === "character-frequency") {
    const counts = new Map<string, number>();
    for (const character of [...input.replace(/\s/gu, "")]) counts.set(character, (counts.get(character) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ne")).map(([character, count]) => `${character} — ${count}`).join("\n") || "गणना गर्न पाठ लेख्नुहोस्।";
  }
  if (slug === "word-frequency-counter") {
    const counts = new Map<string, number>();
    for (const word of words) {
      const key = word.toLocaleLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ne")).map(([word, count]) => `${word} — ${count}`).join("\n") || "गणना गर्न पाठ लेख्नुहोस्।";
  }
  if (slug === "reading-time-calculator") {
    const speed = Number.isFinite(options.wordsPerMinute) ? Math.max(1, options.wordsPerMinute ?? 200) : 200;
    const minutes = words.length / speed;
    return `शब्द संख्या: ${words.length}\nअनुमानित पढ्ने समय: ${minutes < 1 ? Math.max(1, Math.ceil(minutes * 60)) + " सेकेन्ड" : minutes.toFixed(1) + " मिनेट"}\nपढ्ने गति: ${speed} शब्द/मिनेट`;
  }
  if (slug === "line-counter") {
    const nonEmpty = lines.filter((line) => line.trim()).length;
    return `कुल लाइन: ${input ? lines.length : 0}\nखाली लाइन: ${input ? lines.length - nonEmpty : 0}\nसामग्री भएका लाइन: ${nonEmpty}`;
  }
  if (slug === "sentence-counter") {
    const sentences = input.trim().split(/[.!?।]+(?:\s+|$)/u).filter((part) => part.trim());
    return `अनुमानित वाक्य: ${input.trim() ? sentences.length : 0}\nशब्द: ${words.length}`;
  }
  if (slug === "email-extractor") {
    const matches = input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu) ?? [];
    return [...new Set(matches)].join("\n") || "कुनै इमेल ठेगाना भेटिएन।";
  }
  if (slug === "url-extractor") {
    const matches = (input.match(/(?:https?:\/\/|www\.)[^\s<>"']+/giu) ?? [])
      .map((value) => value.replace(/[),.;!?]+$/u, ""));
    return [...new Set(matches)].join("\n") || "कुनै URL भेटिएन।";
  }
  if (slug === "phone-number-extractor") {
    const matches = (input.match(/\+?[\p{N}][\p{N}\s().-]{5,}[\p{N}]/gu) ?? [])
      .map((value) => value.trim())
      .filter((value) => {
        const digits = value.replace(/[^\p{N}]/gu, "");
        return digits.length >= 7 && digits.length <= 15;
      });
    return [...new Set(matches)].join("\n") || "कुनै सम्भावित फोन नम्बर भेटिएन।";
  }
  if (slug === "number-extractor") {
    const matches = input.match(/-?[\p{N}]+(?:[.,][\p{N}]+)*/gu) ?? [];
    return matches.join("\n") || "कुनै संख्या भेटिएन।";
  }
  if (slug === "hashtag-extractor") {
    const matches = input.match(/#[\p{L}\p{M}\p{N}_]+/gu) ?? [];
    return [...new Set(matches)].join("\n") || "कुनै hashtag भेटिएन।";
  }
  if (slug === "remove-duplicate-words") {
    const seen = new Set<string>();
    return words.filter((word) => {
      const key = word.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).join(" ");
  }
  if (slug === "find-replace-text") {
    const findText = options.findText ?? "";
    if (!findText) return "खोज्नुपर्ने पाठ प्रविष्ट गर्नुहोस्।";
    return input.replaceAll(findText, options.replaceText ?? "");
  }
  if (slug === "palindrome-checker") {
    const normalized = [...input.toLocaleLowerCase()].filter((character) => /[\p{L}\p{M}\p{N}]/u.test(character));
    if (!normalized.length) return "जाँच गर्न अक्षर वा अंक भएको पाठ प्रविष्ट गर्नुहोस्।";
    return normalized.join("") === [...normalized].reverse().join("")
      ? "यो पाठ पालिन्ड्रोम हो।"
      : "यो पाठ पालिन्ड्रोम होइन।";
  }
  if (slug === "acronym-generator") {
    return words.map((word) => [...word][0]?.toLocaleUpperCase() ?? "").join("") || "संक्षिप्त रूप बनाउन शब्द प्रविष्ट गर्नुहोस्।";
  }
  return "";
}
