export type NepaliExtraTextToolSlug =
  | "email-extractor" | "url-extractor" | "phone-number-extractor" | "number-extractor"
  | "hashtag-extractor" | "remove-duplicate-words" | "find-replace-text"
  | "palindrome-checker" | "acronym-generator";

const messages: Record<NepaliExtraTextToolSlug, { title: string; description: string }> = {
  "email-extractor": { title: "इमेल ठेगाना निकाल्ने", description: "पाठबाट इमेल ठेगाना पहिचान गरी दोहोरिएका ठेगाना हटाएर सूची बनाउनुहोस्।" },
  "url-extractor": { title: "वेब ठेगाना निकाल्ने", description: "पाठमा भएका HTTP र HTTPS लिङ्क निकालेर छुट्टाछुट्टै सूची बनाउनुहोस्।" },
  "phone-number-extractor": { title: "फोन नम्बर निकाल्ने", description: "पाठमा भएका सम्भावित फोन नम्बरका क्रम पहिचान गर्नुहोस्; नतिजा प्रयोगअघि जाँच्नुहोस्।" },
  "number-extractor": { title: "संख्या निकाल्ने", description: "पाठबाट पूर्णाङ्क र दशमलव संख्या छुट्याएर सूची बनाउनुहोस्।" },
  "hashtag-extractor": { title: "ह्यासट्याग निकाल्ने", description: "सामाजिक सञ्जालको क्याप्सन वा पाठबाट अद्वितीय ह्यासट्याग निकाल्नुहोस्।" },
  "remove-duplicate-words": { title: "दोहोरो शब्द हटाउने", description: "पाठमा दोहोरिएका शब्द हटाई पहिलो पटक आएको क्रम कायम राख्नुहोस्।" },
  "find-replace-text": { title: "पाठ खोज्ने र बदल्ने", description: "दिइएको शब्द वा वाक्यांशलाई अर्को पाठले बदल्नुहोस्।" },
  "palindrome-checker": { title: "उल्टो पढ्दा उस्तै हुने शब्द जाँच", description: "खाली स्थान र विरामचिह्न बेवास्ता गरी पाठ अगाडि र पछाडि एउटै पढिन्छ कि जाँच्नुहोस्।" },
  "acronym-generator": { title: "संक्षिप्त नाम बनाउने", description: "वाक्यांशका शब्दको सुरुका अक्षरबाट संक्षिप्त नाम तयार गर्नुहोस्।" },
};

export function getNepaliExtraTextToolCopy(slug: NepaliExtraTextToolSlug) {
  return messages[slug];
}

export function runNepaliExtraTextTool(
  slug: NepaliExtraTextToolSlug,
  input: string,
  search = "",
  replacement = ""
): string {
  const text = input ?? "";
  if (slug === "email-extractor") {
    return [...new Set(text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [])].join("\n");
  }
  if (slug === "url-extractor") {
    return [...new Set((text.match(/https?:\/\/[^\s<>"']+/gi) ?? []).map((url) => url.replace(/[),.;!?]+$/, "")))].join("\n");
  }
  if (slug === "phone-number-extractor") {
    const matches = text.match(/(?:\+?\d[\d ()-]{6,}\d)/g) ?? [];
    return [...new Set(matches.map((value) => value.trim().replace(/\s+/g, " ")))].join("\n");
  }
  if (slug === "number-extractor") {
    return text.match(/[+-]?(?:\d+(?:[.,]\d+)?|[०-९]+(?:[.,][०-९]+)?)/g)?.join("\n") ?? "";
  }
  if (slug === "hashtag-extractor") {
    return [...new Set(text.match(/#[\p{L}\p{M}\p{N}_]+/gu) ?? [])].join("\n");
  }
  if (slug === "remove-duplicate-words") {
    const seen = new Set<string>();
    return (text.match(/\S+/gu) ?? []).filter((word) => {
      const key = word.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).join(" ");
  }
  if (slug === "find-replace-text") {
    return search ? text.split(search).join(replacement) : text;
  }
  if (slug === "palindrome-checker") {
    const normalized = text.normalize("NFC").toLocaleLowerCase().replace(/[\s\p{P}\p{S}]/gu, "");
    if (!normalized) return "जाँच गर्न शब्द वा वाक्यांश प्रविष्ट गर्नुहोस्।";
    const segmenter = new Intl.Segmenter("ne", { granularity: "grapheme" });
    const graphemes = [...segmenter.segment(normalized)].map((part) => part.segment);
    return normalized === [...graphemes].reverse().join("")
      ? "यो पाठ अगाडि र पछाडि दुवैतर्फ एउटै पढिन्छ।"
      : "यो पाठ अगाडि र पछाडि एउटै पढिँदैन।";
  }
  if (slug === "acronym-generator") {
    return text.trim().split(/\s+/u).filter(Boolean).map((word) => [...word][0]).join("").toLocaleUpperCase();
  }
  return "";
}
