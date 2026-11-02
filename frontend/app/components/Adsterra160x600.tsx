"use client";

import { useEffect, useState } from "react";
import { usePrivacyConsent } from "../../components/PrivacyConsent";

export default function Adsterra160x600() {
  const { consent } = usePrivacyConsent();
  const [adReady, setAdReady] = useState(false);
  useEffect(() => {
    if (!consent?.ads) {
      setAdReady(false);
      return;
    }
    const container = document.getElementById("adsterra-160x600");
    if (!container) return;
    const checkCreative = () => setAdReady(Boolean(container.querySelector("iframe, ins, [data-ad]")));
    checkCreative();
    const observer = new MutationObserver(checkCreative);
    observer.observe(container, { childList: true, subtree: true, attributes: true });
    if (container.dataset.loaded === "true") return () => observer.disconnect();

    container.dataset.loaded = "true";

    (window as Window & {
      atOptions?: {
        key: string;
        format: string;
        height: number;
        width: number;
        params: Record<string, never>;
      };
    }).atOptions = {
      key: "df82e8fddbed0dbc2cf5e53b28bc3d77",
      format: "iframe",
      height: 600,
      width: 160,
      params: {},
    };

    const script = document.createElement("script");
    script.src = "https://bauval.org/22/df82e8fddbed0dbc2cf5e53b28bc3d77";
    container.appendChild(script);
    return () => observer.disconnect();
  }, [consent?.ads]);

  if (!consent?.ads) return null;

  return (
    <section className={adReady ? "hidden lg:block mx-auto w-full py-8" : "hidden"} aria-label="Advertisement">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Advertisement
      </p>
      <div className="mx-auto w-[160px]" id="adsterra-160x600" />
    </section>
  );
}
