import type { Metadata } from "next";
import NepseAlphaLab from "../../components/NepseAlphaLab";

export const metadata: Metadata = {
  title: "NEPSE Strategy Backtester & Quant Lab | PDFora",
  description: "Backtest NEPSE SMA, RSI and breakout strategies on historical daily prices. Include transaction cost assumptions and compare with buy-and-hold.",
  alternates: { canonical: "https://pd-fora.vercel.app/nepse-lab" },
};

export default function NepseLabPage() {
  return (
    <>
      <NepseAlphaLab />
      <main className="bg-slate-50 px-4 pb-14 sm:px-6">
        <article className="mx-auto max-w-4xl space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">What does the NEPSE Strategy Backtester do?</h2>
            <p className="mt-4 leading-8 text-slate-700">
              The backtester replays a rule-based trading strategy against available historical daily closing prices for a selected NEPSE-listed company. It shows the trades that the selected rules would have triggered, estimates the effect of transaction costs and compares the strategy with a simple buy-and-hold result over the same available price series. It is a research tool for exploring historical behaviour, not a prediction of future prices.
            </p>
            <p className="mt-3 leading-8 text-slate-700">
              The tool requests one year of historical data and requires at least 80 valid daily observations. The available date range and data source are displayed with the results so you can check what period was actually tested.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">Strategies available in the backtester</h2>
            <div className="mt-5 space-y-5">
              <div>
                <h3 className="font-bold text-slate-950">SMA 20/50 crossover</h3>
                <p className="mt-2 leading-7 text-slate-700">
                  A buy signal occurs when the 20-observation simple moving average crosses above the 50-observation average. A sell signal occurs when the shorter average crosses below the longer average. Moving averages smooth recent closing prices, but they can react late when a market moves quickly or trades sideways.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-950">RSI 14 recovery</h3>
                <p className="mt-2 leading-7 text-slate-700">
                  The strategy looks for the 14-observation Relative Strength Index to recover from below 30 to 30 or higher. It exits when RSI reaches 70 or higher. RSI is a momentum measure; an oversold or overbought reading does not by itself mean that a price must reverse.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-950">20-day breakout</h3>
                <p className="mt-2 leading-7 text-slate-700">
                  A buy signal is generated when the previous completed daily close rises above the highest close in the preceding 20 observations and is higher than the close before it. The strategy exits when the signal close falls below its 20-observation moving average. A breakout can fail, especially when liquidity is low or prices gap.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">How signals, trade prices and costs are handled</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 leading-8 text-slate-700">
              <li>Historical daily closing prices are sorted by date and invalid or non-positive closing values are ignored.</li>
              <li>The signal is evaluated using a completed earlier daily observation, rather than using a future price to trigger a past trade.</li>
              <li>When a signal is acted on, the simulated entry or exit uses the next available daily closing price in the loaded series.</li>
              <li>The estimated cost per side is applied to both entry and exit. Adjust it to represent your own assumed brokerage, SEBON fee, DP charge and slippage; the default is not a verified broker tariff.</li>
              <li>Results are calculated from the loaded price series and the selected strategy. Changing the symbol, strategy or cost assumption can materially change the output.</li>
            </ol>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">How to interpret the backtest metrics</h2>
            <dl className="mt-4 space-y-4 leading-7 text-slate-700">
              <div><dt className="font-bold text-slate-950">Strategy return</dt><dd>The percentage change in the simulated strategy equity after the modelled entry and exit costs.</dd></div>
              <div><dt className="font-bold text-slate-950">Buy-and-hold return</dt><dd>The percentage change from the first benchmark close used by the backtest to the last available close in the selected period.</dd></div>
              <div><dt className="font-bold text-slate-950">Win rate</dt><dd>The share of closed trades with a positive simulated return. It does not show how large the winning or losing trades were.</dd></div>
              <div><dt className="font-bold text-slate-950">Maximum drawdown</dt><dd>The largest peak-to-trough percentage decline in the simulated equity series.</dd></div>
              <div><dt className="font-bold text-slate-950">Profit factor</dt><dd>Gross positive trade returns divided by the absolute value of gross negative trade returns. A high value from a small number of trades should be interpreted cautiously.</dd></div>
              <div><dt className="font-bold text-slate-950">Market exposure</dt><dd>The share of observed sessions for which the simulated strategy held a position.</dd></div>
            </dl>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">Important limitations before using results</h2>
            <p className="mt-4 leading-8 text-slate-800">
              This is a simplified educational backtest on available daily close data. It does not model intraday execution, circuit limits, partial fills, liquidity, corporate-action adjustments, every tax situation or survivorship bias. The cost input is an estimate, not a live fee quote. Missing, stale or incorrectly adjusted historical prices can change the result; verify the displayed data range and compare important observations with a trusted source.
            </p>
            <p className="mt-3 leading-8 text-slate-800">
              Historical performance is not evidence that a strategy will work in a different market period. Do not use a backtest alone to decide whether to buy or sell a security. Consider risk, diversification, liquidity and your own financial circumstances.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black text-slate-950">Frequently asked questions</h2>
            <div className="mt-5 space-y-5">
              <div><h3 className="font-bold text-slate-950">Does the backtester predict tomorrow&apos;s NEPSE price?</h3><p className="mt-2 leading-7 text-slate-700">No. It evaluates historical rules on past daily closing prices and does not forecast future prices.</p></div>
              <div><h3 className="font-bold text-slate-950">Why does a symbol sometimes fail to load?</h3><p className="mt-2 leading-7 text-slate-700">The selected symbol must return at least 80 valid daily observations for the requested period. Missing or incomplete history can prevent a test.</p></div>
              <div><h3 className="font-bold text-slate-950">Are transaction costs exact?</h3><p className="mt-2 leading-7 text-slate-700">No. The cost per side is an editable estimate. Enter assumptions that reflect your expected charges and slippage, then verify actual costs with your broker.</p></div>
              <div><h3 className="font-bold text-slate-950">Does a better historical return guarantee future profit?</h3><p className="mt-2 leading-7 text-slate-700">No. Market conditions, liquidity, execution, data quality and company events can change. Past backtest results do not guarantee future performance.</p></div>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
