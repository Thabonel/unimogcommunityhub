// Barry WIS Client - Handles communication with Barry AI API
// Location: /src/utils/barryWISClient.ts

interface BarryResponse {
  message: string;
  searchResults: any[];
  recommendations?: string[];
  safetyWarnings?: string[];
  relatedProcedures?: string[];
}

export class BarryWISClient {
  private static baseUrl = '/.netlify/functions/barry-wis';

  /**
   * Query Barry AI for WIS information
   * @param query - User's search query
   * @param vehicleModel - Selected vehicle model
   * @param contentType - Optional content type filter
   * @returns Barry's response with search results and recommendations
   */
  static async query(
    query: string,
    vehicleModel: string = 'U1700L',
    contentType?: string
  ): Promise<BarryResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          vehicleModel,
          contentType: contentType || 'all'
        })
      });

      if (!response.ok) {
        throw new Error(`Barry API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Barry WIS Client error:', error);
      
      // Return a fallback response
      return {
        message: "I'm having trouble accessing the WIS database right now. Please try again or use the direct search.",
        searchResults: [],
        recommendations: [
          "Try simplifying your search query",
          "Check your internet connection",
          "Use the category browser as an alternative"
        ]
      };
    }
  }

  /**
   * Get smart suggestions based on partial query
   * @param partialQuery - Partial search term
   * @returns Array of suggested searches
   */
  static async getSuggestions(partialQuery: string): Promise<string[]> {
    // This could be expanded to call a suggestions endpoint
    const commonSearches = [
      'portal hub seal replacement',
      'oil change procedure',
      'brake adjustment',
      'transmission fluid change',
      'air filter replacement',
      'clutch adjustment',
      'differential lock maintenance',
      'hydraulic pump service',
      'cooling system flush',
      'fuel filter replacement',
      'engine timing adjustment',
      'power steering service'
    ];

    return commonSearches.filter(search => 
      search.toLowerCase().includes(partialQuery.toLowerCase())
    ).slice(0, 5);
  }

  /**
   * Log user interaction for analytics
   * @param action - Type of action performed
   * @param details - Additional details about the action
   */
  static async logInteraction(action: string, details: any): Promise<void> {
    try {
      await fetch('/.netlify/functions/log-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          details,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log interaction:', error);
    }
  }
}