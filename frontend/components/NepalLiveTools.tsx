"use client";

import { useEffect, useMemo, useState } from "react";
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
  { name: "Gaura Parwa", bs: "2083 Bhadra 19", ad: "2026-09-04", note: "Gaura Parwa community observance", type: "Community" },
  { name: "Haritalika Teej", bs: "2083 Bhadra 29", ad: "2026-09-14", note: "Women employees only", type: "Community" },
  { name: "Constitution Day", bs: "2083 Asoj 03", ad: "2026-09-19", note: "National public holiday", type: "National" },
  { name: "Indra Jatra", bs: "2083 Asoj 09", ad: "2026-09-25", note: "Kathmandu Valley only", type: "Regional" },
  { name: "Jitiya Parwa", bs: "2083 Asoj 15", ad: "2026-10-01", note: "Women employees observing Jitiya Parwa", type: "Community" },
  { name: "Ghatasthapana", bs: "2083 Asoj 25", ad: "2026-10-11", note: "National public holiday", type: "National" },
  { name: "Dashain holiday begins", bs: "2083 Asoj 31", ad: "2026-10-17", note: "Seven-day Dashain holiday: 17–23 October", type: "National" },
  { name: "Tihar holiday begins", bs: "2083 Kartik 22", ad: "2026-11-08", note: "Five-day Tihar holiday: 8–12 November", type: "National" },
  { name: "Falgunand Jayanti", bs: "2083 Kartik 25", ad: "2026-11-11", note: "Kirant community", type: "Community" },
  { name: "Chhath Parwa", bs: "2083 Kartik 29", ad: "2026-11-15", note: "National public holiday", type: "National" },
  { name: "International Day of Persons with Disabilities", bs: "2083 Mangsir 17", ad: "2026-12-03", note: "Employees with disabilities only", type: "Community" },
  { name: "Dhanya Purnima · Udhauli · Yomari Punhi", bs: "2083 Poush 09", ad: "2026-12-24", note: "National public holiday", type: "National" },
  { name: "Christmas Day", bs: "2083 Poush 10", ad: "2026-12-25", note: "National public holiday", type: "National" },
  { name: "Tamu Lhosar", bs: "2083 Poush 15", ad: "2026-12-30", note: "National public holiday", type: "National" },
  { name: "Dura Mhaipru Nakuma", bs: "2083 Poush 15", ad: "2026-12-30", note: "Dura community only", type: "Community" },
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

function ForexTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
  const copy = ne ? {
    eyebrow: "नेपाल · आधिकारिक सन्दर्भ दर", title: "नेपाल राष्ट्र बैंक विनिमय दर",
    description: "NRB ले प्रकाशित गरेको दैनिक खरिद तथा बिक्री दर। सप्ताहन्त वा सार्वजनिक बिदामा पछिल्लो कार्यदिवसको दर देखिन सक्छ।",
    refresh: "दर अद्यावधिक गर्नुहोस्", updating: "अद्यावधिक हुँदैछ…", waiting: "दरको प्रतीक्षा हुँदैछ",
    rateDate: "दर मिति", source: "स्रोत", fetched: "लिइएको समय", published: "प्रकाशित मुद्रा दर",
    currencies: "मुद्रा", unit: "एकाइ", buying: "खरिद · NPR", selling: "बिक्री · NPR",
    converter: "NRB मुद्रा रूपान्तरण", quick: "छिटो रूपान्तरण", uses: "छानिएको मुद्राको प्रकाशित एकाइ, खरिद र बिक्री दर प्रयोग हुन्छ।",
    currency: "मुद्रा", direction: "रूपान्तरण दिशा", amount: "रकम",
    foreignNpr: "विदेशी मुद्रा → NPR (खरिद)", nprForeign: "NPR → विदेशी मुद्रा (बिक्री)",
    estimated: "अनुमानित रूपान्तरण", explain: "आजका प्रकाशित दर बुझ्नुहोस्", explainButton: "AI बाट दर बुझ्नुहोस्",
    unavailable: "NRB AI व्याख्या उपलब्ध छैन।", tryAgain: "पुनः प्रयास गर्नुहोस्",
  } : {
    eyebrow: "Nepal · Official reference rates", title: "Nepal Rastra Bank Exchange Rates",
    description: "Daily buying and selling rates published by NRB. On weekends and public holidays, the latest available working-day rate may be shown.",
    refresh: "Refresh rates", updating: "Updating…", waiting: "Waiting for rates",
    rateDate: "Rate date", source: "Source", fetched: "Fetched", published: "Published currency rates",
    currencies: "currencies", unit: "Unit", buying: "Buying · NPR", selling: "Selling · NPR",
    converter: "NRB currency converter", quick: "Quick conversion", uses: "Uses the published unit, buying and selling rate for the selected currency.",
    currency: "Currency", direction: "Conversion direction", amount: "Amount",
    foreignNpr: "Foreign currency → NPR (buying)", nprForeign: "NPR → foreign currency (selling)",
    estimated: "Estimated conversion", explain: "Understand today's published rates", explainButton: "Explain rates with AI",
    unavailable: "NRB AI explanation is unavailable.", tryAgain: "Try again",
  };
  const [data, setData] = useState<ForexResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("100");
  const [direction, setDirection] = useState("foreign-to-npr");
  const [aiText, setAiText] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiBusy, setAiBusy] = useState(false);

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

  async function explainRates() {
    if (!data?.rates?.length || aiBusy) return;
    setAiBusy(true);
    setAiError("");
    setAiText("");
    try {
      const response = await fetch("/api/ai-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "forex-explain",
          source: data.source,
          rateDate: data.rateDate,
          requestedDate: data.requestedDate,
          isStale: String(!!data.isStale),
          rates: JSON.stringify(data.rates.slice(0, 30)),
          question: "Explain the latest NRB daily rates, how to read buying and selling rates, and what this means for someone converting money in Nepal."
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "NRB AI explanation is unavailable.");
      if (typeof payload.text !== "string" || !payload.text.trim()) throw new Error("AI returned an empty explanation.");
      setAiText(payload.text.trim());
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "NRB AI explanation is unavailable.");
    } finally {
      setAiBusy(false);
    }
  }

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
          <p className="text-xs font-bold uppercase tracking-[.14em] text-teal-700">{copy.eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{copy.title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{copy.description}</p>
        </div>
        <button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm hover:border-teal-400 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading} onClick={() => void loadRates()}>
          {loading && <span className="pdfora-spinner" aria-hidden="true" />}
          {loading ? copy.updating : copy.refresh}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
        <span><strong className="text-slate-800">{copy.rateDate}:</strong> {data?.rateDate || copy.waiting}</span>
        {data?.source && <span><strong className="text-slate-800">{copy.source}:</strong> {data.source}</span>}
        {data?.updatedAt && <span><strong className="text-slate-800">{copy.fetched}:</strong> {new Date(data.updatedAt).toLocaleString("en-NP", { timeZone: "Asia/Kathmandu" })}</span>}
      </div>
    </header>

    {data?.isStale && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">{data.notice || "Showing the latest cached official rates. The live source is temporarily unavailable."}</p>}
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-900"><strong>Rates could not be refreshed.</strong><p className="mt-1">{error}</p><button type="button" className="mt-2 font-semibold underline underline-offset-2" onClick={() => void loadRates()}>Try again</button></div>}

    {loading && !data && <div className="grid gap-2" aria-label="Loading exchange rates"><div className="pdfora-skeleton h-11 rounded-xl" /><div className="pdfora-skeleton h-11 rounded-xl" /><div className="pdfora-skeleton h-11 rounded-xl" /></div>}
    {data && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><h3 className="font-bold text-slate-900">{copy.published}</h3><span className="text-xs text-slate-500">{data.rates.length} {copy.currencies}</span></div>
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full min-w-[540px] text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th scope="col" className="px-4 py-3">{copy.currency}</th><th scope="col" className="px-4 py-3 text-right">{copy.unit}</th><th scope="col" className="px-4 py-3 text-right">{copy.buying}</th><th scope="col" className="px-4 py-3 text-right">{copy.selling}</th></tr></thead>
          <tbody>{data.rates.map((item) => <tr key={item.code} className="border-t border-slate-100 transition-colors hover:bg-teal-50/50"><th scope="row" className="px-4 py-3 font-semibold text-slate-900"><span>{item.code}</span><span className="ml-2 font-normal text-slate-500">{item.name}</span></th><td className="px-4 py-3 text-right tabular-nums">{item.unit}</td><td className="px-4 py-3 text-right font-medium tabular-nums">{item.buy.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</td><td className="px-4 py-3 text-right font-medium tabular-nums">{item.sell.toLocaleString("en-IN", { maximumFractionDigits: 4 })}</td></tr>)}</tbody>
        </table>
      </div>
    </section>}

    {data && <section className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-wide text-teal-800">PDFora NRB AI</p><h3 className="mt-1 font-bold text-slate-950">{copy.explain}</h3><p className="mt-1 text-xs text-slate-600">{ne ? "वास्तविक NRB दर तालिका र एकाइ बुझाउँछ; FX मूल्यको भविष्यवाणी गर्दैन।" : "Explains the actual NRB rate table and unit values; it does not predict FX prices."}</p></div>
        <button type="button" onClick={() => void explainRates()} disabled={aiBusy || !data.rates.length} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{aiBusy ? (ne ? "व्याख्या हुँदैछ…" : "Explaining…") : copy.explainButton}</button>
      </div>
      {aiError && <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{aiError}</p>}
      {aiText && <p className="mt-3 whitespace-pre-wrap rounded-xl border border-teal-100 bg-white p-4 text-sm leading-6 text-slate-700">{aiText}</p>}
    </section>}

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div><p className="text-xs font-bold uppercase tracking-[.12em] text-teal-700">{copy.quick}</p><h3 className="mt-1 text-lg font-bold text-slate-950">{copy.converter}</h3><p className="mt-1 text-sm text-slate-600">{copy.uses}</p></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label><span className={label}>{copy.currency}</span><select className={field} value={currency} onChange={(e) => setCurrency(e.target.value)}>{Array.from(new Map([...fallbackCurrencies, ...(data?.rates ?? []).map(({ code, name }) => ({ code, name }))].map(item => [item.code, item])).values()).map((item) => <option key={item.code} value={item.code}>{item.code} — {item.name}</option>)}</select></label>
        <label><span className={label}>{copy.direction}</span><select className={field} value={direction} onChange={(e) => setDirection(e.target.value)}><option value="foreign-to-npr">{copy.foreignNpr}</option><option value="npr-to-foreign">{copy.nprForeign}</option></select></label>
      </div>
      <div className="mt-3 max-w-sm"><Field title={copy.amount} value={amount} onChange={setAmount}/></div>
      {converted !== null && selected ? <div className="pdfora-pop-in mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4" aria-live="polite"><p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{copy.estimated}</p><p className="mt-1 break-words text-2xl font-bold tracking-tight text-teal-950">{direction === "foreign-to-npr" ? npr(converted) : converted.toLocaleString("en-IN", { maximumFractionDigits: 4 }) + " " + selected.code}</p><p className="mt-2 text-sm text-teal-900">{direction === "foreign-to-npr" ? value.toLocaleString() + " " + selected.code : npr(value)} · {direction === "foreign-to-npr" ? selected.buy : selected.sell} NPR per {selected.unit} {selected.code}</p><p className="mt-1 text-xs text-teal-800">{copy.rateDate}: {data?.rateDate}</p></div> : <p role="status" className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{error ? (ne ? "आधिकारिक दर उपलब्ध भएपछि रूपान्तरण हुनेछ।" : "The converter will calculate once official rates are available.") : (ne ? `${currency} का लागि प्रकाशित दर उपलब्ध छैन।` : `No published rate is available for ${currency} yet.`)}</p>}
    </section>

    <p className="text-xs leading-5 text-slate-500">NRB reference rates are not necessarily the exact rates offered by individual banks, money changers or remittance providers. Always confirm the transaction rate with your provider before making a payment.</p>
    <a className="inline-flex text-sm font-semibold text-teal-700 underline" href="https://www.nrb.org.np/forex" target="_blank" rel="noreferrer">View NRB official exchange-rate page ↗</a>
  </div>;
}

function SalaryTaxTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
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
    <div><h2 className="text-lg font-bold">{ne ? "नेपाल तलब / आयकर क्याल्कुलेटर · आर्थिक वर्ष २०८३/८४" : "Nepal Salary / Income Tax Calculator · FY 2083/84"}</h2><p className="mt-1 text-sm text-slate-600">{ne ? "प्रकाशित २०८३/८४ कर तहअनुसार निवासी प्राकृतिक व्यक्तिको प्रगतिशील अनुमान।" : "Progressive estimate for a resident natural person using the published 2083/84 bands."}</p></div>
    <Field title={ne ? "वार्षिक करयोग्य तलब / आय (NPR, योग्य कटौतीपछि)" : "Annual taxable salary / income (NPR, after eligible deductions)"} value={income} onChange={setIncome}/>
    <label className="flex items-start gap-3 text-sm"><input className="mt-1" type="checkbox" checked={firstBandExempt} onChange={(e) => setFirstBandExempt(e.target.checked)}/><span>{ne ? "लागू कानुनी अपवादअन्तर्गत पहिलो NPR १०,००,००० तहमा १% शुल्क नलाग्ने मान्नुहोस्।" : "First NPR 1,000,000 band is exempt from the 1% charge under an applicable statutory exception."}</span></label>
    {valid ? <>{ne ? <Result>{`अनुमानित वार्षिक आयकर: ${npr(tax)}\nअनुमानित मासिक कर: ${npr(tax / 12)}\nकरयोग्य आयबाट अनुमानित मासिक हातमा आउने रकम: ${npr((amount - tax) / 12)}\nप्रभावकारी कर दर: ${amount > 0 ? (tax / amount * 100).toFixed(2) : "0.00"}%`}</Result> : <Result>Estimated annual income tax: {npr(tax)}{"\n"}Estimated monthly tax: {npr(tax / 12)}{"\n"}Estimated monthly take-home from taxable income: {npr((amount - tax) / 12)}{"\n"}Effective tax rate: {amount > 0 ? (tax / amount * 100).toFixed(2) : "0.00"}%</Result>}<div className="overflow-x-auto rounded-xl border"><table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-3 text-left">{ne ? "करयोग्य तहको भाग" : "Taxable band portion"}</th><th className="p-3 text-right">{ne ? "दर" : "Rate"}</th><th className="p-3 text-right">{ne ? "कर" : "Tax"}</th></tr></thead><tbody>{breakdown.map((item, i) => <tr key={i} className="border-t"><td className="p-3">{npr(item.taxable)}</td><td className="p-3 text-right">{(item.rate * 100).toFixed(0)}%</td><td className="p-3 text-right">{npr(item.charge)}</td></tr>)}</tbody></table></div></> : <p role="alert" className="text-sm text-red-700">{ne ? "शून्य वा सोभन्दा बढी मान्य वार्षिक करयोग्य आय लेख्नुहोस्।" : "Enter a valid non-negative annual taxable income."}</p>}
    <p className="text-xs leading-5 text-slate-500">This is an estimate for resident natural persons only. It does not calculate every rebate, allowance, retirement contribution, insurance deduction, non-resident case or special income category. The 1% first-band charge has statutory exceptions. Verify your situation against the current IRD notice or a tax professional.</p>
    <a className="text-sm font-semibold text-teal-700 underline" href="https://ird.gov.np/category/taxrateincentives/" target="_blank" rel="noreferrer">IRD official tax rates and incentives</a>
  </div>;
}

function ElectricityTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
  return <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <header>
      <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{ne ? "नेपाल · आधिकारिक विद्युत् महसुल" : "Nepal · Official electricity tariff"}</p>
      <h2 className="mt-1 text-xl font-bold text-slate-950">{ne ? "आधिकारिक विद्युत् बिल क्याल्कुलेटर" : "Official Electricity Bill Calculator"}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{ne
        ? "विद्युत् नियमन आयोग (ERC) को आधिकारिक क्याल्कुलेटर प्रयोग गरेर आफ्नो जडानअनुसार मासिक बिल निकाल्नुहोस्।"
        : "Calculate your monthly bill with the Electricity Regulatory Commission (ERC) calculator using your actual connection details."}</p>
    </header>
    <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4">
      <h3 className="font-semibold text-slate-900">{ne ? "घरायसी बिल निकाल्ने तरिका" : "How to calculate a household bill"}</h3>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
        <li>{ne ? "जडान प्रकारमा ‘घरायसी’ छान्नुहोस्।" : "Choose “Domestic / Household” as the connection type."}</li>
        <li>{ne ? "आफ्नो मिटरको फ्युज क्षमता छान्नुहोस्।" : "Select the fuse capacity shown for your meter."}</li>
        <li>{ne ? "लागू हुने मौसम छान्नुहोस्।" : "Select the applicable season."}</li>
        <li>{ne ? "बिलमा देखिएको अवधिको वास्तविक खपत (kWh) लेख्नुहोस्।" : "Enter the actual consumption in kWh for the billing period."}</li>
        <li>{ne ? "बिल गणना गरी नतिजा र हाल लागू हुने महसुल आयोगको साइटमै जाँच्नुहोस्।" : "Calculate the bill and review the result and current tariff on the Commission’s site."}</li>
      </ol>
    </div>
    <a href="https://www.erc.gov.np/electricity-calculator" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">
      {ne ? "ERC को आधिकारिक बिल क्याल्कुलेटर खोल्नुहोस् ↗" : "Open the official ERC bill calculator ↗"}
    </a>
    <div className="space-y-2 text-xs leading-5 text-slate-500">
      <p>{ne ? "PDFora ले यहाँ पुरानो वा स्थिर महसुल दरबाट रकम अनुमान गर्दैन। ERC ले २०८३ सालमा नयाँ विद्युत् उपभोक्ता महसुल निर्धारण निर्देशिका जारी गरेको छ; त्यसैले अद्यावधिक आधिकारिक क्याल्कुलेटर प्रयोग गर्नुहोस्।" : "PDFora does not estimate a bill using potentially outdated hard-coded tariff rates. ERC issued a new Electricity Consumer Tariff Determination Directive in 2083, so use its current official calculator."}</p>
      <div className="flex flex-wrap gap-4">
        <a className="font-semibold text-teal-700 underline" href="https://www.erc.gov.np/detail/314" target="_blank" rel="noopener noreferrer">{ne ? "ERC को २०८३ महसुल निर्देशिका ↗" : "ERC 2083 tariff directive ↗"}</a>
        <a className="font-semibold text-teal-700 underline" href="https://www.nea.org.np/en/pages/consumer-tariff-rates" target="_blank" rel="noopener noreferrer">{ne ? "NEA उपभोक्ता महसुल जानकारी ↗" : "NEA consumer tariff information ↗"}</a>
      </div>
    </div>
  </section>;
}

const holidayNamesNe: Record<string, string> = {
  "Nepali New Year": "नेपाली नयाँ वर्ष",
  "Labour Day · Buddha Jayanti · Ubhauli · Chandi Purnima": "श्रमिक दिवस · बुद्ध जयन्ती · उभौली · चण्डी पूर्णिमा",
  "Republic Day": "गणतन्त्र दिवस",
  "Rakshya Bandhan": "रक्षाबन्धन",
  "Gai Jatra": "गाईजात्रा",
  "Krishna Janmashtami": "श्रीकृष्ण जन्माष्टमी",
  "Gaura Parwa": "गौरा पर्व",
  "Haritalika Teej": "हरितालिका तीज",
  "Constitution Day": "संविधान दिवस",
  "Indra Jatra": "इन्द्रजात्रा",
  "Jitiya Parwa": "जितिया पर्व",
  "Ghatasthapana": "घटस्थापना",
  "Dashain holiday begins": "दशैं बिदा सुरु",
  "Tihar holiday begins": "तिहार बिदा सुरु",
  "Falgunand Jayanti": "फाल्गुनन्द जयन्ती",
  "Chhath Parwa": "छठ पर्व",
  "International Day of Persons with Disabilities": "अन्तर्राष्ट्रिय अपाङ्गता दिवस",
  "Dhanya Purnima · Udhauli · Yomari Punhi": "धान्य पूर्णिमा · उधौली · योमरी पुन्ही",
  "Christmas Day": "क्रिसमस दिवस",
  "Tamu Lhosar": "तमु ल्होसार",
  "Dura Mhaipru Nakuma": "दुरा म्हैपु नाकुमा",
  "Prithvi Jayanti · National Unity Day": "पृथ्वी जयन्ती · राष्ट्रिय एकता दिवस",
  "Maghi · Maghe Sankranti": "माघी · माघे सङ्क्रान्ति",
  "Martyrs’ Day": "शहीद दिवस",
  "Sonam Lhosar": "सोनाम ल्होसार",
  "Basanta Panchami": "वसन्त पञ्चमी",
  "National Democracy Day": "राष्ट्रिय प्रजातन्त्र दिवस",
  "Maha Shivaratri": "महाशिवरात्रि",
  "International Women’s Day": "अन्तर्राष्ट्रिय महिला दिवस",
  "Gyalpo Lhosar": "ग्याल्पो ल्होसार",
  "Fagu Purnima · Holi (Hills)": "फागु पूर्णिमा · होली (पहाडी क्षेत्र)",
  "Terai Holi": "तराई होली",
  "Ghode Jatra": "घोडेजात्रा",
  "Eid al-Fitr": "ईद उल फित्र",
  "Eid al-Adha": "ईद उल अजहा",
  "Siruwa Pawani": "सिरुवा पवनी",
  "Bhoto Jatra": "भोटो जात्रा",
  "Muhammad Jayanti": "मोहम्मद जयन्ती",
  "Guru Nanak Jayanti": "गुरु नानक जयन्ती",
};
const holidayNotesNe: Record<string, string> = {
  "National public holiday": "राष्ट्रिय सार्वजनिक बिदा",
  "Kathmandu Valley and Newar community": "काठमाडौं उपत्यका र नेवार समुदाय",
  "Women employees only": "महिला कर्मचारीका लागि मात्र",
  "Women employees observing Jitiya Parwa": "जितिया पर्व मनाउने महिला कर्मचारीका लागि",
  "Newar community nationwide": "देशभरका नेवार समुदायका लागि",
  "Gaura Parwa community observance": "गौरा पर्व मनाउने समुदायका लागि",
  "Dura community only": "दुरा समुदायका लागि मात्र",
  "Women employees only": "महिला कर्मचारीका लागि मात्र",
  "Kathmandu Valley only": "काठमाडौं उपत्यकामा मात्र",
  "Women celebrating Jitiya Parwa": "जितिया पर्व मनाउने महिलाका लागि",
  "Seven-day Dashain holiday: 17–23 October": "सात दिनको दशैं बिदा: १७–२३ अक्टोबर",
  "Five-day Tihar holiday: 8–12 November": "पाँच दिनको तिहार बिदा: ८–१२ नोभेम्बर",
  "Kirant community": "किराँत समुदाय",
  "Employees with disabilities only": "अपाङ्गता भएका कर्मचारीका लागि मात्र",
  "Educational institutions only": "शैक्षिक संस्थामा मात्र",
  "56 Himalayan and Hill districts": "५६ हिमाली तथा पहाडी जिल्ला",
  "21 Terai districts": "२१ तराई जिल्ला",
  "Date depends on moon sighting": "चन्द्रदर्शनअनुसार मिति तय हुनेछ",
  "Jhapa, Morang, Sunsari, Siraha and Saptari": "झापा, मोरङ, सुनसरी, सिराहा र सप्तरी",
  "Muslim community": "मुस्लिम समुदाय",
  "Sikh community": "सिख समुदाय",
};
const holidayTypeNe: Record<string, string> = {
  All: "सबै",
  National: "राष्ट्रिय",
  Regional: "क्षेत्रीय",
  Community: "समुदाय",
  "To be announced": "मिति तोकिन बाँकी",
};
const holidayMonthNe: Record<string, string> = {
  Baisakh: "बैशाख", Jestha: "जेठ", Bhadra: "भदौ", Asoj: "असोज", Kartik: "कात्तिक",
  Mangsir: "मंसिर", Poush: "पुस", Magh: "माघ", Falgun: "फागुन", Chaitra: "चैत",
};
const nepaliNumberText = (value: string) => value.replace(/\d/g, (digit) => "०१२३४५६७८९"[Number(digit)]);
const localizedBsDate = (value: string) => {
  if (value === "Date to be announced") return "मिति तोकिन बाँकी";
  const translated = value.replace(/^2083\s+([A-Za-z]+)\s+(\d{2})$/, (_match, month: string, day: string) => `२०८३ ${holidayMonthNe[month] ?? month} ${day}`);
  return nepaliNumberText(translated);
};

function HolidayTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const shown = useMemo(() => holidays.filter((item) => {
    const nameNe = holidayNamesNe[item.name] ?? item.name;
    const noteNe = holidayNotesNe[item.note] ?? item.note;
    const search = `${item.name} ${item.bs} ${item.ad} ${item.note} ${nameNe} ${noteNe}`.toLowerCase();
    const matchesQuery = search.includes(query.toLowerCase());
    return matchesQuery && (filter === "All" || item.type === filter);
  }), [query, filter]);
  const digit = (value: string) => ne ? nepaliNumberText(value) : value;
  return <div className="space-y-4">
    <div><h2 className="text-lg font-bold">{ne ? "नेपाल सार्वजनिक बिदा २०८३ BS (२०२६/२७)" : "Nepal Public Holidays 2083 BS (2026/27)"}</h2><p className="mt-1 text-sm text-slate-600">{ne ? "राष्ट्रिय, क्षेत्रीय तथा समुदायअनुसारका सरकारी र सार्वजनिक बिदा खोज्नुहोस्।" : "Search government and public holidays, including national, regional and community-specific observances."}</p></div>
    <Field title={ne ? "बिदा खोज्नुहोस्" : "Search holidays"} value={query} onChange={setQuery} type="text"/>
    <div className="flex flex-wrap gap-2">{["All","National","Regional","Community","To be announced"].map((item) => <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} className={`rounded-full border px-3 py-1.5 text-sm ${filter === item ? "border-teal-700 bg-teal-50 text-teal-900" : "border-slate-300"}`}>{ne ? holidayTypeNe[item] : item}</button>)}</div>
    <div className="flex flex-wrap gap-3 text-xs"><span className="rounded-lg bg-rose-100 px-3 py-2 font-semibold text-rose-800">{ne ? "रातो: राष्ट्रिय सार्वजनिक बिदा" : "Red: National public holiday"}</span><span className="rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-700">{ne ? "हल्का रातो: शनिबार" : "Light red: Saturday"}</span><span className="rounded-lg bg-amber-50 px-3 py-2 font-semibold text-amber-800">{ne ? "पहेंलो: मिति पछि तोकिने" : "Amber: Date to be announced"}</span></div>
    <p className="text-xs text-slate-500">{ne ? `${digit(String(shown.length))} / ${digit(String(holidays.length))} बिदा देखाइँदैछ। राष्ट्रिय बिदा रातो, शनिबार हल्का रातो र पछि मिति तोकिने बिदा पहेंलो देखाइएको छ।` : `Showing ${shown.length} of ${holidays.length} entries. National holidays are red; Saturdays are lightly shaded. Regional and community observances retain their notes.`}</p>
    <div className="overflow-x-auto rounded-xl border"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-slate-100"><tr><th scope="col" className="p-3">{ne ? "बिदा" : "Holiday"}</th><th scope="col" className="p-3">{ne ? "BS मिति" : "BS date"}</th><th scope="col" className="p-3">{ne ? "AD मिति" : "AD date"}</th><th scope="col" className="p-3">{ne ? "लागू हुने क्षेत्र / टिप्पणी" : "Applies to / note"}</th></tr></thead><tbody>{shown.map((item) => {
      const name = ne ? holidayNamesNe[item.name] ?? item.name : item.name;
      const note = ne ? holidayNotesNe[item.note] ?? item.note : item.note;
      const bs = ne ? localizedBsDate(item.bs) : item.bs;
      const ad = item.ad ? digit(item.ad) : (ne ? "मिति तोकिन बाँकी" : "TBA");
      return <tr key={item.name} className={`border-t align-top ${item.ad && new Date(`${item.ad}T00:00:00Z`).getUTCDay() === 6 ? "bg-rose-50" : item.ad ? "bg-white" : "bg-amber-50/50"}`}><td className={`p-3 font-semibold ${item.ad && holidays.some((holiday) => holiday.ad === item.ad && holiday.type === "National") ? "text-rose-700" : "text-slate-900"}`}>{name}{item.type === "National" && <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">{ne ? "सार्वजनिक बिदा" : "Public holiday"}</span>}</td><td className="p-3 whitespace-nowrap">{bs}</td><td className={`p-3 whitespace-nowrap font-semibold ${item.type === "National" ? "text-rose-700" : ""}`}>{ad}</td><td className="p-3 text-slate-600">{note}</td></tr>;
    })}</tbody></table></div>
    <p className="text-xs leading-5 text-slate-500">{ne ? "यो गृह मन्त्रालयको २०८३ सालको सूचनामा आधारित खोज्न मिल्ने स्थिर सन्दर्भ सूची हो; स्रोत पृष्ठमा पछिल्लो अद्यावधिक २०८३-०७-२० देखिन्छ। यो प्रत्यक्ष अपडेट हुने फिड होइन। पछिल्ला सरकारी सूचना, प्रदेश/स्थानीय निर्णय र चन्द्रदर्शनमा निर्भर मिति फरक हुन सक्छन्; सम्बन्धित निकायसँग पुष्टि गर्नुहोस्।" : "This is a searchable transcription of the Ministry of Home Affairs 2083 notice; the source page displays “Last Updated: 2083-07-20 15:42:42”. It is a static reference, not a live feed or a guarantee that every employer, school, bank or province follows the same closure schedule. Later notices and TBA lunar observances may change the details."}</p>
    <a className="text-sm font-semibold text-teal-700 underline" href="https://moha.gov.np/en/page/government-and-public-holidays-in-2083" target="_blank" rel="noreferrer">{ne ? "गृह मन्त्रालयको आधिकारिक २०८३ बिदा सूचना जाँच्नुहोस्" : "Verify with Ministry of Home Affairs official 2083 holiday notice"}</a>
  </div>;
}

function NepseDividendTool({ locale = "en" }: { locale?: "en" | "ne" }) {
  const ne = locale === "ne";
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
    <div><h2 className="text-lg font-bold">{ne ? "NEPSE नगद लाभांश तथा बोनस शेयर क्याल्कुलेटर" : "NEPSE Cash Dividend & Bonus Share Calculator"}</h2><p className="mt-1 text-sm text-slate-600">{ne ? "परिवर्तन गर्न मिल्ने अंकित मूल्य र कर धारणापछि नगद लाभांश तथा बोनस शेयरको अनुमान गर्नुहोस्।" : "Estimate cash dividend on the editable face value, after an editable withholding-tax assumption, and calculate bonus shares."}</p></div>
    <div className="grid gap-3 sm:grid-cols-2"><Field title="Shares held" value={shares} onChange={setShares}/><Field title="Cash dividend (%)" value={cashRate} onChange={setCashRate}/><Field title="Bonus shares (%)" value={bonusRate} onChange={setBonusRate}/><Field title="Face value per share (NPR)" value={faceValue} onChange={setFaceValue}/><Field title="Cash dividend tax assumption (%)" value={taxRate} onChange={setTaxRate}/></div>
    {valid ? <Result>{ne ? `योग्य शेयर: ${quantity.toLocaleString("en-IN")}\nकुल नगद लाभांश (अंकित मूल्य आधार): ${npr(cashGross)}\nअनुमानित रोक्का कर: ${npr(cashTax)}\nकरपछि अनुमानित नगद लाभांश: ${npr(cashGross - cashTax)}\nअनुमानित बोनस शेयर: ${bonusShares.toLocaleString("en-IN", { maximumFractionDigits: 4 })}` : `Eligible shares: ${quantity.toLocaleString("en-IN")}\nGross cash dividend (face value basis): ${npr(cashGross)}\nEstimated withholding tax: ${npr(cashTax)}\nEstimated cash dividend after tax: ${npr(cashGross - cashTax)}\nEstimated bonus shares: ${bonusShares.toLocaleString("en-IN", { maximumFractionDigits: 4 })}`}</Result> : <p role="alert" className="text-sm text-red-700">{ne ? "सकारात्मक पूर्ण शेयर संख्या र मान्य गैर-नकारात्मक प्रतिशत लेख्नुहोस्।" : "Enter a positive whole share quantity and valid non-negative percentages."}</p>}
    <p className="text-xs leading-5 text-slate-500">This is a percentage-based estimate, not an allotment confirmation. Fractional bonus entitlements, book closure eligibility, withholding rules and company-specific terms may change the final credited amount. Verify the declared corporate action and tax treatment with the company, CDSC and IRD.</p>
    <div className="flex flex-wrap gap-4 text-sm"><a className="font-semibold text-teal-700 underline" href="https://www.nepalstock.com/" target="_blank" rel="noreferrer">NEPSE official</a><a className="font-semibold text-teal-700 underline" href="https://meroshare.cdsc.com.np/" target="_blank" rel="noreferrer">Mero Share</a></div>
  </div>;
}

export default function NepalLiveTools({ slug, locale = "en" }: { slug: string; locale?: "en" | "ne" }) {
  if (slug === "nepal-forex-rates") return <ForexTool locale={locale}/>;
  if (slug === "nepal-salary-tax-calculator") return <SalaryTaxTool locale={locale}/>;
  if (slug === "nepal-electricity-bill-calculator") return <ElectricityTool locale={locale}/>;
  if (slug === "nepal-public-holidays-2083") return <HolidayTool locale={locale}/>;
  if (slug === "nepse-dividend-calculator") return <NepseDividendTool locale={locale}/>;
  if (slug === "nepse-market-news") return <NepalMarketNews locale={locale}/>;
  return <p className="text-sm text-slate-600">Nepal tool not found.</p>;
}
