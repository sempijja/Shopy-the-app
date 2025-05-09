// Import Workbox from the CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Cache name with version
const CACHE_NAME = "shopy-cache-v1";

// Essential files to cache (for Vercel/static hosting, use root-relative paths)
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicons/android-icon-192x192.png",
  "/favicons/apple-icon-180x180.png",
  "/favicons/favicon-96x96.png",
  "/robots.txt",
  "/placeholder.svg",
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
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate and clean up old caches
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
          return Promise.resolve();
        })
      );
    }).then(() => {
      // Take control of all clients ASAP
      return self.clients.claim();
    })
  );
});

// Fetch requests and serve from cache with network fallback
self.addEventListener("fetch", (event) => {
  // Ignore non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Ignore requests to the `stories` directory
  if (event.request.url.includes('/stories/')) {
    console.log('Ignoring stories file:', event.request.url);
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }
      
      // Clone the request because it's a one-time use stream
      const fetchRequest = event.request.clone();
      
      // Make network request and cache the response
      return fetch(fetchRequest).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response because it's a one-time use stream
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(() => {
        // If fetch fails, return a fallback response for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match("/index.html");
        }
        return new Response('Network error occurred', {
          status: 408,
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      });
    })
  );
});

// This ensures the service worker takes control immediately
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Use Workbox to handle Supabase API requests
if (self.workbox) {
  workbox.routing.registerRoute(
    new RegExp('https://[a-z0-9-]+\\.supabase\\.co/.*'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'supabase-api-cache',
      networkTimeoutSeconds: 10,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 1 week
        }),
      ],
    })
  );

  // Cache static assets like CSS, JS, and images
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'static-assets-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
        }),
      ],
    })
  );
}