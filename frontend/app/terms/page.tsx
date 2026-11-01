import type { Metadata } from "next";

const baseUrl = "https://pd-fora.vercel.app";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms for using PDFora online PDF tools, including user responsibilities, permitted use, service availability and intellectual property.",
  alternates: { canonical: `${baseUrl}/terms` },
  openGraph: {
    title: "PDFora Terms of Service",
    description: "Terms and conditions for using PDFora online PDF and document tools.",
    url: `${baseUrl}/terms`,
    siteName: "PDFora",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFora Terms of Service",
    description: "Terms and conditions for using PDFora online tools.",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>
        <p className="mb-8 text-gray-600">Last updated: November 1, 2026</p>
        <section className="space-y-6 leading-7">
          <div><h2 className="mb-2 text-2xl font-semibold">1. Acceptance of Terms</h2><p>By accessing or using PDFora, you agree to these Terms of Service. If you do not agree, do not use the website.</p></div>
          <div><h2 className="mb-2 text-2xl font-semibold">2. Eligibility</h2><p>You must be at least 13 years old to use PDFora. If local law requires a higher minimum age for the processing of your personal information, that higher age requirement applies. If you are not legally able to agree to these terms, use the service only with appropriate parent or guardian involvement where permitted by law.</p></div>
          <div><h2 className="mb-2 text-2xl font-semibold">3. Our Services</h2><p>PDFora provides browser-based tools for processing documents, including PDF conversion, merging, compression, page editing and related operations. Features may be changed, suspended or discontinued. Tool-specific limits and availability are described on the relevant pages where known.</p></div>
          <div><h2 className="mb-2 text-2xl font-semibold">4. User Files and Rights</h2><p>You are responsible for files and content you upload. You must have the rights and permissions needed to process each file and must not use PDFora to infringe copyright, privacy, confidentiality or other legal rights. Keep your own backup of important originals before using an online processing service.</p><p className="mt-2">Use the Unlock PDF feature only for files you own or are authorised to access. You must not use it to bypass access controls on documents without permission. Use signing features only where you are authorised to apply the relevant signature.</p></div>
          <div><h2 className="mb-2 text-2xl font-semibold">5. Prohibited Use</h2><p>You must not use PDFora for unlawful, fraudulent, abusive or harmful activities. Do not upload malware, attempt to disrupt the service, probe or gain unauthorised access to systems, overload endpoints, or use the tools to violate another person's rights.</p></div>
          <div><h2 className="mb-2 text-2xl font-semibold">6. Service Availability and No Warranty</h2><p>PDFora is provided on an “as available” basis. To the extent permitted by applicable law, the service is provided without warranties of uninterrupted availability, error-free operation, fitness for a particular purpose or guaranteed conversion accuracy. Always inspect processed files before relying on them.</p></div>
          <div><h2 className="mb-2 text-2xl font-semibold">7. Intellectual Property and Copyright Reports</h2><p>PDFora's original website design, branding, software and content are protected by applicable intellectual-property laws. You retain responsibility for content you upload. If you believe material or use of the service infringes your rights, submit a report through the official contact channel when one is published, identifying the material and the basis of your claim. Do not send confidential documents unless necessary and authorised.</p></div>
          <div><h2 className="mb-2 text-2xl font-semibold">8. Third-Party Services</h2><p>The website may rely on third-party hosting, infrastructure, analytics or other providers. Their services may be subject to separate terms and privacy policies. Refer to the Privacy Policy for the providers currently identified by PDFora.</p></div>
          <div><h2 className="mb-2 text-2xl font-semibold">9. Limitation of Liability</h2><p>To the extent permitted by applicable law, PDFora and its operator are not liable for indirect or consequential loss, loss of data, interruption, or reliance on an output file. Nothing in these terms excludes liability that cannot legally be excluded.</p></div>
          <div><h2 className="mb-2 text-2xl font-semibold">10. Governing Law</h2><p>These terms are intended to be governed by the laws of Nepal, subject to any mandatory consumer-protection or data-protection rights that apply to you in your place of residence. Any dispute will be handled by a court with jurisdiction under applicable law in Nepal.</p></div>
          <div><h2 className="mb-2 text-2xl font-semibold">11. Changes and Contact</h2><p>These terms may be updated as the service changes. The latest revision date appears on this page. A public support or copyright-report email is not currently published; the Contact page will be updated when an official channel is available.</p></div>
        </section>
      </div>
    </main>
  );
}