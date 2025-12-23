import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { AmazonPAAPIClient } from '../_shared/amazon-pa-api/client.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('[Price Check] Starting daily price check...');

    const hasCredentials = Deno.env.get('AMAZON_PA_API_ACCESS_KEY');
    if (!hasCredentials) {
      console.log('[Price Check] Amazon PA-API credentials not configured yet. Skipping...');
      return new Response(
        JSON.stringify({
          status: 'skipped',
          reason: 'API credentials not configured',
          message: 'Add Amazon PA-API credentials to Supabase secrets to enable price checking'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: products, error } = await supabaseAdmin
      .from('affiliate_products')
      .select('id, title, affiliate_url, region, current_price, api_error_count')
      .eq('active', true)
      .eq('provider', 'amazon')
      .or('availability_status.is.null,availability_status.neq.unavailable');

    if (error) throw error;

    console.log(`[Price Check] Found ${products.length} products to check`);

    let checkedCount = 0;
    let errorCount = 0;
    const priceChanges = [];

    const BATCH_SIZE = 50;
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);

      for (const product of batch) {
        try {
          const asinMatch = product.affiliate_url.match(/\/dp\/([A-Z0-9]{10})/);
          if (!asinMatch) {
            console.warn(`[Price Check] Could not extract ASIN from: ${product.affiliate_url}`);
            continue;
          }

          const asin = asinMatch[1];
          const region = product.region || 'US';

          const client = new AmazonPAAPIClient(region);
          const result = await client.checkProduct(asin);

          const updates: any = {
            last_price_check: new Date().toISOString(),
            api_last_error: result.error || null,
            api_error_count: result.error ? (product.api_error_count || 0) + 1 : 0
          };

          if (result.price !== undefined) {
            const oldPrice = product.current_price;
            const newPrice = result.price;

            if (oldPrice && oldPrice !== newPrice) {
              const changePercent = ((newPrice - oldPrice) / oldPrice) * 100;

              await supabaseAdmin
                .from('product_price_history')
                .insert({
                  product_id: product.id,
                  old_price: oldPrice,
                  new_price: newPrice,
                  currency: result.currency,
                  price_change_percent: changePercent
                });

              priceChanges.push({
                product: product.title,
                oldPrice,
                newPrice,
                changePercent
              });

              console.log(`[Price Check] ${product.title}: ${oldPrice} → ${newPrice} (${changePercent.toFixed(1)}%)`);
            }

            updates.current_price = newPrice;
            updates.price_currency = result.currency;
          }

          await supabaseAdmin
            .from('affiliate_products')
            .update(updates)
            .eq('id', product.id);

          checkedCount++;

        } catch (err) {
          console.error(`[Price Check] Error checking product ${product.id}:`, err);
          errorCount++;
        }
      }

      if (i + BATCH_SIZE < products.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`[Price Check] Complete. Checked: ${checkedCount}, Errors: ${errorCount}, Price changes: ${priceChanges.length}`);

    return new Response(
      JSON.stringify({
        status: 'success',
        checkedCount,
        errorCount,
        priceChanges
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Price Check] Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
