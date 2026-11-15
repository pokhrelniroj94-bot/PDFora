"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackConsentAwareEvent } from "../lib/analytics-client";

export default function ToolViewAnalytics({ toolSlug, toolCategory }: { toolSlug: string; toolCategory: string }) {
  const pathname = usePathname() || "/";
  useEffect(() => {
    trackConsentAwareEvent("tool_view", {
      tool_slug: toolSlug,
      tool_category: toolCategory,
      language: pathname === "/ne" || pathname.startsWith("/ne/") ? "ne" : "en",
    });
  }, [toolSlug, toolCategory, pathname]);
  return null;
}
