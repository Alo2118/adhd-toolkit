// Versione app - aggiornata per refactoring
const APP_VERSION = '2.6.0';
const CACHE_NAME = `come-stai-v${APP_VERSION.replace(/\./g, '-')}`;

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './src/main.js',
  './src/styles/variables.css',
  './src/styles/base.css',
  './src/styles/components.css',
  './src/styles/screens.css',
  './src/styles/onboarding.css',
  './src/styles/tools.css',
  './src/data/feelings.js',
  './src/data/triggers.js',
  './src/data/strategies.js',
  './src/data/responses.js',
  './src/data/content.js',
  './src/utils/state.js',
  './src/utils/storage.js',
  './src/utils/helpers.js',
  './src/utils/notifications.js',
  './src/components/garden.js',
  './src/components/tasks.js',
  './src/components/history.js',
  './src/components/tools.js',
  './src/views/home.js',
  './src/views/flow.js',
  './src/views/diary.js',
  './src/views/tasks.js',
  './src/views/tools.js',
  './src/views/settings.js',
  './src/views/legal.js',
  './src/views/wizard.js',
  './src/data/wizard.js',
  './src/styles/wizard.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
    // Non chiamiamo skipWaiting() qui: il nuovo SW resta in attesa
    // finché l'utente non clicca "Aggiorna" nel banner.
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
      .then(() => {
        // Notify all open tabs that a new version is active
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'SW_UPDATED', version: APP_VERSION });
          });
        });
      })
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
          if (!response || response.status !== 200 || response.type !== 'basic') {
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

// --- Background Notifications (best-effort) ---
const DB_NAME = 'adhd-toolkit';
const STORE_NAME = 'tasks';

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveTasks(tasks, settings) {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.clear();
  (tasks || []).forEach(task => store.put(task));
  if (settings) {
    store.put({ id: '__settings__', notificationSettings: settings });
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getTasks() {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => resolve([]);
  });
}

async function getSettings() {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve) => {
    const request = store.get('__settings__');
    request.onsuccess = () => resolve(request.result?.notificationSettings || {});
    request.onerror = () => resolve({});
  });
}

async function scheduleNotificationChecks(tasks) {
  const now = Date.now();
  const settings = await getSettings();
  const stuckDays = settings.taskStuckDays || 3;
  const deadlineDays = settings.deadlineWarningDays || 2;
  const stuckMs = stuckDays * 86400000;
  const deadlineMs = deadlineDays * 86400000;

  tasks.filter(t => t.status === 'active' && t.id !== '__settings__').forEach(task => {
    const createdAt = task.createdAt ? new Date(task.createdAt).getTime() : null;
    const deadlineAt = task.deadline ? new Date(task.deadline).getTime() : null;
    const nextOccurrenceAt = task.nextOccurrence ? new Date(task.nextOccurrence).getTime() : null;

    if (!task.recurring?.enabled && createdAt && !task.notifiedStuckAt && now >= createdAt + stuckMs) {
      self.registration.showNotification('Compito fermo', {
        body: `“${task.name}” è fermo da ${stuckDays} giorni.`,
        tag: `${task.id}:stuck`,
        icon: 'icon-192.png'
      });
      task.notifiedStuckAt = new Date().toISOString();
    }

    if (!task.recurring?.enabled && deadlineAt && deadlineAt > now && !task.notifiedDeadlineAt && now >= deadlineAt - deadlineMs) {
      self.registration.showNotification('Scadenza vicina', {
        body: `“${task.name}” scade tra ${deadlineDays} giorni.`,
        tag: `${task.id}:deadline`,
        icon: 'icon-192.png'
      });
      task.notifiedDeadlineAt = new Date().toISOString();
    }

    if (task.recurring?.enabled && nextOccurrenceAt) {
      if (!task.notifiedRecurringStuckAt && now >= nextOccurrenceAt + stuckMs) {
        self.registration.showNotification('Compito ricorrente fermo', {
          body: `“${task.name}” è fermo da ${stuckDays} giorni.`,
          tag: `${task.id}:recurring-stuck`,
          icon: 'icon-192.png'
        });
        task.notifiedRecurringStuckAt = new Date().toISOString();
      }

      if (!task.notifiedRecurringUpcomingAt && nextOccurrenceAt > now && now >= nextOccurrenceAt - deadlineMs) {
        self.registration.showNotification('Compito ricorrente in arrivo', {
          body: `“${task.name}” è previsto tra ${deadlineDays} giorni.`,
          tag: `${task.id}:recurring-upcoming`,
          icon: 'icon-192.png'
        });
        task.notifiedRecurringUpcomingAt = new Date().toISOString();
      }
    }
  });

  saveTasks(tasks, settings);
}

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'TASKS_SYNC') {
    const payload = event.data.payload || {};
    const tasks = payload.tasks || [];
    const settings = payload.settings || {};
    event.waitUntil(saveTasks(tasks, settings));
  }
  if (event.data?.type === 'GET_VERSION') {
    event.source?.postMessage({ type: 'SW_VERSION', version: APP_VERSION });
  }
});

self.addEventListener('periodicsync', event => {
  if (event.tag === 'adhd-notifications') {
    event.waitUntil(
      getTasks().then(tasks => scheduleNotificationChecks(tasks))
    );
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(clients => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow('./');
      }
    }));
});
