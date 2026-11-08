export type MarketBreadthQuote = {
  percent_change: number;
  turnover?: number;
};

export type MarketBreadthSummary = {
  total: number;
  advancing: number;
  declining: number;
  unchanged: number;
  turnover: number;
  advancingPercent: number;
  decliningPercent: number;
  unchangedPercent: number;
};

/**
 * Summarize only securities with a finite percentage change.
 * Missing/invalid turnover is excluded from the turnover sum.
 * This is a quote-snapshot summary, not a claim of complete exchange breadth.
 */
export function summarizeMarketBreadth(rows: readonly MarketBreadthQuote[]): MarketBreadthSummary {
  const valid = rows.filter((row) => Number.isFinite(row.percent_change));
  const total = valid.length;
  const advancing = valid.filter((row) => row.percent_change > 0).length;
  const declining = valid.filter((row) => row.percent_change < 0).length;
  const unchanged = valid.filter((row) => row.percent_change === 0).length;
  const turnover = valid.reduce((sum, row) => sum + (
    typeof row.turnover === "number" && Number.isFinite(row.turnover) && row.turnover > 0
      ? row.turnover
      : 0
  ), 0);
  const percent = (count: number) => total ? count / total * 100 : 0;

  return {
    total,
    advancing,
    declining,
    unchanged,
    turnover,
    advancingPercent: percent(advancing),
    decliningPercent: percent(declining),
    unchangedPercent: percent(unchanged),
  };
}
