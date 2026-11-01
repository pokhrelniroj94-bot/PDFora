import type { Metadata } from "next";

const baseUrl = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "About PDFora",
  description: "Learn about PDFora, a browser-based collection of tools for merging, splitting, compressing, converting and organising PDF documents.",
  alternates: { canonical: `${baseUrl}/about` },
  openGraph: {
    title: "About PDFora",
    description: "Learn about PDFora and its collection of browser-based PDF tools.",
    url: `${baseUrl}/about`,
    siteName: "PDFora",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About PDFora",
    description: "Learn about PDFora and its online PDF tools.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">About PDFora</h1>
        <p className="mb-8 text-gray-600">Simple, browser-based tools for everyday PDF and document tasks.</p>
        <section className="space-y-6 leading-7">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">What is PDFora?</h2>
            <p>PDFora is an online collection of document utilities designed to help people complete common PDF tasks from a web browser. Depending on the tool, visitors can merge or split documents, compress files, convert PDFs and images, rearrange pages, add watermarks, and work with document security features.</p>
            <p className="mt-2">The goal is to make routine document operations easier to access without requiring users to install a desktop application for every task. Tool availability and supported options are shown on each individual tool page.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Why PDFora was created</h2>
            <p>PDF tasks often appear during ordinary work and study: preparing an assignment, combining supporting documents, reducing a file for an online form, or converting a report into a format that another application can open. PDFora is being developed around these practical needs, with an emphasis on clear workflows and access from desktop and mobile browsers.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Who builds PDFora?</h2>
            <p>PDFora is an independently developed project built and maintained by Niroj Pokhrel. The project is improved over time as tools are tested, issues are identified and new document workflows are added. No claims are made here about a larger team or a registered company.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Available tool categories</h2>
            <p>The website includes PDF merging and splitting, compression, conversion between PDF and common document or image formats, page extraction and rearrangement, rotation, watermarking, signing, password protection and other document utilities. Some features may be unavailable or under development; check the individual tool page before relying on a feature.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Privacy and uploaded documents</h2>
            <p>Some tools require a document to be sent to a processing service to complete the requested operation. Before uploading sensitive documents, read the Privacy Policy and consider whether an online processing service is appropriate for the information in the file.</p>
            <p className="mt-2">PDFora does not present itself as a permanent personal file-storage service. The Privacy Policy describes the currently known processing and retention behaviour and should be consulted for details.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Contact and feedback</h2>
            <p>Feedback about tool errors, accessibility, supported file types and feature requests is useful for improving PDFora. A public support email address is not currently published. The Contact page will be updated when an official contact channel is available.</p>
          </div>
        </section>
      </div>
    </main>
  );
}