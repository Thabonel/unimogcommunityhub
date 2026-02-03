import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeSource {
  id: string;
  url: string;
  type: 'trip' | 'guide';
  frequency: 'daily' | 'weekly' | 'monthly';
  selectors: Record<string, string>;
  status: string;
  next_scrape_at: string;
}

function getNextScrapeTime(frequency: string): string {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
    default:
      now.setDate(now.getDate() + 7);
  }
  return now.toISOString();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('[scrape-scheduler] Starting scheduled scrape run...');

    // Get sources due for scraping
    const { data: sources, error: fetchError } = await supabase
      .from('scrape_sources')
      .select('*')
      .eq('status', 'active')
      .lte('next_scrape_at', new Date().toISOString())
      .order('next_scrape_at', { ascending: true })
      .limit(10); // Process max 10 per run to avoid timeouts

    if (fetchError) throw fetchError;

    if (!sources || sources.length === 0) {
      console.log('[scrape-scheduler] No sources due for scraping');
      return new Response(
        JSON.stringify({ message: 'No sources due for scraping', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[scrape-scheduler] Found ${sources.length} sources to scrape`);

    const results: { url: string; success: boolean; error?: string }[] = [];

    for (const source of sources as ScrapeSource[]) {
      try {
        // Determine which scraper to call
        const scraperFunction = source.type === 'trip' ? 'scrape-trips' : 'scrape-guides';

        console.log(`[scrape-scheduler] Calling ${scraperFunction} for: ${source.url}`);

        // Call the appropriate scraper
        const { error: invokeError } = await supabase.functions.invoke(scraperFunction, {
          body: {
            source_id: source.id,
            url: source.url,
            selectors: source.selectors,
          },
        });

        if (invokeError) {
          throw new Error(invokeError.message);
        }

        // Update next_scrape_at on success
        await supabase
          .from('scrape_sources')
          .update({
            next_scrape_at: getNextScrapeTime(source.frequency),
            failure_count: 0,
          })
          .eq('id', source.id);

        results.push({ url: source.url, success: true });
        console.log(`[scrape-scheduler] Successfully scraped: ${source.url}`);

      } catch (scrapeError) {
        console.error(`[scrape-scheduler] Failed to scrape ${source.url}:`, scrapeError);

        // Increment failure count
        const { data: currentSource } = await supabase
          .from('scrape_sources')
          .select('failure_count')
          .eq('id', source.id)
          .single();

        const newFailureCount = (currentSource?.failure_count || 0) + 1;

        // Pause source if too many failures (5+)
        const newStatus = newFailureCount >= 5 ? 'failed' : 'active';

        await supabase
          .from('scrape_sources')
          .update({
            failure_count: newFailureCount,
            status: newStatus,
            // Still update next_scrape_at to avoid infinite retry loops
            next_scrape_at: getNextScrapeTime(source.frequency),
          })
          .eq('id', source.id);

        results.push({
          url: source.url,
          success: false,
          error: scrapeError instanceof Error ? scrapeError.message : 'Unknown error',
        });
      }

      // Small delay between sources to be polite
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`[scrape-scheduler] Completed: ${successCount} success, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} sources`,
        processed: results.length,
        success: successCount,
        failed: failCount,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[scrape-scheduler] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
