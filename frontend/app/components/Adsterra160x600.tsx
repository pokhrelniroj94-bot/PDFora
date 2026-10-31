"use client";

import { useEffect } from "react";

export default function Adsterra160x600() {
  useEffect(() => {
    const container = document.getElementById("adsterra-160x600");
    if (!container || container.dataset.loaded === "true") return;

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
  }, []);

  return (
    <section className="hidden lg:block mx-auto w-full py-8" aria-label="Advertisement">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Advertisement
      </p>
      <div className="mx-auto min-h-[600px] w-[160px]" id="adsterra-160x600" />
    </section>
  );
}
