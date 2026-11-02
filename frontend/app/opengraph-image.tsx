import { ImageResponse } from "next/og";

export const alt = "PDFora — free online PDF and Nepal utility tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#f8fafc", color: "#0f172a", fontFamily: "Arial" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, fontWeight: 800 }}>P</div>
        <div style={{ fontSize: 58, fontWeight: 800, letterSpacing: -2 }}>PDFora</div>
      </div>
      <div style={{ marginTop: 42, fontSize: 48, fontWeight: 750, lineHeight: 1.15, maxWidth: 980 }}>Free online PDF tools and useful Nepal utilities</div>
      <div style={{ marginTop: 28, fontSize: 27, color: "#475569" }}>Merge · Split · Compress · Convert · Calculate</div>
      <div style={{ marginTop: 55, width: 150, height: 10, borderRadius: 10, background: "#f97316" }} />
      <div style={{ position: "absolute", right: 80, bottom: 58, fontSize: 22, color: "#64748b" }}>pd-fora.vercel.app</div>
    </div>,
    size
  );
}