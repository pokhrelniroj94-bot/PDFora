"use client";

import { useEffect, useMemo, useState } from "react";

type Report = {
  type?: string; quarter?: string; fy?: string; pe?: number; eps?: number;
  paid_up_capital?: number; profit?: number; net_worth_per_share?: number;
  documents?: Array<{ submitted_date?: string }>;
};
type Payload = { research?: Record<string, unknown>; provider?: string; fetchedAt?: string; notice?: string; matchedRecords?: number };
const number = (value: unknown): number | null => {
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value.replace(/,/g, "")) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
};
const money = (value: number | null) => value === null ? "Unavailable" : value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
const quarterRank = (value: string) => ({ "first quarter": 1, "second quarter": 2, "third quarter": 3, "fourth quarter": 4 }[value.toLowerCase()] || 0);
function fyStart(value: string) { const match = value.match(/(20\d{2})/); return match ? Number(match[1]) : 0; }

export default function NepseFundamentalReview({ symbol, price }: { symbol: string; price: number }) {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [loadedSymbol, setLoadedSymbol] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/nepse-research?symbol=" + encodeURIComponent(symbol), { cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Company financial data is unavailable.");
        return data as Payload;
      })
      .then(data => { if (active) { setPayload(data); setError(""); setLoadedSymbol(symbol); } })
      .catch(reason => { if (active) { setError(reason instanceof Error ? reason.message : "Could not load company fundamentals."); setLoadedSymbol(symbol); } });
    return () => { active = false; };
  }, [symbol]);

  const review = useMemo(() => {
    const source = payload?.research?.["company financials"];
    if (!Array.isArray(source)) return { latest: null as Report | null, epsGrowth: null as number | null, profitGrowth: null as number | null, reports: 0 };
    const reports = source.flatMap(item => {
      if (!item || typeof item !== "object") return [];
      const nested = (item as Record<string, unknown>).reports;
      return Array.isArray(nested) ? nested.filter((r): r is Report => Boolean(r) && typeof r === "object") : [];
    }).filter(report => Boolean(report.fy && report.quarter))
      .sort((a,b) => fyStart(b.fy || "") - fyStart(a.fy || "") || quarterRank(b.quarter || "") - quarterRank(a.quarter || ""));
    const latest = reports[0] || null;
    if (!latest) return { latest: null, epsGrowth: null, profitGrowth: null, reports: 0 };
    const previous = reports.find(report => report.quarter?.toLowerCase() === latest.quarter?.toLowerCase() && fyStart(report.fy || "") < fyStart(latest.fy || ""));
    const growth = (current: unknown, prior: unknown) => {
      const a = number(current), b = number(prior);
      return a !== null && b !== null && b !== 0 ? (a / b - 1) * 100 : null;
    };
    return { latest, epsGrowth: previous ? growth(latest.eps, previous.eps) : null, profitGrowth: previous ? growth(latest.profit, previous.profit) : null, reports: reports.length };
  }, [payload]);

  if (loadedSymbol !== symbol) return <section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-extrabold text-slate-900">Fundamental snapshot · {symbol}</h3><p className="mt-2 text-sm text-slate-500">Loading available company financial reports…</p></section>;
  if (error) return <section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-extrabold text-slate-900">Fundamental snapshot · {symbol}</h3><p className="mt-2 text-sm text-amber-800">{error} Technical analysis remains available without this optional dataset.</p></section>;
  const report = review.latest;
  if (!report) return <section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-extrabold text-slate-900">Fundamental snapshot · {symbol}</h3><p className="mt-2 text-sm text-slate-600">{payload?.notice || "No structured company financial report was matched. Missing data is unavailable, not zero."}</p><p className="mt-2 text-xs text-slate-500">Provider: YONEPSE community dataset · not an official NEPSE API</p></section>;

  const eps = number(report.eps), pe = number(report.pe), book = number(report.net_worth_per_share);
  const pb = book !== null && book > 0 && price > 0 ? price / book : null;
  const submitted = report.documents?.map(document => document.submitted_date).filter(Boolean).sort().at(-1);
  const growthText = (value: number | null) => value === null ? "Not comparable / unavailable" : (value > 0 ? "+" : "") + value.toFixed(2) + "%";
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">Fundamental snapshot · {symbol}</h3><p className="mt-1 text-xs text-slate-500">{report.type || "Financial report"} · {report.quarter} · FY {report.fy}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Non-AI data analysis</span></div>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {[["Reported EPS", money(eps)],["Reported P/E", money(pe)],["Book value / share", money(book)],["Indicative P/B", money(pb)],["Reported profit (NPR)", money(number(report.profit))],["EPS YoY · same quarter", growthText(review.epsGrowth)],["Profit YoY · same quarter", growthText(review.profitGrowth)],["Paid-up capital (NPR)", money(number(report.paid_up_capital))],["Reports matched", String(review.reports)]].map(([label,value])=><div key={label} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-bold text-slate-900">{value}</p></div>)}
    </div>
    <p className="mt-3 text-xs leading-5 text-slate-500">Latest matched report only. YoY growth is shown only when the same quarter from an earlier fiscal year exists. Indicative P/B = latest market close ÷ reported book value per share. P/E is displayed as supplied by the dataset; no unsupported valuation threshold is applied. {submitted ? "Document submitted: " + submitted + ". " : ""}Financial dataset may be delayed or incomplete and is not a substitute for the original report.</p>
    <p className="mt-2 text-xs text-slate-500">Source: YONEPSE public community dataset · independent project, not an official NEPSE API.</p>
  </section>;
}
