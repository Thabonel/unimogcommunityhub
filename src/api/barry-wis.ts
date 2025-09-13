// src/api/barry-wis.ts
import { supabase } from '@/lib/supabase-client';
import { mcpConfig, WISContent, WISSearchParams, BarryWISResponse } from '@/config/mcp-config';

/**
 * Barry WIS API - Handles AI-powered search and assistance for WIS content
 * 
 * Since we're using the existing Supabase MCP server through Claude Desktop,
 * this endpoint acts as a bridge between the frontend and the MCP-enabled Barry
 */

export class BarryWISService {
  
  /**
   * Search WIS content using multiple methods across actual tables
   */
  static async searchWISContent(params: WISSearchParams): Promise<WISContent[]> {
    const { query, vehicleModel, contentType, limit = 20 } = params;
    let results: WISContent[] = [];

    try {
      // Search different tables based on content type
      if (!contentType || contentType === 'procedures') {
        const { data: procedures, error: procError } = await supabase
          .from('wis_procedures')
          .select('id, title, category, description, content, procedure_code, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, created_at')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
          .limit(Math.floor(limit / 3));

        if (!procError && procedures) {
          results.push(...procedures.map(p => ({
            ...p,
            content_type: 'procedure' as const
          })));
        }
      }

      if (!contentType || contentType === 'parts') {
        const { data: parts, error: partsError } = await supabase
          .from('wis_parts')
          .select('id, part_number, part_name as title, category, description, price_estimate, availability_status, superseded_by, created_at')
          .or(`part_name.ilike.%${query}%,description.ilike.%${query}%,part_number.ilike.%${query}%,category.ilike.%${query}%`)
          .limit(Math.floor(limit / 3));

        if (!partsError && parts) {
          results.push(...parts.map(p => ({
            ...p,
            content_type: 'part' as const
          })));
        }
      }

      if (!contentType || contentType === 'bulletins') {
        const { data: bulletins, error: bullError } = await supabase
          .from('wis_bulletins')
          .select('*')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .limit(Math.floor(limit / 3));

        if (!bullError && bulletins) {
          results.push(...bulletins.map(b => ({
            ...b,
            content_type: 'bulletin' as const
          })));
        }
      }

      // Also search unified documents
      const { data: documents, error: docError } = await supabase
        .from('wis_documents_unified')
        .select('doc_id as id, title, content, doc_type, ref, updated_at as created_at')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,doc_type.ilike.%${query}%`)
        .limit(Math.floor(limit / 4));

      if (!docError && documents) {
        results.push(...documents.map(d => ({
          ...d,
          content_type: 'document' as const
        })));
      }

      // Sort by relevance (simple title match first, then description)
      results.sort((a, b) => {
        const queryLower = query.toLowerCase();
        const aTitle = a.title?.toLowerCase() || '';
        const bTitle = b.title?.toLowerCase() || '';
        
        if (aTitle.includes(queryLower) && !bTitle.includes(queryLower)) return -1;
        if (!aTitle.includes(queryLower) && bTitle.includes(queryLower)) return 1;
        return 0;
      });

      return results.slice(0, limit);

    } catch (error) {
      console.error('WIS search error:', error);
      throw error;
    }
  }

  /**
   * Generate Barry's contextual response
   */
  static async generateBarryResponse(
    query: string, 
    vehicleModel?: string,
    searchResults?: WISContent[]
  ): Promise<string> {
    
    // For now, we'll create a structured response based on search results
    // In the future, this will connect to the MCP-enabled Claude
    
    const contextInfo = searchResults?.map(item => {
      let details = `
      Document: ${item.title}
      Type: ${item.content_type}
      Reference: ${item.id || item.doc_id}`;
      
      if (item.content_type === 'procedure') {
        details += `
      Procedure Code: ${item.procedure_code || 'N/A'}
      Difficulty: ${item.difficulty_level ? `${item.difficulty_level}/5` : 'Not specified'}
      Est. Time: ${item.estimated_time_minutes ? `${item.estimated_time_minutes} minutes` : 'Not specified'}`;
      } else if (item.content_type === 'part') {
        details += `
      Part Number: ${item.part_number || 'N/A'}
      Status: ${item.availability_status || 'Unknown'}
      Price: ${item.price_estimate ? `$${item.price_estimate}` : 'Not specified'}`;
      } else if (item.content_type === 'document') {
        details += `
      Document Type: ${item.doc_type || 'General'}
      Reference: ${item.ref || 'N/A'}`;
      }
      
      details += `
      Description: ${item.description || 'No description available'}`;
      
      return details;
    }).join('\n') || 'No specific documents found.';

    const barryResponse = `Based on your query "${query}" for ${vehicleModel || 'your Unimog'}, I found the following information in the WIS system:

${contextInfo}

${searchResults?.length ? `
I've found ${searchResults.length} relevant document(s). Here's what I recommend:

${this.generateRecommendations(query, searchResults)}

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
  private static generateRecommendations(query: string, results: WISContent[]): string {
    const recommendations: string[] = [];
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
  static generateSearchSuggestions(query: string, vehicleModel?: string): string[] {
    const suggestions: string[] = [];
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
}

/**
 * Main API endpoint for Barry WIS integration
 */
export async function queryBarryWIS(
  query: string, 
  vehicleModel?: string,
  contentType?: 'procedures' | 'parts' | 'bulletins'
): Promise<BarryWISResponse> {
  
  try {
    // Search WIS content
    const searchResults = await BarryWISService.searchWISContent({
      query,
      vehicleModel,
      contentType
    });

    // Generate Barry's response
    const response = await BarryWISService.generateBarryResponse(
      query, 
      vehicleModel, 
      searchResults
    );

    // Generate suggestions for follow-up queries
    const suggestions = BarryWISService.generateSearchSuggestions(query, vehicleModel);

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
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Express/Netlify Functions compatible endpoint
 */
export async function POST(req: Request) {
  try {
    const { query, vehicleModel, contentType } = await req.json();

    if (!query?.trim()) {
      return Response.json({
        success: false,
        error: 'Query is required'
      }, { status: 400 });
    }

    const result = await queryBarryWIS(query, vehicleModel, contentType);
    
    return Response.json(result);

  } catch (error) {
    console.error('Barry WIS API error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}