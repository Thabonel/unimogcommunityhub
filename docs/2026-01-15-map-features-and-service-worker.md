# Map Features & Service Worker Implementation

**Date**: January 15, 2026
**Status**: Deployed to Production
**Commits**: `c87f261de`, `4327da180`, `b98938321`, `cfb75ab24`

---

## Overview

This document covers the implementation of Australian map overlays, proper service worker with graceful update notifications, and UI improvements for the Trip Planner map.

---

## 1. Australian Map Overlays

### Implementation Summary

Added real-time data overlays for Australian users with sample data fallbacks when government APIs are blocked by CORS.

### Files Changed

- `src/services/australianOverlaysService.ts` - Core service with API calls and fallback data
- `src/components/trips/map/MapOptionsDropdown.tsx` - UI toggles and map layer rendering

### Overlays Implemented

| Overlay | Data Source | Fallback |
|---------|-------------|----------|
| Active Fires | NASA FIRMS API | 8 sample fire points across AU |
| National Parks | CAPAD (Dept of Environment) | 7 major parks (Blue Mountains, Kakadu, etc.) |
| State Forests | ABARES | 4 state forests |
| Mobile Phone Coverage | ACCC | All 6 carriers with metro coverage areas |

### Mobile Phone Coverage Details

Individual carrier toggles with color coding:

| Carrier | Color |
|---------|-------|
| Telstra 4G | #0066CC (Blue) |
| Telstra 5G | #0099FF (Light Blue) |
| Optus 4G | #00AA00 (Green) |
| Optus 5G | #00DD00 (Light Green) |
| TPG/Vodafone 4G | #CC0000 (Red) |
| TPG/Vodafone 5G | #FF3333 (Light Red) |

### Sample Data Fallback

Government APIs (CAPAD, ABARES, ACCC) are blocked by CORS in browser requests. The service automatically falls back to comprehensive sample data:

```typescript
// Example: Sample fires across Australian states
const SAMPLE_FIRES = {
  type: 'FeatureCollection',
  features: [
    // NSW - Blue Mountains area
    { coordinates: [150.5, -33.8], brightness: 340, confidence: 'high' },
    // VIC - Gippsland
    { coordinates: [147.5, -37.8], brightness: 320, confidence: 'medium' },
    // QLD - Near Brisbane
    { coordinates: [152.8, -27.2], brightness: 355, confidence: 'high' },
    // ... more across WA, SA, NT
  ]
};
```

### Hidden Features

**Social Layers** (Friends, Community) were hidden from the menu as they used mock US data (California coordinates) that wasn't relevant for the Australian app:

```typescript
{/* Social Layers Section - Hidden until real data integration */}
{/* TODO: Re-enable when friend tracking and community features are implemented */}
```

---

## 2. Service Worker Implementation

### Problem Solved

After deployments, users with cached browser history would see blank pages due to old JavaScript chunk filenames (e.g., `index-DN2SC8YO.js`) no longer existing. The server returns HTML instead of JS, causing `Unexpected token '<'` errors.

### Previous Quick Fix (Removed)

Auto-reload on error detection - worked but caused surprise page reloads:

```javascript
// REMOVED - Quick fix that auto-reloaded on stale chunks
window.addEventListener('error', function(event) {
  if (isChunkError) window.location.reload();
});
```

### Long-Term Solution

Proper service worker with cache strategies and graceful update notifications.

### Files

- `public/sw.js` - New service worker with proper caching
- `src/hooks/use-service-worker.ts` - React hook for registration and updates
- `src/components/ui/update-notification.tsx` - User-facing update toast

### Cache Strategies

| Request Type | Strategy | Rationale |
|--------------|----------|-----------|
| HTML pages | Network-first | Always try to get latest version |
| Hashed assets (`index-abc123.js`) | Cache-first | Immutable, safe to cache forever |
| Other static assets | Stale-while-revalidate | Serve cached, update in background |
| API calls | Network-only (bypass) | Never cache dynamic data |

### Service Worker Code

```javascript
// public/sw.js - Key strategies

// Network-first for HTML
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return caches.match(request) || caches.match('/index.html');
  }
}

// Cache-first for hashed assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}
```

### Update Flow

1. Service worker detects new version available
2. Hook dispatches `app-update-available` event
3. `UpdateNotification` component shows toast
4. User clicks "Refresh Now" when ready
5. Service worker activates, page reloads

```typescript
// use-service-worker.ts
if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
  window.dispatchEvent(new CustomEvent('app-update-available'));
}
```

### User Experience

- Toast notification: "Update Available - A new version is ready"
- Two buttons: "Refresh Now" | "Later"
- No surprise reloads
- Checks for updates hourly + on tab focus

---

## 3. UI Fixes

### My Location Button Repositioned

**Problem**: Button overlapped map zoom controls on the right side.

**Solution**: Moved from top-right to top-left.

**Files Changed**:
- `src/components/dashboard/fires/FiresMapView.tsx`
- `src/components/maps/FiresMapV2.tsx`

```typescript
// Before
className="absolute top-14 right-3 z-10 ..."

// After
className="absolute top-3 left-3 z-10 ..."
```

---

## 4. Deployment Summary

| Commit | Description | Staging | Production |
|--------|-------------|---------|------------|
| `c87f261de` | Hide non-functional Social Layers | Yes | Yes |
| `4327da180` | Quick-fix auto-reload (later removed) | Yes | Yes |
| `b98938321` | Proper service worker implementation | Yes | Yes |
| `cfb75ab24` | Move My Location button to top-left | Yes | Yes |

### Linear Issues

- [WHE-94](https://linear.app/wheels-and-wins/issue/WHE-94) - Map Options Cleanup
- [WHE-95](https://linear.app/wheels-and-wins/issue/WHE-95) - Service Worker Implementation

---

## 5. Testing Notes

### To Test Map Overlays

1. Go to Trip Planner (`/trips/plan`)
2. Click the Layers button (top-right)
3. Toggle each overlay under "Map Overlays":
   - Traffic (Mapbox real-time data)
   - Fires (sample points across AU)
   - Phone Coverage (expand to see carrier toggles)
   - National Parks (polygon overlays)
   - State Forests (polygon overlays)

### To Test Service Worker

1. Deploy a new version
2. User with old version should see "Update Available" toast
3. Click "Refresh Now" to get new version
4. Check console for `[SW]` logs

### To Test My Location Button

1. Go to Dashboard > Traffic tab
2. "My Location" button should be in top-left corner
3. Should not overlap zoom controls

---

## 6. Future Improvements

### Map Overlays

- [ ] Implement real API calls via server-side proxy to bypass CORS
- [ ] Add weather overlay (BOM data)
- [ ] Add road conditions overlay
- [ ] Re-enable Social Layers when friend tracking is implemented

### Service Worker

- [ ] Add offline page fallback
- [ ] Pre-cache critical routes on install
- [ ] Add background sync for offline actions

---

## 7. Architecture Reference

### Map Options Dropdown State

```typescript
// Overlay toggles
const [overlays, setOverlays] = useState({
  traffic: false,
  fires: false,
  phoneCoverage: false,
  nationalParks: false,
  stateForests: false
});

// Individual carrier toggles (when phoneCoverage enabled)
const [carrierToggles, setCarrierToggles] = useState<Record<CarrierKey, boolean>>({
  telstra_4g: false,
  telstra_5g: false,
  optus_4g: false,
  optus_5g: false,
  tpg_4g: false,
  tpg_5g: false
});

// POI filters (working with Mapbox Search API)
const [poiFilters, setPoiFilters] = useState({
  wide_parking: false,
  pet_stops: false,
  medical: false,
  farmers_markets: false,
  user_pois: false
});

// Social layers (hidden - mock data only)
const [socialLayers, setSocialLayers] = useState({
  friends: false,
  community: false
});
```

### Service Worker Registration Flow

```
App.tsx
  └─ useServiceWorker hook
       └─ navigator.serviceWorker.register('/sw.js')
            └─ on 'updatefound' → dispatch 'app-update-available'
                 └─ UpdateNotification listens → shows toast
                      └─ User clicks "Refresh Now"
                           └─ postMessage({ type: 'SKIP_WAITING' })
                                └─ sw.js activates → page reloads
```
