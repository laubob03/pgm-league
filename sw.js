// v1.0.443
const CACHE_NAME = 'pgm-league-v443';
const REQUIRED_VERSION = '1.0.443';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  // ★ v1.0.427: 不拦截 GitHub API / Gist raw 请求，防止 SW 缓存导致云端同步失败
  const url = event.request.url;
  if (url.includes('api.github.com') || url.includes('gist.githubusercontent.com')) {
    return; // 放行，不经过 SW
  }
  // Network-first for HTML, cache-first for static assets
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match(event.request).then(r => r || new Response('Offline', { status: 503 })))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        }).catch(() => cached);
      })
    );
  }
});