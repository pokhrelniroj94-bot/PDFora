import type { Metadata } from "next";
import { hreflangMap } from "../../lib/i18n/routing";
import ResumeBuilder from "../../components/ResumeBuilder";

const localizedAlternates = hreflangMap("/resume-builder");

export const metadata: Metadata = {
  title: "Free Resume Builder – Professional CV Templates & PDF Download",
  description: "Create a professional resume online with 20 professional CV templates, live A4 preview, editable sections, custom colours and free PDF export. No signup required.",
  alternates: { canonical: "https://pd-fora.vercel.app/resume-builder", ...(localizedAlternates ? { languages: localizedAlternates } : {}) },
  openGraph: { title: "Free Resume Builder – Professional CV Templates | PDFora", description: "Build a polished CV with live preview and free PDF export.", url: "https://pd-fora.vercel.app/resume-builder", siteName: "PDFora", type: "website" },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume Builder – Professional CV Templates | PDFora",
    description: "Build a polished CV with 20 templates, live A4 preview and free PDF export.",
    images: ["/opengraph-image"],
  },
};
export default function Page() { return <ResumeBuilder />; }
