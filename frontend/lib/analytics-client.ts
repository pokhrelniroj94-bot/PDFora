"use client";

import { sendGAEvent } from "@next/third-parties/google";

type AnalyticsValue = string | number | boolean;

export function trackConsentAwareEvent(event: string, parameters: Record<string, AnalyticsValue>) {
  try {
    const saved = window.localStorage.getItem("pdfora-cookie-preferences-v1");
    const preferences = saved ? JSON.parse(saved) as { analytics?: boolean } : null;
    if (preferences?.analytics !== true) return;
    sendGAEvent({ event, ...parameters });
  } catch {
    // Analytics is optional; storage or tracking failures must never block a tool.
  }
}
