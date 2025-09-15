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
  const url = `https://www.komoot.com/plan/@${start.coords[1]},${start.coords[0]},13z?sport=hiking&to=${end.coords[1]},${end.coords[0]}`;
  
  window.open(url, '_blank');
  toast.success('Opening in Komoot');
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