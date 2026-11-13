import Script from "next/script";

/** Popunder is intentionally loaded only by the Blog index and Blog article routes. */
export default function BlogPopunder() {
  return (
    <Script
      src="https://abscloud.org/1/8af45b3803b63ee451c4530bbaa198d1"
      strategy="afterInteractive"
      data-cfasync="false"
    />
  );
}
