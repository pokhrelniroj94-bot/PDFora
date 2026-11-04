"use client";

import { useEffect, useMemo, useState } from "react";
import NepalMarketNews from "./NepalMarketNews";
import { calculateNepalDomesticElectricityBill, calculateNepalSalaryTax } from "../lib/calculations";

type ForexRate = { code: string; name: string; unit: number; buy: number; sell: number };
type ForexResponse = { source: string; requestedDate: string; rateDate: string; publishedOn: string | null; updatedAt?: string; isStale?: boolean; notice?: string; rates: ForexRate[]; error?: string };
const field = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900";
const fallbackCurrencies: Array<{ code: string; name: string }> = [
  { code: "USD", name: "US Dollar" }, { code: "EUR", name: "Euro" }, { code: "GBP", name: "Pound Sterling" }, { code: "INR", name: "Indian Rupee" },
  { code: "AUD", name: "Australian Dollar" }, { code: "CAD", name: "Canadian Dollar" }, { code: "CHF", name: "Swiss Franc" }, { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" }, { code: "SGD", name: "Singapore Dollar" }, { code: "SAR", name: "Saudi Riyal" }, { code: "QAR", name: "Qatari Riyal" },
  { code: "AED", name: "UAE Dirham" }, { code: "MYR", name: "Malaysian Ringgit" }, { code: "KRW", name: "South Korean Won" }, { code: "THB", name: "Thai Baht" },
  { code: "KWD", name: "Kuwaiti Dinar" }, { code: "BHD", name: "Bahraini Dinar" }, { code: "OMR", name: "Omani Rial" }, { code: "HKD", name: "Hong Kong Dollar" },
  { code: "SEK", name: "Swedish Krona" }, { code: "DKK", name: "Danish Krone" },
];
const label = "mb-1.5 block text-sm font-semibold text-slate-700";
const npr = (value: number) => "NPR " + value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
function Field({ title, value, onChange, type = "number", min = "0" }: { title: string; value: string; onChange: (value: string) => void; type?: string; min?: string }) {
  return <label className="block"><span className={label}>{title}</span><input className={field} type={type} min={min} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
function Result({ children }: { children: React.ReactNode }) {
  return <div aria-live="polite" className="whitespace-pre-wrap rounded-xl bg-teal-50 p-4 text-sm leading-7 text-teal-950">{children}</div>;
}
const holidays = [
  { name: "Nepali New Year", bs: "2083 Baisakh 01", ad: "2026-04-14", note: "National public holiday", type: "National" },
  { name: "Labour Day · Buddha Jayanti · Ubhauli · Chandi Purnima", bs: "2083 Baisakh 18", ad: "2026-05-01", note: "National public holiday", type: "National" },
  { name: "Republic Day", bs: "2083 Jestha 15", ad: "2026-05-29", note: "National public holiday", type: "National" },
  { name: "Rakshya Bandhan", bs: "2083 Bhadra 12", ad: "2026-08-28", note: "National public holiday", type: "National" },
  { name: "Gai Jatra", bs: "2083 Bhadra 13", ad: "2026-08-29", note: "Kathmandu Valley and Newar community", type: "Regional" },
  { name: "Krishna Janmashtami · Gaura Parwa", bs: "2083 Bhadra 19", ad: "2026-09-04", note: "National public holiday", type: "National" },
  { name: "Haritalika Teej", bs: "2083 Bhadra 29", ad: "2026-09-14", note: "Women only", type: "Community" },
  { name: "Constitution Day", bs: "2083 Asoj 03", ad: "2026-09-19", note: "National public holiday", type: "National" },
  { name: "Indra Jatra", bs: "2083 Asoj 09", ad: "2026-09-25", note: "Kathmandu Valley only", type: "Regional" },
  { name: "Jitiya Parwa", bs: "2083 Asoj 18", ad: "2026-10-04", note: "Women celebrating Jitiya Parwa", type: "Community" },
  { name: "Ghatasthapana", bs: "2083 Asoj 25", ad: "2026-10-11", note: "National public holiday", type: "National" },
  { name: "Dashain holiday begins", bs: "2083 Asoj 31", ad: "2026-10-17", note: "Seven-day Dashain holiday: 17–23 October", type: "National" },
  { name: "Tihar holiday begins", bs: "2083 Kartik 22", ad: "2026-11-08", note: "Five-day Tihar holiday: 8–12 November", type: "National" },
  { name: "Falgunand Jayanti", bs: "2083 Kartik 25", ad: "2026-11-11", note: "Kirant community", type: "Community" },
  { name: "Chhath Parwa", bs: "2083 Kartik 29", ad: "2026-11-15", note: "National public holiday", type: "National" },
  { name: "International Day of Persons with Disabilities", bs: "2083 Mangsir 17", ad: "2026-12-03", note: "Persons with disabilities", type: "Community" },
  { name: "Dhanya Purnima · Udhauli · Yomari Punhi", bs: "2083 Poush 09", ad: "2026-12-24", note: "National public holiday", type: "National" },
  { name: "Christmas Day", bs: "2083 Poush 10", ad: "2026-12-25", note: "National public holiday", type: "National" },
  { name: "Tamu Lhosar · Dura Mhaipru Nakuma", bs: "2083 Poush 15", ad: "2026-12-30", note: "National public holiday", type: "National" },
  { name: "Prithvi Jayanti · National Unity Day", bs: "2083 Poush 27", ad: "2027-01-11", note: "National public holiday", type: "National" },
  { name: "Maghi · Maghe Sankranti", bs: "2083 Magh 01", ad: "2027-01-15", note: "National public holiday", type: "National" },
  { name: "Martyrs’ Day", bs: "2083 Magh 16", ad: "2027-01-30", note: "National public holiday", type: "National" },
  { name: "Sonam Lhosar", bs: "2083 Magh 24", ad: "2027-02-07", note: "National public holiday", type: "National" },
  { name: "Basanta Panchami", bs: "2083 Magh 28", ad: "2027-02-11", note: "Educational institutions only", type: "Community" },
  { name: "National Democracy Day", bs: "2083 Falgun 07", ad: "2027-02-19", note: "National public holiday", type: "National" },
  { name: "Maha Shivaratri", bs: "2083 Falgun 22", ad: "2027-03-06", note: "National public holiday", type: "National" },
  { name: "International Women’s Day", bs: "2083 Falgun 24", ad: "2027-03-08", note: "Women employees only", type: "Community" },
  { name: "Gyalpo Lhosar", bs: "2083 Falgun 25", ad: "2027-03-09", note: "National public holiday", type: "National" },
  { name: "Fagu Purnima · Holi (Hills)", bs: "2083 Chaitra 07", ad: "2027-03-21", note: "56 Himalayan and Hill districts", type: "Regional" },
  { name: "Terai Holi", bs: "2083 Chaitra 08", ad: "2027-03-22", note: "21 Terai districts", type: "Regional" },
  { name: "Ghode Jatra", bs: "2083 Chaitra 23", ad: "2027-04-06", note: "Kathmandu Valley only", type: "Regional" },
  { name: "Eid al-Fitr", bs: "Date to be announced", ad: "", note: "Date depends on moon sighting", type: "To be announced" },
  { name: "Eid al-Adha", bs: "Date to be announced", ad: "", note: "Date depends on moon sighting", type: "To be announced" },
  { name: "Saruwa Pawani", bs: "Date to be announced", ad: "", note: "Jhapa, Morang, Sunsari, Siraha and Saptari", type: "To be announced" },
  { name: "Bhoto Jatra", bs: "Date to be announced", ad: "", note: "Kathmandu Valley only", type: "To be announced" },
  { name: "Muhammad Jayanti", bs: "Date to be announced", ad: "", note: "Muslim community", type: "To be announced" },
  { name: "Guru Nanak Jayanti", bs: "Date to be announced", ad: "", note: "Sikh community", type: "To be announced" },
];

async function fetchLatestForex(): Promise<ForexResponse> {
  const response = await fetch("/api/nepal-forex", { cache: "no-store" });
  const json = await response.json() as ForexResponse;
  if (!response.ok) throw new Error(json.error || "Could not load NRB rates.");
  return json;
}

function ForexTool() {
  const [data, setData] = useState<ForexResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("100");
  const [direction, setDirection] = useState("foreign-to-npr");

  const loadRates = async () => {
    setLoading(true);
    setError("");
    try {
      const next = await fetchLatestForex();
      if (!Array.isArray(next.rates) || next.rates.length === 0) throw new Error("The rate provider returned an empty currency list.");
      setData(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load NRB rates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadRates(); }, []);

  const selected = data?.rates.find((item) => item.code === currency);
  const value = Number(amount);
  const valid = amount.trim() !== "" && Number.isFinite(value) && value >= 0 && !!selected;
  const converted = selected && valid
    ? direction === "foreign-to-npr" ? value * selected.buy / selected.unit : value * selected.unit / selected.sell
    : null;

  return <div className="space-y-5 pdfora-enter">
    <header className="rounded-2xl border border-teal-100 bg-gradient-to-br from-white via-teal-50/70 to-cyan-50 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-teal-700">Nepal · Official reference rates</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">Nepal Rastra Bank Exchange Rates</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Daily buying and selling rates published by NRB. On weekends and public holidays, the latest available working-day rate may be shown.</p>
        </div>
        <button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm hover:border-teal-400 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading} onClick={() => void loadRates()}>
          {loading && <span className="pdfora-spinner" aria-hidden="true" />}
          {loading ? "Updating…" : "Refresh rates"}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
        <span><strong className="text-slate-800">Rate date:</strong> {data?.rateDate || "Waiting for rates"}</span>
        {data?.source && <span><strong className="text-slate-800">Source:</strong> {data.source}</span>}
        {data?.updatedAt && <span><strong className="text-slate-800">Fetched:</strong> {new Date(data.updatedAt).toLocaleString("en-NP", { timeZone: "Asia/Kathmandu" })}</span>}
      </div>
    </header>

    {data?.isStale && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">{data.notice || "Showing the latest cached official rates. The live source is temporarily unavailable."}</p>}
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-900"><strong>Rates could not be refreshed.</strong><p className="mt-1">{error}</p><button type="button" className="mt-2 font-semibold underline underline-offset-2" onClick={() => void loadRates()}>Try again</button></div>}

    {loading && !data && <div className="grid gap-2" aria-label="Loading exchange rates"><div className="pdfora-skeleton h-11 rounded-xl" /><div className="pdfora-skeleton h-11 rounded-xl" /><div className="pdfora-skeleton h-11 rounded-xl" /></div>}
    {data && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><h3 className="font-bold text-slate-900">Published currency rates</h3><span className="text-xs text-slate-500">{data.rates.length} currencies</span></div>
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[540px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-4 py-3">Currency</th><th scope="col" className="px-4 py-3 text-right">Unit</th><th scope="col" className="px-4 py-3 text-right">Buying · NPR</th><th scope="col" className="px-4 py-3 text-right">Selling · NPR</th></tr></thead>
          <tbody>{data.rates.map((item) => <tr key={item.code} className="border-t border-slate-100 transition-colors hover:bg-teal-50/50"><th scope="row" className="px-4 py-3 font-semibold text-slate-900"><span>{item.code}</span><span className="ml-2 font-normal text-slate-500">{item.name}</span></th><td className="px-4 py-3 text-right tabular-nums">{item.unit}</td><td className="px-4 py-3 text-right font-medium tabular-nums">{item.buy.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</td><td className="px-4 py-3 text-right font-medium tabular-nums">{item.sell.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</td></tr>)}</tbody>
        </table>
      </div>
    </section>}

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div><p className="text-xs font-bold uppercase tracking-[.12em] text-teal-700">Quick conversion</p><h3 className="mt-1 text-lg font-bold text-slate-950">NRB currency converter</h3><p className="mt-1 text-sm text-slate-600">Uses the published unit, buying and selling rate for the selected currency.</p></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label><span className={label}>Currency</span><select className={field} value={currency} onChange={(e) => setCurrency(e.target.value)}>{Array.from(new Map([...fallbackCurrencies, ...(data?.rates ?? []).map(({ code, name }) => ({ code, name }))].map(item => [item.code, item])).values()).map((item) => <option key={item.code} value={item.code}>{item.code} — {item.name}</option>)}</select></label>
        <label><span className={label}>Conversion direction</span><select className={field} value={direction} onChange={(e) => setDirection(e.target.value)}><option value="foreign-to-npr">Foreign currency → NPR (buying)</option><option value="npr-to-foreign">NPR → foreign currency (selling)</option></select></label>
      </div>
      <div className="mt-3 max-w-sm"><Field title="Amount" value={amount} onChange={setAmount}/></div>
      {converted !== null && selected ? <div className="pdfora-pop-in mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4" aria-live="polite"><p className="text-xs font-semibold uppercase tracking-wide text-teal-800">Estimated conversion</p><p className="mt-1 break-words text-2xl font-bold tracking-tight text-teal-950">{direction === "foreign-to-npr" ? npr(converted) : converted.toLocaleString("en-IN", { maximumFractionDigits: 4 }) + " " + selected.code}</p><p className="mt-2 text-sm text-teal-900">{direction === "foreign-to-npr" ? value.toLocaleString() + " " + selected.code : npr(value)} · {direction === "foreign-to-npr" ? selected.buy : selected.sell} NPR per {selected.unit} {selected.code}</p><p className="mt-1 text-xs text-teal-800">Rate date: {data?.rateDate}</p></div> : <p role="status" className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{error ? "The converter will calculate once official rates are available." : `No published rate is available for ${currency} yet.`}</p>}
    </section>

    <p className="text-xs leading-5 text-slate-500">NRB reference rates are not necessarily the exact rates offered by individual banks, money changers or remittance providers. Always confirm the transaction rate with your provider before making a payment.</p>
    <a className="inline-flex text-sm font-semibold text-teal-700 underline" href="https://www.nrb.org.np/forex" target="_blank" rel="noreferrer">View NRB official exchange-rate page ↗</a>
  </div>;
}

function SalaryTaxTool() {
  const [income, setIncome] = useState("1200000");
  const [firstBandExempt, setFirstBandExempt] = useState(false);
  const amount = Number(income);
  const valid = income.trim() !== "" && Number.isFinite(amount) && amount >= 0 && amount <= 1_000_000_000;
  const calculation = valid ? calculateNepalSalaryTax(amount, firstBandExempt) : null;
  return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">Nepal Salary / Income Tax Calculator · FY 2083/84</h2><p className="mt-1 text-sm text-slate-600">Progressive estimate for a resident natural person using the Inland Revenue Department&apos;s published 2083/84 bands.</p></div>
    <Field title="Annual taxable salary / income (NPR, after eligible deductions)" value={income} onChange={setIncome}/>
    <label className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" checked={firstBandExempt} onChange={(e) => setFirstBandExempt(e.target.checked)}/><span>I qualify for the first-band 1% Social Security Tax exemption (for example, as an SSF contributor, pension-income recipient or sole proprietor). Select only if this statutory exception applies.</span></label>
    {calculation ? <><Result>Estimated annual tax: {npr(calculation.tax)}
Estimated monthly tax: {npr(calculation.tax / 12)}
Monthly taxable income after estimated tax: {npr((amount - calculation.tax) / 12)}
Effective tax rate: {calculation.effectiveRate.toFixed(2)}%</Result><div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-3 text-left">Taxable band portion</th><th className="p-3 text-right">Rate</th><th className="p-3 text-right">Tax</th></tr></thead><tbody>{calculation.breakdown.map((item, i) => <tr key={i} className="border-t"><td className="p-3">{npr(item.taxable)}</td><td className="p-3 text-right">{(item.rate * 100).toFixed(0)}%</td><td className="p-3 text-right">{npr(item.tax)}</td></tr>)}</tbody></table></div></> : <p role="alert" className="text-sm text-red-700">Enter a valid non-negative annual taxable income.</p>}
    <p className="text-xs leading-5 text-slate-500">Estimate only for resident natural persons. Taxable income must already reflect eligible deductions; this calculator does not calculate PF, CIT, SSF contributions, insurance deductions, rebates, non-resident tax or every special income category. The 1% first-band exception is not a general tax-free allowance. Verify your circumstances against the current IRD notice or a tax professional.</p>
    <div className="flex flex-wrap gap-4 text-sm"><a className="font-semibold text-teal-700 underline" href="https://ird.gov.np/category/taxrateincentives/" target="_blank" rel="noreferrer">IRD official tax rates and incentives</a><a className="font-semibold text-teal-700 underline" href="https://ird.gov.np/" target="_blank" rel="noreferrer">Inland Revenue Department</a></div>
  </div>;
}

function ElectricityTool() {
  const [units, setUnits] = useState("100");
  const [meter, setMeter] = useState<"5A" | "15A" | "30A" | "60A">("5A");
  const [rebate, setRebate] = useState(true);
  const u = Number(units);
  const valid = units.trim() !== "" && Number.isFinite(u) && u >= 0 && u <= 100000;
  const calculation = valid ? calculateNepalDomesticElectricityBill(u, meter, rebate) : null;
  return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">NEA Domestic Electricity Bill Estimator · FY 2083/84</h2><p className="mt-1 text-sm text-slate-600">Estimate a single-phase domestic bill from monthly units and meter capacity using the published block tariff assumptions.</p></div>
    <div className="grid gap-3 sm:grid-cols-2"><Field title="Monthly consumption (units / kWh)" value={units} onChange={setUnits}/><label><span className={label}>Meter capacity</span><select className={field} value={meter} onChange={(e) => setMeter(e.target.value as typeof meter)}>{["5A","15A","30A","60A"].map((m) => <option key={m}>{m}</option>)}</select></label></div>
    <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={rebate} onChange={(e) => setRebate(e.target.checked)}/> Assume 2% early-payment rebate (within 7 days)</label>
    {calculation ? <><Result>Energy charge: {npr(calculation.energy)}
Monthly minimum charge: {npr(calculation.minimum)}
Early-payment rebate: −{npr(calculation.rebate)}
VAT estimate (5% on energy above 50 units): {npr(calculation.vat)}
Estimated bill: {npr(calculation.total)}</Result><p className="text-xs text-slate-500">Energy is calculated progressively by consumption block. Minimum charge depends on the total-use band and meter capacity.</p></> : <p role="alert" className="text-sm text-red-700">Enter monthly units from 0 to 100,000.</p>}
    <p className="text-xs leading-5 text-slate-500">FY 2083/84 domestic single-phase estimate only. Excludes arrears, meter rent or other account-specific adjustments. VAT and rebate assumptions may change; your NEA bill is final. For commercial, three-phase or official bill calculations, use the ERC calculator.</p>
    <div className="flex flex-wrap gap-4 text-sm"><a className="font-semibold text-teal-700 underline" href="https://www.erc.gov.np/electricity-calculator" target="_blank" rel="noreferrer">Official ERC electricity calculator</a><a className="font-semibold text-teal-700 underline" href="https://www.nea.org.np/en/pages/consumer-tariff-rates" target="_blank" rel="noreferrer">NEA consumer tariff rates</a></div>
  </div>;
}

function HolidayTool() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const shown = useMemo(() => holidays.filter((item) => {
    const matchesQuery = `${item.name} ${item.bs} ${item.ad} ${item.note}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === "All" || item.type === filter);
  }), [query, filter]);
  return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">Nepal Public Holidays 2083 BS (2026/27)</h2><p className="mt-1 text-sm text-slate-600">Search government and public holidays, including national, regional and community-specific observances.</p></div>
    <Field title="Search holidays" value={query} onChange={setQuery} type="text"/>
    <div className="flex flex-wrap gap-2">{["All","National","Regional","Community","To be announced"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1.5 text-sm ${filter === item ? "border-teal-700 bg-teal-50 text-teal-900" : "border-slate-300"}`}>{item}</button>)}</div>
    <div className="flex flex-wrap gap-3 text-xs"><span className="rounded-lg bg-rose-100 px-3 py-2 font-semibold text-rose-800">Red: National public holiday</span><span className="rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-700">Light red: Saturday</span><span className="rounded-lg bg-amber-50 px-3 py-2 font-semibold text-amber-800">Amber: Date to be announced</span></div><p className="text-xs text-slate-500">Showing {shown.length} of {holidays.length} entries. National holidays are red; Saturdays are lightly shaded. Regional and community observances retain their notes.</p>
    <div className="overflow-x-auto rounded-xl border"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-slate-100"><tr><th className="p-3">Holiday</th><th className="p-3">BS date</th><th className="p-3">AD date</th><th className="p-3">Applies to / note</th></tr></thead><tbody>{shown.map((item) => <tr key={item.name} className={`border-t align-top ${item.ad && new Date(`${item.ad}T00:00:00Z`).getUTCDay() === 6 ? "bg-rose-50" : item.ad ? "bg-white" : "bg-amber-50/50"}`}><td className={`p-3 font-semibold ${item.ad && holidays.some((holiday) => holiday.ad === item.ad && holiday.type === "National") ? "text-rose-700" : "text-slate-900"}`}>{item.name}{item.type === "National" && <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">Public holiday</span>}</td><td className="p-3 whitespace-nowrap">{item.bs}</td><td className={`p-3 whitespace-nowrap font-semibold ${item.type === "National" ? "text-rose-700" : ""}`}>{item.ad || "TBA"}</td><td className="p-3 text-slate-600">{item.note}</td></tr>)}</tbody></table></div>
    <p className="text-xs leading-5 text-slate-500">This is a searchable transcription of the 2083 government holiday list, not a guarantee that every private employer, school, bank or province follows the same closure schedule. Dates for lunar observances marked TBA require later official confirmation.</p>
    <a className="text-sm font-semibold text-teal-700 underline" href="https://moha.gov.np/en/page/government-and-public-holidays-in-2083" target="_blank" rel="noreferrer">Verify with Ministry of Home Affairs official 2083 holiday notice</a>
  </div>;
}

function NepseDividendTool() {
  const [shares, setShares] = useState("100");
  const [cashRate, setCashRate] = useState("10");
  const [bonusRate, setBonusRate] = useState("5");
  const [faceValue, setFaceValue] = useState("100");
  const [taxRate, setTaxRate] = useState("5");
  const quantity = Number(shares), cash = Number(cashRate), bonus = Number(bonusRate), face = Number(faceValue), tax = Number(taxRate);
  const valid = [quantity, cash, bonus, face, tax].every(Number.isFinite) && quantity > 0 && Number.isInteger(quantity) && cash >= 0 && bonus >= 0 && face > 0 && tax >= 0 && tax <= 100;
  const cashGross = quantity * face * cash / 100;
  const cashTax = cashGross * tax / 100;
  const bonusShares = quantity * bonus / 100;
  return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">NEPSE Cash Dividend & Bonus Share Calculator</h2><p className="mt-1 text-sm text-slate-600">Estimate cash dividend on the editable face value, after an editable withholding-tax assumption, and calculate bonus shares.</p></div>
    <div className="grid gap-3 sm:grid-cols-2"><Field title="Shares held" value={shares} onChange={setShares}/><Field title="Cash dividend (%)" value={cashRate} onChange={setCashRate}/><Field title="Bonus shares (%)" value={bonusRate} onChange={setBonusRate}/><Field title="Face value per share (NPR)" value={faceValue} onChange={setFaceValue}/><Field title="Cash dividend tax assumption (%)" value={taxRate} onChange={setTaxRate}/></div>
    {valid ? <Result>Eligible shares: {quantity.toLocaleString("en-IN")}\nGross cash dividend (face value basis): {npr(cashGross)}\nEstimated withholding tax: {npr(cashTax)}\nEstimated cash dividend after tax: {npr(cashGross - cashTax)}\nEstimated bonus shares: {bonusShares.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</Result> : <p role="alert" className="text-sm text-red-700">Enter a positive whole share quantity and valid non-negative percentages.</p>}
    <p className="text-xs leading-5 text-slate-500">This is a percentage-based estimate, not an allotment confirmation. Fractional bonus entitlements, book closure eligibility, withholding rules and company-specific terms may change the final credited amount. Verify the declared corporate action and tax treatment with the company, CDSC and IRD.</p>
    <div className="flex flex-wrap gap-4 text-sm"><a className="font-semibold text-teal-700 underline" href="https://www.nepalstock.com/" target="_blank" rel="noreferrer">NEPSE official</a><a className="font-semibold text-teal-700 underline" href="https://meroshare.cdsc.com.np/" target="_blank" rel="noreferrer">Mero Share</a></div>
  </div>;
}

export default function NepalLiveTools({ slug }: { slug: string }) {
  if (slug === "nepal-forex-rates") return <ForexTool/>;
  if (slug === "nepal-salary-tax-calculator") return <SalaryTaxTool/>;
  if (slug === "nepal-electricity-bill-calculator") return <ElectricityTool/>;
  if (slug === "nepal-public-holidays-2083") return <HolidayTool/>;
  if (slug === "nepse-dividend-calculator") return <NepseDividendTool/>;
  if (slug === "nepse-market-news") return <NepalMarketNews/>;
  return <p className="text-sm text-slate-600">Nepal tool not found.</p>;
}
