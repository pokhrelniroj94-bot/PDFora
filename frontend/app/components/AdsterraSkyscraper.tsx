"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, never>;
    };
  }
}

export default function AdsterraSkyscraper() {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || slot.dataset.loaded === "true") return;

    window.atOptions = {
      key: "df82e8fddbed0dbc2cf5e53b28bc3d77",
      format: "iframe",
      height: 600,
      width: 160,
      params: {},
    };

    const script = document.createElement("script");
    script.src = "https://bauval.org/22/df82e8fddbed0dbc2cf5e53b28bc3d77";
    script.async = true;
    script.dataset.cfasync = "false";
    slot.dataset.loaded = "true";
    slot.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      className="pointer-events-auto fixed right-[max(0px,calc((100vw-1360px)/2))] top-28 z-20 hidden w-[160px] min-[1360px]:block"
    >
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Advertisement
      </p>
      <div
        ref={slotRef}
        className="h-[600px] w-[160px] overflow-hidden bg-white"
      />
    </aside>
  );
}
