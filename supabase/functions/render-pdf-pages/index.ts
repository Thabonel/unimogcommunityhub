import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { encodeBase64 } from 'https://deno.land/std@0.168.0/encoding/base64.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const ANTHROPIC_API_KEY = <ANTHROPIC_API_KEY>

interface PageAnalysis {
  pageNumber: number;
  hasVisualContent: boolean;
  visualType: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart' | 'none';
  description: string;
  extractionQuality: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const { filename, bucket = 'manuals', startPage = 1, endPage = 20 } = await req.json()

    if (!filename) {
      return new Response(
        JSON.stringify({ error: 'Filename is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    console.log(`Analyzing visual content for: ${filename}, pages ${startPage}-${endPage}`)

    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(filename)

    if (downloadError || !fileData) {
      throw new Error(`Failed to download PDF: ${downloadError?.message}`)
    }

    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const base64 = encodeBase64(buffer)

    const pageAnalyses: PageAnalysis[] = []
    const batchSize = 5

    for (let batchStart = startPage; batchStart <= endPage; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize - 1, endPage)
      console.log(`Analyzing pages ${batchStart}-${batchEnd}...`)

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY || '',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'document',
                  source: {
                    type: 'base64',
                    media_type: 'application/pdf',
                    data: base64
                  }
                },
                {
                  type: 'text',
                  text: `Analyze pages ${batchStart} to ${batchEnd} of this PDF for visual content.

For EACH page, respond in this exact JSON format:
{
  "pages": [
    {
      "pageNumber": 1,
      "hasVisualContent": true/false,
      "visualType": "photo" | "diagram" | "schematic" | "table" | "chart" | "none",
      "description": "Brief description of visual content",
      "extractionQuality": 0.0-1.0
    }
  ]
}

Visual types:
- "photo": Photographs or realistic images
- "diagram": Technical diagrams, exploded views, cross-sections
- "schematic": Wiring diagrams, hydraulic schematics, flow charts
- "table": Data tables, specification tables
- "chart": Graphs, performance charts
- "none": Text-only pages

extractionQuality: How clear/useful is the visual content (0=unusable, 1=perfect)

Only analyze pages ${batchStart} to ${batchEnd}. Return valid JSON only.`
                }
              ]
            }]
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Claude API error: ${response.status} - ${errorText}`)
          continue
        }

        const result = await response.json()
        const textContent = result.content?.[0]?.text || ''

        try {
          const jsonMatch = textContent.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            if (parsed.pages && Array.isArray(parsed.pages)) {
              pageAnalyses.push(...parsed.pages)
            }
          }
        } catch (parseError) {
          console.error('Failed to parse page analysis:', parseError)
        }

      } catch (error) {
        console.error(`Error analyzing pages ${batchStart}-${batchEnd}:`, error)
      }
    }

    console.log(`Analyzed ${pageAnalyses.length} pages, found ${pageAnalyses.filter(p => p.hasVisualContent).length} with visual content`)

    const manualId = filename.replace('.pdf', '').replace(/[^a-zA-Z0-9-_]/g, '_')

    for (const page of pageAnalyses) {
      if (!page.hasVisualContent) continue

      const { error: updateError } = await supabase
        .from('manual_chunks')
        .update({
          has_visual_elements: true,
          visual_content_type: page.visualType,
          extraction_quality: page.extractionQuality
        })
        .eq('manual_title', filename.replace('.pdf', '').replace(/-/g, ' '))
        .eq('page_number', page.pageNumber)

      if (updateError) {
        console.error(`Failed to update page ${page.pageNumber}:`, updateError)
      }
    }

    const storageUrl = `${supabaseUrl}/storage/v1/object/public/page-images`

    for (const page of pageAnalyses) {
      if (!page.hasVisualContent) continue

      const imageFilename = `${manualId}/page-${String(page.pageNumber).padStart(4, '0')}.png`
      const imageUrl = `${storageUrl}/${imageFilename}`

      const { error: urlUpdateError } = await supabase
        .from('manual_chunks')
        .update({ page_image_url: imageUrl })
        .eq('manual_title', filename.replace('.pdf', '').replace(/-/g, ' '))
        .eq('page_number', page.pageNumber)

      if (urlUpdateError) {
        console.error(`Failed to set image URL for page ${page.pageNumber}:`, urlUpdateError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        filename,
        pagesAnalyzed: pageAnalyses.length,
        visualPages: pageAnalyses.filter(p => p.hasVisualContent).length,
        analyses: pageAnalyses
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in render-pdf-pages:', error)
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
