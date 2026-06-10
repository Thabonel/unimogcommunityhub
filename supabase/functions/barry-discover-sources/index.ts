import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

// Known Unimog-related sites to seed discovery
const SEED_SITES = {
  trips: [
    { url: 'https://www.wikiloc.com/wikiloc/find.do?q=unimog', domain: 'wikiloc.com', name: 'Wikiloc Unimog Trails' },
    { url: 'https://www.ioverlander.com/', domain: 'ioverlander.com', name: 'iOverlander' },
    { url: 'https://www.expeditionportal.com/forum/', domain: 'expeditionportal.com', name: 'Expedition Portal' },
  ],
  guides: [
    { url: 'https://www.mercedessource.com/problems/unimog', domain: 'mercedessource.com', name: 'Mercedes Source Unimog' },
    { url: 'https://www.unimog-community.de/', domain: 'unimog-community.de', name: 'Unimog Community DE' },
  ]
};

// Search prompts for discovering new sources
const DISCOVERY_PROMPTS = {
  trips: `Find websites with Unimog trip reports, overlanding routes, or off-road adventures.
Look for:
- GPS/GPX tracks from Unimog expeditions
- Trip reports with route details
- Camping/overlanding spots popular with Unimog owners
- Off-road trail databases that feature Unimog-capable routes

Return a JSON array of discovered sites with format:
[{"url": "...", "domain": "...", "reasoning": "...", "confidence": 0.0-1.0}]`,

  guides: `Find websites with Unimog repair guides, maintenance procedures, or technical documentation.
Look for:
- Workshop repair procedures for U435, U1300L, U1700L
- DIY maintenance guides
- Technical forums with repair discussions
- Parts suppliers with technical documentation

Return a JSON array of discovered sites with format:
[{"url": "...", "domain": "...", "reasoning": "...", "confidence": 0.0-1.0}]`
};

interface DiscoverySuggestion {
  url: string;
  domain: string;
  suggested_type: 'trip' | 'guide';
  confidence_score: number;
  reasoning: string;
}

async function discoverSourcesWithAI(type: 'trip' | 'guide'): Promise<DiscoverySuggestion[]> {
  if (!DEEPSEEK_API_KEY) {
    console.warn('[Discovery] No DEEPSEEK_API_KEY configured');
    return [];
  }

  const prompt = type === 'trip' ? DISCOVERY_PROMPTS.trips : DISCOVERY_PROMPTS.guides;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 1000,
        temperature: 0.3,
        stream: false,
        messages: [
          {
            role: 'system',
            content: `You are a research assistant helping discover Unimog-related websites for a community platform.
Only suggest legitimate, publicly accessible websites.
Focus on quality over quantity.
Return valid JSON only.`
          },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      console.error('[Discovery] DeepSeek API error:', response.status);
      return [];
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('[Discovery] No JSON found in response');
      return [];
    }

    const suggestions = JSON.parse(jsonMatch[0]);
    return suggestions.map((s: any) => ({
      url: s.url,
      domain: s.domain || new URL(s.url).hostname.replace('www.', ''),
      suggested_type: type,
      confidence_score: Math.min(1, Math.max(0, s.confidence || 0.5)),
      reasoning: s.reasoning || 'AI discovered source'
    }));
  } catch (error) {
    console.error('[Discovery] Error:', error);
    return [];
  }
}

async function checkExistingSource(supabase: any, domain: string): Promise<boolean> {
  const { data } = await supabase
    .from('scrape_sources')
    .select('id')
    .eq('domain', domain)
    .limit(1);

  return (data && data.length > 0);
}

async function checkExistingSuggestion(supabase: any, url: string): Promise<boolean> {
  const { data } = await supabase
    .from('discovery_suggestions')
    .select('id')
    .eq('url', url)
    .limit(1);

  return (data && data.length > 0);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { type = 'both', use_ai = true, include_seeds = true } = await req.json().catch(() => ({}));

    console.log(`[barry-discover-sources] Starting discovery: type=${type}, use_ai=${use_ai}`);

    const suggestions: DiscoverySuggestion[] = [];
    const added: string[] = [];
    const skipped: string[] = [];

    // Include seed sites if requested
    if (include_seeds) {
      if (type === 'both' || type === 'trip') {
        for (const seed of SEED_SITES.trips) {
          suggestions.push({
            url: seed.url,
            domain: seed.domain,
            suggested_type: 'trip',
            confidence_score: 0.9,
            reasoning: 'Known Unimog community resource'
          });
        }
      }
      if (type === 'both' || type === 'guide') {
        for (const seed of SEED_SITES.guides) {
          suggestions.push({
            url: seed.url,
            domain: seed.domain,
            suggested_type: 'guide',
            confidence_score: 0.9,
            reasoning: 'Known Unimog technical resource'
          });
        }
      }
    }

    // Use AI to discover additional sources
    if (use_ai) {
      if (type === 'both' || type === 'trip') {
        const tripSuggestions = await discoverSourcesWithAI('trip');
        suggestions.push(...tripSuggestions);
      }
      if (type === 'both' || type === 'guide') {
        const guideSuggestions = await discoverSourcesWithAI('guide');
        suggestions.push(...guideSuggestions);
      }
    }

    // Deduplicate by domain
    const seenDomains = new Set<string>();
    const uniqueSuggestions = suggestions.filter(s => {
      if (seenDomains.has(s.domain)) return false;
      seenDomains.add(s.domain);
      return true;
    });

    // Process suggestions
    for (const suggestion of uniqueSuggestions) {
      // Check if already exists as source
      const existsAsSource = await checkExistingSource(supabase, suggestion.domain);
      if (existsAsSource) {
        skipped.push(`${suggestion.domain} (already a source)`);
        continue;
      }

      // Check if already suggested
      const existsAsSuggestion = await checkExistingSuggestion(supabase, suggestion.url);
      if (existsAsSuggestion) {
        skipped.push(`${suggestion.domain} (already suggested)`);
        continue;
      }

      // Auto-approve high confidence suggestions (>0.85)
      if (suggestion.confidence_score >= 0.85) {
        const { error: sourceError } = await supabase.from('scrape_sources').insert({
          url: suggestion.url,
          domain: suggestion.domain,
          name: suggestion.domain,
          type: suggestion.suggested_type,
          frequency: 'weekly',
          status: 'active',
          discovered_by: 'barry',
          confidence_score: suggestion.confidence_score,
        });

        if (!sourceError) {
          added.push(`${suggestion.domain} (auto-approved)`);
          console.log(`[Discovery] Auto-approved: ${suggestion.domain}`);
        } else {
          console.error(`[Discovery] Failed to add source: ${suggestion.domain}`, sourceError);
        }
      } else {
        // Add to suggestions queue for admin review
        const { error: suggestError } = await supabase.from('discovery_suggestions').insert({
          url: suggestion.url,
          domain: suggestion.domain,
          suggested_type: suggestion.suggested_type,
          confidence_score: suggestion.confidence_score,
          reasoning: suggestion.reasoning,
          status: 'pending'
        });

        if (!suggestError) {
          added.push(`${suggestion.domain} (pending review)`);
          console.log(`[Discovery] Added for review: ${suggestion.domain}`);
        }
      }
    }

    console.log(`[barry-discover-sources] Complete: ${added.length} added, ${skipped.length} skipped`);

    return new Response(JSON.stringify({
      success: true,
      added,
      skipped,
      total_suggestions: uniqueSuggestions.length
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('[barry-discover-sources] Error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
