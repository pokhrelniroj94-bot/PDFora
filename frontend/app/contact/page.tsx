import type { Metadata } from "next";
import { hreflangMap } from "../../lib/i18n/routing";

const localizedAlternates = hreflangMap("/contact");

export const metadata: Metadata = {
  title: "Contact PDFora | Support, Feedback and Privacy Questions",
  description: "Contact the PDFora team by email for tool support, feedback, bug reports, business enquiries and privacy questions.",
  alternates: { canonical: "https://pd-fora.vercel.app/contact", ...(localizedAlternates ? { languages: localizedAlternates } : {}) },
  openGraph: { type: "website", url: "https://pd-fora.vercel.app/contact", siteName: "PDFora", title: "Contact PDFora", description: "Email PDFora for tool support, feedback, bug reports, business enquiries and privacy questions." },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2" aria-label="PDFora home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">P</div>
            <span className="text-xl font-black tracking-tight">PDF<span className="text-violet-600">ora</span></span>
          </a>
          <a href="/" className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800">Back to Home</a>
        </div>
      </header>

      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">Contact PDFora</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">How can we help?</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Contact our team about PDF tools, technical problems, suggestions, privacy questions or business enquiries.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl" aria-hidden="true">🛠️</div>
              <h2 className="mt-5 text-lg font-black">Tool support and bug reports</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tell us which tool you used, what you expected to happen, what happened instead, and the browser/device you used. Do not attach confidential documents or passwords.
              </p>
            </section>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl" aria-hidden="true">💡</div>
              <h2 className="mt-5 text-lg font-black">Feedback and business enquiries</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Share feature ideas, accessibility feedback, partnership proposals or other suggestions that could make PDFora more useful.
              </p>
            </section>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl" aria-hidden="true">🔒</div>
              <h2 className="mt-5 text-lg font-black">Privacy questions</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                For questions about uploaded files, technical information, cookies, advertising or AI features, please review our Privacy Policy or email us.
              </p>
              <a href="/privacy" className="mt-3 inline-flex font-bold text-violet-700 underline underline-offset-4">Read the Privacy Policy</a>
            </section>
          </div>

          <div className="mt-8 rounded-3xl border border-violet-100 bg-violet-50 p-7 text-center">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">Email PDFora</p>
            <a href="mailto:pokhrelniroj94@gmail.com" className="mt-3 inline-block break-all text-xl font-black text-slate-950 underline decoration-violet-400 underline-offset-4 sm:text-2xl">
              pokhrelniroj94@gmail.com
            </a>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Please use a clear subject line and include only the information needed to understand your request. We aim to review messages, but cannot guarantee a response time.
            </p>
          </div>

          <nav aria-label="Related information" className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <a href="/privacy" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 hover:bg-slate-100">Privacy Policy</a>
            <a href="/terms" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 hover:bg-slate-100">Terms of Service</a>
            <a href="/about" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 hover:bg-slate-100">About PDFora</a>
          </nav>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-center text-xs text-slate-500">© 2026 PDFora. All rights reserved.</footer>
    </main>
  );
}