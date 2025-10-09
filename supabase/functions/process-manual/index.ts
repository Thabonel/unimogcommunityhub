import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as pdfjs from 'https://esm.sh/pdfjs-dist@3.11.174'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const OPENAI_API_KEY = <OPENAI_API_KEY>
const OPENAI_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

// Configuration for chunking
const CHUNK_SIZE = 1500
const CHUNK_OVERLAP = 200

// Direct OpenAI API function for embeddings
async function createEmbedding(text: string) {
  const response = await fetch(OPENAI_EMBEDDING_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

// Simple text chunking function
function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start = end - overlap
    if (start >= text.length) break
  }

  return chunks.filter(chunk => chunk.trim().length > 50)
}

// Extract text from PDF using PDF.js
async function extractTextFromPDF(buffer: Uint8Array) {
  const pdf = await pdfjs.getDocument({ data: buffer }).promise
  const docs = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()

    let pageText = ''
    let lastY: number | null = null
    let lastX = 0

    for (const item of textContent.items) {
      const textItem = item as any

      if ('str' in textItem) {
        const { str, transform } = textItem
        const x = transform[4]
        const y = transform[5]

        // Detect new lines based on Y position changes
        if (lastY !== null && Math.abs(y - lastY) > 5) {
          pageText += '\n'
          lastX = 0
        }

        // Add spacing for significant X position jumps (tables/columns)
        if (lastY === y && x > lastX + 50) {
          pageText += '\t'
        }

        pageText += str + ' '
        lastY = y
        lastX = x
      }
    }

    // Clean up the extracted text
    pageText = pageText
      .replace(/\s+/g, ' ')
      .replace(/\b([A-Z])\s+([A-Z])\s+([A-Z])/g, '$1$2$3')
      .replace(/(\d)\s+(\d)/g, '$1$2')
      .replace(/([a-z])\s+([A-Z])/g, '$1 $2')
      .replace(/\.\s+([A-Z])/g, '.\n\n$1')
      .replace(/\n\s+/g, '\n')
      .trim()

    // Only include pages with substantial content
    if (pageText.trim().length > 50) {
      docs.push({
        pageContent: pageText,
        metadata: {
          page: pageNum,
          textLength: pageText.length
        }
      })
    }
  }

  return docs
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
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
    const docs = await extractTextFromPDF(buffer)
    const extractionMethod = 'direct'
    console.log(`Extraction successful: ${docs.length} pages`)

    if (!docs || docs.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No content extracted from PDF' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Extracted ${docs.length} pages from PDF using ${extractionMethod} method`)

    // Extract metadata from the first page or filename
    const title = filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ')
    const modelCodes = extractModelCodes(docs[0].pageContent + ' ' + filename)
    const yearRange = extractYearRange(docs[0].pageContent)
    const category = categorizeManual(filename, docs[0].pageContent)

    // Check if manual already exists
    const { data: existingManual } = await supabaseClient
      .from('manual_metadata')
      .select('id')
      .eq('filename', filename)
      .single()

    let manualMetadata

    if (existingManual) {
      // Update existing manual timestamp
      const { data: updated, error: updateError } = await supabaseClient
        .from('manual_metadata')
        .update({
          updated_at: new Date().toISOString()
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
          uploaded_by: user.id
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

    // Process each page and create chunks
    const chunks = []
    let chunkIndex = 0

    for (let pageNum = 0; pageNum < docs.length; pageNum++) {
      const pageContent = docs[pageNum].pageContent
      const pageMetadata = docs[pageNum].metadata || {}

      // Enhanced content type detection
      const contentType = detectContentType(pageContent)
      const sectionTitle = extractSectionTitle(pageContent)

      // Split the page content into chunks using our simple chunking function
      const pageChunks = chunkText(pageContent, CHUNK_SIZE, CHUNK_OVERLAP)

      for (const chunkContent of pageChunks) {
        // Skip empty chunks
        if (!chunkContent.trim()) continue

        // Generate embedding for this chunk using direct OpenAI API
        const embedding = await createEmbedding(chunkContent)

        chunks.push({
          manual_id: manualMetadata.id,
          chunk_index: chunkIndex++,
          content: chunkContent,
          page_number: pageNum + 1,
          section_title: sectionTitle,
          embedding: `[${embedding.join(',')}]`,
          metadata: {
            ...pageMetadata,
            filename,
            char_count: chunkContent.length,
            word_count: chunkContent.split(/\s+/).length,
            contentType: contentType,
            extractionMethod: extractionMethod
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

    // Update manual metadata with completion timestamp
    const { error: finalUpdateError } = await supabaseClient
      .from('manual_metadata')
      .update({
        processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
              updated_at: new Date().toISOString()
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
  const lower = text.toLowerCase()
  
  // Enhanced content type detection with better patterns
  
  // Check for procedure/maintenance steps
  if (text.match(/^\s*\d+\.\s+/m) || 
      text.match(/^\s*step\s+\d+/mi) ||
      lower.includes('procedure') || 
      lower.includes('maintenance') ||
      text.match(/^\s*[a-z]\)\s+/m)) {
    return 'procedure'
  }
  
  // Check for table-like content
  if (text.includes('|') || 
      text.match(/\t{2,}/) || 
      text.match(/\s{4,}\S+\s{4,}/) ||
      (text.split('\n').some(line => line.split(/\s{2,}/).length > 3))) {
    return 'table'
  }
  
  // Check for specifications/technical data
  if (lower.includes('specification') ||
      lower.includes('torque') ||
      text.match(/\d+\s*(nm|lb-ft|kg|bar|psi)/i) ||
      text.match(/\d+\.\d+\s*(mm|in|°)/)) {
    return 'specification'
  }
  
  // Check for warnings and notes
  if (text.match(/^(WARNING|CAUTION|NOTE|IMPORTANT)/mi)) {
    return 'warning'
  }
  
  // Check for diagram captions and references
  if (text.match(/^(Figure|Fig\.|Diagram|Image|Photo|Illustration)/mi) ||
      text.match(/refer to (figure|diagram)/i)) {
    return 'diagram_caption'
  }
  
  // Check for parts lists
  if (lower.includes('part number') ||
      lower.includes('qty') ||
      text.match(/\d+-\d+-\d+/)) { // Part number pattern
    return 'parts_list'
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