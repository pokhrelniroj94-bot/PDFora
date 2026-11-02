import type { Metadata } from "next";
import ToolCategoryPage from "../../../components/ToolCategoryPage";

export const metadata: Metadata = {
  title: "Free Online Calculators",
  description: "Browse free online finance, business, math, health and everyday calculators.",
  alternates: { canonical: "https://pd-fora.vercel.app/tools/calculators" },
};

export default function CalculatorsPage() {
  return <ToolCategoryPage category="calculators" />;
}
