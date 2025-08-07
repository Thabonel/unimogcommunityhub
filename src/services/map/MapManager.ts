import mapboxgl from 'mapbox-gl';

class MapManagerClass {
  private static instance: MapManagerClass;
  private mapInstance: mapboxgl.Map | null = null;
  
  private constructor() {}
  
  static getInstance(): MapManagerClass {
    if (!MapManagerClass.instance) {
      MapManagerClass.instance = new MapManagerClass();
    }
    return MapManagerClass.instance;
  }
  
  setMap(map: mapboxgl.Map) {
    this.mapInstance = map;
  }
  
  getMap(): mapboxgl.Map | null {
    return this.mapInstance;
  }
  
  setStyle(style: string) {
    if (this.mapInstance) {
      this.mapInstance.setStyle(style);
    }
  }
  
  flyTo(center: [number, number], zoom?: number) {
    if (this.mapInstance) {
      this.mapInstance.flyTo({
        center,
        zoom: zoom || 10,
        essential: true
      });
    }
  }
  
  clear() {
    this.mapInstance = null;
  }
}

const MapManager = MapManagerClass.getInstance();
export default MapManager;