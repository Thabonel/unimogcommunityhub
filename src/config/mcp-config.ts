// src/config/mcp-config.ts
export const mcpConfig = {
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    // Note: Service role key should be in server-side environment only
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    // These are the resources Barry can access
    resources: {
      tables: [
        'wis_procedures',
        'wis_parts',
        'wis_bulletins',
        'wis_documents_unified',
        'wis_sessions', 
        'wis_servers',
        'manual_chunks' // For existing Barry knowledge base integration
      ],
      buckets: ['wis-manuals', 'manuals'],
      functions: [
        'search_wis_content',
        'search_wis_content_vector',
        'get_relevant_manual_chunks' // Existing Barry function
      ]
    }
  },
  anthropic: {
    apiKey: process.env.VITE_OPENAI_API_KEY, // Using existing OpenAI key for now
    model: "claude-3-5-sonnet-20241022"
  },
  barry: {
    systemPrompt: `You are Barry, the AI Mechanic for the Unimog Community Hub. You have direct access to the Mercedes-Benz Workshop Information System (WIS) database through MCP.

Available Resources:
- wis_content table: Contains workshop procedures, parts catalogs, and service bulletins
- wis-manuals bucket: Contains HTML manuals, PDFs, and images
- manual_chunks table: Processed manual content for semantic search
- Vector search functions for finding relevant content

Your role:
1. Help users find specific repair procedures, parts information, and technical bulletins
2. Provide step-by-step guidance based on official Mercedes documentation
3. Suggest related procedures and safety considerations
4. Always cite specific document references and part numbers when available

Response format:
- Be conversational but professional
- Always provide specific document references
- Include part numbers and torque specifications when relevant
- Suggest related procedures that might be helpful
- Prioritize safety information and warnings`,

    // WIS-specific instructions
    wisInstructions: `When searching WIS content:
1. Use vehicle model to filter results when provided
2. Prioritize exact matches over semantic similarity
3. Include multiple content types (procedures, parts, bulletins) in responses
4. Always mention document IDs and reference numbers
5. Suggest related maintenance items and safety precautions`
  }
};

// Type definitions for MCP resources
export interface WISContent {
  id: string;
  title: string;
  content_type: 'procedure' | 'part' | 'bulletin' | 'document';
  category?: string;
  description?: string;
  content?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  
  // Procedure-specific fields
  procedure_code?: string;
  difficulty_level?: number;
  estimated_time_minutes?: number;
  tools_required?: string[];
  parts_required?: string[];
  safety_warnings?: string[];
  steps?: any;
  
  // Parts-specific fields
  part_number?: string;
  part_name?: string;
  price_estimate?: number;
  availability_status?: string;
  superseded_by?: string;
  
  // Document-specific fields
  doc_id?: string;
  doc_type?: string;
  ref?: string;
}

export interface WISSearchParams {
  query: string;
  vehicleModel?: string;
  contentType?: 'procedures' | 'parts' | 'bulletins';
  limit?: number;
}

export interface BarryWISResponse {
  success: boolean;
  response?: string;
  context?: {
    query: string;
    results: WISContent[];
    suggestions: string[];
  };
  error?: string;
}