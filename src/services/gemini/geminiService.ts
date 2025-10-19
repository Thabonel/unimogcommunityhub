import { supabase } from '@/lib/supabase-client';

// Barry's U435/U1700L knowledge-only personality
const BARRY_U435_SYSTEM_PROMPT = `You are Barry, a specialized U435/U1700L Unimog mechanic with 40+ years of experience. You are a KNOWLEDGE-ONLY assistant with strict restrictions.

CRITICAL RESTRICTIONS:
- You ONLY answer questions about U435/U1700L Unimogs and their technical systems
- Your knowledge comes EXCLUSIVELY from the provided U435/U1700L manual chapters
- For ANY non-U435 question, you respond: "I don't know that one, mate. Check the PDF manuals in the Technical Manuals section."
- NEVER provide weather forecasts, general knowledge, or information outside U435/U1700L scope

Your personality:
- Gruff but helpful mechanic
- Direct and practical advice
- Reference specific manual chapters when available
- Use mechanic slang and terminology
- Keep responses focused and technical

Your U435/U1700L expertise includes:
- OM366 engine maintenance and repair
- Manual transmission service procedures
- Portal axle maintenance and seal replacement
- Hydraulic system repairs and troubleshooting
- Electrical system diagnostics
- Suspension and steering adjustments
- Brake system maintenance (hydraulic, pneumatic, mechanical)
- Cooling system service
- PTO and special equipment

Remember: You are a focused U435/U1700L specialist. Stay within your knowledge boundaries!`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'model';
  content: string;
  timestamp?: Date;
}

export interface U435ManualReference {
  type: 'u435_chapter';
  title: string;
  filename: string;
  direct_url: string | null;
  page_range: string;
  manual_type: 'workshop' | 'maintenance';
  priority: 'high' | 'standard' | 'critical';
  storage_bucket: string;
  storage_path: string;
  relevance: string;
}

export interface BarryResponse {
  response: string;
  manualReferences: U435ManualReference[];
  fallback: boolean;
  usage?: any;
}

export class GeminiService {
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    // No client-side API key initialization needed
    // All API calls go through the secure Edge Function
  }

  async sendMessage(message: string): Promise<BarryResponse> {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return {
          response: "Please log in to chat with Barry.",
          manualReferences: [],
          fallback: true
        };
      }

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Keep conversation history manageable (last 15 messages for U435 focus)
      if (this.conversationHistory.length > 15) {
        this.conversationHistory = this.conversationHistory.slice(-15);
      }

      // Call the U435 knowledge-only Edge Function
      const { data, error } = await supabase.functions.invoke('chat-with-barry-agentic', {
        body: {
          messages: this.conversationHistory.slice(-8).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });

      if (error) {
        console.error('Barry chat API error:', error);

        // Handle specific error types
        if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
          return {
            response: "I'm a bit overwhelmed right now. Please wait a moment and try again.",
            manualReferences: [],
            fallback: true
          };
        } else if (error.message?.includes('Unauthorized') || error.message?.includes('API key')) {
          return {
            response: "Please log in to chat with Barry.",
            manualReferences: [],
            fallback: true
          };
        }

        return {
          response: "I encountered an error while processing your request. Please try again.",
          manualReferences: [],
          fallback: true
        };
      }

      // Handle new response format
      const barryResponse: BarryResponse = {
        response: data?.response || "I'm sorry, I couldn't generate a response. Please try again.",
        manualReferences: data?.manualReferences || [],
        fallback: data?.fallback || false,
        usage: data?.usage
      };

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: barryResponse.response,
        timestamp: new Date()
      });

      // Log manual references for debugging
      if (barryResponse.manualReferences.length > 0) {
        console.log('U435 manual references:', barryResponse.manualReferences);
      }

      return barryResponse;
    } catch (error: any) {
      console.error('Barry service error:', error);

      if (error?.message?.includes('network')) {
        return {
          response: "I'm having trouble connecting. Please check your internet connection and try again.",
          manualReferences: [],
          fallback: true
        };
      }

      return {
        response: "I encountered an error while processing your request. Please try again.",
        manualReferences: [],
        fallback: true
      };
    }
  }

  // Helper method for backwards compatibility - returns just the text response
  async sendMessageText(message: string): Promise<string> {
    const response = await this.sendMessage(message);
    return response.response;
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

  // Get U435 manual references from last response
  getLastManualReferences(): U435ManualReference[] {
    // This would need to be stored from the last sendMessage call
    // For now, return empty array - components should use the full response
    return [];
  }

  // Helper to check if Barry has knowledge for a topic
  isU435Related(message: string): boolean {
    const u435Keywords = [
      'u435', 'u1700l', '1700l', 'unimog',
      'engine', 'om366', 'transmission', 'brake',
      'hydraulic', 'axle', 'portal', 'pto'
    ];

    const lowerMessage = message.toLowerCase();
    return u435Keywords.some(keyword => lowerMessage.includes(keyword));
  }
}

// Singleton instance
export const geminiService = new GeminiService();