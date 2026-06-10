import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

async function getUserFromAuth(request: Request, supabase: any) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return { user: null, error: 'No auth header' }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    return { user, error }
  } catch (err) {
    return { user: null, error: 'Auth failed' }
  }
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

    const body = await req.json()
    const { imageBase64, mediaType } = body

    if (!imageBase64) {
      throw new Error('imageBase64 required')
    }

    console.log(`[Fuel OCR] Processing for user: ${user.id}, media: ${mediaType || 'image/jpeg'}`)

    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    console.log('[Fuel OCR] Calling GPT-4o Vision...')
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 2000,
        stream: false,
        messages: [{
          role: 'system',
          content: `Analyze this fuel receipt. Extract data and respond ONLY with JSON:

{
  "station_name": "gas station name",
  "date": "YYYY-MM-DD",
  "fuel_entries": [{
    "fuel_type": "Diesel",
    "volume_liters": 85.5,
    "price_per_liter": 1.45,
    "total_amount": 123.98
  }],
  "total_volume": 85.5,
  "total_amount": 123.98,
  "odometer_reading": null,
  "confidence": 90
}

Rules: For dual-tank Unimogs combine entries. Be precise with numbers. Set confidence 0-100.`
        }, {
          role: 'user',
          content: [{
            type: 'image_url',
            image_url: {
              url: `data:${mediaType || 'image/jpeg'};base64,${imageBase64}`
            }
          }]
        }]
      })
    })

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text()
      console.error('[Fuel OCR] GPT-4o error:', errText)
      throw new Error(`GPT-4o API error: ${openaiResponse.status}`)
    }

    const openaiData = await openaiResponse.json()
    const content = openaiData.choices?.[0]?.message?.content || ''

    let fuelData: any = {}
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        fuelData = JSON.parse(jsonMatch[0])
      }
    } catch (_) {
      fuelData = { station_name: 'Unknown', confidence: 50, total_volume: 0, total_amount: 0 }
    }

    console.log(`[Fuel OCR] Done! Confidence: ${fuelData.confidence}%`)

    return new Response(
      JSON.stringify({ success: true, fuelData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('[Fuel OCR] Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})