import type { Metadata } from "next";
import NepseAlphaLab from "../../components/NepseAlphaLab";

export const metadata: Metadata = {
  title: "NEPSE Strategy Backtester & Quant Lab | PDFora",
  description: "Backtest NEPSE SMA, RSI and breakout strategies on historical daily prices. Include transaction cost assumptions and compare with buy-and-hold.",
  alternates: { canonical: "https://pd-fora.vercel.app/nepse-lab" },
};

export default function NepseLabPage() { return <NepseAlphaLab />; }
