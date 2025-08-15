import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { RecursiveCharacterTextSplitter } from 'https://esm.sh/langchain@0.2.0/text_splitter'
import { OpenAIEmbeddings } from 'https://esm.sh/@langchain/openai@0.2.0'
import { PDFLoader } from 'https://esm.sh/@langchain/community@0.2.0/document_loaders/fs/pdf'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configuration for chunking
const CHUNK_CONFIG = {
  chunkSize: 1500,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', '.', '!', '?', ';', ':', ' ', ''],
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Store filename for error handling
  let filename: string | null = null;
  let bucket: string = 'manuals';

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role for admin operations
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated and is admin
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

    // Get request body and store filename
    const body = await req.json()
    filename = body.filename;
    bucket = body.bucket || 'manuals';
    if (!filename) {
      return new Response(
        JSON.stringify({ error: 'Filename is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Processing manual: ${filename} from bucket: ${bucket}`)

    // Download the PDF from storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from(bucket)
      .download(filename)

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError)
      return new Response(
        JSON.stringify({ error: 'Failed to download file' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Convert blob to buffer for processing
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Extract text from PDF
    console.log('Extracting text from PDF...')
    const loader = new PDFLoader(new Blob([buffer]))
    const docs = await loader.load()

    if (!docs || docs.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No content extracted from PDF' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Extracted ${docs.length} pages from PDF`)

    // Extract metadata from the first page or filename
    const title = filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ')
    const modelCodes = extractModelCodes(docs[0].pageContent + ' ' + filename)
    const yearRange = extractYearRange(docs[0].pageContent)
    const category = categorizeManual(filename, docs[0].pageContent)

    // Check if manual already exists
    const { data: existingManual } = await supabaseClient
      .from('manual_metadata')
      .select('id, processing_status')
      .eq('filename', filename)
      .single()

    let manualMetadata
    
    if (existingManual) {
      // Update existing manual to processing status
      const { data: updated, error: updateError } = await supabaseClient
        .from('manual_metadata')
        .update({
          processing_status: 'processing',
          processing_started_at: new Date().toISOString(),
          error_message: null
        })
        .eq('id', existingManual.id)
        .select()
        .single()
      
      if (updateError) {
        console.error('Update error:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to update manual metadata' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      manualMetadata = updated
    } else {
      // Create new manual metadata entry
      const { data: created, error: metadataError } = await supabaseClient
        .from('manual_metadata')
        .insert({
          filename,
          title,
          model_codes: modelCodes,
          year_range: yearRange,
          category,
          page_count: docs.length,
          file_size: buffer.length,
          uploaded_by: user.id,
          processing_status: 'processing',
          processing_started_at: new Date().toISOString()
        })
        .select()
        .single()

      if (metadataError || !created) {
        console.error('Metadata error:', metadataError)
        return new Response(
          JSON.stringify({ error: 'Failed to create manual metadata' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      manualMetadata = created
    }

    if (!manualMetadata) {
      return new Response(
        JSON.stringify({ error: 'Failed to create or update manual metadata' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Created manual metadata with ID: ${manualMetadata.id}`)

    // Initialize text splitter
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_CONFIG.chunkSize,
      chunkOverlap: CHUNK_CONFIG.chunkOverlap,
      separators: CHUNK_CONFIG.separators,
    })

    // Initialize OpenAI embeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
      modelName: 'text-embedding-ada-002',
    })

    // Process each page and create chunks
    const chunks = []
    let chunkIndex = 0

    for (let pageNum = 0; pageNum < docs.length; pageNum++) {
      const pageContent = docs[pageNum].pageContent
      const pageMetadata = docs[pageNum].metadata || {}

      // Detect content type
      const contentType = detectContentType(pageContent)
      const sectionTitle = extractSectionTitle(pageContent)

      // Split the page content into chunks
      const pageChunks = await textSplitter.splitText(pageContent)

      for (const chunkContent of pageChunks) {
        // Skip empty chunks
        if (!chunkContent.trim()) continue

        // Generate embedding for this chunk
        const [embedding] = await embeddings.embedDocuments([chunkContent])

        chunks.push({
          manual_id: manualMetadata.id,
          chunk_index: chunkIndex++,
          content: chunkContent,
          content_type: contentType,
          page_number: pageNum + 1,
          section_title: sectionTitle,
          embedding: `[${embedding.join(',')}]`,
          metadata: {
            ...pageMetadata,
            filename,
            char_count: chunkContent.length,
            word_count: chunkContent.split(/\s+/).length,
          }
        })
      }
    }

    console.log(`Created ${chunks.length} chunks from ${docs.length} pages`)

    // Batch insert chunks (Supabase has a limit on array size)
    const batchSize = 100
    let insertedCount = 0

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      
      const { error: chunkError } = await supabaseClient
        .from('manual_chunks')
        .insert(batch)

      if (chunkError) {
        console.error(`Error inserting batch ${i / batchSize}:`, chunkError)
        // Continue with other batches even if one fails
      } else {
        insertedCount += batch.length
      }
    }

    console.log(`Successfully inserted ${insertedCount} chunks`)

    // Update manual metadata with completion status
    const { error: finalUpdateError } = await supabaseClient
      .from('manual_metadata')
      .update({
        processing_status: 'completed',
        processing_completed_at: new Date().toISOString(),
        processed_at: new Date().toISOString(),
        chunk_count: insertedCount,
        error_message: null
      })
      .eq('id', manualMetadata.id)

    if (finalUpdateError) {
      console.error('Failed to update completion status:', finalUpdateError)
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        manual_id: manualMetadata.id,
        title: manualMetadata.title,
        pages: docs.length,
        chunks: insertedCount,
        model_codes: modelCodes,
        category,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    
    // Try to update the manual metadata with error status
    if (filename) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
          
          await supabaseClient
            .from('manual_metadata')
            .update({
              processing_status: 'failed',
              error_message: error.message || 'Unknown error occurred',
              processing_completed_at: new Date().toISOString()
            })
            .eq('filename', filename)
      } catch (updateError) {
        console.error('Failed to update error status:', updateError)
      }
    }
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Helper functions

function extractModelCodes(text: string): string[] {
  const modelCodes = new Set<string>()
  
  // Common Unimog model patterns
  const patterns = [
    /U\d{3,4}[A-Z]?/g,  // U1700, U5023
    /404[.\s]?\d*/g,    // 404, 404.1
    /406/g,             // 406
    /411/g,             // 411
    /416/g,             // 416
    /421/g,             // 421
    /425/g,             // 425
    /435/g,             // 435
    /437/g,             // 437
    /UGN/g,             // UGN
    /FLU-419/g,         // SEE/FLU-419
  ]

  patterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(match => modelCodes.add(match.trim()))
    }
  })

  return Array.from(modelCodes)
}

function extractYearRange(text: string): string | null {
  // Look for year patterns (1950-2024 range)
  const yearPattern = /\b(19[5-9]\d|20[0-2]\d)\b/g
  const years = text.match(yearPattern)
  
  if (years && years.length > 0) {
    const uniqueYears = [...new Set(years)].map(Number).sort()
    if (uniqueYears.length === 1) {
      return uniqueYears[0].toString()
    } else {
      return `${uniqueYears[0]}-${uniqueYears[uniqueYears.length - 1]}`
    }
  }
  
  return null
}

function categorizeManual(filename: string, content: string): string {
  const lower = (filename + ' ' + content).toLowerCase()
  
  if (lower.includes('operator') || lower.includes('owner')) return 'operator'
  if (lower.includes('service') || lower.includes('repair')) return 'service'
  if (lower.includes('parts') || lower.includes('catalog')) return 'parts'
  if (lower.includes('workshop')) return 'workshop'
  if (lower.includes('technical') || lower.includes('specification')) return 'technical'
  if (lower.includes('maintenance')) return 'maintenance'
  if (lower.includes('electrical') || lower.includes('wiring')) return 'electrical'
  if (lower.includes('hydraulic')) return 'hydraulic'
  if (lower.includes('engine')) return 'engine'
  if (lower.includes('transmission') || lower.includes('gearbox')) return 'transmission'
  if (lower.includes('axle') || lower.includes('differential')) return 'drivetrain'
  
  return 'general'
}

function detectContentType(text: string): string {
  // Simple heuristic for content type detection
  const lines = text.split('\n')
  const avgLineLength = text.length / lines.length
  
  // Check for table-like content
  if (text.includes('|') || text.match(/\t{2,}/) || text.match(/\s{4,}\S+\s{4,}/)) {
    return 'table'
  }
  
  // Check for procedure/steps
  if (text.match(/^\d+\./m) || text.match(/^[a-z]\)/m) || text.includes('Step ')) {
    return 'procedure'
  }
  
  // Check for diagram captions
  if (text.match(/^(Figure|Fig\.|Diagram|Image|Photo)/m)) {
    return 'diagram_caption'
  }
  
  // Default to text
  return 'text'
}

function extractSectionTitle(text: string): string | null {
  // Look for section headers (usually in caps or numbered)
  const lines = text.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Check for numbered sections
    if (trimmed.match(/^\d+(\.\d+)*\s+[A-Z]/)) {
      return trimmed.substring(0, Math.min(trimmed.length, 100))
    }
    
    // Check for all caps headers
    if (trimmed.length > 3 && trimmed.length < 100 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
      return trimmed
    }
  }
  
  return null
}