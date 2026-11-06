"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getSharedUiCopy, localeFromPathname } from "../lib/i18n/shared-ui";

type Preferences = { necessary: true; analytics: boolean; advertising: boolean; savedAt: string };
const STORAGE_KEY = "pdfora-cookie-preferences-v1";

export default function CookieConsent({ gaId }: { gaId?: string }) {
  const pathname = usePathname() || "/";
  const copy = getSharedUiCopy(localeFromPathname(pathname)).cookie;
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    const openSettings = () => setOpen(true);
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

    {!preferences && !open && <section role="dialog" aria-label={copy.consentLabel} className="fixed inset-x-3 bottom-16 z-[70] mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-16">
      <h2 className="font-bold text-slate-900">{copy.privacyChoices}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">{copy.consentDescription}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => save(false, false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">{copy.rejectOptional}</button>
        <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">{copy.customize}</button>
        <button type="button" onClick={() => save(true, true)} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white">{copy.acceptAll}</button>
      </div>
    </section>}

    {open && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-3 sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title" className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-3"><h2 id="cookie-settings-title" className="text-lg font-extrabold text-slate-900">{copy.settings}</h2><button type="button" onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-xl text-slate-500" aria-label={copy.closeSettings}>×</button></div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{copy.settingsDescription}</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl border p-3"><div><p className="font-semibold text-slate-900">{copy.essential}</p><p className="text-xs text-slate-500">{copy.essentialDescription}</p></div><span className="text-xs font-bold text-teal-700">{copy.alwaysOn}</span></div>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3"><span><span className="block font-semibold text-slate-900">{copy.analytics}</span><span className="text-xs text-slate-500">{copy.analyticsDescription}</span></span><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="h-5 w-5 accent-teal-700" /></label>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3"><span><span className="block font-semibold text-slate-900">{copy.advertising}</span><span className="text-xs text-slate-500">{copy.advertisingDescription}</span></span><input type="checkbox" checked={advertising} onChange={(event) => setAdvertising(event.target.checked)} className="h-5 w-5 accent-teal-700" /></label>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => save(false, false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">{copy.rejectOptional}</button><button type="button" onClick={() => save(analytics, advertising)} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white">{copy.savePreferences}</button></div>
        <a href="/privacy" className="mt-4 inline-block text-xs font-semibold text-teal-700 underline">{copy.privacyPolicy}</a>
      </section>
    </div>}
  </>;
}

export function CookieSettingsLink() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("pdfora:open-cookie-settings"))} className="hover:underline">Cookie settings</button>;
}
