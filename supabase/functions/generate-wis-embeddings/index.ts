// WIS Embedding Generation Service
// Generates vector embeddings for WIS content using Sentence Transformers

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Initialize Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface EmbeddingRequest {
  text: string
  model?: string
}

interface EmbeddingResponse {
  embedding: number[]
  model: string
  dimensions: number
}

// Generate embeddings using HuggingFace Inference API
async function generateEmbedding(text: string): Promise<number[]> {
  const HUGGINGFACE_API_KEY = Deno.env.get('HUGGINGFACE_API_KEY')
  
  if (!HUGGINGFACE_API_KEY) {
    throw new Error('HuggingFace API key not configured')
  }

  // Use all-MiniLM-L6-v2 model (384 dimensions, good for semantic search)
  const response = await fetch(
    'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        options: { wait_for_model: true }
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`)
  }

  const embedding = await response.json()
  
  // Pad or truncate to 1536 dimensions to match our database schema
  const paddedEmbedding = new Array(1536).fill(0)
  for (let i = 0; i < Math.min(embedding.length, 1536); i++) {
    paddedEmbedding[i] = embedding[i]
  }
  
  return paddedEmbedding
}

// Process WIS content in batches
async function processBatch(contentType: string, batchSize: number = 50) {
  console.log(`Processing ${contentType} batch...`)
  
  let query
  let updateFunction
  
  switch (contentType) {
    case 'procedures':
      query = supabase
        .from('wis_procedures')
        .select('id, title, description, content')
        .is('embedding', null)
        .limit(batchSize)
        
      updateFunction = async (id: string, embedding: number[]) => {
        return supabase
          .from('wis_procedures')
          .update({ 
            embedding, 
            embedding_model: 'sentence-transformers/all-MiniLM-L6-v2',
            embedding_updated_at: new Date().toISOString()
          })
          .eq('id', id)
      }
      break
      
    case 'parts':
      query = supabase
        .from('wis_parts')
        .select('id, part_number, part_name, description')
        .is('embedding', null)
        .limit(batchSize)
        
      updateFunction = async (id: string, embedding: number[]) => {
        return supabase
          .from('wis_parts')
          .update({ 
            embedding,
            embedding_model: 'sentence-transformers/all-MiniLM-L6-v2', 
            embedding_updated_at: new Date().toISOString()
          })
          .eq('id', id)
      }
      break
      
    case 'bulletins':
      query = supabase
        .from('wis_bulletins')
        .select('id, title, description, content')
        .is('embedding', null)
        .limit(batchSize)
        
      updateFunction = async (id: string, embedding: number[]) => {
        return supabase
          .from('wis_bulletins')
          .update({ 
            embedding,
            embedding_model: 'sentence-transformers/all-MiniLM-L6-v2',
            embedding_updated_at: new Date().toISOString()
          })
          .eq('id', id)
      }
      break
      
    case 'chunks':
      query = supabase
        .from('wis_chunks')
        .select('id, title, content')
        .is('embedding', null)
        .limit(batchSize)
        
      updateFunction = async (id: string, embedding: number[]) => {
        return supabase
          .from('wis_chunks')
          .update({ 
            embedding,
            embedding_updated_at: new Date().toISOString()
          })
          .eq('id', id)
      }
      break
      
    default:
      throw new Error(`Unknown content type: ${contentType}`)
  }
  
  const { data: items, error } = await query
  
  if (error) {
    console.error(`Error fetching ${contentType}:`, error)
    throw error
  }
  
  if (!items || items.length === 0) {
    console.log(`No more ${contentType} to process`)
    return 0
  }
  
  console.log(`Processing ${items.length} ${contentType} items`)
  
  let processed = 0
  
  for (const item of items) {
    try {
      // Combine title and content/description for better embeddings
      let textToEmbed = ''
      
      switch (contentType) {
        case 'procedures':
          textToEmbed = `${item.title || ''}\n${item.description || ''}\n${item.content || ''}`.trim()
          break
        case 'parts':
          textToEmbed = `${item.part_number || ''} ${item.part_name || ''}\n${item.description || ''}`.trim()
          break
        case 'bulletins':
          textToEmbed = `${item.title || ''}\n${item.description || ''}\n${item.content || ''}`.trim()
          break
        case 'chunks':
          textToEmbed = `${item.title || ''}\n${item.content || ''}`.trim()
          break
      }
      
      if (!textToEmbed) {
        console.log(`Skipping ${contentType} item ${item.id} - no content`)
        continue
      }
      
      // Generate embedding
      const embedding = await generateEmbedding(textToEmbed)
      
      // Update database
      const { error: updateError } = await updateFunction(item.id, embedding)
      
      if (updateError) {
        console.error(`Error updating ${contentType} ${item.id}:`, updateError)
        continue
      }
      
      processed++
      console.log(`✅ Processed ${contentType} ${item.id} (${processed}/${items.length})`)
      
      // Rate limiting - wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`Error processing ${contentType} ${item.id}:`, error)
      continue
    }
  }
  
  return processed
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, contentType, batchSize } = await req.json()
    
    if (action === 'process_batch') {
      const processed = await processBatch(contentType, batchSize)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          processed,
          contentType,
          message: `Processed ${processed} ${contentType} items`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    if (action === 'generate_single') {
      const { text } = await req.json()
      const embedding = await generateEmbedding(text)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          embedding,
          dimensions: embedding.length,
          model: 'sentence-transformers/all-MiniLM-L6-v2'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    if (action === 'status') {
      // Get embedding generation status
      const [proceduresResult, partsResult, bulletinsResult, chunksResult] = await Promise.all([
        supabase.from('wis_procedures').select('id, embedding').limit(1000),
        supabase.from('wis_parts').select('id, embedding').limit(1000),
        supabase.from('wis_bulletins').select('id, embedding').limit(1000),
        supabase.from('wis_chunks').select('id, embedding').limit(1000)
      ])
      
      const status = {
        procedures: {
          total: proceduresResult.data?.length || 0,
          withEmbeddings: proceduresResult.data?.filter(item => item.embedding).length || 0
        },
        parts: {
          total: partsResult.data?.length || 0,
          withEmbeddings: partsResult.data?.filter(item => item.embedding).length || 0
        },
        bulletins: {
          total: bulletinsResult.data?.length || 0,
          withEmbeddings: bulletinsResult.data?.filter(item => item.embedding).length || 0
        },
        chunks: {
          total: chunksResult.data?.length || 0,
          withEmbeddings: chunksResult.data?.filter(item => item.embedding).length || 0
        }
      }
      
      return new Response(
        JSON.stringify({ success: true, status }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Error in generate-wis-embeddings function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})