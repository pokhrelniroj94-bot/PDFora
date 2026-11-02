"use client";

import { useMemo, useState } from "react";

type Item = { id: number; description: string; quantity: string; rate: string };
const input = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100";
const label = "mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500";

export default function InvoiceMakerTool() {
  const [business, setBusiness] = useState("Your Business");
  const [businessInfo, setBusinessInfo] = useState("");
  const [client, setClient] = useState("");
  const [clientInfo, setClientInfo] = useState("");
  const [number, setNumber] = useState("INV-001");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [due, setDue] = useState("");
  const [currency, setCurrency] = useState("NPR");
  const [tax, setTax] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [notes, setNotes] = useState("Thank you for your business.");
  const [items, setItems] = useState<Item[]>([{ id: 1, description: "Service or product", quantity: "1", rate: "1000" }]);
  const [nextId, setNextId] = useState(2);
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0) * Math.max(0, Number(item.rate) || 0), 0);
    const discountAmount = Math.min(subtotal, subtotal * Math.max(0, Math.min(100, Number(discount) || 0)) / 100);
    const taxable = subtotal - discountAmount;
    const taxAmount = taxable * Math.max(0, Math.min(100, Number(tax) || 0)) / 100;
    return { subtotal, discountAmount, taxAmount, total: taxable + taxAmount };
  }, [items, tax, discount]);
  const money = (value: number) => new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  const update = (id: number, key: keyof Omit<Item, "id">, value: string) => setItems(old => old.map(item => item.id === id ? { ...item, [key]: value } : item));
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
      <div><h2 className="text-xl font-black text-slate-950">Invoice & Quotation Maker</h2><p className="mt-1 text-sm text-slate-600">Create a clean invoice and save it as PDF using your browser's print dialog.</p></div>
      <button type="button" onClick={() => window.print()} className="min-h-11 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800">Print / Save PDF</button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 print:hidden">
      <label><span className={label}>Your business / name</span><input className={input} value={business} onChange={e => setBusiness(e.target.value)} /></label>
      <label><span className={label}>Invoice number</span><input className={input} value={number} onChange={e => setNumber(e.target.value)} /></label>
      <label><span className={label}>Business address, email, phone</span><textarea className={input} rows={3} value={businessInfo} onChange={e => setBusinessInfo(e.target.value)} /></label>
      <label><span className={label}>Bill to / client name</span><input className={input} value={client} onChange={e => setClient(e.target.value)} /></label>
      <label><span className={label}>Client address / contact</span><textarea className={input} rows={3} value={clientInfo} onChange={e => setClientInfo(e.target.value)} /></label>
      <div className="grid grid-cols-2 gap-3">
        <label><span className={label}>Invoice date</span><input className={input} type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
        <label><span className={label}>Due date</span><input className={input} type="date" value={due} onChange={e => setDue(e.target.value)} /></label>
        <label><span className={label}>Currency</span><select className={input} value={currency} onChange={e => setCurrency(e.target.value)}><option value="NPR">NPR – Nepalese Rupee</option><option value="USD">USD – US Dollar</option><option value="INR">INR – Indian Rupee</option><option value="EUR">EUR – Euro</option><option value="GBP">GBP – Pound</option></select></label>
        <label><span className={label}>Tax (%)</span><input className={input} type="number" min="0" max="100" value={tax} onChange={e => setTax(e.target.value)} /></label>
        <label><span className={label}>Discount (%)</span><input className={input} type="number" min="0" max="100" value={discount} onChange={e => setDiscount(e.target.value)} /></label>
      </div>
    </div>
    <section className="rounded-2xl border border-slate-200 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2 print:hidden"><h3 className="font-bold text-slate-900">Items / Services</h3><button type="button" onClick={() => { setItems(old => [...old, { id: nextId, description: "", quantity: "1", rate: "0" }]); setNextId(id => id + 1); }} className="rounded-lg border border-teal-200 px-3 py-2 text-sm font-bold text-teal-800">+ Add item</button></div>
      <div className="space-y-3">
        {items.map((item, index) => <div key={item.id} className="grid grid-cols-12 gap-2 border-b border-slate-100 pb-3 last:border-0">
          <label className="col-span-12 sm:col-span-6"><span className={label+" print:hidden"}>Description</span><input aria-label={"Item "+(index + 1)+" description"} className={input+" print:border-0 print:px-0"} value={item.description} onChange={e => update(item.id, "description", e.target.value)} placeholder="Description" /></label>
          <label className="col-span-4 sm:col-span-2"><span className={label+" print:hidden"}>Qty</span><input aria-label="Quantity" className={input+" print:border-0 print:px-0"} type="number" min="0" value={item.quantity} onChange={e => update(item.id, "quantity", e.target.value)} /></label>
          <label className="col-span-4 sm:col-span-2"><span className={label+" print:hidden"}>Rate</span><input aria-label="Unit rate" className={input+" print:border-0 print:px-0"} type="number" min="0" value={item.rate} onChange={e => update(item.id, "rate", e.target.value)} /></label>
          <div className="col-span-3 flex items-end justify-end text-sm font-bold text-slate-800 sm:col-span-1 sm:justify-center">{money(Math.max(0, Number(item.quantity) || 0) * Math.max(0, Number(item.rate) || 0))}</div>
          <div className="col-span-1 flex items-end justify-end print:hidden"><button type="button" aria-label="Remove item" disabled={items.length === 1} onClick={() => setItems(old => old.filter(row => row.id !== item.id))} className="rounded-lg px-2 py-2 text-red-600 disabled:opacity-30">×</button></div>
        </div>)}
      </div>
      <div className="ml-auto mt-5 max-w-sm space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><b>{money(totals.subtotal)}</b></div>
        <div className="flex justify-between"><span>Discount ({Math.max(0, Number(discount) || 0)}%)</span><b>− {money(totals.discountAmount)}</b></div>
        <div className="flex justify-between"><span>Tax ({Math.max(0, Number(tax) || 0)}%)</span><b>{money(totals.taxAmount)}</b></div>
        <div className="flex justify-between border-t border-slate-300 pt-3 text-lg"><span className="font-black">Total due</span><b className="text-teal-800">{money(totals.total)}</b></div>
      </div>
    </section>
    <label className="block print:hidden"><span className={label}>Notes / payment terms</span><textarea className={input} rows={3} value={notes} onChange={e => setNotes(e.target.value)} /></label>
    <section className="hidden print:block">
      <div className="mb-8 flex justify-between gap-8"><div><h1 className="text-3xl font-black">{business || "Invoice"}</h1><p className="mt-2 whitespace-pre-line text-sm">{businessInfo}</p></div><div className="text-right"><h2 className="text-3xl font-bold tracking-widest">INVOICE</h2><p className="mt-2">#{number}</p><p>Date: {date}</p>{due && <p>Due: {due}</p>}</div></div>
      <div className="mb-8 grid grid-cols-2 gap-8"><div><p className="mb-1 text-xs font-bold uppercase text-slate-500">Bill to</p><p className="font-bold">{client || "Client"}</p><p className="whitespace-pre-line text-sm">{clientInfo}</p></div></div>
      <table className="w-full border-collapse text-sm"><thead><tr className="border-b-2 border-slate-800 text-left"><th className="py-2">Description</th><th>Qty</th><th>Rate</th><th className="text-right">Amount</th></tr></thead><tbody>{items.map(item => <tr key={item.id} className="border-b border-slate-200"><td className="py-3">{item.description}</td><td>{item.quantity}</td><td>{money(Number(item.rate) || 0)}</td><td className="text-right">{money(Math.max(0, Number(item.quantity) || 0) * Math.max(0, Number(item.rate) || 0))}</td></tr>)}</tbody></table>
      <div className="ml-auto mt-6 max-w-xs space-y-2 text-sm"><p className="flex justify-between"><span>Subtotal</span><b>{money(totals.subtotal)}</b></p><p className="flex justify-between"><span>Discount</span><b>− {money(totals.discountAmount)}</b></p><p className="flex justify-between"><span>Tax</span><b>{money(totals.taxAmount)}</b></p><p className="flex justify-between border-t pt-3 text-lg"><b>Total due</b><b>{money(totals.total)}</b></p></div>
      {notes && <p className="mt-10 whitespace-pre-line text-sm">{notes}</p>}
    </section>
    <style jsx global>{`@media print { body * { visibility: hidden !important; } .print\\:block, .print\\:block * { visibility: visible !important; } .print\\:block { display: block !important; position: absolute; inset: 0; width: 100%; padding: 24px; } @page { size: A4; margin: 12mm; } }`}</style>
    <p className="text-xs leading-5 text-slate-500 print:hidden">This tool creates a general invoice template, not a tax-compliant Nepal VAT bill. Confirm legal invoice and PAN/VAT requirements before issuing it.</p>
  </div>;
}
