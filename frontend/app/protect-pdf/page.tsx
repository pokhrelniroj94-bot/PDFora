import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Protect PDF Online",
  description: "Encrypt your PDF with a password. Use at least 6 characters.",
  alternates: { canonical: "https://pd-fora.vercel.app/protect-pdf" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Protect PDF</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Encrypt your PDF with a password. Use at least 6 characters.</p><div className="mt-8"><Niroj77Tool endpoint="/api/protect" title="Protect PDF" description="Encrypt your PDF with a password. Use at least 6 characters." downloadName="PDFora-protect-pdf.pdf" formField="password" formPlaceholder="Password (minimum 6 characters)"  /></div></div></main>;
}
