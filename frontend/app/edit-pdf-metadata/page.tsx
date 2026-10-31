import type { Metadata } from "next";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata: Metadata = {
  title: "Edit PDF Metadata Online | Niroj77",
  description: "Update document title, author, subject and keywords.",
  alternates: { canonical: "https://pd-fora.vercel.app/edit-pdf-metadata" },
};

export default function Page() {
  return <main className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Edit PDF Metadata</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Update document title, author, subject and keywords.</p><div className="mt-8"><Niroj77Tool endpoint="/api/metadata" title="Edit PDF Metadata" description="Update document title, author, subject and keywords." downloadName="Niroj77-edit-pdf-metadata.pdf"  extraFields={[{name:"title",label:"Document title"},{name:"author",label:"Author"},{name:"subject",label:"Subject"},{name:"keywords",label:"Keywords (comma-separated)"}]} /></div></div></main>;
}
