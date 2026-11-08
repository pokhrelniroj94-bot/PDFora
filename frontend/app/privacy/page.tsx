import type { Metadata } from "next";
import { hreflangMap } from "../../lib/i18n/routing";

const localizedAlternates = hreflangMap("/privacy");

export const metadata: Metadata = {
  title: "Privacy Policy: PDF and Data Handling",
  description: "Understand how PDFora handles uploaded files, technical information, cookies, advertising partners and public market data.",
  alternates: { canonical: "https://pd-fora.vercel.app/privacy", ...(localizedAlternates ? { languages: localizedAlternates } : {}) },
  openGraph: { type: "website", url: "https://pd-fora.vercel.app/privacy", siteName: "PDFora", title: "PDFora Privacy Policy", description: "Understand how PDFora handles uploaded files, technical information, cookies, advertising partners and public market data.", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "PDFora Privacy Policy", description: "Understand how PDFora handles uploaded files, technical information, cookies, advertising partners and public market data.", images: ["/opengraph-image"] },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>

        <p className="mb-8 text-gray-600">
          Last updated: November 3, 2026
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
              PDFora processes files that you voluntarily upload to use our
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
              6. Public Market Data and Calculations
            </h2>
            <p>
              The NEPSE dashboard and technical-analysis tools display public
              market datasets and historical observations from the sources
              identified on each page. These sources may be delayed, incomplete,
              archived or independently unverified. The page shows available
              source and update timestamps; refreshing PDFora does not force an
              upstream provider to publish new data.
            </p>
            <p className="mt-2">
              Market indicators and calculator results are produced by
              deterministic formulas from the displayed inputs. They are
              educational estimates, not forecasts, investment advice or
              exchange-authorized trading quotes. Verify prices, disclosures,
              corporate actions and fees with the relevant official source.
            </p>
            <p className="mt-2">
              Resume Builder details and profile photos are handled in your
              browser to create the preview and PDF. NEPSE watchlist symbols
              are stored in your browser&apos;s local storage on this device and are
              not sent to PDFora&apos;s server by the watchlist feature. You can
              remove them from the dashboard or clear this site&apos;s browser data.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              7. Data Security
            </h2>
            <p>
              We take reasonable measures to protect information processed
              through PDFora. However, no internet transmission or online
              storage system can be guaranteed to be completely secure.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              8. Children&apos;s Privacy
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
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time as our
              services, technology, or legal requirements change. Updates will
              be reflected on this page with a revised date.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">10. Contact</h2>
            <p>
              If you have questions about this Privacy Policy or PDFora&apos;s
              privacy practices, email us at{" "}
              <a className="underline" href="mailto:pokhrelniroj94@gmail.com">pokhrelniroj94@gmail.com</a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}