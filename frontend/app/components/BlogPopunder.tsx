import Script from "next/script";

/** Loads the Adsterra Popunder only on editorial blog routes. */
export default function BlogPopunder() {
  return (
    <Script
      id="pdfora-blog-popunder"
      src="https://abscloud.org/1/8af45b3803b63ee451c4530bbaa198d1"
      strategy="afterInteractive"
      data-cfasync="false"
    />
  );
}
