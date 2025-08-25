// Country utility functions for vehicle showcase

interface Country {
  code: string;
  name: string;
  flag: string;
}

// Country data with flags (using emoji flags)
const countries: Record<string, Country> = {
  US: { code: 'US', name: 'United States', flag: '🇺🇸' },
  DE: { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  AU: { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  GB: { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  CA: { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  ZA: { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  AT: { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  CH: { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  NL: { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  FR: { code: 'FR', name: 'France', flag: '🇫🇷' },
  BR: { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  AR: { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  NZ: { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  SE: { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  NO: { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  DK: { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  ES: { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  IT: { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  BE: { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  FI: { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  IS: { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  IE: { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  LU: { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  PT: { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  CZ: { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  SK: { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  PL: { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  HU: { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  HR: { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  SI: { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  JP: { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  KR: { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  MX: { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  CL: { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  PE: { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  CO: { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  VE: { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  UY: { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  TH: { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  MY: { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  ID: { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  PH: { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  IN: { code: 'IN', name: 'India', flag: '🇮🇳' },
  CN: { code: 'CN', name: 'China', flag: '🇨🇳' },
  RU: { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  TR: { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  EG: { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  MA: { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  TN: { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  KE: { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  TZ: { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  BW: { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  NA: { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  ZW: { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
  MW: { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  ZM: { code: 'ZM', name: 'Zambia', flag: '🇿🇲' }
};

/**
 * Get country flag emoji by country code
 */
export const getCountryFlag = (countryCode?: string): string => {
  if (!countryCode) return '🌍';
  return countries[countryCode.toUpperCase()]?.flag || '🌍';
};

/**
 * Get country name by country code
 */
export const getCountryName = (countryCode?: string): string => {
  if (!countryCode) return 'Unknown';
  return countries[countryCode.toUpperCase()]?.name || 'Unknown';
};

/**
 * Get all available countries
 */
export const getAllCountries = (): Country[] => {
  return Object.values(countries).sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Get popular Unimog countries (where Unimogs are commonly used)
 */
export const getPopularUnimogCountries = (): Country[] => {
  const popularCodes = [
    'US', 'DE', 'AU', 'GB', 'CA', 'ZA', 'AT', 'CH', 'NL', 'FR',
    'BR', 'AR', 'NZ', 'SE', 'NO', 'DK', 'ES', 'IT', 'BE', 'FI'
  ];
  
  return popularCodes
    .map(code => countries[code])
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Search countries by name
 */
export const searchCountries = (query: string): Country[] => {
  const searchTerm = query.toLowerCase();
  return Object.values(countries)
    .filter(country => 
      country.name.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Validate if country code exists
 */
export const isValidCountryCode = (countryCode: string): boolean => {
  return countries.hasOwnProperty(countryCode.toUpperCase());
};

/**
 * Get country info by code
 */
export const getCountryInfo = (countryCode: string): Country | null => {
  return countries[countryCode.toUpperCase()] || null;
};

/**
 * Format location string with country flag
 */
export const formatLocation = (city?: string, region?: string, countryCode?: string): string => {
  const parts = [city, region].filter(Boolean);
  const flag = getCountryFlag(countryCode);
  const countryName = getCountryName(countryCode);
  
  if (parts.length > 0) {
    return `${flag} ${parts.join(', ')}, ${countryName}`;
  }
  
  return `${flag} ${countryName}`;
};

/**
 * Get continent from country code (for grouping)
 */
export const getContinent = (countryCode?: string): string => {
  if (!countryCode) return 'Unknown';
  
  const continentMap: Record<string, string> = {
    // North America
    US: 'North America', CA: 'North America', MX: 'North America',
    
    // Europe
    DE: 'Europe', GB: 'Europe', FR: 'Europe', IT: 'Europe', ES: 'Europe',
    AT: 'Europe', CH: 'Europe', NL: 'Europe', BE: 'Europe', DK: 'Europe',
    SE: 'Europe', NO: 'Europe', FI: 'Europe', IS: 'Europe', IE: 'Europe',
    LU: 'Europe', PT: 'Europe', CZ: 'Europe', SK: 'Europe', PL: 'Europe',
    HU: 'Europe', HR: 'Europe', SI: 'Europe',
    
    // Oceania
    AU: 'Oceania', NZ: 'Oceania',
    
    // South America
    BR: 'South America', AR: 'South America', CL: 'South America',
    PE: 'South America', CO: 'South America', VE: 'South America', UY: 'South America',
    
    // Africa
    ZA: 'Africa', EG: 'Africa', MA: 'Africa', TN: 'Africa', KE: 'Africa',
    TZ: 'Africa', BW: 'Africa', NA: 'Africa', ZW: 'Africa', MW: 'Africa', ZM: 'Africa',
    
    // Asia
    JP: 'Asia', KR: 'Asia', TH: 'Asia', MY: 'Asia', ID: 'Asia',
    PH: 'Asia', IN: 'Asia', CN: 'Asia', RU: 'Asia', TR: 'Asia'
  };
  
  return continentMap[countryCode.toUpperCase()] || 'Other';
};