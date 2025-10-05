// Unimog Community Hub - Service Worker
// Minimal PWA implementation for offline support

const CACHE_NAME = 'unimog-pwa-v1';
const RUNTIME_CACHE = 'unimog-runtime-v1';

// Core shell files to cache on install
const SHELL_FILES = [
  '/',
  '/index.html',
  '/site.webmanifest'
];

// Install event - cache shell files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching shell files');
        return cache.addAll(SHELL_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - network-first strategy with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (POST/PUT/DELETE for Barry AI, etc.)
  if (request.method !== 'GET') {
    return;
  }

  // Skip Supabase API calls (Barry AI, Auth, Database)
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // Skip external APIs
  if (url.hostname.includes('googleapis.com') ||
      url.hostname.includes('mapbox.com') ||
      url.hostname.includes('facebook.net')) {
    return;
  }

  // Handle same-origin requests with network-first strategy
  if (url.origin === self.location.origin) {
    event.respondWith(
      networkFirst(request)
    );
  }
});

// Network-first strategy: try network, fall back to cache
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses (but skip HTML to avoid stale pages)
    if (networkResponse.ok && !request.url.includes('.html')) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }

    // If cache miss and it's a navigation request, return index.html for SPA routing
    if (request.mode === 'navigate') {
      const shellCache = await caches.open(CACHE_NAME);
      const indexResponse = await shellCache.match('/index.html');

      if (indexResponse) {
        console.log('[SW] Serving index.html for offline navigation');
        return indexResponse;
      }
    }

    // Nothing worked, return error
    return new Response('Offline - No cached content available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// Listen for messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
