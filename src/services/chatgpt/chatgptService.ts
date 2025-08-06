import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

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
  private openai: OpenAI | null = null;
  private conversationHistory: ChatCompletionMessageParam[] = [];
  
  constructor() {
    this.initializeOpenAI();
  }

  private initializeOpenAI() {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      // Silently skip if no API key - this is expected in many deployments
      return;
    }

    try {
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      });
      
      // Initialize with Barry's system prompt
      this.conversationHistory = [{
        role: 'system',
        content: BARRY_SYSTEM_PROMPT
      }];
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
    }
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.openai) {
      return "I'm sorry, but I'm not properly configured. Please check that the OpenAI API key is set up correctly.";
    }

    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: message
      });

      // Keep conversation history manageable (last 20 messages + system prompt)
      if (this.conversationHistory.length > 21) {
        this.conversationHistory = [
          this.conversationHistory[0], // Keep system prompt
          ...this.conversationHistory.slice(-20)
        ];
      }

      // Send to OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: this.conversationHistory,
        temperature: 0.7,
        max_tokens: 800,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const assistantMessage = response.choices[0]?.message?.content || 
        "I'm sorry, I couldn't generate a response. Please try again.";

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error: any) {
      console.error('ChatGPT API error:', error);
      
      // Handle specific error types
      if (error?.status === 429) {
        return "I'm a bit overwhelmed right now. Please wait a moment and try again.";
      } else if (error?.status === 401) {
        return "There's an issue with my configuration. Please contact support.";
      } else if (error?.message?.includes('network')) {
        return "I'm having trouble connecting. Please check your internet connection and try again.";
      }
      
      return "I encountered an error while processing your request. Please try again.";
    }
  }

  clearConversation() {
    // Reset to just the system prompt
    this.conversationHistory = [{
      role: 'system',
      content: BARRY_SYSTEM_PROMPT
    }];
  }

  getConversationHistory(): ChatMessage[] {
    // Convert to our format, excluding system messages
    return this.conversationHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content as string,
        timestamp: new Date()
      }));
  }

  isConfigured(): boolean {
    return this.openai !== null;
  }
}

// Singleton instance
export const chatGPTService = new ChatGPTService();