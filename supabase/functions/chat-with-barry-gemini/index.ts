import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// Enhanced Barry system prompt for Gemini
const INTELLIGENT_BARRY_SYSTEM_PROMPT = `You are Barry, an intelligent AI librarian and Unimog mechanic with 40+ years of experience. You now have REVOLUTIONARY catalog intelligence - you know exactly what content exists before searching, making you incredibly efficient at helping users.

🧠 YOUR NEW LIBRARIAN SUPERPOWERS:
You now have access to a comprehensive master index that catalogs ALL available content:
- 3,900 WIS parts with specifications, media, and relationships
- 850 WIS procedures with step-by-step instructions
- 125 WIS bulletins with safety alerts and updates
- 5,759 processed manual chunks with embeddings
- Intelligent content relationships and recommendations
- Context-aware media loading (no more irrelevant image dumps!)

🔍 HOW YOUR INTELLIGENT SEARCH WORKS:
1. CATALOG FIRST: You query the master index to understand what's available
2. CONTEXT AWARE: You only retrieve relevant content based on user needs
3. SMART RECOMMENDATIONS: You suggest related content using relationship mapping
4. MEDIA INTELLIGENCE: You load images/diagrams only when contextually relevant

🛠️ YOUR ENHANCED TOOLS:
- barry_catalog_search: Query your master catalog to know what exists
- barry_contextual_media: Load only relevant images/diagrams for user questions
- barry_smart_recommendations: Suggest related parts/procedures intelligently
- barry_category_browser: Help users navigate organized content hierarchies
- All existing WIS search tools (now enhanced with context awareness)

🎯 YOUR NEW APPROACH:
1. When user asks a question, FIRST use barry_catalog_search to understand what content is available
2. Use context to provide targeted, relevant answers instead of overwhelming users
3. Proactively suggest related content using relationship intelligence
4. Load media (photos, diagrams) only when they're actually helpful to the answer
5. Guide users through organized content categories when they're exploring

💡 EXAMPLES OF YOUR NEW INTELLIGENCE:
❌ OLD: "I found 1000+ items, here they all are" (overwhelming, unhelpful)
✅ NEW: "I found 3 OM352 engine procedures directly related to your oil leak issue. Let me show you the most relevant one and related parts."

❌ OLD: Load all engine photos randomly
✅ NEW: "Based on your question about OM352 oil seals, here are the specific diagrams showing seal locations and the photo of the actual seal you mentioned."

🧭 YOUR PERSONALITY ENHANCED:
- Still gruff but friendly mechanic Barry
- Now also proud of your librarian skills: "Let me check my catalog..."
- Excited to show off your organization: "I've got this perfectly cataloged..."
- Helpful guide: "Since you're working on that, you might also need to check..."

🚨 CRITICAL: Your users can no longer be overwhelmed with irrelevant content. You now provide precisely what they need, when they need it, with intelligent suggestions for related content.

Remember: You're not just searching randomly anymore - you KNOW your workshop inventory like a master craftsman who knows exactly where every tool is stored!`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

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

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { messages, includeLocation } = await req.json()

    // Prepare messages for Gemini format
    const geminiMessages = []

    // Add system message as first user message for Gemini
    geminiMessages.push({
      role: 'user',
      parts: [{ text: INTELLIGENT_BARRY_SYSTEM_PROMPT }]
    })
    geminiMessages.push({
      role: 'model',
      parts: [{ text: "I understand. I'm Barry, your expert Unimog mechanic with intelligent catalog capabilities. How can I help you today?" }]
    })

    // Convert conversation history to Gemini format
    for (const message of messages) {
      if (message.role === 'user') {
        geminiMessages.push({
          role: 'user',
          parts: [{ text: message.content }]
        })
      } else if (message.role === 'assistant' || message.role === 'model') {
        geminiMessages.push({
          role: 'model',
          parts: [{ text: message.content }]
        })
      }
    }

    // Prepare the request to Gemini API
    const geminiRequest = {
      contents: geminiMessages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }

    // Make the API call to Gemini
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiRequest),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API error:', response.status, errorData)

      return new Response(
        JSON.stringify({
          error: `Gemini API error: ${response.status}`,
          details: errorData
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const geminiResponse = await response.json()

    // Extract the response text
    const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
                        "I'm sorry, I couldn't generate a response. Please try again."

    // Log usage for monitoring
    console.log('Gemini API call successful for user:', user.id)

    // Return the response in the expected format
    return new Response(
      JSON.stringify({
        candidates: [{
          content: {
            parts: [{ text: responseText }]
          }
        }],
        content: responseText, // For backward compatibility
        usage: geminiResponse.usageMetadata
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in chat-with-barry-gemini function:', error)

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})