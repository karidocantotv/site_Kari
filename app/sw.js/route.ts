import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const buildVersion = process.env.CF_PAGES_COMMIT_SHA || process.env.NEXT_PUBLIC_BUILD_VERSION || 'dev';

export async function GET() {
  const worker = `
const BUILD_VERSION = ${JSON.stringify(buildVersion)};
const CACHE_NAME = 'kari-do-canto-' + BUILD_VERSION;
const OFFLINE_URL = '/';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/manifest.webmanifest'])));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('kari-do-canto-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match(event.request).then((cached) => cached || caches.match(OFFLINE_URL)))
  );
});
`;

  return new NextResponse(worker, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Service-Worker-Allowed': '/',
    },
  });
}
