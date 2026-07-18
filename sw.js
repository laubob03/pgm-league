// sw.js — unregister-only mode (自动注销+走网络)
// 本文件仅用于自动注销旧的 Service Worker 注册，不缓存任何请求
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  // 全部走网络，不缓存
  event.respondWith(fetch(event.request));
});
