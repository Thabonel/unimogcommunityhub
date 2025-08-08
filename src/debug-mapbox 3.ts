// Debug script to check Mapbox token
import { MAPBOX_CONFIG } from './config/env';

console.log('=== MAPBOX DEBUG ===');
console.log('Token from env.ts:', MAPBOX_CONFIG.accessToken);
console.log('Token from import.meta.env:', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);
console.log('Token in localStorage:', localStorage.getItem('mapbox-token'));
console.log('Token starts with pk.:', MAPBOX_CONFIG.accessToken?.startsWith('pk.'));

export const debugMapbox = () => {
  return {
    fromConfig: MAPBOX_CONFIG.accessToken,
    fromEnv: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
    fromStorage: localStorage.getItem('mapbox-token'),
    isValid: MAPBOX_CONFIG.accessToken?.startsWith('pk.')
  };
};