const CACHE_NAME = 'pgm-league-v364';

// ★ v1.0.363: 不再预缓存 index.html，避免 install 时抓到 CDN 旧版形成死锁
const urlsToCache = [
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  const method = event.request.method;

  if (url.includes('api.github.com') || url.includes('gist.githubusercontent.com') || url.includes('github.com/')) {
    return;
  }

  // ★ v1.0.363: 关键文件用全新 URL 构造请求 → CDN 零缓存，不走 304
  if (url.includes('sw.js') || url.includes('version.json') || url.endsWith('index.html') || url.endsWith('/')) {
    var base = url.split('?')[0];
    var bustedUrl = base + (base.indexOf('?') > -1 ? '&' : '?') + '_noc=' + Date.now();
    event.respondWith(
      fetch(new Request(bustedUrl, {
        method: 'GET',
        headers: event.request.headers,
        mode: 'same-origin',
        credentials: 'same-origin'
      }))
      .then(function(response) { return response; })
      .catch(function() { return caches.match(event.request); })
    );
    return;
  }

  if (method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || (response.status !== 200 && response.status !== 304)) {
          return caches.match(event.request).then(cached => cached || response);
        }
        if (response.status === 304) return response;
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});