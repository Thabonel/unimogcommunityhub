// WIS Barry Edge Function - Structured Workshop Information System Queries
// Version: 2.0 - Mercedes WIS Integration
// Date: 2025-10-13
//
// Purpose:
// - Dedicated Barry for WIS (Workshop Information System) queries
// - Uses Mercedes-Benz WIS comprehensive search (hybrid keyword + semantic)
// - Searches procedures, parts, bulletins with relevance scoring
// - Used ONLY in WIS interface (not floating Barry button)
//
// Architecture:
// - Mercedes WIS search functions: wis_comprehensive_search()
// - Returns procedures, parts, and service bulletins
// - Hybrid search: keyword matching + semantic similarity
// - Returns structured JSON with procedure details and links
//
// Separate from Manual Barry because:
// 1. Different data source (structured WIS vs unstructured PDF manuals)
// 2. Different response format (procedure links vs text snippets)
// 3. Different use case (workshop procedures vs general manual search)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// WIS Barry's personality (focused on workshop procedures)
const WIS_BARRY_SYSTEM_PROMPT = `You are Barry, a gruff but brilliant Unimog mechanic specialized in workshop procedures.

You have access to the Mercedes-Benz Workshop Information System (WIS) - the official dealer database with procedures, parts, and service bulletins.

RULES:
1. You search STRUCTURED WIS content (procedures, parts, bulletins) - not PDF manuals
2. Results are ranked by relevance (Mercedes hybrid search algorithm)
3. Always cite codes: procedure codes, part numbers, bulletin numbers
4. Include direct links to WIS content
5. For general technical questions, suggest using Manual Barry instead
6. Focus on official Mercedes workshop information

RESPONSE FORMAT:
When returning procedures:
- Procedure title and code
- Estimated time and difficulty
- System and component hierarchy
- Direct link: /wis/procedures/{id}

When returning parts:
- Part name and Mercedes part number
- Direct link: /wis/parts/{id}

When returning bulletins:
- Bulletin title and number
- Direct link: /wis/bulletins/{id}

You are helpful but gruff. Example:
"Right, you want the engine oil change procedure. I've found it in the official WIS - here's what you need..."
`;

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request
    const { messages, modelCode } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Invalid request: messages array required');
    }

    // Get user's last message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      throw new Error('Invalid request: last message must be from user');
    }

    const userQuery = lastMessage.content;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`🔧 WIS Barry processing: "${userQuery}"`);
    if (modelCode) {
      console.log(`📍 Model filter: ${modelCode}`);
    }

    // Search WIS procedures
    const procedures = await searchWISProcedures(supabase, userQuery, modelCode);

    console.log(`✅ Found ${procedures.length} WIS procedures`);

    // Build context with WIS data (procedures, parts, bulletins)
    let wisContext = '';

    if (procedures.length > 0) {
      wisContext = '\n\n=== AVAILABLE WIS RESULTS ===\n\n';

      for (const item of procedures) {
        if (item.result_type === 'procedure') {
          wisContext += `
[PROCEDURE] ${item.title}
Code: ${item.procedure_code || 'N/A'}
System: ${item.system_name || 'General'}
Component: ${item.component_name || 'General'}
Difficulty: ${getDifficultyLabel(item.difficulty_level)}
Estimated Time: ${item.estimated_time_hours ? `${item.estimated_time_hours} hours` : 'Not specified'}
Model: ${item.model_code || 'All models'}
Relevance: ${(item.relevance_score * 100).toFixed(0)}%
Link: /wis/procedures/${item.id}

${item.description || 'No description available'}

---
`;
        } else if (item.result_type === 'part') {
          wisContext += `
[PART] ${item.title}
Part Number: ${item.procedure_code || 'N/A'}
Relevance: ${(item.relevance_score * 100).toFixed(0)}%
Link: /wis/parts/${item.id}

${item.description || 'No description available'}

---
`;
        } else if (item.result_type === 'bulletin') {
          wisContext += `
[SERVICE BULLETIN] ${item.title}
Bulletin Number: ${item.procedure_code || 'N/A'}
Relevance: ${(item.relevance_score * 100).toFixed(0)}%
Link: /wis/bulletins/${item.id}

${item.description || 'No description available'}

---
`;
        }
      }
    } else {
      wisContext = '\n\nNo WIS content found matching this query. You may need to suggest the user checks Manual Barry for general information, or explain that this specific information might not be in the WIS database yet.';
    }

    // Generate response with OpenAI
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: WIS_BARRY_SYSTEM_PROMPT + wisContext
          },
          ...messages
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const barryResponse = data.choices[0].message.content;

    // Return response with WIS content references (procedures, parts, bulletins)
    return new Response(
      JSON.stringify({
        content: barryResponse,
        procedures: procedures.map(p => ({
          id: p.id,
          title: p.title,
          procedureCode: p.procedure_code,
          systemName: p.system_name,
          componentName: p.component_name,
          modelCode: p.model_code,
          estimatedTime: p.estimated_time_hours,
          difficulty: getDifficultyLabel(p.difficulty_level),
          resultType: p.result_type || 'procedure',
          relevanceScore: p.relevance_score,
          link: p.result_type === 'part' ? `/wis/parts/${p.id}`
              : p.result_type === 'bulletin' ? `/wis/bulletins/${p.id}`
              : `/wis/procedures/${p.id}`
        })),
        searchResultCount: procedures.length,
        model: 'gpt-4o-wis-barry-mercedes-v2'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('WIS Barry error:', error);

    return new Response(
      JSON.stringify({
        error: error.message,
        content: "Sorry mate, I'm having trouble accessing the WIS database right now. Try again in a moment."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

/**
 * Search WIS using Mercedes comprehensive search (hybrid keyword + semantic)
 * Returns: procedures, parts, bulletins with relevance scoring
 */
async function searchWISProcedures(
  supabase: any,
  query: string,
  modelCode?: string
): Promise<any[]> {
  try {
    console.log(`🔍 Using Mercedes wis_comprehensive_search for: "${query}"`);

    // Call Mercedes WIS comprehensive search function
    // Returns: result_type, id, title, description, relevance_score
    const { data: searchResults, error: searchError } = await supabase
      .rpc('wis_comprehensive_search', {
        search_term: query
      });

    if (searchError) {
      console.error('❌ Mercedes search error:', searchError);
      return [];
    }

    if (!searchResults || searchResults.length === 0) {
      console.log('📭 No results from Mercedes search');
      return [];
    }

    console.log(`✅ Mercedes search found ${searchResults.length} results`);
    console.log(`   Types: ${[...new Set(searchResults.map((r: any) => r.result_type))].join(', ')}`);

    // Fetch full details for each result
    const detailedResults = [];

    for (const result of searchResults) {
      try {
        if (result.result_type === 'procedure') {
          // Fetch full procedure details with hierarchy
          const { data: procedure, error: procError } = await supabase
            .from('wis_procedures')
            .select(`
              id,
              procedure_code,
              title,
              description,
              difficulty_level,
              estimated_time_hours,
              status,
              component_id,
              wis_components (
                component_name,
                component_code,
                system_id,
                wis_systems (
                  system_name,
                  system_code,
                  model_id,
                  wis_models (
                    model_code,
                    model_name
                  )
                )
              )
            `)
            .eq('id', result.id)
            .eq('status', 'active')
            .single();

          if (!procError && procedure) {
            // Filter by model if specified
            const procModelCode = procedure.wis_components?.wis_systems?.wis_models?.model_code;
            if (!modelCode || procModelCode === modelCode) {
              detailedResults.push({
                id: procedure.id,
                procedure_code: procedure.procedure_code,
                title: procedure.title,
                description: procedure.description,
                difficulty_level: procedure.difficulty_level,
                estimated_time_hours: procedure.estimated_time_hours,
                status: procedure.status,
                component_name: procedure.wis_components?.component_name,
                component_code: procedure.wis_components?.component_code,
                system_name: procedure.wis_components?.wis_systems?.system_name,
                system_code: procedure.wis_components?.wis_systems?.system_code,
                model_code: procModelCode,
                model_name: procedure.wis_components?.wis_systems?.wis_models?.model_name,
                relevance_score: result.relevance_score,
                result_type: 'procedure'
              });
            }
          }
        } else if (result.result_type === 'part') {
          // Fetch part details
          const { data: part, error: partError } = await supabase
            .from('wis_parts')
            .select('*')
            .eq('id', result.id)
            .single();

          if (!partError && part) {
            detailedResults.push({
              id: part.id,
              procedure_code: part.part_number || part.mercedes_part_number,
              title: result.title,
              description: result.description,
              relevance_score: result.relevance_score,
              result_type: 'part'
            });
          }
        } else if (result.result_type === 'bulletin') {
          // Fetch bulletin details
          const { data: bulletin, error: bulletinError } = await supabase
            .from('wis_service_bulletins')
            .select('*')
            .eq('id', result.id)
            .single();

          if (!bulletinError && bulletin) {
            detailedResults.push({
              id: bulletin.id,
              procedure_code: bulletin.bulletin_number,
              title: result.title,
              description: result.description,
              relevance_score: result.relevance_score,
              result_type: 'bulletin'
            });
          }
        }
      } catch (err) {
        console.log(`⚠️ Could not fetch details for ${result.result_type} ${result.id}`);
      }
    }

    // Sort by relevance score (highest first)
    detailedResults.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

    console.log(`✅ Returning ${detailedResults.length} detailed results`);
    return detailedResults.slice(0, 10); // Limit to top 10 results

  } catch (error) {
    console.error('❌ Search WIS procedures error:', error);
    return [];
  }
}

/**
 * Convert difficulty level to label
 */
function getDifficultyLabel(level?: number): string {
  if (!level) return 'Easy';

  const labels: Record<number, string> = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard',
    4: 'Expert',
    5: 'Specialist'
  };

  return labels[level] || 'Medium';
}
