"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import NepalMarketNews from "./NepalMarketNews";

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
  { name: "Gai Jatra", bs: "2083 Bhadra 13", ad: "2026-08-29", note: "Newar community nationwide", type: "Community" },
  { name: "Krishna Janmashtami", bs: "2083 Bhadra 19", ad: "2026-09-04", note: "National public holiday", type: "National" },
  { name: "Gaura Parwa", bs: "2083 Bhadra 19", ad: "2026-09-04", note: "Far-western community observance", type: "Community" },
  { name: "Haritalika Teej", bs: "2083 Bhadra 29", ad: "2026-09-14", note: "Women employees only", type: "Community" },
  { name: "Constitution Day", bs: "2083 Asoj 03", ad: "2026-09-19", note: "National public holiday", type: "National" },
  { name: "Indra Jatra", bs: "2083 Asoj 09", ad: "2026-09-25", note: "Kathmandu Valley only", type: "Regional" },
  { name: "Jitiya Parwa", bs: "2083 Asoj 15", ad: "2026-10-01", note: "Women celebrating Jitiya Parwa", type: "Community" },
  { name: "Ghatasthapana", bs: "2083 Asoj 25", ad: "2026-10-11", note: "National public holiday", type: "National" },
  { name: "Dashain holiday begins", bs: "2083 Asoj 31", ad: "2026-10-17", note: "Seven-day Dashain holiday: 17–23 October", type: "National" },
  { name: "Tihar holiday begins", bs: "2083 Kartik 22", ad: "2026-11-08", note: "Five-day Tihar holiday: 8–12 November", type: "National" },
  { name: "Falgunand Jayanti", bs: "2083 Kartik 25", ad: "2026-11-11", note: "Kirant community", type: "Community" },
  { name: "Chhath Parwa", bs: "2083 Kartik 29", ad: "2026-11-15", note: "National public holiday", type: "National" },
  { name: "International Day of Persons with Disabilities", bs: "2083 Mangsir 17", ad: "2026-12-03", note: "Employees with disabilities only", type: "Community" },
  { name: "Dhanya Purnima · Udhauli · Yomari Punhi", bs: "2083 Poush 09", ad: "2026-12-24", note: "National public holiday", type: "National" },
  { name: "Christmas Day", bs: "2083 Poush 10", ad: "2026-12-25", note: "National public holiday", type: "National" },
  { name: "Tamu Lhosar", bs: "2083 Poush 15", ad: "2026-12-30", note: "National public holiday", type: "National" },
  { name: "Dura Mhaipru Nakuma", bs: "2083 Poush 15", ad: "2026-12-30", note: "Dura community observance", type: "Community" },
  { name: "Prithvi Jayanti · National Unity Day", bs: "2083 Poush 27", ad: "2027-01-11", note: "National public holiday", type: "National" },
  { name: "Maghi · Maghe Sankranti", bs: "2083 Magh 01", ad: "2027-01-15", note: "National public holiday", type: "National" },
  { name: "Martyrs’ Day", bs: "2083 Magh 16", ad: "2027-01-30", note: "National public holiday", type: "National" },
  { name: "Sonam Lhosar", bs: "2083 Magh 24", ad: "2027-02-07", note: "National public holiday", type: "National" },
  { name: "Basanta Panchami", bs: "2083 Magh 28", ad: "2027-02-11", note: "Educational institutions only", type: "Community" },
  { name: "National Democracy Day", bs: "2083 Falgun 07", ad: "2027-02-19", note: "National public holiday", type: "National" },
  { name: "Maha Shivaratri", bs: "2083 Falgun 22", ad: "2027-03-06", note: "National public holiday", type: "National" },
  { name: "International Women’s Day", bs: "2083 Falgun 24", ad: "2027-03-08", note: "National public holiday", type: "National" },
  { name: "Gyalpo Lhosar", bs: "2083 Falgun 25", ad: "2027-03-09", note: "National public holiday", type: "National" },
  { name: "Fagu Purnima · Holi (Hills)", bs: "2083 Chaitra 07", ad: "2027-03-21", note: "56 Himalayan and Hill districts", type: "Regional" },
  { name: "Terai Holi", bs: "2083 Chaitra 08", ad: "2027-03-22", note: "21 Terai districts", type: "Regional" },
  { name: "Ghode Jatra", bs: "2083 Chaitra 23", ad: "2027-04-06", note: "Kathmandu Valley only", type: "Regional" },
  { name: "Eid al-Fitr", bs: "Date to be announced", ad: "", note: "Date depends on moon sighting", type: "To be announced" },
  { name: "Eid al-Adha", bs: "Date to be announced", ad: "", note: "Date depends on moon sighting", type: "To be announced" },
  { name: "Siruwa Pawani", bs: "Date to be announced", ad: "", note: "Jhapa, Morang, Sunsari, Siraha and Saptari", type: "To be announced" },
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

function ForexTool({ ne = false }: { ne?: boolean }) {
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

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadRates(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

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
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{ne ? "नेपाल राष्ट्र बैंक विनिमय दर" : "Nepal Rastra Bank Exchange Rates"}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">Daily buying and selling rates published by NRB. On weekends and public holidays, the latest available working-day rate may be shown.</p>
        </div>
        <button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm hover:border-teal-400 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading} onClick={() => void loadRates()}>
          {loading && <span className="pdfora-spinner" aria-hidden="true" />}
          {loading ? (ne ? "अद्यावधिक हुँदैछ…" : "Updating…") : (ne ? "दर अद्यावधिक गर्नुहोस्" : "Refresh rates")}
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
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-4 py-3">Currency</th><th scope="col" className="px-4 py-3 text-right">Unit</th><th scope="col" className="px-4 py-3 text-right">{ne ? "खरिद · NPR" : "Buying · NPR"}</th><th scope="col" className="px-4 py-3 text-right">Selling · NPR</th></tr></thead>
          <tbody>{data.rates.map((item) => <tr key={item.code} className="border-t border-slate-100 transition-colors hover:bg-teal-50/50"><th scope="row" className="px-4 py-3 font-semibold text-slate-900"><span>{item.code}</span><span className="ml-2 font-normal text-slate-500">{item.name}</span></th><td className="px-4 py-3 text-right tabular-nums">{item.unit}</td><td className="px-4 py-3 text-right font-medium tabular-nums">{item.buy.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</td><td className="px-4 py-3 text-right font-medium tabular-nums">{item.sell.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</td></tr>)}</tbody>
        </table>
      </div>
    </section>}

    {data && <section className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 shadow-sm sm:p-5">
      <h3 className="font-bold text-slate-950">{ne ? "खरिद र बिक्री दर कसरी पढ्ने?" : "How to read buying and selling rates"}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{ne ? "खरिद दरमा बैंकले तपाईंबाट विदेशी मुद्रा किन्छ; बिक्री दरमा बैंकले तपाईंलाई विदेशी मुद्रा बेच्छ। प्रत्येक दर तोकिएको unit का लागि हो, त्यसैले रूपान्तरण गर्दा unit पनि हिसाब गर्नुहोस्।" : "The buying rate is what the bank pays when it buys foreign currency from you. The selling rate is what you pay when the bank sells foreign currency to you. Each rate applies to the published unit, so include the unit in every conversion."}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
        <li>{ne ? "विदेशी मुद्रा → NPR: रकम × खरिद दर ÷ unit" : "Foreign currency → NPR: amount × buying rate ÷ unit"}</li>
        <li>{ne ? "NPR → विदेशी मुद्रा: NPR रकम × unit ÷ बिक्री दर" : "NPR → foreign currency: NPR amount × unit ÷ selling rate"}</li>
        <li>{ne ? "यो दैनिक सन्दर्भ दर हो; बैंक, रेमिट्यान्स सेवा र शुल्कका कारण वास्तविक quote फरक हुन सक्छ।" : "This is a daily reference rate; banks and remittance providers may quote different amounts because of spreads and fees."}</li>
      </ul>
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

function SalaryTaxTool({ ne = false }: { ne?: boolean }) {
  const [income, setIncome] = useState("1200000");
  const [firstBandExempt, setFirstBandExempt] = useState(false);
  const amount = Number(income);
  const valid = income.trim() !== "" && Number.isFinite(amount) && amount >= 0 && amount <= 1_000_000_000;
  const bands = [
    { limit: 1_000_000, rate: firstBandExempt ? 0 : 0.01 },
    { limit: 500_000, rate: 0.10 },
    { limit: 1_000_000, rate: 0.20 },
    { limit: 1_500_000, rate: 0.27 },
    { limit: Infinity, rate: 0.29 },
  ];
  let remaining = valid ? amount : 0;
  let tax = 0;
  const breakdown = bands.map((band) => {
    const taxable = Math.min(remaining, band.limit);
    remaining -= taxable;
    const charge = taxable * band.rate;
    tax += charge;
    return { taxable, rate: band.rate, charge };
  }).filter((item) => item.taxable > 0);
  return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">{ne ? "नेपाल तलब / आयकर क्याल्कुलेटर · आ.व. २०८३/८४" : "Nepal Salary / Income Tax Calculator · FY 2083/84"}</h2><p className="mt-1 text-sm text-slate-600">Progressive estimate for a resident natural person using the published 2083/84 bands.</p></div>
    <Field title="Annual taxable salary / income (NPR, after eligible deductions)" value={income} onChange={setIncome}/>
    <label className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" checked={firstBandExempt} onChange={(e) => setFirstBandExempt(e.target.checked)}/><span>First NPR 1,000,000 band is exempt from the 1% charge under an applicable statutory exception.</span></label>
    {valid ? <><Result>Estimated annual income tax: {npr(tax)}\nEstimated monthly tax: {npr(tax / 12)}\nEstimated monthly take-home from taxable income: {npr((amount - tax) / 12)}\nEffective tax rate: {amount > 0 ? (tax / amount * 100).toFixed(2) : "0.00"}%</Result><div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-3 text-left">Taxable band portion</th><th className="p-3 text-right">Rate</th><th className="p-3 text-right">Tax</th></tr></thead><tbody>{breakdown.map((item, i) => <tr key={i} className="border-t"><td className="p-3">{npr(item.taxable)}</td><td className="p-3 text-right">{(item.rate * 100).toFixed(0)}%</td><td className="p-3 text-right">{npr(item.charge)}</td></tr>)}</tbody></table></div></> : <p role="alert" className="text-sm text-red-700">Enter a valid non-negative annual taxable income.</p>}
    <p className="text-xs leading-5 text-slate-500">This is an estimate for resident natural persons only. It does not calculate every rebate, allowance, retirement contribution, insurance deduction, non-resident case or special income category. The 1% first-band charge has statutory exceptions. Verify your situation against the current IRD notice or a tax professional.</p>
    <a className="text-sm font-semibold text-teal-700 underline" href="https://ird.gov.np/category/taxrateincentives/" target="_blank" rel="noreferrer">IRD official tax rates and incentives</a>
  </div>;
}

function ElectricityTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
  return <div className="space-y-4">
    <div>
      <h2 className="text-lg font-bold">{ne ? "आधिकारिक विद्युत महसुल क्याल्कुलेटर" : "Official Electricity Tariff Calculator"}</h2>
      <p className="mt-1 text-sm text-slate-600">{ne ? "विद्युत महसुल दर, न्यूनतम शुल्क, कर तथा छुट परिवर्तन हुन सक्ने भएकाले PDFora ले अनुमानित बिल निकाल्दैन। सही र अद्यावधिक हिसाबका लागि विद्युत नियमन आयोगको आधिकारिक क्याल्कुलेटर प्रयोग गर्नुहोस्।" : "Electricity tariffs, minimum charges, taxes and rebates can change. PDFora does not estimate a bill using fixed tariff assumptions. Use the Electricity Regulatory Commission's official calculator for current calculations."}</p>
    </div>
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      {ne ? "नोट: अन्तिम महसुल तपाईंको मिटर, खपत, लागू निर्देशन र नेपाल विद्युत प्राधिकरणको बिलअनुसार फरक हुन सक्छ।" : "Note: Your final charge depends on your meter, consumption, applicable directives and the Nepal Electricity Authority bill."}
    </div>
    <div className="flex flex-wrap gap-4 text-sm">
      <a className="font-semibold text-teal-700 underline" href="https://www.erc.gov.np/electricity-calculator" target="_blank" rel="noreferrer">{ne ? "आधिकारिक ERC बिजुली बिल क्याल्कुलेटर खोल्नुहोस्" : "Open official ERC electricity calculator"}</a>
      <a className="font-semibold text-teal-700 underline" href="https://www.erc.gov.np/detail/314" target="_blank" rel="noreferrer">{ne ? "आ.व. २०८३ को महसुल निर्देशन हेर्नुहोस्" : "View the current 2083 ERC tariff directive"}</a>
      <a className="font-semibold text-teal-700 underline" href="https://www.nea.org.np/en/pages/consumer-tariff-rates" target="_blank" rel="noreferrer">{ne ? "NEA उपभोक्ता महसुल दर" : "NEA consumer tariff rates"}</a>
    </div>
  </div>;
}

const holidayNamesNe: Record<string, string> = {
  "Nepali New Year": "नेपाली नयाँ वर्ष", "Labour Day · Buddha Jayanti · Ubhauli · Chandi Purnima": "मजदुर दिवस · बुद्ध जयन्ती · उभौली · चण्डी पूर्णिमा",
  "Republic Day": "गणतन्त्र दिवस", "Rakshya Bandhan": "रक्षाबन्धन", "Gai Jatra": "गाईजात्रा",
  "Krishna Janmashtami": "कृष्ण जन्माष्टमी", "Gaura Parwa": "गौरा पर्व", "Haritalika Teej": "हरितालिका तीज",
  "Constitution Day": "संविधान दिवस", "Indra Jatra": "इन्द्रजात्रा", "Jitiya Parwa": "जितिया पर्व",
  "Ghatasthapana": "घटस्थापना", "Dashain holiday begins": "दशैँ बिदा सुरु", "Tihar holiday begins": "तिहार बिदा सुरु",
  "Falgunand Jayanti": "फाल्गुनन्द जयन्ती", "Chhath Parwa": "छठ पर्व",
  "International Day of Persons with Disabilities": "अपाङ्गता भएका व्यक्तिहरूको अन्तर्राष्ट्रिय दिवस",
  "Dhanya Purnima · Udhauli · Yomari Punhi": "धान्य पूर्णिमा · उधौली · योमरी पुन्हि", "Christmas Day": "क्रिसमस डे",
  "Tamu Lhosar": "तमु ल्होसार", "Dura Mhaipru Nakuma": "दुरा म्हैप्रु नकुमा", "Prithvi Jayanti · National Unity Day": "पृथ्वी जयन्ती · राष्ट्रिय एकता दिवस",
  "Maghi · Maghe Sankranti": "माघी · माघे सङ्क्रान्ति", "Martyrs’ Day": "शहीद दिवस", "Sonam Lhosar": "सोनाम ल्होसार",
  "Basanta Panchami": "वसन्त पञ्चमी", "National Democracy Day": "प्रजातन्त्र दिवस", "Maha Shivaratri": "महाशिवरात्रि",
  "International Women’s Day": "अन्तर्राष्ट्रिय महिला दिवस", "Gyalpo Lhosar": "ग्याल्पो ल्होसार",
  "Fagu Purnima · Holi (Hills)": "फागु पूर्णिमा · होली (पहाड)", "Terai Holi": "तराई होली", "Ghode Jatra": "घोडेजात्रा",
  "Eid al-Fitr": "ईद उल फित्र", "Eid al-Adha": "ईद उल अजहा", "Siruwa Pawani": "सिरुवा पवनी",
  "Bhoto Jatra": "भोटो जात्रा", "Muhammad Jayanti": "मोहम्मद जयन्ती", "Guru Nanak Jayanti": "गुरु नानक जयन्ती"
};
const holidayNotesNe: Record<string, string> = {
  "National public holiday": "राष्ट्रिय सार्वजनिक बिदा", "Newar community nationwide": "देशभरका नेवार समुदाय", "Far-western community observance": "सुदूरपश्चिमेली समुदायको पर्व", "Dura community observance": "दुरा समुदायको पर्व",
   "Kathmandu Valley only": "काठमाडौं उपत्यकामा मात्र",
  "Women celebrating Jitiya Parwa": "जितिया पर्व मनाउने महिलाहरू", "Seven-day Dashain holiday: 17–23 October": "सात दिने दशैँ बिदा: अक्टोबर १७–२३",
  "Five-day Tihar holiday: 8–12 November": "पाँच दिने तिहार बिदा: नोभेम्बर ८–१२", "Kirant community": "किरात समुदाय",
  "Employees with disabilities only": "अपाङ्गता भएका कर्मचारीका लागि मात्र", "Women employees only": "महिला कर्मचारीका लागि मात्र", "Date depends on moon sighting": "चन्द्रदर्शनमा निर्भर मिति",
  "Jhapa, Morang, Sunsari, Siraha and Saptari": "झापा, मोरङ, सुनसरी, सिरहा र सप्तरी", "Muslim community": "मुस्लिम समुदाय",
  "Sikh community": "सिख समुदाय", "56 Himalayan and Hill districts": "हिमाली तथा पहाडी ५६ जिल्ला",
  "21 Terai districts": "तराईका २१ जिल्ला", "Educational institutions only": "शैक्षिक संस्थामा मात्र"
};
const holidayTypeNe: Record<string, string> = {
  National: "राष्ट्रिय", Regional: "क्षेत्रीय", Community: "समुदाय-विशेष", "To be announced": "घोषणा हुन बाँकी"
};
const holidayMonthNe: Record<string, string> = {
  Baisakh: "वैशाख", Jestha: "जेठ", Asar: "असार", Shrawan: "साउन", Bhadra: "भदौ", Asoj: "असोज",
  Kartik: "कार्तिक", Mangsir: "मंसिर", Poush: "पुस", Magh: "माघ", Falgun: "फागुन", Chaitra: "चैत"
};
const nepaliNumberText = "०१२३४५६७८९";

function HolidayTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const ne = locale === "ne";
  const shown = useMemo(() => holidays.filter((item) => {
    const matchesQuery = `${item.name} ${holidayNamesNe[item.name] ?? ""} ${item.bs} ${item.ad} ${item.note} ${holidayNotesNe[item.note] ?? ""}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === "All" || item.type === filter);
  }), [query, filter]);
  const labels = ne ? { title: "नेपालका सार्वजनिक बिदा २०८३ (२०२६/२७)", intro: "राष्ट्रिय, क्षेत्रीय तथा समुदाय-विशेष सार्वजनिक बिदा र पर्व खोज्नुहोस्।", search: "बिदा खोज्नुहोस्", all: "सबै", national: "राष्ट्रिय", regional: "क्षेत्रीय", community: "समुदाय-विशेष", tba: "घोषणा हुन बाँकी", red: "रातो: राष्ट्रिय सार्वजनिक बिदा", saturday: "हल्का रातो: शनिबार", amber: "पहेंलो: मिति घोषणा हुन बाँकी", showing: "देखाइएको", entries: "प्रविष्टि", holiday: "बिदा / पर्व", bs: "वि.सं. मिति", ad: "ई.सं. मिति", applies: "लागू हुने क्षेत्र / टिप्पणी", public: "सार्वजनिक बिदा", footer: "यो २०८३ को सरकारी बिदा सूचीको स्थिर सन्दर्भ (static reference) हो। गृह मन्त्रालयको पृष्ठमा Last Updated: 2083-07-20 15:42:42 (Nepal Time) देखाइएको छ। निजी रोजगारदाता, विद्यालय, बैंक वा प्रदेश सबैले यही बिदा पालना गर्छन् भन्ने ग्यारेन्टी होइन। चन्द्र पात्रोमा आधारित घोषणा हुन बाँकी मितिहरू आधिकारिक पुष्टि भएपछि मात्र निश्चित हुन्छन्।", verify: "आधिकारिक गृह मन्त्रालयको २०८३ बिदा सूचना हेर्नुहोस्" } : { title: "Nepal Public Holidays 2083 BS (2026/27)", intro: "Search government and public holidays, including national, regional and community-specific observances.", search: "Search holidays", all: "All", national: "National", regional: "Regional", community: "Community", tba: "To be announced", red: "Red: National public holiday", saturday: "Light red: Saturday", amber: "Amber: Date to be announced", showing: "Showing", entries: "entries", holiday: "Holiday", bs: "BS date", ad: "AD date", applies: "Applies to / note", public: "Public holiday", footer: "This is a searchable static reference transcription of the 2083 government holiday list. The Ministry of Home Affairs page displays Last Updated: 2083-07-20 15:42:42 (Nepal Time). It is not a guarantee that every private employer, school, bank or province follows the same closure schedule. Dates for lunar observances marked TBA require later official confirmation.", verify: "Verify with Ministry of Home Affairs official 2083 holiday notice" };
  return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">{labels.title}</h2><p className="mt-1 text-sm text-slate-600">{labels.intro}</p></div>
    <Field title={labels.search} value={query} onChange={setQuery} type="text"/>
    <div className="flex flex-wrap gap-2">{(ne ? ["All","National","Regional","Community","To be announced"] : ["All","National","Regional","Community","To be announced"]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1.5 text-sm ${filter === item ? "border-teal-700 bg-teal-50 text-teal-900" : "border-slate-300"}`}>{ne ? ({ All: labels.all, National: labels.national, Regional: labels.regional, Community: labels.community, "To be announced": labels.tba } as Record<string, string>)[item] : item}</button>)}</div>
    <div className="flex flex-wrap gap-3 text-xs"><span className="rounded-lg bg-rose-100 px-3 py-2 font-semibold text-rose-800">{labels.red}</span><span className="rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-700">{labels.saturday}</span><span className="rounded-lg bg-amber-50 px-3 py-2 font-semibold text-amber-800">{labels.amber}</span></div><p className="text-xs text-slate-500">{labels.showing} {shown.length} / {holidays.length} {labels.entries}. {ne ? "राष्ट्रिय बिदा रातो र शनिबार हल्का रातो रङमा देखाइएका छन्।" : "National holidays are red; Saturdays are lightly shaded. Regional and community observances retain their notes."}</p>
    <div className="overflow-x-auto rounded-xl border"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-slate-100"><tr><th className="p-3">{labels.holiday}</th><th className="p-3">{labels.bs}</th><th className="p-3">{labels.ad}</th><th className="p-3">{labels.applies}</th></tr></thead><tbody>{shown.map((item) => <tr key={item.name} className={`border-t align-top ${item.ad && new Date(`${item.ad}T00:00:00Z`).getUTCDay() === 6 ? "bg-rose-50" : item.ad ? "bg-white" : "bg-amber-50/50"}`}><td className={`p-3 font-semibold ${item.ad && holidays.some((holiday) => holiday.ad === item.ad && holiday.type === "National") ? "text-rose-700" : "text-slate-900"}`}>{ne ? holidayNamesNe[item.name] ?? item.name : item.name}{item.type === "National" && <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">{labels.public}</span>}</td><td className="p-3 whitespace-nowrap">{ne ? item.bs.replace(/(Baisakh|Jestha|Asar|Shrawan|Bhadra|Asoj|Kartik|Mangsir|Poush|Magh|Falgun|Chaitra)/g, (month) => holidayMonthNe[month] ?? month).replace(/\d/g, (digit) => nepaliNumberText[Number(digit)]) : item.bs}</td><td className={`p-3 whitespace-nowrap font-semibold ${item.type === "National" ? "text-rose-700" : ""}`}>{item.ad ? (ne ? item.ad.replace(/\d/g, (digit) => "०१२३४५६७८९"[Number(digit)]) : item.ad) : labels.tba}</td><td className="p-3 text-slate-600"><span className="mr-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold">{ne ? holidayTypeNe[item.type] : item.type}</span>{ne ? holidayNotesNe[item.note] ?? item.note : item.note}</td></tr>)}</tbody></table></div>
    <p className="text-xs leading-5 text-slate-500">{labels.footer}</p><span className="sr-only">2083-07-20 · २०८३-०७-२० · static reference</span>
    <a className="text-sm font-semibold text-teal-700 underline" href="https://moha.gov.np/en/page/government-and-public-holidays-in-2083" target="_blank" rel="noreferrer">{labels.verify}</a>
  </div>;
}

function NepseDividendTool({ ne = false }: { ne?: boolean }) {
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
    <div><h2 className="text-lg font-bold">{ne ? "NEPSE नगद लाभांश तथा बोनस शेयर क्याल्कुलेटर" : "NEPSE Cash Dividend & Bonus Share Calculator"}</h2><p className="mt-1 text-sm text-slate-600">Estimate cash dividend on the editable face value, after an editable withholding-tax assumption, and calculate bonus shares.</p></div>
    <div className="grid gap-3 sm:grid-cols-2"><Field title="Shares held" value={shares} onChange={setShares}/><Field title="Cash dividend (%)" value={cashRate} onChange={setCashRate}/><Field title="Bonus shares (%)" value={bonusRate} onChange={setBonusRate}/><Field title="Face value per share (NPR)" value={faceValue} onChange={setFaceValue}/><Field title="Cash dividend tax assumption (%)" value={taxRate} onChange={setTaxRate}/></div>
    {valid ? <Result>Eligible shares: {quantity.toLocaleString("en-IN")}\nGross cash dividend (face value basis): {npr(cashGross)}\nEstimated withholding tax: {npr(cashTax)}\nEstimated cash dividend after tax: {npr(cashGross - cashTax)}\nEstimated bonus shares: {bonusShares.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</Result> : <p role="alert" className="text-sm text-red-700">Enter a positive whole share quantity and valid non-negative percentages.</p>}
    <p className="text-xs leading-5 text-slate-500">This is a percentage-based estimate, not an allotment confirmation. Fractional bonus entitlements, book closure eligibility, withholding rules and company-specific terms may change the final credited amount. Verify the declared corporate action and tax treatment with the company, CDSC and IRD.</p>
    <div className="flex flex-wrap gap-4 text-sm"><a className="font-semibold text-teal-700 underline" href="https://www.nepalstock.com/" target="_blank" rel="noreferrer">NEPSE official</a><a className="font-semibold text-teal-700 underline" href="https://meroshare.cdsc.com.np/" target="_blank" rel="noreferrer">Mero Share</a></div>
  </div>;
}

export default function NepalLiveTools({ slug, locale }: { slug: string; locale?: "en" | "ne" }) {
  const pathname = usePathname();
  const ne = locale ? locale === "ne" : pathname?.startsWith("/ne/") ?? false;
  if (slug === "nepal-forex-rates") return <ForexTool ne={ne}/>;
  if (slug === "nepal-salary-tax-calculator") return <SalaryTaxTool ne={ne}/>;
  if (slug === "nepal-electricity-bill-calculator") return <ElectricityTool locale={ne ? "ne" : "en"}/>;
  if (slug === "nepal-public-holidays-2083") return <HolidayTool locale={ne ? "ne" : "en"}/>;
  if (slug === "nepse-dividend-calculator") return <NepseDividendTool ne={ne}/>;
  if (slug === "nepse-market-news") return <NepalMarketNews/>;
  return <p className="text-sm text-slate-600">Nepal tool not found.</p>;
}
