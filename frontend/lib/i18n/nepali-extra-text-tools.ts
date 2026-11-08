export type NepaliExtraTextToolSlug =
  | "email-extractor" | "url-extractor" | "phone-number-extractor" | "number-extractor"
  | "hashtag-extractor" | "remove-duplicate-words" | "find-replace-text"
  | "palindrome-checker" | "acronym-generator";

type NepaliExtraTextToolCopy = {
  title: string;
  description: string;
  purpose: string;
  steps: string[];
  limitation: string;
  example: string;
};

const messages: Record<NepaliExtraTextToolSlug, NepaliExtraTextToolCopy> = {
  "email-extractor": {
    title: "इमेल ठेगाना निकाल्ने",
    description: "पाठबाट इमेल ठेगाना पहिचान गरी दोहोरिएका ठेगाना हटाएर सूची बनाउनुहोस्।",
    purpose: "लामो सन्देश, कागजातबाट कपी गरिएको पाठ वा सम्पर्क सूचीमा भएका इमेल ठेगाना छुट्याएर सफा सूची तयार गर्न यो टुल प्रयोग गर्नुहोस्।",
    steps: ["इमेल भएको पाठ बाकसमा paste गर्नुहोस्।", "प्रक्रिया गर्नुहोस् थिचेर पहिचान भएका ठेगाना हेर्नुहोस्।", "नतिजा जाँचेर आवश्यक ठेगाना कपी गर्नुहोस्।"],
    limitation: "ढाँचासँग मिल्ने इमेल मात्र पहिचान हुन्छ। ठेगाना वास्तवमै अस्तित्वमा छ, सक्रिय छ वा त्यसको मालिक को हो भन्ने पुष्टि हुँदैन।",
    example: "उदाहरण: info@example.com र support@example.org जस्ता ठेगाना छुट्टै देखिन्छन्।"
  },
  "url-extractor": {
    title: "वेब ठेगाना निकाल्ने",
    description: "पाठमा भएका HTTP र HTTPS लिङ्क निकालेर छुट्टाछुट्टै सूची बनाउनुहोस्।",
    purpose: "इमेल, लेख वा नोटबाट वेब लिङ्क छानेर सूची बनाउन र अनावश्यक वरिपरिको पाठ हटाउन यो टुल उपयोगी हुन्छ।",
    steps: ["लिङ्क भएको पाठ paste गर्नुहोस्।", "प्रक्रिया गर्नुहोस् थिच्नुहोस्।", "निकालिएका URL जाँचेर आवश्यक लिङ्क कपी गर्नुहोस्।"],
    limitation: "यो टुलले URL को ढाँचा मात्र पहिचान गर्छ; वेबसाइट खुल्छ कि खुल्दैन, सुरक्षित छ कि छैन वा गन्तव्य सही हो कि होइन जाँच्दैन।",
    example: "उदाहरण: https://example.com/page जस्तो लिङ्क छुट्टै पङ्क्तिमा देखिन्छ।"
  },
  "phone-number-extractor": {
    title: "फोन नम्बर निकाल्ने",
    description: "पाठमा भएका सम्भावित फोन नम्बरका क्रम पहिचान गर्नुहोस्; नतिजा प्रयोगअघि जाँच्नुहोस्।",
    purpose: "सन्देश वा कपी गरिएको सामग्रीमा मिसिएका सम्भावित फोन नम्बर छुट्याएर सम्पर्क सूची तयार गर्न मद्दत गर्छ।",
    steps: ["फोन नम्बर भएको पाठ paste गर्नुहोस्।", "प्रक्रिया गर्नुहोस् थिच्नुहोस्।", "नतिजामा आएका प्रत्येक नम्बरको देश कोड र अंक मूल स्रोतसँग मिलाउनुहोस्।"],
    limitation: "अंकको ढाँचाबाट सम्भावित नम्बर मात्र पहिचान हुन्छ। यो नेपाल दूरसञ्चार वा अन्य अपरेटरको आधिकारिक नम्बर प्रमाणीकरण होइन र नम्बरको स्वामित्व जाँच्दैन।",
    example: "उदाहरण: +977 980-123-4567 जस्तो क्रम सम्भावित नम्बरका रूपमा देखिन्छ।"
  },
  "number-extractor": {
    title: "संख्या निकाल्ने",
    description: "पाठबाट पूर्णाङ्क र दशमलव संख्या छुट्याएर सूची बनाउनुहोस्।",
    purpose: "रिपोर्ट, रसिद वा नोटमा मिसिएका संख्यालाई अलग सूचीमा ल्याएर अर्को स्प्रेडसिट वा गणनामा प्रयोग गर्न यो टुल उपयोगी हुन्छ।",
    steps: ["संख्या भएको पाठ paste गर्नुहोस्।", "प्रक्रिया गर्नुहोस् थिच्नुहोस्।", "निकालिएका पूर्णाङ्क र दशमलव मान समीक्षा गर्नुहोस्।"],
    limitation: "संख्याको वरिपरिको मुद्रा, मिति, एकाइ वा अर्थ स्वतः पहिचान हुँदैन। हजार छुट्याउने अल्पविराम भएको मानलाई पनि छुट्टै भागमा देखाउन सक्छ।",
    example: "उदाहरण: “जम्मा १२ वटा, मूल्य २५.५०” बाट १२ र २५.५० निकालिन्छ।"
  },
  "hashtag-extractor": {
    title: "ह्यासट्याग निकाल्ने",
    description: "सामाजिक सञ्जालको क्याप्सन वा पाठबाट अद्वितीय ह्यासट्याग निकाल्नुहोस्।",
    purpose: "लामो क्याप्सन वा पोस्टबाट # चिह्नसहित लेखिएका ह्यासट्याग छुट्याएर पुनः प्रयोग वा समीक्षा गर्न सूची बनाउनुहोस्।",
    steps: ["ह्यासट्याग भएको क्याप्सन वा पाठ paste गर्नुहोस्।", "प्रक्रिया गर्नुहोस् थिच्नुहोस्।", "दोहोरिएका ह्यासट्याग हटाइएको सूची समीक्षा गरी कपी गर्नुहोस्।"],
    limitation: "ह्यासट्याग # पछि आउने अक्षर, मात्रा, अंक र underscore बाट पहिचान हुन्छ। ट्रेन्ड, लोकप्रियता वा पोस्टको विषयवस्तु विश्लेषण गर्दैन।",
    example: "उदाहरण: #नेपाल #नेपालीटुल्स जस्ता नेपाली र अङ्ग्रेजी ह्यासट्याग पहिचान हुन्छन्।"
  },
  "remove-duplicate-words": {
    title: "दोहोरो शब्द हटाउने",
    description: "पाठमा दोहोरिएका शब्द हटाई पहिलो पटक आएको क्रम कायम राख्नुहोस्।",
    purpose: "साधारण शब्द सूची वा छोटो पाठबाट दोहोरिएका शब्द हटाएर पहिलो पटक देखिएको क्रम कायम राख्न यो टुल प्रयोग गर्नुहोस्।",
    steps: ["शब्द वा सूची paste गर्नुहोस्।", "प्रक्रिया गर्नुहोस् थिच्नुहोस्।", "बाँकी शब्दको क्रम र खाली स्थान जाँच्नुहोस्।"],
    limitation: "तुलना गर्दा ठूला र साना अङ्ग्रेजी अक्षरलाई एउटै मानिन्छ। विरामचिह्न जोडिएको शब्द अलग मानिन सक्छ; नतिजा अन्तिम प्रयोगअघि पढ्नुहोस्।",
    example: "उदाहरण: “नेपाल नेपाल राम्रो देश” बाट “नेपाल राम्रो देश” प्राप्त हुन्छ।"
  },
  "find-replace-text": {
    title: "पाठ खोज्ने र बदल्ने",
    description: "दिइएको शब्द वा वाक्यांशलाई अर्को पाठले बदल्नुहोस्।",
    purpose: "एउटै शब्द, नाम वा वाक्यांश धेरै पटक आएको पाठमा ती सबै मिलानलाई एउटै नयाँ पाठले बदल्न यो टुल प्रयोग गर्नुहोस्।",
    steps: ["मुख्य पाठ paste गर्नुहोस्।", "खोज्नुपर्ने पाठ र त्यसको सट्टा राख्ने पाठ लेख्नुहोस्।", "प्रक्रिया गर्नुहोस् थिचेर बदलिएको पाठ समीक्षा गर्नुहोस्।"],
    limitation: "खोजी ठ्याक्कै मिल्ने र ठूला/साना अक्षर छुट्याउने हुन्छ। खाली खोज शब्द राखेमा पाठ परिवर्तन हुँदैन; नियमित अभिव्यक्ति (regex) समर्थन छैन।",
    example: "उदाहरण: “पुरानो नाम” लाई “नयाँ नाम” ले सबै मिलेको ठाउँमा बदल्न सकिन्छ।"
  },
  "palindrome-checker": {
    title: "उल्टो पढ्दा उस्तै हुने शब्द जाँच",
    description: "खाली स्थान र विरामचिह्न बेवास्ता गरी पाठ अगाडि र पछाडि एउटै पढिन्छ कि जाँच्नुहोस्।",
    purpose: "शब्द वा वाक्यांशको अक्षरक्रम उल्ट्याउँदा उही हुन्छ कि भनेर साधारण भाषिक खेल वा पाठ परीक्षणका लागि जाँच गर्नुहोस्।",
    steps: ["जाँच्नुपर्ने शब्द वा वाक्यांश लेख्नुहोस्।", "प्रक्रिया गर्नुहोस् थिच्नुहोस्।", "देखाइएको नतिजा र मूल पाठ तुलना गर्नुहोस्।"],
    limitation: "खाली स्थान, विरामचिह्न र प्रतीक बेवास्ता गरिन्छ। यो व्याकरण, अर्थ वा भाषिक शुद्धताको परीक्षण होइन।",
    example: "उदाहरण: “नमन” अगाडि र पछाडि एउटै पढिने भएकाले palindrome हो।"
  },
  "acronym-generator": {
    title: "संक्षिप्त नाम बनाउने",
    description: "वाक्यांशका शब्दको सुरुका अक्षरबाट संक्षिप्त नाम तयार गर्नुहोस्।",
    purpose: "संस्था, परियोजना वा लामो नामका शब्दको पहिलो अक्षर जोडेर सम्झन सजिलो संक्षिप्त नाम बनाउन यो टुल उपयोगी हुन्छ।",
    steps: ["धेरै शब्द भएको नाम वा वाक्यांश लेख्नुहोस्।", "प्रक्रिया गर्नुहोस् थिच्नुहोस्।", "बनेको संक्षिप्त नाम सही छ कि मूल नामसँग मिलाउनुहोस्।"],
    limitation: "हरेक शब्दको पहिलो अक्षर मात्र लिइन्छ। आधिकारिक संक्षिप्त नाम, उच्चारण वा संस्थाको स्वीकृत रूप स्वतः पुष्टि हुँदैन।",
    example: "उदाहरण: “World Health Organization” बाट “WHO” बन्छ।"
  }
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
    const segmenter = new Intl.Segmenter("ne", { granularity: "grapheme" });
    return text.trim().split(/\s+/u).filter(Boolean).map((word) => [...segmenter.segment(word)][0]?.segment ?? "").join("").toLocaleUpperCase();
  }
  return "";
}
