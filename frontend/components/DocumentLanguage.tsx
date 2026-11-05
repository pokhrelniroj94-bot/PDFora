"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const supportedLocales = new Set(["ne", "hi", "es", "fr", "de", "pt", "ar", "bn", "id", "zh", "ja"]);

export default function DocumentLanguage() {
  const pathname = usePathname();

  useEffect(() => {
    const firstSegment = (pathname || "/").split("/").filter(Boolean)[0] || "";
    const language = supportedLocales.has(firstSegment) ? firstSegment : "en";
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [pathname]);

  return null;
}
