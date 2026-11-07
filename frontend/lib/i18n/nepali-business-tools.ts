export type NepaliBusinessToolSlug =
  | "profit-margin-calculator" | "markup-calculator" | "break-even-calculator"
  | "sales-tax-calculator" | "salary-breakdown-calculator" | "commission-calculator"
  | "hourly-to-salary-calculator";
type Values = Record<string, string>;
const number = (value: string | undefined) => value?.trim() ? Number(value) : NaN;
const fmt = (value: number) => Number.isFinite(value) ? value.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—";

export function runNepaliBusinessTool(slug: NepaliBusinessToolSlug, values: Values): string {
  if (slug === "profit-margin-calculator") {
    const revenue = number(values.revenue), cost = number(values.cost);
    if (![revenue, cost].every(Number.isFinite) || revenue <= 0 || cost < 0) return "बिक्री रकम सकारात्मक र लागत ० वा बढी हुनुपर्छ।";
    const profit = revenue - cost;
    return `कुल नाफा/घाटा: NPR ${fmt(profit)}\nनाफा मार्जिन: ${fmt(profit / revenue * 100)}%\nयो बिक्री रकमको आधारमा गणना गरिएको हो।`;
  }
  if (slug === "markup-calculator") {
    const cost = number(values.cost), markup = number(values.markup);
    if (![cost, markup].every(Number.isFinite) || cost <= 0 || markup < 0 || markup > 1000) return "लागत सकारात्मक र markup ०–१०००% बीच हुनुपर्छ।";
    const profit = cost * markup / 100, price = cost + profit;
    return `बिक्री मूल्य: NPR ${fmt(price)}\nनाफा रकम: NPR ${fmt(profit)}\nबिक्री मूल्यमा नाफा मार्जिन: ${fmt(profit / price * 100)}%`;
  }
  if (slug === "break-even-calculator") {
    const fixed = number(values.fixed), variable = number(values.variable), price = number(values.price);
    if (![fixed, variable, price].every(Number.isFinite) || fixed < 0 || variable < 0 || price <= variable) return "स्थिर लागत र प्रति एकाइ चल लागत ० वा बढी हुनुपर्छ; बिक्री मूल्य चल लागतभन्दा बढी हुनुपर्छ।";
    const units = fixed === 0 ? 0 : Math.ceil(fixed / (price - variable));
    return `प्रति एकाइ योगदान: NPR ${fmt(price - variable)}\nब्रेक-इभेन मात्रा: ${units.toLocaleString("en-US")} एकाइ\nत्यो मात्रामा बिक्री: NPR ${fmt(units * price)}\nयो स्थिर लागत र अनुमानित एकाइ लागत स्थिर रहने मान्यतामा आधारित छ।`;
  }
  if (slug === "sales-tax-calculator") {
    const price = number(values.price), rate = number(values.rate);
    if (![price, rate].every(Number.isFinite) || price < 0 || rate < 0 || rate > 100) return "मूल्य ० वा बढी र करदर ०–१००% बीच हुनुपर्छ।";
    const tax = price * rate / 100;
    return `कर रकम: NPR ${fmt(tax)}\nकरसहित कुल: NPR ${fmt(price + tax)}\nप्रयोग गरिएको करदर: ${fmt(rate)}%`;
  }
  if (slug === "salary-breakdown-calculator") {
    const gross = number(values.gross), tax = number(values.tax), provident = number(values.provident), other = number(values.other);
    if (![gross, tax, provident, other].every(Number.isFinite) || gross < 0 || tax < 0 || provident < 0 || other < 0 || tax + provident + other > gross) return "कुल तलब र कटौती ० वा बढी हुनुपर्छ; कटौती कुल तलबभन्दा बढी हुन मिल्दैन।";
    const deductions = tax + provident + other, net = gross - deductions;
    return `मासिक कुल तलब: NPR ${fmt(gross)}\nकुल कटौती: NPR ${fmt(deductions)}\nअनुमानित हातमा आउने तलब: NPR ${fmt(net)}\nकटौती प्रतिशत: ${gross > 0 ? fmt(deductions / gross * 100) : "0"}%\nयो प्रयोगकर्ताले दिएको कटौतीमा आधारित हिसाब हो; आयकर निर्धारण होइन।`;
  }
  if (slug === "commission-calculator") {
    const sales = number(values.sales), rate = number(values.rate);
    if (![sales, rate].every(Number.isFinite) || sales < 0 || rate < 0 || rate > 100) return "बिक्री रकम ० वा बढी र कमिसन दर ०–१००% बीच हुनुपर्छ।";
    return `कमिसन रकम: NPR ${fmt(sales * rate / 100)}\nबिक्री रकम: NPR ${fmt(sales)}\nकमिसन दर: ${fmt(rate)}%`;
  }
  if (slug === "hourly-to-salary-calculator") {
    const hourly = number(values.hourly), hours = number(values.hours), weeks = number(values.weeks);
    if (![hourly, hours, weeks].every(Number.isFinite) || hourly < 0 || hours < 0 || hours > 168 || weeks < 1 || weeks > 52) return "प्रति घण्टा दर र साप्ताहिक घण्टा ० वा बढी, घण्टा १६८ भन्दा बढी नहुने र हप्ता १–५२ हुनुपर्छ।";
    const annual = hourly * hours * weeks;
    return `साप्ताहिक अनुमान: NPR ${fmt(hourly * hours)}\nमासिक औसत: NPR ${fmt(annual / 12)}\nवार्षिक कुल: NPR ${fmt(annual)}\nकर, बिदा र अतिरिक्त सुविधा समावेश छैन।`;
  }
  return "";
}
