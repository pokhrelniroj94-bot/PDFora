import type { Metadata } from "next";
import NepseAlphaLab from "../../components/NepseAlphaLab";

export const metadata: Metadata = {
  title: "NEPSE Strategy Backtester & Quant Lab",
  description: "Backtest NEPSE SMA, RSI and breakout strategies on historical daily prices. Include transaction cost assumptions and compare with buy-and-hold.",
  alternates: { canonical: "https://pd-fora.vercel.app/nepse-lab" },
  openGraph: {
    type: "website",
    url: "https://pd-fora.vercel.app/nepse-lab",
    siteName: "PDFora",
    title: "NEPSE Strategy Backtester & Quant Lab | PDFora",
    description: "Backtest NEPSE SMA, RSI and breakout strategies on historical daily prices with transaction-cost assumptions.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora NEPSE strategy backtester" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEPSE Strategy Backtester & Quant Lab | PDFora",
    description: "Test NEPSE strategies against historical prices and compare them with buy-and-hold.",
    images: ["/opengraph-image"],
  },
};

export default function NepseLabPage() { return <NepseAlphaLab />; }
