export type DirectionalSignal =
  | "Potential BUY setup"
  | "HOLD / WATCH"
  | "Potential SELL / EXIT setup"
  | "Potential SELL / SHORT setup"
  | "Wait / neutral";

export const MAX_NEPSE_HISTORY_AGE_DAYS: number;

export function guardNepseSignalFreshness(
  signal: DirectionalSignal,
  latestDate: string | null | undefined,
  now?: Date,
): { signal: DirectionalSignal; stale: boolean; reason?: string };

