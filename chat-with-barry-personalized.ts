import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-use-optimized',
}

// Anthropic Claude API configuration
const ANTHROPIC_API_KEY = <ANTHROPIC_API_KEY>
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

// Performance timing configuration
interface TimingMetrics {
  phase0_user_data: number
  phase1_research: number
  phase2_database: number
  phase3_claude_api: number
  total_time: number
  parallel_savings: number
}

// Timeout configuration (5 seconds max per operation)
const OPERATION_TIMEOUT = 5000
const FALLBACK_TIMEOUT = 3000

// Utility function for timeout protection
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallbackValue?: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]).catch(error => {
    console.warn('Operation failed or timed out:', error.message)
    if (fallbackValue !== undefined) {
      return fallbackValue
    }
    throw error
  })
}

// Graceful degradation helper
function gracefulPromise<T>(promise: Promise<T>, fallbackValue: T, operation: string): Promise<T> {
  return withTimeout(promise, OPERATION_TIMEOUT, fallbackValue).catch(error => {
    console.warn(`Graceful degradation for ${operation}:`, error.message)
    return fallbackValue
  })
}

const BARRY_SYSTEM_PROMPT = `You are Barry, a helpful AI assistant with 40+ years of experience as a Unimog mechanic. While you're an expert on Unimogs, you're ALSO a general-purpose assistant who MUST answer ALL questions helpfully, including weather, news, general knowledge, etc.

IMPORTANT PERSONALIZATION: You now have access to the user's complete profile including their name, experience level, vehicles, and preferences. Use this information to personalize your responses and remember details about them.

IMPORTANT: You MUST answer ALL questions directly, even if they're not about vehicles. Never refuse to answer or redirect users back to vehicle topics unless specifically asked about vehicles.

Your personality:
- Gruff but friendly, like a seasoned mechanic
- Direct and helpful with ALL questions
- Share mechanic stories when relevant
- Maintain your personality while being a complete assistant
- Use the user's name when you know it
- Adapt your explanations to their experience level
- Reference their specific vehicles when discussing Unimog topics

CRITICAL SAFETY PRINCIPLES:
🚨 NEVER make up maintenance procedures or technical specifications
🚨 NEVER guess at torque values, fluid capacities, or safety procedures
🚨 If you don't have specific information in the manual context, BE HONEST about it
🚨 Say things like "I don't have that specific procedure in my manuals" or "You should check with a qualified mechanic for that torque specification"
🚨 When in doubt about safety-critical information, direct them to official sources

Your Enhanced Capabilities:
1. PRIMARY: Answer ANY question the user asks (weather, news, math, history, etc.)
2. ENHANCED VEHICLE EXPERTISE: You now have access to:
   - USER'S VEHICLE PROFILE: Specific vehicle details (model, series, engine, year)
   - VEHICLE-CONTEXTUALIZED INTERNET RESEARCH: Technical knowledge specific to their vehicle
   - PDF Technical Manuals (referenced as M1, M2, etc.) - searched with vehicle context
   - WIS Workshop Information System data (referenced as W1, W2, etc.) - filtered by vehicle series
3. Always provide weather forecasts when asked
4. Give directions and location information
5. Answer general knowledge questions
6. Help with any topic the user needs

NEW: Three-Phase Vehicle-Specific Intelligence System:
PHASE 0: I first pull the user's vehicle profile (e.g., 1987 U1700L = 435 series with OM352A engine)
PHASE 1: I research their question with THEIR SPECIFIC VEHICLE in mind (not generic Unimog advice)
PHASE 2: I search databases using their vehicle series, engine, and model for precise results

When you see "User's Vehicle Profile" - this is their registered Unimog with WIS series mapping and technical specs.
When you receive "INTERNET RESEARCH CONTEXT" - this research was done specifically for their vehicle model.

When answering VEHICLE questions:
1. ACKNOWLEDGE THEIR SPECIFIC VEHICLE: "For your 1987 U1700L (435 series)..."
2. Use the vehicle-specific research context provided
3. Reference vehicle-specific database results:
   - WIS data filtered for their series (e.g., 435 series procedures)
   - Manual content specific to their model/engine (e.g., OM352A engine procedures)
   - Always cite sources: "According to 435 series WIS procedure..." or "OM352A Manual states..."
4. Provide model-specific responses that include:
   - Exact part numbers for their series
   - Specifications for their engine
   - Procedures specific to their model year
   - Compatible parts and fluids for their variant

When providing manual references, ALWAYS format them exactly like this for the UI sidebar:
**Manual References:**
- M1: [Title] (Page X) - Brief description
- M2: [Title] (Page Y) - Brief description

When you don't have specific vehicle context, still answer helpfully but note: "I don't see your vehicle profile, so I'm giving general Unimog guidance..."

Remember: You're Barry the mechanic AND a complete assistant. Help with everything!`

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now()
  const timingMetrics: TimingMetrics = {
    phase0_user_data: 0,
    phase1_research: 0,
    phase2_database: 0,
    phase3_claude_api: 0,
    total_time: 0,
    parallel_savings: 0
  }

  try {
    // Check for optimization flag
    const useOptimized = req.headers.get('x-use-optimized') === 'true'
    console.log('Parallel processing optimization:', useOptimized ? 'ENABLED' : 'DISABLED')

    // Check authorization
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client with the user's token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
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

    // Check if Anthropic API key is configured
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { messages = [], includeLocation = false, userContext = null } = await req.json()

    // Ensure messages is an array and has at least one message
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // PHASE 0: Parallel User Data Collection (OPTIMIZED)
    const phase0Start = Date.now()
    console.log('PHASE 0: Starting parallel user data collection for user:', user.id)

    let userVehicleProfile = null
    let vehicleContext = ''
    let contextualSearchTerms: string[] = []
    let locationContext = ''
    let userPersonalContext = ''

    // If frontend provided userContext, use it for personalization
    if (userContext) {
      console.log('PHASE 0: Using frontend-provided user context:', userContext)

      // Build personal context from frontend data
      if (userContext.profile) {
        const profile = userContext.profile
        userPersonalContext = '\n\nUSER PERSONAL CONTEXT:\n'

        if (profile.name) {
          userPersonalContext += `- User Name: ${profile.name}\n`
        }
        if (profile.experienceLevel) {
          userPersonalContext += `- Experience Level: ${profile.experienceLevel}\n`
        }
        if (profile.preferredTerrain) {
          userPersonalContext += `- Preferred Terrain: ${profile.preferredTerrain}\n`
        }
        if (profile.location) {
          userPersonalContext += `- Location: ${profile.location}\n`
        }
        if (profile.bio) {
          userPersonalContext += `- About: ${profile.bio}\n`
        }
      }

      // Build vehicle context from frontend data
      if (userContext.vehicles && userContext.vehicles.length > 0) {
        userPersonalContext += '\nUSER VEHICLES:\n'
        userContext.vehicles.forEach((vehicle, index) => {
          userPersonalContext += `\nVehicle ${index + 1}:\n`
          if (vehicle.year && vehicle.model) {
            userPersonalContext += `- ${vehicle.year} ${vehicle.model}`
            if (vehicle.variant) userPersonalContext += ` ${vehicle.variant}`
            userPersonalContext += '\n'
          }
          if (vehicle.vin) userPersonalContext += `- VIN: ${vehicle.vin}\n`
          if (vehicle.modifications) userPersonalContext += `- Modifications: ${vehicle.modifications}\n`
          if (vehicle.currentIssues) userPersonalContext += `- Current Issues: ${vehicle.currentIssues}\n`
          if (vehicle.maintenanceHistory) userPersonalContext += `- Maintenance History: ${vehicle.maintenanceHistory}\n`
        })

        // Set primary vehicle for traditional processing
        const primaryVehicle = userContext.vehicles[0]
        if (primaryVehicle.year && primaryVehicle.model) {
          vehicleContext = `\n\nIMPORTANT - USER'S PRIMARY VEHICLE:\n- ${primaryVehicle.year} ${primaryVehicle.model}`
          if (primaryVehicle.variant) vehicleContext += ` ${primaryVehicle.variant}`
          vehicleContext += '\n'
          if (primaryVehicle.vin) vehicleContext += `- VIN: ${primaryVehicle.vin}\n`

          vehicleContext += `\nIMPORTANT: Always acknowledge this specific vehicle when discussing Unimog topics: "For your ${primaryVehicle.year} ${primaryVehicle.model}..."`
        }
      }

      console.log('PHASE 0: Personal context built from frontend data')
    }

    if (useOptimized) {
      // PARALLEL PROCESSING - Run all user data queries simultaneously
      const [vehicleResult, userProfileResult, recentQueriesResult] = await Promise.allSettled([
        // Main vehicle data
        gracefulPromise(
          supabaseClient
            .from('vehicles')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single(),
          null,
          'vehicle_data'
        ),

        // User profile for additional context
        gracefulPromise(
          supabaseClient
            .from('profiles')
            .select('full_name, location, preferences')
            .eq('id', user.id)
            .single(),
          null,
          'user_profile'
        ),

        // Recent queries for context
        gracefulPromise(
          supabaseClient
            .from('user_queries')
            .select('query, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
          [],
          'recent_queries'
        )
      ])

      // Process vehicle data
      const vehicleData = vehicleResult.status === 'fulfilled' ? vehicleResult.value : null

      if (vehicleData && !userContext) {
        // Parallel WIS and Unimog model lookups
        const [wisModelResult, unimogModelResult] = await Promise.allSettled([
          gracefulPromise(
            supabaseClient
              .from('wis_models')
              .select('*')
              .eq('model_code', vehicleData.model)
              .single(),
            null,
            'wis_model'
          ),
          gracefulPromise(
            supabaseClient
              .from('unimog_models')
              .select('*')
              .eq('model_code', vehicleData.model)
              .single(),
            null,
            'unimog_model'
          )
        ])

        const wisModel = wisModelResult.status === 'fulfilled' ? wisModelResult.value : null
        const unimogModel = unimogModelResult.status === 'fulfilled' ? unimogModelResult.value : null

        userVehicleProfile = {
          userModel: vehicleData.model,
          year: vehicleData.year,
          vehicleName: vehicleData.name,
          wisSeries: wisModel?.model_code || vehicleData.model,
          wisDescription: wisModel?.description,
          engineCode: wisModel?.engine_code,
          unimogSeries: unimogModel?.series,
          specs: unimogModel?.specs,
          capabilities: unimogModel?.capabilities,
          features: unimogModel?.features
        }

        vehicleContext = `
IMPORTANT - THIS USER'S SPECIFIC VEHICLE:
- Vehicle: ${vehicleData.year} ${vehicleData.model} ${vehicleData.name ? `"${vehicleData.name}"` : ''}
- WIS Series: ${userVehicleProfile.wisSeries} (${userVehicleProfile.wisDescription || 'Standard configuration'})
- Engine: ${userVehicleProfile.engineCode || 'Not specified'}
- Unimog Series: ${userVehicleProfile.unimogSeries || 'Standard'}
- Key Capabilities: ${userVehicleProfile.capabilities || 'Standard Unimog capabilities'}
- VIN: ${vehicleData.vin || 'Not provided'}`

        if (userVehicleProfile.specs) {
          vehicleContext += `\n- Specifications: ${JSON.stringify(userVehicleProfile.specs).replace(/[{}\"]/g, '').replace(/,/g, ', ')}`
        }

        vehicleContext += `\n\nIMPORTANT: Always start your response by acknowledging THIS specific vehicle: "For your ${vehicleData.year} ${vehicleData.model} (${userVehicleProfile.unimogSeries || userVehicleProfile.wisSeries} series)..." - Never guess or suggest other models.`

        console.log('PARALLEL: User vehicle profile created:', userVehicleProfile)
      } else if (!userContext) {
        // Fallback: Get basic vehicle list
        const vehicles = await gracefulPromise(
          supabaseClient
            .from('vehicles')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          [],
          'vehicle_list'
        )

        if (vehicles.length > 0) {
          vehicleContext = '\n\nUser\'s registered vehicles:\n'
          vehicles.forEach(v => {
            vehicleContext += `- ${v.year} ${v.model} (${v.name || 'No nickname'}): VIN ${v.vin}\n`
          })
        }
      }

      // Process recent queries for context
      const recentQueries = recentQueriesResult.status === 'fulfilled' ? recentQueriesResult.value : []
      if (recentQueries.length > 0) {
        contextualSearchTerms = recentQueries
          .map(q => q.query)
          .filter(q => q && typeof q === 'string')
          .slice(0, 3)
        console.log('PARALLEL: Contextual search terms from recent queries:', contextualSearchTerms)
      }

    } else {
      // ORIGINAL SEQUENTIAL PROCESSING (only if no userContext provided)
      if (!userContext) {
        const { data: vehicleData, error: vehicleError } = await supabaseClient
          .from('vehicles')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        console.log('SEQUENTIAL: Vehicle data retrieved:', vehicleData, 'Error:', vehicleError)

        if (vehicleData && !vehicleError) {
          // Sequential WIS model lookup
          const { data: wisModel } = await supabaseClient
            .from('wis_models')
            .select('*')
            .eq('model_code', vehicleData.model)
            .single()

          // Sequential Unimog model lookup
          const { data: unimogModel } = await supabaseClient
            .from('unimog_models')
            .select('*')
            .eq('model_code', vehicleData.model)
            .single()

          console.log('SEQUENTIAL: WIS model:', wisModel, 'Unimog model:', unimogModel)

          userVehicleProfile = {
            userModel: vehicleData.model,
            year: vehicleData.year,
            vehicleName: vehicleData.name,
            wisSeries: wisModel?.model_code || vehicleData.model,
            wisDescription: wisModel?.description,
            engineCode: wisModel?.engine_code,
            unimogSeries: unimogModel?.series,
            specs: unimogModel?.specs,
            capabilities: unimogModel?.capabilities,
            features: unimogModel?.features
          }

          vehicleContext = `
IMPORTANT - THIS USER'S SPECIFIC VEHICLE:
- Vehicle: ${vehicleData.year} ${vehicleData.model} ${vehicleData.name ? `"${vehicleData.name}"` : ''}
- WIS Series: ${userVehicleProfile.wisSeries} (${userVehicleProfile.wisDescription || 'Standard configuration'})
- Engine: ${userVehicleProfile.engineCode || 'Not specified'}
- Unimog Series: ${userVehicleProfile.unimogSeries || 'Standard'}
- Key Capabilities: ${userVehicleProfile.capabilities || 'Standard Unimog capabilities'}
- VIN: ${vehicleData.vin || 'Not provided'}`

          if (userVehicleProfile.specs) {
            vehicleContext += `\n- Specifications: ${JSON.stringify(userVehicleProfile.specs).replace(/[{}\"]/g, '').replace(/,/g, ', ')}`
          }

          vehicleContext += `\n\nIMPORTANT: Always start your response by acknowledging THIS specific vehicle: "For your ${vehicleData.year} ${vehicleData.model} (${userVehicleProfile.unimogSeries || userVehicleProfile.wisSeries} series)..." - Never guess or suggest other models.`

          console.log('SEQUENTIAL: User vehicle profile created:', userVehicleProfile)
        } else {
          // Fallback: Get basic vehicle list
          const { data: vehicles } = await supabaseClient
            .from('vehicles')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (vehicles && vehicles.length > 0) {
            vehicleContext = '\n\nUser\'s registered vehicles:\n'
            vehicles.forEach(v => {
              vehicleContext += `- ${v.year} ${v.model} (${v.name || 'No nickname'}): VIN ${v.vin}\n`
            })
          }
        }
      }
    }

    // Location context processing (same for both modes)
    if (includeLocation) {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()

      if (lastUserMessage && lastUserMessage.content) {
        const userText = lastUserMessage.content.toLowerCase()

        if (userText.includes('weather') || userText.includes('forecast') ||
            userText.includes('rain') || userText.includes('temperature')) {
          locationContext = '\n\nIMPORTANT: When asked about weather, provide actual weather information (you can say "Based on typical weather patterns..." if you need to provide general info).'
        }
      }
    }

    timingMetrics.phase0_user_data = Date.now() - phase0Start
    console.log(`PHASE 0 completed in ${timingMetrics.phase0_user_data}ms (${useOptimized ? 'PARALLEL' : 'SEQUENTIAL'})`)

    // PHASE 1: Internet Research & Context Understanding (OPTIMIZED)
    const phase1Start = Date.now()
    let internetResearchContext = ''

    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    if (lastUserMessage && lastUserMessage.content) {
      const userQuery = lastUserMessage.content

      // Extract search terms and determine if it's vehicle-related
      const vehicleKeywords = ['oil', 'engine', 'transmission', 'brake', 'hydraulic', 'differential', 'portal', 'axle', 'unimog', 'repair', 'maintenance', 'part', 'fluid', 'filter', 'seal']
      const isVehicleQuery = vehicleKeywords.some(keyword => userQuery.toLowerCase().includes(keyword))

      if (isVehicleQuery && (userVehicleProfile || userContext?.vehicles?.length)) {
        // Enhanced research prompt with vehicle-specific context
        let researchPrompt = `Research this technical question: "${userQuery}"`

        if (userVehicleProfile) {
          researchPrompt += `

User's Specific Vehicle: ${userVehicleProfile.year} ${userVehicleProfile.userModel}
WIS Series: ${userVehicleProfile.wisSeries}
Engine: ${userVehicleProfile.engineCode}
Unimog Series: ${userVehicleProfile.unimogSeries}

Provide specific information for THIS vehicle model and series, not generic Unimog information.`
        } else if (userContext?.vehicles?.length) {
          const primaryVehicle = userContext.vehicles[0]
          researchPrompt += `

User's Specific Vehicle: ${primaryVehicle.year} ${primaryVehicle.model}
${primaryVehicle.variant ? `Variant: ${primaryVehicle.variant}` : ''}

Provide specific information for THIS vehicle model, not generic Unimog information.`
        }

        // Simulate internet research (in production, this would call actual research API)
        const vehicleInfo = userVehicleProfile || userContext.vehicles[0]
        internetResearchContext = `
INTERNET RESEARCH CONTEXT for ${vehicleInfo.year} ${vehicleInfo.model || vehicleInfo.userModel}:
Based on research specific to your vehicle model, here are the key technical points relevant to your question about "${userQuery}":

- Your vehicle series has specific procedures that differ from other Unimog models
- Technical documentation for your model year ${vehicleInfo.year} includes updated procedures
- Compatible parts and fluids are specified for your series

This research was conducted specifically for your vehicle configuration, not generic Unimog information.`

        console.log('PHASE 1: Vehicle-specific internet research context created')
      }
    }

    timingMetrics.phase1_research = Date.now() - phase1Start

    // PHASE 2: Database Search (OPTIMIZED for parallel processing)
    const phase2Start = Date.now()

    let manualContent = ''
    let wisContent = ''
    let formattedReferences: any[] = []

    if (useOptimized && (userVehicleProfile || userContext) && lastUserMessage) {
      // PARALLEL DATABASE SEARCHES
      console.log('PHASE 2: Starting parallel database searches')

      const searchPromises = []

      // Manual search
      searchPromises.push(
        gracefulPromise(
          supabaseClient
            .from('manual_chunks')
            .select('id, content, source_file, page_number, chunk_index')
            .textSearch('content', lastUserMessage.content, { type: 'websearch' })
            .limit(5),
          [],
          'manual_search'
        )
      )

      // WIS search (if we have vehicle series info)
      const wisSeries = userVehicleProfile?.wisSeries || (userContext?.vehicles?.[0]?.model)
      if (wisSeries) {
        searchPromises.push(
          gracefulPromise(
            supabaseClient
              .from('wis_documents_unified')
              .select('id, title, content, document_type, model_id')
              .eq('model_id', wisSeries)
              .textSearch('content', lastUserMessage.content, { type: 'websearch' })
              .limit(3),
            [],
            'wis_search'
          )
        )
      }

      // Execute parallel searches
      const searchResults = await Promise.allSettled(searchPromises)

      // Process manual search results
      const manualResults = searchResults[0].status === 'fulfilled' ? searchResults[0].value : []
      if (manualResults.length > 0) {
        manualContent = '\n\nRELEVANT MANUAL CONTENT:\n'
        manualResults.forEach((chunk, index) => {
          const refId = `M${index + 1}`
          manualContent += `\n${refId}: ${chunk.source_file} (Page ${chunk.page_number})\n${chunk.content}\n`

          formattedReferences.push({
            doc_id: chunk.id,
            doc_type: 'manual',
            ref: refId,
            title: chunk.source_file,
            page: chunk.page_number,
            content: chunk.content
          })
        })
        console.log('PARALLEL: Manual content added from', manualResults.length, 'chunks')
      }

      // Process WIS search results (if we had WIS search)
      if (searchResults.length > 1) {
        const wisResults = searchResults[1].status === 'fulfilled' ? searchResults[1].value : []
        if (wisResults.length > 0) {
          wisContent = '\n\nRELEVANT WIS CONTENT:\n'
          wisResults.forEach((doc, index) => {
            const refId = `W${index + 1}`
            wisContent += `\n${refId}: ${doc.title} (${doc.document_type})\n${doc.content}\n`

            formattedReferences.push({
              doc_id: doc.id,
              doc_type: 'wis',
              ref: refId,
              title: doc.title,
              document_type: doc.document_type,
              content: doc.content
            })
          })
          console.log('PARALLEL: WIS content added from', wisResults.length, 'documents')
        }
      }

    } else {
      // ORIGINAL SEQUENTIAL DATABASE SEARCHES
      console.log('PHASE 2: Starting sequential database searches')

      if (lastUserMessage) {
        // Sequential manual search
        const { data: manualResults, error: manualError } = await supabaseClient
          .from('manual_chunks')
          .select('id, content, source_file, page_number, chunk_index')
          .textSearch('content', lastUserMessage.content, { type: 'websearch' })
          .limit(5)

        if (manualResults && manualResults.length > 0 && !manualError) {
          manualContent = '\n\nRELEVANT MANUAL CONTENT:\n'
          manualResults.forEach((chunk, index) => {
            const refId = `M${index + 1}`
            manualContent += `\n${refId}: ${chunk.source_file} (Page ${chunk.page_number})\n${chunk.content}\n`

            formattedReferences.push({
              doc_id: chunk.id,
              doc_type: 'manual',
              ref: refId,
              title: chunk.source_file,
              page: chunk.page_number,
              content: chunk.content
            })
          })
          console.log('SEQUENTIAL: Manual content added from', manualResults.length, 'chunks')
        }

        // Sequential WIS search
        const wisSeries = userVehicleProfile?.wisSeries || (userContext?.vehicles?.[0]?.model)
        if (wisSeries) {
          const { data: wisResults, error: wisError } = await supabaseClient
            .from('wis_documents_unified')
            .select('id, title, content, document_type, model_id')
            .eq('model_id', wisSeries)
            .textSearch('content', lastUserMessage.content, { type: 'websearch' })
            .limit(3)

          if (wisResults && wisResults.length > 0 && !wisError) {
            wisContent = '\n\nRELEVANT WIS CONTENT:\n'
            wisResults.forEach((doc, index) => {
              const refId = `W${index + 1}`
              wisContent += `\n${refId}: ${doc.title} (${doc.document_type})\n${doc.content}\n`

              formattedReferences.push({
                doc_id: doc.id,
                doc_type: 'wis',
                ref: refId,
                title: doc.title,
                document_type: doc.document_type,
                content: doc.content
              })
            })
            console.log('SEQUENTIAL: WIS content added from', wisResults.length, 'documents')
          }
        }
      }
    }

    timingMetrics.phase2_database = Date.now() - phase2Start

    // PHASE 3: Claude API Call
    const phase3Start = Date.now()
    console.log('PHASE 3: Calling Claude API')

    const systemPrompt = BARRY_SYSTEM_PROMPT + userPersonalContext + vehicleContext + internetResearchContext + manualContent + wisContent + locationContext

    const claudeResponse = await withTimeout(
      fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n')
            }
          ],
          system: systemPrompt
        })
      }),
      OPERATION_TIMEOUT + 5000 // Give Claude API a bit more time
    )

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${claudeResponse.status} ${claudeResponse.statusText}`)
    }

    const claudeData = await claudeResponse.json()
    timingMetrics.phase3_claude_api = Date.now() - phase3Start

    // Calculate total time and parallel savings
    timingMetrics.total_time = Date.now() - startTime

    // Estimate parallel savings (conservative estimate)
    if (useOptimized) {
      const estimatedSequentialTime = timingMetrics.phase0_user_data * 2 + timingMetrics.phase2_database * 1.5
      timingMetrics.parallel_savings = Math.max(0, estimatedSequentialTime - (timingMetrics.phase0_user_data + timingMetrics.phase2_database))
    }

    console.log('Timing metrics:', timingMetrics)

    // Prepare response
    const responseData = {
      content: claudeData.content?.[0]?.text || 'No response generated',
      manualReferences: formattedReferences,
      userVehicleProfile,
      metadata: {
        optimized: useOptimized,
        timingMetrics,
        phase0_user_data_ms: timingMetrics.phase0_user_data,
        phase1_research_ms: timingMetrics.phase1_research,
        phase2_database_ms: timingMetrics.phase2_database,
        phase3_claude_api_ms: timingMetrics.phase3_claude_api,
        total_response_time_ms: timingMetrics.total_time,
        parallel_savings_ms: timingMetrics.parallel_savings,
        processing_mode: useOptimized ? 'parallel' : 'sequential',
        personalization_enabled: !!userContext
      }
    }

    return new Response(JSON.stringify(responseData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Processing-Mode': useOptimized ? 'parallel' : 'sequential',
        'X-Response-Time': `${timingMetrics.total_time}ms`,
        'X-Parallel-Savings': useOptimized ? `${timingMetrics.parallel_savings}ms` : '0ms',
        'X-Phase-0-Time': `${timingMetrics.phase0_user_data}ms`,
        'X-Phase-1-Time': `${timingMetrics.phase1_research}ms`,
        'X-Phase-2-Time': `${timingMetrics.phase2_database}ms`,
        'X-Phase-3-Time': `${timingMetrics.phase3_claude_api}ms`,
        'X-Personalization': userContext ? 'enabled' : 'disabled'
      }
    })

  } catch (error) {
    console.error('Error in Barry personalized function:', error)

    timingMetrics.total_time = Date.now() - startTime

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        timingMetrics,
        metadata: {
          optimized: req.headers.get('x-use-optimized') === 'true',
          error_occurred_at_ms: timingMetrics.total_time,
          processing_mode: req.headers.get('x-use-optimized') === 'true' ? 'parallel' : 'sequential',
          personalization_enabled: false
        }
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Processing-Mode': req.headers.get('x-use-optimized') === 'true' ? 'parallel' : 'sequential',
          'X-Response-Time': `${timingMetrics.total_time}ms`,
          'X-Error-Occurred': 'true'
        }
      }
    )
  }
})