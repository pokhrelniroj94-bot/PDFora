import type { ReactNode } from "react";
import { notoSansDevanagari } from "../../lib/fonts/nepali";

/** Route-scoped font loading: English routes do not download Devanagari font assets. */
export default function NepaliLayout({ children }: { children: ReactNode }) {
  return <div lang="ne" className={notoSansDevanagari.className}>{children}</div>;
}
