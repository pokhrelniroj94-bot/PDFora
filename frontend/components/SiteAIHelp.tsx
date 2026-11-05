"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Message = { role: "user" | "assistant"; text: string };

const quickQuestions = [
  "Yo page ko tool kasari use garne?",
  "PDF compress garda kun setting ramro?",
  "CV lai ATS-friendly kasari banaune?",
  "NEPSE ko RSI ra MACD kasari bujhne?",
];

export default function SiteAIHelp() {
  const pathname = usePathname();
  const pagePath = (pathname || "/").replace(/^\/(ne|hi|es|fr|de|pt|ar|bn|id|zh|ja)(?=\/|$)/, "") || "/";
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Namaste! Ma PDFora ko AI Help ho. Kun tool use garna, result bujhna, wa problem solve garna help chahiyo?" },
  ]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pageContext, setPageContext] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadPageContext() {
      setPageContext("");
      try {
        if (pagePath === "/market" || pagePath === "/tools/market-ai") {
          const response = await fetch("/api/nepse-market?symbol=NEPSE&period=1Y", { cache: "no-store", signal: controller.signal });
          if (!response.ok) return;
          const data = await response.json();
          setPageContext(JSON.stringify({ pageType: "NEPSE market", source: data.source, sourceUpdatedAt: data.sourceUpdatedAt, latestHistoryDate: data.latestHistoryDate, quoteStale: data.quoteStale, status: data.status, indices: data.indices, recentDailyHistory: Array.isArray(data.points) ? data.points.slice(-45) : [] }).slice(0, 3200));
        }
      } catch {
        if (!controller.signal.aborted) setPageContext("Live page data could not be loaded. Do not invent current values; explain this limitation and guide the user to refresh the data panel.");
      }
    }
    void loadPageContext();
    return () => controller.abort();
  }, [pathname]);


  async function send(text: string) {
    const clean = text.trim();
    if (!clean || busy) return;
    const next: Message[] = [...messages, { role: "user", text: clean }];
    setMessages(next);
    setQuestion("");
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/ai-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "site-help",
          page: pathname || "/",
          question: clean,
          history: next.slice(-8, -1).map((item) => item.role.toUpperCase() + ": " + item.text).join("\n").slice(0, 2600),
          pageData: pageContext,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "AI help is temporarily unavailable.");
      const answer = typeof payload.text === "string" ? payload.text.trim() : "";
      if (!answer) throw new Error("AI returned an empty answer. Please try again.");
      setMessages((old) => [...old, { role: "assistant", text: answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI help is temporarily unavailable.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3 print:hidden">
      {open && (
        <section aria-label="PDFora AI Help" className="flex h-[min(620px,calc(100dvh-112px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-[#082321] px-4 py-3 text-white">
            <div><p className="text-sm font-extrabold">PDFora AI Help</p><p className="text-[11px] text-teal-100">Help for the page you are viewing</p></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close AI Help" className="rounded-lg px-2 py-1 text-xl hover:bg-white/10">×</button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3" aria-live="polite">
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] leading-4 text-amber-900">AI answers may be wrong. Do not share passwords, OTPs, bank details or confidential information. If AI is enabled, your question is sent to the configured provider. Do not share sensitive information.</p>
            {messages.map((message, index) => (
              <div key={index} className={"max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-sm leading-5 " + (message.role === "user" ? "ml-auto bg-teal-700 text-white" : "mr-auto border border-slate-200 bg-white text-slate-800")}>{message.text}</div>
            ))}
            {busy && <p className="mr-auto rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">PDFora AI is thinking…</p>}
            {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-800">{error}</p>}
            {messages.length === 1 && <div className="flex flex-wrap gap-2">{quickQuestions.map((item) => <button type="button" key={item} onClick={() => void send(item)} className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-left text-[11px] font-semibold text-teal-800 hover:bg-teal-50">{item}</button>)}</div>}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); void send(question); }} className="flex gap-2 border-t border-slate-200 bg-white p-3">
            <input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={2000} disabled={busy} placeholder="Ask for help…" aria-label="Ask PDFora AI Help" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
            <button type="submit" disabled={busy || !question.trim()} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Send</button>
          </form>
        </section>
      )}
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close PDFora AI Help" : "Open PDFora AI Help"} className="flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-teal-950/25 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">
        <span aria-hidden="true">✦</span><span>{open ? "Close Help" : "Ask PDFora AI"}</span>
      </button>
    </div>
  );
}
