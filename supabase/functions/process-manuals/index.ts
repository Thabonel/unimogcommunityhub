import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as pdfjs from 'https://esm.sh/pdfjs-dist@3.11.174'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const OPENAI_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

interface ChunkMetadata {
  pageNumber: number
  sectionTitle?: string
  contentType: 'text' | 'table' | 'diagram_caption' | 'procedure'
}

async function extractTextFromPDF(pdfBuffer: ArrayBuffer): Promise<{ text: string; metadata: ChunkMetadata }[]> {
  const chunks: { text: string; metadata: ChunkMetadata }[] = []
  
  try {
    const pdf = await pdfjs.getDocument({ data: pdfBuffer }).promise
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      let pageText = ''
      let currentY = 0
      let currentSection = ''
      
      for (const item of textContent.items) {
        if ('str' in item) {
          // Detect section headers (usually larger font or different Y position)
          if (item.transform && Math.abs(item.transform[5] - currentY) > 20) {
            // Potential section header
            if (pageText && pageText.length > 100) {
              // Save previous chunk
              chunks.push({
                text: pageText.trim(),
                metadata: {
                  pageNumber: pageNum,
                  sectionTitle: currentSection || undefined,
                  contentType: detectContentType(pageText)
                }
              })
              pageText = ''
            }
            currentSection = item.str
            currentY = item.transform[5]
          }
          
          pageText += item.str + ' '
        }
      }
      
      // Add remaining text from page
      if (pageText.trim()) {
        chunks.push({
          text: pageText.trim(),
          metadata: {
            pageNumber: pageNum,
            sectionTitle: currentSection || undefined,
            contentType: detectContentType(pageText)
          }
        })
      }
    }
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw error
  }
  
  return chunks
}

function detectContentType(text: string): 'text' | 'table' | 'diagram_caption' | 'procedure' {
  // Simple heuristics to detect content type
  if (text.includes('|') && text.split('|').length > 5) return 'table'
  if (text.match(/^(Figure|Fig\.|Diagram|Chart)/i)) return 'diagram_caption'
  if (text.match(/^(Step \d|^\d+\.)/m) && text.includes('\n')) return 'procedure'
  return 'text'
}

function createSmartChunks(
  extractedChunks: { text: string; metadata: ChunkMetadata }[],
  maxTokens: number = 512,
  overlapTokens: number = 100
): { text: string; metadata: ChunkMetadata }[] {
  const finalChunks: { text: string; metadata: ChunkMetadata }[] = []
  
  for (const chunk of extractedChunks) {
    const words = chunk.text.split(/\s+/)
    const estimatedTokens = Math.ceil(words.length * 1.3) // Rough token estimation
    
    if (estimatedTokens <= maxTokens) {
      // Chunk fits within limit
      finalChunks.push(chunk)
    } else {
      // Need to split this chunk
      const wordsPerChunk = Math.floor(maxTokens / 1.3)
      const overlapWords = Math.floor(overlapTokens / 1.3)
      
      for (let i = 0; i < words.length; i += wordsPerChunk - overlapWords) {
        const chunkWords = words.slice(i, i + wordsPerChunk)
        if (chunkWords.length > 50) { // Minimum chunk size
          finalChunks.push({
            text: chunkWords.join(' '),
            metadata: {
              ...chunk.metadata,
              sectionTitle: chunk.metadata.sectionTitle ? 
                `${chunk.metadata.sectionTitle} (Part ${Math.floor(i / wordsPerChunk) + 1})` : 
                undefined
            }
          })
        }
      }
    }
  }
  
  return finalChunks
}

async function createEmbedding(text: string): Promise<number[]> {
  const response = await fetch(OPENAI_EMBEDDING_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: text,
    }),
  })
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data.data[0].embedding
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )
    
    // Verify admin user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Get request body
    const { filename, title, modelCodes, yearRange, category } = await req.json()
    
    if (!filename) {
      return new Response(
        JSON.stringify({ error: 'Filename is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Download PDF from storage
    const { data: fileData, error: downloadError } = await supabaseClient.storage
      .from('manuals')
      .download(filename)
    
    if (downloadError || !fileData) {
      return new Response(
        JSON.stringify({ error: 'Failed to download manual' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Convert to ArrayBuffer
    const pdfBuffer = await fileData.arrayBuffer()
    
    // Extract text from PDF
    const extractedChunks = await extractTextFromPDF(pdfBuffer)
    
    // Create smart chunks
    const chunks = createSmartChunks(extractedChunks)
    
    // Insert manual metadata
    const { data: manual, error: insertError } = await supabaseClient
      .from('manual_metadata')
      .insert({
        filename,
        title: title || filename,
        model_codes: modelCodes || [],
        year_range: yearRange,
        category: category || 'general',
        page_count: Math.max(...chunks.map(c => c.metadata.pageNumber || 0)),
        file_size: pdfBuffer.byteLength,
        uploaded_by: user.id,
        processed_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (insertError || !manual) {
      return new Response(
        JSON.stringify({ error: 'Failed to save manual metadata' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Process chunks and create embeddings
    const chunkInserts = []
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      
      // Create embedding
      const embedding = await createEmbedding(chunk.text)
      
      chunkInserts.push({
        manual_id: manual.id,
        chunk_index: i,
        content: chunk.text,
        content_type: chunk.metadata.contentType,
        page_number: chunk.metadata.pageNumber,
        section_title: chunk.metadata.sectionTitle,
        embedding: `[${embedding.join(',')}]`,
        metadata: {
          tokens: Math.ceil(chunk.text.split(/\s+/).length * 1.3)
        }
      })
      
      // Insert in batches of 10
      if (chunkInserts.length >= 10) {
        await supabaseClient
          .from('manual_chunks')
          .insert(chunkInserts)
        chunkInserts.length = 0
      }
    }
    
    // Insert remaining chunks
    if (chunkInserts.length > 0) {
      await supabaseClient
        .from('manual_chunks')
        .insert(chunkInserts)
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        manual_id: manual.id,
        chunks_created: chunks.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
    
  } catch (error) {
    console.error('Processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})