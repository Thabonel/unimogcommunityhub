export interface CountryView {
  center: [number, number]; // [longitude, latitude]
  zoom: number;
}

/**
 * Get appropriate country-level view based on coordinates
 * This provides a good initial view before zooming to exact location
 */
export const getCountryView = (latitude: number, longitude: number): CountryView => {
  // North America - USA/Canada
  if (latitude > 25 && latitude < 70 && longitude > -170 && longitude < -50) {
    if (latitude > 60) {
      // Alaska/Northern Canada
      return { center: [-145, 65], zoom: 3 };
    } else if (latitude > 49) {
      // Canada
      return { center: [-95, 55], zoom: 4 };
    } else {
      // USA
      return { center: [-95, 39], zoom: 4 };
    }
  }
  
  // Europe
  if (latitude > 35 && latitude < 75 && longitude > -15 && longitude < 50) {
    return { center: [10, 54], zoom: 5 };
  }
  
  // Australia/New Zealand
  if (latitude > -50 && latitude < -10 && longitude > 110 && longitude < 180) {
    return { center: [135, -25], zoom: 4 };
  }
  
  // South America
  if (latitude > -60 && latitude < 15 && longitude > -85 && longitude < -30) {
    return { center: [-60, -15], zoom: 3 };
  }
  
  // Africa
  if (latitude > -35 && latitude < 40 && longitude > -20 && longitude < 55) {
    return { center: [20, 0], zoom: 4 };
  }
  
  // Asia - China/Mongolia/Russia
  if (latitude > 15 && latitude < 75 && longitude > 70 && longitude < 150) {
    return { center: [105, 35], zoom: 4 };
  }
  
  // Asia - India/Southeast Asia
  if (latitude > -10 && latitude < 35 && longitude > 65 && longitude < 145) {
    return { center: [100, 15], zoom: 4 };
  }
  
  // Middle East
  if (latitude > 15 && latitude < 45 && longitude > 25 && longitude < 70) {
    return { center: [45, 30], zoom: 5 };
  }
  
  // Default: Use provided location with a country-level zoom
  return { center: [longitude, latitude], zoom: 6 };
};

/**
 * Get an appropriate initial map view for any location
 * Provides immediate country context while precise location loads
 */
export const getInitialMapView = (location?: { latitude: number; longitude: number } | null): CountryView => {
  if (location) {
    return getCountryView(location.latitude, location.longitude);
  }
  
  // Global view as ultimate fallback
  return { center: [0, 20], zoom: 2 };
};