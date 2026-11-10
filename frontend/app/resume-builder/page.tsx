import type { Metadata } from "next";
import { hreflangMap } from "../../lib/i18n/routing";
import ResumeBuilder from "../../components/ResumeBuilder";

const localizedAlternates = hreflangMap("/resume-builder");

export const metadata: Metadata = {
  title: "Free Resume Builder & CV Templates | PDFora",
  description: "Build a CV with 20 templates, live A4 preview, editable sections and free PDF export. No signup required.",
  alternates: { canonical: "https://pd-fora.vercel.app/resume-builder", ...(localizedAlternates ? { languages: localizedAlternates } : {}) },
  keywords: ["free resume builder", "CV maker", "resume templates", "professional CV", "download resume PDF", "ATS friendly resume", "Europass CV"],
  openGraph: { title: "Free Resume Builder – Professional CV Templates | PDFora", description: "Build a polished CV with live preview and free PDF export.", url: "https://pd-fora.vercel.app/resume-builder", siteName: "PDFora", type: "website" },
};
export default function Page() { return <ResumeBuilder />; }
