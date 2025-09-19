import { useState, useCallback } from 'react';
import { geminiService, ChatMessage } from '@/services/gemini/geminiService';
import { useAuth } from '@/contexts/AuthContext';

export interface ManualReference {
  title: string;
  source: string;
  url?: string;
  relevance: number;
}

export function useGeminiBarry(location?: { latitude: number; longitude: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>(geminiService.getConversationHistory());
  const [manualReferences, setManualReferences] = useState<ManualReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await geminiService.sendMessage(message);
      setMessages([...geminiService.getConversationHistory()]);

      // Extract manual references if they exist in the response
      // This would need to be implemented based on how Gemini structures responses
      // For now, we'll keep the existing interface but with empty references
      setManualReferences([]);

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  const clearChat = useCallback(() => {
    geminiService.clearConversation();
    setMessages([]);
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