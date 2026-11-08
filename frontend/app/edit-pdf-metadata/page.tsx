import { getPdfToolMetadata } from "../../lib/i18n/pdf-tool-seo";
import Niroj77Tool from "../../components/Niroj77Tool";

export const metadata = getPdfToolMetadata("edit-pdf-metadata");

export default function Page() {
  return <section className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-center text-3xl font-black sm:text-5xl">Edit PDF Metadata</h1><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Update document title, author, subject and keywords.</p><div className="mt-8"><Niroj77Tool endpoint="/api/metadata" title="Edit PDF Metadata" description="Update document title, author, subject and keywords." downloadName="PDFora-edit-pdf-metadata.pdf"  extraFields={[{name:"title",label:"Document title"},{name:"author",label:"Author"},{name:"subject",label:"Subject"},{name:"keywords",label:"Keywords (comma-separated)"}]} /></div></div></section>;
}
