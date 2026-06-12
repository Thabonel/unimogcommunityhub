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
    callout_range: string;
    is_parts_list: boolean;
  };
}

async function ocrImageWithGPT4Vision(imageUrl: string, groupInfo: string): Promise<string> {
  const OPENAI_API_KEY = <OPENAI_API_KEY>
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  console.log(`Sending image to GPT-4o Vision: ${imageUrl}`);

  const prompt = `You are analyzing a parts list page from a military vehicle catalog (RPS - Replacement Parts Specification).

This page shows a parts table for: ${groupInfo}

Extract ALL information from the parts table. Include:
- Item/callout numbers
- Part numbers (including dashes and special characters)
- NIIN codes (11-digit numbers)
- NSN numbers (NATO Stock Numbers)
- Descriptions
- Quantities
- Any notes or remarks

Format the output as clean, structured text that preserves the table data. Be thorough and accurate - this data will be used for parts ordering.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 4096,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const ocrText = result.choices?.[0]?.message?.content || '';

  if (!ocrText) {
    throw new Error('Empty OCR response from GPT-4o Vision');
  }

  console.log(`OCR complete: ${ocrText.length} characters extracted`);
  return ocrText;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    console.log('Fetching unprocessed RPS parts list pages...');

    // Get unprocessed parts list pages (LIMIT TO 10 to avoid timeout)
    const { data: pages, error: fetchError } = await supabaseClient
      .from('manual_chunks')
      .select('*')
      .eq('manual_title', 'RPS Catalog')
      .eq('ocr_processed', false)
      .order('page_number', { ascending: true })
      .limit(10);

    if (fetchError) {
      throw new Error(`Failed to fetch pages: ${fetchError.message}`);
    }

    // Filter to only parts list pages
    const partsListPages = (pages || []).filter(
      (page: any) => page.metadata?.is_parts_list === true
    ) as PartsListPage[];

    console.log(`Found ${partsListPages.length} unprocessed parts list pages`);

    if (partsListPages.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          processed: 0,
          total: 0,
          failed: 0,
          message: 'No unprocessed pages found'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let completedPages = 0;
    let failedPages = 0;

    // Process each page
    for (const page of partsListPages) {
      console.log(`[${completedPages + failedPages + 1}/${partsListPages.length}] Processing page ${page.page_number}: ${page.section_title}`);
      console.log(`Image URL: ${page.page_image_url}`);
      console.log(`Is parts list: ${page.metadata?.is_parts_list}`);

      try {
        // OCR the image
        const groupInfo = `${page.metadata.group_code} - ${page.metadata.group_name}`;
        const ocrText = await ocrImageWithGPT4Vision(page.page_image_url, groupInfo);

        // Update database
        const { error: updateError } = await supabaseClient
          .from('manual_chunks')
          .update({
            ocr_text: ocrText,
            ocr_processed: true,
            ocr_processed_at: new Date().toISOString(),
            content: ocrText // Also update content for Barry's RAG search
          })
          .eq('id', page.id);

        if (updateError) {
          console.error(`Failed to update page ${page.page_number}:`, updateError);
          failedPages++;
        } else {
          completedPages++;
          console.log(`✓ Page ${page.page_number} processed successfully`);
        }

        // Rate limiting: small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error: any) {
        console.error(`Failed to process page ${page.page_number}:`, error.message);
        console.error(`Full error:`, error);
        failedPages++;
      }
    }

    console.log(`Processing complete. Success: ${completedPages}, Failed: ${failedPages}`);

    return new Response(
      JSON.stringify({
        success: true,
        processed: completedPages,
        total: partsListPages.length,
        failed: failedPages
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('OCR processing error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
