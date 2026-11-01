import type { Metadata } from "next";
import ToolWorkspace from "../../../components/AllTools";
import { toolCatalog } from "../../../components/toolCatalog";

export function generateStaticParams() {
  return toolCatalog.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolCatalog.find((item) => item.slug === slug);
  if (!tool) return { title: "Tool not found", robots: { index: false, follow: true } };

  const title = `${tool.name} – Free Online Tool`;
  const description = tool.description.length > 155 ? tool.description.slice(0, 152).trimEnd() + "..." : tool.description;
  const keywords = [...new Set([tool.name, ...tool.keywords.split(/[, ]+/).filter(Boolean), "free online tool", "NIROJ Tools"])];
  const canonical = `/tools/${tool.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: { type: "website", title, description, url: canonical, siteName: "NIROJ Tools" },
    twitter: { card: "summary", title, description },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ToolWorkspace slug={slug} />;
}
