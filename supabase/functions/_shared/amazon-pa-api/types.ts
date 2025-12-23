export interface AmazonPAAPICredentials {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  region: 'us-east-1' | 'eu-west-1' | 'us-west-2' | 'ap-northeast-1';
  marketplace: 'www.amazon.com' | 'www.amazon.de' | 'www.amazon.fr' | 'www.amazon.it' | 'www.amazon.es' | 'www.amazon.com.au';
}

export interface ProductCheckResult {
  asin: string;
  available: boolean;
  price?: number;
  currency?: string;
  title?: string;
  lastChecked: Date;
  error?: string;
}

export const AMAZON_REGION_MAP = {
  'AU': { region: 'us-west-2', marketplace: 'www.amazon.com.au', partnerTagEnv: 'AMAZON_AU_PARTNER_TAG' },
  'US': { region: 'us-east-1', marketplace: 'www.amazon.com', partnerTagEnv: 'AMAZON_US_PARTNER_TAG' },
  'DE': { region: 'eu-west-1', marketplace: 'www.amazon.de', partnerTagEnv: 'AMAZON_DE_PARTNER_TAG' },
  'FR': { region: 'eu-west-1', marketplace: 'www.amazon.fr', partnerTagEnv: 'AMAZON_FR_PARTNER_TAG' },
  'IT': { region: 'eu-west-1', marketplace: 'www.amazon.it', partnerTagEnv: 'AMAZON_IT_PARTNER_TAG' },
  'ES': { region: 'eu-west-1', marketplace: 'www.amazon.es', partnerTagEnv: 'AMAZON_ES_PARTNER_TAG' }
} as const;
