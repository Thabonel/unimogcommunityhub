import { AmazonPAAPICredentials, ProductCheckResult, AMAZON_REGION_MAP } from './types.ts';

export class AmazonPAAPIClient {
  private credentials: AmazonPAAPICredentials;
  private host: string;
  private region: string;

  constructor(regionCode: keyof typeof AMAZON_REGION_MAP) {
    const config = AMAZON_REGION_MAP[regionCode];

    const accessKey = Deno.env.get('AMAZON_PA_API_ACCESS_KEY');
    const secretKey = Deno.env.get('AMAZON_PA_API_SECRET_KEY');
    const partnerTag = Deno.env.get(config.partnerTagEnv);

    if (!accessKey || !secretKey || !partnerTag) {
      throw new Error(`Missing Amazon PA-API credentials for region ${regionCode}`);
    }

    this.credentials = {
      accessKey,
      secretKey,
      partnerTag,
      region: config.region,
      marketplace: config.marketplace
    };

    // PA-API hosts by region
    const hosts: Record<string, string> = {
      'US': 'webservices.amazon.com',
      'AU': 'webservices.amazon.com.au',
      'DE': 'webservices.amazon.de',
      'FR': 'webservices.amazon.fr',
      'IT': 'webservices.amazon.it',
      'ES': 'webservices.amazon.es'
    };
    this.host = hosts[regionCode] || 'webservices.amazon.com';
    this.region = config.region;
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

      const response = await this.signedRequest('/paapi5/getitems', payload);

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

  private async signedRequest(path: string, payload: any): Promise<Response> {
    const service = 'ProductAdvertisingAPI';
    const method = 'POST';
    const payloadString = JSON.stringify(payload);

    // Get current time in required formats
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    // Create canonical headers
    const contentType = 'application/json; charset=utf-8';
    const canonicalHeaders =
      `content-encoding:amz-1.0\n` +
      `content-type:${contentType}\n` +
      `host:${this.host}\n` +
      `x-amz-date:${amzDate}\n` +
      `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems\n`;

    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';

    // Hash the payload
    const payloadHash = await this.sha256(payloadString);

    // Create canonical request
    const canonicalRequest =
      `${method}\n` +
      `${path}\n` +
      `\n` + // empty query string
      `${canonicalHeaders}\n` +
      `${signedHeaders}\n` +
      `${payloadHash}`;

    // Create credential scope
    const credentialScope = `${dateStamp}/${this.region}/${service}/aws4_request`;

    // Create string to sign
    const canonicalRequestHash = await this.sha256(canonicalRequest);
    const stringToSign =
      `AWS4-HMAC-SHA256\n` +
      `${amzDate}\n` +
      `${credentialScope}\n` +
      `${canonicalRequestHash}`;

    // Calculate signature
    const signingKey = await this.getSignatureKey(dateStamp, service);
    const signature = await this.hmacHex(signingKey, stringToSign);

    // Create authorization header
    const authorization =
      `AWS4-HMAC-SHA256 ` +
      `Credential=${this.credentials.accessKey}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, ` +
      `Signature=${signature}`;

    // Make the request
    const url = `https://${this.host}${path}`;
    return fetch(url, {
      method,
      headers: {
        'Content-Type': contentType,
        'Content-Encoding': 'amz-1.0',
        'X-Amz-Date': amzDate,
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
        'Authorization': authorization,
        'Host': this.host
      },
      body: payloadString
    });
  }

  private async getSignatureKey(dateStamp: string, service: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();

    // kDate = HMAC("AWS4" + secretKey, dateStamp)
    const kDate = await this.hmac(
      encoder.encode('AWS4' + this.credentials.secretKey),
      dateStamp
    );

    // kRegion = HMAC(kDate, region)
    const kRegion = await this.hmac(kDate, this.region);

    // kService = HMAC(kRegion, service)
    const kService = await this.hmac(kRegion, service);

    // kSigning = HMAC(kService, "aws4_request")
    const kSigning = await this.hmac(kService, 'aws4_request');

    return kSigning;
  }

  private async hmac(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    return crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  }

  private async hmacHex(key: ArrayBuffer, data: string): Promise<string> {
    const signature = await this.hmac(key, data);
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async sha256(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
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
