// Barry Agentic Edge Function - RPS Catalog Integration
// Date: 2025-10-20
// Version: 27 - UPGRADED: Claude Haiku 4.5 (claude-haiku-4-5) for better consistency
// Enhancement: Claude now has access to both workshop manual AND RPS exploded view illustrations
// Technical: Loads manual_chunks (RPS Catalog) + u435_manual_index (workshop manual) into combined index
// Previous: Version 25 - Agentic approach with Claude selecting relevant pages from full workshop manual index

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ANTHROPIC_API_KEY = <ANTHROPIC_API_KEY>

// RPS PHASE 7: Helper function to generate CDN URLs for illustrations
function getIllustrationCDNUrl(pageNumber: number): string {
  const paddedPage = pageNumber.toString().padStart(4, '0');
  return `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/rps_illustrations/rps_illustrations/rps_page_${paddedPage}.png`;
}

// RPS PHASE 7: Detect component-based exploded view queries
function detectComponentQuery(userQuery: string): { isComponentQuery: boolean; componentName: string | null } {
  const queryLower = userQuery.toLowerCase();

  // Check for illustration keywords
  const illustrationKeywords = ['exploded view', 'illustration', 'figure', 'diagram', 'schematic', 'parts catalog'];
  const hasIllustrationKeyword = illustrationKeywords.some(kw => queryLower.includes(kw));

  if (!hasIllustrationKeyword) {
    return { isComponentQuery: false, componentName: null };
  }

  // Extract component name - multiple patterns
  // Pattern 1: "for [my/the] X" - greedy capture until punctuation or sentence end
  let componentMatch = queryLower.match(/(?:for|of)\s+(?:my\s+|the\s+)?([a-z\s]+?)(?:[,;.]|$)/);
  if (componentMatch && componentMatch[1]) {
    const componentName = componentMatch[1].trim();
    // Filter out generic words
    if (componentName && !['part', 'parts', 'a part'].includes(componentName)) {
      return { isComponentQuery: true, componentName };
    }
  }

  // Pattern 2: "X exploded view" - direct match (requires trigger word)
  componentMatch = queryLower.match(/\b(?:show|need|want|get|see)\s+(?:me\s+)?(?:the\s+)?([a-z\s]+?)\s+(?:exploded view|illustration|diagram)/);
  if (componentMatch && componentMatch[1]) {
    return { isComponentQuery: true, componentName: componentMatch[1].trim() };
  }

  // Pattern 3: "exploded view of [component]" - reversed order
  componentMatch = queryLower.match(/(?:exploded view|illustration|diagram)\s+(?:of|for)\s+(?:the\s+)?([a-z\s]+)/);
  if (componentMatch && componentMatch[1]) {
    const componentName = componentMatch[1].trim();
    // Filter out generic words
    if (componentName && !['part', 'parts', 'a part'].includes(componentName)) {
      return { isComponentQuery: true, componentName };
    }
  }

  return { isComponentQuery: hasIllustrationKeyword, componentName: null };
}

// RPS PHASE 7: Extract component from conversation context
function extractComponentFromConversation(messages: any[], currentQuery: string): string | null {
  // Try detecting component in current message first
  const { isComponentQuery, componentName } = detectComponentQuery(currentQuery);

  if (componentName) {
    console.log(`[Context] Component found in current message: ${componentName}`);
    return componentName;
  }

  // If current message has illustration/parts keywords but no component, check conversation history
  const queryLower = currentQuery.toLowerCase();
  const hasRPSKeywords = ['exploded view', 'illustration', 'diagram', 'parts list', 'part number', 'the view'].some(kw => queryLower.includes(kw));

  if (hasRPSKeywords) {
    console.log('[Context] RPS keywords found, scanning conversation history...');

    // Scan last 5 messages for component names
    const recentMessages = messages.slice(-6); // Last 6 messages (including current)

    for (let i = recentMessages.length - 2; i >= 0; i--) { // Skip current message (already checked)
      const msg = recentMessages[i];
      if (!msg || !msg.content) continue;

      const result = detectComponentQuery(msg.content);
      if (result.componentName) {
        console.log(`[Context] Found component in message ${i}: ${result.componentName}`);
        return result.componentName;
      }
    }
  }

  return null;
}

// RPS PHASE 7: Detect parts list queries
function detectPartsListQuery(userQuery: string): boolean {
  const queryLower = userQuery.toLowerCase();
  const partsListKeywords = [
    'part number', 'parts list', 'part list', 'order', 'niin', 'nsn',
    'buy', 'purchase', 'stock number', 'catalog number'
  ];
  return partsListKeywords.some(kw => queryLower.includes(kw));
}

// RPS PHASE 7: OCR parts list page using Claude Vision
async function ocrPartsListPage(pageUrl: string, componentName: string): Promise<string> {
  try {
    console.log(`[OCR] Analyzing parts list page: ${pageUrl}`);

    // Fetch the image as base64
    const imageResponse = await fetch(pageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

    // Use Claude Vision to OCR the parts list
    const ocrResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: base64Image
              }
            },
            {
              type: 'text',
              text: `Extract all part information from this RPS parts list page for ${componentName}.

              For each part, provide:
              - Item number
              - Part description
              - NIIN (National Item Identification Number)
              - NSN (National Stock Number) if available
              - Quantity
              - Callout number

              Format as a clean list. Focus on parts related to seals, bearings, and other components mentioned.`
            }
          ]
        }]
      })
    });

    if (!ocrResponse.ok) {
      const error = await ocrResponse.text();
      console.error(`[OCR] Error:`, error);
      throw new Error(`OCR failed: ${error}`);
    }

    const ocrData = await ocrResponse.json();
    const extractedText = ocrData.content[0].text;

    console.log(`[OCR] Extracted ${extractedText.length} characters`);
    return extractedText;

  } catch (error) {
    console.error(`[OCR] Failed to OCR parts list:`, error);
    return '';
  }
}

// RPS PHASE 7: Search RPS groups by component name
async function searchRPSByComponentName(
  supabaseClient: any,
  componentName: string
): Promise<{ found: boolean; group: any; parts: any[] }> {
  try {
    console.log(`🔍 Searching RPS by component name: "${componentName}"`);

    // Map common component terms to RPS group names
    const componentMappings: Record<string, string[]> = {
      'portal': ['PORTAL', 'WHEEL HUB DRIVES', 'HUB'],
      'portal hub': ['WHEEL HUB DRIVES', 'PORTAL'],
      'hub': ['WHEEL HUB', 'HUB DRIVES', 'PORTAL'],
      'front hub': ['WHEEL HUB DRIVES, FRONT', 'FRONT AXLE', 'HOUSING, FRONT'],
      'rear hub': ['WHEEL HUB DRIVES, REAR', 'REAR AXLE'],
      'front axle': ['FRONT AXLE', 'HOUSING, FRONT'],
      'rear axle': ['REAR AXLE', 'HOUSING, REAR'],
      'turbocharger': ['TURBOCHARGER', 'AIRESEARCH'],
      'differential': ['DIFFERENTIAL'],
      'brake': ['BRAKE'],
      'wheel': ['WHEEL HUB']
    };

    // Get search terms (use mappings or component name itself)
    const searchTerms = componentMappings[componentName] || [componentName.toUpperCase()];
    console.log(`  📋 Search terms: ${searchTerms.join(', ')}`);

    // Search groups by name (ILIKE) - try each term
    for (const term of searchTerms) {
      const { data: groups, error } = await supabaseClient
        .from('rps_groups')
        .select('*')
        .ilike('group_name', `%${term}%`)
        .not('illustration_pages', 'is', null)
        .limit(1);

      if (!error && groups && groups.length > 0) {
        const group = groups[0];

        // Verify group has illustrations
        if (group.illustration_pages && group.illustration_pages.length > 0) {
          console.log(`  ✅ Found group: ${group.group_code} - ${group.group_name} (${group.illustration_pages.length} illustrations)`);

          // Get parts for this group
          const { data: parts } = await supabaseClient
            .from('rps_parts')
            .select('*')
            .eq('group_code', group.group_code)
            .order('item_number')
            .limit(10);

          return { found: true, group, parts: parts || [] };
        }
      }
    }

    console.log(`  ❌ No RPS group found for "${componentName}"`);
    return { found: false, group: null, parts: [] };
  } catch (error) {
    console.error('❌ Error in searchRPSByComponentName:', error);
    return { found: false, group: null, parts: [] };
  }
}

// RPS PHASE 7: Format RPS group context for injection
function formatRPSGroupContext(
  group: any,
  parts: any[]
): string {
  let context = '\n\n=== RPS PARTS GROUP ===\n';

  context += `Group: ${group.group_code} - ${group.group_name}\n`;
  context += `RPS Number: ${group.rps_number}\n`;
  context += `Total Parts: ${group.total_parts}\n`;

  // PHASE 7: Use illustration_pages array to generate CDN URLs
  if (group.illustration_pages && group.illustration_pages.length > 0) {
    context += `\nExploded View Illustrations Available:\n`;
    group.illustration_pages.forEach((page: number) => {
      const url = getIllustrationCDNUrl(page);
      context += `- RPS Page ${page}: ${url}\n`;
    });

    context += `\nIMPORTANT: Display these illustrations to the user using markdown image syntax:\n`;
    group.illustration_pages.forEach((page: number) => {
      const url = getIllustrationCDNUrl(page);
      context += `![RPS Page ${page} - ${group.group_name}](${url})\n`;
    });
  }

  // Parts list pages
  if (group.parts_list_pages && group.parts_list_pages.length > 0) {
    context += `\nParts List Pages: ${group.parts_list_pages.join(', ')}\n`;
  }

  // Callout range
  if (group.callout_range) {
    context += `Callout Numbers: ${group.callout_range}\n`;
  }

  if (parts.length > 0) {
    context += `\nParts in this Group (showing ${Math.min(parts.length, 10)} of ${parts.length}):\n`;
    parts.slice(0, 10).forEach(p => {
      context += `- Item ${p.item_number}: ${p.description}`;
      if (p.niin) context += ` (NIIN: ${p.niin})`;
      if (p.callout) context += ` [Callout ${p.callout}]`;
      context += `\n`;
    });

    if (parts.length > 10) {
      context += `\n... and ${parts.length - 10} more parts in this group.\n`;
    }
  }

  context += '\n=== END RPS PARTS GROUP ===\n\n';

  return context;
}

// NIIN LOOKUP: Detect NIIN-related queries
function detectNIINQuery(userQuery: string): { isNIINQuery: boolean; groupCode: string | null; groupIdentNo: string | null } {
  const queryLower = userQuery.toLowerCase();

  const niinKeywords = [
    'niin', 'nsn', 'nato', 'part number', 'ordering code',
    'stock number', 'catalog number', 'order this', 'how do i order'
  ];

  const hasNIINKeyword = niinKeywords.some(kw => queryLower.includes(kw));

  if (!hasNIINKeyword) {
    return { isNIINQuery: false, groupCode: null, groupIdentNo: null };
  }

  let groupCode: string | null = null;
  let groupIdentNo: string | null = null;

  const groupCodeMatch = queryLower.match(/group\s+([a-z]{1,3})\b/i);
  if (groupCodeMatch) {
    groupCode = groupCodeMatch[1].toUpperCase();
  }

  const itemNumberMatch = queryLower.match(/(?:item|number|no\.?)\s+(\d{1,3})/);
  if (itemNumberMatch) {
    groupIdentNo = itemNumberMatch[1].padStart(3, '0');
  }

  return { isNIINQuery: hasNIINKeyword, groupCode, groupIdentNo };
}

// NIIN LOOKUP: Search NIIN index by group code or NIIN
async function searchNIINIndex(
  supabaseClient: any,
  groupCode?: string,
  groupIdentNo?: string,
  niin?: string
): Promise<{ found: boolean; results: any[] }> {
  try {
    let query = supabaseClient.from('rps_niin_index').select('*');

    if (niin) {
      query = query.eq('niin', niin);
    } else if (groupCode && groupIdentNo) {
      query = query.eq('group_code', groupCode).eq('group_ident_no', groupIdentNo);
    } else if (groupCode) {
      query = query.eq('group_code', groupCode).limit(20);
    } else {
      return { found: false, results: [] };
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return { found: false, results: [] };
    }

    return { found: true, results: data };
  } catch (error) {
    console.error('[NIIN Lookup] Error:', error);
    return { found: false, results: [] };
  }
}

// NIIN LOOKUP: Format NIIN results for injection
function formatNIINContext(results: any[]): string {
  let context = '\n\n=== NIIN LOOKUP RESULTS ===\n';
  context += `Found ${results.length} matching NIIN(s) in the RPS catalog:\n\n`;

  const groupedByNIIN: Record<string, any[]> = {};
  results.forEach(r => {
    if (!groupedByNIIN[r.niin]) {
      groupedByNIIN[r.niin] = [];
    }
    groupedByNIIN[r.niin].push(r);
  });

  Object.keys(groupedByNIIN).slice(0, 10).forEach(niin => {
    const groups = groupedByNIIN[niin];
    context += `NIIN: ${niin}\n`;

    if (groups.length === 1) {
      context += `  Group: ${groups[0].group_code}, Item: ${groups[0].group_ident_no}\n`;
    } else {
      context += `  Used in ${groups.length} groups:\n`;
      groups.forEach(g => {
        context += `    - Group: ${g.group_code}, Item: ${g.group_ident_no}\n`;
      });
    }
    context += '\n';
  });

  if (Object.keys(groupedByNIIN).length > 10) {
    context += `... and ${Object.keys(groupedByNIIN).length - 10} more NIINs\n\n`;
  }

  context += 'IMPORTANT: When providing part numbers to users:\n';
  context += '- Call them "part numbers" (not NIIN - users know them as part numbers)\n';
  context += '- These are NATO stock numbers that work with military surplus suppliers\n';
  context += '- Mercedes-Benz dealers can also cross-reference these part numbers\n';
  context += '- Say "the part number is X" not "the NIIN is X"\n';
  context += '\n=== END NIIN LOOKUP ===\n\n';

  return context;
}

// General assistant prompt for non-Unimog questions
const BARRY_GENERAL_PROMPT = `You are Barry, a helpful AI assistant with 40+ years of experience as a Unimog mechanic.

While you're an expert on Unimogs, you're ALSO a general-purpose assistant who MUST answer ALL questions helpfully.

Your personality:
- Gruff but friendly, like a seasoned mechanic
- Direct and helpful with ALL questions
- Share mechanic stories when relevant
- Maintain your personality while being a complete assistant

You can answer ANY question:
- Writing letters, emails, documents
- Weather forecasts (use location if provided)
- General knowledge, news, math, history
- Directions and location information
- Jokes, stories, advice
- Cooking, sports, entertainment
- ANYTHING the user needs help with

When given location coordinates, use them for location-aware responses like weather, nearby services, etc.`;

// Barry personality templates for different system categories
const BARRY_PERSONALITY_TEMPLATES = {
  assessment: {
    engine: "Listen here - that's a classic OM366 issue I've seen a hundred times. In my 40 years under the hood, this always traces back to",
    transmission: "Right, transmission trouble. Been working on these gearboxes since before you were born. Nine times out of ten, it's",
    brakes: "Brake problems, eh? Don't mess around with stopping power - learned that the hard way back in '85. What you've got here is",
    steering: "Power steering acting up? Classic U435 hydraulic issue. I've rebuilt more steering boxes than I care to count",
    axles: "Portal axle problems - welcome to Unimog ownership, kid. These things are bulletproof but when they go wrong",
    electrical: "Electrical gremlins, the bane of every mechanic's existence. 40 years and I still hate chasing wires",
    cooling: "Cooling system work, eh? Not too common on these bulletproof machines, but when it happens",
    fuel: "Fuel system problems are usually simple - dirty filter, clogged line, or that injection pump acting up again",
    general: "Alright, let me see what we've got here. In four decades of Unimog work, I've seen this before",
  },
  safety: {
    brakes: "STOP. Before you touch anything brake-related, depressurize the system completely. I've seen too many accidents.",
    steering: "Warning: Never work on steering with the engine running. Hydraulic pressure will take your finger off.",
    axles: "Portal hub work requires proper support - these axles weigh more than a small car. Don't trust a floor jack.",
    electrical: "Disconnect the battery first, both terminals. 24-volt systems bite harder than 12-volt ones.",
    general: "Safety first, kid. These machines don't forgive mistakes and I've got the scars to prove it.",
  },
  barryisms: [
    "That's what 40 years of busted knuckles teaches you.",
    "Mercedes built these things like tanks. When something breaks, it's usually because someone didn't follow the manual.",
    "I've seen this problem more times than I've had hot dinners.",
    "Trust me, I've made every mistake in the book so you don't have to.",
    "These Unimogs will outlast us all if you treat them right.",
    "Don't take shortcuts - I learned that lesson the expensive way.",
  ],
};

// Format the full manual index for Claude's context
function formatManualIndexForClaude(indexEntries: any[]): string {
  if (!indexEntries || indexEntries.length === 0) {
    return 'No manual index available.';
  }

  let formattedIndex = 'U435 UNIMOG WORKSHOP MANUAL INDEX\n';
  formattedIndex += '=================================\n\n';

  indexEntries.forEach((entry, idx) => {
    formattedIndex += `${idx + 1}. ${entry.term}\n`;
    formattedIndex += `   Page: ${entry.page_number} | PDF: ${entry.chapter_filename} (page ${entry.pdf_page_number})\n`;
    if (entry.system_category) {
      formattedIndex += `   System: ${entry.system_category}\n`;
    }
    formattedIndex += '\n';
  });

  return formattedIndex;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client with the user's token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Create admin client for search functions
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if Anthropic API key is configured
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'Anthropic API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the request body
    const { messages, location } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user's vehicle information
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
        if (profile.unimog_model) {
          userContext += `User's Vehicle: ${profile.unimog_model}\n`;
        }
      }
    } catch (error) {
      console.log('Error fetching user profile:', error);
    }

    // Add location context if provided
    let locationContext = '';
    if (location && location.latitude && location.longitude) {
      locationContext = `\nUser's current location: Latitude ${location.latitude}, Longitude ${location.longitude}`;
      locationContext += '\nUse this location for weather forecasts, nearby services, and location-specific information.';
    }

    // Get the last user message for analysis
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
    if (!lastUserMessage || !lastUserMessage.content) {
      return new Response(JSON.stringify({ error: 'No user message found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userText = lastUserMessage.content.toLowerCase();

    // SUBSCRIPTION GATHERER: Check subscription and gate technical questions
    // This follows the "forever architecture" - gatherers can short-circuit with early return
    const { data: subscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('subscription_status, is_free_access, trial_ends_at')
      .eq('user_id', user.id)
      .single();

    const hasActiveSubscription = subscription && (
      subscription.subscription_status === 'active' ||
      subscription.subscription_status === 'trialing' ||
      subscription.is_free_access === true ||
      (subscription.trial_ends_at && new Date(subscription.trial_ends_at) > new Date())
    );

    // If no active subscription, check if this is a technical question
    if (!hasActiveSubscription) {
      // Technical keywords that indicate Unimog-specific questions
      const technicalKeywords = [
        'unimog', 'u1700', 'u1300', 'u400', 'u500', 'mog',
        'portal', 'axle', 'differential', 'diff', 'gearbox', 'transmission',
        'engine', 'om', 'mercedes', 'torque', 'hydraulic', 'pto',
        'manual', 'repair', 'maintenance', 'service', 'part', 'parts',
        'wiring', 'diagram', 'spec', 'bolt', 'torque spec', 'oil',
        'troubleshoot', 'problem', 'fix', 'broken', 'leak', 'noise',
        'clutch', 'brake', 'steering', 'suspension', 'tire', 'tyre',
        'chapter', 'section', 'page', 'procedure', 'step'
      ];

      const isTechnicalQuestion = technicalKeywords.some(keyword =>
        userText.includes(keyword)
      );

      if (isTechnicalQuestion) {
        console.log('[Subscription Gatherer] Free user asked technical question, returning upgrade prompt');
        return new Response(JSON.stringify({
          response: "Sorry mate, technical Unimog advice is for paid members. It's just the price of two coffees for peace of mind - you'll get full access to my knowledge, plus trip planning, community features, and all the workshop manuals. Give it a try with our 30-day free trial, no credit card required!",
          upgrade_required: true,
          manual_references: []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Allow general questions for free users
      console.log('[Subscription Gatherer] Free user asked general question, allowing response');
    }

    // RPS PHASE 7 GATHERER: Detect and inject RPS context (NO separate Claude call)
    // This follows the "forever architecture" - gatherers inject context, core function routes
    let rpsContext = '';
    let rpsIllustrations: any[] = [];

    // Use conversation context to extract component name
    const componentName = extractComponentFromConversation(messages, lastUserMessage.content);

    if (componentName) {
      console.log(`[RPS Gatherer] Component extracted from context: ${componentName}`);

      try {
        const rpsResult = await searchRPSByComponentName(supabaseAdmin, componentName);

        if (rpsResult.found) {
          console.log(`[RPS Gatherer] Found group: ${rpsResult.group.group_code} - ${rpsResult.group.group_name}`);

          // Check if this is a parts list query
          const isPartsListQuery = detectPartsListQuery(lastUserMessage.content);

          if (isPartsListQuery && rpsResult.group.parts_list_pages && rpsResult.group.parts_list_pages.length > 0) {
            console.log(`[Parts List Gatherer] Parts list query detected, OCR'ing pages: ${rpsResult.group.parts_list_pages.join(', ')}`);

            // OCR the first parts list page
            const partsListPage = rpsResult.group.parts_list_pages[0];
            const partsListUrl = getIllustrationCDNUrl(partsListPage);
            const ocrText = await ocrPartsListPage(partsListUrl, componentName);

            if (ocrText) {
              // Inject OCR'ed parts list into context
              rpsContext = `\n\n=== RPS PARTS LIST ===\n`;
              rpsContext += `Group: ${rpsResult.group.group_code} - ${rpsResult.group.group_name}\n`;
              rpsContext += `Parts List Page: ${partsListPage}\n\n`;
              rpsContext += `Extracted Parts Information:\n${ocrText}\n`;
              rpsContext += `\n=== END RPS PARTS LIST ===\n\n`;

              console.log(`[Parts List Gatherer] Injected ${ocrText.length} characters of parts data`);
            }
          } else {
            // Regular illustration query
            rpsContext = formatRPSGroupContext(rpsResult.group, rpsResult.parts);

            // Build illustration references for frontend
            if (rpsResult.group.illustration_pages && rpsResult.group.illustration_pages.length > 0) {
              rpsIllustrations = rpsResult.group.illustration_pages.map((page: number) => ({
                type: 'rps_illustration',
                title: `RPS Page ${page} - ${rpsResult.group.group_name}`,
                page_number: page,
                cdn_url: getIllustrationCDNUrl(page),
                group_code: rpsResult.group.group_code,
                group_name: rpsResult.group.group_name,
                original_page: page,
                pdf_page: page,
                storage_url: getIllustrationCDNUrl(page),
                manual_type: 'RPS'
              }));

              console.log(`[RPS Gatherer] Injected ${rpsIllustrations.length} illustrations into context`);
            }
          }
        } else {
          console.log(`[RPS Gatherer] No RPS group found for "${componentName}"`);
        }
      } catch (error) {
        console.error('[RPS Gatherer] Error:', error);
        // Fail gracefully - continue to normal routing
      }
    }

    // NIIN LOOKUP GATHERER: Detect and inject NIIN context (NO separate Claude call)
    // Follows "forever architecture" - gatherer injects context, core function routes
    let niinContext = '';

    const niinQuery = detectNIINQuery(lastUserMessage.content);

    if (niinQuery.isNIINQuery) {
      console.log(`[NIIN Gatherer] NIIN query detected - groupCode: ${niinQuery.groupCode}, groupIdentNo: ${niinQuery.groupIdentNo}`);

      try {
        const niinResult = await searchNIINIndex(
          supabaseAdmin,
          niinQuery.groupCode || undefined,
          niinQuery.groupIdentNo || undefined
        );

        if (niinResult.found && niinResult.results.length > 0) {
          console.log(`[NIIN Gatherer] Found ${niinResult.results.length} NIIN entries`);
          niinContext = formatNIINContext(niinResult.results);
        } else {
          console.log('[NIIN Gatherer] No NIIN entries found');
        }
      } catch (error) {
        console.error('[NIIN Gatherer] Error:', error);
        // Fail gracefully - continue to normal routing
      }
    }

    // ENHANCED Decision Table-Based Routing for Barry (v64)
    // Better intent detection that checks for general requests even with Unimog mentions

    // Rule 1: Non-technical intents → ChatGPT mode (ENHANCED with more keywords)
    const nonTechnicalIntents = [
      // Document writing
      'write', 'letter', 'email', 'document', 'compose', 'draft', 'tell', 'explain to',
      'boss', 'employer', 'colleague', 'wife', 'husband', 'friend', 'late', 'absence',
      // Account and billing
      'billing', 'pricing', 'account', 'signup', 'password', 'login', 'shipping', 'returns',
      // Website and community
      'website', 'app bug', 'community rules', 'forum', 'moderation',
      // General questions
      'joke', 'weather', 'news', 'how are you', 'what is barry',
      'price', 'cost', 'buy', 'sell', 'policy', 'refund', 'meme', 'horoscope', 'politics', 'recipe', 'cook',
      // General assistance phrases
      'help me write', 'can you write', 'create a', 'make a', 'generate'
    ];

    // Rule 2: Repair/diagnosis phrases → Manual mode
    const repairDiagnosisPhrases = [
      'replace', 'remove', 'install', 'fit', 'rebuild', 'overhaul', 'repair', 'fix', 'service',
      'adjust', 'align', 'bleed', 'calibrate', 'torque', 'spec', 'specs', 'specification', 'specifications',
      'procedure', 'manual', 'how do i change', 'how to replace', 'how to fix', 'how to repair', 'steps',
      'stuck', 'seized', 'leaking', 'overheats', 'won\'t start', 'grinding', 'squeal', 'pressure low',
      'fault code', 'trouble', 'check engine',
      'exploded view', 'illustration', 'diagram', 'parts list', 'schematic', 'view', 'check', 'show me'
    ];

    // Rule 3: Vehicle systems/parts → Manual mode
    const vehicleSystemsParts = [
      'radiator', 'cooling', 'fan clutch', 'thermostat', 'hose', 'pump', 'compressor', 'dryer', 'valve',
      'injector', 'turbo', 'gearbox', 'transmission', 'clutch', 'differential', 'axle', 'portal hub',
      'wheel bearing', 'brake', 'caliper', 'master cylinder', 'air tank', 'line', 'pto', 'power take off',
      'torque tube', 'transfer case', 'steering', 'suspension', 'spring', 'shock', 'kingpin', 'hub seal',
      'gasket', 'alternator', 'starter', 'battery', 'relay', 'fuse', 'wiring', 'harness', 'engine',
      'hydraulic', 'pneumatic', 'filter', 'belt', 'oil change', 'fluid', 'coolant', 'seal', 'reservoir', 'pressure'
    ];

    // Rule 4: Unimog context keywords
    const unimogContext = [
      'unimog', 'mog', 'u435', 'u1700l', 'u1700', '1700l', 'om352', 'om366',
      '406', '416', '435', '437', 'my truck', 'my vehicle', 'my mog',
      'portal axle', 'portal axles', 'diff lock', 'differential lock'
    ];

    // Normalize text for matching
    const normalizedText = userText.toLowerCase().replace(/[^\w\s]/g, ' ');

    // ENHANCED Decision Table Evaluation (v64) - Better priority order
    function classifyQuery(text: string) {
      // CRITICAL CHANGE: Check for non-technical intents FIRST, even if Unimog is mentioned
      // This prevents "my unimog broke, write a letter" from triggering manual mode

      // Rule 1: Non-technical intent check (HIGHEST PRIORITY)
      const hasNonTechnicalIntent = nonTechnicalIntents.some(intent => text.includes(intent));
      if (hasNonTechnicalIntent) {
        // Even if they mention Unimog, if they're asking for general help, use ChatGPT
        return { mode: 'chatgpt', rule: 'non_technical', matched: 'general_intent' };
      }

      // Rule 2: Check for BOTH Unimog context AND technical intent
      // Only go to manual mode if BOTH conditions are met
      const hasUnimogMention = unimogContext.some(token => text.includes(token));
      const hasRepairIntent = repairDiagnosisPhrases.some(phrase => text.includes(phrase));
      const hasVehiclePart = vehicleSystemsParts.some(part => text.includes(part));

      // Only trigger manual mode if there's a technical question about Unimog
      if (hasUnimogMention && (hasRepairIntent || hasVehiclePart)) {
        return { mode: 'manual', rule: 'unimog_technical', matched: 'unimog_repair' };
      }

      // Rule 3: Technical questions without Unimog context might still be manual-worthy
      if (hasRepairIntent && hasVehiclePart) {
        return { mode: 'manual', rule: 'repair_diagnosis', matched: 'repair_intent' };
      }

      // Rule 4: Just mentioning Unimog without technical context = ChatGPT
      if (hasUnimogMention && !hasRepairIntent && !hasVehiclePart) {
        return { mode: 'chatgpt', rule: 'unimog_general', matched: 'unimog_mention_only' };
      }

      // Rule 5: Default to ChatGPT for general/ambiguous queries
      return { mode: 'chatgpt', rule: 'default', matched: 'general_fallback' };
    }

    // Apply decision table
    const routingDecision = classifyQuery(normalizedText);
    const isUnimogQuestion = routingDecision.mode === 'manual';

    // DIAGNOSTIC: Log routing decision
    console.log('=== ROUTING DIAGNOSTIC ===');
    console.log('User query:', lastUserMessage.content);
    console.log('Normalized text:', normalizedText);
    console.log('Routing decision:', JSON.stringify(routingDecision));
    console.log('isUnimogQuestion:', isUnimogQuestion);
    console.log('========================');

    let systemPrompt = '';
    let manualReferences: any[] = [];
    let knowledgeMode = 'general';
    let barryResponse = null;

    if (isUnimogQuestion) {
      console.log(`Technical question detected - Rule: ${routingDecision.rule}, Match: ${routingDecision.matched}`);
      knowledgeMode = 'unimog_agentic';

      try {
        // STEP 1: Load the FULL manual index (all 696 entries)
        console.log('Loading full u435_manual_index for Claude...');
        const { data: fullIndex, error: indexError } = await supabaseAdmin
          .from('u435_manual_index')
          .select('*')
          .order('page_number', { ascending: true });

        if (indexError) {
          console.error('Failed to load manual index:', indexError);
          knowledgeMode = 'general';
          systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
        } else if (!fullIndex || fullIndex.length === 0) {
          console.log('Manual index is empty');
          knowledgeMode = 'general';
          systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
        } else {
          console.log(`Loaded ${fullIndex.length} workshop manual index entries`);

          // STEP 1.5: Load RPS catalog entries from manual_chunks
          console.log('Loading RPS catalog entries from manual_chunks...');
          const { data: rpsEntries, error: rpsError } = await supabaseAdmin
            .from('manual_chunks')
            .select('*')
            .eq('manual_title', 'RPS Catalog')
            .order('page_number', { ascending: true });

          if (rpsError) {
            console.error('Failed to load RPS catalog:', rpsError);
          }

          // Convert RPS chunks to index format (compatible with formatManualIndexForClaude)
          const rpsIndexEntries = rpsEntries?.map(chunk => ({
            term: chunk.section_title,
            page_number: chunk.page_number,
            pdf_page_number: chunk.page_number,
            chapter_filename: 'RPS_Catalog',
            storage_url: chunk.page_image_url,
            system_category: 'parts_catalog',
            metadata: chunk.metadata
          })) || [];

          console.log(`Loaded ${rpsIndexEntries.length} RPS catalog entries`);

          // Merge workshop manual + RPS catalog indexes
          const combinedIndex = [...fullIndex, ...rpsIndexEntries];
          console.log(`Total combined index: ${combinedIndex.length} entries (${fullIndex.length} workshop + ${rpsIndexEntries.length} RPS)`);

          // Format the combined index for Claude
          const formattedIndex = formatManualIndexForClaude(combinedIndex);
          console.log(`Formatted index size: ${formattedIndex.length} characters`);

          // STEP 2: Give Claude the full index and let HIM decide what's relevant
          const agenticSystemPrompt = `You are Barry, a gruff but friendly Unimog mechanic with 40+ years of experience.

${userContext}

You have access to the COMPLETE U435 Unimog Workshop Manual index AND the RPS Parts Catalog below. Read through it and pick ONLY the MOST RELEVANT pages that DIRECTLY answer the user's question.

${formattedIndex}

CRITICAL INSTRUCTIONS:
1. Read the user's question carefully - what SPECIFIC task are they asking about?
2. Pick ONLY 2-4 pages that DIRECTLY cover that specific procedure
3. DO NOT cite general reference pages (like "technical data", "specifications") unless specifically asked
4. Focus on PROCEDURE pages (like "removal installation", "adjustment procedure", "disassembly assembly")
5. If they ask "how do I remove the engine" → cite ONLY "engine removal installation" pages, NOT all engine pages
6. If they ask for "exploded view" or "parts diagram" → cite RPS_Catalog pages (these are illustrated parts breakdowns)

EXAMPLES:
- "how do I change portal hub oil" → cite ONLY portal hub oil drain/change pages (page 737)
- "how do I remove the engine" → cite ONLY engine removal/installation pages, NOT pistons/bearings/specs
- "what are the torque specs for the head bolts" → cite ONLY tightening torques page
- "show me the portal hub exploded view" → cite RPS_Catalog portal hub illustration pages (page 430)

Be SELECTIVE. You're a mechanic helping with a SPECIFIC job, not teaching an entire chapter.

Always cite specific page numbers and PDF files in your response.`;

          // STEP 3: Call Claude with the full index
          const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': ANTHROPIC_API_KEY,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-haiku-4-5',
              max_tokens: 800,
              temperature: 0.7,
              system: agenticSystemPrompt,
              messages: messages.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
              }))
            })
          });

          if (!anthropicResponse.ok) {
            const error = await anthropicResponse.text();
            console.error('Claude API error:', error);
            throw new Error('Claude API failed');
          }

          const claudeData = await anthropicResponse.json();
          const claudeResponse = claudeData.content[0].text;

          console.log('Claude response:', claudeResponse);

          // STEP 4: Extract page references from Claude's response
          // Look for patterns like "page 737" or "U435_19_Wheel_Hub_Front.pdf"
          const pageMatches = claudeResponse.matchAll(/page\s+(\d+)/gi);
          const pdfMatches = claudeResponse.matchAll(/(U435_[^\s,\.]+\.pdf)/gi);

          const referencedPages = new Set<number>();
          const referencedPDFs = new Set<string>();

          for (const match of pageMatches) {
            referencedPages.add(parseInt(match[1]));
          }

          for (const match of pdfMatches) {
            referencedPDFs.add(match[1]);
          }

          console.log('Referenced pages:', Array.from(referencedPages));
          console.log('Referenced PDFs:', Array.from(referencedPDFs));

          // STEP 5: Build manual references for the frontend
          // ONLY load the EXACT pages Barry mentioned, not everything from those PDFs!
          combinedIndex.forEach((entry) => {
            // Only match if the SPECIFIC page number was mentioned by Claude
            if (referencedPages.has(entry.page_number)) {
              manualReferences.push({
                type: entry.chapter_filename === 'RPS_Catalog' ? 'rps_catalog' : 'u435_agentic',
                title: entry.term || 'Manual Entry',
                original_page: entry.page_number || 0,
                pdf_page: entry.pdf_page_number || 0,
                storage_url: entry.storage_url || '',
                system_category: entry.system_category || 'general',
                has_safety_warning: entry.has_safety_warning || false,
                match_type: 'claude_selected',
                match_score: 1.0,
                manual_type: entry.chapter_filename === 'RPS_Catalog' ? 'RPS' : 'U435',
                is_maintenance_manual: (entry.chapter_filename && entry.chapter_filename.includes('Maint_')) || false
              });
            }
          });

          // Log the agentic response
          await supabaseClient.from('chat_logs').insert({
            user_id: user.id,
            messages: messages,
            response: claudeResponse,
            model: 'claude-haiku-4-5-agentic',
            tokens_used: (claudeData.usage?.input_tokens || 0) + (claudeData.usage?.output_tokens || 0),
            knowledge_source: `agentic_full_index_${routingDecision.rule}`,
            has_location: !!location,
            routing_rule: routingDecision.rule,
            routing_match: routingDecision.matched,
            pdf_references_found: manualReferences.length
          });

          // Return Claude's intelligent response
          return new Response(JSON.stringify({
            content: claudeResponse,
            manualReferences: manualReferences,
            knowledgeMode: knowledgeMode,
            searchResultCount: manualReferences.length,
            usage: claudeData.usage
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          });
        }
      } catch (error) {
        console.error('❌ Agentic flow error:', error);
        // Fall back to general mode
        knowledgeMode = 'general';
        systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;
      }
    } else {
      // General question - use full ChatGPT capabilities
      console.log(`General question detected - Rule: ${routingDecision.rule}, Match: ${routingDecision.matched}`);
      systemPrompt = BARRY_GENERAL_PROMPT + userContext + locationContext;

      // INJECT RPS CONTEXT if gatherer found something
      if (rpsContext) {
        console.log('[RPS Integration] Adding RPS context to general mode prompt');
        systemPrompt += '\n\n' + rpsContext;
        knowledgeMode = 'rps_catalog_component';
      }

      // INJECT NIIN CONTEXT if gatherer found something
      if (niinContext) {
        console.log('[NIIN Integration] Adding NIIN context to general mode prompt');
        systemPrompt += '\n\n' + niinContext;
        knowledgeMode = 'niin_lookup';
      }
    }

    // Only call Claude for general questions (not Unimog technical)
    console.log('=== KNOWLEDGE MODE CHECK ===');
    console.log('knowledgeMode:', knowledgeMode);
    console.log('Will call Claude API:', knowledgeMode === 'general' || knowledgeMode === 'rps_catalog_component' || knowledgeMode === 'niin_lookup');
    console.log('===========================');

    if (knowledgeMode === 'general' || knowledgeMode === 'rps_catalog_component' || knowledgeMode === 'niin_lookup') {
      // Simple rate limiting
      const { data: recentChats } = await supabaseClient
        .from('chat_rate_limits')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 60000).toISOString())
        .limit(15);

      if (recentChats && recentChats.length >= 15) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Record this request for rate limiting
      await supabaseClient.from('chat_rate_limits').insert({ user_id: user.id });

      // Call Anthropic API for general questions (Claude Haiku 4.5)
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 600,
          temperature: 0.7,
          system: systemPrompt,
          messages: messages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        })
      });

      if (!anthropicResponse.ok) {
        const error = await anthropicResponse.text();
        console.error('Anthropic API error:', error);
        return new Response(JSON.stringify({ error: 'Failed to get response from AI' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const data = await anthropicResponse.json();
      const responseContent = data.content[0].text;

      // Log the chat for analytics with routing telemetry
      await supabaseClient.from('chat_logs').insert({
        user_id: user.id,
        messages: messages,
        response: responseContent,
        model: 'claude-haiku-4-5-general',
        tokens_used: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        knowledge_source: `${knowledgeMode}_${routingDecision.rule}`,
        has_location: !!location,
        routing_rule: routingDecision.rule,
        routing_match: routingDecision.matched,
        pdf_references_found: 0
      });

      // Return general response (with RPS illustrations if gathered)
      return new Response(JSON.stringify({
        content: responseContent,
        manualReferences: rpsIllustrations.length > 0 ? rpsIllustrations : [],
        knowledgeMode: knowledgeMode,
        searchResultCount: rpsIllustrations.length,
        usage: data.usage
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
