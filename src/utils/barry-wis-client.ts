// src/utils/barry-wis-client.ts
import { BarryWISResponse } from '@/config/mcp-config';
import { supabase } from '@/lib/supabase-client';

/**
 * Client-side utility for calling Barry WIS API with localhost fallback
 */
export class BarryWISClient {
  private static readonly API_ENDPOINT = '/.netlify/functions/barry-wis';

  /**
   * Check if we're running on localhost
   */
  private static isLocalhost(): boolean {
    return window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.port === '5173';
  }

  /**
   * Localhost fallback - simulate Barry AI using direct database search
   */
  private static async localhostFallback(
    query: string,
    vehicleModel?: string,
    contentType?: 'procedures' | 'parts' | 'bulletins'
  ): Promise<BarryWISResponse> {
    console.log('🔧 Using localhost database fallback for:', query);

    try {
      const searchTerm = `%${query.toLowerCase()}%`;
      const results: any[] = [];

      // Search procedures
      if (!contentType || contentType === 'procedures') {
        const { data: procedures } = await supabase
          .from('wis_procedures')
          .select('id, title, description, category, procedure_code, estimated_time_minutes, difficulty_level')
          .or(`title.ilike.${searchTerm},description.ilike.${searchTerm},category.ilike.${searchTerm}`)
          .limit(5);

        if (procedures) {
          results.push(...procedures.map(p => ({
            ...p,
            content_type: 'manual' as const,
            source: 'procedures'
          })));
        }
      }

      // Search parts
      if (!contentType || contentType === 'parts') {
        const { data: parts } = await supabase
          .from('wis_parts')
          .select('id, part_number, part_name as title, description, category, availability_status')
          .or(`part_name.ilike.${searchTerm},description.ilike.${searchTerm},part_number.ilike.${searchTerm}`)
          .limit(5);

        if (parts) {
          results.push(...parts.map(p => ({
            ...p,
            content_type: 'parts' as const,
            source: 'parts'
          })));
        }
      }

      // Search bulletins
      if (!contentType || contentType === 'bulletins') {
        const { data: bulletins } = await supabase
          .from('wis_bulletins')
          .select('id, title, content as description')
          .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
          .limit(3);

        if (bulletins) {
          results.push(...bulletins.map(b => ({
            ...b,
            content_type: 'bulletin' as const,
            source: 'bulletins'
          })));
        }
      }

      // Generate a Barry-like response
      const foundCount = results.length;
      const response = foundCount > 0
        ? `I found ${foundCount} results for "${query}" in the WIS database. Here's what I discovered:

${results.slice(0, 3).map((r, i) =>
  `${i + 1}. **${r.title}** (${r.content_type}): ${r.description?.slice(0, 100)}...`
).join('\n')}

${foundCount > 3 ? `\nAnd ${foundCount - 3} more results...` : ''}

💡 **Note**: This is a localhost simulation of Barry AI using direct database search.`
        : `I couldn't find specific results for "${query}" in the local WIS database.

Try these suggestions:
• Use simpler terms like "seal", "hub", "brake"
• Check the category browser below
• Try searching for part numbers

💡 **Note**: This is localhost mode - full Barry AI is available on the live site.`;

      return {
        success: true,
        response,
        context: {
          results,
          suggestions: foundCount === 0 ? [
            'portal seal',
            'hub maintenance',
            'wheel bearing',
            'axle service',
            'differential'
          ] : [],
          totalResults: foundCount,
          searchStrategy: 'localhost_database_fallback'
        }
      };

    } catch (error) {
      console.error('Localhost fallback error:', error);
      return {
        success: false,
        error: `Database search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Query Barry for WIS assistance
   */
  static async query(
    query: string,
    vehicleModel?: string,
    contentType?: 'procedures' | 'parts' | 'bulletins'
  ): Promise<BarryWISResponse> {

    // Use localhost fallback when developing locally
    if (this.isLocalhost()) {
      return this.localhostFallback(query, vehicleModel, contentType);
    }

    // Production Barry AI call
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          vehicleModel,
          contentType
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Barry WIS client error:', error);

      // Fallback to database search if Barry AI fails
      console.log('🔄 Falling back to database search...');
      return this.localhostFallback(query, vehicleModel, contentType);
    }
  }

  /**
   * Test the connection to Barry WIS API
   */
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.query('test connection', 'U1700L', 'procedures');
      
      if (result.success) {
        return {
          success: true,
          message: 'Barry WIS connection successful'
        };
      } else {
        return {
          success: false,
          message: result.error || 'Connection test failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Format Barry's response for display in the UI
   */
  static formatResponse(response: BarryWISResponse) {
    if (!response.success) {
      return {
        title: 'Sorry, I encountered an error',
        content: response.error || 'Unknown error occurred',
        suggestions: ['Try rephrasing your question', 'Check your internet connection'],
        results: []
      };
    }

    return {
      title: 'Here\'s what I found in the WIS system:',
      content: response.response || 'No response available',
      suggestions: response.context?.suggestions || [],
      results: response.context?.results || []
    };
  }
}

/**
 * React hook for Barry WIS integration
 */
export function useBarryWIS() {
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<BarryWISResponse | null>(null);

  const queryBarry = async (
    query: string, 
    vehicleModel?: string, 
    contentType?: 'procedures' | 'parts' | 'bulletins'
  ) => {
    if (!query.trim()) return;

    setLoading(true);
    setLastQuery(query);

    try {
      const response = await BarryWISClient.query(query, vehicleModel, contentType);
      setLastResponse(response);
      return response;
    } catch (error) {
      const errorResponse: BarryWISResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await BarryWISClient.testConnection();
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    queryBarry,
    testConnection,
    loading,
    lastQuery,
    lastResponse,
    formatResponse: BarryWISClient.formatResponse
  };
}

// Add React import for the hook
import { useState } from 'react';