import type { Metadata } from "next";
import NepseMarketDashboard from "../../components/NepseMarketDashboard";

export const metadata: Metadata = {
  title: "NEPSE Market Dashboard, Stock Prices & Charts",
  description: "Check NEPSE index and listed-share prices, periodic market snapshots, top gainers and losers, turnover, sector performance and historical charts. Data is delayed by the upstream public source.",
  keywords: ["NEPSE market dashboard", "NEPSE share prices", "Nepal stock market", "NEPSE index", "top gainers", "top losers", "sector indices", "stock price chart"],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://pd-fora.vercel.app/market" },
  openGraph: {
    type: "website",
    title: "NEPSE Market Dashboard & Stock Charts | PDFora",
    description: "NEPSE index, listed company prices, market movers, sector indices and historical charts.",
    url: "https://pd-fora.vercel.app/market",
    siteName: "PDFora",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora NEPSE market dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEPSE Market Dashboard & Stock Charts | PDFora",
    description: "NEPSE index, listed company prices, market movers, sector indices and historical charts.",
    images: ["/opengraph-image"],
  },
};

export default function MarketPage() {
  return <NepseMarketDashboard />;
}
