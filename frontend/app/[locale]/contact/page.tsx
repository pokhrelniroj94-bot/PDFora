import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HindiStaticPage from "../../../components/HindiStaticPage";
import { isRoutable } from "../../../lib/i18n/config";
import { buildLocaleMetadata } from "../../../lib/i18n/metadata";
export async function generateMetadata():Promise<Metadata>{return buildLocaleMetadata({locale:"hi",path:"/contact",title:"संपर्क करें | PDFora",description:"PDFora के टूल में समस्या, सुझाव और गोपनीयता संबंधी प्रश्न भेजने के तरीके देखें।"});}
export default function HindiPage(){if(!isRoutable("hi"))notFound();return <HindiStaticPage page="contact"/>;}
