// v1.0.496 - unregister-only SW
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(
    self.registration.unregister().then(() => self.clients.matchAll()).then(clients => {
      clients.forEach(c => c.navigate(c.url));
    })
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
