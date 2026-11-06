import { Noto_Sans_Devanagari } from "next/font/google";

/** Import this only from the Nepali route layout, not the global English layout. */
export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-noto-sans-devanagari",
  // This module is imported only by app/ne/layout.tsx, so only Nepali pages preload these two weights.
  preload: true,
});
