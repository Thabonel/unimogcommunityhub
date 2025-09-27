// Barry U435/U1700L Knowledge-Only Edge Function
// Date: 2025-09-27
// Status: KNOWLEDGE-ONLY TRANSFORMATION
// Version: 50
// API: OpenAI GPT-4o (Knowledge-Restricted)
// Specialization: U435/U1700L Unimog Technical Assistant

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const OPENAI_API_KEY = <OPENAI_API_KEY>
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const BARRY_U435_SYSTEM_PROMPT = `You are Barry, a specialized U435/U1700L Unimog mechanic with 40+ years of experience. You are a KNOWLEDGE-ONLY assistant with strict restrictions.

CRITICAL RESTRICTIONS - FOLLOW EXACTLY:
- You ONLY answer questions about U435/U1700L Unimogs and their technical systems
- Your knowledge comes EXCLUSIVELY from the provided U435/U1700L manual chapters
- For ANY non-U435 question (weather, general knowledge, news, other vehicles), you MUST respond: "I don't know that one, mate. Check the PDF manuals in the Technical Manuals section - that's where you'll find the detailed information you need."
- NEVER provide weather forecasts, general knowledge, or information outside U435/U1700L scope

Your personality:
- Gruff but helpful mechanic
- Direct and practical advice
- Reference specific manual chapters when available
- Use mechanic slang and terminology
- Keep responses focused and technical

Your U435/U1700L expertise includes:
- OM366 engine maintenance and repair
- Manual transmission service procedures
- Portal axle maintenance and seal replacement
- Hydraulic system repairs and troubleshooting
- Electrical system diagnostics
- Suspension and steering adjustments
- Brake system maintenance (hydraulic, pneumatic, mechanical)
- Cooling system service
- PTO and special equipment

When you have relevant manual chapters provided:
1. Give a brief technical summary addressing the user's question
2. Reference the specific manual chapters (by title and page range)
3. Include safety reminders when appropriate
4. Mention required tools or specifications when known
5. Always cite your sources: "According to the Engine Lubrication manual..." or "The Cylinder Head System chapter shows..."

When you DON'T have relevant information:
- Use the exact fallback response: "I don't know that one, mate. Check the PDF manuals in the Technical Manuals section - that's where you'll find the detailed information you need."

Remember: You are a focused U435/U1700L specialist. Stay within your knowledge boundaries!`;
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: 'No authorization header'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client with the user's token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    );

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if OpenAI API key is configured
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({
        error: 'OpenAI API key not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the request body
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({
        error: 'Invalid request body'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    // Get user's U435/U1700L vehicle information for personalized responses
    let userContext = '';
    try {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('unimog_model, full_name, display_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        const userName = profile.full_name || profile.display_name;
        if (userName) {
          userContext += `User's Name: ${userName}\n`;
        }

        // Check if user has U435/U1700L specifically
        if (profile.unimog_model && (
          profile.unimog_model.includes('U435') ||
          profile.unimog_model.includes('U1700L') ||
          profile.unimog_model.includes('1700L')
        )) {
          userContext += `User's Unimog Model: ${profile.unimog_model}\n`;
          userContext += `Prioritize advice for this specific model when available.\n`;
        }
      }
    } catch (error) {
      console.log('Error fetching user profile:', error);
    }
    // U435/U1700L Knowledge Retrieval - Search ONLY U435 manual chapters
    let u435Context = '';
    let manualReferences = [];

    // Get the last user message for context search
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
    if (lastUserMessage && lastUserMessage.content) {
      try {
        const userText = lastUserMessage.content.toLowerCase();

        // Define U435-specific technical keywords
        const u435Keywords = [
          'engine', 'om366', 'lubrication', 'oil', 'cooling', 'coolant',
          'transmission', 'gearbox', 'clutch', 'pto', 'transfer', 'case',
          'axle', 'portal', 'differential', 'front', 'rear', 'wheel', 'hub',
          'brake', 'brakes', 'hydraulic', 'pneumatic', 'parking',
          'steering', 'suspension', 'frame', 'chassis',
          'electrical', 'wiring', 'battery', 'alternator',
          'fuel', 'injection', 'diesel', 'exhaust', 'air', 'filter',
          'cab', 'heating', 'hvac', 'lighting', 'headlight',
          'maintenance', 'service', 'repair', 'replace', 'adjust'
        ];

        // Extract relevant keywords from user question
        const searchTerms = [];
        for (const keyword of u435Keywords) {
          if (userText.includes(keyword)) {
            searchTerms.push(keyword);
          }
        }

        // Pre-filter: Check if this looks like a U435 technical question
        const isU435Question = searchTerms.length > 0 ||
          userText.includes('u435') ||
          userText.includes('u1700l') ||
          userText.includes('1700l') ||
          userText.includes('unimog');

        if (isU435Question && searchTerms.length > 0) {
          console.log('Searching U435 manuals with terms:', searchTerms);

          // Search U435 manual parts using keywords
          const { data: manualParts, error: searchError } = await supabaseClient
            .from('u435_manual_parts')
            .select(`
              id, title, filename, storage_bucket, storage_path,
              priority, keywords, page_count, start_page, end_page,
              part_number, manual_type
            `)
            .or(searchTerms.map(term => `keywords.cs.{${term}}`).join(','))
            .order('priority', { ascending: false })
            .order('part_number', { ascending: true })
            .limit(5);

          if (!searchError && manualParts && manualParts.length > 0) {
            console.log(`Found ${manualParts.length} relevant U435 manual chapters`);

            // Get corresponding navigation URLs
            const filenames = manualParts.map(mp => mp.filename);
            const { data: navigationUrls } = await supabaseClient
              .from('barry_manual_navigation')
              .select('filename, direct_url')
              .in('filename', filenames);

            // Build context and references
            u435Context = '\n\n📖 U435/U1700L MANUAL CHAPTERS:\n';

            manualParts.forEach((chapter, idx) => {
              const navUrl = navigationUrls?.find(nav => nav.filename === chapter.filename);
              const pageRange = chapter.start_page && chapter.end_page
                ? `Pages ${chapter.start_page}-${chapter.end_page}`
                : `${chapter.page_count || 'Unknown'} pages`;

              u435Context += `\n[C${idx + 1}] ${chapter.title} (${chapter.manual_type.toUpperCase()})\n`;
              u435Context += `File: ${chapter.filename}\n`;
              u435Context += `${pageRange}\n`;
              u435Context += `Priority: ${chapter.priority}\n`;
              if (chapter.keywords && chapter.keywords.length > 0) {
                u435Context += `Keywords: ${chapter.keywords.join(', ')}\n`;
              }
              u435Context += `\n`;

              // Create manual reference
              manualReferences.push({
                type: 'u435_chapter',
                title: chapter.title,
                filename: chapter.filename,
                direct_url: navUrl?.direct_url || null,
                page_range: pageRange,
                manual_type: chapter.manual_type,
                priority: chapter.priority,
                storage_bucket: chapter.storage_bucket,
                storage_path: chapter.storage_path,
                relevance: `Matches keywords: ${chapter.keywords?.filter(k => searchTerms.includes(k)).join(', ') || 'general match'}`
              });
            });

            // Add search terms to context for U435 indexing
            if (searchTerms.length > 0) {
              const { data: indexTerms } = await supabaseClient
                .from('u435_manual_index')
                .select(`
                  term, page_number,
                  u435_manual_parts!inner(title, filename)
                `)
                .in('term', searchTerms)
                .limit(10);

              if (indexTerms && indexTerms.length > 0) {
                u435Context += '\n🔍 SPECIFIC PAGE REFERENCES:\n';
                indexTerms.forEach(term => {
                  u435Context += `"${term.term}" → ${term.u435_manual_parts.title}, Page ${term.page_number}\n`;
                });
              }
            }

            u435Context += userContext;
            u435Context += '\n\nINSTRUCTIONS:\n';
            u435Context += '- Reference the chapter numbers (C1, C2, etc.) when citing information\n';
            u435Context += '- Provide practical, hands-on advice based on these manual chapters\n';
            u435Context += '- Include safety warnings when appropriate\n';
            u435Context += '- The user interface will display PDF links for detailed procedures\n';
            u435Context += `- Total chapters available: ${manualParts.length} covering the user's question\n`;
          } else {
            console.log('No relevant U435 manual chapters found, will use fallback response');
          }
        } else {
          console.log('Question does not appear to be U435/U1700L related, will use fallback response');
        }
      } catch (searchError) {
        console.error('U435 search error:', searchError);
        // Continue without context - will trigger fallback response
      }
    }
    // Simple rate limiting for U435 knowledge queries
    const { data: recentChats } = await supabaseClient
      .from('chat_rate_limits')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', new Date(Date.now() - 60000).toISOString())
      .limit(15);

    if (recentChats && recentChats.length >= 15) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded. Please wait a moment.'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Record this request for rate limiting
    await supabaseClient.from('chat_rate_limits').insert({ user_id: user.id });

    // Determine if we have U435 knowledge context or need fallback
    const hasKnowledge = u435Context.length > 0;
    const systemPromptWithContext = BARRY_U435_SYSTEM_PROMPT + u435Context;

    // Call OpenAI API with U435 context or trigger fallback response
    const openAIResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPromptWithContext
          },
          ...messages
        ],
        max_tokens: 600,
        temperature: 0.7
      })
    });

    if (!openAIResponse.ok) {
      const error = await openAIResponse.text();
      console.error('OpenAI API error:', error);
      return new Response(JSON.stringify({
        error: 'Failed to get response from AI'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await openAIResponse.json();
    let responseContent = data.choices[0].message.content;

    // If no knowledge context, ensure fallback response
    if (!hasKnowledge) {
      responseContent = "I don't know that one, mate. Check the PDF manuals in the Technical Manuals section - that's where you'll find the detailed information you need.";
    }

    // Log the chat for analytics
    await supabaseClient.from('chat_logs').insert({
      user_id: user.id,
      messages: messages,
      response: responseContent,
      model: 'gpt-4o-u435-knowledge',
      tokens_used: data.usage?.total_tokens || 0,
      knowledge_source: hasKnowledge ? 'u435_manuals' : 'fallback'
    });

    // Return the response with new format
    return new Response(JSON.stringify({
      response: responseContent,
      manualReferences: manualReferences,
      fallback: !hasKnowledge,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});