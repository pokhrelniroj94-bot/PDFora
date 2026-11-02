import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how PDFora processes uploaded files, calculator inputs, technical data, cookies, analytics and advertising.",
  alternates: { canonical: "https://pd-fora.vercel.app/privacy" },
  openGraph: { type: "website", url: "https://pd-fora.vercel.app/privacy", siteName: "PDFora", title: "PDFora Privacy Policy", description: "How PDFora handles uploaded files, technical data, cookies, analytics and advertising." },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-gray-600">Last updated: November 2, 2026</p>
        <section className="space-y-6 leading-7">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">1. About this policy</h2>
            <p>PDFora provides online PDF processing, calculators, date and calendar utilities, market information and other browser-based tools. This policy explains what information may be processed when you visit the website or use a tool. PDFora does not require you to create an account to use its public tools.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">2. Files you upload</h2>
            <p>When you use a PDF or image tool that requires an upload, your selected file is transmitted over HTTPS to PDFora&apos;s processing backend so the requested operation can be completed. The backend validates and temporarily stores the upload while it is being processed. Output files are returned to your browser.</p>
            <p className="mt-2">Temporary processing files are scheduled for cleanup after the response has been sent. Abandoned temporary jobs are also removed by periodic cleanup logic. PDFora does not provide a permanent user file library or account-based file history. Do not upload documents unless you are authorised to share them with the service.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">3. Calculator and personal inputs</h2>
            <p>Inputs entered into ordinary calculators are used to calculate and display the result. Birth details entered into the Janma Kundali and related astrology tools are processed in the browser; those birth details are not sent to the PDFora processing backend by that calculator. Avoid entering sensitive information into any tool unless it is necessary for the calculation.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">4. Technical and security information</h2>
            <p>Our hosting and security systems may process technical information such as IP address, browser and device details, request time, requested page or API route, and basic diagnostic information. The backend uses IP-based request counters to limit automated abuse and excessive file-processing requests. These counters use short configured time windows; they are not an account profile or a permanent usage history.</p>
            <p className="mt-2">We may use technical information to operate the service, troubleshoot errors, protect the website and enforce upload and request limits.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">5. Analytics, cookies and advertising</h2>
            <p>Google Analytics may be enabled through the website&apos;s deployment configuration to measure visits and general usage. Advertisement units may load third-party advertising technology, including Adsterra. Depending on the services enabled and your settings, these providers may use cookies or similar technologies and process information such as IP address, device or browser information, approximate location, page activity and ad interactions.</p>
            <p className="mt-2">Google and advertising providers process information under their own privacy policies and controls. You can manage or clear cookies through your browser settings. Blocking cookies or third-party scripts may affect analytics or advertising functionality.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">6. Third-party infrastructure and data sources</h2>
            <p>PDFora uses third-party hosting and infrastructure to deliver the website and process files. Certain tools also retrieve public information from external sources, such as Nepal Rastra Bank exchange-rate publications, public market-data feeds and news providers. Tool requests to those sources are made to retrieve the requested public information; PDFora does not intentionally send your uploaded document contents or calculator inputs to those data providers.</p>
            <p className="mt-2">Third-party services operate under their own terms and privacy policies. Their availability and data handling are outside PDFora&apos;s direct control.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">7. Data retention and security</h2>
            <p>PDFora uses reasonable technical measures such as HTTPS, upload-size and file validation, temporary-file cleanup, request limits and security response headers. Temporary uploads are intended to be removed after processing, while short-lived security counters and ordinary infrastructure logs may remain for their operational retention periods. No internet service can guarantee absolute security.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">8. Children&apos;s privacy</h2>
            <p>PDFora is not intentionally designed to collect personal information from children. If you believe a child has provided personal information to PDFora, please contact the service operator so the concern can be reviewed.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">9. Changes and contact</h2>
            <p>This policy may be updated when the website, its providers or its data practices change. The revision date above will be updated when material changes are made. For privacy questions, use the contact information made available on the PDFora website.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
