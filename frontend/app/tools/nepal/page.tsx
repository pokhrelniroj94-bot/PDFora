import type { Metadata } from "next";
import ToolCategoryPage from "../../../components/ToolCategoryPage";

export const metadata: Metadata = {
  title: "Nepal Tools – Nepali Calendar, Panchang, Kundali & NEPSE",
  description: "Explore Nepal-focused utilities including Nepali dates, calendar, Panchang, Kundali, NEPSE and local calculators.",
  alternates: { canonical: "https://pd-fora.vercel.app/tools/nepal" },
};

export default function NepalToolsPage() {
  return <ToolCategoryPage category="nepal" />;
}
