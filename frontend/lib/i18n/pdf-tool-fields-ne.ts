const nepaliFieldCopy: Record<string, string> = {
  "Background text": "पृष्ठभूमिको पाठ",
  "DRAFT": "मस्यौदा",
  "Background color (preset)": "पृष्ठभूमिको रङ (पूर्वनिर्धारित)",
  "Number of blank pages to add": "थप्नुपर्ने खाली पृष्ठ संख्या",
  "Bookmarks (one per line: page:title)": "बुकमार्क (प्रत्येक लाइनमा: पृष्ठ:शीर्षक)",
  "1:Introduction\n5:Chapter One\n12:Conclusion": "१:परिचय\n५:पहिलो अध्याय\n१२:निष्कर्ष",
  "Position": "स्थान",
  "Starting number": "सुरु हुने नम्बर",
  "Skip first page (true/false)": "पहिलो पृष्ठ छोड्ने (true/false)",
  "Font size": "फन्ट आकार",
  "Prefix (optional)": "उपसर्ग (वैकल्पिक)",
  "CASE-": "मुद्दा-",
  "Number of digits": "अङ्कको संख्या",
  "Margin in points (default 36)": "मार्जिन (पोइन्टमा, पूर्वनिर्धारित ३६)",
  "Pages (all or e.g. 1,3,5)": "पृष्ठ (सबै वा उदाहरण: १,३,५)",
  "Document title": "कागजातको शीर्षक",
  "Author": "लेखक",
  "Subject": "विषय",
  "Keywords (comma-separated)": "किवर्ड (अल्पविरामले छुट्याउनुहोस्)",
  "Enter page numbers, e.g. 2,4,6": "पृष्ठ नम्बर लेख्नुहोस्, उदाहरण: २,४,६",
  "Enter page numbers or range, e.g. 1,3,5-8": "पृष्ठ नम्बर वा दायरा लेख्नुहोस्, उदाहरण: १,३,५-८",
  "Header text": "हेडरको पाठ",
  "Footer text": "फुटरको पाठ",
  "Image quality (1–100)": "तस्बिरको गुणस्तर (१–१००)",
  "Password (minimum 6 characters)": "पासवर्ड (कम्तीमा ६ अक्षर)",
  "Page order (example: 3,1,2)": "पृष्ठक्रम (उदाहरण: ३,१,२)",
  "Pages to rotate (e.g. 1,3,5 or all)": "घुमाउनुपर्ने पृष्ठ (उदाहरण: १,३,५ वा सबै)",
  "Rotation degrees (90, 180 or 270)": "घुमाउने डिग्री (९०, १८० वा २७०)",
  "Name to display as signature": "हस्ताक्षरमा देखाउने नाम",
  "Existing PDF password": "हालको PDF पासवर्ड",
  "Enter watermark text": "वाटरमार्कको पाठ लेख्नुहोस्"
};

export function getNepaliPdfFieldText(value?: string): string | undefined {
  if (value === undefined) return undefined;
  return nepaliFieldCopy[value] ?? value;
}
