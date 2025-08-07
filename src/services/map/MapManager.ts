import mapboxgl from 'mapbox-gl';
import { getMapboxTokenFromAnySource } from '@/utils/mapbox-helper';

/**
 * Singleton manager for Mapbox map instance
 * Ensures only one map instance exists at any time
 */
class MapManager {
  private static instance: mapboxgl.Map | null = null;
  private static containerEl: HTMLDivElement | null = null;
  private static isInitializing: boolean = false;
  private static initPromise: Promise<mapboxgl.Map> | null = null;

  /**
   * Get or create map instance
   */
  static async getMap(
    container: HTMLDivElement,
    options: {
      center?: [number, number];
      zoom?: number;
      style?: string;
    } = {}
  ): Promise<mapboxgl.Map> {
    // If already initializing, wait for it
    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    // If we have an instance and it's the same container, return it
    if (this.instance && this.containerEl === container) {
      try {
        // Check if map is still valid by trying to get its container
        this.instance.getContainer();
        console.log('MapManager: Returning existing map instance');
        return this.instance;
      } catch (e) {
        // Map is no longer valid, clean up
        console.log('MapManager: Map instance is invalid, cleaning up');
        this.cleanup();
      }
    }

    // If container changed, cleanup and create new
    if (this.instance && this.containerEl !== container) {
      console.log('MapManager: Container changed, cleaning up');
      this.cleanup();
    }

    // Create new map instance
    this.isInitializing = true;
    this.initPromise = this.createMap(container, options);
    
    try {
      const map = await this.initPromise;
      this.isInitializing = false;
      this.initPromise = null;
      return map;
    } catch (error) {
      this.isInitializing = false;
      this.initPromise = null;
      throw error;
    }
  }

  /**
   * Create a new map instance
   */
  private static createMap(
    container: HTMLDivElement,
    options: {
      center?: [number, number];
      zoom?: number;
      style?: string;
    }
  ): Promise<mapboxgl.Map> {
    return new Promise((resolve, reject) => {
      console.log('MapManager: Creating new map instance');
      
      const token = getMapboxTokenFromAnySource();
      if (!token) {
        reject(new Error('No Mapbox token found'));
        return;
      }

      mapboxgl.accessToken = token;

      try {
        const map = new mapboxgl.Map({
          container,
          style: options.style || 'mapbox://styles/mapbox/outdoors-v12',
          center: options.center || [9.1829, 48.7758],
          zoom: options.zoom || 5,
          attributionControl: true
        });

        // Add controls
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
        map.addControl(
          new mapboxgl.ScaleControl({
            maxWidth: 100,
            unit: 'metric'
          }),
          'bottom-right'
        );

        // Wait for map to load
        map.on('load', () => {
          console.log('MapManager: Map loaded successfully');
          this.instance = map;
          this.containerEl = container;
          resolve(map);
        });

        map.on('error', (e) => {
          console.error('MapManager: Map error', e);
          if (e.error?.message?.includes('container') || e.error?.message?.includes('removed')) {
            // Ignore container-related errors during cleanup
            return;
          }
          reject(e.error);
        });
      } catch (error) {
        console.error('MapManager: Failed to create map', error);
        reject(error);
      }
    });
  }

  /**
   * Update map style
   */
  static setStyle(style: string): void {
    if (this.instance) {
      try {
        console.log('MapManager: Updating map style to', style);
        this.instance.setStyle(style);
      } catch (e) {
        console.error('MapManager: Failed to set style', e);
      }
    }
  }

  /**
   * Update map center and zoom
   */
  static flyTo(center: [number, number], zoom?: number): void {
    if (this.instance) {
      try {
        console.log('MapManager: Flying to', center, zoom);
        this.instance.flyTo({
          center,
          zoom: zoom || this.instance.getZoom(),
          essential: true
        });
      } catch (e) {
        console.error('MapManager: Failed to fly to location', e);
      }
    }
  }

  /**
   * Get current map instance (may be null)
   */
  static getCurrentInstance(): mapboxgl.Map | null {
    return this.instance;
  }

  /**
   * Check if map is initialized
   */
  static isInitialized(): boolean {
    if (!this.instance) return false;
    try {
      // Check if map is valid by trying to get its container
      this.instance.getContainer();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Cleanup map instance
   */
  static cleanup(): void {
    console.log('MapManager: Cleaning up map instance');
    if (this.instance) {
      try {
        this.instance.remove();
      } catch (error) {
        console.error('MapManager: Error during cleanup', error);
      }
      this.instance = null;
      this.containerEl = null;
    }
  }
}

export default MapManager;