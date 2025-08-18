import { supabase } from '@/lib/supabase-client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ManualReference {
  manual: string;
  page: number;
  section?: string;
  pageImageUrl?: string | null;
  hasVisualContent?: boolean;
  visualContentType?: 'text' | 'diagram' | 'mixed' | 'schematic' | 'photo';
}

export interface ChatGPTResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  manualReferences?: ManualReference[];
}

class SecureChatGPTService {
  private messages: ChatMessage[] = [];
  private lastManualReferences: ManualReference[] = [];

  constructor() {
    // Initialize with Barry's greeting
    this.messages = [{
      role: 'assistant',
      content: "G'day! I'm Barry, your AI assistant and Unimog specialist. Been wrenching on these beasts for over 40 years, but I'm here to help with anything you need - weather forecasts, directions, general questions, or of course, any Unimog problems. What can I help you with today?",
      timestamp: new Date()
    }];
  }

  async sendMessage(message: string, location?: { latitude: number; longitude: number }): Promise<{ content: string; manualReferences?: ManualReference[] }> {
    try {
      // Add user message to history
      this.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('You must be logged in to chat with Barry');
      }

      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('chat-with-barry', {
        body: {
          messages: this.messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          location: location
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        
        // Handle specific error cases
        if (error.message?.includes('Rate limit')) {
          throw new Error('Slow down there! I can only answer so fast. Give me a moment to catch up.');
        }
        
        throw new Error(error.message || 'Failed to get response from Barry');
      }

      if (!data?.content) {
        throw new Error('No response received from Barry');
      }

      // Store manual references if any
      if (data.manualReferences) {
        this.lastManualReferences = data.manualReferences;
      }

      // Add assistant response to history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      };
      this.messages.push(assistantMessage);

      return { content: data.content, manualReferences: data.manualReferences };
    } catch (error) {
      console.error('Chat error:', error);
      
      if (error instanceof Error) {
        // Return user-friendly error messages
        if (error.message.includes('logged in')) {
          throw new Error('You need to be logged in to chat with Barry. Please sign in first.');
        }
        throw error;
      }
      
      throw new Error('Something went wrong. Please try again.');
    }
  }

  getMessages(): ChatMessage[] {
    return this.messages;
  }

  getLastManualReferences(): ManualReference[] {
    return this.lastManualReferences;
  }

  clearHistory(): void {
    // Keep Barry's initial greeting
    this.messages = [{
      role: 'assistant',
      content: "G'day! I'm Barry, your AI assistant and Unimog specialist. Been wrenching on these beasts for over 40 years, but I'm here to help with anything you need - weather forecasts, directions, general questions, or of course, any Unimog problems. What can I help you with today?",
      timestamp: new Date()
    }];
    this.lastManualReferences = [];
  }

  isConfigured(): boolean {
    // With Edge Functions, we just need to check if user is authenticated
    return true; // The Edge Function handles API key configuration
  }
}

export const secureChatGPTService = new SecureChatGPTService();