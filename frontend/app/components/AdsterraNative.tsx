"use client";

import { useEffect } from "react";

export default function AdsterraNative() {
  useEffect(() => {
    const containerId = "container-bbb2fb9fcb838f327d814f02841f42be";
    const container = document.getElementById(containerId);

    if (!container) return;

    if (container.querySelector("script[data-adsterra-native]")) return;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.setAttribute("data-adsterra-native", "true");
    script.src = "https://bauval.org/21/bbb2fb9fcb838f327d814f02841f42be";

    container.appendChild(script);

    return () => {
      // Keep the script in place; do not remove a loaded ad.
    };
  }, []);

  return (
    <section aria-label="Advertisement" className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Advertisement
      </p>
      <div className="min-h-[100px] overflow-hidden rounded-xl border border-slate-100 bg-white p-2">
        <div id="container-bbb2fb9fcb838f327d814f02841f42be" />
      </div>
    </section>
  );
}
