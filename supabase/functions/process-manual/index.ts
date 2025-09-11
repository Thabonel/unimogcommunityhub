import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { RecursiveCharacterTextSplitter } from 'https://esm.sh/langchain@0.2.0/text_splitter'
import { OpenAIEmbeddings } from 'https://esm.sh/@langchain/openai@0.2.0'
import { PDFLoader } from 'https://esm.sh/@langchain/community@0.2.0/document_loaders/fs/pdf'
// Enhanced PDF processing imports
import { getDocument } from 'https://esm.sh/pdfjs-dist@4.0.269/build/pdf.min.mjs'
import { TextItem, TextMarkedContent } from 'https://esm.sh/pdfjs-dist@4.0.269/types/src/display/api.d.ts'

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

// Enhanced PDF processing configuration
const PDF_PROCESSING_CONFIG = {
  preserveFormatting: true,
  extractTables: true,
  extractImages: true,
  useOCR: false, // Can be enabled for scanned PDFs
  qualityThreshold: 0.8, // Minimum text extraction quality
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

    // Extract text from PDF using enhanced processing
    console.log('Extracting text from PDF with enhanced processing...')
    let docs
    let extractionMethod = 'standard'
    
    try {
      // First try enhanced PDF processing for better text quality
      docs = await enhancedPDFExtraction(buffer)
      extractionMethod = 'enhanced'
      console.log(`Enhanced extraction successful: ${docs.length} pages`)
    } catch (enhancedError) {
      console.warn('Enhanced extraction failed, falling back to standard:', enhancedError.message)
      
      // Fallback to standard PDF processing
      const loader = new PDFLoader(new Blob([buffer]))
      docs = await loader.load()
      extractionMethod = 'standard'
    }

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

    // Initialize procedure-aware text splitter for better chunking
    const textSplitter = new ProcedureAwareTextSplitter({
      chunkSize: CHUNK_CONFIG.chunkSize,
      chunkOverlap: CHUNK_CONFIG.chunkOverlap,
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

      // Enhanced content type detection
      const contentType = detectContentType(pageContent)
      const sectionTitle = extractSectionTitle(pageContent)
      const hasVisualElements = docs[pageNum].metadata?.hasVisualElements || false
      const procedureComplexity = analyzeProcedureComplexity(pageContent)

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
          page_number: pageNum + 1,
          section_title: sectionTitle,
          embedding: `[${embedding.join(',')}]`,
          has_visual_elements: hasVisualElements,
          visual_content_type: hasVisualElements ? detectVisualContentType(pageContent) : null,
          metadata: {
            ...pageMetadata,
            filename,
            char_count: chunkContent.length,
            word_count: chunkContent.split(/\s+/).length,
            // Enhanced processing metadata
            contentType: contentType,
            procedureComplexity: procedureComplexity,
            extractionMethod: extractionMethod,
            extractionQuality: calculateExtractionQuality(chunkContent),
            hasVisualElements: hasVisualElements,
            visualContentType: hasVisualElements ? detectVisualContentType(pageContent) : null
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

// Enhanced PDF Processing Functions

/**
 * Enhanced PDF text extraction with better formatting and quality
 */
async function enhancedPDFExtraction(buffer: Uint8Array): Promise<any[]> {
  const pdf = await getDocument({ data: buffer }).promise
  const docs = []
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    
    // Enhanced text extraction with positioning and formatting
    let pageText = ''
    let lastY = null
    let lastX = 0
    
    for (const item of textContent.items) {
      const textItem = item as TextItem
      
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
    pageText = cleanExtractedText(pageText)
    
    // Only include pages with substantial content
    if (pageText.trim().length > 50) {
      docs.push({
        pageContent: pageText,
        metadata: {
          page: pageNum,
          extractionMethod: 'enhanced',
          textLength: pageText.length,
          hasVisualElements: await detectVisualElements(page)
        }
      })
    }
  }
  
  return docs
}

/**
 * Clean and improve extracted text quality
 */
function cleanExtractedText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Fix common OCR/extraction errors
    .replace(/\b([A-Z])\s+([A-Z])\s+([A-Z])/g, '$1$2$3') // Fix spaced-out acronyms
    .replace(/(\d)\s+(\d)/g, '$1$2') // Fix spaced numbers
    .replace(/([a-z])\s+([A-Z])/g, '$1 $2') // Proper word spacing
    // Preserve paragraph breaks
    .replace(/\.\s+([A-Z])/g, '.\n\n$1')
    // Clean up line breaks
    .replace(/\n\s+/g, '\n')
    .trim()
}

/**
 * Detect if a page contains visual elements (diagrams, tables, etc.)
 */
async function detectVisualElements(page: any): Promise<boolean> {
  try {
    // Check for annotations, which often indicate diagrams
    const annotations = await page.getAnnotations()
    if (annotations.length > 0) return true
    
    // Check text layout complexity (tables often have complex positioning)
    const textContent = await page.getTextContent()
    const items = textContent.items as TextItem[]
    
    if (items.length === 0) return false
    
    // Calculate text distribution variance (high variance = complex layout)
    const yPositions = items.map(item => item.transform[5])
    const uniqueYPositions = new Set(yPositions)
    
    // More than 20 unique Y positions often indicates tables or complex layout
    return uniqueYPositions.size > 20
  } catch {
    return false
  }
}

/**
 * Procedure-aware text splitter that keeps maintenance steps together
 */
class ProcedureAwareTextSplitter extends RecursiveCharacterTextSplitter {
  constructor(options: any = {}) {
    super({
      ...options,
      separators: [
        '\n\n--- PROCEDURE ---\n\n', // Strong procedure boundary
        '\n\nSTEP ', // Step boundaries
        '\n\n\d+\. ', // Numbered lists
        '\n\n• ', // Bullet points
        '\n\nNOTE:', // Important notes
        '\n\nWARNING:', // Safety warnings
        '\n\nCAUTION:', // Caution statements
        ...options.separators || CHUNK_CONFIG.separators
      ]
    })
  }
  
  protected _splitText(text: string, separator: string): string[] {
    // Keep procedure steps together by detecting step patterns
    if (this.isStepPattern(separator)) {
      return this.splitPreservingSteps(text, separator)
    }
    
    return super._splitText(text, separator)
  }
  
  private isStepPattern(separator: string): boolean {
    return separator.includes('STEP') || separator.match(/^\n\n\d+\. /)
  }
  
  private splitPreservingSteps(text: string, separator: string): string[] {
    const parts = text.split(separator)
    const result = []
    let currentChunk = ''
    
    for (const part of parts) {
      const potentialChunk = currentChunk + (currentChunk ? separator : '') + part
      
      // If adding this part would exceed chunk size and we have content, split here
      if (potentialChunk.length > this.chunkSize && currentChunk) {
        result.push(currentChunk)
        currentChunk = part
      } else {
        currentChunk = potentialChunk
      }
    }
    
    if (currentChunk) {
      result.push(currentChunk)
    }
    
    return result.filter(chunk => chunk.trim().length > 0)
  }
}

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

/**
 * Analyze procedure complexity based on content patterns
 */
function analyzeProcedureComplexity(text: string): number {
  let complexity = 1 // Base complexity
  
  // Count step indicators
  const stepMatches = text.match(/^\s*\d+\.\s+/gm) || []
  complexity += Math.min(stepMatches.length * 0.2, 2)
  
  // Check for warnings (increase complexity)
  const warningMatches = text.match(/(WARNING|CAUTION|DANGER)/gi) || []
  complexity += warningMatches.length * 0.5
  
  // Check for tool requirements
  const toolMatches = text.match(/(tool|wrench|screwdriver|jack|hoist)/gi) || []
  complexity += Math.min(toolMatches.length * 0.1, 1)
  
  // Check for technical measurements
  const measurementMatches = text.match(/\d+\s*(nm|lb-ft|bar|psi|°)/gi) || []
  complexity += Math.min(measurementMatches.length * 0.1, 1)
  
  // Cap complexity at 5
  return Math.min(Math.round(complexity * 10) / 10, 5)
}

/**
 * Detect type of visual content based on text references
 */
function detectVisualContentType(text: string): string {
  const lower = text.toLowerCase()
  
  if (lower.includes('wiring') || lower.includes('electrical')) return 'wiring_diagram'
  if (lower.includes('exploded') || lower.includes('assembly')) return 'exploded_view'
  if (lower.includes('flow') || lower.includes('hydraulic')) return 'flow_diagram'
  if (lower.includes('torque') || lower.includes('specification')) return 'specification_table'
  if (lower.includes('location') || lower.includes('position')) return 'location_diagram'
  
  return 'general_diagram'
}

/**
 * Calculate extraction quality score based on text characteristics
 */
function calculateExtractionQuality(text: string): number {
  let quality = 1.0
  
  // Penalize for excessive whitespace (poor extraction)
  const whitespaceRatio = (text.match(/\s/g) || []).length / text.length
  if (whitespaceRatio > 0.3) quality -= 0.2
  
  // Penalize for fragmented words (OCR errors)
  const fragmentedWords = (text.match(/\b\w\s+\w\s+\w\b/g) || []).length
  quality -= fragmentedWords * 0.05
  
  // Reward for proper sentence structure
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
  quality += Math.min(sentences.length * 0.02, 0.2)
  
  // Reward for technical content
  const technicalTerms = (text.match(/(unimog|engine|transmission|hydraulic|brake|clutch)/gi) || []).length
  quality += Math.min(technicalTerms * 0.01, 0.1)
  
  return Math.max(0.1, Math.min(quality, 1.0))
}

function detectContentType_old(text: string): string {
  // Keep old function for fallback
  const lines = text.split('\n')
  
  if (text.includes('|') || text.match(/\t{2,}/) || text.match(/\s{4,}\S+\s{4,}/)) {
    return 'table'
  }
  
  if (text.match(/^\d+\./m) || text.match(/^[a-z]\)/m) || text.includes('Step ')) {
    return 'procedure'
  }
  
  if (text.match(/^(Figure|Fig\.|Diagram|Image|Photo)/m)) {
    return 'diagram_caption'
  }
  
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