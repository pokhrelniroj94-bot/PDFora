"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculatePortfolio, isTrade, type Trade } from "../lib/nepse-portfolio-math";

type EncryptedPortfolio = { version: 1; salt: string; iv: string; ciphertext: string };
type Quote = { symbol: string; ltp: number; name: string };

const STORAGE_KEY = "pdfora.nepse-portfolio.v1";
const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const label = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500";
const panel = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5";
const encoder = new TextEncoder();

function encodeBase64(bytes: Uint8Array) {
  let raw = "";
  bytes.forEach((value) => { raw += String.fromCharCode(value); });
  return btoa(raw);
}
function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}
async function deriveKey(passphrase: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 310_000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
export default function NepsePortfolio({ quotes, stale }: { quotes: Quote[]; stale: boolean }) {
  const [hasSaved, setHasSaved] = useState<boolean | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [date, setDate] = useState("");
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<Trade["side"]>("buy");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [fee, setFee] = useState("0");
  const keyRef = useRef<CryptoKey | null>(null);
  const saltRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    try {
      setHasSaved(Boolean(window.localStorage.getItem(STORAGE_KEY)));
      const now = new Date();
      setDate([now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-"));
    } catch {
      setHasSaved(false);
      setError("This browser does not allow local portfolio storage.");
    }
  }, []);

  const portfolio = useMemo(() => calculatePortfolio(trades), [trades]);
  const holdings = portfolio.holdings;
  const quotesBySymbol = useMemo(() => new Map(quotes.map((quote) => [quote.symbol, quote])), [quotes]);
  const locked = () => {
    keyRef.current = null;
    saltRef.current = null;
    setTrades([]);
    setPassphrase("");
    setUnlocked(false);
  };

  async function persist(nextTrades: Trade[]) {
    if (!keyRef.current || !saltRef.current) throw new Error("Unlock the encrypted portfolio before saving.");
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cleartext = encoder.encode(JSON.stringify(nextTrades));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, keyRef.current, cleartext);
    const payload: EncryptedPortfolio = {
      version: 1,
      salt: encodeBase64(saltRef.current),
      iv: encodeBase64(iv),
      ciphertext: encodeBase64(new Uint8Array(encrypted)),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setTrades(nextTrades);
    setNotice("Encrypted portfolio saved in this browser.");
  }

  async function unlockOrCreate() {
    setBusy(true); setError(""); setNotice("");
    try {
      if (!window.isSecureContext || !crypto?.subtle) throw new Error("Encrypted storage requires a secure browser context (HTTPS).");
      if (passphrase.length < 12) throw new Error("Use a passphrase with at least 12 characters.");
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        keyRef.current = await deriveKey(passphrase, salt);
        saltRef.current = salt;
        await persist([]);
        setHasSaved(true); setUnlocked(true); setPassphrase(""); setNotice("Encrypted portfolio created. Keep your passphrase safe; PDFora cannot recover it.");
        return;
      }
      const payload = JSON.parse(saved) as EncryptedPortfolio;
      if (payload.version !== 1 || !payload.salt || !payload.iv || !payload.ciphertext) throw new Error("Saved portfolio data is invalid. Clear it and create a new portfolio.");
      const salt = decodeBase64(payload.salt);
      const key = await deriveKey(passphrase, salt);
      const cleartext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: decodeBase64(payload.iv) }, key, decodeBase64(payload.ciphertext));
      const parsed: unknown = JSON.parse(new TextDecoder().decode(cleartext));
      if (!Array.isArray(parsed) || !parsed.every(isTrade)) throw new Error("Portfolio contents are invalid. Saved data was not loaded.");
      const loaded = parsed as Trade[];
      calculatePortfolio(loaded);
      keyRef.current = key; saltRef.current = salt; setTrades(loaded); setUnlocked(true); setPassphrase(""); setNotice("Encrypted portfolio unlocked in this browser.");
    } catch (cause) {
      keyRef.current = null; saltRef.current = null;
      setError(cause instanceof Error && cause.name === "OperationError" ? "Could not unlock this portfolio. Check the passphrase." : cause instanceof Error ? cause.message : "Could not open the encrypted portfolio.");
    } finally { setBusy(false); }
  }

  async function addTrade(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    const next: Trade = { id: crypto.randomUUID(), createdAt: Date.now(), date, symbol: symbol.trim().toUpperCase(), side, quantity: Number(quantity), price: Number(price), fee: Number(fee) };
    if (!isTrade(next)) { setError("Enter a listed symbol, valid date, positive quantity and price, and a non-negative fee."); return; }
    const nextTrades = [...trades, next];
    try { calculatePortfolio(nextTrades); } catch (cause) { setError(cause instanceof Error ? cause.message : "That sale would exceed recorded holdings."); return; }
    setBusy(true);
    try { await persist(nextTrades); setQuantity(""); setPrice(""); setFee("0"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not encrypt portfolio data."); }
    finally { setBusy(false); }
  }

  async function removeTrade(id: string) {
    setBusy(true); setError(""); setNotice("");
    const nextTrades = trades.filter((trade) => trade.id !== id);
    try { calculatePortfolio(nextTrades); await persist(nextTrades); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update the portfolio."); }
    finally { setBusy(false); }
  }

  function clearSavedPortfolio() {
    if (!window.confirm("Permanently delete this encrypted portfolio from this browser? This cannot be undone.")) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY); keyRef.current = null; saltRef.current = null;
      setTrades([]); setPassphrase(""); setUnlocked(false); setHasSaved(false); setNotice("Encrypted portfolio deleted from this browser."); setError("");
    } catch {
      setError("The browser did not allow saved portfolio data to be deleted. Clear this site’s browser storage manually.");
    }
  }

  const realized = portfolio.realized;
  const marketValue = holdings.reduce((sum, holding) => sum + holding.quantity * (quotesBySymbol.get(holding.symbol)?.ltp ?? 0), 0);
  const invested = holdings.reduce((sum, holding) => sum + holding.invested, 0);
  const allQuotesKnown = holdings.length === 0 || holdings.every((holding) => Number.isFinite(quotesBySymbol.get(holding.symbol)?.ltp));

  return <section className={panel} aria-labelledby="portfolio-heading">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wide text-teal-700">Private, encrypted on this device</p><h2 id="portfolio-heading" className="mt-1 text-xl font-black">NEPSE portfolio tracker</h2><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">Transactions are encrypted with your passphrase using AES-GCM before they are saved to this browser. No portfolio data is sent to PDFora. This does not sync across devices; clearing browser storage or losing the passphrase permanently loses the portfolio. P/L uses weighted-average cost and includes the fees you enter; taxes and dividends are not included.</p></div>{unlocked && <button type="button" disabled={busy} onClick={locked} className="rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-50">Lock</button>}</div>

    {!unlocked ? <div className="mt-4 max-w-xl space-y-3"><label className="block"><span className={label}>{hasSaved ? "Portfolio passphrase" : "Create a portfolio passphrase"}</span><input className={field} type="password" autoComplete={hasSaved ? "current-password" : "new-password"} minLength={12} value={passphrase} onChange={(event) => setPassphrase(event.target.value)} /></label><button type="button" onClick={() => void unlockOrCreate()} disabled={busy || hasSaved === null} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Unlocking…" : hasSaved ? "Unlock encrypted portfolio" : "Create encrypted portfolio"}</button>{hasSaved && <button type="button" disabled={busy} onClick={clearSavedPortfolio} className="ml-2 rounded-xl border px-4 py-2.5 text-sm font-bold text-rose-700 disabled:opacity-50">Delete saved data</button>}</div> : <>
      <form onSubmit={(event) => void addTrade(event)} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
        <label><span className={label}>Date</span><input className={field} type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label><span className={label}>Symbol</span><input className={field} required maxLength={16} value={symbol} onChange={(event) => setSymbol(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} placeholder="NABIL" /></label>
        <label><span className={label}>Side</span><select className={field} value={side} onChange={(event) => setSide(event.target.value as Trade["side"])}><option value="buy">Buy</option><option value="sell">Sell</option></select></label>
        <label><span className={label}>Quantity</span><input className={field} type="number" min="0.0001" step="any" required value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
        <label><span className={label}>Price (NPR)</span><input className={field} type="number" min="0.01" step="any" required value={price} onChange={(event) => setPrice(event.target.value)} /></label>
        <label><span className={label}>Fees (NPR)</span><input className={field} type="number" min="0" step="any" required value={fee} onChange={(event) => setFee(event.target.value)} /></label>
        <button type="submit" disabled={busy || !date} className="self-end rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving…" : "Add transaction"}</button>
      </form>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Open holdings cost</p><p className="mt-1 font-black">Rs. {invested.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Current value {stale ? "(stale quote)" : "(source snapshot)"}</p><p className="mt-1 font-black">{!stale && allQuotesKnown ? "Rs. " + marketValue.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "Unavailable"}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Unrealized P/L</p><p className="mt-1 font-black">{!stale && allQuotesKnown ? "Rs. " + (marketValue - invested).toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "Unavailable"}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Realized P/L</p><p className="mt-1 font-black">Rs. {realized.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p></div></div>
      {stale && <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">The market feed is stale. Current value and unrealized P/L are hidden until fresh prices are available.</p>}
      <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="p-3">Symbol</th><th className="p-3 text-right">Quantity</th><th className="p-3 text-right">Average cost</th><th className="p-3 text-right">Market price</th><th className="p-3 text-right">Unrealized P/L</th></tr></thead><tbody>{holdings.map((holding) => { const quote = quotesBySymbol.get(holding.symbol); const value = quote && !stale ? (quote.ltp - holding.averageCost) * holding.quantity : null; return <tr key={holding.symbol} className="border-t border-slate-100"><th className="p-3 font-bold">{holding.symbol}<span className="ml-2 font-normal text-slate-500">{quote?.name ?? ""}</span></th><td className="p-3 text-right">{holding.quantity.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</td><td className="p-3 text-right">Rs. {holding.averageCost.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td><td className="p-3 text-right">{quote && !stale ? "Rs. " + quote.ltp.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "—"}</td><td className="p-3 text-right">{value === null ? "—" : "Rs. " + value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td></tr>; })}</tbody></table></div>
      <details className="mt-4"><summary className="cursor-pointer text-sm font-bold text-slate-700">Transaction history ({trades.length})</summary><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-xs"><thead className="bg-slate-100 uppercase text-slate-500"><tr><th className="p-2">Date</th><th className="p-2">Symbol</th><th className="p-2">Side</th><th className="p-2 text-right">Quantity</th><th className="p-2 text-right">Price</th><th className="p-2 text-right">Fees</th><th className="p-2"/></tr></thead><tbody>{[...trades].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt).map((trade) => <tr key={trade.id} className="border-t"><td className="p-2">{trade.date}</td><td className="p-2 font-bold">{trade.symbol}</td><td className="p-2">{trade.side}</td><td className="p-2 text-right">{trade.quantity}</td><td className="p-2 text-right">Rs. {trade.price}</td><td className="p-2 text-right">Rs. {trade.fee}</td><td className="p-2 text-right"><button type="button" disabled={busy} onClick={() => void removeTrade(trade.id)} className="font-bold text-rose-700 underline">Delete</button></td></tr>)}</tbody></table></div></details>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p aria-live="polite" className="text-xs text-slate-500">{notice}</p><button type="button" disabled={busy} onClick={clearSavedPortfolio} className="rounded-lg border px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">Delete encrypted portfolio</button></div>
    </>}
    {error && <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
  </section>;
}

