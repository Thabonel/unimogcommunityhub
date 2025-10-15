// Service Worker for Unimog Community Hub
// Version 1.0.5 - Fix reload loop while preventing white screens

const CACHE_VERSION = 8; // Increment this to trigger cache update
const CACHE_NAME = `unimog-hub-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `unimog-hub-dynamic-v${CACHE_VERSION}`;
const MAX_DYNAMIC_CACHE_SIZE = 50; // Reduced to prevent bloat

// Resources to cache immediately
// IMPORTANT: HTML files are NEVER cached, only assets
const STATIC_CACHE_URLS = [
  '/manifest.json',
  '/offline.html',
];

// Patterns for resources that are safe to cache (images, fonts, etc)
const CACHE_PATTERNS = {
  images: /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i,
  fonts: /\.(woff|woff2|ttf|otf)$/i,
  documents: /\.(pdf)$/i,
};

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static resources');
      return cache.addAll(STATIC_CACHE_URLS).catch((error) => {
        console.error('[Service Worker] Failed to cache static resources:', error);
      });
    })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Clean up old caches
        ...cacheNames
          .filter((cacheName) => {
            // Keep font caches and google font caches
            const isOldCache = cacheName.startsWith('unimog-hub-') &&
                              cacheName !== CACHE_NAME &&
                              cacheName !== DYNAMIC_CACHE_NAME;
            const shouldDelete = isOldCache &&
                                !cacheName.includes('font') &&
                                !cacheName.includes('google');
            return shouldDelete;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }),
        // Notify all clients about the update
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'SERVICE_WORKER_UPDATED',
              version: CACHE_VERSION
            });
          });
        })
      ]);
    })
  );

  // Claim any currently available clients
  self.clients.claim();
});

// Fetch event - SIMPLIFIED to prevent reload loops
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip non-http requests (chrome extensions, etc)
  if (!request.url.startsWith('http')) {
    return;
  }

  // CRITICAL: NEVER intercept HTML navigation - let browser handle it naturally
  // This prevents reload loops while still allowing offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        // Only show offline page if network completely fails
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // CRITICAL: NEVER cache JavaScript bundles - always fetch fresh
  // This prevents white screens from stale JS
  if (url.pathname.startsWith('/assets/') && url.pathname.endsWith('.js')) {
    event.respondWith(
      fetch(request).catch(() => {
        // On network failure, don't serve stale JS - just fail
        return new Response('Network error', { status: 503 });
      })
    );
    return;
  }

  // Cache CSS files (safe to cache with content hashing)
  if (url.pathname.endsWith('.css')) {
    event.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request).then(response => {
          if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE_NAME);
            cache.then(c => c.put(request, response.clone()));
          }
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Cache images, fonts, and static assets (safe to cache)
  if (shouldCache(request)) {
    event.respondWith(
      caches.match(request).then(cached => {
        return cached || fetch(request).then(response => {
          if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE_NAME);
            cache.then(c => c.put(request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }

  // Everything else - just fetch normally (no caching)
  // This includes API calls which should always be fresh
});


// Check if resource should be cached (only images, fonts, PDFs)
function shouldCache(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Check against cache patterns
  for (const [type, pattern] of Object.entries(CACHE_PATTERNS)) {
    if (pattern.test(path)) {
      return true;
    }
  }

  return false;
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    cacheUrls(event.data.urls);
  }
});

// Cache specific URLs on demand
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        cache.put(url, response);
      }
    } catch (error) {
      console.error('[Service Worker] Failed to cache:', url, error);
    }
  }
}