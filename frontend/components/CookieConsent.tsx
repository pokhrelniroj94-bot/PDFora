"use client";

import { useEffect, useRef, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

type Preferences = { necessary: true; analytics: boolean; advertising: boolean; savedAt: string };
const STORAGE_KEY = "pdfora-cookie-preferences-v1";

export default function CookieConsent({ gaId }: { gaId?: string }) {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const openSettings = () => {
      const active = document.activeElement;
      returnFocusRef.current = active instanceof HTMLElement ? active : null;
      setOpen(true);
    };
    window.addEventListener("pdfora:open-cookie-settings", openSettings);
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Preferences;
          setPreferences({ necessary: true, analytics: !!parsed.analytics, advertising: !!parsed.advertising, savedAt: parsed.savedAt || new Date().toISOString() });
          setAnalytics(!!parsed.analytics);
          setAdvertising(!!parsed.advertising);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
      setReady(true);
    }, 0);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pdfora:open-cookie-settings", openSettings);
    };
  }, []);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
    else returnFocusRef.current?.focus();
  }, [open]);

  const save = (nextAnalytics: boolean, nextAdvertising: boolean) => {
    const next: Preferences = { necessary: true, analytics: nextAnalytics, advertising: nextAdvertising, savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setPreferences(next);
    setAnalytics(nextAnalytics);
    setAdvertising(nextAdvertising);
    setOpen(false);
  };

  if (!ready) return null;

  return <>
    {gaId && preferences?.analytics && <GoogleAnalytics gaId={gaId} />}

    {!preferences && !open && <section role="dialog" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description" className="fixed inset-x-3 bottom-16 z-[70] mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-16">
      <h2 id="cookie-consent-title" className="font-bold text-slate-900">Your privacy choices</h2>
      <p id="cookie-consent-description" className="mt-1 text-sm leading-6 text-slate-600">PDFora uses essential storage to keep the site working. With your permission, analytics cookies help us understand site usage. You can change your choice anytime in Cookie settings.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => save(false, false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">Reject optional</button>
        <button type="button" onClick={(event) => { returnFocusRef.current = event.currentTarget; setOpen(true); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">Customize</button>
        <button type="button" onClick={() => save(true, true)} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white">Accept all</button>
      </div>
    </section>}

    {open && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-3 sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" aria-describedby="cookie-settings-description" onKeyDown={(event) => {
          if (event.key === "Escape") { setOpen(false); return; }
          if (event.key === "Tab") {
            const focusable = event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]");
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
          }
        }} className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-3"><h2 id="cookie-settings-title" className="text-lg font-extrabold text-slate-900">Cookie settings</h2><button ref={closeButtonRef} type="button" onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-xl text-slate-500" aria-label="Close cookie settings">×</button></div>
        <p id="cookie-settings-description" className="mt-2 text-sm leading-6 text-slate-600">Choose which optional cookies PDFora may use. Essential storage is always active because it supports core site functions and remembers your privacy choice.</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl border p-3"><div><p className="font-semibold text-slate-900">Essential</p><p className="text-xs text-slate-500">Required for basic site operation</p></div><span className="text-xs font-bold text-teal-700">Always on</span></div>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3"><span><span className="block font-semibold text-slate-900">Analytics</span><span className="text-xs text-slate-500">Helps us understand visits and improve tools</span></span><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="h-5 w-5 accent-teal-700" /></label>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3"><span><span className="block font-semibold text-slate-900">Advertising</span><span className="text-xs text-slate-500">Stores your preference for advertising-related technologies</span></span><input type="checkbox" checked={advertising} onChange={(event) => setAdvertising(event.target.checked)} className="h-5 w-5 accent-teal-700" /></label>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => save(false, false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">Reject optional</button><button type="button" onClick={() => save(analytics, advertising)} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white">Save preferences</button></div>
        <a href="/privacy" className="mt-4 inline-block text-xs font-semibold text-teal-700 underline">Read our privacy policy</a>
      </section>
    </div>}
  </>;
}

export function CookieSettingsLink() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("pdfora:open-cookie-settings"))} className="hover:underline">Cookie settings</button>;
}
