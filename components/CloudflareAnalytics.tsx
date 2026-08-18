'use client';

import Script from 'next/script';

export default function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN;
  if (!token) return null;

  return (
    <Script
      id="cloudflare-web-analytics"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="lazyOnload"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
