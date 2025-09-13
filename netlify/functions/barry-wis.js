// netlify/functions/barry-wis.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Comprehensive Multi-Model Unimog Search Mapping
const UNIMOG_SEARCH_MAPPING = {
  // Portal Hub / Axle Components - All Models
  'portal hub': ['portal hub', 'hub', 'Portal hub assembly', 'Hub Frame & Suspension', 'Frame & Suspension'],
  'portal axle': ['portal axle', 'Portal axle housing', 'Hub Frame & Suspension', 'Differential Frame & Suspension', 'Frame & Suspension'],
  'axle': ['axle', 'Axle shaft', 'Differential Frame & Suspension', 'Hub Frame & Suspension', 'Frame & Suspension'],
  'differential': ['differential', 'Differential lock', 'Differential Frame & Suspension'],
  
  // Seal Types - Comprehensive
  'hub seal': ['Portal hub seal', 'seal', 'Hub Frame & Suspension', 'Portal hub upper seal', 'Portal hub lower seal'],
  'portal hub seal': ['Portal hub seal', 'Portal hub complete seal kit', 'Portal hub upper seal', 'Portal hub lower seal', 'seal'],
  'axle seal': ['Transfer case oil seal', 'seal', 'Differential Frame & Suspension'],
  'oil seal': ['Transfer case oil seal input', 'Transfer case oil seal output', 'oil seal', 'seal'],
  
  // Engine Components - Multi-Engine Support
  'OM352': ['OM352', 'Engine gasket set OM352', 'Oil filter OM352', 'Piston set OM352'],
  'OM366': ['OM366', 'Engine gasket set OM366', 'Oil filter OM366', 'Turbocharger OM366LA'],
  'OM314': ['OM314', 'engine'],
  'oil filter': ['Oil filter OM352', 'Oil filter OM366', 'filter'],
  'turbocharger': ['Turbocharger OM352', 'Turbocharger OM366LA', 'turbo'],
  'radiator': ['Radiator OM352', 'Radiator OM366', 'cooling'],
  'water pump': ['Water pump OM366', 'pump'],
  
  // Transmission Systems
  'transmission': ['transmission', 'Transmission', 'Gear selector', 'Transfer case'],
  'transfer case': ['Transfer case', 'Transfer case bearing', 'Transfer case housing', 'Verteilergetriebe'],
  'clutch': ['Clutch disc', 'Clutch pressure plate', 'Clutch release bearing', 'Clutch fork'],
  'clutch disc': ['Clutch disc 395mm', 'Clutch disc 430mm', 'clutch'],
  'synchro': ['Synchro ring', 'Transfer case synchro ring', 'synchronizer'],
  
  // Hydraulic System
  'hydraulic': ['hydraulic', 'Hydraulic pump', 'Hydraulic filter', 'Hydraulic cylinder', 'Main hydraulic pump'],
  'hydraulic pump': ['Main hydraulic pump', 'Hydraulic pump seal', 'hydraulic'],
  'hydraulic filter': ['Hydraulic filter element', 'Hydraulic return filter', 'filter'],
  'hydraulic cylinder': ['Hydraulic cylinder tipping', 'Hydraulic cylinder lifting', 'Hydraulic cylinder steering', 'cylinder'],
  
  // Brake System
  'brake': ['brake', 'Brake chamber', 'Brake valve', 'Air compressor'],
  'brake chamber': ['Brake chamber type 20', 'Brake chamber type 24', 'Brake chamber type 30'],
  'air compressor': ['Air compressor single cylinder', 'Air compressor twin cylinder', 'compressor'],
  
  // Electrical System
  'electrical': ['electrical', 'Alternator', 'Starter motor', 'Glow plug', 'wiring harness'],
  'alternator': ['Alternator 28V 55A', 'Alternator 24V 80A', 'Alternator 24V 100A'],
  'starter': ['Starter motor 24V', 'Starter motor 12V'],
  'glow plug': ['Glow plug 24V', 'Glow plug controller'],
  'wiring harness': ['Main wiring harness', 'Engine wiring harness', 'Cab wiring harness'],
  
  // Body Components
  'door': ['Door hinge', 'Door lock mechanism', 'Door handle'],
  'window': ['Window regulator', 'Windshield wiper'],
  'mirror': ['Mirror assembly', 'Mirror glass', 'Mirror housing'],
  
  // General Maintenance Terms
  'inspection': ['inspection', 'maintenance', 'service'],
  'oil change': ['oil', 'Oil filter', 'Engine oil', 'Portal hub oil', 'Differential oil'],
  'filter replacement': ['filter', 'Oil filter', 'Hydraulic filter', 'Air filter'],
  'seal replacement': ['seal', 'Portal hub seal', 'Transfer case oil seal', 'gasket'],
  
  // German Technical Terms
  'portalachse': ['portal axle', 'Portal axle housing', 'Hub Frame & Suspension'],
  'verteilergetriebe': ['Transfer case', 'transfer case']
};

const CATEGORY_MAPPING = {
  'portal hub': 'Chassis',
  'portal axle': 'Chassis',
  'axle': 'Chassis',
  'differential': 'Chassis',
  'hub seal': 'Chassis',
  'portal hub seal': 'Chassis',
  'axle seal': 'Chassis',
  'suspension': 'Chassis',
  'brake': 'Brake System',
  'brake chamber': 'Brake System',
  'air compressor': 'Brake System',
  'OM352': 'Engine',
  'OM366': 'Engine',
  'OM314': 'Engine',
  'oil filter': 'Engine',
  'turbocharger': 'Engine',
  'radiator': 'Engine',
  'water pump': 'Engine',
  'transmission': 'Transmission',
  'transfer case': 'Transmission',
  'clutch': 'Transmission',
  'clutch disc': 'Transmission',
  'synchro': 'Transmission',
  'hydraulic': 'Hydraulic System',
  'hydraulic pump': 'Hydraulic System',
  'hydraulic filter': 'Hydraulic System',
  'hydraulic cylinder': 'Hydraulic System',
  'electrical': 'Electrical',
  'alternator': 'Electrical',
  'starter': 'Electrical',
  'glow plug': 'Electrical',
  'wiring harness': 'Electrical',
  'door': 'Body',
  'window': 'Body',
  'mirror': 'Body',
  'oil change': 'Maintenance',
  'filter replacement': 'Maintenance',
  'seal replacement': 'Maintenance',
  'inspection': 'Maintenance',
  'portalachse': 'Chassis',
  'verteilergetriebe': 'Transmission'
};

/**
 * Enhanced search with intelligent term mapping and multiple strategies
 */
async function searchWISContent(params) {
  const { query, vehicleModel, contentType, limit = 20 } = params;
  let allResults = [];

  try {
    console.log('Enhanced WIS search started:', { query, vehicleModel, contentType, limit });

    // Step 1: Analyze query and extract enhanced search terms
    const enhancedTerms = extractSearchTerms(query);
    console.log('Enhanced search terms:', enhancedTerms);

    // Step 2: Try multiple search strategies in order of priority
    const searchStrategies = [
      { name: 'Enhanced Terms', terms: enhancedTerms.enhanced, priority: 1 },
      { name: 'Category Search', terms: enhancedTerms.categories, priority: 2 },
      { name: 'Original Query', terms: [query], priority: 3 }
    ];

    for (const strategy of searchStrategies) {
      if (strategy.terms.length === 0) continue;
      
      console.log(`Trying strategy: ${strategy.name} with terms:`, strategy.terms);
      
      for (const searchTerm of strategy.terms) {
        const strategyResults = await performDatabaseSearch(searchTerm, contentType, limit);
        
        if (strategyResults.length > 0) {
          console.log(`Strategy "${strategy.name}" found ${strategyResults.length} results for term: "${searchTerm}"`);
          
          // Add search metadata to results
          strategyResults.forEach(result => {
            result.search_strategy = strategy.name;
            result.search_term = searchTerm;
            result.search_priority = strategy.priority;
          });
          
          allResults.push(...strategyResults);
          
          // If we found good results with a high-priority strategy, we can stop
          if (strategy.priority <= 2 && strategyResults.length >= 3) {
            console.log('Found sufficient results with high-priority strategy, stopping search');
            break;
          }
        }
      }
      
      // Stop if we have enough results
      if (allResults.length >= limit) break;
    }

    // Step 3: Remove duplicates and sort by relevance
    const uniqueResults = removeDuplicateResults(allResults);
    const sortedResults = sortResultsByRelevance(uniqueResults, query);
    
    console.log(`Total unique results found: ${uniqueResults.length}`);
    return sortedResults.slice(0, limit);

  } catch (error) {
    console.error('Enhanced WIS search error:', error);
    throw error;
  }
}

/**
 * Extract enhanced search terms from user query
 */
function extractSearchTerms(query) {
  const queryLower = query.toLowerCase().trim();
  const enhanced = [];
  const categories = [];
  
  // Check for direct mappings
  for (const [userTerm, dbTerms] of Object.entries(UNIMOG_SEARCH_MAPPING)) {
    if (queryLower.includes(userTerm)) {
      enhanced.push(...dbTerms);
      
      // Add category if available
      const category = CATEGORY_MAPPING[userTerm];
      if (category && !categories.includes(category)) {
        categories.push(category);
      }
    }
  }
  
  // If no direct mappings found, try individual words
  if (enhanced.length === 0) {
    const words = queryLower.split(/\s+/).filter(word => word.length >= 3);
    
    for (const word of words) {
      // Check if word appears in any mapping
      for (const [userTerm, dbTerms] of Object.entries(UNIMOG_SEARCH_MAPPING)) {
        if (userTerm.includes(word) || dbTerms.some(term => term.toLowerCase().includes(word))) {
          enhanced.push(...dbTerms);
          
          const category = CATEGORY_MAPPING[userTerm];
          if (category && !categories.includes(category)) {
            categories.push(category);
          }
        }
      }
    }
  }
  
  return {
    enhanced: [...new Set(enhanced)], // Remove duplicates
    categories: [...new Set(categories)],
    original: [query]
  };
}

/**
 * Perform actual database search for a specific term
 */
async function performDatabaseSearch(searchTerm, contentType, limit) {
  const results = [];
  const searchLimit = Math.floor(limit / 3);

  try {
    // Search procedures
    if (!contentType || contentType === 'procedures') {
      const { data: procedures, error: procError } = await supabase
        .from('wis_procedures')
        .select('id, title, category, description, content, procedure_code, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, created_at')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .limit(searchLimit);

      if (!procError && procedures) {
        results.push(...procedures.map(p => ({
          ...p,
          content_type: 'procedure'
        })));
      }
    }

    // Search parts
    if (!contentType || contentType === 'parts') {
      const { data: parts, error: partsError } = await supabase
        .from('wis_parts')
        .select('id, part_number, part_name as title, category, description, price_estimate, availability_status, superseded_by, created_at')
        .or(`part_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,part_number.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .limit(searchLimit);

      if (!partsError && parts) {
        results.push(...parts.map(p => ({
          ...p,
          content_type: 'part'
        })));
      }
    }

    // Search bulletins
    if (!contentType || contentType === 'bulletins') {
      const { data: bulletins, error: bullError } = await supabase
        .from('wis_bulletins')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .limit(searchLimit);

      if (!bullError && bulletins) {
        results.push(...bulletins.map(b => ({
          ...b,
          content_type: 'bulletin'
        })));
      }
    }

    // Search documents
    const { data: documents, error: docError } = await supabase
      .from('wis_documents_unified')
      .select('doc_id as id, title, content, doc_type, ref, updated_at as created_at')
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,doc_type.ilike.%${searchTerm}%`)
      .limit(searchLimit);

    if (!docError && documents) {
      results.push(...documents.map(d => ({
        ...d,
        content_type: 'document'
      })));
    }

  } catch (error) {
    console.error(`Database search error for term "${searchTerm}":`, error);
  }

  return results;
}

/**
 * Remove duplicate results based on ID
 */
function removeDuplicateResults(results) {
  const seen = new Set();
  return results.filter(result => {
    const key = `${result.content_type}-${result.id}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Sort results by relevance to original query
 */
function sortResultsByRelevance(results, originalQuery) {
  const queryLower = originalQuery.toLowerCase();
  
  return results.sort((a, b) => {
    // Prioritize by search strategy priority
    if (a.search_priority !== b.search_priority) {
      return a.search_priority - b.search_priority;
    }
    
    // Then by title relevance
    const aTitle = (a.title || '').toLowerCase();
    const bTitle = (b.title || '').toLowerCase();
    
    const aExactMatch = aTitle.includes(queryLower);
    const bExactMatch = bTitle.includes(queryLower);
    
    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;
    
    // Finally by content type preference (procedures > parts > bulletins > documents)
    const typeOrder = { procedure: 1, part: 2, bulletin: 3, document: 4 };
    return (typeOrder[a.content_type] || 5) - (typeOrder[b.content_type] || 5);
  });
}

/**
 * Generate Barry's intelligent contextual response
 */
function generateBarryResponse(query, vehicleModel, searchResults) {
  const hasResults = searchResults && searchResults.length > 0;
  
  if (hasResults) {
    return generateResponseWithResults(query, vehicleModel, searchResults);
  } else {
    return generateResponseWithoutResults(query, vehicleModel);
  }
}

function generateResponseWithResults(query, vehicleModel, searchResults) {
  const queryLower = query.toLowerCase();
  
  // Analyze what was found
  const procedureCount = searchResults.filter(r => r.content_type === 'procedure').length;
  const partCount = searchResults.filter(r => r.content_type === 'part').length;
  const resultSummary = `${procedureCount} procedure(s) and ${partCount} part(s)`;
  
  // Get the top result for detailed info
  const topResult = searchResults[0];
  
  let contextualIntro = "";
  if (queryLower.includes('portal hub') || queryLower.includes('hub seal')) {
    contextualIntro = `For portal hub maintenance on your ${vehicleModel}, I found ${resultSummary} in the WIS database. Portal hubs are critical components that require careful attention to seals and proper torque specifications.`;
  } else if (queryLower.includes('oil change')) {
    contextualIntro = `For engine oil service on your ${vehicleModel}, I found ${resultSummary}. The OM352 engine requires specific oil grades and change intervals for optimal performance.`;
  } else if (queryLower.includes('brake')) {
    contextualIntro = `For brake system work on your ${vehicleModel}, I found ${resultSummary}. Always prioritize safety when working on brake components.`;
  } else {
    contextualIntro = `For your query about "${query}" on ${vehicleModel}, I found ${resultSummary} in the WIS database.`;
  }

  // Format results with enhanced details
  const formattedResults = searchResults.slice(0, 5).map((item, index) => {
    let resultText = `\n${index + 1}. **${item.title}** (${item.content_type})`;
    
    if (item.content_type === 'procedure') {
      const details = [];
      if (item.procedure_code) details.push(`Code: ${item.procedure_code}`);
      if (item.difficulty_level) details.push(`Difficulty: ${item.difficulty_level}/5`);
      if (item.estimated_time_minutes) details.push(`Time: ${item.estimated_time_minutes} min`);
      if (details.length > 0) {
        resultText += ` - ${details.join(', ')}`;
      }
    } else if (item.content_type === 'part') {
      const details = [];
      if (item.part_number) details.push(`Part #: ${item.part_number}`);
      if (item.availability_status) details.push(`Status: ${item.availability_status}`);
      if (details.length > 0) {
        resultText += ` - ${details.join(', ')}`;
      }
    }
    
    if (item.description) {
      resultText += `\n   ${item.description}`;
    }
    
    // Add search strategy info for the first result
    if (index === 0 && item.search_strategy) {
      resultText += `\n   *(Found using: ${item.search_strategy})*`;
    }
    
    return resultText;
  }).join('\n');

  // Generate contextual recommendations
  const recommendations = generateIntelligentRecommendations(query, searchResults);
  
  return `${contextualIntro}

**Found Results:**${formattedResults}

**Barry's Recommendations:**
${recommendations}

**Next Steps:**
• Review the specific procedures and part numbers above
• Gather the required tools and replacement parts
• Follow all safety precautions in the official documentation
• Consider having a qualified technician assist with complex procedures

Would you like me to provide more details about any of these items, or help you find related maintenance procedures?`;
}

function generateResponseWithoutResults(query, vehicleModel) {
  const queryLower = query.toLowerCase();
  
  let contextualHelp = "";
  let suggestions = [];
  
  if (queryLower.includes('portal hub') || queryLower.includes('hub seal')) {
    contextualHelp = `I couldn't find specific documentation for portal hub seal replacement in the current database. However, portal hub maintenance typically involves:`;
    suggestions = [
      "Try searching for 'chassis maintenance' or 'hub service'",
      "Look for 'Frame & Suspension' components in the parts catalog",
      "Check for general differential service procedures",
      "Consider searching for 'seal replacement' procedures"
    ];
  } else if (queryLower.includes('brake')) {
    contextualHelp = `I couldn't find specific brake documentation, but I can help you with brake system maintenance:`;
    suggestions = [
      "Try searching for 'brake system maintenance'",
      "Look for brake pad or disc replacement procedures", 
      "Search for hydraulic system bleeding procedures",
      "Check for brake fluid specifications"
    ];
  } else if (queryLower.includes('engine')) {
    contextualHelp = `I couldn't find specific engine documentation for your query, but the database contains OM352 engine procedures:`;
    suggestions = [
      "Try 'OM352 engine maintenance'",
      "Search for 'oil change OM352'",
      "Look for 'filter replacement OM352'",
      "Try 'engine inspection procedures'"
    ];
  } else {
    contextualHelp = `I couldn't find specific documentation for "${query}" in the current WIS database. Here are some alternative approaches:`;
    suggestions = [
      "Try using more specific technical terms",
      "Search for the main component name (e.g., 'engine', 'transmission', 'chassis')",
      "Look for general maintenance categories",
      "Try breaking your question into smaller parts"
    ];
  }

  const suggestionText = suggestions.map(s => `• ${s}`).join('\n');

  return `${contextualHelp}

**Alternative Search Suggestions:**
${suggestionText}

**General Maintenance Resources:**
• Engine Service: OM352 procedures, oil changes, filter replacements
• Chassis Components: Frame & suspension parts, differential maintenance  
• Hydraulic System: Fluid changes, system bleeding procedures
• Transmission: Service procedures and fluid specifications

**Safety Reminder:**
Always consult official Mercedes-Benz documentation and follow proper safety procedures when performing maintenance work on your ${vehicleModel}.

Try one of the suggested searches above, or ask me about a specific component or system!`;
}

function generateIntelligentRecommendations(query, results) {
  const queryLower = query.toLowerCase();
  const recommendations = [];
  
  // Context-specific recommendations
  if (queryLower.includes('seal')) {
    recommendations.push("• Always replace seals with genuine Mercedes parts to ensure proper fit");
    recommendations.push("• Clean all mating surfaces thoroughly before installing new seals");
    recommendations.push("• Apply appropriate sealant or lubricant as specified in procedures");
    recommendations.push("• Check for signs of excessive wear that might indicate other component issues");
  }
  
  if (queryLower.includes('hub') || queryLower.includes('portal')) {
    recommendations.push("• Support the vehicle properly with appropriate jack stands");
    recommendations.push("• Mark component positions before disassembly for proper reassembly");
    recommendations.push("• Use proper torque specifications for all fasteners");
    recommendations.push("• Check gear oil level and condition during maintenance");
  }
  
  if (queryLower.includes('oil')) {
    recommendations.push("• Use only the specified oil grade for your OM352 engine");
    recommendations.push("• Replace the oil filter with each oil change");
    recommendations.push("• Check for leaks after completing the service");
    recommendations.push("• Dispose of used oil and filters according to environmental regulations");
  }
  
  // Add general recommendations if none specific found
  if (recommendations.length === 0) {
    recommendations.push("• Follow all safety procedures outlined in the official documentation");
    recommendations.push("• Use genuine Mercedes-Benz parts when possible");
    recommendations.push("• Have the proper tools and workspace prepared before starting");
    recommendations.push("• Consider professional assistance for complex procedures");
  }
  
  return recommendations.join('\n');
}

/**
 * Generate specific recommendations based on query and results
 */
function generateRecommendations(query, results) {
  const recommendations = [];
  const queryLower = query.toLowerCase();

  // Engine-related recommendations
  if (queryLower.includes('engine') || queryLower.includes('motor') || queryLower.includes('om352')) {
    recommendations.push("• Check engine oil level and condition before starting work");
    recommendations.push("• Ensure engine is cool before removing any components");
    recommendations.push("• Have replacement gaskets and seals ready");
  }

  // Hydraulic system recommendations  
  if (queryLower.includes('hydraulic') || queryLower.includes('pump') || queryLower.includes('cylinder')) {
    recommendations.push("• Depressurize hydraulic system before maintenance");
    recommendations.push("• Keep hydraulic fluid clean and contamination-free");
    recommendations.push("• Use proper torque specifications for hydraulic connections");
  }

  // Portal axle recommendations
  if (queryLower.includes('portal') || queryLower.includes('axle') || queryLower.includes('differential')) {
    recommendations.push("• Support vehicle properly with jack stands");
    recommendations.push("• Mark component positions before disassembly");
    recommendations.push("• Check gear oil level and condition");
  }

  // Brake system recommendations
  if (queryLower.includes('brake') || queryLower.includes('pad') || queryLower.includes('disc')) {
    recommendations.push("• Test brake system thoroughly after any work");
    recommendations.push("• Bleed brake system if hydraulic components are disturbed");
    recommendations.push("• Check brake fluid level and color");
  }

  return recommendations.length > 0 
    ? recommendations.join('\n') 
    : "• Follow all safety procedures in the official documentation\n• Have necessary tools and parts ready before starting";
}

/**
 * Get suggestions for related searches
 */
function generateSearchSuggestions(query, vehicleModel) {
  const suggestions = [];
  const queryLower = query.toLowerCase();

  if (queryLower.includes('oil')) {
    suggestions.push(`Oil filter replacement for ${vehicleModel || 'Unimog'}`);
    suggestions.push('Engine oil capacity and specifications');
    suggestions.push('Oil change interval recommendations');
  }

  if (queryLower.includes('brake')) {
    suggestions.push('Brake fluid specifications');
    suggestions.push('Brake pad inspection procedures');
    suggestions.push('Air brake system maintenance');
  }

  if (queryLower.includes('engine')) {
    suggestions.push('Engine diagnostic procedures');
    suggestions.push('Cooling system maintenance');
    suggestions.push('Fuel system troubleshooting');
  }

  if (queryLower.includes('transmission')) {
    suggestions.push('Transmission fluid change');
    suggestions.push('Clutch adjustment procedures');
    suggestions.push('Gearbox troubleshooting');
  }

  // Add generic suggestions if no specific ones
  if (suggestions.length === 0) {
    suggestions.push('Preventive maintenance schedule');
    suggestions.push('Safety procedures and precautions');
    suggestions.push('Tool requirements and specifications');
  }

  return suggestions;
}

/**
 * Main API endpoint for Barry WIS integration
 */
async function queryBarryWIS(query, vehicleModel, contentType) {
  try {
    console.log('Barry WIS query:', { query, vehicleModel, contentType });

    // Search WIS content
    const searchResults = await searchWISContent({
      query,
      vehicleModel,
      contentType
    });

    // Generate Barry's response
    const response = generateBarryResponse(query, vehicleModel, searchResults);

    // Generate suggestions for follow-up queries
    const suggestions = generateSearchSuggestions(query, vehicleModel);

    return {
      success: true,
      response,
      context: {
        query,
        results: searchResults,
        suggestions
      }
    };

  } catch (error) {
    console.error('Barry WIS query failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Netlify Function handler
 */
export async function handler(event, context) {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { query, vehicleModel, contentType } = JSON.parse(event.body || '{}');

    if (!query?.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Query is required'
        })
      };
    }

    const result = await queryBarryWIS(query, vehicleModel, contentType);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Barry WIS API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
}