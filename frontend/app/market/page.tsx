import type { Metadata } from "next";
import NepseMarketDashboard from "../../components/NepseMarketDashboard";

export const metadata: Metadata = {
  title: "NEPSE Market Dashboard, Stock Prices & Charts | PDFora",
  description: "Explore periodic NEPSE market snapshots, index and stock price charts, top gainers and losers, turnover, sector indices and historical daily data.",
  alternates: { canonical: "https://pd-fora.vercel.app/market" },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "NEPSE Market Dashboard & Stock Charts | PDFora",
    description: "NEPSE index, listed company prices, market movers, sector indices and historical charts.",
    url: "https://pd-fora.vercel.app/market",
    siteName: "PDFora",
  },
};

export default function MarketPage() {
  return <NepseMarketDashboard />;
}
