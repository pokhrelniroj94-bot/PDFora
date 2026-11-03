import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PDFora – Nepal Tools & Market News",
    short_name: "PDFora",
    description: "Useful online tools and Nepal market updates.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
  };
}
