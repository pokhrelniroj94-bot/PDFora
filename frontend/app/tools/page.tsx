import type { Metadata } from "next";
import { SmartToolCenter } from "../../components/SmartToolCenter";

export const metadata: Metadata = {
  title: "All Online Tools – Smart PDF, Image, Nepal & Finance Tool Finder",
  description: "Find the right free online tool by task. Search PDF tools, image converters, calculators, Nepal utilities, text tools, developer tools and more in one searchable directory.",
  alternates: { canonical: "https://pd-fora.vercel.app/tools" },
  openGraph: {
    type: "website",
    title: "Smart Tool Center – Find the Right Tool",
    description: "Search and discover PDF, image, finance, Nepal, text and developer tools by the task you want to complete.",
    url: "https://pd-fora.vercel.app/tools",
    siteName: "PDFora",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "PDFora online tools directory" }],
  },
  twitter: {
    card: "summary",
    title: "Smart Tool Center",
    description: "Find the right tool by task across PDF, image, finance, Nepal and productivity utilities.",
    images: ["/opengraph-image"],
  },
};

export default function ToolsPage() {
  return <SmartToolCenter />;
}
