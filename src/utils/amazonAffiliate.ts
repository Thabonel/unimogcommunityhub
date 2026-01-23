export const AMAZON_ASSOCIATES_ID_AU = 'wheelsandwins-22';
export const AMAZON_ASSOCIATES_ID_US = 'wheelsandwins-20';

export interface AmazonProduct {
  id: string;
  asin: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  category: string;
  image_url?: string;
  amazon_url: string;
  is_active: boolean;
  sort_order: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  availability_status?: string;
  last_price_check?: string;
  current_price?: number;
}

/**
 * @deprecated Use buildAmazonURL from amazonAffiliateService.ts for proper regional routing
 * This function defaults to US Amazon with US tag
 */
export function buildAmazonAffiliateLink(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATES_ID_US}`;
}

/**
 * @deprecated Use getRegionalAffiliateURL from amazonAffiliateService.ts for proper regional routing
 * This function defaults to US tag
 */
export function buildAmazonAffiliateLinkFromUrl(productUrl: string): string {
  const url = new URL(productUrl);
  url.searchParams.set('tag', AMAZON_ASSOCIATES_ID_US);
  return url.toString();
}

export function extractASINFromUrl(url: string): string | null {
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/,
    /\/gp\/product\/([A-Z0-9]{10})/,
    /\/ASIN\/([A-Z0-9]{10})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
