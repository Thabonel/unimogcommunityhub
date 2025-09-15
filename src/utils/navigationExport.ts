import { Waypoint } from '@/types/waypoint';
import { DirectionsRoute } from '@/services/mapboxDirections';
import { toast } from 'sonner';

export interface ExportOption {
  id: string;
  name: string;
  category: 'mobile' | 'desktop' | 'gps' | 'file';
  action: (waypoints: Waypoint[], route: DirectionsRoute | null) => void;
}

// Platform detection
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

// Coordinate formatting utilities
const formatCoordinate = (lat: number, lon: number): string => {
  return `${lat},${lon}`;
};

const formatWaypoints = (waypoints: Waypoint[]): string => {
  return waypoints.map(wp => formatCoordinate(wp.coords[1], wp.coords[0])).join('/');
};

// Mobile navigation apps
export const openGoogleMaps = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length < 2) {
    toast.error('Need at least 2 waypoints for navigation');
    return;
  }

  const start = formatCoordinate(waypoints[0].coords[1], waypoints[0].coords[0]);
  const end = formatCoordinate(waypoints[waypoints.length - 1].coords[1], waypoints[waypoints.length - 1].coords[0]);
  
  let url: string;
  
  if (waypoints.length === 2) {
    url = `https://www.google.com/maps/dir/${start}/${end}`;
  } else {
    // Include all waypoints for multi-point routes
    const waypointStr = formatWaypoints(waypoints);
    url = `https://www.google.com/maps/dir/${waypointStr}`;
  }
  
  window.open(url, '_blank');
  toast.success('Opening in Google Maps');
};

export const openAppleMaps = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length < 2) {
    toast.error('Need at least 2 waypoints for navigation');
    return;
  }

  const start = formatCoordinate(waypoints[0].coords[1], waypoints[0].coords[0]);
  const end = formatCoordinate(waypoints[waypoints.length - 1].coords[1], waypoints[waypoints.length - 1].coords[0]);
  
  const url = `http://maps.apple.com/?saddr=${start}&daddr=${end}`;
  window.open(url, '_blank');
  toast.success('Opening in Apple Maps');
};

export const openWaze = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length < 2) {
    toast.error('Need at least 2 waypoints for navigation');
    return;
  }

  // Waze works best with destination only
  const destination = waypoints[waypoints.length - 1];
  const url = `https://waze.com/ul?ll=${destination.coords[1]},${destination.coords[0]}&navigate=yes`;
  
  window.open(url, '_blank');
  toast.success('Opening in Waze');
};

export const openKomoot = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length < 2) {
    toast.error('Need at least 2 waypoints for navigation');
    return;
  }

  const start = waypoints[0];
  const end = waypoints[waypoints.length - 1];

  // Build URL with proper waypoint format for Komoot
  let url = `https://www.komoot.com/plan?sport=touring`;

  // Add start point
  url += `&from=${start.coords[1]},${start.coords[0]}`;

  // Add destination
  url += `&to=${end.coords[1]},${end.coords[0]}`;

  // Add intermediate waypoints if more than 2 points
  if (waypoints.length > 2) {
    const intermediatePoints = waypoints.slice(1, -1);
    intermediatePoints.forEach((waypoint, index) => {
      url += `&waypoint_${index}=${waypoint.coords[1]},${waypoint.coords[0]}`;
    });
  }

  window.open(url, '_blank');
  toast.success('Opening in Komoot');
};

// GPS Device Export Functions
export const exportToGarmin = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  // Export as GPX format optimized for Garmin devices
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Unimog Community" xmlns="http://www.topografix.com/GPX/1/1" xmlns:garmin="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
  <metadata>
    <name>Garmin Route Export</name>
    <desc>Route exported for Garmin GPS devices from Unimog Community</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;

  // Add waypoints with Garmin-specific extensions
  waypoints.forEach((waypoint, index) => {
    gpxContent += `  <wpt lat="${waypoint.coords[1]}" lon="${waypoint.coords[0]}">
    <name>${waypoint.name || `WP${String(index + 1).padStart(3, '0')}`}</name>
    <sym>Flag, Blue</sym>
    <type>user</type>
    <extensions>
      <garmin:WaypointExtension>
        <garmin:DisplayMode>SymbolAndName</garmin:DisplayMode>
      </garmin:WaypointExtension>
    </extensions>
  </wpt>
`;
  });

  // Add route if exists
  if (route?.geometry?.coordinates) {
    gpxContent += `  <rte>
    <name>Unimog Route</name>
`;
    route.geometry.coordinates.forEach((coord: [number, number], index: number) => {
      gpxContent += `    <rtept lat="${coord[1]}" lon="${coord[0]}">
      <name>RT${String(index + 1).padStart(3, '0')}</name>
    </rtept>
`;
    });
    gpxContent += `  </rte>
`;
  }

  gpxContent += `</gpx>`;

  downloadFile(gpxContent, 'garmin-route.gpx', 'application/gpx+xml');
  toast.success('Garmin GPX file downloaded');
};

export const exportToTomTom = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  // TomTom OV2 format simulation via GPX
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Unimog Community" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>TomTom Route Export</name>
    <desc>Route exported for TomTom GPS devices from Unimog Community</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;

  waypoints.forEach((waypoint, index) => {
    gpxContent += `  <wpt lat="${waypoint.coords[1]}" lon="${waypoint.coords[0]}">
    <name>${(waypoint.name || `Waypoint ${index + 1}`).substring(0, 20)}</name>
    <sym>Waypoint</sym>
    <type>waypoint</type>
  </wpt>
`;
  });

  gpxContent += `</gpx>`;

  downloadFile(gpxContent, 'tomtom-route.gpx', 'application/gpx+xml');
  toast.success('TomTom GPX file downloaded');
};

export const exportToNavman = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  // Navman compatible GPX
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Unimog Community" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Navman Route</name>
    <desc>Route for Navman GPS devices</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;

  waypoints.forEach((waypoint, index) => {
    gpxContent += `  <wpt lat="${waypoint.coords[1]}" lon="${waypoint.coords[0]}">
    <name>WP${index + 1}</name>
    <desc>${waypoint.name || `Waypoint ${index + 1}`}</desc>
    <sym>Flag</sym>
  </wpt>
`;
  });

  gpxContent += `</gpx>`;

  downloadFile(gpxContent, 'navman-route.gpx', 'application/gpx+xml');
  toast.success('Navman GPX file downloaded');
};

export const exportToHema = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  // Hema Explorer optimized GPX
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Unimog Community" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Hema Route Export</name>
    <desc>Off-road route for Hema Explorer GPS from Unimog Community</desc>
    <keywords>4WD, off-road, exploration</keywords>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;

  waypoints.forEach((waypoint, index) => {
    gpxContent += `  <wpt lat="${waypoint.coords[1]}" lon="${waypoint.coords[0]}">
    <name>${waypoint.name || `Camp ${index + 1}`}</name>
    <desc>Unimog waypoint ${index + 1}</desc>
    <sym>Campground</sym>
    <type>waypoint</type>
  </wpt>
`;
  });

  // Add track for off-road navigation
  if (route?.geometry?.coordinates) {
    gpxContent += `  <trk>
    <name>Unimog Track</name>
    <desc>Off-road track for 4WD navigation</desc>
    <type>4WD Track</type>
    <trkseg>
`;
    route.geometry.coordinates.forEach((coord: [number, number]) => {
      gpxContent += `      <trkpt lat="${coord[1]}" lon="${coord[0]}" />
`;
    });
    gpxContent += `    </trkseg>
  </trk>
`;
  }

  gpxContent += `</gpx>`;

  downloadFile(gpxContent, 'hema-4wd-route.gpx', 'application/gpx+xml');
  toast.success('Hema Explorer GPX file downloaded');
};

export const exportToMagellan = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  // Magellan eXplorist compatible format
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Unimog Community" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Magellan Route</name>
    <desc>Route for Magellan eXplorist GPS</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;

  waypoints.forEach((waypoint, index) => {
    gpxContent += `  <wpt lat="${waypoint.coords[1]}" lon="${waypoint.coords[0]}">
    <name>WPT${String(index + 1).padStart(3, '0')}</name>
    <desc>${waypoint.name || `Waypoint ${index + 1}`}</desc>
    <sym>dot</sym>
  </wpt>
`;
  });

  gpxContent += `</gpx>`;

  downloadFile(gpxContent, 'magellan-route.gpx', 'application/gpx+xml');
  toast.success('Magellan GPX file downloaded');
};

export const exportToLowrance = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  // Lowrance HDS compatible GPX
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Unimog Community" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Lowrance Route</name>
    <desc>Marine/Land route for Lowrance GPS</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;

  waypoints.forEach((waypoint, index) => {
    gpxContent += `  <wpt lat="${waypoint.coords[1]}" lon="${waypoint.coords[0]}">
    <name>WP_${index + 1}</name>
    <desc>${waypoint.name || `Point ${index + 1}`}</desc>
    <sym>square</sym>
    <type>user</type>
  </wpt>
`;
  });

  gpxContent += `</gpx>`;

  downloadFile(gpxContent, 'lowrance-route.gpx', 'application/gpx+xml');
  toast.success('Lowrance GPX file downloaded');
};

// Specialized Mapping Apps
export const openGaiaGPS = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  // Gaia GPS works best with GPX files, so we'll generate a Gaia-optimized GPX
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Unimog Community - Gaia GPS Export" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gaia="http://www.gaiagps.com/gaia">
  <metadata>
    <name>Unimog Route - Gaia GPS</name>
    <desc>Off-road route for Gaia GPS from Unimog Community trip planner</desc>
    <author>
      <name>Unimog Community Hub</name>
    </author>
    <time>${new Date().toISOString()}</time>
    <keywords>4WD, off-road, navigation, unimog</keywords>
  </metadata>
`;

  // Add waypoints with Gaia GPS friendly formatting
  waypoints.forEach((waypoint, index) => {
    const wpName = waypoint.name || `Waypoint ${index + 1}`;
    const wpType = index === 0 ? 'Start' : index === waypoints.length - 1 ? 'Finish' : 'Waypoint';

    gpxContent += `  <wpt lat="${waypoint.coords[1]}" lon="${waypoint.coords[0]}">
    <name>${wpName}</name>
    <desc>${wpType} - ${wpName}</desc>
    <sym>${index === 0 ? 'Flag, Green' : index === waypoints.length - 1 ? 'Flag, Red' : 'Waypoint'}</sym>
    <type>${wpType.toLowerCase()}</type>
    <extensions>
      <gaia:icon>${index === 0 ? 'start' : index === waypoints.length - 1 ? 'finish' : 'waypoint'}</gaia:icon>
    </extensions>
  </wpt>
`;
  });

  // Add route track if exists (Gaia GPS loves tracks)
  if (route?.geometry?.coordinates) {
    gpxContent += `  <trk>
    <name>Unimog Navigation Route</name>
    <desc>Turn-by-turn route for off-road navigation</desc>
    <type>4WD Route</type>
    <extensions>
      <gaia:color>#FF6600</gaia:color>
      <gaia:opacity>0.8</gaia:opacity>
      <gaia:width>4</gaia:width>
    </extensions>
    <trkseg>
`;
    route.geometry.coordinates.forEach((coord: [number, number]) => {
      gpxContent += `      <trkpt lat="${coord[1]}" lon="${coord[0]}" />
`;
    });
    gpxContent += `    </trkseg>
  </trk>
`;
  }

  gpxContent += `</gpx>`;

  downloadFile(gpxContent, 'gaia-gps-route.gpx', 'application/gpx+xml');
  toast.success('Gaia GPS file downloaded - Import into Gaia GPS app');
};

export const openMemoryMap = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  // Memory-Map uses GPX format, so we'll generate and download a Memory-Map optimized GPX
  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Unimog Community" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Memory-Map Route</name>
    <desc>Route for Memory-Map navigation from Unimog Community</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;

  // Add waypoints with Memory-Map friendly naming
  waypoints.forEach((waypoint, index) => {
    gpxContent += `  <wpt lat="${waypoint.coords[1]}" lon="${waypoint.coords[0]}">
    <name>${waypoint.name || `Point${index + 1}`}</name>
    <desc>Waypoint ${index + 1}</desc>
    <sym>Waypoint</sym>
    <type>waypoint</type>
  </wpt>
`;
  });

  // Add route if exists
  if (route?.geometry?.coordinates) {
    gpxContent += `  <rte>
    <name>Unimog Route</name>
    <desc>Navigation route for Memory-Map</desc>
`;
    route.geometry.coordinates.forEach((coord: [number, number], index: number) => {
      gpxContent += `    <rtept lat="${coord[1]}" lon="${coord[0]}">
      <name>R${index + 1}</name>
    </rtept>
`;
    });
    gpxContent += `  </rte>
`;
  }

  gpxContent += `</gpx>`;

  downloadFile(gpxContent, 'memory-map-route.gpx', 'application/gpx+xml');
  toast.success('Memory-Map GPX file downloaded');
};

export const openMapsMe = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length < 2) {
    toast.error('Need at least 2 waypoints for navigation');
    return;
  }

  // Maps.me (now Organic Maps) URL scheme
  const destination = waypoints[waypoints.length - 1];

  // Try Maps.me URL scheme first, fallback to web
  const mapsmeUrl = `mapsme://route?sll=${waypoints[0].coords[1]},${waypoints[0].coords[0]}&dll=${destination.coords[1]},${destination.coords[0]}&type=vehicle`;

  // Try to open the app URL scheme
  const link = document.createElement('a');
  link.href = mapsmeUrl;
  link.click();

  // Fallback to web version after a short delay
  setTimeout(() => {
    const webUrl = `https://maps.organic-maps.app/#map=15/${destination.coords[1]}/${destination.coords[0]}`;
    window.open(webUrl, '_blank');
  }, 1000);

  toast.success('Opening in Maps.me / Organic Maps');
};

// File export functions
export const exportToGPX = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Unimog Community" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Route Export</name>
    <desc>Route exported from Unimog Community trip planner</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
`;

  // Add waypoints
  waypoints.forEach((waypoint, index) => {
    gpxContent += `  <wpt lat="${waypoint.coords[1]}" lon="${waypoint.coords[0]}">
    <name>${waypoint.name || `Waypoint ${index + 1}`}</name>
    <type>${waypoint.type || 'waypoint'}</type>
  </wpt>
`;
  });

  // Add track if route exists
  if (route?.geometry?.coordinates) {
    gpxContent += `  <trk>
    <name>Route Track</name>
    <trkseg>
`;
    route.geometry.coordinates.forEach((coord: [number, number]) => {
      gpxContent += `      <trkpt lat="${coord[1]}" lon="${coord[0]}" />
`;
    });
    gpxContent += `    </trkseg>
  </trk>
`;
  }

  gpxContent += `</gpx>`;

  downloadFile(gpxContent, 'route.gpx', 'application/gpx+xml');
  toast.success('GPX file downloaded');
};

export const exportToKML = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Route Export</name>
    <description>Route exported from Unimog Community trip planner</description>
`;

  // Add waypoints as placemarks
  waypoints.forEach((waypoint, index) => {
    kmlContent += `    <Placemark>
      <name>${waypoint.name || `Waypoint ${index + 1}`}</name>
      <description>Type: ${waypoint.type || 'waypoint'}</description>
      <Point>
        <coordinates>${waypoint.coords[0]},${waypoint.coords[1]},0</coordinates>
      </Point>
    </Placemark>
`;
  });

  // Add route line if exists
  if (route?.geometry?.coordinates) {
    kmlContent += `    <Placemark>
      <name>Route</name>
      <description>Navigation route</description>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>
`;
    route.geometry.coordinates.forEach((coord: [number, number]) => {
      kmlContent += `          ${coord[0]},${coord[1]},0
`;
    });
    kmlContent += `        </coordinates>
      </LineString>
    </Placemark>
`;
  }

  kmlContent += `  </Document>
</kml>`;

  downloadFile(kmlContent, 'route.kml', 'application/vnd.google-earth.kml+xml');
  toast.success('KML file downloaded');
};

export const exportToGeoJSON = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  const features: any[] = [];

  // Add waypoints as point features
  waypoints.forEach((waypoint, index) => {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: waypoint.coords
      },
      properties: {
        name: waypoint.name || `Waypoint ${index + 1}`,
        type: waypoint.type || 'waypoint',
        marker: index === 0 ? 'start' : index === waypoints.length - 1 ? 'end' : 'waypoint'
      }
    });
  });

  // Add route as LineString if exists
  if (route?.geometry?.coordinates) {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: route.geometry.coordinates
      },
      properties: {
        name: 'Route',
        distance: route.distance,
        duration: route.duration
      }
    });
  }

  const geoJSON = {
    type: 'FeatureCollection',
    features
  };

  downloadFile(JSON.stringify(geoJSON, null, 2), 'route.geojson', 'application/geo+json');
  toast.success('GeoJSON file downloaded');
};

export const exportToCSV = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0) {
    toast.error('No waypoints to export');
    return;
  }

  let csvContent = 'Name,Latitude,Longitude,Type\n';
  
  waypoints.forEach((waypoint, index) => {
    const name = (waypoint.name || `Waypoint ${index + 1}`).replace(/,/g, ';');
    csvContent += `"${name}",${waypoint.coords[1]},${waypoint.coords[0]},"${waypoint.type || 'waypoint'}"\n`;
  });

  downloadFile(csvContent, 'waypoints.csv', 'text/csv');
  toast.success('CSV file downloaded');
};

// Utility function to download files
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Export options configuration
export const getExportOptions = (): ExportOption[] => [
  // Mobile Navigation Apps
  {
    id: 'google-maps',
    name: 'Google Maps',
    category: 'mobile',
    action: openGoogleMaps
  },
  {
    id: 'apple-maps',
    name: 'Apple Maps',
    category: 'mobile',
    action: openAppleMaps
  },
  {
    id: 'waze',
    name: 'Waze',
    category: 'mobile',
    action: openWaze
  },
  {
    id: 'komoot',
    name: 'Komoot',
    category: 'desktop',
    action: openKomoot
  },
  {
    id: 'memory-map',
    name: 'Memory-Map',
    category: 'desktop',
    action: openMemoryMap
  },
  {
    id: 'maps-me',
    name: 'Maps.me / Organic Maps',
    category: 'mobile',
    action: openMapsMe
  },
  // GPS Devices
  {
    id: 'gaia-gps',
    name: 'Gaia GPS',
    category: 'gps',
    action: openGaiaGPS
  },
  {
    id: 'garmin',
    name: 'Garmin GPS',
    category: 'gps',
    action: exportToGarmin
  },
  {
    id: 'tomtom',
    name: 'TomTom GPS',
    category: 'gps',
    action: exportToTomTom
  },
  {
    id: 'navman',
    name: 'Navman GPS',
    category: 'gps',
    action: exportToNavman
  },
  {
    id: 'hema',
    name: 'Hema Explorer',
    category: 'gps',
    action: exportToHema
  },
  {
    id: 'magellan',
    name: 'Magellan GPS',
    category: 'gps',
    action: exportToMagellan
  },
  {
    id: 'lowrance',
    name: 'Lowrance GPS',
    category: 'gps',
    action: exportToLowrance
  },
  // File Exports
  {
    id: 'gpx',
    name: 'Export GPX',
    category: 'file',
    action: exportToGPX
  },
  {
    id: 'kml',
    name: 'Export KML',
    category: 'file',
    action: exportToKML
  },
  {
    id: 'geojson',
    name: 'Export GeoJSON',
    category: 'file',
    action: exportToGeoJSON
  },
  {
    id: 'csv',
    name: 'Export CSV',
    category: 'file',
    action: exportToCSV
  }
];