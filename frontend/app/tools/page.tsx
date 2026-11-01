import type { Metadata } from "next";
import { ToolsDirectory } from "../../components/AllTools";

export const metadata: Metadata = {
  title: "100+ Free Online Tools",
  description: "Find free online finance, text, developer, image, SEO and PDF tools. Use practical browser-based calculators, converters and productivity utilities.",
  alternates: { canonical: "https://niroj.com.np/tools" },
  keywords: ["free online tools", "online calculators", "text tools", "developer tools", "image tools", "PDF tools", "NIROJ Tools"],
  openGraph: {
    type: "website",
    title: "100+ Free Online Tools | NIROJ Tools",
    description: "Free browser-based calculators, converters, text, developer, image and PDF utilities.",
    url: "https://niroj.com.np/tools",
    siteName: "NIROJ Tools",
  },
  twitter: {
    card: "summary",
    title: "100+ Free Online Tools | NIROJ Tools",
    description: "Free browser-based calculators, converters and productivity utilities.",
  },
};

export default function ToolsPage() {
  return <ToolsDirectory />;
}
