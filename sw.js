// v1.0.365: 缁堟瀬淇 锟?鏈€绠€ SW锛屼笉缂撳瓨浠讳綍涓滆タ锛屽畨瑁呭嵆娓呴櫎鎵€鏈夋棫缂撳瓨
const CACHE_NAME = 'pgm-league-v380';

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
  // 鎵€鏈夎姹傜洿鎺ヨ蛋缃戠粶锛屼笉鍋氫换浣曠紦锟?  event.respondWith(
    fetch(event.request).catch(() => new Response('Offline', { status: 503 }))
  );
});
