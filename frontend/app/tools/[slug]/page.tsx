import type { Metadata } from "next";
import ToolWorkspace from "../../../components/AllTools";
import { toolCatalog } from "../../../components/toolCatalog";
export function generateStaticParams(){return toolCatalog.map(t=>({slug:t.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const tool=toolCatalog.find(t=>t.slug===slug);return {title:tool?.name??"Tool",description:tool?.description??"Online utility tool"};}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <ToolWorkspace slug={slug}/>;}
