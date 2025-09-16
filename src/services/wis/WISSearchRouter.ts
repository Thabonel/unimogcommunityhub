import { ClaudeService } from '@/services/claude/claudeService';
import { BarryWISClient } from '@/utils/barry-wis-client';
import { supabase } from '@/lib/supabase-client';

export interface WISSearchContext {
  query: string;
  vehicleModel?: string;
  contentType?: 'procedures' | 'parts' | 'bulletins';
  searchMethod?: 'auto' | 'ai_only' | 'database_only' | 'hybrid';
}

export interface WISSearchResult {
  source: 'claude_ai' | 'barry_wis' | 'database' | 'hybrid';
  response?: string;
  items: any[];
  metadata: {
    searchTime: number;
    resultCount: number;
    confidence: number;
    deduplicationApplied: boolean;
  };
}

export class WISSearchRouter {
  private claudeService: ClaudeService;
  private searchCache = new Map<string, WISSearchResult>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.claudeService = new ClaudeService();
  }

  /**
   * Intelligent search router that prevents duplicate responses
   * and chooses the best search method based on query analysis
   */
  async search(context: WISSearchContext): Promise<WISSearchResult> {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(context);

    // Check cache first
    const cached = this.searchCache.get(cacheKey);
    if (cached && (Date.now() - startTime) < this.CACHE_TTL) {
      return cached;
    }

    try {
      // Analyze query to determine best search method
      const searchMethod = context.searchMethod || this.analyzeQueryType(context.query);

      let result: WISSearchResult;

      switch (searchMethod) {
        case 'ai_only':
          result = await this.searchWithClaudeOnly(context);
          break;
        case 'database_only':
          result = await this.searchDatabaseOnly(context);
          break;
        case 'hybrid':
          result = await this.searchHybrid(context);
          break;
        default:
          result = await this.searchAuto(context);
      }

      // Add timing metadata
      result.metadata.searchTime = Date.now() - startTime;

      // Cache result
      this.searchCache.set(cacheKey, result);

      return result;

    } catch (error) {
      console.error('WIS Search Router error:', error);
      return {
        source: 'claude_ai',
        response: 'I encountered an issue processing your request. Please try rephrasing your question or contact support if the problem persists.',
        items: [],
        metadata: {
          searchTime: Date.now() - startTime,
          resultCount: 0,
          confidence: 0,
          deduplicationApplied: false
        }
      };
    }
  }

  /**
   * Analyze query to determine optimal search method
   */
  private analyzeQueryType(query: string): 'ai_only' | 'database_only' | 'hybrid' {
    const lowerQuery = query.toLowerCase();

    // AI-only queries (conversational, troubleshooting, explanations)
    const aiOnlyPatterns = [
      'how do i', 'what should i', 'explain', 'why does', 'help me',
      'troubleshoot', 'problem with', 'common issues', 'best practice'
    ];

    // Database-only queries (specific part numbers, procedure codes)
    const databaseOnlyPatterns = [
      /\b[A-Z0-9]{6,}\b/, // Part numbers
      /\bWI\d+\b/i,       // Procedure codes
      /\bOM\d+\b/i,       // Engine codes
      'part number', 'procedure code', 'manual section'
    ];

    // Check for database-only patterns first (most specific)
    for (const pattern of databaseOnlyPatterns) {
      if (typeof pattern === 'string' && lowerQuery.includes(pattern)) {
        return 'database_only';
      } else if (pattern instanceof RegExp && pattern.test(query)) {
        return 'database_only';
      }
    }

    // Check for AI-only patterns
    for (const pattern of aiOnlyPatterns) {
      if (lowerQuery.includes(pattern)) {
        return 'ai_only';
      }
    }

    // Default to hybrid for balanced queries
    return 'hybrid';
  }

  /**
   * Claude AI only search - for conversational queries
   */
  private async searchWithClaudeOnly(context: WISSearchContext): Promise<WISSearchResult> {
    const contextualQuery = this.buildContextualQuery(context);
    const response = await this.claudeService.sendMessage(contextualQuery);

    return {
      source: 'claude_ai',
      response,
      items: [],
      metadata: {
        searchTime: 0,
        resultCount: 0,
        confidence: 0.9,
        deduplicationApplied: false
      }
    };
  }

  /**
   * Database only search - for specific technical lookups
   */
  private async searchDatabaseOnly(context: WISSearchContext): Promise<WISSearchResult> {
    // Use the semantic search function for better results
    const { data, error } = await supabase.rpc('wis_semantic_search', {
      search_query: context.query,
      vehicle_model: context.vehicleModel || 'U1700L',
      content_type: context.contentType,
      max_results: 10
    });

    if (error) {
      console.warn('Semantic search failed, falling back to basic search:', error);

      // Fallback to basic search
      const { data: fallbackData, error: fallbackError } = await supabase.rpc('wis_search', {
        search_query: context.query,
        limit_results: 10
      });

      if (fallbackError) throw fallbackError;

      return {
        source: 'database',
        items: fallbackData || [],
        metadata: {
          searchTime: 0,
          resultCount: fallbackData?.length || 0,
          confidence: 0.6, // Lower confidence for fallback
          deduplicationApplied: false
        }
      };
    }

    return {
      source: 'database',
      items: data || [],
      metadata: {
        searchTime: 0,
        resultCount: data?.length || 0,
        confidence: 0.8,
        deduplicationApplied: false
      }
    };
  }

  /**
   * Hybrid search - combines AI interpretation with database results
   */
  private async searchHybrid(context: WISSearchContext): Promise<WISSearchResult> {
    // Get database results first
    const dbResult = await this.searchDatabaseOnly(context);

    // If we have good database results, enhance with AI interpretation
    if (dbResult.items.length > 0) {
      const contextualQuery = this.buildHybridQuery(context, dbResult.items);
      const aiResponse = await this.claudeService.sendMessage(contextualQuery);

      return {
        source: 'hybrid',
        response: aiResponse,
        items: dbResult.items,
        metadata: {
          searchTime: 0,
          resultCount: dbResult.items.length,
          confidence: 0.95,
          deduplicationApplied: true
        }
      };
    }

    // Fallback to AI-only if no database results
    return this.searchWithClaudeOnly(context);
  }

  /**
   * Auto search - intelligently chooses best method
   */
  private async searchAuto(context: WISSearchContext): Promise<WISSearchResult> {
    const method = this.analyzeQueryType(context.query);

    switch (method) {
      case 'ai_only':
        return this.searchWithClaudeOnly(context);
      case 'database_only':
        return this.searchDatabaseOnly(context);
      default:
        return this.searchHybrid(context);
    }
  }

  /**
   * Build contextual query for Claude with WIS system context
   */
  private buildContextualQuery(context: WISSearchContext): string {
    let query = `You are Barry, the AI Mechanic assistant for the Unimog Community Hub's Workshop Information System (WIS). You have access to comprehensive technical manuals, procedures, parts catalogs, and service bulletins for Unimog vehicles.

Context:
- User vehicle: ${context.vehicleModel || 'Unimog (model unspecified)'}
- Focus area: ${context.contentType || 'general technical assistance'}
- Available content: Service procedures, parts catalogs, technical bulletins, repair instructions, maintenance schedules, and diagnostic guides

User question: ${context.query}

Please provide a comprehensive technical response that:
1. Addresses the specific question with professional expertise
2. References relevant WIS procedures or parts when applicable
3. Includes safety considerations and best practices
4. Suggests related maintenance or inspection items
5. Uses clear, step-by-step instructions when appropriate

Remember: You are assisting with Unimog maintenance and repair, drawing from extensive workshop manuals and technical documentation.`;

    return query;
  }

  /**
   * Build hybrid query that includes database context
   */
  private buildHybridQuery(context: WISSearchContext, dbItems: any[]): string {
    const itemSummary = dbItems.slice(0, 5).map((item, index) => {
      const itemTitle = item.title || item.name || `Item ${index + 1}`;
      const itemCode = item.code || item.number || item.procedure_code || item.part_number || '';
      const itemDesc = item.description || item.content_summary || 'No description available';
      const itemCategory = item.category || item.doc_type || '';

      return `${index + 1}. ${itemTitle} ${itemCode ? `(${itemCode})` : ''}
   Category: ${itemCategory}
   Description: ${itemDesc.substring(0, 200)}${itemDesc.length > 200 ? '...' : ''}`;
    }).join('\n\n');

    return `You are Barry, the AI Mechanic assistant for the Unimog Community Hub's Workshop Information System (WIS). I found relevant technical information in our database for the user's question.

User Context:
- Vehicle: ${context.vehicleModel || 'Unimog (model unspecified)'}
- Focus area: ${context.contentType || 'general technical assistance'}
- Question: "${context.query}"

Relevant WIS Database Results:
${itemSummary}

Please provide a comprehensive technical response that:
1. Synthesizes the database information with your mechanical expertise
2. Addresses the user's specific question directly
3. References the relevant procedures/parts by their codes when applicable
4. Includes safety warnings and best practices
5. Provides step-by-step guidance when appropriate
6. Suggests related maintenance items or inspection points
7. Uses professional but approachable language

Remember: You have access to these specific WIS entries, so reference them confidently in your response to provide the most accurate and helpful technical guidance.`;
  }

  /**
   * Generate cache key for search results
   */
  private getCacheKey(context: WISSearchContext): string {
    return `${context.query}|${context.vehicleModel}|${context.contentType}|${context.searchMethod}`;
  }

  /**
   * Clear search cache
   */
  clearCache(): void {
    this.searchCache.clear();
  }
}