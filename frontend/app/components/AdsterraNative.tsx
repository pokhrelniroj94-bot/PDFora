"use client";

import Script from "next/script";

export default function AdsterraNative() {
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
