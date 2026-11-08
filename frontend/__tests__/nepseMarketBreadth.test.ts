import { summarizeMarketBreadth } from "../lib/nepse-market-breadth";

describe("summarizeMarketBreadth", () => {
  it("counts advancing, declining and unchanged securities separately", () => {
    expect(summarizeMarketBreadth([
      { percent_change: 2.5, turnover: 1000 },
      { percent_change: -1.25, turnover: 500 },
      { percent_change: 0, turnover: 250 },
      { percent_change: 0.5, turnover: 750 },
    ])).toEqual({
      total: 4,
      advancing: 2,
      declining: 1,
      unchanged: 1,
      turnover: 2500,
      advancingPercent: 50,
      decliningPercent: 25,
      unchangedPercent: 25,
    });
  });

  it("excludes invalid percentage changes and invalid or negative turnover", () => {
    const result = summarizeMarketBreadth([
      { percent_change: Number.NaN, turnover: 100 },
      { percent_change: 1, turnover: Number.NaN },
      { percent_change: -1, turnover: -50 },
      { percent_change: 0, turnover: 200 },
    ]);
    expect(result).toEqual({
      total: 3,
      advancing: 1,
      declining: 1,
      unchanged: 1,
      turnover: 200,
      advancingPercent: 100 / 3,
      decliningPercent: 100 / 3,
      unchangedPercent: 100 / 3,
    });
  });

  it("returns zero-safe percentages for an empty or invalid snapshot", () => {
    expect(summarizeMarketBreadth([{ percent_change: Number.NaN }])).toEqual({
      total: 0,
      advancing: 0,
      declining: 0,
      unchanged: 0,
      turnover: 0,
      advancingPercent: 0,
      decliningPercent: 0,
      unchangedPercent: 0,
    });
  });
});
