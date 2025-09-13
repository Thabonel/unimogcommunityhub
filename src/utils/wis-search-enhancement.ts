// src/utils/wis-search-enhancement.ts
// Search Enhancement System for Barry WIS Integration

export interface SearchTermMapping {
  userTerm: string;
  dbTerms: string[];
  category?: string;
  priority: number; // 1 = highest priority
}

export interface QueryAnalysis {
  originalQuery: string;
  extractedTerms: string[];
  suggestedCategories: string[];
  enhancedSearchTerms: string[];
  searchStrategies: SearchStrategy[];
}

export interface SearchStrategy {
  name: string;
  terms: string[];
  category?: string;
  priority: number;
}

/**
 * Comprehensive Multi-Model Unimog terminology mapping
 * Maps user language to actual database terminology across all Unimog models
 * Based on U435, U1300L, U1700L and other series data
 */
export const UNIMOG_TERMINOLOGY: SearchTermMapping[] = [
  // Portal Hub / Axle Components - All Models
  {
    userTerm: "portal hub",
    dbTerms: ["portal hub", "hub", "Portal hub assembly", "Hub Frame & Suspension", "Frame & Suspension"],
    category: "Chassis",
    priority: 1
  },
  {
    userTerm: "portal axle",
    dbTerms: ["portal axle", "Portal axle housing", "Hub Frame & Suspension", "Differential Frame & Suspension", "Frame & Suspension"],
    category: "Chassis", 
    priority: 1
  },
  {
    userTerm: "axle",
    dbTerms: ["axle", "Axle shaft", "Differential Frame & Suspension", "Hub Frame & Suspension", "Frame & Suspension"],
    category: "Chassis",
    priority: 1
  },
  {
    userTerm: "differential",
    dbTerms: ["differential", "Differential lock", "Differential Frame & Suspension"],
    category: "Chassis",
    priority: 1
  },

  // Seal Types - Comprehensive
  {
    userTerm: "hub seal",
    dbTerms: ["Portal hub seal", "seal", "Hub Frame & Suspension", "Portal hub upper seal", "Portal hub lower seal"],
    category: "Chassis",
    priority: 1
  },
  {
    userTerm: "portal hub seal",
    dbTerms: ["Portal hub seal", "Portal hub complete seal kit", "Portal hub upper seal", "Portal hub lower seal", "seal"],
    category: "Chassis",
    priority: 1
  },
  {
    userTerm: "axle seal", 
    dbTerms: ["Transfer case oil seal", "seal", "Differential Frame & Suspension"],
    category: "Chassis",
    priority: 1
  },
  {
    userTerm: "oil seal",
    dbTerms: ["Transfer case oil seal input", "Transfer case oil seal output", "oil seal", "seal"],
    category: "Engine",
    priority: 1
  },

  // Engine Components - Multi-Engine Support
  {
    userTerm: "OM352",
    dbTerms: ["OM352", "Engine gasket set OM352", "Oil filter OM352", "Piston set OM352"],
    category: "Engine",
    priority: 1
  },
  {
    userTerm: "OM366",
    dbTerms: ["OM366", "Engine gasket set OM366", "Oil filter OM366", "Turbocharger OM366LA"],
    category: "Engine",
    priority: 1
  },
  {
    userTerm: "OM314",
    dbTerms: ["OM314", "engine"],
    category: "Engine",
    priority: 1
  },
  {
    userTerm: "oil filter",
    dbTerms: ["Oil filter OM352", "Oil filter OM366", "filter"],
    category: "Engine",
    priority: 1
  },
  {
    userTerm: "turbocharger",
    dbTerms: ["Turbocharger OM352", "Turbocharger OM366LA", "turbo"],
    category: "Engine",
    priority: 1
  },
  {
    userTerm: "radiator",
    dbTerms: ["Radiator OM352", "Radiator OM366", "cooling"],
    category: "Engine",
    priority: 1
  },
  {
    userTerm: "water pump",
    dbTerms: ["Water pump OM366", "pump"],
    category: "Engine",
    priority: 1
  },

  // Transmission Systems
  {
    userTerm: "transmission",
    dbTerms: ["transmission", "Transmission", "Gear selector", "Transfer case"],
    category: "Transmission",
    priority: 1
  },
  {
    userTerm: "transfer case",
    dbTerms: ["Transfer case", "Transfer case bearing", "Transfer case housing", "Verteilergetriebe"],
    category: "Transmission",
    priority: 1
  },
  {
    userTerm: "clutch",
    dbTerms: ["Clutch disc", "Clutch pressure plate", "Clutch release bearing", "Clutch fork"],
    category: "Transmission",
    priority: 1
  },
  {
    userTerm: "clutch disc",
    dbTerms: ["Clutch disc 395mm", "Clutch disc 430mm", "clutch"],
    category: "Transmission",
    priority: 1
  },
  {
    userTerm: "synchro",
    dbTerms: ["Synchro ring", "Transfer case synchro ring", "synchronizer"],
    category: "Transmission",
    priority: 1
  },

  // Hydraulic System
  {
    userTerm: "hydraulic",
    dbTerms: ["hydraulic", "Hydraulic pump", "Hydraulic filter", "Hydraulic cylinder", "Main hydraulic pump"],
    category: "Hydraulic System",
    priority: 1
  },
  {
    userTerm: "hydraulic pump",
    dbTerms: ["Main hydraulic pump", "Hydraulic pump seal", "hydraulic"],
    category: "Hydraulic System",
    priority: 1
  },
  {
    userTerm: "hydraulic filter",
    dbTerms: ["Hydraulic filter element", "Hydraulic return filter", "filter"],
    category: "Hydraulic System",
    priority: 1
  },
  {
    userTerm: "hydraulic cylinder",
    dbTerms: ["Hydraulic cylinder tipping", "Hydraulic cylinder lifting", "Hydraulic cylinder steering", "cylinder"],
    category: "Hydraulic System",
    priority: 1
  },

  // Brake System
  {
    userTerm: "brake",
    dbTerms: ["brake", "Brake chamber", "Brake valve", "Air compressor"],
    category: "Brake System",
    priority: 1
  },
  {
    userTerm: "brake chamber",
    dbTerms: ["Brake chamber type 20", "Brake chamber type 24", "Brake chamber type 30"],
    category: "Brake System",
    priority: 1
  },
  {
    userTerm: "air compressor",
    dbTerms: ["Air compressor single cylinder", "Air compressor twin cylinder", "compressor"],
    category: "Brake System",
    priority: 1
  },

  // Electrical System
  {
    userTerm: "electrical",
    dbTerms: ["electrical", "Alternator", "Starter motor", "Glow plug", "wiring harness"],
    category: "Electrical",
    priority: 1
  },
  {
    userTerm: "alternator",
    dbTerms: ["Alternator 28V 55A", "Alternator 24V 80A", "Alternator 24V 100A"],
    category: "Electrical",
    priority: 1
  },
  {
    userTerm: "starter",
    dbTerms: ["Starter motor 24V", "Starter motor 12V"],
    category: "Electrical",
    priority: 1
  },
  {
    userTerm: "glow plug",
    dbTerms: ["Glow plug 24V", "Glow plug controller"],
    category: "Electrical",
    priority: 1
  },
  {
    userTerm: "wiring harness",
    dbTerms: ["Main wiring harness", "Engine wiring harness", "Cab wiring harness"],
    category: "Electrical",
    priority: 1
  },

  // Body Components
  {
    userTerm: "door",
    dbTerms: ["Door hinge", "Door lock mechanism", "Door handle"],
    category: "Body",
    priority: 1
  },
  {
    userTerm: "window",
    dbTerms: ["Window regulator", "Windshield wiper"],
    category: "Body",
    priority: 1
  },
  {
    userTerm: "mirror",
    dbTerms: ["Mirror assembly", "Mirror glass", "Mirror housing"],
    category: "Body",
    priority: 1
  },

  // General Maintenance Terms
  {
    userTerm: "inspection",
    dbTerms: ["inspection", "maintenance", "service"],
    category: "Maintenance",
    priority: 2
  },
  {
    userTerm: "oil change",
    dbTerms: ["oil", "Oil filter", "Engine oil", "Portal hub oil", "Differential oil"],
    category: "Maintenance",
    priority: 1
  },
  {
    userTerm: "filter replacement",
    dbTerms: ["filter", "Oil filter", "Hydraulic filter", "Air filter"],
    category: "Maintenance",
    priority: 1
  },
  {
    userTerm: "seal replacement",
    dbTerms: ["seal", "Portal hub seal", "Transfer case oil seal", "gasket"],
    category: "Maintenance",
    priority: 1
  },

  // German Technical Terms
  {
    userTerm: "portalachse",
    dbTerms: ["portal axle", "Portal axle housing", "Hub Frame & Suspension"],
    category: "Chassis",
    priority: 1
  },
  {
    userTerm: "verteilergetriebe",
    dbTerms: ["Transfer case", "transfer case"],
    category: "Transmission",
    priority: 1
  }
];

/**
 * Analyze user query and extract meaningful search terms
 */
export function analyzeQuery(query: string): QueryAnalysis {
  const originalQuery = query.toLowerCase().trim();
  const words = originalQuery.split(/\s+/);
  
  // Find matching terminology
  const matchedMappings: SearchTermMapping[] = [];
  const extractedTerms: string[] = [];
  const suggestedCategories: string[] = [];
  
  // Check for exact phrase matches first
  for (const mapping of UNIMOG_TERMINOLOGY) {
    if (originalQuery.includes(mapping.userTerm.toLowerCase())) {
      matchedMappings.push(mapping);
      extractedTerms.push(...mapping.dbTerms);
      if (mapping.category && !suggestedCategories.includes(mapping.category)) {
        suggestedCategories.push(mapping.category);
      }
    }
  }
  
  // If no exact matches, check individual words
  if (matchedMappings.length === 0) {
    for (const word of words) {
      if (word.length < 3) continue; // Skip very short words
      
      for (const mapping of UNIMOG_TERMINOLOGY) {
        if (mapping.userTerm.toLowerCase().includes(word) || 
            mapping.dbTerms.some(term => term.toLowerCase().includes(word))) {
          if (!matchedMappings.find(m => m.userTerm === mapping.userTerm)) {
            matchedMappings.push(mapping);
            extractedTerms.push(...mapping.dbTerms);
            if (mapping.category && !suggestedCategories.includes(mapping.category)) {
              suggestedCategories.push(mapping.category);
            }
          }
        }
      }
    }
  }
  
  // Create search strategies
  const searchStrategies: SearchStrategy[] = [];
  
  // Strategy 1: Exact enhanced terms
  if (extractedTerms.length > 0) {
    searchStrategies.push({
      name: "Enhanced Terms",
      terms: [...new Set(extractedTerms)], // Remove duplicates
      priority: 1
    });
  }
  
  // Strategy 2: Category-based search
  for (const category of suggestedCategories) {
    searchStrategies.push({
      name: `Category: ${category}`,
      terms: [category],
      category,
      priority: 2
    });
  }
  
  // Strategy 3: Original query fallback
  searchStrategies.push({
    name: "Original Query",
    terms: words.filter(word => word.length >= 3),
    priority: 3
  });
  
  // Sort strategies by priority
  searchStrategies.sort((a, b) => a.priority - b.priority);
  
  return {
    originalQuery,
    extractedTerms: [...new Set(extractedTerms)],
    suggestedCategories,
    enhancedSearchTerms: [...new Set(extractedTerms)],
    searchStrategies
  };
}

/**
 * Generate search suggestions for user
 */
export function generateSearchSuggestions(query: string): string[] {
  const analysis = analyzeQuery(query);
  const suggestions: string[] = [];
  
  // Add category-specific suggestions
  for (const category of analysis.suggestedCategories) {
    switch (category) {
      case 'Chassis':
        suggestions.push('hub maintenance procedure');
        suggestions.push('differential service steps');
        suggestions.push('suspension component replacement');
        break;
      case 'Engine':
        suggestions.push('OM352 maintenance schedule');
        suggestions.push('engine component replacement');
        suggestions.push('oil and filter service');
        break;
      case 'Hydraulic System':
        suggestions.push('hydraulic fluid replacement');
        suggestions.push('hydraulic system bleeding');
        break;
      case 'Transmission':
        suggestions.push('transmission fluid change');
        suggestions.push('clutch adjustment');
        break;
    }
  }
  
  // Add generic suggestions if no specific category found
  if (suggestions.length === 0) {
    suggestions.push('engine maintenance procedure');
    suggestions.push('chassis component service');
    suggestions.push('hydraulic system maintenance');
  }
  
  return suggestions.slice(0, 3); // Return top 3 suggestions
}

/**
 * Enhanced search query builder
 */
export function buildEnhancedSearchQuery(analysis: QueryAnalysis): string[] {
  const queries: string[] = [];
  
  // Build queries for each strategy
  for (const strategy of analysis.searchStrategies) {
    if (strategy.terms.length > 0) {
      queries.push(strategy.terms.join(' '));
    }
  }
  
  return queries;
}