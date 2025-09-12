// netlify/functions/barry-wis.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Search WIS content using multiple methods
 */
async function searchWISContent(params) {
  const { query, vehicleModel, contentType, limit = 20 } = params;

  try {
    // First try vector search if available
    const { data: vectorResults, error: vectorError } = await supabase
      .rpc('search_wis_content_vector', {
        search_query: query,
        vehicle_filter: vehicleModel,
        content_type: contentType,
        similarity_threshold: 0.3,
        max_results: limit
      });

    if (!vectorError && vectorResults?.length > 0) {
      console.log('Vector search successful:', vectorResults.length, 'results');
      return vectorResults;
    }

    // Fallback to text search
    let textQuery = supabase
      .from('wis_content')
      .select('*')
      .limit(limit);

    // Add filters
    if (contentType) {
      textQuery = textQuery.eq('content_type', contentType);
    }
    if (vehicleModel) {
      textQuery = textQuery.ilike('vehicle_model', `%${vehicleModel}%`);
    }

    // Text search in multiple fields
    textQuery = textQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    const { data: textResults, error: textError } = await textQuery;

    if (textError) {
      console.error('Text search error:', textError);
      throw new Error(`Search failed: ${textError.message}`);
    }

    console.log('Text search completed:', textResults?.length || 0, 'results');
    return textResults || [];

  } catch (error) {
    console.error('WIS search error:', error);
    throw error;
  }
}

/**
 * Generate Barry's contextual response
 */
function generateBarryResponse(query, vehicleModel, searchResults) {
  const contextInfo = searchResults?.map(item => `
    Document: ${item.title}
    Type: ${item.content_type}
    Vehicle: ${item.vehicle_model || 'Universal'}
    Description: ${item.description}
    Reference: ${item.id}
  `).join('\n') || 'No specific documents found.';

  const barryResponse = `Based on your query "${query}" for ${vehicleModel || 'your Unimog'}, I found the following information in the WIS system:

${contextInfo}

${searchResults?.length ? `
I've found ${searchResults.length} relevant document(s). Here's what I recommend:

${generateRecommendations(query, searchResults)}

Would you like me to provide more specific guidance on any of these procedures?
` : `
I couldn't find specific documents for "${query}" in the current WIS database. However, I can help you with:

1. General maintenance procedures for ${vehicleModel || 'Unimog vehicles'}
2. Common troubleshooting steps  
3. Safety precautions for similar work

What specific aspect would you like help with?`}

Remember to always follow proper safety procedures and consult official documentation when performing maintenance work.`;

  return barryResponse;
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