/**
 * Amazon Affiliate Regional Routing Service
 *
 * Handles intelligent routing to regional Amazon sites based on user location.
 * Supports 6 Amazon Associates accounts across different regions.
 */

interface AmazonRegion {
  domain: string;
  tag: string;
  currency: string;
}

/**
 * Amazon Associates Store IDs by Region
 */
export const AMAZON_REGIONS: Record<string, AmazonRegion> = {
  AU: { domain: 'amazon.com.au', tag: 'wheelsandwins-22', currency: 'AUD' },
  DE: { domain: 'amazon.de', tag: 'unimogcommu06-21', currency: 'EUR' },
  FR: { domain: 'amazon.fr', tag: 'unimogcommu03-21', currency: 'EUR' },
  IT: { domain: 'amazon.it', tag: 'unimogcommu09-21', currency: 'EUR' },
  ES: { domain: 'amazon.es', tag: 'unimogcommu0c-21', currency: 'EUR' },
  US: { domain: 'amazon.com', tag: 'wheelsandwins-20', currency: 'USD' },
};

/**
 * Map country codes to Amazon regions
 * Groups nearby countries to maximize affiliate coverage
 */
const COUNTRY_TO_AMAZON_REGION: Record<string, string> = {
  // Australia & Oceania
  'AU': 'AU',
  'NZ': 'AU', // New Zealand → Australia

  // Germany & Central Europe
  'DE': 'DE',
  'AT': 'DE', // Austria → Germany
  'CH': 'DE', // Switzerland → Germany
  'LI': 'DE', // Liechtenstein → Germany

  // France & Francophone
  'FR': 'FR',
  'BE': 'FR', // Belgium → France
  'LU': 'FR', // Luxembourg → France
  'MC': 'FR', // Monaco → France

  // Italy
  'IT': 'IT',
  'SM': 'IT', // San Marino → Italy
  'VA': 'IT', // Vatican → Italy

  // Spain & Iberia
  'ES': 'ES',
  'PT': 'ES', // Portugal → Spain
  'AD': 'ES', // Andorra → Spain

  // United States & Americas
  'US': 'US',
  'CA': 'US', // Canada → US (no CA account)
  'MX': 'US', // Mexico → US

  // United Kingdom & Europe (no UK account, default to US)
  'GB': 'US',
  'IE': 'US', // Ireland → US
  'NL': 'US', // Netherlands → US
  'SE': 'US', // Sweden → US
  'DK': 'US', // Denmark → US
  'NO': 'US', // Norway → US
  'FI': 'US', // Finland → US
  'PL': 'US', // Poland → US
  'CZ': 'US', // Czech Republic → US
};

/**
 * Extract ASIN (Amazon Standard Identification Number) from any Amazon URL
 *
 * ASIN Format: B + 9 alphanumeric characters (e.g., B000BK6G84)
 *
 * @param url - Amazon product URL
 * @returns ASIN if found, null otherwise
 *
 * @example
 * extractASIN('https://www.amazon.com/dp/B000BK6G84?tag=example-20')
 * // Returns: 'B000BK6G84'
 */
export function extractASIN(url: string): string | null {
  const match = url.match(/\/dp\/([B][0-9A-Z]{9})/i);
  return match ? match[1] : null;
}

/**
 * Get Amazon region code based on user's country code
 *
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'AU', 'DE', 'US')
 * @returns Amazon region code (AU, DE, FR, IT, ES, US)
 *
 * @example
 * getAmazonRegion('NZ') // Returns: 'AU' (New Zealand routed to Australia)
 * getAmazonRegion('GB') // Returns: 'US' (UK defaults to US - no UK account)
 */
export function getAmazonRegion(countryCode: string | undefined): string {
  if (!countryCode) return 'US';

  const region = COUNTRY_TO_AMAZON_REGION[countryCode.toUpperCase()];
  return region || 'US'; // Default to US for unmapped countries
}

/**
 * Build Amazon affiliate URL for a specific region
 *
 * @param asin - Amazon Standard Identification Number
 * @param regionCode - Amazon region code (AU, DE, FR, IT, ES, US)
 * @returns Complete Amazon affiliate URL with correct tag
 *
 * @example
 * buildAmazonURL('B000BK6G84', 'AU')
 * // Returns: 'https://www.amazon.com.au/dp/B000BK6G84?tag=wheelsandwins-22'
 */
export function buildAmazonURL(asin: string, regionCode: string): string {
  const region = AMAZON_REGIONS[regionCode] || AMAZON_REGIONS.US;
  return `https://www.${region.domain}/dp/${asin}?tag=${region.tag}`;
}

/**
 * Get regional affiliate URL based on user's location
 *
 * Main function for regional routing. Automatically:
 * 1. Detects if URL is Amazon product
 * 2. Extracts ASIN from original URL
 * 3. Maps user's country to appropriate Amazon region
 * 4. Builds new URL with correct regional domain and affiliate tag
 *
 * @param originalURL - Original Amazon affiliate URL
 * @param userCountryCode - User's ISO country code
 * @returns Regional Amazon URL, or original URL if not Amazon or ASIN not found
 *
 * @example
 * getRegionalAffiliateURL(
 *   'https://www.amazon.com/dp/B000BK6G84?tag=old-20',
 *   'AU'
 * )
 * // Returns: 'https://www.amazon.com.au/dp/B000BK6G84?tag=wheelsandwins-22'
 */
export function getRegionalAffiliateURL(
  originalURL: string,
  userCountryCode: string | undefined
): string {
  const asin = extractASIN(originalURL);

  if (!asin) {
    // Not an Amazon product or invalid URL format
    return originalURL;
  }

  const region = getAmazonRegion(userCountryCode);
  return buildAmazonURL(asin, region);
}

/**
 * Get display name for Amazon region
 *
 * @param regionCode - Amazon region code
 * @returns Human-readable region name
 *
 * @example
 * getRegionDisplayName('AU') // Returns: 'Australia'
 * getRegionDisplayName('DE') // Returns: 'Germany'
 */
export function getRegionDisplayName(regionCode: string): string {
  const names: Record<string, string> = {
    AU: 'Australia',
    DE: 'Germany',
    FR: 'France',
    IT: 'Italy',
    ES: 'Spain',
    US: 'United States',
  };

  return names[regionCode] || 'United States';
}

/**
 * Get Amazon domain for a region
 *
 * @param regionCode - Amazon region code
 * @returns Amazon domain (e.g., 'amazon.com.au')
 */
export function getAmazonDomain(regionCode: string): string {
  const region = AMAZON_REGIONS[regionCode] || AMAZON_REGIONS.US;
  return region.domain;
}

/**
 * Get regional ASIN for a product
 *
 * Checks if product has region-specific ASIN configured.
 * Falls back to US ASIN if regional ASIN not available.
 *
 * @param regionalAsins - JSONB object with ASINs per region
 * @param regionCode - Target Amazon region
 * @param fallbackAsin - Default ASIN (usually US)
 * @returns ASIN for the requested region
 *
 * @example
 * getRegionalASIN(
 *   { US: 'B0DDK8M3CV', AU: 'B0DJQF9DY8' },
 *   'AU',
 *   'B0DDK8M3CV'
 * )
 * // Returns: 'B0DJQF9DY8'
 */
export function getRegionalASIN(
  regionalAsins: Record<string, string> | null | undefined,
  regionCode: string,
  fallbackAsin: string | null
): string | null {
  if (!regionalAsins) {
    return fallbackAsin;
  }

  return regionalAsins[regionCode] || fallbackAsin;
}

/**
 * Get regional affiliate URL with support for region-specific ASINs
 *
 * Enhanced version that:
 * 1. Checks for region-specific ASIN first
 * 2. Falls back to US ASIN if regional not available
 * 3. Uses regional URL if fully configured in database
 *
 * @param originalURL - Original Amazon affiliate URL
 * @param userCountryCode - User's ISO country code
 * @param regionalAsins - Product's regional ASINs object
 * @param regionalUrls - Product's regional URLs object (optional)
 * @returns Regional Amazon URL with correct ASIN and affiliate tag
 *
 * @example
 * getRegionalAffiliateURLWithASINs(
 *   'https://amazon.com/dp/B0DDK8M3CV',
 *   'AU',
 *   { US: 'B0DDK8M3CV', AU: 'B0DJQF9DY8' },
 *   { AU: 'https://amazon.com.au/dp/B0DJQF9DY8?tag=wheelsandwins-22' }
 * )
 * // Returns: 'https://amazon.com.au/dp/B0DJQF9DY8?tag=wheelsandwins-22'
 */
export function getRegionalAffiliateURLWithASINs(
  originalURL: string,
  userCountryCode: string | undefined,
  regionalAsins?: Record<string, string> | null,
  regionalUrls?: Record<string, string> | null
): string {
  const region = getAmazonRegion(userCountryCode);
  const regionConfig = AMAZON_REGIONS[region] || AMAZON_REGIONS.US;

  // If full regional URL configured, ensure it has the correct tracking tag
  if (regionalUrls && regionalUrls[region]) {
    const url = new URL(regionalUrls[region]);
    // Always set/override the tag to ensure tracking works
    url.searchParams.set('tag', regionConfig.tag);
    return url.toString();
  }

  // Extract fallback ASIN from original URL
  const fallbackAsin = extractASIN(originalURL);

  // Get region-specific ASIN or fallback
  const asin = getRegionalASIN(regionalAsins, region, fallbackAsin);

  if (!asin) {
    return originalURL;
  }

  return buildAmazonURL(asin, region);
}

/**
 * Get regional price for display
 *
 * @param regionalPrices - JSONB object with prices per region
 * @param regionCode - Target Amazon region
 * @returns Price object or null
 *
 * @example
 * getRegionalPrice(
 *   { US: { amount: 79.99, currency: 'USD' }, AU: { amount: 169.83, currency: 'AUD' } },
 *   'AU'
 * )
 * // Returns: { amount: 169.83, currency: 'AUD' }
 */
export function getRegionalPrice(
  regionalPrices: Record<string, { amount: number; currency: string }> | null | undefined,
  regionCode: string
): { amount: number; currency: string } | null {
  if (!regionalPrices || !regionalPrices[regionCode]) {
    return null;
  }

  return regionalPrices[regionCode];
}

/**
 * Check if product is available in a region
 *
 * @param regionalAsins - Regional ASINs object
 * @param regionCode - Region to check
 * @returns true if product has ASIN for region
 */
export function isProductAvailableInRegion(
  regionalAsins: Record<string, string> | null | undefined,
  regionCode: string
): boolean {
  return !!(regionalAsins && regionalAsins[regionCode]);
}
