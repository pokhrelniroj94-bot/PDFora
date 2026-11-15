"use client";

import { useEffect, useState } from "react";

import Script from "next/script";

export default function AdsterraNative() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const readConsent = () => {
      try {
        const saved = localStorage.getItem("pdfora-cookie-preferences-v1");
        setAllowed(!!saved && JSON.parse(saved).advertising === true);
      } catch {
        setAllowed(false);
      }
    };
    readConsent();
    window.addEventListener("pdfora:consent-updated", readConsent);
    return () => window.removeEventListener("pdfora:consent-updated", readConsent);
  }, []);

  if (!allowed) return null;

  return (
    <section
      aria-label="Advertisement"
      className="mx-auto max-w-6xl px-4 py-6 sm:px-6"
    >
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Advertisement
      </p>

      <div className="min-h-[100px] overflow-hidden rounded-xl border border-slate-100 bg-white p-2">
        <Script
          src="https://bauval.org/21/bbb2fb9fcb838f327d814f02841f42be"
          strategy="afterInteractive"
          data-cfasync="false"
        />

        <div id="container-bbb2fb9fcb838f327d814f02841f42be" />
      </div>
    </section>
  );
}
