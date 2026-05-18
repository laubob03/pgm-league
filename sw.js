// v1.0.365: 终极修复 �?最简 SW，不缓存任何东西，安装即清除所有旧缓存
const CACHE_NAME = 'pgm-league-v372';

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
  // 所有请求直接走网络，不做任何缓�?  event.respondWith(
    fetch(event.request).catch(() => new Response('Offline', { status: 503 }))
  );
});
