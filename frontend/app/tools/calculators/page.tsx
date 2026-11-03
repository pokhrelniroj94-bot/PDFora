import type { Metadata } from "next";
import { CategoryToolsPage } from "../../../components/AllTools";
export const metadata: Metadata = { title: "Free Online Calculators – Finance, Business & Math | PDFora", description: "Browse practical calculators for loans, salary, savings, percentages, dates, mathematics and business.", alternates: { canonical: "https://pd-fora.vercel.app/tools/calculators" } };
export default function CalculatorsPage(){ return <CategoryToolsPage category="Calculators" />; }
