import type { Metadata } from "next";
import { hreflangMap } from "../../lib/i18n/routing";

const localizedAlternates = hreflangMap("/privacy");

export const metadata: Metadata = {
  title: "Privacy Policy | PDFora Data and File Handling",
  description: "Understand how PDFora handles uploaded files, technical information, cookies, advertising partners, technical services and file processing.",
  alternates: { canonical: "https://pd-fora.vercel.app/privacy", ...(localizedAlternates ? { languages: localizedAlternates } : {}) },
  openGraph: { type: "website", url: "https://pd-fora.vercel.app/privacy", siteName: "PDFora", title: "PDFora Privacy Policy", description: "Understand how PDFora handles uploaded files, technical information, cookies, advertising partners, technical services and file processing." },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>

        <p className="mb-8 text-gray-600">
          Last updated: November 14, 2026
        </p>

        <section className="space-y-6 leading-7">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to PDFora. We provide online PDF tools for converting,
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
              PDFora processes files that you voluntarily upload to use our tools. Files are
              transmitted to our processing backend so the requested operation can
              be completed; tools using this service do not process the uploaded
              document entirely on your device.
            </p>
            <p className="mt-2">
              Under normal operation, request-scoped temporary files are cleaned after the
              processing response has been sent. If a request is interrupted or the
              service stops before cleanup, the backend checks for abandoned temporary
              job folders during a later processing request and removes folders older
              than six hours. This is best-effort cleanup, not a guarantee that every
              interrupted file is erased at an exact time. We do not intentionally
              maintain a permanent user file library or account-based file history.
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
              PDFora currently displays advertisements from third-party
              advertising partners on pages where ad units are enabled,
              including Adsterra. These providers may use cookies or similar
              technologies to deliver ads, measure performance, limit
              repeated ads, and help detect invalid activity.
            </p>
            <p className="mt-2">
              Depending on the provider and its settings, advertising
              technologies may process information such as IP address,
              browser or device details, approximate location, and ad
              interactions. Third-party providers handle this information
              under their own privacy policies. You can review your browser
              cookie controls and the provider&apos;s available privacy or
              advertising preferences.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              5. Third-Party Services
            </h2>
            <p>
              PDFora may use third-party infrastructure, hosting, analytics,
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
              through PDFora. However, no internet transmission or online
              storage system can be guaranteed to be completely secure.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              7. Children&apos;s Privacy
            </h2>
            <p>
              PDFora is not intentionally designed to collect personal
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
              For non-sensitive questions about this Privacy Policy or PDFora&apos;s
              privacy practices, visit our <a className="underline" href="/contact">Contact page</a>
              and use the public issue tracker. Do not post personal information,
              passwords, uploaded files or confidential details in public issues.
              PDFora does not currently publish a private support email or a
              dedicated private privacy-request channel.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}