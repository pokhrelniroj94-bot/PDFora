/**
 * Hindi labels, placeholders and default example values for PDF tool form fields.
 * Keys are the exact English strings used by lib/i18n/nepali-pdf-routes.ts.
 * Numbers inside example values stay ASCII so the server-side parsers keep working;
 * they remain fully editable by the user.
 */
const hindiFieldCopy: Record<string, string> = {
  "Background text": "पृष्ठभूमि का टेक्स्ट",
  "DRAFT": "मसौदा",
  "Background color (preset)": "पृष्ठभूमि का रंग (पहले से तय)",
  "Number of blank pages to add": "जोड़ने के लिए खाली पृष्ठों की संख्या",
  "Bookmarks (one per line: page:title)": "बुकमार्क (हर पंक्ति में: पृष्ठ:शीर्षक)",
  "1:Introduction\n5:Chapter One\n12:Conclusion": "1:परिचय\n5:पहला अध्याय\n12:निष्कर्ष",
  "1:Introduction": "1:परिचय",
  "Position": "स्थान",
  "Starting number": "शुरू होने वाली संख्या",
  "Skip first page (true/false)": "पहला पृष्ठ छोड़ें (true/false)",
  "Font size": "फ़ॉन्ट आकार",
  "Prefix (optional)": "उपसर्ग (वैकल्पिक)",
  "CASE-": "केस-",
  "Number of digits": "अंकों की संख्या",
  "Margin in points (default 36)": "हाशिया (पॉइंट में, डिफ़ॉल्ट 36)",
  "Pages (all or e.g. 1,3,5)": "पृष्ठ (सभी या जैसे: 1,3,5)",
  "Document title": "दस्तावेज़ का शीर्षक",
  "Author": "लेखक",
  "Subject": "विषय",
  "Keywords (comma-separated)": "कीवर्ड (कॉमा से अलग करें)",
  "Enter page numbers, e.g. 2,4,6": "पृष्ठ संख्याएँ लिखें, जैसे: 2,4,6",
  "Enter page numbers or range, e.g. 1,3,5-8": "पृष्ठ संख्याएँ या सीमा लिखें, जैसे: 1,3,5-8",
  "Header text": "हेडर का टेक्स्ट",
  "Footer text": "फ़ुटर का टेक्स्ट",
  "Image quality (1–100)": "चित्र की गुणवत्ता (1–100)",
  "Password (minimum 6 characters)": "पासवर्ड (कम से कम 6 अक्षर)",
  "Page order (example: 3,1,2)": "पृष्ठ क्रम (उदाहरण: 3,1,2)",
  "Pages to rotate (e.g. 1,3,5 or all)": "घुमाने वाले पृष्ठ (जैसे: 1,3,5 या all)",
  "Rotation degrees (90, 180 or 270)": "घुमाने के डिग्री (90, 180 या 270)",
  "Name to display as signature": "हस्ताक्षर में दिखाने वाला नाम",
  "Existing PDF password": "मौजूदा PDF पासवर्ड",
  "Enter watermark text": "वॉटरमार्क का टेक्स्ट लिखें",
};

export function getHindiPdfFieldText(value?: string): string | undefined {
  if (value === undefined) return undefined;
  return hindiFieldCopy[value] ?? value;
}

export const hindiFieldKeys: readonly string[] = Object.keys(hindiFieldCopy);
