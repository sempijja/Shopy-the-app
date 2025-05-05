
// This is a basic service worker implementation
const CACHE_NAME = "shopy-cache-v1";
const BASE_PATH = "/Shopy-the-app";
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/favicons/android-icon-192x192.png`,
  `${BASE_PATH}/favicons/apple-icon-180x180.png`,
  `${BASE_PATH}/favicons/favicon-96x96.png`
];

// Install the service worker
self.addEventListener("install", (event) => {
  console.log('Service worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch requests and serve from cache
self.addEventListener("fetch", (event) => {
  // Ignore chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  console.log('Fetching:', event.request.url);

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Handle API requests separately
self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith("https://api.example.com")) {
    event.respondWith(
      caches.open("api-cache").then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => caches.match(event.request));
      })
    );
  }
});

// Activate the service worker and clean up old caches
self.addEventListener("activate", (event) => {
  console.log('Service worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// This ensures the service worker takes control immediately
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
