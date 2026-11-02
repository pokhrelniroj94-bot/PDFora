import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for PDFora.",
  alternates: { canonical: "https://pd-fora.vercel.app/terms" },
  openGraph: { type: "website", url: "https://pd-fora.vercel.app/terms", siteName: "PDFora", title: "PDFora Terms of Service", description: "Terms of Service for PDFora.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora terms of service" }] },
  twitter: { card: "summary_large_image", title: "PDFora Terms of Service", description: "Terms of Service for PDFora.", images: ["/opengraph-image"] },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>

        <p className="mb-8 text-gray-600">
          Last updated: November 2, 2026
        </p>

        <section className="space-y-6 leading-7">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing or using PDFora, you agree to these Terms of
              Service. If you do not agree with these terms, please do not use
              the website.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">2. Our Services</h2>
            <p>
              PDFora provides online tools for processing documents and files,
              including PDF conversion, merging, compression, editing, and
              other related services.
            </p>
            <p className="mt-2">
              We may add, modify, suspend, or discontinue features at any time
              without prior notice.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">3. User Files</h2>
            <p>
              You are responsible for the files and content you upload to
              PDFora. You should only upload files that you have the legal
              right to process.
            </p>
            <p className="mt-2">
              You should maintain your own backup of important files before
              using any online file-processing service.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              4. Prohibited Use
            </h2>
            <p>
              You must not use PDFora for unlawful, fraudulent, abusive, or
              harmful activities. You must not attempt to interfere with,
              damage, overload, or gain unauthorized access to our systems.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              5. Service Availability
            </h2>
            <p>
              PDFora is provided on an availability basis. We do not guarantee
              that the website or any particular tool will always be available,
              uninterrupted, or error-free.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              6. Accuracy of Results
            </h2>
            <p>
              File conversions and processing may occasionally produce
              unexpected results. You are responsible for checking the output
              files before relying on them.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              7. Tax, Finance and NEPSE Calculators
            </h2>
            <p>
              Tax, salary, VAT, electricity, loan, investment, share-profit,
              dividend and other financial calculators provide estimates based
              on the inputs, assumptions, rates and dates shown by each tool.
              They are not tax assessments, financial advice, investment
              recommendations, broker statements or official bills. Rules,
              fees, tariffs and market data can change and may depend on your
              personal circumstances. Verify important results with the
              Inland Revenue Department, Nepal Rastra Bank, NEA, NEPSE, SEBON,
              your broker or another responsible official source before
              making a decision.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              8. Typed Signatures
            </h2>
            <p>
              The Sign PDF tool places a visible typed name or signature mark
              on a document. It is not a certificate-based digital signature,
              does not independently verify the signer&apos;s identity and
              does not guarantee legal validity, authenticity or acceptance
              by a recipient. Check the requirements of the receiving
              organisation before using it for an official document.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              9. Intellectual Property
            </h2>
            <p>
              The PDFora website, branding, design, software, and original
              content are protected by applicable intellectual property laws.
              You may not copy, reproduce, or redistribute our website or
              services without permission.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              10. Third-Party Services and Advertising
            </h2>
            <p>
              PDFora may use third-party hosting, analytics, advertising, and
              other services. Your use of third-party services may also be
              subject to their respective terms and policies.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              11. Limitation of Liability
            </h2>
            <p>
              To the extent permitted by applicable law, PDFora and its
              operators will not be responsible for losses or damages resulting
              from the use of the website, file processing, service
              interruptions, or reliance on processed files.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">12. Changes</h2>
            <p>
              We may update these Terms of Service from time to time. Continued
              use of PDFora after changes are published means you accept the
              updated terms.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">13. Contact</h2>
            <p>
              If you have questions about these Terms of Service, please
              contact the PDFora team through the contact information provided
              on our website.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}