import { Noto_Sans_Devanagari } from "next/font/google";

/** Import this only from the Nepali route layout, not the global English layout. */
export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-noto-sans-devanagari",
  // Prevent preloading on every English page. Preload only the used regular weight
  // from the Nepali layout after confirming it is the above-the-fold body font.
  preload: true,
});
