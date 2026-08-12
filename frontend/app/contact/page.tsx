import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact the PDFora team for questions, feedback, and support.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Contact PDFora</h1>

        <p className="mb-8 text-gray-600">
          Have a question, suggestion, or problem? We would love to hear from
          you.
        </p>

        <section className="space-y-6 leading-7">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Get in Touch</h2>
            <p>
              If you have questions about PDFora, encounter a problem with one
              of our tools, or have suggestions for improving the website,
              please contact our team.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">Support</h2>
            <p>
              When reporting a problem, please include the name of the tool you
              were using and a brief description of the issue. This helps us
              investigate the problem more effectively.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">Feedback</h2>
            <p>
              We welcome feedback and suggestions that can help us make PDFora
              faster, easier, and more useful.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}