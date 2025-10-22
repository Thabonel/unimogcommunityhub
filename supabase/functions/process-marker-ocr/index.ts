/**
 * Process Marker OCR Edge Function
 *
 * Batch processes RPS parts list images using Marker OCR on Replicate
 * Extracts text and updates manual_chunks table
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PartsListPage {
  id: string;
  page_number: number;
  section_title: string;
  page_image_url: string;
  metadata: {
    group_code: string;
    group_name: string;
    is_parts_list: boolean;
  };
}

interface MarkerOCRResponse {
  markdown: string;
  metadata: {
    language: string;
    file_type: string;
    pages: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');

    if (!replicateToken) {
      throw new Error('REPLICATE_API_TOKEN not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action = 'start' } = await req.json();

    console.log('[Marker OCR] Starting batch processing...');

    const { data: pages, error: fetchError } = await supabase
      .from('manual_chunks')
      .select('id, page_number, section_title, page_image_url, metadata')
      .eq('manual_title', 'RPS Catalog')
      .eq('ocr_processed', false)
      .order('page_number', { ascending: true });

    if (fetchError) {
      throw new Error(`Failed to fetch pages: ${fetchError.message}`);
    }

    const partsListPages = (pages || []).filter(
      (page: any) => page.metadata?.is_parts_list === true
    ) as PartsListPage[];

    console.log(`[Marker OCR] Found ${partsListPages.length} unprocessed parts list pages`);

    if (partsListPages.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No pages to process',
          processed: 0,
          failed: 0,
          total: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let processedCount = 0;
    let failedCount = 0;

    for (const page of partsListPages) {
      console.log(`[Marker OCR] Processing page ${page.page_number}...`);

      try {
        const ocrResult = await processPageWithMarker(
          page.page_image_url,
          replicateToken
        );

        const { error: updateError } = await supabase
          .from('manual_chunks')
          .update({
            ocr_text: ocrResult.markdown,
            content: ocrResult.markdown,
            ocr_processed: true,
            ocr_processed_at: new Date().toISOString(),
            metadata: {
              ...page.metadata,
              ocr_metadata: ocrResult.metadata
            }
          })
          .eq('id', page.id);

        if (updateError) {
          console.error(`[Marker OCR] Failed to update page ${page.page_number}:`, updateError);
          failedCount++;
        } else {
          console.log(`[Marker OCR] Page ${page.page_number} processed successfully`);
          processedCount++;
        }

        if (processedCount + failedCount < partsListPages.length) {
          await sleep(2000);
        }
      } catch (error: any) {
        console.error(`[Marker OCR] Error processing page ${page.page_number}:`, error);
        failedCount++;
      }
    }

    console.log(`[Marker OCR] Batch complete: ${processedCount} processed, ${failedCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        failed: failedCount,
        total: partsListPages.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[Marker OCR] Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function processPageWithMarker(
  imageUrl: string,
  replicateToken: string
): Promise<MarkerOCRResponse> {
  console.log(`[Marker OCR] Calling Replicate API for: ${imageUrl}`);

  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'cuuupid/marker:latest',
      input: {
        document: imageUrl,
        lang: 'English',
        dpi: 400,
        max_pages: 1,
        parallel_factor: 1,
        enable_editor: false
      }
    })
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(`Replicate API error: ${createResponse.status} - ${errorText}`);
  }

  const prediction = await createResponse.json();
  const predictionId = prediction.id;

  console.log(`[Marker OCR] Prediction created: ${predictionId}`);

  let attempts = 0;
  const maxAttempts = 60;

  while (attempts < maxAttempts) {
    await sleep(5000);

    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${replicateToken}`,
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Failed to check prediction status: ${statusResponse.status}`);
    }

    const status = await statusResponse.json();

    if (status.status === 'succeeded') {
      console.log(`[Marker OCR] Prediction succeeded`);

      const markdownUrl = status.output.markdown;
      const markdownResponse = await fetch(markdownUrl);

      if (!markdownResponse.ok) {
        throw new Error(`Failed to download markdown: ${markdownResponse.status}`);
      }

      const markdownContent = await markdownResponse.text();

      return {
        markdown: markdownContent,
        metadata: status.output.metadata || {
          language: 'English',
          file_type: 'image',
          pages: 1
        }
      };
    }

    if (status.status === 'failed' || status.status === 'canceled') {
      throw new Error(`Prediction ${status.status}: ${status.error || 'Unknown error'}`);
    }

    attempts++;
  }

  throw new Error('Prediction timed out after 5 minutes');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
