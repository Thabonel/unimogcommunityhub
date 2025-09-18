// Barry Mini-WIS Integration Template
// File: /src/services/barry/barryWISBridge.ts

import { wisDataService } from '@/services/wis/wisDataService';
import type { WISProcedure } from '@/stores/wisStore';

export interface BarryWISAnalysis {
  complexity: 'simple' | 'complex';
  queryType: 'specification' | 'part_lookup' | 'procedure' | 'safety' | 'general';
  extractedData: {
    specifications?: Record<string, string>;
    partNumbers?: string[];
    torqueValues?: Record<string, string>;
    fluidCapacities?: Record<string, string>;
    safetyWarnings?: string[];
    procedureKeywords?: string[];
  };
  wisRecommendation?: {
    shouldHandoff: boolean;
    reason: string;
    suggestedProcedures?: string[];
    estimatedComplexity: 1 | 2 | 3 | 4 | 5; // 1=simple, 5=very complex
  };
}

export interface MiniWISCard {
  id: string;
  type: 'quick-info' | 'wis-handoff' | 'parts-reference' | 'tools-required' | 'safety-warning';
  title: string;
  data: any;
  priority: 'high' | 'medium' | 'low';
  color: 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'gray';
}

export class BarryWISBridge {
  private static instance: BarryWISBridge;

  public static getInstance(): BarryWISBridge {
    if (!BarryWISBridge.instance) {
      BarryWISBridge.instance = new BarryWISBridge();
    }
    return BarryWISBridge.instance;
  }

  /**
   * Analyze Barry's response for WIS integration opportunities
   */
  analyzeResponse(barryResponse: string, userQuery: string): BarryWISAnalysis {
    const analysis: BarryWISAnalysis = {
      complexity: this.determineComplexity(barryResponse, userQuery),
      queryType: this.categorizeQuery(userQuery),
      extractedData: this.extractTechnicalData(barryResponse),
      wisRecommendation: this.generateWISRecommendation(barryResponse, userQuery)
    };

    return analysis;
  }

  /**
   * Generate appropriate Mini-WIS cards based on analysis
   */
  generateMiniWISCards(analysis: BarryWISAnalysis): MiniWISCard[] {
    const cards: MiniWISCard[] = [];

    // Generate cards based on extracted data and analysis
    if (analysis.extractedData.specifications) {
      cards.push(this.createQuickInfoCard(analysis.extractedData.specifications));
    }

    if (analysis.extractedData.partNumbers?.length > 0) {
      cards.push(this.createPartsReferenceCard(analysis.extractedData.partNumbers));
    }

    if (analysis.wisRecommendation?.shouldHandoff) {
      cards.push(this.createWISHandoffCard(analysis.wisRecommendation));
    }

    if (analysis.extractedData.safetyWarnings?.length > 0) {
      cards.push(this.createSafetyWarningCard(analysis.extractedData.safetyWarnings));
    }

    return cards.sort((a, b) => this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority));
  }

  /**
   * Handle handoff to full WIS interface
   */
  async handoffToWIS(procedureId: string, context?: any): Promise<void> {
    const isMobile = window.innerWidth < 768;
    const wisUrl = `/knowledge/wis-system?procedure=${procedureId}`;

    if (context) {
      // Store context for WIS to pick up
      sessionStorage.setItem('barryWISContext', JSON.stringify(context));
    }

    if (isMobile) {
      // Navigate in same app on mobile
      window.location.href = wisUrl;
    } else {
      // Open in new tab on desktop
      window.open(wisUrl, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Determine if query is simple or complex
   */
  private determineComplexity(response: string, query: string): 'simple' | 'complex' {
    const complexityIndicators = [
      'step', 'procedure', 'service', 'replace', 'rebuild', 'adjust',
      'remove', 'install', 'disassemble', 'maintenance', 'repair'
    ];

    const simpleIndicators = [
      'capacity', 'specification', 'torque', 'part number', 'price',
      'weight', 'dimension', 'temperature', 'pressure'
    ];

    const queryLower = query.toLowerCase();
    const responseLower = response.toLowerCase();

    const complexMatches = complexityIndicators.filter(indicator =>
      queryLower.includes(indicator) || responseLower.includes(indicator)
    ).length;

    const simpleMatches = simpleIndicators.filter(indicator =>
      queryLower.includes(indicator) || responseLower.includes(indicator)
    ).length;

    return complexMatches > simpleMatches ? 'complex' : 'simple';
  }

  /**
   * Categorize the type of query
   */
  private categorizeQuery(query: string): BarryWISAnalysis['queryType'] {
    const queryLower = query.toLowerCase();

    if (/capacity|spec|torque|pressure|temperature/.test(queryLower)) {
      return 'specification';
    }
    if (/part number|part|component|A\d{10}/.test(queryLower)) {
      return 'part_lookup';
    }
    if (/how|service|replace|repair|fix|procedure/.test(queryLower)) {
      return 'procedure';
    }
    if (/safety|warning|danger|caution/.test(queryLower)) {
      return 'safety';
    }
    return 'general';
  }

  /**
   * Extract technical data from Barry's response
   */
  private extractTechnicalData(response: string): BarryWISAnalysis['extractedData'] {
    const data: BarryWISAnalysis['extractedData'] = {};

    // Extract specifications (patterns like "14 liters", "380 Nm", etc.)
    const specMatches = response.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z][a-zA-Z0-9]*)/g);
    if (specMatches) {
      data.specifications = {};
      specMatches.forEach(match => {
        const [, value, unit] = match.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z][a-zA-Z0-9]*)/) || [];
        if (value && unit) {
          data.specifications![unit] = value;
        }
      });
    }

    // Extract Mercedes part numbers (pattern: A followed by 10 digits)
    const partMatches = response.match(/A\s?\d{3}\s?\d{3}\s?\d{4}/g);
    if (partMatches) {
      data.partNumbers = partMatches.map(part => part.replace(/\s/g, ''));
    }

    // Extract torque specifications
    const torqueMatches = response.match(/(\d+(?:\.\d+)?)\s*Nm/gi);
    if (torqueMatches) {
      data.torqueValues = {};
      torqueMatches.forEach((match, index) => {
        const value = match.match(/(\d+(?:\.\d+)?)/)?.[1];
        if (value) {
          data.torqueValues![`torque_${index + 1}`] = `${value} Nm`;
        }
      });
    }

    // Extract fluid capacities
    const fluidMatches = response.match(/(\d+(?:\.\d+)?)\s*(?:liters?|L|quarts?|qt)/gi);
    if (fluidMatches) {
      data.fluidCapacities = {};
      fluidMatches.forEach((match, index) => {
        data.fluidCapacities![`fluid_${index + 1}`] = match;
      });
    }

    return data;
  }

  /**
   * Generate WIS recommendation based on analysis
   */
  private generateWISRecommendation(response: string, query: string): BarryWISAnalysis['wisRecommendation'] {
    const complexity = this.determineComplexity(response, query);

    if (complexity === 'complex') {
      return {
        shouldHandoff: true,
        reason: 'This requires step-by-step procedural guidance',
        estimatedComplexity: this.estimateComplexity(response, query)
      };
    }

    return {
      shouldHandoff: false,
      reason: 'Simple query can be handled directly',
      estimatedComplexity: 1
    };
  }

  /**
   * Estimate complexity on 1-5 scale
   */
  private estimateComplexity(response: string, query: string): 1 | 2 | 3 | 4 | 5 {
    const complexWords = [
      'disassemble', 'rebuild', 'overhaul', 'timing', 'alignment',
      'special tool', 'press', 'hydraulic', 'precision'
    ];

    const matches = complexWords.filter(word =>
      response.toLowerCase().includes(word) || query.toLowerCase().includes(word)
    ).length;

    if (matches >= 4) return 5;
    if (matches >= 3) return 4;
    if (matches >= 2) return 3;
    if (matches >= 1) return 2;
    return 1;
  }

  /**
   * Create quick info card for specifications
   */
  private createQuickInfoCard(specifications: Record<string, string>): MiniWISCard {
    return {
      id: `quick-info-${Date.now()}`,
      type: 'quick-info',
      title: 'Technical Specifications',
      data: specifications,
      priority: 'high',
      color: 'blue'
    };
  }

  /**
   * Create parts reference card
   */
  private createPartsReferenceCard(partNumbers: string[]): MiniWISCard {
    return {
      id: `parts-ref-${Date.now()}`,
      type: 'parts-reference',
      title: 'Required Parts',
      data: { partNumbers },
      priority: 'high',
      color: 'purple'
    };
  }

  /**
   * Create WIS handoff card
   */
  private createWISHandoffCard(recommendation: NonNullable<BarryWISAnalysis['wisRecommendation']>): MiniWISCard {
    return {
      id: `wis-handoff-${Date.now()}`,
      type: 'wis-handoff',
      title: 'Complex Procedure',
      data: recommendation,
      priority: 'high',
      color: 'orange'
    };
  }

  /**
   * Create safety warning card
   */
  private createSafetyWarningCard(warnings: string[]): MiniWISCard {
    return {
      id: `safety-${Date.now()}`,
      type: 'safety-warning',
      title: 'Safety Notice',
      data: { warnings },
      priority: 'high',
      color: 'red'
    };
  }

  /**
   * Get numeric value for priority sorting
   */
  private getPriorityValue(priority: 'high' | 'medium' | 'low'): number {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
    }
  }
}

// Export singleton instance
export const barryWISBridge = BarryWISBridge.getInstance();