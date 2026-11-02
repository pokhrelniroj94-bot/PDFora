"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Consent = { analytics: boolean; ads: boolean };
type ConsentContextValue = {
  consent: Consent | null;
  choose: (next: Consent) => void;
  openSettings: () => void;
};
const STORAGE_KEY = "pdfora-privacy-consent-v1";
const ConsentContext = createContext<ConsentContextValue | null>(null);

export function usePrivacyConsent() {
  const value = useContext(ConsentContext);
  if (!value) throw new Error("usePrivacyConsent must be used inside PrivacyConsentProvider");
  return value;
}

export function PrivacyConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);
  const [adsChoice, setAdsChoice] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Consent>;
        if (typeof parsed.analytics === "boolean" && typeof parsed.ads === "boolean") {
          setConsent({ analytics: parsed.analytics, ads: parsed.ads });
          setAnalyticsChoice(parsed.analytics);
          setAdsChoice(parsed.ads);
        }
      }
    } catch {
      // Storage may be unavailable in private browsing or restricted contexts.
    } finally {
      setReady(true);
    }
  }, []);

  const choose = useCallback((next: Consent) => {
    setConsent(next);
    setAnalyticsChoice(next.analytics);
    setAdsChoice(next.ads);
    setSettingsOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Consent remains effective for the current page view if storage is unavailable.
    }
  }, []);

  const openSettings = useCallback(() => {
    setAnalyticsChoice(consent?.analytics ?? false);
    setAdsChoice(consent?.ads ?? false);
    setSettingsOpen(true);
  }, [consent]);

  const contextValue = useMemo(() => ({ consent, choose, openSettings }), [consent, choose, openSettings]);

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
      {ready && (consent === null || settingsOpen) && (
        <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white p-4 shadow-[0_-12px_40px_rgba(15,23,42,.16)] sm:p-5" role="dialog" aria-modal="false" aria-labelledby="privacy-consent-title">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <h2 id="privacy-consent-title" className="text-base font-bold text-slate-950">Your privacy choices</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">PDFora uses essential storage to remember your choice. With your permission, Google Analytics measures site usage and Adsterra provides advertising. Optional services stay off until you choose.</p>
                <a href="/privacy" className="mt-1 inline-block text-sm font-semibold text-teal-700 underline">Read the Privacy Policy</a>
                {settingsOpen && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-800">
                      <input type="checkbox" checked={analyticsChoice} onChange={(event) => setAnalyticsChoice(event.target.checked)} />
                      <span><strong className="block">Analytics</strong><span className="text-slate-500">Google Analytics usage measurement</span></span>
                    </label>
                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-800">
                      <input type="checkbox" checked={adsChoice} onChange={(event) => setAdsChoice(event.target.checked)} />
                      <span><strong className="block">Advertising</strong><span className="text-slate-500">Adsterra advertising technology</span></span>
                    </label>
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:max-w-[360px] sm:justify-end">
                {settingsOpen ? (
                  <>
                    <button type="button" onClick={() => choose({ analytics: false, ads: false })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">Reject optional</button>
                    <button type="button" onClick={() => choose({ analytics: analyticsChoice, ads: adsChoice })} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white">Save choices</button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => choose({ analytics: false, ads: false })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">Reject optional</button>
                    <button type="button" onClick={openSettings} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">Settings</button>
                    <button type="button" onClick={() => choose({ analytics: true, ads: true })} className="rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white">Accept all</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {ready && consent !== null && !settingsOpen && (
        <button type="button" onClick={openSettings} className="fixed bottom-3 left-3 z-[90] rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-md hover:bg-slate-50">Cookie settings</button>
      )}
    </ConsentContext.Provider>
  );
}
