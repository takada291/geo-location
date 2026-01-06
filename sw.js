const CACHE_NAME = 'geo-app-v1.2'; // v1.2に上げる20260106
// ... urlsToCache の記述 ...

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  // 【重要】新しいSWを即座に有効化する
  self.skipWaiting(); 
});

// 【追加】古いキャッシュを削除する処理（これを書かないと古いファイルが残り続けます）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除中:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
