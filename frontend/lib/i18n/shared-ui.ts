import { localeInfo, type Locale } from "./config";

export type SharedUiCopy = {
  footerNavigation: string;
  allTools: string;
  guides: string;
  about: string;
  contact: string;
  language: string;
  englishHomepageNotice: string;
  directoryLabel: string;
  directoryTitle: string;
  directoryDescription: string;
  directoryLink: string;
  groups: Record<"Organize PDF" | "Convert PDF" | "Edit PDF" | "Secure & manage", string>;
};

const english: SharedUiCopy = {
  footerNavigation: "Footer navigation",
  allTools: "All Tools",
  guides: "Guides & Tutorials",
  about: "About PDFora",
  contact: "Contact",
  language: "Language",
  englishHomepageNotice: "Nepali homepage available; other pages are being translated.",
  directoryLabel: "Explore PDFora PDF tools",
  directoryTitle: "Explore all tools",
  directoryDescription: "PDF tools are here, with finance, text, developer and image utilities in our all-tools hub.",
  directoryLink: "Explore finance, text, developer & image tools →",
  groups: {
    "Organize PDF": "Organize PDF",
    "Convert PDF": "Convert PDF",
    "Edit PDF": "Edit PDF",
    "Secure & manage": "Secure & manage",
  },
};

const nepali: SharedUiCopy = {
  footerNavigation: "फुटर नेभिगेसन",
  allTools: "सबै टुलहरू",
  guides: "गाइड तथा ट्युटोरियल",
  about: "PDFora बारेमा",
  contact: "सम्पर्क",
  language: "भाषा",
  englishHomepageNotice: "हाल नेपाली होमपेज उपलब्ध छ; अन्य पेजहरू अनुवाद हुँदैछन्।",
  directoryLabel: "PDFora का PDF टुलहरू",
  directoryTitle: "सबै PDF टुलहरू",
  directoryDescription: "PDF टुलसँगै वित्त, टेक्स्ट, डेभलपर र इमेज उपयोगिताहरू सबै टुल पृष्ठमा उपलब्ध छन्।",
  directoryLink: "वित्त, टेक्स्ट, डेभलपर र इमेज टुलहरू हेर्नुहोस् →",
  groups: {
    "Organize PDF": "PDF मिलाउने",
    "Convert PDF": "PDF रूपान्तरण",
    "Edit PDF": "PDF सम्पादन",
    "Secure & manage": "सुरक्षा र व्यवस्थापन",
  },
};

const copies: Partial<Record<Locale, SharedUiCopy>> = { en: english, ne: nepali };

export function getSharedUiCopy(locale: Locale): SharedUiCopy {
  return copies[locale] ?? english;
}

export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && first in localeInfo ? (first as Locale) : "en";
}
