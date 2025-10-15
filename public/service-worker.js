// Service Worker for Unimog Community Hub
// Version 1.0.6 - DISABLED to fix reload glitch
// The service worker was causing reload loops - completely disabled for now

const CACHE_VERSION = 9;

// Install event - just skip waiting, don't cache anything
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing v9 - DISABLED MODE');
  self.skipWaiting();
});

// Activate event - delete ALL old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating v9 - DISABLED MODE');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Delete ALL caches
        ...cacheNames.map((cacheName) => {
          console.log('[Service Worker] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        }),
        // Claim clients
        self.clients.claim()
      ]);
    })
  );
});

// Fetch event - DO NOT INTERCEPT ANYTHING
// Let all requests pass through to the network naturally
self.addEventListener('fetch', (event) => {
  // Do nothing - let browser handle all requests normally
  return;
});

console.log('[Service Worker] v9 loaded - All caching disabled, passthrough mode active');
