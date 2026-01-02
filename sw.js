const CACHE_NAME = 'geo-app-v3'; // バージョンをv3に上げる
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'sw.js',
  'icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
