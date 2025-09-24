import { supabase } from '@/lib/supabase-client';

// Barry's personality and knowledge base
const BARRY_SYSTEM_PROMPT = `You are Barry, an expert AI mechanic specializing in Unimog vehicles. You have decades of experience working on all Unimog models and are passionate about helping owners maintain and repair their vehicles.

Your personality:
- Friendly, patient, and encouraging
- Professional but approachable
- You love sharing your knowledge
- You speak clearly and avoid unnecessary jargon
- You're enthusiastic about Unimogs and their capabilities

Your expertise includes:
- Engine maintenance and repair for all Unimog models
- Transmission service procedures (manual and automatic)
- Portal axle maintenance and seal replacement
- Hydraulic system repairs and troubleshooting
- Electrical system diagnostics
- Suspension and steering adjustments
- Off-road preparation and modifications
- Preventive maintenance schedules
- Tool recommendations for Unimog work
- Common issues and solutions for different models

When answering questions:
1. Always greet users warmly
2. Provide step-by-step instructions when appropriate
3. Mention safety precautions when relevant
4. Suggest proper tools for the job
5. Include torque specifications and fluid capacities when known
6. Offer tips from your experience
7. Ask clarifying questions if needed (model, year, symptoms)

Remember: You're here to help Unimog enthusiasts keep their vehicles in top condition for both work and adventure!`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  images?: ImageReference[];
  tables?: TableReference[];
}

export interface ImageReference {
  id: string;
  url: string;
  description: string;
  type: 'diagram' | 'photo' | 'schematic' | 'parts-view' | 'table' | 'chart';
  pageNumber: number;
  relevance: number; // 0-1 confidence score
}

export interface TableReference {
  id: string;
  type: string;
  pageNumber: number;
  description: string;
  rows: any[][];
  relevance: number; // 0-1 confidence score
  manualTitle?: string;
}

export class GeminiService {
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    // No client-side API key initialization needed
    // All API calls go through the secure Edge Function
  }

  /**
   * Search for relevant images based on query text
   */
  async searchRelevantImages(query: string, manualName?: string): Promise<ImageReference[]> {
    try {
      const { data, error } = await supabase
        .from('manual_images')
        .select('*')
        .or(`description.ilike.%${query}%,related_text_chunks.cs.{${query}}`)
        .eq('manual_name', manualName || '435.0.pdf')
        .order('page_number')
        .limit(5);

      if (error) throw error;

      return (data || []).map(img => ({
        id: img.id,
        url: img.image_url,
        description: img.description,
        type: img.image_type,
        pageNumber: img.page_number,
        relevance: 0.8 // Default relevance score
      }));
    } catch (error) {
      console.error('Error searching images:', error);
      return [];
    }
  }

  /**
   * Search for relevant tables based on query text
   */
  async searchRelevantTables(query: string, manualName?: string): Promise<TableReference[]> {
    try {
      const { data, error } = await supabase
        .from('manual_tables')
        .select(`
          *,
          manual_chunks!inner(
            manual_title,
            page_number
          )
        `)
        .eq('manual_chunks.manual_id', '406397b8-3fe4-4e9a-8dd5-f9677c61a3ae')
        .order('manual_chunks(page_number)')
        .limit(3);

      if (error) throw error;

      return (data || []).map(table => ({
        id: table.id,
        type: table.table_type || 'specification',
        pageNumber: table.manual_chunks?.page_number || 0,
        description: `Table from page ${table.manual_chunks?.page_number || 'unknown'}`,
        rows: Array.isArray(table.rows_data) ? table.rows_data : [],
        relevance: 0.7,
        manualTitle: table.manual_chunks?.manual_title || 'U1700L-U435'
      }));

    } catch (error) {
      console.error('Error searching tables:', error);
      return [];
    }
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return "Please log in to chat with Barry.";
      }

      // Search for relevant images and tables based on the message
      const relevantImages = await this.searchRelevantImages(message);
      const relevantTables = await this.searchRelevantTables(message);

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Keep conversation history manageable (last 20 messages)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      // Call the Gemini-powered Edge Function
      const { data, error } = await supabase.functions.invoke('chat-with-barry', {
        body: {
          messages: this.conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          includeLocation: true, // Enable weather and location context
          availableImages: relevantImages, // Include relevant images for context
          availableTables: relevantTables // Include relevant tables for context
        }
      });

      if (error) {
        console.error('Chat API error:', error);
        
        // Handle specific error types
        if (error.message?.includes('rate limit')) {
          return "I'm a bit overwhelmed right now. Please wait a moment and try again.";
        } else if (error.message?.includes('Unauthorized')) {
          return "Please log in to chat with Barry.";
        }
        
        return "I encountered an error while processing your request. Please try again.";
      }

      const assistantMessage = data?.choices?.[0]?.message?.content || data?.content ||
        "I'm sorry, I couldn't generate a response. Please try again.";

      // Extract referenced images and tables from response
      const referencedImages = data?.images || [];
      const referencedTables = data?.tables || relevantTables || [];

      // Add assistant response to history with images and tables
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
        images: referencedImages,
        tables: referencedTables
      });

      // Store manual references if provided
      if (data?.manualReferences) {
        console.log('Manual references:', data.manualReferences);
      }

      return assistantMessage;
    } catch (error: any) {
      console.error('Chat service error:', error);
      
      if (error?.message?.includes('network')) {
        return "I'm having trouble connecting. Please check your internet connection and try again.";
      }
      
      return "I encountered an error while processing your request. Please try again.";
    }
  }

  clearConversation() {
    // Clear conversation history
    this.conversationHistory = [];
  }

  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  isConfigured(): boolean {
    // Always return true since we use Edge Functions
    // The actual configuration check happens server-side
    return true;
  }
}

// Singleton instance
export const geminiService = new GeminiService();