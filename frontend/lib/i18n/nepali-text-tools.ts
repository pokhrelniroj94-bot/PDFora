export type NepaliTextToolSlug =
  | "word-character-counter" | "case-converter" | "remove-duplicate-lines"
  | "sort-lines" | "reverse-text" | "whitespace-cleaner" | "character-frequency"
  | "word-frequency-counter" | "reading-time-calculator" | "line-counter" | "sentence-counter";

export type NepaliTextToolOptions = { caseMode?: "upper" | "lower" | "title" | "sentence"; wordsPerMinute?: number };

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
  if (slug === "whitespace-cleaner") return input.split("\n").map((line) => line.replace(/[\t ]+/g, " ").trim()).filter((line, index, all) => line || all[index - 1] !== "").join("\n").trim();
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
  return "";
}
