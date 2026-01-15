// Service Worker for Unimog Community Hub
// Version 2.0.0 - Proper cache management with update notifications

const CACHE_NAME = 'unimog-hub-v2';
const VERSION = '2.0.0';

// Assets to pre-cache on install (critical files only)
const PRECACHE_ASSETS = [
  '/',
  '/index.html'
];

// Cache strategies:
// - HTML: Network-first (always try to get latest)
// - JS/CSS with hash: Cache-first (immutable, safe to cache)
// - API calls: Network-only (never cache)
// - Images: Cache-first with network fallback

self.addEventListener('install', (event) => {
  console.log('[SW] Installing version', VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching critical assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Don't skip waiting - let the app control when to update
        console.log('[SW] Install complete, waiting for activation');
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version', VERSION);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (APIs, CDNs, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip API and Supabase requests
  if (url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/rest') ||
      url.pathname.includes('supabase')) {
    return;
  }

  // Strategy based on request type
  if (isNavigationRequest(event.request)) {
    // HTML pages: Network-first, fall back to cache
    event.respondWith(networkFirst(event.request));
  } else if (isHashedAsset(url.pathname)) {
    // Hashed assets (JS/CSS with content hash): Cache-first
    event.respondWith(cacheFirst(event.request));
  } else if (isStaticAsset(url.pathname)) {
    // Other static assets: Stale-while-revalidate
    event.respondWith(staleWhileRevalidate(event.request));
  }
  // Let browser handle everything else normally
});

// Check if this is a navigation request (HTML page)
function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         request.headers.get('accept')?.includes('text/html');
}

// Check if asset has content hash (safe to cache long-term)
function isHashedAsset(pathname) {
  // Vite generates hashes like: index-BBXSc4WM.js, style-abc123.css
  return /\/assets\/.*-[a-zA-Z0-9]{8,}\.(js|css)$/.test(pathname);
}

// Check if it's a static asset
function isStaticAsset(pathname) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$/.test(pathname);
}

// Network-first strategy (for HTML)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page or let it fail
    return caches.match('/index.html');
  }
}

// Cache-first strategy (for hashed assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch:', request.url);
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);

  return cachedResponse || fetchPromise;
}

// Listen for skip waiting message from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received skip waiting message, activating new version');
    self.skipWaiting();
  }
});

console.log('[SW] Service worker loaded, version', VERSION);
