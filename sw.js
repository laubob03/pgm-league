// v1.0.453
const CACHE_NAME = 'pgm-league-v459';
const REQUIRED_VERSION = '1.0.453';

self.addEventListener('install', event => {
  event.waitUntil(Promise.resolve());
});

self.addEventListener('activate', event => {
  event.waitUntil(Promise.resolve());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.hostname === 'gist.githubusercontent.com' || url.hostname === 'api.github.com') {
    return;
  }
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        if (response) return response;
        return fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => fetch(event.request))
  );
});
