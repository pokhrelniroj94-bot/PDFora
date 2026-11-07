import type { Metadata } from "next";
import { hreflangMap } from "../../lib/i18n/routing";

const localizedAlternates = hreflangMap("/privacy");

export const metadata: Metadata = {
  title: "Privacy Policy | PDFora Data and File Handling",
  description: "Understand how PDFora handles uploaded files, technical information, cookies, advertising partners and optional AI features.",
  alternates: { canonical: "https://pd-fora.vercel.app/privacy", ...(localizedAlternates ? { languages: localizedAlternates } : {}) },
  openGraph: { type: "website", url: "https://pd-fora.vercel.app/privacy", siteName: "PDFora", title: "PDFora Privacy Policy", description: "Understand how PDFora handles uploaded files, technical information, cookies, advertising partners and optional AI features." },
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
              6. AI Writing and Market Explanation Tools
            </h2>
            <p>
              If you choose to use AI Resume Writer, Cover Letter Generator,
              Humanizer, or the optional Market AI explanation, the text and
              details you submit are sent to Cloudflare Workers AI to generate
              a response. These features require your confirmation before
              submitting text. Do not submit passwords, government identity
              numbers, bank or broker credentials, private keys, or confidential
              employer or client information.
            </p>
            <p className="mt-2">
              PDFora does not intentionally save AI prompts or generated
              responses in its own application database. The AI provider
              processes requests under its own terms and privacy practices.
              Review the <a className="underline" href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">Cloudflare Privacy Policy</a>
              before using these features. AI-generated content may be
              inaccurate and should be reviewed before use.
            </p>
            <p className="mt-2">
              Resume Builder details and profile photos are handled in your
              browser to create the preview and PDF. AI-generated resume text
              is transferred to the builder only within the current browser
              tab session and is removed after import.
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