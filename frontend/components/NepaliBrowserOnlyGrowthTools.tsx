"use client";
import BrowserOnlyGrowthTools from "./BrowserOnlyGrowthTools";
const labels:Record<string,string>={"email-signature-generator":"व्यावसायिक इमेल हस्ताक्षर निर्माता","timezone-meeting-planner":"समय क्षेत्र बैठक योजनाकार","image-dpi-calculator":"तस्बिर DPI तथा PPI क्याल्कुलेटर","video-bitrate-calculator":"भिडियो बिटरेट क्याल्कुलेटर","markdown-table-generator":"Markdown तालिका निर्माता"};
export default function NepaliBrowserOnlyGrowthTools({slug}:{slug:"email-signature-generator"|"timezone-meeting-planner"|"image-dpi-calculator"|"video-bitrate-calculator"|"markdown-table-generator"}) {
 return <section lang="ne"><h2 className="sr-only">{labels[slug]}</h2><BrowserOnlyGrowthTools slug={slug} locale="ne"/></section>;
}