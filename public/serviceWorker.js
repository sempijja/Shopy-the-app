// This is a basic service worker implementation
const CACHE_NAME = "shopy-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicons/android-icon-192x192.png",
  "/favicons/apple-icon-180x180.png",
  "/favicons/favicon-96x96.png",
  "/src/main.tsx"
];

// Install the service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
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

// Activate the service worker and clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
