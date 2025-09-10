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
  // Check if we have waypoints or route data
  if (waypoints.length < 2 && !route) {
    toast.error('Need at least 2 waypoints or a calculated route for navigation');
    return;
  }

  let start: string, end: string, url: string;

  if (waypoints.length >= 2) {
    // Use waypoints data when available
    start = formatCoordinate(waypoints[0].coords[1], waypoints[0].coords[0]);
    end = formatCoordinate(waypoints[waypoints.length - 1].coords[1], waypoints[waypoints.length - 1].coords[0]);
    
    if (waypoints.length === 2) {
      url = `https://www.google.com/maps/dir/${start}/${end}`;
    } else {
      // Include all waypoints for multi-point routes
      const waypointStr = formatWaypoints(waypoints);
      url = `https://www.google.com/maps/dir/${waypointStr}`;
    }
  } else if (route?.geometry?.coordinates && route.geometry.coordinates.length >= 2) {
    // Use route geometry when waypoints are empty
    const coords = route.geometry.coordinates;
    const startCoord = coords[0]; // [lng, lat]
    const endCoord = coords[coords.length - 1]; // [lng, lat]
    
    start = formatCoordinate(startCoord[1], startCoord[0]); // lat, lng
    end = formatCoordinate(endCoord[1], endCoord[0]); // lat, lng
    url = `https://www.google.com/maps/dir/${start}/${end}`;
  } else {
    toast.error('No valid route data available for navigation');
    return;
  }
  
  console.log('🗺️ Generated Google Maps URL:', url);
  
  try {
    const popup = window.open(url, '_blank');
    if (popup) {
      toast.success('Opening in Google Maps');
    } else {
      toast.error('Popup blocked. Please allow popups and try again, or copy this URL: ' + url);
      console.log('📋 Copy this URL to open Google Maps:', url);
    }
  } catch (error) {
    console.error('❌ Failed to open Google Maps:', error);
    toast.error('Failed to open Google Maps. URL: ' + url);
  }
};

export const openAppleMaps = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  // Check if we have waypoints or route data
  if (waypoints.length < 2 && !route) {
    toast.error('Need at least 2 waypoints or a calculated route for navigation');
    return;
  }

  let start: string, end: string;

  if (waypoints.length >= 2) {
    // Use waypoints data when available
    start = formatCoordinate(waypoints[0].coords[1], waypoints[0].coords[0]);
    end = formatCoordinate(waypoints[waypoints.length - 1].coords[1], waypoints[waypoints.length - 1].coords[0]);
  } else if (route?.geometry?.coordinates && route.geometry.coordinates.length >= 2) {
    // Use route geometry when waypoints are empty
    const coords = route.geometry.coordinates;
    const startCoord = coords[0]; // [lng, lat]
    const endCoord = coords[coords.length - 1]; // [lng, lat]
    
    start = formatCoordinate(startCoord[1], startCoord[0]); // lat, lng
    end = formatCoordinate(endCoord[1], endCoord[0]); // lat, lng
  } else {
    toast.error('No valid route data available for navigation');
    return;
  }
  
  const url = `http://maps.apple.com/?saddr=${start}&daddr=${end}`;
  console.log('🍎 Generated Apple Maps URL:', url);
  
  try {
    const popup = window.open(url, '_blank');
    if (popup) {
      toast.success('Opening in Apple Maps');
    } else {
      toast.error('Popup blocked. Please allow popups and try again, or copy this URL: ' + url);
      console.log('📋 Copy this URL to open Apple Maps:', url);
    }
  } catch (error) {
    console.error('❌ Failed to open Apple Maps:', error);
    toast.error('Failed to open Apple Maps. URL: ' + url);
  }
};

export const openWaze = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  // Check if we have waypoints or route data
  if (waypoints.length < 2 && !route) {
    toast.error('Need at least 2 waypoints or a calculated route for navigation');
    return;
  }

  let destinationLat: number, destinationLng: number;

  if (waypoints.length >= 2) {
    // Use waypoints data when available - Waze works best with destination only
    const destination = waypoints[waypoints.length - 1];
    destinationLat = destination.coords[1];
    destinationLng = destination.coords[0];
  } else if (route?.geometry?.coordinates && route.geometry.coordinates.length >= 2) {
    // Use route geometry when waypoints are empty - get the last coordinate as destination
    const coords = route.geometry.coordinates;
    const endCoord = coords[coords.length - 1]; // [lng, lat]
    destinationLat = endCoord[1];
    destinationLng = endCoord[0];
  } else {
    toast.error('No valid route data available for navigation');
    return;
  }

  const url = `https://waze.com/ul?ll=${destinationLat},${destinationLng}&navigate=yes`;
  console.log('🚗 Generated Waze URL:', url);
  
  try {
    const popup = window.open(url, '_blank');
    if (popup) {
      toast.success('Opening in Waze');
    } else {
      toast.error('Popup blocked. Please allow popups and try again, or copy this URL: ' + url);
      console.log('📋 Copy this URL to open Waze:', url);
    }
  } catch (error) {
    console.error('❌ Failed to open Waze:', error);
    toast.error('Failed to open Waze. URL: ' + url);
  }
};

export const openKomoot = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  // Check if we have waypoints or route data
  if (waypoints.length < 2 && !route) {
    toast.error('Need at least 2 waypoints or a calculated route for navigation');
    return;
  }

  let startLat: number, startLng: number, endLat: number, endLng: number;

  if (waypoints.length >= 2) {
    // Use waypoints data when available
    const start = waypoints[0];
    const end = waypoints[waypoints.length - 1];
    startLat = start.coords[1];
    startLng = start.coords[0];
    endLat = end.coords[1];
    endLng = end.coords[0];
  } else if (route?.geometry?.coordinates && route.geometry.coordinates.length >= 2) {
    // Use route geometry when waypoints are empty
    const coords = route.geometry.coordinates;
    const startCoord = coords[0]; // [lng, lat]
    const endCoord = coords[coords.length - 1]; // [lng, lat]
    
    startLat = startCoord[1];
    startLng = startCoord[0];
    endLat = endCoord[1];
    endLng = endCoord[0];
  } else {
    toast.error('No valid route data available for navigation');
    return;
  }

  const url = `https://www.komoot.com/plan/@${startLat},${startLng},13z?sport=hiking&to=${endLat},${endLng}`;
  console.log('🥾 Generated Komoot URL:', url);
  
  try {
    const popup = window.open(url, '_blank');
    if (popup) {
      toast.success('Opening in Komoot');
    } else {
      toast.error('Popup blocked. Please allow popups and try again, or copy this URL: ' + url);
      console.log('📋 Copy this URL to open Komoot:', url);
    }
  } catch (error) {
    console.error('❌ Failed to open Komoot:', error);
    toast.error('Failed to open Komoot. URL: ' + url);
  }
};

// File export functions
export const exportToGPX = (waypoints: Waypoint[], route: DirectionsRoute | null) => {
  if (waypoints.length === 0 && !route) {
    toast.error('No waypoints or route to export');
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
  if (waypoints.length === 0 && !route) {
    toast.error('No waypoints or route to export');
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
  if (waypoints.length === 0 && !route) {
    toast.error('No waypoints or route to export');
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
  if (waypoints.length === 0 && !route) {
    toast.error('No waypoints or route to export');
    return;
  }

  let csvContent = 'Name,Latitude,Longitude,Type\n';
  
  if (waypoints.length > 0) {
    // Export waypoints if available
    waypoints.forEach((waypoint, index) => {
      const name = (waypoint.name || `Waypoint ${index + 1}`).replace(/,/g, ';');
      csvContent += `"${name}",${waypoint.coords[1]},${waypoint.coords[0]},"${waypoint.type || 'waypoint'}"\n`;
    });
  } else if (route?.geometry?.coordinates) {
    // Export route endpoints if no waypoints
    const coords = route.geometry.coordinates;
    const startCoord = coords[0]; // [lng, lat]
    const endCoord = coords[coords.length - 1]; // [lng, lat]
    
    csvContent += `"Start Point",${startCoord[1]},${startCoord[0]},"start"\n`;
    csvContent += `"End Point",${endCoord[1]},${endCoord[0]},"end"\n`;
  }

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