import { ImageResponse } from "next/og";
import { getToolGuide } from "../../lib/tool-guides";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getToolGuide(slug);
  const title = guide?.name ?? slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  const description = guide?.purpose ?? "Free online PDF tool for everyday document tasks";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "78px", background: "#f8fafc", color: "#0f172a", fontFamily: "Arial" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 800 }}>P</div>
        <div style={{ fontSize: 48, fontWeight: 800 }}>PDFora</div>
        <div style={{ marginLeft: 18, padding: "10px 18px", borderRadius: 24, background: "#dbeafe", color: "#1d4ed8", fontSize: 22, fontWeight: 700 }}>PDF tools</div>
      </div>
      <div style={{ marginTop: 52, fontSize: title.length > 30 ? 48 : 60, fontWeight: 800, lineHeight: 1.12, maxWidth: 1030 }}>{title}</div>
      <div style={{ marginTop: 24, fontSize: 28, color: "#475569", lineHeight: 1.35, maxWidth: 1000 }}>{description.slice(0, 105)}</div>
      <div style={{ marginTop: 48, width: 145, height: 9, borderRadius: 9, background: "#f97316" }} />
      <div style={{ position: "absolute", right: 78, bottom: 54, fontSize: 22, color: "#64748b" }}>Free online tool · PDFora</div>
    </div>,
    size
  );
}
