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


export function findRegexMatches(source: string, pattern: string, flags = "g") {
  if (source.length > 10000) throw new Error("जाँच गर्ने पाठ बढीमा १०,००० अक्षरको हुनुपर्छ।");
  if (pattern.length > 256) throw new Error("Regular expression बढीमा २५६ अक्षरको हुनुपर्छ।");
  // Avoid common catastrophic-backtracking patterns in this synchronous browser tool.
  if (/\([^)]*[+*][^)]*\)[+*{]/.test(pattern) || /\([^)]*\|[^)]*\)[+*{]/.test(pattern)) {
    throw new Error("Nested वा repeated समूह भएको regex सुरक्षित रूपमा चलाउन सकिँदैन।");
  }
  const safeFlags = [...new Set((flags.replace(/[^dgimsuvy]/g, "") + "g").split(""))].join("");
  const matches = [...source.matchAll(new RegExp(pattern, safeFlags))];
  return matches.map((match, index) => ({ index: index + 1, value: match[0], offset: match.index ?? -1 }));
}

export function decodeJwt(token: string) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("JWT मा header, payload र signature गरी तीन भाग हुनुपर्छ।");
  const decode = (value: string) => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  };
  return { header: decode(parts[0]), payload: decode(parts[1]), signatureVerified: false };
}

export function minifyCss(source: string) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();
}

function parseHexLuminance(hex: string) {
  const clean = hex.trim().replace(/^#/, "");
  if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(clean)) throw new Error("रङ #RGB वा #RRGGBB ढाँचामा लेख्नुहोस्।");
  const full = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
  const channels = [0, 2, 4].map((index) => parseInt(full.slice(index, index + 2), 16) / 255);
  return channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

export function calculateContrast(foreground: string, background: string) {
  const first = parseHexLuminance(foreground);
  const second = parseHexLuminance(background);
  const ratio = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  return { ratio, aaNormal: ratio >= 4.5, aaLarge: ratio >= 3, aaaNormal: ratio >= 7 };
}

export function analyzeKeywordDensity(source: string, keyword: string) {
  const tokenize = (value: string) => value.toLocaleLowerCase().match(/[\p{L}\p{M}\p{N}_-]+/gu) ?? [];
  const words = tokenize(source);
  const needle = tokenize(keyword);
  if (!needle.length) return { totalWords: words.length, count: 0, density: 0 };
  let count = 0;
  for (let index = 0; index <= words.length - needle.length; index += 1) {
    if (needle.every((word, offset) => words[index + offset] === word)) count += 1;
  }
  const density = words.length ? (count * needle.length) / words.length * 100 : 0;
  return { totalWords: words.length, count, density };
}

export function buildSitemap(urls: string[]) {
  const normalized = urls.map((url) => url.trim()).filter(Boolean);
  if (!normalized.length) throw new Error("कम्तीमा एउटा URL प्रविष्ट गर्नुहोस्।");
  if (normalized.length > 50000) throw new Error("Sitemap मा बढीमा ५०,००० URL मात्र राख्न सकिन्छ।");
  const invalid = normalized.find((url) => {
    try { return !["http:", "https:"].includes(new URL(url).protocol); }
    catch { return true; }
  });
  if (invalid) throw new Error(`अमान्य URL: ${invalid}`);
  const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${normalized.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n")}\n</urlset>`;
}

export function buildRobotsTxt(sitemapUrl = "") {
  const sitemap = sitemapUrl.trim();
  if (sitemap) {
    if (/[\r\n]/.test(sitemap)) throw new Error("Sitemap URL मा नयाँ लाइन राख्न मिल्दैन।");
    let parsed: URL;
    try { parsed = new URL(sitemap); }
    catch { throw new Error("Sitemap URL मान्य छैन।"); }
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Sitemap URL मा HTTP वा HTTPS प्रयोग गर्नुहोस्।");
  }
  return `User-agent: *\nAllow: /\n${sitemap ? `Sitemap: ${sitemap}\n` : ""}`;
}
