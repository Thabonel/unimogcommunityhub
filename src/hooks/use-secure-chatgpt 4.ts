import { useState, useCallback } from 'react';
import { secureChatGPTService, ChatMessage } from '@/services/chatgpt/secureChatGPTService';
import { useAuth } from '@/hooks/use-auth';

export function useSecureChatGPT() {
  const [messages, setMessages] = useState<ChatMessage[]>(secureChatGPTService.getMessages());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await secureChatGPTService.sendMessage(message);
      setMessages(secureChatGPTService.getMessages());
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    secureChatGPTService.clearHistory();
    setMessages(secureChatGPTService.getMessages());
    setError(null);
  }, []);

  const retry = useCallback(async () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      await sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    isAuthenticated: !!user,
    sendMessage,
    clearChat,
    retry
  };
}