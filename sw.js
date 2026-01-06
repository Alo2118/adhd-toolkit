// Versione app - deve corrispondere a index.html e manifest.json
const APP_VERSION = '1.2.0';
const CACHE_NAME = `come-stai-v${APP_VERSION.replace(/\./g, '-')}`;
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // Modular CSS
  './src/styles/variables.css',
  './src/styles/base.css',
  './src/styles/animations.css',
  './src/styles/components.css',
  // Modular JavaScript
  './src/main.js',
  './src/data/feelings.js',
  './src/data/triggers.js',
  './src/data/moods.js',
  './src/data/learn.js',
  './src/data/strategies.js',
  './src/data/responses.js',
  './src/utils/state.js',
  './src/utils/storage.js',
  './src/utils/helpers.js',
  './src/components/garden.js',
  './src/report/pdf-generator.js',
  // External resources
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        }).catch(() => {
          return caches.match('./index.html');
        });
      })
  );
});
