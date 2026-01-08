const CACHE_NAME = 'geo-location-v2.1'; // バージョンを上げてください
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'sw.js',
  'icon-192.png'
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', // ライブラリもキャッシュ
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'   // ライブラリもキャッシュ
];

// --- 1. インストール時にファイルを強制的にキャッシュ ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('キャッシュを開始します');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// --- 2. 更新通知用のメッセージ受け取り ---
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// --- 3. 古いキャッシュを完全に消去（ストレージ確保） ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // アクティブ化したらすぐに制御を開始
  self.clients.claim();
});

// --- 4. 【重要】オフラインエラー（Load failed）対策のフェッチ処理 ---
self.addEventListener('fetch', (event) => {
  // ブラウザ拡張機能などの http 以外のリクエストを除外
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 1. キャッシュがあればそれを返す
      if (response) {
        return response;
      }

      // 2. キャッシュになければネットワークに取りに行く
      return fetch(event.request).catch(() => {
        // 3. ネットワークも失敗（オフライン）したらエラーを投げずに空のレスポンスを返す
        // これで「TypeError: Load failed」を回避します
        console.log('オフラインアクセス: キャッシュなし');
        return new Response('Offline content unavailable');
      });
    })
  );
});


