import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  manualReferences?: ManualReference[];
}

export interface ManualReference {
  manual: string;
  page: number;
  section?: string;
  pageImageUrl?: string;
  hasVisualContent?: boolean;
  visualContentType?: string;
}

export function useSimpleBarry() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Call the semantic search barry function for better manual matching
      const { data, error: functionError } = await supabase.functions.invoke('chat-with-barry-semantic', {
        body: {
          messages: [
            ...messages,
            { role: 'user', content: message.trim() }
          ]
        }
      });

      if (functionError) throw functionError;

      // Add Barry's response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content || "I couldn't process that request.",
        timestamp: new Date(),
        manualReferences: data.manualReferences || []
      };

      setMessages(prev => [...prev, assistantMessage]);
      return data.content;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message to Barry';
      setError(errorMessage);

      // Add error message from Barry
      const errorResponseMessage: ChatMessage = {
        role: 'assistant',
        content: "Sorry, I had trouble processing your request. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponseMessage]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [profile?.unimog_model]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const retry = useCallback(async () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      // Remove the last assistant message (likely failed)
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1]?.role === 'assistant') {
          newMessages.pop();
        }
        return newMessages;
      });

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