import type { Metadata } from "next";
import { CategoryToolsPage } from "../../../components/AllTools";
export const metadata: Metadata = { title: "Nepal Tools – Nepali Calendar, Date Converter & NEPSE | PDFora", description: "Use Nepal-specific tools including Nepali calendar, BS to AD converter, public holidays, Nepali typing, NEPSE news and finance utilities.", alternates: { canonical: "https://pd-fora.vercel.app/tools/nepal" } };
export default function NepalToolsPage(){ return <CategoryToolsPage category="Nepal" />; }
