"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { usePrivacyConsent } from "./PrivacyConsent";

export default function ConsentAwareAnalytics() {
  const { consent } = usePrivacyConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!consent?.analytics || !gaId) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
