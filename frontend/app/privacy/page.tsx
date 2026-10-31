import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Niroj77.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>

        <p className="mb-8 text-gray-600">
          Last updated: August 12, 2026
        </p>

        <section className="space-y-6 leading-7">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to Niroj77. We provide online PDF tools for converting,
              merging, compressing, editing, and processing PDF and related
              files. This Privacy Policy explains how information is handled
              when you use our website.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              2. Files You Upload
            </h2>
            <p>
              Niroj77 processes files that you voluntarily upload to use our
              tools. Uploaded files are temporarily processed by our backend
              servers to provide the requested service.
            </p>
            <p className="mt-2">
              Our current backend is designed to remove uploaded temporary
              files after processing. We do not intentionally maintain a
              permanent user file library or account-based file history.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              3. Information We May Collect
            </h2>
            <p>
              Depending on the services and analytics technologies enabled on
              the website, we may collect limited technical information such as
              browser type, device information, approximate location, pages
              visited, and usage information.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              4. Cookies and Advertising
            </h2>
            <p>
              Niroj77 may use cookies or similar technologies for website
              functionality, analytics, and, if enabled in the future,
              advertising services such as Google AdSense.
            </p>
            <p className="mt-2">
              Third-party advertising providers may use cookies to serve ads
              based on a user's visits to this and other websites, subject to
              their own privacy policies and applicable settings.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              5. Third-Party Services
            </h2>
            <p>
              Niroj77 may use third-party infrastructure, hosting, analytics,
              security, or advertising services to operate and improve the
              website. These providers may process technical information as
              necessary to provide their services.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              6. Data Security
            </h2>
            <p>
              We take reasonable measures to protect information processed
              through Niroj77. However, no internet transmission or online
              storage system can be guaranteed to be completely secure.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              7. Children's Privacy
            </h2>
            <p>
              Niroj77 is not intentionally designed to collect personal
              information from children. If you believe a child has provided
              personal information to us, please contact us so appropriate
              action can be considered.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              8. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time as our
              services, technology, or legal requirements change. Updates will
              be reflected on this page with a revised date.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">9. Contact</h2>
            <p>
              If you have questions about this Privacy Policy or Niroj77's
              privacy practices, please contact the Niroj77 team through the
              contact information provided on our website.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}