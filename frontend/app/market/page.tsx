import type { Metadata } from "next";
import { hreflangMap } from "../../lib/i18n/routing";
import NepseMarketDashboard from "../../components/NepseMarketDashboard";

const localizedAlternates = hreflangMap("/market");

export const metadata: Metadata = {
  title: "NEPSE Market Dashboard, Stock Prices & Charts | PDFora",
  description: "Explore periodic NEPSE market snapshots, index and stock price charts, top gainers and losers, turnover, sector indices and historical daily data.",
  alternates: { canonical: "https://pd-fora.vercel.app/market", ...(localizedAlternates ? { languages: localizedAlternates } : {}) },
  openGraph: {
    type: "website",
    title: "NEPSE Market Dashboard & Stock Charts | PDFora",
    description: "NEPSE index, listed company prices, market movers, sector indices and historical charts.",
    url: "https://pd-fora.vercel.app/market",
    siteName: "PDFora",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEPSE Market Dashboard & Stock Charts | PDFora",
    description: "Explore NEPSE index, listed company prices, market movers, sector indices and historical charts.",
    images: ["/opengraph-image"],
  },
};

export default function MarketPage() {
  return <NepseMarketDashboard />;
}
