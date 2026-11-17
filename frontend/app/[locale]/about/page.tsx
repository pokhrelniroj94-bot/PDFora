import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HindiStaticPage from "../../../components/HindiStaticPage";
import { isRoutable } from "../../../lib/i18n/config";
import { buildLocaleMetadata } from "../../../lib/i18n/metadata";
export async function generateMetadata():Promise<Metadata>{return buildLocaleMetadata({locale:"hi",path:"/about",title:"हमारे बारे में | PDFora",description:"PDFora के उद्देश्य, उपलब्ध PDF टूल और ऑनलाइन उपयोगिताओं के बारे में जानें।"});}
export default function HindiPage(){if(!isRoutable("hi"))notFound();return <HindiStaticPage page="about"/>;}
