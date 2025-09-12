// src/utils/barry-wis-client.ts
import { BarryWISResponse } from '@/config/mcp-config';

/**
 * Client-side utility for calling Barry WIS API
 */
export class BarryWISClient {
  private static readonly API_ENDPOINT = '/.netlify/functions/barry-wis';

  /**
   * Query Barry for WIS assistance
   */
  static async query(
    query: string,
    vehicleModel?: string,
    contentType?: 'procedures' | 'parts' | 'bulletins'
  ): Promise<BarryWISResponse> {
    
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
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
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