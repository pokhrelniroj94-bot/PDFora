import type { Tool } from "./tool-directory";

const toolAliases: Record<string, string> = {
  "/merge-pdf": "combine join multiple files merger join pdf jod jodne jodna milaune जोड्ने जोड्नु मिलाउने",
  "/split-pdf": "separate divide pages range cut chutta chuttaune छुट्याउने छुट्याउनु काट्ने",
  "/compress-pdf": "shrink reduce smaller optimize size mb kb file size ghataune sano banaune घटाउने सानो बनाउने",
  "/images-to-pdf": "jpg jpeg png webp photo picture image tasbir फोटो तस्बिर तस्वीर",
  "/pdf-to-jpg": "jpeg image pictures export photo tasbir फोटो",
  "/pdf-to-excel": "xlsx spreadsheet table cells data",
  "/pdf-to-word": "doc docx editable document ms word लेख्ने document",
  "/rotate-pdf": "turn orientation sideways ghumaune ghumaunu घुमाउने",
  "/delete-pages": "remove erase unwanted page hataune हटाउने",
  "/extract-pages": "save selected range choose page nikalne निकाल्ने",
  "/watermark": "stamp brand overlay chhap छाप",
  "/reorder-pdf": "rearrange move sequence order milाउने मिलाउने",
  "/add-page-numbers": "numbering footer page number",
  "/crop-pdf": "trim margins cut edges",
  "/header-footer": "heading footer header text",
  "/protect-pdf": "encrypt password lock secure surakshit सुरक्षित",
  "/unlock-pdf": "decrypt remove password kholne खोल्ने",
  "/sign-pdf": "signature signer e-sign हस्ताक्षर",
  "/pdf-to-png": "image export photo",
  "/pdf-to-webp": "image convert photo",
  "/pdf-to-text": "extract copy selectable txt text nikalne",
  "/grayscale-pdf": "black white monochrome grey",
  "/flatten-pdf": "forms annotations flatten",
  "/edit-pdf-metadata": "title author properties document info",
  "/repair-pdf": "fix damaged corrupted recover bigreko मर्मत",
  "/pdf-to-html": "webpage markup code",
  "/extract-images": "photos pictures embedded zip photo tasbir फोटो",
  "/remove-blank-pages": "empty pages delete khali पाना",
  "/compare-pdf": "difference diff two documents compare tulana तुलना",
  "/add-blank-pages": "insert empty pages",
  "/rotate-selected-pages": "turn chosen individual pages ghumaune",
  "/add-background": "background color layer",
  "/add-bookmarks": "outline navigation contents",
  "/bates-numbering": "legal sequential labels",
  "/extract-bookmarks": "outline export",
  "/extract-fonts": "typeface embedded",
  "/extract-page-images": "render snapshots",
  "/ocr-pdf": "scanned recognize optical character text scan",
  "/page-counter": "count number dimensions pages kati page",
  "/pdf-information": "metadata properties details inspect",
  "/pdf-to-bmp": "bitmap image",
  "/pdf-to-csv": "table spreadsheet comma separated",
  "/pdf-to-json": "structured data",
  "/pdf-to-markdown": "md notes",
  "/pdf-to-tiff": "tif archive",
  "/remove-annotations": "comments notes markup",
  "/remove-attachments": "embedded files",
  "/remove-pdf-links": "hyperlinks urls",
  "/remove-pdf-metadata": "clear privacy author",
  "/split-by-bookmarks": "chapters sections outline divide",
  "nepal-salary-tax-calculator": "income tax salary kar आयकर तलब",
  "nepal-electricity-bill-calculator": "nea electricity bill bijuli current meter unit बिजुली बत्ती",
  "nepse-dividend-calculator": "cash bonus share dividend लाभांश नगद बोनस सेयर",
  "nepal-forex-rates": "currency exchange rate dollar usd npr paisa mudra विनिमय दर मुद्रा डलर",
  "nepal-fixed-deposit-calculator": "fd bank deposit interest ब्याज मुद्दती निक्षेप",
  "nepal-remittance-calculator": "money transfer send receive remit पैसा पठाउने रेमिट्यान्स",
  "nepal-ipo-profit-calculator": "share stock kitta listing sell profit loss ipo सेयर शेयर कित्ता नाफा घाटा",
  "nepal-share-calculator": "nepse stock share buy sell broker fee cgt सेयर शेयर",
  "nepse-market-news": "share stock market news ipo news समाचार बजार",
  "nepali-date-converter": "bs ad bikram sambat date miti date मिति विक्रम संवत",
  "nepali-calendar": "calendar patro date miti पात्रो मिति",
  "nepali-unicode-typing": "type nepali romanized devanagari keyboard नेपाली टाइप",
  "preeti-unicode-converter": "preeti font nepali unicode convert प्रीति युनिकोड",
  "gold-tola-gram-converter": "gold silver weight sun tola gram सुन तोला",
  "nepal-land-area-converter": "ropani aana paisa daam bigha kattha dhur jagga land जग्गा रोपनी आना",
  "nepal-public-holidays-2083": "holiday bida chhutti public छुट्टी बिदा",
  "nepali-digit-converter": "number digits अंक देवनागरी nepali",
  "nepali-number-converter": "number words lakh crore nepali नेपाली अंक",
  "loksewa-photo-resizer": "photo size loksewa form image compress kb फोटो लोकसेवा",
};

const querySynonyms: Record<string, string[]> = {
  jod: ["merge", "combine", "join"], jodne: ["merge", "combine", "join"], jodna: ["merge", "combine", "join"],
  milaune: ["merge", "combine", "reorder"], chutyaune: ["split", "separate", "divide"], chutyaunu: ["split", "separate"],
  ghataune: ["compress", "reduce", "shrink"], sano: ["compress", "reduce", "small"], ghumaune: ["rotate", "turn"],
  photo: ["image", "jpg", "png"], tasbir: ["image", "photo"], तस्वीर: ["image", "photo"], फोटो: ["image", "photo"],
  hisab: ["calculator", "calculate"], ganana: ["calculator", "calculate"], हिसाब: ["calculator", "calculate"],
  kar: ["tax", "income"], कर: ["tax", "income"], talab: ["salary", "income"], तलब: ["salary", "income"],
  share: ["stock", "nepse"], seयर: ["share", "stock"], सेयर: ["share", "stock"], शेयर: ["share", "stock"],
  dollar: ["forex", "currency", "usd"], paisa: ["money", "currency"], पैसा: ["money", "currency"],
  miti: ["date", "calendar"], मिति: ["date", "calendar"], पात्रो: ["calendar", "date"],
  jagga: ["land", "area", "ropani"], जग्गा: ["land", "area"], bijuli: ["electricity", "bill"],
  jankari: ["information", "details"], khojne: ["search", "find"],\n  क्याल्कुलेटर: ["calculator", "calculate"], गणक: ["calculator", "calculate"],\n  रूपान्तरण: ["convert", "converter"], बदल्ने: ["convert", "converter"],\n  फाइल: ["file", "pdf", "document"], दस्तावेज: ["document", "pdf"],\n  ब्याज: ["interest", "rate"], आम्दानी: ["income", "salary"],\n  समय: ["time", "duration"], छुट्टी: ["holiday", "calendar"],\n  सुन: ["gold", "tola"],
};

const ignoredWords = new Set(["the", "a", "an", "and", "for", "to", "of", "in", "online", "free", "tool", "tools", "garne", "gara", "garna", "ko", "ka", "ki", "ma", "lai", "kasari", "chahiyo", "xa", "cha", "hunxa", "garnu", "गर्ने", "गर्नु", "गर", "को", "का", "की", "मा", "लाई", "कसरी", "चाहियो", "छ", "हुन्छ"]);

function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function editDistanceAtMostOne(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  return edits + (i < a.length || j < b.length ? 1 : 0) <= 1;
}

export function matchesToolSearch(tool: Tool, query: string): boolean {
  const tokens = normalize(query).split(/\s+/).filter((token) => token && !ignoredWords.has(token));
  if (!tokens.length) return true;

  const href = tool.href;
  const alias = toolAliases[href] ?? toolAliases[tool.slug] ?? "";
  const searchable = normalize([tool.name, tool.description, tool.category, href.replaceAll("-", " "), tool.keywords, alias].join(" "));
  const words = searchable.split(" ");
  return tokens.every((token) => {
    const alternatives = [token, ...(querySynonyms[token] ?? [])].map(normalize);
    return alternatives.some((alternative) => words.some((word) =>
      word.includes(alternative) || (alternative.length >= 5 && word.length >= 5 && editDistanceAtMostOne(word, alternative))
    ));
  });
}
