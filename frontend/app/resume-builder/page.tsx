import type { Metadata } from "next";
import ResumeBuilder from "../../components/ResumeBuilder";

export const metadata: Metadata = {
  title: "Free Resume Builder – Professional CV Templates & PDF Download | PDFora",
  description: "Create a professional resume online with 20 professional CV templates, live A4 preview, editable sections, custom colours and free PDF export. No signup required.",
  alternates: { canonical: "https://pd-fora.vercel.app/resume-builder" },
  keywords: ["free resume builder", "CV maker", "resume templates", "professional CV", "download resume PDF", "ATS friendly resume", "Europass CV"],
  openGraph: { title: "Free Resume Builder – Professional CV Templates | PDFora", description: "Build a polished CV with live preview and free PDF export.", url: "https://pd-fora.vercel.app/resume-builder", siteName: "PDFora", type: "website" },
};
export default function Page() { return <ResumeBuilder />; }
