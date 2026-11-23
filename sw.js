const cacheName = 'salute-static-v3';
const assets = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith('salute-static-') && key !== cacheName)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const paths = assets.map(asset => new URL(asset, self.registration.scope).href);
  if (request.method !== 'GET' || !paths.includes(request.url)) return;

  event.respondWith(fetch(request).catch(async () =>
    (await caches.open(cacheName)).match(request)));
});
