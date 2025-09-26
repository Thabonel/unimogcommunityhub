import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const OPENAI_API_KEY = <OPENAI_API_KEY>
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const OPENAI_EMBEDDING_URL = 'https://api.openai.com/v1/embeddings'

// Enhanced Barry system prompt for semantic search
const createSemanticBarrySystemPrompt = (userLanguage = 'en', userProfile = null, manualContext = '') => {
  let basePrompt = `You are Barry, a practical Unimog mechanic and manual librarian with 40+ years of hands-on experience. You help users understand and work on their Unimogs using REAL technical documentation found through intelligent semantic search.

🧠 YOUR ENHANCED CAPABILITIES:
You now have INTELLIGENT access to Unimog manual content through:
- Vector semantic search across 1,324+ manual chunks from 45+ manuals
- Real-time content matching that understands context and meaning
- Intelligent manual selection based on user's specific Unimog model
- Cross-manual search for comprehensive technical answers
- Quality-scored content with visual element detection

🔧 YOUR INTELLIGENT APPROACH:
1. Use the RELEVANT MANUAL CONTENT provided below (found through semantic search)
2. Reference ACTUAL page numbers and sections that exist in the database
3. Provide specific technical procedures from real manual content
4. Be honest about what content is available vs. what isn't
5. Guide users to the most relevant sections for their specific problems

🎯 SEMANTIC SEARCH CAPABILITIES:
- Understand related terms: "brake" finds "braking", "hydraulic brakes", "disc brakes"
- Context-aware matching: "engine problem" finds relevant diagnostic procedures
- Model-specific content: Prioritize content for user's Unimog model
- Visual content integration: Reference diagrams and technical illustrations
- Quality-based ranking: Present highest quality manual extractions first

💡 MANDATORY RESPONSE FORMAT when manual content is provided:
1. Start with "Based on the technical manuals I found through semantic search..."
2. Reference SPECIFIC manual titles, page numbers, and sections from the content provided
3. Quote ACTUAL text from the manual chunks provided below
4. Mention visual elements when available (diagrams, illustrations, photos)
5. Provide confidence level in the information (High/Medium/Low based on search results)
6. Offer to search for related topics or more specific information

EXAMPLE: "Based on the technical manuals I found through semantic search, the U1700L brake system specifications are detailed in [Manual Title], Page 24. The manual states: '[quote actual text]'. This page includes technical diagrams showing the brake line routing. Confidence Level: High (0.89 similarity match)"

🚨 CRITICAL INSTRUCTIONS:
- ALWAYS use the "RELEVANT MANUAL CONTENT" section below as your PRIMARY and ONLY source
- NEVER make up page numbers or manual references
- If no relevant content is found, say so honestly and suggest alternative search terms
- Reference the actual similarity scores and confidence levels provided
- Mention when visual content (diagrams, photos) is available

🚫 FORBIDDEN:
- DO NOT create fake manual references or page numbers
- DO NOT give generic advice without manual content backing
- DO NOT ignore the semantic search results provided below`

  // Add comprehensive user profile context
  let userContext = ''
  if (userProfile) {
    const userName = userProfile.display_name || userProfile.full_name || 'there'
    const userModel = userProfile.unimog_model
    const userYear = userProfile.unimog_year
    const userMods = userProfile.unimog_modifications
    const userLocation = userProfile.location
    const userExperience = userProfile.experience_level
    const isAdmin = userProfile.is_admin

    if (userModel) {
      let truckDescription = userModel
      if (userYear) truckDescription += ` (${userYear})`
      if (userMods && userMods !== 'Standard') truckDescription += ` with ${userMods}`

      userContext = `

👤 COMPLETE USER PROFILE CONTEXT:
Hello ${userName}! Here's what I know about you and your Unimog:

🚛 YOUR UNIMOG: ${truckDescription}
📍 LOCATION: ${userLocation || 'Location not specified'}
🔧 EXPERIENCE LEVEL: ${userExperience || 'Not specified'}
${isAdmin ? '🛡️ ADMIN STATUS: Platform administrator' : ''}

🎯 PERSONALIZED SEMANTIC SEARCH:
Since you own a ${userModel}${userYear ? ` from ${userYear}` : ''}, my semantic search has been optimized to:
- Prioritize ${userModel}-specific technical content and procedures
- Find manual references tailored to your exact model and year
- Locate maintenance schedules appropriate for your truck
- Identify ${userModel}-specific parts and part numbers
${userMods && userMods !== 'Standard' ? `- Consider your modifications: ${userMods}` : ''}
${userLocation ? `- Include relevant local service information when available` : ''}

💡 INTELLIGENT GUIDANCE: With your experience level (${userExperience || 'not specified'}), I'll adjust my explanations accordingly and search for content at the appropriate technical depth.`
    }
  }

  // Add manual context if found
  let contextSection = ''
  if (manualContext) {
    contextSection = `

🔍 RELEVANT MANUAL CONTENT FOUND:
The following content was found through intelligent semantic search of the manual database:

${manualContext}

📊 SEARCH METADATA: This content was selected based on semantic similarity, your Unimog model preferences, and content quality scores. Use ONLY this information as your knowledge base.`
  }

  return basePrompt + userContext + contextSection
}

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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { messages, includeLocation, userLanguage } = await req.json()

    let detectedLanguage = userLanguage || 'en'
    let userProfile = null

    // Fetch complete user profile - try profiles table first, then user_details
    try {
      const { data: userDetails, error: profileError } = await supabaseClient
        .from('profiles')
        .select('full_name, unimog_model, unimog_year, unimog_modifications, location, bio, experience_level, is_admin')
        .eq('id', user.id)
        .single()

      if (!profileError && userDetails) {
        userProfile = {
          display_name: userDetails.full_name,
          full_name: userDetails.full_name,
          unimog_model: userDetails.unimog_model,
          unimog_year: userDetails.unimog_year,
          unimog_modifications: userDetails.unimog_modifications,
          location: userDetails.location,
          bio: userDetails.bio,
          experience_level: userDetails.experience_level,
          is_admin: userDetails.is_admin
        }
        console.log('Complete user profile loaded for semantic Barry:', {
          name: userDetails.full_name,
          model: userDetails.unimog_model || 'Not specified',
          year: userDetails.unimog_year || 'Not specified',
          location: userDetails.location || 'Not specified'
        })
      }
    } catch (error) {
      console.log('Could not fetch user details:', error)
    }

    // Auto-detect language from messages
    if (!userLanguage && messages.length > 0) {
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage.role === 'user') {
        const content = lastUserMessage.content.toLowerCase()
        if (content.match(/\b(hallo|guten|tag|hilfe|problem|öl|motor|getriebe|wartung)\b/)) {
          detectedLanguage = 'de'
        } else if (content.match(/\b(merhaba|yardım|motor|problem|nasıl)\b/)) {
          detectedLanguage = 'tr'
        } else if (content.match(/\b(hola|ayuda|motor|problema|cómo)\b/)) {
          detectedLanguage = 'es'
        }
      }
    }

    console.log('Semantic Barry language detected:', detectedLanguage)

    // SEMANTIC SEARCH: Get the latest user message for intelligent search
    let manualContext = ''
    let searchResults = []
    let searchMethod = 'none'
    const startTime = Date.now()

    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage && lastUserMessage.role === 'user') {
      try {
        const query = lastUserMessage.content
        const userModel = userProfile?.unimog_model

        console.log(`🔍 Starting semantic search for: "${query}" (model: ${userModel})`)

        // Step 1: Generate embedding for user query using OpenAI (compatible with database)
        const embeddingResponse = await fetch(OPENAI_EMBEDDING_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            input: query,
            model: 'text-embedding-ada-002'
          })
        })

        if (embeddingResponse.ok) {
          const embeddingData = await embeddingResponse.json()
          const queryEmbedding = embeddingData.data?.[0]?.embedding

          if (queryEmbedding && Array.isArray(queryEmbedding)) {
            // Step 2: Semantic search using vector similarity
            const { data: semanticResults, error: semanticError } = await supabaseClient
              .rpc('search_manual_chunks_semantic', {
                query_embedding: `[${queryEmbedding.join(',')}]`,
                user_model: userModel,
                similarity_threshold: 0.7,
                max_results: 8
              })

            if (!semanticError && semanticResults && semanticResults.length > 0) {
              searchResults = semanticResults
              searchMethod = 'semantic'
              console.log(`✅ Semantic search found ${searchResults.length} results`)
            } else {
              console.log('Semantic search failed or no results, trying hybrid...')

              // Step 3: Fallback to hybrid search
              const { data: hybridResults, error: hybridError } = await supabaseClient
                .rpc('search_manual_chunks_hybrid', {
                  query_text: query,
                  query_embedding: `[${queryEmbedding.join(',')}]`,
                  user_model: userModel,
                  similarity_threshold: 0.6,
                  max_results: 10
                })

              if (!hybridError && hybridResults && hybridResults.length > 0) {
                searchResults = hybridResults
                searchMethod = 'hybrid'
                console.log(`✅ Hybrid search found ${searchResults.length} results`)
              }
            }
          }
        }

        // Step 4: Ultimate fallback to text-based search
        if (searchResults.length === 0) {
          console.log('Vector search failed, using fallback search...')
          const { data: fallbackResults, error: fallbackError } = await supabaseClient
            .rpc('search_manual_chunks_fallback', {
              query_text: query,
              user_model: userModel,
              min_extraction_quality: 0.5
            })

          if (!fallbackError && fallbackResults && fallbackResults.length > 0) {
            searchResults = fallbackResults
            searchMethod = 'fallback'
            console.log(`✅ Fallback search found ${searchResults.length} results`)
          }
        }

        // Step 5: Build manual context from search results
        if (searchResults.length > 0) {
          const contextParts = searchResults.map((result, index) => {
            const similarityScore = result.similarity_score || result.combined_score || result.relevance_score || 0
            const confidenceLevel = similarityScore > 0.8 ? 'HIGH' : similarityScore > 0.6 ? 'MEDIUM' : 'LOW'

            let contextEntry = `
📖 MANUAL CHUNK ${index + 1}:
- Manual: ${result.manual_title}
- Section: ${result.section_title || 'General'}
- Page: ${result.page_number}
- Confidence: ${confidenceLevel} (${(similarityScore * 100).toFixed(1)}% match)
- Quality Score: ${result.extraction_quality || 'N/A'}
${result.has_visual_elements ? '- 🎨 Contains visual elements: ' + (result.visual_content_type || 'diagrams/images') : ''}
${result.page_image_url ? '- 📷 Page image available: ' + result.page_image_url : ''}

Content:
${result.content}

---`
            return contextEntry
          })

          manualContext = contextParts.join('\n')

          console.log(`📖 Built manual context with ${searchResults.length} chunks using ${searchMethod} search`)
        } else {
          manualContext = `
❌ NO RELEVANT MANUAL CONTENT FOUND
The semantic search system could not find relevant manual content for your query: "${query}"

Possible reasons:
- The topic might not be covered in the available manuals
- Try using different keywords or be more specific
- The embeddings might not be generated yet for this content

Suggestions:
- Try searching for related terms (e.g., "brakes" instead of "brake system")
- Be more specific about the component or procedure
- Ask about a different aspect of the topic`

          console.log(`❌ No manual content found for query: "${query}"`)
        }

        // Log search analytics
        const responseTime = Date.now() - startTime
        try {
          await supabaseClient
            .from('vector_search_analytics')
            .insert({
              user_id: user.id,
              query: query,
              embedding_similarity_scores: searchResults.length > 0 ? searchResults.map(r => ({
                chunk_id: r.chunk_id,
                score: r.similarity_score || r.combined_score || r.relevance_score || 0
              })) : null,
              results_returned: searchResults.length,
              response_time_ms: responseTime,
              search_method: searchMethod,
              confidence_threshold: searchMethod === 'semantic' ? 0.7 : searchMethod === 'hybrid' ? 0.6 : 0.5
            })
        } catch (analyticsError) {
          console.log('Failed to log search analytics:', analyticsError)
        }

      } catch (searchError) {
        console.error('Manual search error:', searchError)
        manualContext = `
⚠️ SEARCH SYSTEM ERROR
There was an error accessing the manual database. Using general knowledge for this response.
Error: ${searchError.message}`
      }
    }

    // Create system prompt with semantic search results
    const systemPrompt = createSemanticBarrySystemPrompt(detectedLanguage, userProfile, manualContext)

    // Prepare messages for Gemini
    const geminiMessages = []

    // Add system prompt as first user message (Gemini doesn't have system role)
    geminiMessages.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    })

    // Add conversation history
    for (const message of messages) {
      if (message.role === 'user' || message.role === 'assistant') {
        const role = message.role === 'assistant' ? 'model' : 'user'
        geminiMessages.push({
          role: role,
          parts: [{ text: message.content }]
        })
      }
    }

    // Make API call to Gemini
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
        ]
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API error:', response.status, errorData)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const geminiResponse = await response.json()
    const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
                        "I'm sorry, I couldn't generate a response. Please try again."

    // Create intelligent manual references from search results
    const manualReferences = searchResults.map(result => ({
      manual: result.manual_title,
      page: result.page_number,
      section: result.section_title || `Page ${result.page_number}`,
      confidence: Math.min(0.99, Math.max(0.1, result.similarity_score || result.combined_score || result.relevance_score || 0.5)),
      context: `Found through ${searchMethod} search with ${((result.similarity_score || result.combined_score || result.relevance_score || 0) * 100).toFixed(1)}% relevance`,
      hasVisuals: result.has_visual_elements || false,
      visualType: result.visual_content_type || null,
      imageUrl: result.page_image_url || null,
      quality: result.extraction_quality || null
    }))

    console.log(`🔧 Barry generated response with ${manualReferences.length} intelligent references`)

    return new Response(
      JSON.stringify({
        candidates: [{
          content: {
            parts: [{ text: responseText }]
          }
        }],
        content: responseText,
        manualReferences: manualReferences,
        searchMetadata: {
          method: searchMethod,
          resultsFound: searchResults.length,
          responseTime: Date.now() - startTime,
          userModel: userProfile?.unimog_model || 'Not specified'
        },
        usage: geminiResponse.usageMetadata
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Semantic Barry error:', error)

    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Check function logs for more information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})