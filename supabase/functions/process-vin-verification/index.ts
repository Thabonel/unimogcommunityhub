import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VINProcessingRequest {
  documentUrl: string;
  documentType: 'registration' | 'title' | 'insurance' | 'photo';
}

interface VINProcessingResponse {
  extractedVin: string | null;
  confidence: number;
  autoApproved: boolean;
  rawOcrText?: string;
  processingTime: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get request body
    const body: VINProcessingRequest = await req.json()
    const { documentUrl, documentType } = body

    console.log(`[VIN OCR] Processing document: ${documentType} from ${documentUrl}`)

    const startTime = Date.now()

    // Get Unstructured API key
    const unstructuredApiKey = Deno.env.get('UNSTRUCTURED_API_KEY')
    if (!unstructuredApiKey) {
      throw new Error('Unstructured API key not configured')
    }

    // Download document from Supabase Storage
    console.log('[VIN OCR] Downloading document for processing...')
    const documentResponse = await fetch(documentUrl)
    if (!documentResponse.ok) {
      throw new Error(`Failed to download document: ${documentResponse.status}`)
    }
    const documentBlob = await documentResponse.blob()

    // Process with Unstructured API
    console.log('[VIN OCR] Sending to Unstructured API...')
    const formData = new FormData()
    formData.append('files', documentBlob, 'document.jpg')
    formData.append('strategy', 'ocr_only')
    formData.append('extract_text_only', 'true')

    const ocrResponse = await fetch('https://api.unstructured.io/general/v0/general', {
      method: 'POST',
      headers: {
        'unstructured-api-key': unstructuredApiKey,
      },
      body: formData,
    })

    if (!ocrResponse.ok) {
      throw new Error(`OCR API failed: ${ocrResponse.status}`)
    }

    const ocrData = await ocrResponse.json()
    console.log('[VIN OCR] OCR processing complete')

    // Extract text from OCR response
    const extractedText = ocrData
      .map((element: any) => element.text || '')
      .join(' ')
      .toUpperCase()

    console.log('[VIN OCR] Raw OCR text length:', extractedText.length)

    // VIN detection patterns
    const vinPatterns = [
      // Standard VIN pattern: 17 characters, no I, O, Q
      /[A-HJ-NPR-Z0-9]{17}/g,
      // VIN with common separators
      /VIN[:\s]*([A-HJ-NPR-Z0-9]{17})/gi,
      /VEHICLE\s*IDENTIFICATION[:\s]*([A-HJ-NPR-Z0-9]{17})/gi,
      // Registration specific patterns
      /CHASSIS[:\s]*([A-HJ-NPR-Z0-9]{17})/gi,
      /ENGINE[:\s]*([A-HJ-NPR-Z0-9]{17})/gi,
    ]

    let bestVin = null
    let bestConfidence = 0

    // Try each pattern
    for (const pattern of vinPatterns) {
      const matches = extractedText.match(pattern)
      if (matches) {
        for (const match of matches) {
          // Extract just the VIN part if there's a capture group
          const vin = match.length === 17 ? match : match.replace(/^.*?([A-HJ-NPR-Z0-9]{17}).*$/, '$1')

          if (vin.length === 17) {
            // Calculate confidence based on VIN validity and context
            let confidence = 60 // Base confidence for 17-character match

            // Check VIN format validity
            if (isValidVinFormat(vin)) {
              confidence += 20
            }

            // Boost confidence based on context around VIN
            const vinIndex = extractedText.indexOf(vin)
            const context = extractedText.substring(Math.max(0, vinIndex - 20), vinIndex + 37)

            if (/VIN|VEHICLE.*IDENTIFICATION|CHASSIS/i.test(context)) {
              confidence += 15
            }

            // Check for Unimog-specific identifiers
            if (extractedText.includes('UNIMOG') || extractedText.includes('MERCEDES') || extractedText.includes('DAIMLER')) {
              confidence += 10
            }

            // Prefer VINs that start with typical Unimog prefixes
            if (vin.startsWith('WDB') || vin.startsWith('VSA')) {
              confidence += 5
            }

            if (confidence > bestConfidence) {
              bestVin = vin
              bestConfidence = confidence
            }
          }
        }
      }
    }

    const processingTime = Date.now() - startTime

    // Determine if auto-approval is warranted
    const autoApproved = bestVin !== null && bestConfidence >= 90

    const result: VINProcessingResponse = {
      extractedVin: bestVin,
      confidence: bestConfidence,
      autoApproved,
      rawOcrText: extractedText.substring(0, 500), // First 500 chars for debugging
      processingTime
    }

    console.log(`[VIN OCR] Processing complete:`, {
      vinFound: !!bestVin,
      confidence: bestConfidence,
      autoApproved,
      processingTimeMs: processingTime
    })

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('[VIN OCR] Error:', error)

    return new Response(JSON.stringify({
      error: error.message,
      extractedVin: null,
      confidence: 0,
      autoApproved: false,
      processingTime: 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

// Helper function to validate VIN format
function isValidVinFormat(vin: string): boolean {
  // Basic VIN validation rules
  if (vin.length !== 17) return false

  // VINs don't contain I, O, Q
  if (/[IOQ]/.test(vin)) return false

  // Must be alphanumeric
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return false

  // Additional validation could include check digit verification
  // but that's complex and varies by manufacturer

  return true
}

/* To deploy this function with Supabase CLI:
supabase functions deploy process-vin-verification --project-ref ydevatqwkoccxhtejdor
*/