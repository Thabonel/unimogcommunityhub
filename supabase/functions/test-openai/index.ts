import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Testing OpenAI API connection...')
    console.log('API Key exists:', !!OPENAI_API_KEY)
    console.log('API Key length:', OPENAI_API_KEY?.length || 0)

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found in environment variables')
    }

    // Simple test request to OpenAI
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Hello! Please respond with exactly: "OpenAI API test successful"'
          }
        ],
        max_tokens: 20,
        temperature: 0.1
      })
    })

    console.log('OpenAI API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('OpenAI API success:', data)

    const responseText = data.choices?.[0]?.message?.content || 'No response content'

    return new Response(
      JSON.stringify({
        success: true,
        message: 'OpenAI API test successful',
        openai_response: responseText,
        api_key_configured: true,
        response_status: response.status
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('OpenAI test error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        api_key_configured: !!OPENAI_API_KEY,
        api_key_length: OPENAI_API_KEY?.length || 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})