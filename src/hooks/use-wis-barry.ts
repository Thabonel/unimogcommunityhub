/**
 * WIS Barry Hook - Workshop Information System AI Assistant
 *
 * Dedicated Barry for structured workshop procedure queries.
 * Different from Manual Barry (PDF search) - this searches wis_procedures directly.
 *
 * Usage:
 *   const { messages, sendMessage, procedures, isLoading } = useWISBarry(modelCode);
 *
 *   await sendMessage('Show me engine oil change procedures');
 *
 *   // procedures contains structured WIS data with links
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

export interface WISProcedureReference {
  id: string;
  title: string;
  procedureCode: string;
  systemName: string;
  componentName: string;
  modelCode: string;
  estimatedTime: number | null;
  difficulty: string;
  link: string;
}

export interface WISBarryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface WISBarryResponse {
  content: string;
  procedures: WISProcedureReference[];
  searchResultCount: number;
  model: string;
}

export function useWISBarry(modelCode?: string) {
  const [messages, setMessages] = useState<WISBarryMessage[]>([]);
  const [procedures, setProcedures] = useState<WISProcedureReference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage: WISBarryMessage = {
        role: 'user',
        content: content.trim()
      };

      setMessages(prev => [...prev, userMessage]);

      // Call WIS Barry edge function
      const { data, error: functionError } = await supabase.functions.invoke(
        'chat-with-wis-barry',
        {
          body: {
            messages: [...messages, userMessage],
            modelCode
          }
        }
      );

      if (functionError) {
        throw new Error(functionError.message || 'Failed to get response from WIS Barry');
      }

      const response = data as WISBarryResponse;

      // Add Barry's response
      const assistantMessage: WISBarryMessage = {
        role: 'assistant',
        content: response.content
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update procedures
      if (response.procedures && response.procedures.length > 0) {
        setProcedures(response.procedures);
      }

    } catch (err) {
      console.error('WIS Barry error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);

      // Add error message
      const errorResponse: WISBarryMessage = {
        role: 'assistant',
        content: `Sorry mate, I'm having trouble accessing the WIS database right now. Error: ${errorMessage}`
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, modelCode]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setProcedures([]);
    setError(null);
  }, []);

  return {
    messages,
    procedures,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
}
