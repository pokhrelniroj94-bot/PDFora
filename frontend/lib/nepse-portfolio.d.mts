export interface FeeBand { upTo: number; rate: number }
export interface FeeConfig {
  brokerBands: readonly FeeBand[];
  brokerMinimum: number;
  sebonRate: number;
  dpCharge: number;
  capitalGainsShortRate: number;
  capitalGainsLongRate: number;
  longTermDays: number;
}
export const DEFAULT_FEE_CONFIG: Readonly<FeeConfig>;
export interface Lot { quantity: number; price: number; date?: string }
export interface Holding { symbol: string; lots: Lot[] }
export interface QuoteInput { price: number; asOf?: string; status?: string }
export interface PortfolioRow {
  symbol: string | null; valid: boolean; reason?: string;
  quantity?: number; averagePrice?: number; invested?: number; buyCharges?: number;
  priceStatus?: string | null; priceAsOf?: string | null; price?: number | null;
  marketValue?: number | null; estimatedSellCharges?: number | null; estimatedCapitalGainsTax?: number | null;
  estimatedNetValue?: number | null; unrealizedProfit?: number | null; returnPct?: number | null;
}
export interface PortfolioSummary {
  rows: PortfolioRow[]; complete: boolean; pricedCount: number; holdingCount: number;
  totalInvestedPricedHoldings: number | null; totalMarketValue: number | null;
  totalUnrealizedProfit: number | null; totalReturnPct: number | null; isEstimate: true;
}
export function transactionCharges(amount: number, fees?: Partial<FeeConfig>): { broker: number; sebon: number; dp: number; total: number } | null;
export function bollingerBands(values: number[], period?: number, multiplier?: number): ({ middle: number; upper: number; lower: number; bandwidth: number | null } | null)[] | null;
export function fiftyTwoWeekRange(bars: { date: string; close: number; high?: number; low?: number }[], options?: { minBars?: number }):
  { available: false; reason: string; barsUsed: number } | { available: true; high: number; low: number; basis: string; barsUsed: number; from: string; to: string };
export function riskReward(input: { entry: number; stop: number; target: number }):
  { valid: false; reason: string } | { valid: true; riskPerShare: number; rewardPerShare: number; ratio: number; breakEvenWinRatePct: number };
export function positionSize(input: { capital: number; riskPct: number; entry: number; stop: number }):
  { valid: false; reason: string } | { valid: true; shares: number; cappedByCapital: boolean; positionValue: number; plannedRiskAmount: number; riskAtStop: number };
export function averageCost(lots: Lot[], fees?: Partial<FeeConfig>): { quantity: number; invested: number; buyCharges: number; averagePrice: number; averageCostWithCharges: number } | null;
export function portfolioSummary(holdings: Holding[], prices: Record<string, QuoteInput>, options?: { fees?: Partial<FeeConfig>; asOf?: string }): PortfolioSummary;
export function concentrationRisk(rows: PortfolioRow[], options?: { maxWeightPct?: number }):
  { available: false; reason: string } | { available: true; weights: { symbol: string | null; weightPct: number }[]; hhi: number; effectivePositions: number; largest: { symbol: string | null; weightPct: number }; warnings: (string | null)[] };
export function maxDrawdownPct(closes: number[]): number | null;
