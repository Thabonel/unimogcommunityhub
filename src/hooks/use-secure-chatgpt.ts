import { useState, useCallback } from 'react';
import { secureClaudeService, ChatMessage, ManualReference } from '@/services/claude/secureClaudeService';
import { useAuth } from '@/contexts/AuthContext';

export function useSecureChatGPT(location?: { latitude: number; longitude: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>(secureClaudeService.getMessages());
  const [manualReferences, setManualReferences] = useState<ManualReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await secureClaudeService.sendMessage(message, location);
      setMessages(secureClaudeService.getMessages());
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
    secureClaudeService.clearHistory();
    setMessages(secureClaudeService.getMessages());
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