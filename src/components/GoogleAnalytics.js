"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  return GA_ID ? (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      ></Script>
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  ) : null;
}
