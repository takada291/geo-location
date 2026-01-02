const CACHE_NAME = 'geo-app-v2'; // ここをv1からv2に変えるだけで更新されます
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
  self.skipWaiting(); // すぐに新しい設定を適用する
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
