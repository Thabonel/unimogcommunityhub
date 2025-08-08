import { useState, useCallback, useEffect } from 'react';
import { chatGPTService, ChatMessage } from '@/services/chatgpt/chatgptService';
import { useOfflineQueue } from '@/hooks/use-offline';

export interface UseChatGPTOptions {
  onError?: (error: string) => void;
  offlineMode?: boolean;
}

export function useChatGPT(options: UseChatGPTOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  
  const { addToQueue } = useOfflineQueue<ChatMessage>();
  const { onError, offlineMode = true } = options;

  useEffect(() => {
    // Check if ChatGPT is properly configured
    setIsConfigured(chatGPTService.isConfigured());
    
    // Load conversation history
    const history = chatGPTService.getConversationHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      // Add welcome message
      setMessages([{
        role: 'assistant',
        content: "G'day! I'm Barry, your AI Unimog mechanic. Whether you need help with maintenance, repairs, or just want to chat about your Mog, I'm here to help. What can I do for you today?",
        timestamp: new Date()
      }]);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Check if offline and queue if needed
      if (!navigator.onLine && offlineMode) {
        addToQueue(userMessage);
        
        const offlineResponse: ChatMessage = {
          role: 'assistant',
          content: "I'm currently offline, but I've saved your message. I'll respond as soon as we're back online!",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, offlineResponse]);
        setIsLoading(false);
        return;
      }

      // Send to ChatGPT
      const response = await chatGPTService.sendMessage(content);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to send message';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }

      // Add error message to chat
      const errorResponse: ChatMessage = {
        role: 'assistant',
        content: "Sorry mate, I ran into a technical issue. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [offlineMode, addToQueue, onError]);

  const clearChat = useCallback(() => {
    chatGPTService.clearConversation();
    setMessages([{
      role: 'assistant',
      content: "G'day! I'm Barry, your AI Unimog mechanic. How can I help you today?",
      timestamp: new Date()
    }]);
    setError(null);
  }, []);

  const retry = useCallback(() => {
    setError(null);
    // Re-check configuration
    setIsConfigured(chatGPTService.isConfigured());
  }, []);

  return {
    messages,
    isLoading,
    error,
    isConfigured,
    sendMessage,
    clearChat,
    retry
  };
}