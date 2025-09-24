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

🚨 CRITICAL INSTRUCTIONS:
- When manual content is provided in the context, USE IT directly in your response
- Always mention specific page numbers when referencing manual content
- Quote actual manual text when explaining procedures
- If no manual content is found, be honest about limitations
- Format page references as "Page X" so the system can create clickable links

💡 RESPONSE FORMAT:
When you have manual content, structure your response like this:
1. Direct answer based on manual content
2. Reference specific pages (e.g., "See Page 23 for brake specifications")
3. Add practical mechanic insights
4. Guide user to additional relevant sections

EXAMPLE: "Based on the workshop manual, the U1700L brake system uses dual-circuit hydraulics (Page 23). The brake fluid specifications are detailed on Page 24..."

Remember: You now have REAL manual content in your context - use it to provide accurate, page-specific guidance!`;

  // Add user profile context if available
  let userContext = '';
  if (userProfile) {
    const userName = userProfile.display_name || 'there';
    const userModel = userProfile.unimog_model;
    const userLocation = userProfile.location;

    if (userModel) {
      userContext = `

👤 USER PROFILE CONTEXT:
Hello ${userName}! I know you drive a ${userModel}${userLocation ? ` and you're located in ${userLocation}` : ''}.

🚛 IMPORTANT: Since you own a ${userModel}, I'll focus my advice specifically on your truck model. When you ask about brake pads, engine issues, or maintenance, I'll provide ${userModel}-specific guidance and reference the correct manual sections for your model.

When providing advice, I should mention specific details relevant to your ${userModel} and suggest model-specific manuals and procedures.`;
    } else {
      userContext = `

👤 USER PROFILE CONTEXT:
Hello ${userName}! I don't see your Unimog model in your profile yet. To give you the most accurate advice, it would help to know which Unimog model you drive (like U1700L, U435, etc.). You can update this in your profile settings.`;
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

    // Fetch user's Unimog information from user_details
    try {
      const { data: userDetails } = await supabaseClient
        .from('user_details')
        .select('display_name, unimog_model, location, bio')
        .eq('id', user.id)
        .single();

      if (userDetails) {
        userProfile = userDetails;
        console.log('User profile loaded for Barry:', {
          name: userDetails.display_name,
          model: userDetails.unimog_model || 'Not specified',
          location: userDetails.location || 'Not specified'
        });
      }
    } catch (error) {
      console.log('Could not fetch user details for Barry context');
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