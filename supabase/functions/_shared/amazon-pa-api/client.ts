import { AmazonPAAPICredentials, ProductCheckResult, AMAZON_REGION_MAP } from './types.ts';

export class AmazonPAAPIClient {
  private credentials: AmazonPAAPICredentials;
  private endpoint: string;

  constructor(region: keyof typeof AMAZON_REGION_MAP) {
    const config = AMAZON_REGION_MAP[region];

    const accessKey = Deno.env.get('AMAZON_PA_API_ACCESS_KEY');
    const secretKey = Deno.env.get('AMAZON_PA_API_SECRET_KEY');
    const partnerTag = Deno.env.get(config.partnerTagEnv);

    if (!accessKey || !secretKey || !partnerTag) {
      throw new Error(`Missing Amazon PA-API credentials for region ${region}`);
    }

    this.credentials = {
      accessKey,
      secretKey,
      partnerTag,
      region: config.region,
      marketplace: config.marketplace
    };

    this.endpoint = `https://webservices.amazon.${region === 'US' ? 'com' : region.toLowerCase()}/paapi5/getitems`;
  }

  async checkProduct(asin: string): Promise<ProductCheckResult> {
    try {
      const payload = {
        ItemIds: [asin],
        PartnerTag: this.credentials.partnerTag,
        PartnerType: 'Associates',
        Marketplace: this.credentials.marketplace,
        Resources: [
          'ItemInfo.Title',
          'Offers.Listings.Price',
          'Offers.Listings.Availability.Type'
        ]
      };

      const headers = await this.generateSignedHeaders(payload);

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Amazon API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return this.parseResponse(asin, data);

    } catch (error) {
      console.error(`[PA-API] Error checking ASIN ${asin}:`, error);
      return {
        asin,
        available: false,
        lastChecked: new Date(),
        error: error.message
      };
    }
  }

  private async generateSignedHeaders(payload: any): Promise<HeadersInit> {
    const timestamp = new Date().toISOString();
    const payloadString = JSON.stringify(payload);

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.credentials.secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payloadString)
    );

    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return {
      'Content-Type': 'application/json',
      'X-Amz-Date': timestamp,
      'X-Amz-Access-Key': this.credentials.accessKey,
      'X-Amz-Signature': signatureHex,
      'Host': new URL(this.endpoint).host
    };
  }

  private parseResponse(asin: string, data: any): ProductCheckResult {
    const item = data?.ItemsResult?.Items?.[0];

    if (!item) {
      return {
        asin,
        available: false,
        lastChecked: new Date(),
        error: 'Product not found in API response'
      };
    }

    const offer = item.Offers?.Listings?.[0];
    const availability = offer?.Availability?.Type;
    const price = offer?.Price?.Amount;
    const currency = offer?.Price?.Currency;
    const title = item.ItemInfo?.Title?.DisplayValue;

    return {
      asin,
      available: availability === 'Now',
      price: price ? parseFloat(price) : undefined,
      currency,
      title,
      lastChecked: new Date()
    };
  }
}
