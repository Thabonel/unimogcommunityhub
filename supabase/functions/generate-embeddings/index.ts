import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENAI_API_KEY = <OPENAI_API_KEY>
const OPENAI_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings'
const EMBEDDING_MODEL = 'text-embedding-3-small'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { batchSize = 50, resume = false } = await req.json()

    console.log(`🚀 Starting embedding generation process (batch size: ${batchSize}, resume: ${resume})`)

    // Get chunks without embeddings (or all if not resuming)
    let query = supabaseAdmin
      .from('manual_chunks')
      .select('id, content, manual_title, section_title, page_number')

    if (resume) {
      // Only process chunks without embeddings
      query = query.is('embedding', null)
    }

    const { data: chunks, error: fetchError } = await query
      .order('created_at')
      .limit(batchSize)

    if (fetchError) {
      throw new Error(`Error fetching chunks: ${fetchError.message}`)
    }

    if (!chunks || chunks.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No chunks found to process',
          processed: 0,
          total: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`📊 Processing ${chunks.length} manual chunks...`)

    let processed = 0
    let errors = 0
    const processingLog = []

    // Process chunks in smaller batches to avoid rate limits
    const EMBEDDING_BATCH_SIZE = 5

    for (let i = 0; i < chunks.length; i += EMBEDDING_BATCH_SIZE) {
      const batch = chunks.slice(i, i + EMBEDDING_BATCH_SIZE)

      // Process each chunk in the batch
      for (const chunk of batch) {
        try {
          // Create enhanced text for embedding
          const embeddingText = createEmbeddingText(chunk)

          // Generate embedding using OpenAI
          const embeddingResponse = await fetch(OPENAI_EMBEDDING_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              input: embeddingText,
              model: EMBEDDING_MODEL,
              encoding_format: 'float'
            }),
          })

          if (!embeddingResponse.ok) {
            const errorText = await embeddingResponse.text()
            console.error(`OpenAI API error for chunk ${chunk.id}:`, embeddingResponse.status, errorText)
            errors++
            processingLog.push({
              chunk_id: chunk.id,
              status: 'error',
              error: `OpenAI API error: ${embeddingResponse.status}`,
              page: chunk.page_number,
              manual: chunk.manual_title
            })
            continue
          }

          const embeddingData = await embeddingResponse.json()
          const embedding = embeddingData.data?.[0]?.embedding

          if (!embedding || !Array.isArray(embedding)) {
            console.error(`No embedding returned for chunk ${chunk.id}`)
            errors++
            processingLog.push({
              chunk_id: chunk.id,
              status: 'error',
              error: 'No embedding returned from OpenAI',
              page: chunk.page_number,
              manual: chunk.manual_title
            })
            continue
          }

          // Store embedding in database
          const { error: updateError } = await supabaseAdmin
            .from('manual_chunks')
            .update({
              embedding: `[${embedding.join(',')}]`
            })
            .eq('id', chunk.id)

          if (updateError) {
            console.error(`Database update error for chunk ${chunk.id}:`, updateError)
            errors++
            processingLog.push({
              chunk_id: chunk.id,
              status: 'error',
              error: `Database error: ${updateError.message}`,
              page: chunk.page_number,
              manual: chunk.manual_title
            })
            continue
          }

          processed++
          processingLog.push({
            chunk_id: chunk.id,
            status: 'success',
            embedding_length: embedding.length,
            page: chunk.page_number,
            manual: chunk.manual_title,
            content_preview: chunk.content.substring(0, 100) + '...'
          })

          console.log(`✅ Processed chunk ${chunk.id} (Page ${chunk.page_number}) - ${processed}/${chunks.length}`)

          // Rate limiting: small delay between requests
          await new Promise(resolve => setTimeout(resolve, 100))

        } catch (error) {
          console.error(`Error processing chunk ${chunk.id}:`, error)
          errors++
          processingLog.push({
            chunk_id: chunk.id,
            status: 'error',
            error: error.message,
            page: chunk.page_number,
            manual: chunk.manual_title
          })
        }
      }

      // Longer delay between batches
      if (i + EMBEDDING_BATCH_SIZE < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // Log processing results to database
    try {
      await supabaseAdmin
        .from('embedding_generation_logs')
        .insert({
          batch_size: batchSize,
          chunks_processed: processed,
          chunks_failed: errors,
          total_chunks_attempted: chunks.length,
          processing_log: processingLog,
          created_at: new Date().toISOString()
        })
    } catch (logError) {
      console.error('Failed to save processing log:', logError)
    }

    const successRate = processed / chunks.length * 100

    console.log(`🎉 Embedding generation complete! Processed: ${processed}, Errors: ${errors}, Success Rate: ${successRate.toFixed(1)}%`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Embedding generation complete`,
        processed,
        errors,
        successRate: successRate.toFixed(1) + '%',
        total: chunks.length,
        processingLog: processingLog.slice(0, 10) // Return first 10 entries for review
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Embedding generation error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: 'Check function logs for more information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Creates enhanced text for embedding generation
 * Combines content with metadata for better semantic understanding
 */
function createEmbeddingText(chunk: any): string {
  const parts = []

  // Add manual and section context
  if (chunk.manual_title) {
    parts.push(`Manual: ${chunk.manual_title}`)
  }

  if (chunk.section_title) {
    parts.push(`Section: ${chunk.section_title}`)
  }

  if (chunk.page_number) {
    parts.push(`Page: ${chunk.page_number}`)
  }

  // Add main content
  if (chunk.content) {
    parts.push(`Content: ${chunk.content}`)
  }

  return parts.join('\n\n')
}