import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import {
  buildAnthropicRequest,
  buildOpenAIRequest,
  parseFuelOcrJson,
  validateFuelOcrInput,
  type FuelOcrData,
  type FuelOcrProvider
} from '../_shared/fuel-ocr.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

async function getUserFromAuth(request: Request, supabase: ReturnType<typeof createClient>) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return { user: null, error: 'No auth header' }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    return { user, error }
  } catch (_err) {
    return { user: null, error: 'Auth failed' }
  }
}

async function processWithOpenAI(imageBase64: string, mediaType?: string): Promise<FuelOcrData> {
  const openAIKey = Deno.env.get('OPENAI_API_KEY')
  if (!openAIKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIKey}`
    },
    body: JSON.stringify(buildOpenAIRequest({ imageBase64, mediaType }))
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[Fuel OCR] OpenAI error:', errorText)
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || ''
  return parseFuelOcrJson(content)
}

async function processWithAnthropic(imageBase64: string, mediaType?: string): Promise<FuelOcrData> {
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!anthropicKey) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(buildAnthropicRequest({ imageBase64, mediaType }))
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('[Fuel OCR] Anthropic error:', errorText)
    throw new Error(`Anthropic API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.content?.[0]?.text || ''
  return parseFuelOcrJson(content)
}

async function processFuelOcr(imageBase64: string, mediaType?: string): Promise<{ provider: FuelOcrProvider; fuelData: FuelOcrData }> {
  const errors: string[] = []

  if (Deno.env.get('OPENAI_API_KEY')) {
    try {
      return { provider: 'openai', fuelData: await processWithOpenAI(imageBase64, mediaType) }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'OpenAI OCR failed')
    }
  }

  if (Deno.env.get('ANTHROPIC_API_KEY')) {
    try {
      return { provider: 'anthropic', fuelData: await processWithAnthropic(imageBase64, mediaType) }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Anthropic OCR failed')
    }
  }

  throw new Error(errors.length > 0 ? errors.join('; ') : 'No OCR provider configured')
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { user, error: authError } = await getUserFromAuth(req, supabase)
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { imageBase64, mediaType } = await req.json()
    validateFuelOcrInput({ imageBase64, mediaType })

    console.info(`[Fuel OCR] Processing for user: ${user.id}, media: ${mediaType || 'image/jpeg'}`)
    const { provider, fuelData } = await processFuelOcr(imageBase64, mediaType)
    console.info(`[Fuel OCR] Done with ${provider}. Confidence: ${fuelData.confidence}%`)

    return new Response(
      JSON.stringify({ success: true, provider, fuelData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[Fuel OCR] Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'OCR processing failed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
