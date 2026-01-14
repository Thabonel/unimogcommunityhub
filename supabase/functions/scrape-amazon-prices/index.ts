import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rotate user agents to avoid detection
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
];

interface PriceResult {
  productId: string;
  title: string;
  oldPrice: number | null;
  newPrice: number | null;
  currency: string;
  success: boolean;
  error?: string;
}

async function scrapeAmazonPrice(url: string): Promise<{ price: number | null; currency: string; error?: string }> {
  try {
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      return { price: null, currency: 'USD', error: `HTTP ${response.status}` };
    }

    const html = await response.text();

    // Detect currency from URL
    let currency = 'USD';
    if (url.includes('amazon.com.au')) currency = 'AUD';
    else if (url.includes('amazon.de') || url.includes('amazon.fr') || url.includes('amazon.it') || url.includes('amazon.es')) currency = 'EUR';
    else if (url.includes('amazon.co.uk')) currency = 'GBP';

    // Try multiple price selectors (Amazon changes these frequently)
    const pricePatterns = [
      // Primary price patterns
      /class="a-price-whole">([0-9,]+)<.*?class="a-price-fraction">([0-9]+)</s,
      /id="priceblock_ourprice"[^>]*>([^<]*\$|€|£|A\$)?([0-9.,]+)</,
      /id="priceblock_dealprice"[^>]*>([^<]*\$|€|£|A\$)?([0-9.,]+)</,
      /class="a-price"[^>]*>.*?<span[^>]*>([^<]*\$|€|£|A\$)?([0-9.,]+)</s,
      /data-a-color="price"[^>]*>.*?([0-9.,]+)</s,
      // Kindle/digital prices
      /id="kindle-price"[^>]*>([^<]*\$|€|£|A\$)?([0-9.,]+)</,
      // Buy box price
      /id="corePrice_feature_div"[^>]*>.*?<span[^>]*>([^<]*\$|€|£|A\$)?([0-9.,]+)</s,
      // Simple price extraction
      /\$([0-9]+\.[0-9]{2})/,
      /€([0-9]+[,.]?[0-9]*)/,
      /£([0-9]+\.[0-9]{2})/,
      /A\$([0-9]+\.[0-9]{2})/,
    ];

    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match) {
        // Extract the numeric part
        let priceStr = match[2] || match[1];
        // Clean up the price string
        priceStr = priceStr.replace(/[^0-9.,]/g, '');
        // Handle European format (1.234,56 -> 1234.56)
        if (priceStr.includes(',') && priceStr.includes('.')) {
          if (priceStr.lastIndexOf(',') > priceStr.lastIndexOf('.')) {
            // European: 1.234,56
            priceStr = priceStr.replace(/\./g, '').replace(',', '.');
          } else {
            // US: 1,234.56
            priceStr = priceStr.replace(/,/g, '');
          }
        } else if (priceStr.includes(',') && !priceStr.includes('.')) {
          // Could be European decimal or US thousands
          const parts = priceStr.split(',');
          if (parts[parts.length - 1].length === 2) {
            // Likely European decimal: 99,99
            priceStr = priceStr.replace(',', '.');
          } else {
            // Likely US thousands: 1,234
            priceStr = priceStr.replace(/,/g, '');
          }
        }

        const price = parseFloat(priceStr);
        if (!isNaN(price) && price > 0 && price < 100000) {
          return { price, currency };
        }
      }
    }

    // Check if product is unavailable
    if (html.includes('Currently unavailable') || html.includes('not available')) {
      return { price: null, currency, error: 'Product unavailable' };
    }

    return { price: null, currency, error: 'Could not extract price from page' };
  } catch (error) {
    return { price: null, currency: 'USD', error: error.message };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('[Price Scraper] Starting daily price scrape...');

    // Get all active Amazon products
    const { data: products, error } = await supabaseAdmin
      .from('affiliate_products')
      .select('id, title, affiliate_url, price, currency')
      .eq('is_active', true)
      .eq('affiliate_provider', 'amazon');

    if (error) throw error;

    console.log(`[Price Scraper] Found ${products.length} products to check`);

    const results: PriceResult[] = [];
    let updated = 0;
    let failed = 0;
    let unchanged = 0;

    // Process products with delay to avoid rate limiting
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      console.log(`[Price Scraper] (${i + 1}/${products.length}) Checking: ${product.title}`);

      const { price: newPrice, currency, error: scrapeError } = await scrapeAmazonPrice(product.affiliate_url);

      const result: PriceResult = {
        productId: product.id,
        title: product.title,
        oldPrice: product.price,
        newPrice,
        currency,
        success: !scrapeError && newPrice !== null,
        error: scrapeError,
      };

      if (result.success && newPrice !== null) {
        // Check if price changed
        const priceChanged = Math.abs((product.price || 0) - newPrice) > 0.01;

        if (priceChanged) {
          // Log price change
          await supabaseAdmin
            .from('product_price_history')
            .insert({
              product_id: product.id,
              old_price: product.price,
              new_price: newPrice,
              currency: currency,
              price_change_percent: product.price ? ((newPrice - product.price) / product.price) * 100 : 0,
            });

          // Update product price
          await supabaseAdmin
            .from('affiliate_products')
            .update({
              price: newPrice,
              currency: currency,
              current_price: newPrice,
              price_currency: currency,
              last_price_check: new Date().toISOString(),
              api_last_error: null,
              api_error_count: 0,
            })
            .eq('id', product.id);

          console.log(`[Price Scraper] ${product.title}: $${product.price} → $${newPrice}`);
          updated++;
        } else {
          // Just update the last check time
          await supabaseAdmin
            .from('affiliate_products')
            .update({
              last_price_check: new Date().toISOString(),
              api_last_error: null,
            })
            .eq('id', product.id);
          unchanged++;
        }
      } else {
        // Log the error
        await supabaseAdmin
          .from('affiliate_products')
          .update({
            last_price_check: new Date().toISOString(),
            api_last_error: scrapeError || 'Unknown error',
            api_error_count: (product.api_error_count || 0) + 1,
          })
          .eq('id', product.id);
        failed++;
      }

      results.push(result);

      // Delay between requests (2-4 seconds random) to avoid rate limiting
      if (i < products.length - 1) {
        const delay = 2000 + Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log(`[Price Scraper] Complete. Updated: ${updated}, Unchanged: ${unchanged}, Failed: ${failed}`);

    return new Response(
      JSON.stringify({
        status: 'success',
        total: products.length,
        updated,
        unchanged,
        failed,
        results: results.filter(r => r.newPrice !== r.oldPrice || !r.success),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Price Scraper] Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
