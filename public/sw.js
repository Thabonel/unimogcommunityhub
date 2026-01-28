// Service Worker for Unimog Community Hub
// Version 2.1.0 - Fix stale asset handling after deployments

const CACHE_NAME = 'unimog-hub-v2.1';
const VERSION = '2.1.0';

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
        // Skip waiting to activate immediately - important for fixing stale asset issues
        console.log('[SW] Install complete, skipping wait to activate immediately');
        return self.skipWaiting();
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
    // Verify cached response has correct content-type for JS/CSS files
    const contentType = cachedResponse.headers.get('content-type') || '';
    const url = new URL(request.url);

    if (url.pathname.endsWith('.js') && !contentType.includes('javascript')) {
      console.log('[SW] Cached JS file has wrong content-type, fetching fresh:', request.url);
      // Don't return cached HTML masquerading as JS
    } else if (url.pathname.endsWith('.css') && !contentType.includes('css')) {
      console.log('[SW] Cached CSS file has wrong content-type, fetching fresh:', request.url);
      // Don't return cached HTML masquerading as CSS
    } else {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);

    // Only cache if response is OK and has correct content-type
    if (networkResponse.ok) {
      const contentType = networkResponse.headers.get('content-type') || '';
      const url = new URL(request.url);

      // Verify we got the right file type, not an HTML error page
      const isValidJS = url.pathname.endsWith('.js') && contentType.includes('javascript');
      const isValidCSS = url.pathname.endsWith('.css') && contentType.includes('css');

      if (isValidJS || isValidCSS) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      } else {
        console.log('[SW] Asset returned wrong content-type, not caching:', request.url, contentType);
        // Asset no longer exists (deployment changed hashes), trigger reload
        notifyClientsToReload();
      }
    } else if (networkResponse.status === 404) {
      // Asset no longer exists after deployment
      console.log('[SW] Asset not found (404), likely stale after deployment:', request.url);
      notifyClientsToReload();
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch:', request.url);
    throw error;
  }
}

// Notify all clients to reload due to stale assets
function notifyClientsToReload() {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'RELOAD_REQUIRED', reason: 'stale_assets' });
    });
  });
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
