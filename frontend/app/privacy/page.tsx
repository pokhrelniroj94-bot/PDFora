import type { Metadata } from "next";

const baseUrl = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how PDFora handles uploaded documents, technical information, cookies, analytics and third-party services when you use its online PDF tools.",
  alternates: { canonical: `${baseUrl}/privacy` },
  openGraph: {
    title: "PDFora Privacy Policy",
    description: "Information about uploaded files, technical data, cookies and third-party services used by PDFora.",
    url: `${baseUrl}/privacy`,
    siteName: "PDFora",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFora Privacy Policy",
    description: "How PDFora handles files and technical information.",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-gray-600">Last updated: November 1, 2026</p>
        <section className="space-y-6 leading-7">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">1. Introduction</h2>
            <p>PDFora provides browser-based tools for merging, splitting, compressing, converting and otherwise processing documents. This policy explains what is known about information handled when you visit the website and use its tools.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">2. Files You Upload</h2>
            <p>When a tool needs server-side processing, the selected file is uploaded to the PDFora processing backend. The backend code currently enforces a maximum upload size of 50 MB per file in its upload helper and validates PDF file content for PDF-processing endpoints. Some multi-file tools also enforce a combined 50 MB limit.</p>
            <p className="mt-2">Temporary processing files are stored in a temporary directory on the backend host. Successful download responses for some operations schedule deletion after the response, but cleanup is not implemented identically for every endpoint. A background sweep removes abandoned job directories older than six hours when a new job is created. Therefore, PDFora does not promise that every uploaded or generated file is deleted immediately or within one hour. Do not upload highly sensitive documents unless you are comfortable with this processing and retention behaviour.</p>
            <p className="mt-2">PDFora does not provide user accounts or a permanent personal file library as part of the current tool workflow. This statement does not mean that infrastructure providers cannot retain operational logs or backups under their own policies.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">3. Technical Information and Logs</h2>
            <p>The website and its hosting or processing providers may process technical information needed to deliver, secure and troubleshoot the service. This can include IP address, request time, browser or device information, requested page or endpoint, response status and diagnostic information. The exact fields and retention periods depend on the provider configuration and are not fully specified in the application source code.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">4. Analytics</h2>
            <p>The website code includes the Google Analytics integration from Next.js third-party components, configured through the NEXT_PUBLIC_GA_ID environment variable. Whether analytics is active on a particular deployment depends on that environment variable and the deployed configuration. Google may process usage and device information according to its own policies.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">5. Cookies and Advertising</h2>
            <p>Google Analytics and any advertising services enabled on the site may use cookies or similar technologies. The current website source also contains third-party advertising placements on some pages. PDFora has not yet implemented a complete consent-management flow in this code version. If you do not want optional cookies, you can adjust your browser settings; browser controls may affect site functionality.</p>
            <p className="mt-2">For information about how Google uses data from partner sites, see <a className="text-blue-700 underline" href="https://policies.google.com/technologies/partner-sites">Google's partner-sites policy</a>. You can review Google's advertising personalisation settings at <a className="text-blue-700 underline" href="https://adssettings.google.com">Google Ads Settings</a>.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">6. Hosting and Third-Party Processors</h2>
            <p>The public website is deployed through Vercel and the PDF processing API is configured as a separate backend service. Hosting and infrastructure providers may process request data, security logs and temporary files to operate their services. The exact physical processing region, provider log-retention periods and backup deletion schedules have not been confirmed in the application source, so PDFora does not make a specific country or provider-retention promise here.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">7. Security</h2>
            <p>The backend code includes request-size checks, a 50 MB upload limit in its upload helper, random job-directory identifiers, temporary storage and PDF content validation. These measures do not guarantee that online transmission or processing is completely secure. Use the website only over HTTPS and avoid uploading documents that you cannot safely send to an online service.</p>
            <p className="mt-2">PDFora does not claim that every file, password, filename or diagnostic value is excluded from all infrastructure logs until that behaviour has been independently verified across the full deployment stack.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">8. International Processing</h2>
            <p>Because the website and processing backend use third-party hosting services, information may be processed in locations selected by those providers. The exact region for each deployment has not been confirmed in the application code. Provider terms and privacy notices may describe their own international transfer safeguards.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">9. Your Privacy Rights</h2>
            <p>Depending on your location and applicable law, you may have rights to request access to, correction or deletion of personal information, or to object to or restrict certain processing. You may also have rights relating to advertising cookies and analytics. The ability to fulfil a request can depend on whether the relevant information is held by PDFora or directly by a hosting, analytics or advertising provider.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">10. Children</h2>
            <p>PDFora is not designed for children under 13. Where local law sets a higher age for consent to online processing, the applicable higher age requirement applies. We do not knowingly seek to collect personal information from children.</p>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">11. Retention Summary</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li><strong>Uploaded and generated files:</strong> temporarily stored for processing; some completed jobs are deleted after the response, while abandoned job folders are swept when a new job is created if older than six hours. Other endpoint cleanup behaviour may differ.</li>
              <li><strong>Website and infrastructure logs:</strong> controlled in part by hosting and service providers; exact retention periods have not been confirmed.</li>
              <li><strong>Analytics and advertising data:</strong> retention is subject to the settings and policies of the relevant provider.</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-semibold">12. Changes and Contact</h2>
            <p>This policy may be updated when the service, infrastructure or legal requirements change. A public support email address is not currently published. The Contact page will be updated when an official contact channel is available.</p>
          </div>
        </section>
      </div>
    </main>
  );
}