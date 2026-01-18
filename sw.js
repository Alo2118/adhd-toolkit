// Importa versione da file centralizzato
importScripts('./version.js');
const CACHE_NAME = `come-stai-v${APP_VERSION.replace(/\./g, '-')}`;
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './version.js',
  // Modular CSS
  './src/styles/variables.css',
  './src/styles/base.css',
  './src/styles/animations.css',
  './src/styles/components.css',
  // Modular JavaScript
  './src/main.js',
  './src/config/version.js',
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
  const url = new URL(event.request.url);

  // Network-first for app files (always get latest version)
  const isAppFile = url.origin === self.location.origin &&
                    (url.pathname.endsWith('.html') ||
                     url.pathname.endsWith('.css') ||
                     url.pathname.endsWith('.js') ||
                     url.pathname === '/' ||
                     url.pathname.endsWith('/'));

  if (isAppFile) {
    // Network-first: try network, fallback to cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => cachedResponse || caches.match('./index.html'));
        })
    );
  } else {
    // Cache-first for external resources (fonts, libraries)
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
          });
        })
    );
  }
});
