const sources = [
  { title: "NRB Statistics & Data Links", url: "https://www.nrb.org.np/departments/statistics-data-links/", detail: "Liquidity, deposits, credit, interest rates, banking statistics and monthly macro publications" },
  { title: "NRB National Summary Data Page", url: "https://www.nrb.org.np/nsdp/", detail: "SDMX downloads for CPI, interest rates, monetary surveys, stock market and balance of payments" },
  { title: "NRB Macroeconomic Indicators", url: "https://www.nrb.org.np/category/economic-bulletin/macroeconomic-indicators-of-nepal/", detail: "Published macroeconomic indicator tables and downloadable reports" },
  { title: "SEBON", url: "https://sebon.gov.np/", detail: "Securities regulation, circulars, notices and investor-protection updates" },
  { title: "NEPSE", url: "https://www.nepalstock.com/", detail: "Exchange notices, listed-company disclosures and official market information" },
];
const drivers = [
  ["Liquidity & credit", "Broad money, deposits, private-sector credit, CD ratio and interbank liquidity can change risk appetite; also check credit quality and NPLs."],
  ["Interest rates", "Policy, interbank, deposit and lending rates affect financing costs, valuation pressure and bank margins."],
  ["Inflation", "CPI and food/non-food inflation affect real returns, household purchasing power and the monetary-policy outlook."],
  ["External sector", "Remittance inflows, foreign-exchange reserves and balance-of-payments conditions can influence deposits, liquidity and external stability."],
  ["Policy & event risk", "NRB monetary policy, SEBON/NEPSE circulars, budget/tax changes and political developments can alter sector-level risk."],
];
export default function NepseMacroDrivers() {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">Nepal macro & policy drivers</h3><p className="mt-1 text-xs text-slate-500">Evidence checklist to interpret a technical signal in the wider Nepal market context.</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">Not scored live</span></div>
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {drivers.map(([title,detail])=><div key={title} className="rounded-xl bg-slate-50 p-3"><h4 className="text-sm font-bold text-slate-800">{title}</h4><p className="mt-1 text-xs leading-5 text-slate-600">{detail}</p></div>)}
    </div>
    <div className="mt-4"><h4 className="text-sm font-bold text-slate-800">Primary data sources</h4><ul className="mt-2 grid gap-2 sm:grid-cols-2">{sources.map(source=><li key={source.title} className="rounded-lg border border-slate-100 p-3"><a className="text-sm font-semibold text-teal-800 underline" href={source.url} target="_blank" rel="noreferrer">{source.title}</a><p className="mt-1 text-xs leading-5 text-slate-500">{source.detail}</p></li>)}</ul></div>
    <p className="mt-3 text-xs leading-5 text-slate-500">Important: these are source links and interpretation prompts, not imported current readings. The quantitative signal does not add a macro score until dated, unit-consistent and revision-aware official observations can be retrieved reliably. No missing macro value is treated as zero, and these factors do not override the deterministic price/volume signal.</p>
  </section>;
}
