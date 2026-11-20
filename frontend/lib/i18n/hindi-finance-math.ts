/** Pure arithmetic behind the Hindi finance workspace, kept out of the client component so it can be unit-tested. */

/** Future value with a starting amount and a deposit at the end of every month (ordinary annuity). */
export function hindiSipFutureValue(monthly: number, years: number, annualRate: number, initial: number): number {
  const periods = years * 12;
  const monthlyRate = annualRate / 1200;
  let futureValue = initial * (1 + monthlyRate) ** periods;
  for (let index = 1; index <= periods; index += 1) futureValue += monthly * (1 + monthlyRate) ** (periods - index);
  return futureValue;
}

/** Monthly deposit needed to reach `goal` from `current` in `months`, with deposits at month end. */
export function hindiSavingsGoalDeposit(goal: number, current: number, months: number, yearlyRate: number): { remaining: number; deposit: number } {
  const remaining = Math.max(0, goal - current);
  const monthlyRate = yearlyRate / 1200;
  const factor = monthlyRate === 0 ? months : (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  return { remaining, deposit: remaining === 0 ? 0 : remaining / factor };
}
