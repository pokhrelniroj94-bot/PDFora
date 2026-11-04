import type { Metadata } from "next";
import ResumeBuilder from "../../components/ResumeBuilder";

export const metadata: Metadata = {
  title: "Free Resume Builder – CV Templates & PDF Download",
  description: "Create a professional resume online with six CV templates, live A4 preview, editable sections, custom colours and free PDF export. No signup required.",
  alternates: { canonical: "https://pd-fora.vercel.app/resume-builder" },
  openGraph: { title: "Free Resume Builder – Professional CV Templates | PDFora", description: "Build a polished CV with live preview and free PDF export.", url: "https://pd-fora.vercel.app/resume-builder", siteName: "PDFora", type: "website" },
};
export default function Page() { return <ResumeBuilder />; }
