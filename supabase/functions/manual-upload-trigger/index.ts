import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // This function is triggered by Supabase Storage webhooks
    // when a new file is uploaded to the manuals bucket
    const { type, record, old_record } = await req.json()

    // Only process INSERT events (new uploads)
    if (type !== 'INSERT') {
      return new Response(
        JSON.stringify({ message: 'Not a new upload event' }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const filename = record.name
    const bucket = record.bucket_id

    // Check if this file has already been processed
    const { data: existing } = await supabaseAdmin
      .from('manual_metadata')
      .select('id, processed_at')
      .eq('filename', filename)
      .single()

    if (existing && existing.processed_at) {
      console.log(`File ${filename} already processed`)
      return new Response(
        JSON.stringify({ 
          message: 'File already processed',
          manual_id: existing.id 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Auto-processing new manual upload: ${filename}`)

    // Trigger processing by calling the process-manual function
    const processResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/process-manual`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          filename,
          bucket,
        }),
      }
    )

    if (!processResponse.ok) {
      const error = await processResponse.text()
      console.error('Processing failed:', error)
      
      // Log the error but don't fail the trigger
      await supabaseAdmin
        .from('processing_errors')
        .insert({
          filename,
          error: error.substring(0, 1000), // Truncate long errors
          created_at: new Date().toISOString(),
        })

      return new Response(
        JSON.stringify({ 
          error: 'Processing failed',
          details: error 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const result = await processResponse.json()
    console.log(`Successfully processed ${filename}:`, result)

    // Send notification to admin (optional)
    if (Deno.env.get('ADMIN_EMAIL')) {
      // You could send an email notification here
      console.log(`Notification would be sent to admin about ${filename}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        manual_id: result.manual_id,
        chunks: result.chunks,
        pages: result.pages,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Trigger error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})