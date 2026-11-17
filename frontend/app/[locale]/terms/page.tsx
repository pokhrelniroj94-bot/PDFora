import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HindiStaticPage from "../../../components/HindiStaticPage";
import { isRoutable } from "../../../lib/i18n/config";
import { buildLocaleMetadata } from "../../../lib/i18n/metadata";
export async function generateMetadata():Promise<Metadata>{return buildLocaleMetadata({locale:"hi",path:"/terms",title:"सेवा की शर्तें | PDFora",description:"PDFora टूल इस्तेमाल करने की शर्तें, उपयोगकर्ता जिम्मेदारियाँ और सेवा सीमाएँ पढ़ें।"});}
export default function HindiPage(){if(!isRoutable("hi"))notFound();return <HindiStaticPage page="terms"/>;}
