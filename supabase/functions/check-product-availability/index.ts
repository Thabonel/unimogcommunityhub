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

    console.log('[Availability Check] Starting 6-hourly availability check...');

    const hasCredentials = Deno.env.get('AMAZON_PA_API_ACCESS_KEY');
    if (!hasCredentials) {
      console.log('[Availability Check] Amazon PA-API credentials not configured yet. Skipping...');
      return new Response(
        JSON.stringify({
          status: 'skipped',
          reason: 'API credentials not configured',
          message: 'Add Amazon PA-API credentials to Supabase secrets to enable availability checking'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let productFilter = req.url.includes('productIds=')
      ? JSON.parse(new URL(req.url).searchParams.get('productIds') || '[]')
      : null;

    const query = supabaseAdmin
      .from('affiliate_products')
      .select('id, title, affiliate_url, asin, availability_status')
      .eq('is_active', true)
      .eq('affiliate_provider', 'amazon');

    if (productFilter && productFilter.length > 0) {
      query.in('id', productFilter);
    }

    const { data: products, error } = await query;

    if (error) throw error;

    console.log(`[Availability Check] Found ${products.length} products to check`);

    let checkedCount = 0;
    let errorCount = 0;
    const statusChanges = [];

    const BATCH_SIZE = 50;
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);

      for (const product of batch) {
        const startTime = Date.now();
        try {
          // Use stored ASIN or extract from URL
          let asin = product.asin;
          if (!asin) {
            const asinMatch = product.affiliate_url.match(/\/dp\/([A-Z0-9]{10})/i);
            if (!asinMatch) {
              console.warn(`[Availability Check] Could not extract ASIN from: ${product.affiliate_url}`);
              continue;
            }
            asin = asinMatch[1];
          }

          // Detect region from URL domain
          const urlLower = product.affiliate_url.toLowerCase();
          let region: 'US' | 'AU' | 'DE' | 'FR' | 'IT' | 'ES' = 'US';
          if (urlLower.includes('amazon.com.au')) region = 'AU';
          else if (urlLower.includes('amazon.de')) region = 'DE';
          else if (urlLower.includes('amazon.fr')) region = 'FR';
          else if (urlLower.includes('amazon.it')) region = 'IT';
          else if (urlLower.includes('amazon.es')) region = 'ES';

          const client = new AmazonPAAPIClient(region);
          const result = await client.checkProduct(asin);

          const responseTime = Date.now() - startTime;
          const oldStatus = product.availability_status || 'unknown';
          const newStatus = result.error
            ? 'checking'
            : result.available
              ? 'available'
              : 'unavailable';

          await supabaseAdmin
            .from('product_availability_log')
            .insert({
              product_id: product.id,
              old_status: oldStatus,
              new_status: newStatus,
              checked_at: new Date().toISOString(),
              response_time_ms: responseTime,
              api_response: result,
              error_message: result.error || null
            });

          if (oldStatus !== newStatus) {
            statusChanges.push({
              product: product.title,
              oldStatus,
              newStatus
            });

            console.log(`[Availability Check] ${product.title}: ${oldStatus} → ${newStatus}`);
          }

          await supabaseAdmin
            .from('affiliate_products')
            .update({
              availability_status: newStatus,
              last_availability_check: new Date().toISOString(),
              api_last_error: result.error || null
            })
            .eq('id', product.id);

          checkedCount++;

        } catch (err) {
          console.error(`[Availability Check] Error checking product ${product.id}:`, err);

          await supabaseAdmin
            .from('product_availability_log')
            .insert({
              product_id: product.id,
              old_status: product.availability_status || 'unknown',
              new_status: 'checking',
              checked_at: new Date().toISOString(),
              response_time_ms: Date.now() - startTime,
              error_message: err.message
            });

          errorCount++;
        }
      }

      if (i + BATCH_SIZE < products.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`[Availability Check] Complete. Checked: ${checkedCount}, Errors: ${errorCount}, Status changes: ${statusChanges.length}`);

    return new Response(
      JSON.stringify({
        status: 'success',
        checkedCount,
        errorCount,
        statusChanges
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Availability Check] Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
