import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Process manual request received:', req.method)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get request body
    const body = await req.json()
    const { filename } = body

    if (!filename) {
      return new Response(
        JSON.stringify({ error: 'Filename is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Processing manual: ${filename}`)

    // Check if manual exists in storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('manuals')
      .download(filename)

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError)
      return new Response(
        JSON.stringify({ error: 'Failed to download file from storage' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get file size
    const fileSize = fileData.size

    // For now, just create a placeholder entry to test the flow
    // Later we can add actual PDF processing

    // Extract title from filename
    const title = filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ')

    // Check if manual already exists
    const { data: existingManual } = await supabaseClient
      .from('manual_metadata')
      .select('id, processing_status')
      .eq('filename', filename)
      .single()

    let manualMetadata

    if (existingManual) {
      // Update existing manual
      const { data: updated, error: updateError } = await supabaseClient
        .from('manual_metadata')
        .update({
          processing_status: 'completed',
          processing_started_at: new Date().toISOString(),
          processing_completed_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
          chunk_count: 1,
          error_message: null
        })
        .eq('id', existingManual.id)
        .select()
        .single()

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error('Failed to update manual metadata')
      }
      manualMetadata = updated
    } else {
      // Create new manual metadata entry
      const { data: created, error: metadataError } = await supabaseClient
        .from('manual_metadata')
        .insert({
          filename,
          title,
          model_codes: ['U1700L', 'U435'],
          year_range: '2000-2024',
          category: 'workshop',
          page_count: 100, // Placeholder
          file_size: fileSize,
          uploaded_by: user.id,
          processing_status: 'completed',
          processing_started_at: new Date().toISOString(),
          processing_completed_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
          chunk_count: 1
        })
        .select()
        .single()

      if (metadataError || !created) {
        console.error('Metadata error:', metadataError)
        throw new Error('Failed to create manual metadata')
      }
      manualMetadata = created
    }

    // Create a simple test chunk
    const { error: chunkError } = await supabaseClient
      .from('manual_chunks')
      .upsert({
        manual_id: manualMetadata.id,
        manual_title: title,
        chunk_index: 0,
        content: `This is a test chunk for ${filename}. The manual processing system is working and ready for full PDF text extraction.`,
        page_number: 1,
        section_title: 'Test Section',
        metadata: {
          filename,
          char_count: 100,
          word_count: 20,
          contentType: 'test',
          extractionMethod: 'simple',
          extractionQuality: 1.0
        }
      })

    if (chunkError) {
      console.error('Chunk error:', chunkError)
    }

    console.log(`Manual processing completed for: ${filename}`)

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        manual_id: manualMetadata.id,
        title: manualMetadata.title,
        pages: 100,
        chunks: 1,
        model_codes: ['U1700L', 'U435'],
        category: 'workshop',
        message: 'Manual processed successfully (simplified version)'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})