import type { Metadata } from "next";

const baseUrl = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "Contact PDFora",
  description: "Contact PDFora about PDF tool problems, feedback, feature requests and privacy questions. Find the right way to report an issue with an online PDF tool.",
  alternates: { canonical: `${baseUrl}/contact` },
  openGraph: {
    title: "Contact PDFora",
    description: "Get information about contacting PDFora for support, feedback and privacy questions.",
    url: `${baseUrl}/contact`,
    siteName: "PDFora",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact PDFora",
    description: "Support information, feedback and privacy questions for PDFora.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2">
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
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">We’d love to hear from you.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Have a question, suggestion, feedback, or a problem with one of our PDF tools? This page explains the types of enquiries PDFora is intended to receive.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl" aria-hidden="true">🛠️</div>
              <h2 className="mt-5 text-lg font-black">Tool Support</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">If a PDF tool is not working correctly, note the tool name, the steps that caused the problem, and any error message. Do not include passwords or confidential document contents in a support report.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl" aria-hidden="true">💡</div>
              <h2 className="mt-5 text-lg font-black">Feedback & Suggestions</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Suggestions about usability, accessibility, supported formats and new PDF features help guide future improvements.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl" aria-hidden="true">🔒</div>
              <h2 className="mt-5 text-lg font-black">Privacy and Copyright Enquiries</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">For privacy, data-protection, copyright or abuse concerns, use the contact channel published by the site operator when it becomes available. Do not send sensitive personal information or copies of private documents through public channels.</p>
            </div>
          </div>
          <div className="mt-8 rounded-3xl border border-violet-100 bg-violet-50 p-6 text-center">
            <p className="text-sm leading-7 text-slate-700">A public support email address is not currently published. PDFora will update this page when an official support contact is available.</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <a href="/privacy" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 hover:bg-slate-100">Privacy Policy</a>
            <a href="/terms" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 hover:bg-slate-100">Terms of Service</a>
            <a href="/about" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-600 hover:bg-slate-100">About PDFora</a>
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-center text-xs text-slate-500">© 2026 PDFora. All rights reserved.</footer>
    </main>
  );
}