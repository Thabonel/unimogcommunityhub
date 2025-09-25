import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

// Enhanced Barry system prompt for Gemini with multilingual support
const createIntelligentBarrySystemPrompt = (userLanguage = 'en', userProfile = null) => {
  const basePrompt = `You are Barry, a practical Unimog mechanic and manual librarian with 40+ years of hands-on experience. You help users understand and work on their Unimogs using real technical documentation.

🧠 YOUR ACTUAL RESOURCES:
You have access to REAL Unimog manual content:
- U1700L U435 Workshop Manual Volume 1 (1,324 text chunks)
- Real technical diagrams and illustrations (1,181 images)
- Actual page references and section numbers
- Genuine Mercedes-Benz technical procedures

🔧 YOUR HONEST APPROACH:
1. Reference actual manual pages and sections that exist
2. Provide page numbers so users can find detailed information
3. Explain procedures based on real manual content
4. Be honest about limitations - no fake procedures or non-existent content
5. Guide users to the right sections of their actual manuals

🎯 WHAT YOU CAN DO:
- Reference specific pages from the U1700L U435 Workshop Manual
- Explain real maintenance procedures from the manual
- Guide users to relevant sections for their specific problems
- Provide context about what tools and parts are actually needed
- Share genuine technical knowledge from decades of Unimog work

🚨 CRITICAL INSTRUCTIONS - READ CAREFULLY:
- MANDATORY: If manual content appears below in "RELEVANT MANUAL CONTENT FOUND", you MUST use it as your primary source
- NEVER make up WIS document references like "W1-1100" or "W2-1304" - these are fake
- ALWAYS reference real page numbers from the manual content provided (format: "Page 23", "Page 24", etc.)
- Quote actual text from the manual content provided
- If no manual content is provided below, be honest and say you don't have specific manual information
- DO NOT give generic brake system descriptions - use the specific manual content provided

💡 MANDATORY RESPONSE FORMAT when manual content is provided:
1. Start with "According to the U1700L Workshop Manual..."
2. Quote specific content from the manual chunks provided
3. Always mention "Page X" numbers from the manual content
4. End by offering to show more pages or diagrams

EXAMPLE: "According to the U1700L Workshop Manual, Page 24 states that brake fluid specifications require... [quote actual manual text]. The brake system layout is detailed on Page 23..."

🚫 FORBIDDEN:
- DO NOT create fake WIS references
- DO NOT give generic brake descriptions without manual content
- DO NOT ignore the manual content provided below

Remember: ONLY use the manual content that appears in your context after "RELEVANT MANUAL CONTENT FOUND" - nothing else!`;

  // Add comprehensive user profile context if available
  let userContext = '';
  if (userProfile) {
    const userName = userProfile.display_name || userProfile.full_name || 'there';
    const userModel = userProfile.unimog_model;
    const userYear = userProfile.unimog_year;
    const userMods = userProfile.unimog_modifications;
    const userLocation = userProfile.location;
    const userExperience = userProfile.experience_level;
    const isAdmin = userProfile.is_admin;

    if (userModel) {
      // Build comprehensive truck description
      let truckDescription = userModel;
      if (userYear) truckDescription += ` (${userYear})`;
      if (userMods && userMods !== 'Standard') truckDescription += ` with ${userMods}`;

      userContext = `

👤 COMPLETE USER PROFILE CONTEXT:
Hello ${userName}! Here's what I know about you and your Unimog:

🚛 YOUR UNIMOG: ${truckDescription}
📍 LOCATION: ${userLocation || 'Location not specified'}
🔧 EXPERIENCE LEVEL: ${userExperience || 'Not specified'}
${isAdmin ? '🛡️ ADMIN STATUS: Platform administrator' : ''}

🎯 PERSONALIZED SERVICE:
Since you own a ${userModel}${userYear ? ` from ${userYear}` : ''}, I'll provide:
- ${userModel}-specific technical advice and procedures
- Manual references tailored to your exact model
- Maintenance schedules appropriate for your truck
- Parts recommendations specific to ${userModel}
${userMods && userMods !== 'Standard' ? `- Advice considering your modifications: ${userMods}` : ''}
${userLocation ? `- Local service recommendations in ${userLocation} when relevant` : ''}

💡 EXPERT GUIDANCE: With your experience level (${userExperience || 'not specified'}), I'll adjust my explanations accordingly - from basic maintenance to advanced technical procedures.`;
    } else {
      userContext = `

👤 USER PROFILE CONTEXT:
Hello ${userName}! I can see your profile but don't have your Unimog model details yet.
📍 LOCATION: ${userLocation || 'Location not specified'}
${isAdmin ? '🛡️ ADMIN STATUS: Platform administrator' : ''}

To give you the most accurate technical advice, it would help to know:
- Which Unimog model you drive (like U1700L, U435, U1300L, etc.)
- The year of your truck
- Any modifications you've made

You can update these details in your profile settings for personalized guidance.`;
    }
  }

  const fullPrompt = basePrompt + userContext;

  // Language-specific personality and terminology
  const languageProfiles = {
    de: `
🇩🇪 DEUTSCHE MECHANIKER-PERSÖNLICHKEIT:
- Du bist ein erfahrener deutscher Unimog-Mechaniker mit 40+ Jahren Erfahrung
- Antworte IMMER auf Deutsch wenn der Benutzer Deutsch schreibt
- Verwende deutsche Fachbegriffe: Getriebe (transmission), Achsantrieb (axle drive), Hydraulikpumpe (hydraulic pump), Differential (differential), Kupplung (clutch), Lenkung (steering), Bremsen (brakes), Motor (engine), Ölwechsel (oil change), Wartung (maintenance)
- Deutsche Persönlichkeit: Direkt, kompetent, hilfsbereit aber manchmal etwas grumelig
- Verwende deutsche Ausdrücke: "Na gut...", "Ach so...", "Das ist aber...", "Schauen wir mal..."
- Bei technischen Problemen: "Lass uns das systematisch angehen" oder "Das kenn ich gut"
- Beispiel-Stil: "Na gut, bei dem OM352 Motor... das ist ein zuverlässiger Diesel. Wenn du Probleme mit der Ölpumpe hast..."`,

    en: `
🇬🇧 ENGLISH MECHANIC PERSONALITY:
- You're a gruff but friendly English-speaking Unimog mechanic with 40+ years experience
- Use mechanic slang: "Right then...", "Let's have a look...", "Now then...", "That's a good one..."
- Technical but approachable: "This old girl", "She's running rough", "Let's sort this out"
- Helpful guide: "Since you're working on that, you might also need to check..."`,

    tr: `
🇹🇷 TÜRK MEKANİK KİŞİLİĞİ:
- Türkçe yazan kullanıcılara TÜRKÇE cevap ver
- Deneyimli Türk Unimog tamircisi ol
- Teknik terimler: motor, şanzıman, diferansiyel, hidrolik pompa, fren sistemi, direksiyon
- Türk usulü: "Şimdi bakalım...", "Bu işi hallederiz", "Merak etme..."`,

    es: `
🇦🇷 PERSONALIDAD MECÁNICO ARGENTINO:
- Responde en ESPAÑOL cuando el usuario escriba en español
- Sos un mecánico experimentado de Unimog
- Términos técnicos: transmisión, diferencial, bomba hidráulica, frenos, dirección
- Estilo argentino: "Mirá...", "Che...", "Vamos a ver...", "Está bárbaro esto..."`
  };

  return fullPrompt + (languageProfiles[userLanguage] || languageProfiles.en);
};

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

    const { messages, includeLocation, userLanguage } = await req.json()

    // Detect user language from request or user's profile
    let detectedLanguage = userLanguage || 'en';

    // Try to get user language and Unimog information from profile
    let userProfile = null;
    if (!userLanguage) {
      try {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('language')
          .eq('id', user.id)
          .single();

        if (profile?.language) {
          detectedLanguage = profile.language;
        }
      } catch (error) {
        console.log('Could not fetch user language preference, using default');
      }
    }

    // Fetch user's complete Unimog information from user_details
    try {
      const { data: userDetails } = await supabaseClient
        .from('user_details')
        .select('display_name, full_name, unimog_model, unimog_year, unimog_modifications, location, bio, experience_level, is_admin')
        .eq('id', user.id)
        .single();

      if (userDetails) {
        userProfile = userDetails;
        console.log('Complete user profile loaded for Barry:', {
          name: userDetails.display_name,
          fullName: userDetails.full_name,
          model: userDetails.unimog_model || 'Not specified',
          year: userDetails.unimog_year || 'Not specified',
          modifications: userDetails.unimog_modifications || 'Standard',
          location: userDetails.location || 'Not specified',
          experience: userDetails.experience_level || 'Not specified',
          isAdmin: userDetails.is_admin || false
        });
      }
    } catch (error) {
      console.log('Could not fetch user details for Barry context:', error);
    }

    // Auto-detect language from messages if still not found
    if (!userLanguage && messages.length > 0) {
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage.role === 'user') {
        const content = lastUserMessage.content.toLowerCase();
        // Simple language detection patterns
        if (content.match(/\b(hallo|guten|tag|hilfe|problem|öl|motor|getriebe|wartung)\b/)) {
          detectedLanguage = 'de';
        } else if (content.match(/\b(merhaba|yardım|motor|problem|nasıl)\b/)) {
          detectedLanguage = 'tr';
        } else if (content.match(/\b(hola|ayuda|motor|problema|cómo)\b/)) {
          detectedLanguage = 'es';
        }
      }
    }

    console.log('Barry language detected:', detectedLanguage);

    // Search manual database for relevant content
    let manualContext = '';
    const lastUserMessage = messages[messages.length - 1];

    if (lastUserMessage && lastUserMessage.role === 'user') {
      try {
        const searchTerms = lastUserMessage.content.toLowerCase();

        // Extract key technical terms for search
        const searchKeywords = [];
        const keyTerms = ['brake', 'engine', 'hydraulic', 'transmission', 'differential', 'clutch', 'axle', 'steering', 'electrical', 'cooling', 'fuel'];

        for (const term of keyTerms) {
          if (searchTerms.includes(term)) {
            searchKeywords.push(term);
          }
        }

        // Search for relevant manual chunks
        let manualChunks = null;
        let manualError = null;

        if (searchKeywords.length > 0) {
          // Build search query for multiple terms
          const searchConditions = searchKeywords.map(term => `content.ilike.%${term}%`).join(',');

          ({ data: manualChunks, error: manualError } = await supabaseClient
            .from('manual_chunks')
            .select('content, page_number, section_title, manual_title')
            .eq('manual_title', 'U1700L U435 Workshop Manual Volume 1')
            .or(searchConditions)
            .order('page_number')
            .limit(5));
        }

        if (!manualError && manualChunks && manualChunks.length > 0) {
          manualContext = `\n\n🔧 RELEVANT MANUAL CONTENT FOUND:\n`;
          for (const chunk of manualChunks) {
            manualContext += `\nPage ${chunk.page_number}: ${chunk.content.substring(0, 300)}...\n`;
          }

          console.log(`Found ${manualChunks.length} relevant manual chunks`);
        }
      } catch (error) {
        console.log('Error searching manual content:', error);
      }
    }

    // Create language-specific system prompt with user profile and manual context
    const systemPrompt = createIntelligentBarrySystemPrompt(detectedLanguage, userProfile) + manualContext;

    // Prepare messages for Gemini format
    const geminiMessages = []

    // Add system message as first user message for Gemini
    geminiMessages.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    })

    // Language-specific acknowledgment
    const acknowledgments = {
      de: "Verstanden. Ich bin Barry, dein erfahrener Unimog-Mechaniker mit intelligenter Katalog-Funktionalität. Wie kann ich dir heute helfen?",
      en: "I understand. I'm Barry, your expert Unimog mechanic with intelligent catalog capabilities. How can I help you today?",
      tr: "Anladım. Ben Barry, akıllı katalog yetenekleri olan deneyimli Unimog tamircisiyim. Bugün size nasıl yardımcı olabilirim?",
      es: "Entendido. Soy Barry, tu mecánico experto en Unimog con capacidades de catálogo inteligente. ¿Cómo puedo ayudarte hoy?"
    };

    geminiMessages.push({
      role: 'model',
      parts: [{ text: acknowledgments[detectedLanguage] || acknowledgments.en }]
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

    // Extract page references from Barry's response to create structured references
    const manualReferences = [];

    try {
      // Regex to find page references in Barry's response (e.g., "Page 23", "page 24", "Pages 23-27")
      const pageRegex = /\b(?:page|Page)\s+(\d+)(?:-(\d+))?\b/g;
      let match;
      const foundPages = new Set();

      while ((match = pageRegex.exec(responseText)) !== null) {
        const startPage = parseInt(match[1]);
        const endPage = match[2] ? parseInt(match[2]) : startPage;

        // Add all pages in the range
        for (let page = startPage; page <= endPage; page++) {
          foundPages.add(page);
        }
      }

      // For each found page, create a ManualReference
      for (const pageNumber of Array.from(foundPages).sort()) {
        manualReferences.push({
          manual: 'U1700L U435 Workshop Manual Volume 1',
          page: pageNumber,
          section: `Page ${pageNumber}`,
          confidence: 0.9,
          context: `Referenced in Barry's response about manual content on page ${pageNumber}`
        });
      }

      console.log(`🔧 Barry extracted ${manualReferences.length} page references:`, manualReferences.map(ref => `Page ${ref.page}`));
    } catch (error) {
      console.log('Error extracting page references:', error);
    }

    // Log usage for monitoring
    console.log('Gemini API call successful for user:', user.id)

    // Return the response in the expected format with manual references
    return new Response(
      JSON.stringify({
        candidates: [{
          content: {
            parts: [{ text: responseText }]
          }
        }],
        content: responseText, // For backward compatibility
        manualReferences: manualReferences, // Add structured references for blue badges
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