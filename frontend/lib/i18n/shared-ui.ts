import { isLocale, type Locale } from "./config";

export type SharedUiCopy = {
  footerNavigation: string;
  allTools: string;
  guides: string;
  about: string;
  contact: string;
  language: string;
  languageHint: string;
  englishHomepageNotice: string;
  directoryLabel: string;
  directoryTitle: string;
  directoryDescription: string;
  directoryLink: string;
  cookie: {
    consentLabel: string;
    privacyChoices: string;
    consentDescription: string;
    rejectOptional: string;
    customize: string;
    acceptAll: string;
    settings: string;
    settingsDescription: string;
    essential: string;
    essentialDescription: string;
    alwaysOn: string;
    analytics: string;
    analyticsDescription: string;
    advertising: string;
    advertisingDescription: string;
    closeSettings: string;
    savePreferences: string;
    privacyPolicy: string;
  };
  groups: Record<"Organize PDF" | "Convert PDF" | "Edit PDF" | "Secure & manage", string>;
};

const english: SharedUiCopy = {
  footerNavigation: "Footer navigation",
  allTools: "All Tools",
  guides: "Guides & Tutorials",
  about: "About PDFora",
  contact: "Contact",
  language: "Language",
  languageHint: "Choose a translated page where available; otherwise a clear fallback is shown.",
  englishHomepageNotice: "Nepali homepage available; other pages are being translated.",
  directoryLabel: "Explore PDFora PDF tools",
  directoryTitle: "Explore all tools",
  directoryDescription: "PDF tools are here, with finance, text, developer and image utilities in our all-tools hub.",
  directoryLink: "Explore finance, text, developer & image tools →",
  cookie: {
    consentLabel: "Cookie consent",
    privacyChoices: "Your privacy choices",
    consentDescription: "PDFora uses essential storage to keep the site working. With your permission, analytics cookies help us understand site usage. You can change your choice anytime in Cookie settings.",
    rejectOptional: "Reject optional",
    customize: "Customize",
    acceptAll: "Accept all",
    settings: "Cookie settings",
    settingsDescription: "Choose which optional cookies PDFora may use. Essential storage is always active because it supports core site functions and remembers your privacy choice.",
    essential: "Essential",
    essentialDescription: "Required for basic site operation",
    alwaysOn: "Always on",
    analytics: "Analytics",
    analyticsDescription: "Helps us understand visits and improve tools",
    advertising: "Advertising",
    advertisingDescription: "Stores your preference for advertising-related technologies",
    closeSettings: "Close cookie settings",
    savePreferences: "Save preferences",
    privacyPolicy: "Read our privacy policy",
  },
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
  languageHint: "अनुवाद उपलब्ध भएको पृष्ठ छान्नुहोस्; नभए स्पष्ट fallback देखाइन्छ।",
  englishHomepageNotice: "हाल नेपाली होमपेज उपलब्ध छ; अन्य पेजहरू अनुवाद हुँदैछन्।",
  directoryLabel: "PDFora का PDF टुलहरू",
  directoryTitle: "सबै PDF टुलहरू",
  directoryDescription: "PDF टुलसँगै वित्त, टेक्स्ट, डेभलपर र इमेज उपयोगिताहरू सबै टुल पृष्ठमा उपलब्ध छन्।",
  directoryLink: "वित्त, टेक्स्ट, डेभलपर र इमेज टुलहरू हेर्नुहोस् →",
  cookie: {
    consentLabel: "कुकी सहमति",
    privacyChoices: "तपाईंका गोपनीयता विकल्प",
    consentDescription: "साइट चलाउन PDFora ले आवश्यक भण्डारण प्रयोग गर्छ। तपाईंको अनुमतिमा विश्लेषणात्मक कुकीले साइट प्रयोग बुझ्न मद्दत गर्छ। कुकी सेटिङबाट विकल्प जुनसुकै बेला बदल्न सकिन्छ।",
    rejectOptional: "वैकल्पिक अस्वीकार",
    customize: "अनुकूलन",
    acceptAll: "सबै स्वीकार",
    settings: "कुकी सेटिङ",
    settingsDescription: "PDFora ले प्रयोग गर्न पाउने वैकल्पिक कुकी छान्नुहोस्। आवश्यक भण्डारण सधैं सक्रिय हुन्छ, किनकि यसले मुख्य सुविधा र तपाईंको गोपनीयता विकल्प सम्झन्छ।",
    essential: "आवश्यक",
    essentialDescription: "साइटको आधारभूत सञ्चालनका लागि आवश्यक",
    alwaysOn: "सधैं सक्रिय",
    analytics: "विश्लेषण",
    analyticsDescription: "भ्रमण बुझ्न र टुल सुधार्न मद्दत गर्छ",
    advertising: "विज्ञापन",
    advertisingDescription: "विज्ञापनसम्बन्धी प्रविधिका लागि तपाईंको विकल्प सम्झन्छ",
    closeSettings: "कुकी सेटिङ बन्द गर्नुहोस्",
    savePreferences: "विकल्प सुरक्षित गर्नुहोस्",
    privacyPolicy: "गोपनीयता नीति पढ्नुहोस्",
  },
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
  return first && isLocale(first) ? first : "en";
}
