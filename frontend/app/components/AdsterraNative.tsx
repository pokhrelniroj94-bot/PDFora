"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePrivacyConsent } from "../../components/PrivacyConsent";

export default function AdsterraNative() {
  const { consent } = usePrivacyConsent();
  const [adReady, setAdReady] = useState(false);

  useEffect(() => {
    if (!consent?.ads) {
      setAdReady(false);
      return;
    }
    const container = document.getElementById("container-bbb2fb9fcb838f327d814f02841f42be");
    if (!container) return;
    const checkCreative = () => setAdReady(Boolean(container.querySelector("iframe, ins, [data-ad]")));
    checkCreative();
    const observer = new MutationObserver(checkCreative);
    observer.observe(container, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect();
  }, [consent?.ads]);

  if (!consent?.ads) return null;
  return (
    <section
      aria-label="Advertisement"
      className={adReady ? "mx-auto max-w-6xl px-4 py-6 sm:px-6" : "hidden"}
    >
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Advertisement
      </p>
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white p-2">
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
