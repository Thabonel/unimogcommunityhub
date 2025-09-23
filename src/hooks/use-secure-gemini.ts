import { useState, useCallback } from 'react';
import { secureGeminiService, ChatMessage, ManualReference } from '@/services/claude/secureGeminiService';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export function useSecureGemini(location?: { latitude: number; longitude: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>(secureGeminiService.getMessages());
  const [manualReferences, setManualReferences] = useState<ManualReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { i18n } = useTranslation();

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get current language from i18n
      const userLanguage = i18n.language || 'en';

      const response = await secureGeminiService.sendMessage(message, location, userLanguage);
      setMessages(secureGeminiService.getMessages());
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
  }, [location, i18n.language]);

  const clearChat = useCallback(() => {
    secureGeminiService.clearHistory();
    setMessages(secureGeminiService.getMessages());
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