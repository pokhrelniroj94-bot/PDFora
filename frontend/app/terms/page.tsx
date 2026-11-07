import type { Metadata } from "next";
import { hreflangMap } from "../../lib/i18n/routing";

const localizedAlternates = hreflangMap("/terms");

export const metadata: Metadata = {
  title: "Terms of Service for Online Tools",
  description: "Read the terms for using PDFora online PDF, document, calculator and other browser-based tools, including user responsibilities and service limitations.",
  alternates: { canonical: "https://pd-fora.vercel.app/terms", ...(localizedAlternates ? { languages: localizedAlternates } : {}) },
  openGraph: { type: "website", url: "https://pd-fora.vercel.app/terms", siteName: "PDFora", title: "PDFora Terms of Service", description: "Terms for using PDFora online tools, including user responsibilities and service limitations.", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "PDFora Terms of Service", description: "Terms for using PDFora online tools, including user responsibilities and service limitations.", images: ["/opengraph-image"] },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <article className="mx-auto max-w-4xl">
        <header className="mb-10 border-b border-gray-200 pb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-violet-700">PDFora policies</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-gray-600">Last updated: November 7, 2026</p>
          <p className="mt-5 leading-7 text-gray-700">
            These Terms explain the conditions for accessing and using PDFora. By using the website, you agree to these Terms. If you do not agree, please stop using the service.
          </p>
        </header>

        <div className="space-y-8 leading-7 text-gray-700">
          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">1. About the service</h2>
            <p>PDFora provides online tools for working with PDF and other files, along with calculators, writing utilities and information features. Available tools and functions may change as the website is maintained and improved. Some features may depend on third-party providers, browser support or service availability.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">2. Your responsibility for uploaded content</h2>
            <p>You are responsible for the files, text and other content you submit. Upload or process only material that you own or are legally permitted to use. You must not submit content that violates another person&apos;s rights or applicable law.</p>
            <p className="mt-2">Keep your own backup of important originals. Before relying on a processed file, open it and check that its pages, formatting, tables, images and other content are correct. PDF conversion and extraction can produce incomplete or altered results, particularly with scanned documents, unusual fonts, complex layouts or damaged files.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">3. Acceptable use</h2>
            <p>You must not use PDFora to carry out unlawful, fraudulent, abusive or harmful activity. You must not attempt to disrupt the website, bypass reasonable usage limits, upload malicious code, probe or attack systems without authorization, interfere with other users, or access data or services that you are not authorized to access.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">4. Files, privacy and security</h2>
            <p>Files submitted to processing tools may be transmitted to the service infrastructure needed to perform the requested operation. The handling of temporary files, technical information, cookies, advertising and optional AI features is described in our <a className="font-semibold text-violet-700 underline" href="/privacy">Privacy Policy</a>. Do not upload passwords, payment-card details, government identity numbers, private keys or highly confidential information unless you have assessed the risks and the feature is appropriate for that data.</p>
            <p className="mt-2">No website or internet transmission can be guaranteed completely secure. You remain responsible for deciding whether a file is suitable for online processing.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">5. Calculators, AI and informational outputs</h2>
            <p>Calculator results, generated text, market explanations, conversions and other outputs are provided for general informational or productivity purposes. They may contain errors, depend on the information you enter, or become outdated. They are not legal, medical, tax, investment or other professional advice, and should not be the sole basis for important decisions. Independently verify important results with an appropriate qualified source.</p>
            <p className="mt-2">AI-generated content may be inaccurate, incomplete or unsuitable for your circumstances. Review and edit it before use. Market data and analysis, where available, are not a promise of future performance or a recommendation to buy or sell securities.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">6. Availability and changes</h2>
            <p>PDFora is provided on an “as available” basis. We do not promise uninterrupted access, error-free operation, a particular processing speed, or permanent availability of any tool. We may update, suspend or discontinue a feature when reasonably necessary for maintenance, security, legal compliance or product changes.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">7. Intellectual property</h2>
            <p>The PDFora website, branding, software, design and original website content are protected by applicable intellectual property laws. These Terms do not transfer ownership of those materials to you. You retain responsibility for and any rights you hold in content you submit, subject to the permissions needed to process it and provide the requested output.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">8. Third-party services and links</h2>
            <p>The website may rely on third-party hosting, infrastructure, analytics, advertising, AI providers or external websites. Those services are operated by their respective providers and may have separate terms and privacy policies. PDFora does not control third-party websites or guarantee their content, availability or practices.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">9. Disclaimers and limitation of liability</h2>
            <p>To the extent permitted by applicable law, PDFora is provided without warranties that every output will be accurate, complete, compatible or fit for a particular purpose. To the extent permitted by law, PDFora and its operators are not liable for indirect or consequential loss, loss of data, loss of profit, or damage arising from use of or inability to use the service, including reliance on a processed or generated output. Nothing in these Terms excludes a right or liability that cannot lawfully be excluded.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">10. Changes to these Terms</h2>
            <p>We may revise these Terms to reflect changes to the website, services or applicable requirements. The updated version and its revision date will be posted on this page. Your continued use of PDFora after revised Terms are published means you accept the revised Terms, to the extent permitted by law.</p>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">11. Contact</h2>
            <p>Questions about these Terms can be sent to <a className="font-semibold text-violet-700 underline" href="mailto:pokhrelniroj94@gmail.com">pokhrelniroj94@gmail.com</a>. You can also visit our <a className="font-semibold text-violet-700 underline" href="/contact">Contact page</a>.</p>
          </section>
        </div>
      </article>
    </main>
  );
}