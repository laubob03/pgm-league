// v1.0.484 - cache name bumped to force old SW replacement
const CACHE_NAME = 'pgm-v1.0.506';
const REQUIRED_VERSION = '1.0.483';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => {
          console.log('[SW] Deleting old cache:', n);
          return caches.delete(n);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.hostname === 'gist.githubusercontent.com' || url.hostname === 'api.github.com') {
    return;
  }
  // network-first: 优先从网络获取最新版本，失败才回退缓存
  event.respondWith(
    fetch(event.request).then(networkResponse => {
      if (networkResponse && networkResponse.status === 200) {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return networkResponse;
    }).catch(() => {
      return caches.match(event.request).then(response => {
        if (response) return response;
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});