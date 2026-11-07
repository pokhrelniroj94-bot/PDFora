export type QuantBar = { date: string; close: number; volume?: number };
export type QuantTrade = { buyDate: string; sellDate: string; buy: number; sell: number; returnPct: number; pnl: number; days: number };
export type QuantResult = { trades: QuantTrade[]; strategyReturn: number; benchmarkReturn: number; winRate: number; maxDrawdown: number; profitFactor: number; exposure: number; equity: number[] };
export function rsi(values: number[], index: number, period?: number): number | null;
export function normalizeDailyBars(input: unknown[]): QuantBar[];
export function detectLargePriceGaps(rows: QuantBar[], thresholdPct?: number): { date: string; changePct: number }[];
export function runBacktest(rows: QuantBar[], mode: string, costPct: number): QuantResult;
