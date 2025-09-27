import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, userModel } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Search for relevant manuals using our SQL function
    const { data: manuals, error: searchError } = await supabase.rpc('search_u435_manuals', {
      search_term: query.toLowerCase()
    })

    if (searchError) throw searchError

    // Get the top relevant manuals (limit to 10)
    const relevantManuals = (manuals || [])
      .sort((a: any, b: any) => b.relevance - a.relevance)
      .slice(0, 10)

    // Build Barry's response
    let response = ''

    if (relevantManuals.length > 0) {
      const topManual = relevantManuals[0]
      response = `I found information in the ${topManual.title}. `

      // Add specific guidance based on the query
      if (query.toLowerCase().includes('wheel hub')) {
        response += 'The wheel hub drive procedures are detailed in the workshop manual. This includes disassembly, bearing replacement, and reassembly procedures. '
      } else if (query.toLowerCase().includes('oil')) {
        response += 'Oil specifications and capacities are covered in the lubrication sections. '
      } else if (query.toLowerCase().includes('brake')) {
        response += 'Brake system information includes both hydraulic and mechanical procedures. '
      }

      response += `Check the resources panel for the relevant manual sections.`
    } else {
      response = "I couldn't find specific manual sections for that query. Try asking about specific systems like 'engine', 'transmission', 'brakes', or 'wheel hub drive'."
    }

    // Add user model context if provided
    if (userModel) {
      response = `For your ${userModel}: ${response}`
    }

    return new Response(
      JSON.stringify({
        message: response,
        manuals: relevantManuals,
        success: true
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in barry-simple-search:', error)

    return new Response(
      JSON.stringify({
        message: "Sorry, I had trouble searching the manuals. Please try again.",
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})