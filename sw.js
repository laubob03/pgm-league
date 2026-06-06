// v1.0.398: Service Worker - no cache, clear all old caches
const CACHE_NAME = 'pgm-league-v398';
self.addEventListener('install', (event) => {
  console.log('[SW v398] Installing...');
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  console.log('[SW v398] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name.startsWith('pgm-league-')).map((name) => {
          console.log('[SW v398] Deleting old cache:', name);
          return caches.delete(name);
        })
      );
    }).then(() => {
      console.log('[SW v398] Activated - all old caches cleared');
      return self.clients.claim();
    })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[SW v398] Deleting cached:', event.request.url);
        caches.delete('pgm-league-v398');
      }
      return fetch(event.request);
    })
  );
});