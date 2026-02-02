/**
 * Barry OpenClaw Hook
 * React hook for interacting with Barry via the OpenClaw/Hybrid service
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import {
  barryHybridService,
  HybridResponse,
  BarryOpenClawMessage
} from '@/services/openclaw';

export interface BarryOpenClawConversation {
  id: string;
  user_id: string;
  vehicle_id?: string;
  title?: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  manualReferences?: ManualReference[];
  usedOpenClaw?: boolean;
  executionTimeMs?: number;
  skillChain?: string[];
}

export interface ManualReference {
  type: string;
  title: string;
  filename?: string;
  chapter_filename?: string;
  original_page: number;
  pdf_page: number;
  storage_url: string;
  chapter_number?: number;
  manual_type: string;
  page_number?: number;
  section_title?: string;
  content?: string;
  page_image_url?: string;
  cdn_url?: string;
}

interface UseBarryOpenClawOptions {
  location?: { latitude: number; longitude: number };
  openclawPercentage?: number; // 0-100, override default percentage
  enableFallback?: boolean;
}

/**
 * Helper to enrich manual references with chunk content
 */
async function enrichManualReferences(references: ManualReference[]): Promise<ManualReference[]> {
  if (!references || references.length === 0) return references;

  try {
    const enrichedRefs = await Promise.all(
      references.map(async (ref) => {
        try {
          // Skip chunk lookup for RPS illustrations
          if (ref.type === 'rps_illustration') {
            return ref;
          }

          let manualIdentifier = ref.filename || ref.chapter_filename;
          if (!manualIdentifier && ref.storage_url) {
            const urlParts = ref.storage_url.split('/');
            const lastPart = urlParts[urlParts.length - 1];
            const filename = lastPart.split('#')[0];
            manualIdentifier = filename.replace('.pdf', '');
          }

          if (!manualIdentifier) {
            return ref;
          }

          const { data: chunks, error } = await supabase
            .from('manual_chunks')
            .select('content, section_title, page_number, page_image_url, manual_title')
            .eq('page_number', ref.pdf_page || ref.original_page)
            .ilike('manual_title', `%${manualIdentifier}%`)
            .limit(1)
            .maybeSingle();

          if (error || !chunks) {
            return ref;
          }

          return {
            ...ref,
            content: chunks.content,
            section_title: chunks.section_title,
            page_number: chunks.page_number,
            page_image_url: chunks.page_image_url
          };
        } catch {
          return ref;
        }
      })
    );

    return enrichedRefs;
  } catch {
    return references;
  }
}

/**
 * Barry OpenClaw Hook
 */
export function useBarryOpenClaw(options: UseBarryOpenClawOptions = {}) {
  const { location, openclawPercentage, enableFallback } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<BarryOpenClawConversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [lastResponse, setLastResponse] = useState<HybridResponse | null>(null);
  const { user } = useAuth();

  // Configure hybrid service on mount/option change
  useEffect(() => {
    if (openclawPercentage !== undefined || enableFallback !== undefined) {
      barryHybridService.setConfig({
        ...(openclawPercentage !== undefined && { openclawPercentage }),
        ...(enableFallback !== undefined && { enableFallback })
      });
    }
  }, [openclawPercentage, enableFallback]);

  // Load past conversations on mount
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id]);

  const loadConversations = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingConversations(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_barry_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (fetchError) {
        console.error('Failed to load Barry conversations:', fetchError);
        return;
      }

      const parsedConversations = (data || []).map(conv => ({
        ...conv,
        messages: (conv.messages || []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));

      setConversations(parsedConversations);
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [user?.id]);

  const saveConversation = useCallback(async (newMessages: ChatMessage[]) => {
    if (!user?.id || newMessages.length === 0) return;

    try {
      const firstUserMsg = newMessages.find(m => m.role === 'user');
      const title = firstUserMsg
        ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '')
        : 'New Conversation';

      const serializedMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        manualReferences: msg.manualReferences,
        usedOpenClaw: msg.usedOpenClaw,
        executionTimeMs: msg.executionTimeMs,
        skillChain: msg.skillChain
      }));

      if (conversationId) {
        const { error: updateError } = await supabase
          .from('user_barry_conversations')
          .update({
            messages: serializedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);

        if (updateError) {
          console.error('Failed to update conversation:', updateError);
        }
      } else {
        const { data, error: insertError } = await supabase
          .from('user_barry_conversations')
          .insert({
            user_id: user.id,
            title,
            messages: serializedMessages
          })
          .select()
          .single();

        if (insertError) {
          console.error('Failed to save conversation:', insertError);
        } else if (data) {
          setConversationId(data.id);
        }
      }
    } catch (err) {
      console.error('Error saving conversation:', err);
    }
  }, [user?.id, conversationId]);

  const loadConversation = useCallback(async (convId: string) => {
    const conversation = conversations.find(c => c.id === convId);
    if (conversation) {
      setConversationId(convId);
      setMessages(conversation.messages);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('user_barry_conversations')
        .select('*')
        .eq('id', convId)
        .single();

      if (fetchError || !data) {
        console.error('Failed to load conversation:', fetchError);
        return;
      }

      const parsedMessages = (data.messages || []).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));

      setConversationId(data.id);
      setMessages(parsedMessages);
    } catch (err) {
      console.error('Error loading conversation:', err);
    }
  }, [conversations]);

  const startNewConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setError(null);
    setLastResponse(null);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Convert messages to BarryOpenClawMessage format
      const apiMessages: BarryOpenClawMessage[] = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Call hybrid service
      const response = await barryHybridService.chat(
        [...apiMessages, { role: 'user', content: message.trim() }],
        location,
        user?.id
      );

      setLastResponse(response);

      // Enrich manual references
      const enrichedReferences = await enrichManualReferences(
        (response.manualReferences || []) as ManualReference[]
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.content || "I couldn't process that request.",
        timestamp: new Date(),
        manualReferences: enrichedReferences,
        usedOpenClaw: response.usedOpenClaw,
        executionTimeMs: response.execution_time_ms,
        skillChain: response.skill_chain
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);
      saveConversation(updatedMessages);

      return response.content;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message to Barry';
      setError(errorMessage);

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
  }, [messages, location, user?.id, saveConversation]);

  const clearChat = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setError(null);
    setLastResponse(null);
  }, []);

  const retry = useCallback(async () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
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

  /**
   * Run A/B comparison for current query
   */
  const runComparison = useCallback(async (message: string) => {
    if (!message.trim()) return null;

    const apiMessages: BarryOpenClawMessage[] = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    return barryHybridService.compareImplementations(
      [...apiMessages, { role: 'user', content: message.trim() }],
      location
    );
  }, [messages, location]);

  /**
   * Get current hybrid service configuration
   */
  const getConfig = useCallback(() => {
    return barryHybridService.getConfig();
  }, []);

  /**
   * Update hybrid service configuration
   */
  const setConfig = useCallback((config: { openclawPercentage?: number; enableFallback?: boolean }) => {
    barryHybridService.setConfig(config);
  }, []);

  return {
    messages,
    isLoading,
    error,
    isAuthenticated: !!user,
    sendMessage,
    clearChat,
    retry,
    // Conversation persistence
    conversations,
    isLoadingConversations,
    conversationId,
    loadConversation,
    startNewConversation,
    loadConversations,
    // OpenClaw-specific
    lastResponse,
    runComparison,
    getConfig,
    setConfig
  };
}

export default useBarryOpenClaw;
