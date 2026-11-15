"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "pdfora-cookie-preferences-v1";

/** Advertising code must remain unloaded until the user explicitly opts in. */
export function useAdvertisingConsent(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const readConsent = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setAllowed(!!saved && JSON.parse(saved).advertising === true);
      } catch {
        setAllowed(false);
      }
    };

    readConsent();
    window.addEventListener("pdfora:consent-updated", readConsent);
    return () => window.removeEventListener("pdfora:consent-updated", readConsent);
  }, []);

  return allowed;
}
