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
}

export class ChatGPTService {
  private conversationHistory: ChatMessage[] = [];
  
  constructor() {
    // No client-side API key initialization needed
    // All API calls go through the secure Edge Function
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return "Please log in to chat with Barry.";
      }

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

      // Call the secure Edge Function
      const { data, error } = await supabase.functions.invoke('chat-with-barry', {
        body: {
          messages: this.conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
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

      const assistantMessage = data?.content || 
        "I'm sorry, I couldn't generate a response. Please try again.";

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
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
export const chatGPTService = new ChatGPTService();