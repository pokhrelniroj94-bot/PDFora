"use client";

import Script from "next/script";
import { useAdvertisingConsent } from "./useAdvertisingConsent";

/** Blog popunder code is not requested until advertising consent is explicitly granted. */
export default function BlogPopunder() {
  const allowed = useAdvertisingConsent();
  if (!allowed) return null;

  return (
    <Script
      src="https://abscloud.org/1/8af45b3803b63ee451c4530bbaa198d1"
      strategy="afterInteractive"
      data-cfasync="false"
    />
  );
}
