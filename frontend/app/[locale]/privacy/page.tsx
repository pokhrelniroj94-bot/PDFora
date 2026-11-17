import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HindiStaticPage from "../../../components/HindiStaticPage";
import { isRoutable } from "../../../lib/i18n/config";
import { buildLocaleMetadata } from "../../../lib/i18n/metadata";
export async function generateMetadata():Promise<Metadata>{return buildLocaleMetadata({locale:"hi",path:"/privacy",title:"गोपनीयता नीति | PDFora",description:"PDFora में फ़ाइल प्रोसेसिंग, तकनीकी जानकारी, कुकी और विज्ञापन से जुड़े गोपनीयता विवरण पढ़ें।"});}
export default function HindiPage(){if(!isRoutable("hi"))notFound();return <HindiStaticPage page="privacy"/>;}
