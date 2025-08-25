import { useState, useCallback } from 'react';
import { secureChatGPTService, ChatMessage, ManualReference } from '@/services/chatgpt/secureChatGPTService';
import { useAuth } from '@/hooks/use-auth';

export function useSecureChatGPT(location?: { latitude: number; longitude: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>(secureChatGPTService.getMessages());
  const [manualReferences, setManualReferences] = useState<ManualReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await secureChatGPTService.sendMessage(message, location);
      setMessages(secureChatGPTService.getMessages());
      if (response.manualReferences) {
        setManualReferences(response.manualReferences);
      }
      return response.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  const clearChat = useCallback(() => {
    secureChatGPTService.clearHistory();
    setMessages(secureChatGPTService.getMessages());
    setManualReferences([]);
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
    manualReferences,
    isLoading,
    error,
    isAuthenticated: !!user,
    sendMessage,
    clearChat,
    retry
  };
}