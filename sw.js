// v1.0.395: Service Worker - no cache, clear all old caches
const CACHE_NAME = 'pgm-league-v395';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // All requests go directly to network, no caching
  event.respondWith(
    fetch(event.request).catch(() => new Response('Offline', { status: 503 }))
  );
});
