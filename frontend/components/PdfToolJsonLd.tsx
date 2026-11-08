import type { ReactElement } from "react";

export interface PdfToolFaq { question: string; answer: string; }
export interface PdfToolJsonLdProps { name: string; description: string; url: string; locale: "en" | "ne"; price?: string; }

function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** Server component; schema must match visible content in the selected locale. */
export default function PdfToolJsonLd({ name, description, url, locale, price }: PdfToolJsonLdProps): ReactElement {
  const graph: Record<string, unknown>[] = [{
    "@type": "SoftwareApplication", name, description, url,
    applicationCategory: "UtilitiesApplication", operatingSystem: "Any", inLanguage: locale,
    ...(price !== undefined ? { offers: { "@type": "Offer", price, priceCurrency: "USD" } } : {}),
  }];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ "@context": "https://schema.org", "@graph": graph }) }} />;
}
