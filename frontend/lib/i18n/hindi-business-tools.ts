export type HindiBusinessToolSlug =
  | "profit-margin-calculator" | "markup-calculator" | "break-even-calculator"
  | "sales-tax-calculator" | "salary-breakdown-calculator" | "commission-calculator"
  | "hourly-to-salary-calculator";

export const hindiBusinessToolSlugs: readonly HindiBusinessToolSlug[] = [
  "profit-margin-calculator", "markup-calculator", "break-even-calculator",
  "sales-tax-calculator", "salary-breakdown-calculator", "commission-calculator",
  "hourly-to-salary-calculator",
];

type Values = Record<string, string>;
const number = (value: string | undefined) => (value?.trim() ? Number(value) : NaN);
const fmt = (value: number) => (Number.isFinite(value) ? value.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "—");

/** Hindi runner for the business calculators. Same formulas as the Nepali and English versions; amounts are NPR. */
export function runHindiBusinessTool(slug: HindiBusinessToolSlug, values: Values): string {
  if (slug === "profit-margin-calculator") {
    const revenue = number(values.revenue), cost = number(values.cost);
    if (![revenue, cost].every(Number.isFinite) || revenue <= 0 || cost < 0) return "बिक्री राशि धनात्मक और लागत 0 या अधिक होनी चाहिए।";
    const profit = revenue - cost;
    return `कुल लाभ/हानि: NPR ${fmt(profit)}\nलाभ मार्जिन: ${fmt(profit / revenue * 100)}%\nयह गणना बिक्री राशि के आधार पर की गई है।`;
  }
  if (slug === "markup-calculator") {
    const cost = number(values.cost), markup = number(values.markup);
    if (![cost, markup].every(Number.isFinite) || cost <= 0 || markup < 0 || markup > 1000) return "लागत धनात्मक और मार्कअप 0–1000% के बीच होना चाहिए।";
    const profit = cost * markup / 100, price = cost + profit;
    return `बिक्री मूल्य: NPR ${fmt(price)}\nलाभ राशि: NPR ${fmt(profit)}\nबिक्री मूल्य पर लाभ मार्जिन: ${fmt(profit / price * 100)}%`;
  }
  if (slug === "break-even-calculator") {
    const fixed = number(values.fixed), variable = number(values.variable), price = number(values.price);
    if (![fixed, variable, price].every(Number.isFinite) || fixed < 0 || variable < 0 || price <= variable) return "स्थिर लागत और प्रति इकाई परिवर्ती लागत 0 या अधिक होनी चाहिए; बिक्री मूल्य परिवर्ती लागत से अधिक होना चाहिए।";
    const units = fixed === 0 ? 0 : Math.ceil(fixed / (price - variable));
    return `प्रति इकाई योगदान: NPR ${fmt(price - variable)}\nब्रेक-ईवन मात्रा: ${units.toLocaleString("en-IN")} इकाई\nउस मात्रा पर बिक्री: NPR ${fmt(units * price)}\nयह मानकर चला गया है कि स्थिर लागत और प्रति इकाई लागत नहीं बदलेगी।`;
  }
  if (slug === "sales-tax-calculator") {
    const price = number(values.price), rate = number(values.rate);
    if (![price, rate].every(Number.isFinite) || price < 0 || rate < 0 || rate > 100) return "मूल्य 0 या अधिक और कर दर 0–100% के बीच होनी चाहिए।";
    const tax = price * rate / 100;
    return `कर की राशि: NPR ${fmt(tax)}\nकर सहित कुल: NPR ${fmt(price + tax)}\nप्रयुक्त कर दर: ${fmt(rate)}%`;
  }
  if (slug === "salary-breakdown-calculator") {
    const gross = number(values.gross), tax = number(values.tax), provident = number(values.provident), other = number(values.other);
    if (![gross, tax, provident, other].every(Number.isFinite) || gross < 0 || tax < 0 || provident < 0 || other < 0 || tax + provident + other > gross) return "कुल वेतन और कटौतियाँ 0 या अधिक होनी चाहिए; कटौती कुल वेतन से अधिक नहीं हो सकती।";
    const deductions = tax + provident + other, net = gross - deductions;
    return `मासिक कुल वेतन: NPR ${fmt(gross)}\nकुल कटौती: NPR ${fmt(deductions)}\nअनुमानित हाथ में आने वाला वेतन: NPR ${fmt(net)}\nकटौती प्रतिशत: ${gross > 0 ? fmt(deductions / gross * 100) : "0"}%\nयह आपके दिए गए कटौती मानों पर आधारित हिसाब है; आयकर का निर्धारण नहीं।`;
  }
  if (slug === "commission-calculator") {
    const sales = number(values.sales), rate = number(values.rate);
    if (![sales, rate].every(Number.isFinite) || sales < 0 || rate < 0 || rate > 100) return "बिक्री राशि 0 या अधिक और कमीशन दर 0–100% के बीच होनी चाहिए।";
    return `कमीशन राशि: NPR ${fmt(sales * rate / 100)}\nबिक्री राशि: NPR ${fmt(sales)}\nकमीशन दर: ${fmt(rate)}%`;
  }
  if (slug === "hourly-to-salary-calculator") {
    const hourly = number(values.hourly), hours = number(values.hours), weeks = number(values.weeks);
    if (![hourly, hours, weeks].every(Number.isFinite) || hourly < 0 || hours < 0 || hours > 168 || weeks < 1 || weeks > 52) return "प्रति घंटा दर और साप्ताहिक घंटे 0 या अधिक हों, घंटे 168 से अधिक न हों और सप्ताह 1–52 के बीच हों।";
    const annual = hourly * hours * weeks;
    return `साप्ताहिक अनुमान: NPR ${fmt(hourly * hours)}\nमासिक औसत: NPR ${fmt(annual / 12)}\nवार्षिक कुल: NPR ${fmt(annual)}\nकर, छुट्टी और अतिरिक्त सुविधाएँ शामिल नहीं हैं।`;
  }
  return "";
}

/** Titles and field labels live here (not in the "use client" component) so the server route can read them. */
export const hindiBusinessConfigs: Record<HindiBusinessToolSlug, { title: string; description: string; fields: Array<[string, string]> }> = {
  "profit-margin-calculator": { title: "लाभ मार्जिन कैलकुलेटर", description: "बिक्री राशि और लागत से लाभ या हानि तथा बिक्री पर आधारित मार्जिन निकालें।", fields: [["revenue", "बिक्री राशि (NPR)"], ["cost", "कुल लागत (NPR)"]] },
  "markup-calculator": { title: "मार्कअप कैलकुलेटर", description: "लागत पर मार्कअप प्रतिशत जोड़कर बिक्री मूल्य और मार्जिन निकालें।", fields: [["cost", "लागत (NPR)"], ["markup", "लागत पर जोड़ा जाने वाला प्रतिशत (%)"]] },
  "break-even-calculator": { title: "ब्रेक-ईवन कैलकुलेटर", description: "स्थिर लागत, प्रति इकाई परिवर्ती लागत और बिक्री मूल्य से लागत निकलने की मात्रा जानें।", fields: [["fixed", "कुल स्थिर लागत (NPR)"], ["variable", "प्रति इकाई परिवर्ती लागत (NPR)"], ["price", "प्रति इकाई बिक्री मूल्य (NPR)"]] },
  "sales-tax-calculator": { title: "बिक्री कर कैलकुलेटर", description: "आपके दिए कर दर से कर की राशि और कर सहित मूल्य निकालें।", fields: [["price", "कर से पहले का मूल्य (NPR)"], ["rate", "कर दर (%)"]] },
  "salary-breakdown-calculator": { title: "वेतन विवरण कैलकुलेटर", description: "मासिक कुल वेतन से आपके दिए कर, भविष्य निधि और अन्य कटौतियाँ घटाएँ।", fields: [["gross", "मासिक कुल वेतन (NPR)"], ["tax", "कर कटौती (NPR)"], ["provident", "भविष्य निधि कटौती (NPR)"], ["other", "अन्य कटौती (NPR)"]] },
  "commission-calculator": { title: "कमीशन कैलकुलेटर", description: "बिक्री राशि और कमीशन प्रतिशत से कमीशन की राशि निकालें।", fields: [["sales", "बिक्री राशि (NPR)"], ["rate", "कमीशन दर (%)"]] },
  "hourly-to-salary-calculator": { title: "प्रति घंटा दर से वेतन कैलकुलेटर", description: "प्रति घंटा दर, साप्ताहिक कार्य-घंटे और वर्ष के कार्य-सप्ताह से साप्ताहिक, मासिक और वार्षिक आय का अनुमान लगाएँ।", fields: [["hourly", "प्रति घंटा दर (NPR)"], ["hours", "साप्ताहिक कार्य-घंटे"], ["weeks", "वर्ष में कार्य-सप्ताह"]] },
};
