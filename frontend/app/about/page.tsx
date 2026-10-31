import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Niroj77, a free online platform for simple and convenient PDF tools.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">About Niroj77</h1>

        <p className="mb-8 text-gray-600">
          Simple, fast, and accessible online document tools.
        </p>

        <section className="space-y-6 leading-7">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">What is Niroj77?</h2>
            <p>
              Niroj77 is a free online platform designed to make everyday
              document and PDF tasks easier. Our tools help users convert,
              merge, compress, edit, and process files directly from their
              browser.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">Our Mission</h2>
            <p>
              Our goal is to provide simple and useful document tools that
              anyone can access without complicated software installation.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">Our Tools</h2>
            <p>
              Niroj77 currently provides tools for PDF conversion, PDF merging,
              compression, image conversion, editing, protection, watermarking,
              and other document-processing tasks.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">Privacy</h2>
            <p>
              We understand that documents can contain sensitive information.
              Niroj77 is designed to process uploaded files temporarily rather
              than maintain a permanent personal file library.
            </p>
            <p className="mt-2">
              For more information, please read our Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have questions, suggestions, or feedback about Niroj77,
              please contact our team through the contact information provided
              on our website.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}