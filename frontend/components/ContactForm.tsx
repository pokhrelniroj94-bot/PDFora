"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      tool: String(data.get("tool") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Your message could not be sent. Please try again later.");
      form.reset();
      setStatus({ type: "success", message: "Thank you. Your message has been sent." });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Your message could not be sent. Please try again later." });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-black text-slate-950">Send us a message</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Tell us which tool you were using and what happened. Your email address is used only so we can reply.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">Name
          <input name="name" required maxLength={100} autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal" />
        </label>
        <label className="block text-sm font-semibold text-slate-700">Email
          <input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal" />
        </label>
      </div>
      <label className="mt-4 block text-sm font-semibold text-slate-700">Tool name (optional)
        <input name="tool" maxLength={120} placeholder="e.g. PDF to Word" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal" />
      </label>
      <label className="mt-4 block text-sm font-semibold text-slate-700">Message
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 font-normal" />
      </label>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {status && <p role="status" className={status.type === "success" ? "mt-4 text-sm font-semibold text-emerald-700" : "mt-4 text-sm font-semibold text-red-700"}>{status.message}</p>}
      <button type="submit" disabled={sending} className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{sending ? "Sending…" : "Send message"}</button>
    </form>
  );
}
