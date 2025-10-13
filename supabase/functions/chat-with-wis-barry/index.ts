// WIS Barry Edge Function - Structured Workshop Information System Queries
// Version: 1.0
// Date: 2025-10-13
//
// Purpose:
// - Dedicated Barry for WIS (Workshop Information System) queries
// - Searches structured data: wis_procedures, wis_systems, wis_components
// - Returns procedure metadata, not PDF text
// - Used ONLY in WIS interface (not floating Barry button)
//
// Architecture:
// - SQL-based search (not RAG text search like Manual Barry)
// - Direct queries against WIS tables
// - Returns structured JSON with procedure details
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

const OPENAI_API_KEY = <OPENAI_API_KEY>
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// WIS Barry's personality (focused on workshop procedures)
const WIS_BARRY_SYSTEM_PROMPT = `You are Barry, a gruff but brilliant Unimog mechanic specialized in workshop procedures.

You have access to the Workshop Information System (WIS) - a structured database of service procedures, systems, and components.

RULES:
1. You search STRUCTURED workshop procedures (not PDF manuals)
2. Always provide procedure codes, estimated time, and difficulty
3. Include direct links to procedures in the WIS interface
4. For general technical questions, suggest using Manual Barry instead
5. Stay focused on step-by-step workshop procedures
6. Be specific about tools, parts, and precautions

RESPONSE FORMAT:
- Procedure title and code
- Estimated time and difficulty
- System and component hierarchy
- Direct link: /wis/procedures/{procedure_id}

You are helpful but gruff. Example:
"Right, you want the engine oil change procedure. Here's what you need..."
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

    // Build context with procedure data
    let wisContext = '';

    if (procedures.length > 0) {
      wisContext = '\n\n=== AVAILABLE WIS PROCEDURES ===\n\n';

      for (const proc of procedures) {
        wisContext += `
Procedure: ${proc.title}
Code: ${proc.procedure_code}
System: ${proc.system_name}
Component: ${proc.component_name}
Difficulty: ${getDifficultyLabel(proc.difficulty_level)}
Estimated Time: ${proc.estimated_time_hours ? `${proc.estimated_time_hours} hours` : 'Not specified'}
Model: ${proc.model_code}
Link: /wis/procedures/${proc.id}

${proc.description || 'No description available'}

---
`;
      }
    } else {
      wisContext = '\n\nNo WIS procedures found matching this query. You may need to suggest the user checks Manual Barry for general information, or explain that this specific procedure might not be in the WIS database yet.';
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

    // Return response with procedure references
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
          link: `/wis/procedures/${p.id}`
        })),
        searchResultCount: procedures.length,
        model: 'gpt-4o-wis-barry-v1'
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
 * Search WIS procedures using PostgreSQL full-text search
 */
async function searchWISProcedures(
  supabase: any,
  query: string,
  modelCode?: string
): Promise<any[]> {
  try {
    // Build search query
    let searchQuery = supabase
      .from('wis_procedures')
      .select(`
        id,
        procedure_code,
        title,
        description,
        difficulty_level,
        estimated_time_hours,
        status,
        wis_components!inner (
          component_name,
          component_code,
          wis_systems!inner (
            system_name,
            system_code,
            wis_models!inner (
              model_code,
              model_name
            )
          )
        )
      `)
      .eq('status', 'active');

    // Filter by model if specified
    if (modelCode) {
      // Note: This requires proper join syntax - adjust based on your schema
      searchQuery = searchQuery.eq('wis_components.wis_systems.wis_models.model_code', modelCode);
    }

    // Use PostgreSQL full-text search on search_vector if available
    // Otherwise fall back to ILIKE search
    const { data: procedures, error } = await searchQuery
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,procedure_code.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('WIS search error:', error);
      return [];
    }

    // Flatten the nested structure
    return (procedures || []).map(proc => ({
      id: proc.id,
      procedure_code: proc.procedure_code,
      title: proc.title,
      description: proc.description,
      difficulty_level: proc.difficulty_level,
      estimated_time_hours: proc.estimated_time_hours,
      status: proc.status,
      component_name: proc.wis_components?.component_name,
      component_code: proc.wis_components?.component_code,
      system_name: proc.wis_components?.wis_systems?.system_name,
      system_code: proc.wis_components?.wis_systems?.system_code,
      model_code: proc.wis_components?.wis_systems?.wis_models?.model_code,
      model_name: proc.wis_components?.wis_systems?.wis_models?.model_name,
    }));

  } catch (error) {
    console.error('Search WIS procedures error:', error);
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
