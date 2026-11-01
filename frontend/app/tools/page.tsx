import type { Metadata } from "next";
import { ToolsDirectory } from "../../components/AllTools";
export const metadata: Metadata = { title:"All Online Tools", description:"Free finance, text, developer, image and PDF tools in one place." };
export default function ToolsPage(){return <ToolsDirectory/>;}
