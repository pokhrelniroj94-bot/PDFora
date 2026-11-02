import type { Metadata } from "next";
import NepseMarketDashboard from "../../components/NepseMarketDashboard";
import { SITE_NAME, SITE_URL } from "../../lib/site-config";

export const metadata: Metadata = {
  title: "NEPSE Market Dashboard, Stock Prices & Charts",
  description: "Check NEPSE index and listed-share prices, periodic market snapshots, top gainers and losers, turnover, sector performance and historical charts. Data is delayed by the upstream public source.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/market` },
  openGraph: {
    type: "website",
    title: `NEPSE Market Dashboard & Stock Charts | ${SITE_NAME}`,
    description: "NEPSE index, listed company prices, market movers, sector indices and historical charts.",
    url: "https://pd-fora.vercel.app/market",
    siteName: SITE_NAME,
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
