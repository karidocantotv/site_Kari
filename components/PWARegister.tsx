'use client';

import { useEffect } from 'react';
import { SITE_VERSION } from '@/lib/site-version';

export default function PWARegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    const register = async () => {
      try {
        const swUrl = `/sw.js?v=${encodeURIComponent(SITE_VERSION)}`;
        const desiredScriptUrl = new URL(swUrl, window.location.origin).href;
        const registrations = await navigator.serviceWorker.getRegistrations();

        // Remove an older registration so the current build takes control immediately.
        for (const registration of registrations) {
          if (registration.scope === `${window.location.origin}/`) {
            const activeUrl = registration.active?.scriptURL || registration.waiting?.scriptURL || registration.installing?.scriptURL || '';
            if (activeUrl && activeUrl !== desiredScriptUrl) {
              await registration.unregister();
            }
          }
        }

        const registration = await navigator.serviceWorker.register(swUrl, { scope: '/' });
        await registration.update();

        window.setInterval(() => {
          registration.update().catch(() => undefined);
        }, 60 * 60 * 1000);
      } catch {
        // PWA is an enhancement; the site continues to work normally if registration fails.
      }
    };

    register();
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, []);

  return null;
}
