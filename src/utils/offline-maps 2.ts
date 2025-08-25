import mapboxgl from 'mapbox-gl';

/**
 * Configuration for offline map caching
 */
export const OFFLINE_MAP_CONFIG = {
  // Maximum zoom level to cache
  maxZoom: 16,
  // Minimum zoom level to cache
  minZoom: 10,
  // Tile size
  tileSize: 512,
  // Maximum cache size in MB
  maxCacheSize: 500,
  // Cache expiration in days
  cacheExpiration: 30,
};

/**
 * Calculate tiles needed for a given bounds and zoom range
 */
export function calculateTilesForBounds(
  bounds: mapboxgl.LngLatBounds,
  minZoom: number,
  maxZoom: number
): Array<{ x: number; y: number; z: number }> {
  const tiles: Array<{ x: number; y: number; z: number }> = [];
  
  for (let z = minZoom; z <= maxZoom; z++) {
    const min = lngLatToTile(bounds.getSouthWest().lng, bounds.getSouthWest().lat, z);
    const max = lngLatToTile(bounds.getNorthEast().lng, bounds.getNorthEast().lat, z);
    
    for (let x = min.x; x <= max.x; x++) {
      for (let y = max.y; y <= min.y; y++) {
        tiles.push({ x, y, z });
      }
    }
  }
  
  return tiles;
}

/**
 * Convert lng/lat to tile coordinates
 */
function lngLatToTile(lng: number, lat: number, zoom: number) {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
    Math.pow(2, zoom)
  );
  
  return { x, y };
}

/**
 * Create a cache key for a tile
 */
export function createTileCacheKey(
  style: string,
  source: string,
  x: number,
  y: number,
  z: number
): string {
  return `tile-${style}-${source}-${z}-${x}-${y}`;
}

/**
 * Cache map tiles for offline use
 */
export async function cacheMapRegion(
  map: mapboxgl.Map,
  bounds: mapboxgl.LngLatBounds,
  onProgress?: (progress: number) => void
): Promise<void> {
  if (!('caches' in window)) {
    throw new Error('Cache API not supported');
  }

  const cache = await caches.open('mapbox-tiles');
  const tiles = calculateTilesForBounds(
    bounds,
    OFFLINE_MAP_CONFIG.minZoom,
    OFFLINE_MAP_CONFIG.maxZoom
  );
  
  const totalTiles = tiles.length;
  let cachedTiles = 0;
  
  console.log(`[Offline Maps] Caching ${totalTiles} tiles...`);
  
  // Get current map style
  const style = map.getStyle();
  if (!style || !style.sources) return;
  
  // Process tiles in batches to avoid overwhelming the browser
  const batchSize = 10;
  
  for (let i = 0; i < tiles.length; i += batchSize) {
    const batch = tiles.slice(i, i + batchSize);
    
    await Promise.all(
      batch.map(async (tile) => {
        try {
          // Cache each layer source
          for (const [sourceId, source] of Object.entries(style.sources)) {
            if (source.type === 'vector' || source.type === 'raster') {
              const url = constructTileUrl(source, tile);
              if (url) {
                const response = await fetch(url);
                if (response.ok) {
                  await cache.put(url, response.clone());
                }
              }
            }
          }
          
          cachedTiles++;
          
          if (onProgress) {
            onProgress((cachedTiles / totalTiles) * 100);
          }
        } catch (error) {
          console.error(`[Offline Maps] Failed to cache tile ${tile.z}/${tile.x}/${tile.y}:`, error);
        }
      })
    );
  }
  
  console.log(`[Offline Maps] Cached ${cachedTiles} tiles successfully`);
}

/**
 * Construct tile URL from source and tile coordinates
 */
function constructTileUrl(
  source: any,
  tile: { x: number; y: number; z: number }
): string | null {
  if (source.tiles && source.tiles.length > 0) {
    // Use the first tile URL template
    let url = source.tiles[0];
    
    // Replace placeholders
    url = url.replace('{z}', tile.z.toString());
    url = url.replace('{x}', tile.x.toString());
    url = url.replace('{y}', tile.y.toString());
    
    return url;
  }
  
  return null;
}

/**
 * Clear cached map tiles
 */
export async function clearMapCache(): Promise<void> {
  if (!('caches' in window)) return;
  
  await caches.delete('mapbox-tiles');
  console.log('[Offline Maps] Map cache cleared');
}

/**
 * Get cache size estimate
 */
export async function getMapCacheSize(): Promise<number> {
  if (!('caches' in window)) return 0;
  
  const cache = await caches.open('mapbox-tiles');
  const keys = await cache.keys();
  
  let totalSize = 0;
  
  for (const request of keys) {
    const response = await cache.match(request);
    if (response && response.headers.get('content-length')) {
      totalSize += parseInt(response.headers.get('content-length') || '0', 10);
    }
  }
  
  return totalSize / (1024 * 1024); // Return size in MB
}

/**
 * Download map region for offline use with UI feedback
 */
export function downloadMapRegionForOffline(
  map: mapboxgl.Map,
  regionName: string,
  bounds: mapboxgl.LngLatBounds
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Store region info
    const regions = getOfflineRegions();
    regions.push({
      id: Date.now().toString(),
      name: regionName,
      bounds: bounds.toArray(),
      downloadedAt: new Date().toISOString(),
    });
    localStorage.setItem('offline-map-regions', JSON.stringify(regions));
    
    // Start caching
    cacheMapRegion(map, bounds, (progress) => {
      console.log(`[Offline Maps] Download progress: ${progress.toFixed(1)}%`);
    })
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Get list of offline regions
 */
export function getOfflineRegions(): Array<{
  id: string;
  name: string;
  bounds: [[number, number], [number, number]];
  downloadedAt: string;
}> {
  const stored = localStorage.getItem('offline-map-regions');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Delete offline region
 */
export async function deleteOfflineRegion(regionId: string): Promise<void> {
  const regions = getOfflineRegions();
  const filtered = regions.filter(r => r.id !== regionId);
  localStorage.setItem('offline-map-regions', JSON.stringify(filtered));
  
  // Note: We can't selectively delete tiles for a specific region
  // This would require more sophisticated cache management
}