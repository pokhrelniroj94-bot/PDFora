import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Sign PDF Online | Niroj77",
  description: "Add a visible typed signature to the final page. This is not a certificate-based digital signature.",
  alternates: { canonical: "https://pd-fora.vercel.app/sign-pdf" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Sign PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Add a visible typed signature to the final page. This is not a certificate-based digital signature.</p><div className="mt-8"><Niroj77Tool endpoint="/api/sign" title="Sign PDF" description="Add a visible typed signature to the final page. This is not a certificate-based digital signature." downloadName="Niroj77-sign-pdf.pdf" formField="signature_text" formPlaceholder="Name to display as signature"  /></div></div></main>;
}
