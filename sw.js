const CACHE_NAME = 'pgm-league-v156';
const urlsToCache = [
  '/index.html',
  '/manifest.json',
  '/generated-images/A_beautiful_realistic_football_2026-04-02T19-41-49.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  // 立即激活新版本
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // 删除旧缓存
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 立即控制所有页面
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 获取新版本后更新缓存
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败时使用缓存
        return caches.match(event.request);
      })
  );
});
