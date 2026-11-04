export type Trade = {
  id: string;
  createdAt: number;
  date: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  fee: number;
};

export type Holding = { symbol: string; quantity: number; averageCost: number; invested: number };

export function isTrade(value: unknown): value is Trade {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Trade>;
  const validDate = typeof item.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
    Number.isFinite(new Date(item.date + "T00:00:00Z").getTime()) &&
    new Date(item.date + "T00:00:00Z").toISOString().slice(0, 10) === item.date;
  return typeof item.id === "string" && Number.isFinite(item.createdAt) && validDate &&
    typeof item.symbol === "string" && /^[A-Z0-9]{2,16}$/.test(item.symbol) &&
    (item.side === "buy" || item.side === "sell") && Number.isFinite(item.quantity) && Number(item.quantity) > 0 &&
    Number.isFinite(item.price) && Number(item.price) > 0 && Number.isFinite(item.fee) && Number(item.fee) >= 0;
}

export function calculatePortfolio(trades: Trade[]) {
  const accounts = new Map<string, { quantity: number; cost: number; realized: number }>();
  const ordered = [...trades].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
  const assertFinite = (account: { quantity: number; cost: number; realized: number }) => {
    if (!Number.isFinite(account.quantity) || !Number.isFinite(account.cost) || !Number.isFinite(account.realized)) {
      throw new Error("Transaction amounts exceed the supported calculation range.");
    }
  };
  for (const trade of ordered) {
    const account = accounts.get(trade.symbol) ?? { quantity: 0, cost: 0, realized: 0 };
    if (trade.side === "buy") {
      account.quantity += trade.quantity;
      account.cost += trade.quantity * trade.price + trade.fee;
    } else {
      if (trade.quantity > account.quantity + 1e-8) throw new Error(`Sale quantity exceeds recorded holdings for ${trade.symbol}.`);
      const averageCost = account.quantity ? account.cost / account.quantity : 0;
      account.realized += trade.quantity * trade.price - trade.fee - averageCost * trade.quantity;
      account.quantity = Math.max(0, account.quantity - trade.quantity);
      account.cost = account.quantity ? averageCost * account.quantity : 0;
    }
    assertFinite(account);
    accounts.set(trade.symbol, account);
  }
  const holdings = [...accounts.entries()].map(([symbol, account]): Holding => ({
    symbol,
    quantity: account.quantity,
    averageCost: account.quantity ? account.cost / account.quantity : 0,
    invested: account.cost,
  })).filter((holding) => holding.quantity > 1e-8);
  const realized = [...accounts.values()].reduce((sum, account) => sum + account.realized, 0);
  if (!Number.isFinite(realized)) throw new Error("Transaction amounts exceed the supported calculation range.");
  return { holdings, realized };
}

