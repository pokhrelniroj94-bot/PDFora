/**
 * Pure calculations shared by the Nepali remaining-tools workspace.
 * Kept as a leaf module so Node can test the financial arithmetic without a browser.
 */

export function calculateSavings(target: number, current: number, months: number, annualRate: number) {
  if (![target, current, months, annualRate].every(Number.isFinite) || target <= 0 || current < 0 || months <= 0 || annualRate < 0) {
    throw new Error("लक्ष्य, हालको बचत, अवधि र ब्याजदरका मान जाँच गर्नुहोस्।");
  }
  const remaining = Math.max(0, target - current);
  const monthlyRate = annualRate / 1200;
  const factor = monthlyRate === 0 ? months : (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  return { remaining, monthlyDeposit: remaining === 0 ? 0 : remaining / factor };
}

export function calculateShare(quantity: number, buyPrice: number, sellPrice: number, feeRate: number, taxRate: number, dpFee: number) {
  if (![quantity, buyPrice, sellPrice, feeRate, taxRate, dpFee].every(Number.isFinite) || quantity <= 0 || buyPrice < 0 || sellPrice < 0 || feeRate < 0 || taxRate < 0 || dpFee < 0) {
    throw new Error("सबै मान शून्य वा सकारात्मक र सही हुनुपर्छ।");
  }
  const buyValue = quantity * buyPrice;
  const sellValue = quantity * sellPrice;
  const gross = sellValue - buyValue;
  const fees = (buyValue + sellValue) * feeRate / 100;
  const taxableProfit = Math.max(0, gross - fees);
  const tax = taxableProfit * taxRate / 100;
  return { buyValue, sellValue, gross, fees, tax, net: gross - fees - tax - dpFee };
}
