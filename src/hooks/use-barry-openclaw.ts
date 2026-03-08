/**
 * Barry OpenClaw Hook
 * React hook for interacting with Barry via the OpenClaw/Hybrid service
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBarry } from '@/contexts/BarryContext';
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
  fallbackUsed?: boolean;
  executionTimeMs?: number;
  skillChain?: string[];
}

export interface ManualReference {
  type?: string;
  title: string;
  filename?: string;
  chapter_filename?: string;
  original_page?: number;
  pdf_page?: number;
  storage_url?: string;
  chapter_number?: number;
  manual_type?: string;
  page_number: number;  // Required for ManualCitation compatibility
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
          // Ensure page_number is always set (required for ManualCitation)
          const baseRef: ManualReference = {
            ...ref,
            page_number: ref.page_number || ref.pdf_page || ref.original_page || 0
          };

          // Skip chunk lookup for RPS illustrations
          if (ref.type === 'rps_illustration') {
            return baseRef;
          }

          // Ensure storage_url is properly constructed
          let storageUrl = ref.storage_url;
          if (!storageUrl && (ref.filename || ref.chapter_filename)) {
            const filename = ref.filename || ref.chapter_filename;
            // Construct storage URL from Supabase public bucket
            storageUrl = `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/manuals/${filename}`;
          }

          let manualIdentifier = ref.filename || ref.chapter_filename;
          if (!manualIdentifier && storageUrl) {
            const urlParts = storageUrl.split('/');
            const lastPart = urlParts[urlParts.length - 1];
            const filename = lastPart.split('#')[0];
            manualIdentifier = filename.replace('.pdf', '');
          }

          if (!manualIdentifier) {
            return { ...baseRef, storage_url: storageUrl };
          }

          const { data: chunks, error } = await supabase
            .from('manual_chunks')
            .select('content, section_title, page_number, page_image_url, manual_title')
            .eq('page_number', baseRef.page_number)
            .ilike('manual_title', `%${manualIdentifier}%`)
            .limit(1)
            .maybeSingle();

          if (error || !chunks) {
            return { ...baseRef, storage_url: storageUrl };
          }

          return {
            ...baseRef,
            storage_url: storageUrl,
            content: chunks.content,
            section_title: chunks.section_title,
            page_number: chunks.page_number || baseRef.page_number,
            page_image_url: chunks.page_image_url
          };
        } catch {
          // Ensure page_number and storage_url are set even on error
          let fallbackStorageUrl = ref.storage_url;
          if (!fallbackStorageUrl && (ref.filename || ref.chapter_filename)) {
            const filename = ref.filename || ref.chapter_filename;
            fallbackStorageUrl = `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/manuals/${filename}`;
          }
          return {
            ...ref,
            page_number: ref.page_number || ref.pdf_page || ref.original_page || 0,
            storage_url: fallbackStorageUrl
          };
        }
      })
    );

    return enrichedRefs;
  } catch {
    // Ensure all refs have page_number and storage_url even on total failure
    return references.map(ref => {
      let fallbackStorageUrl = ref.storage_url;
      if (!fallbackStorageUrl && (ref.filename || ref.chapter_filename)) {
        const filename = ref.filename || ref.chapter_filename;
        fallbackStorageUrl = `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/manuals/${filename}`;
      }
      return {
        ...ref,
        page_number: ref.page_number || ref.pdf_page || ref.original_page || 0,
        storage_url: fallbackStorageUrl
      };
    });
  }
}

// LocalStorage key for conversation persistence
const CONVERSATION_STORAGE_KEY = 'barry-conversation-history';

/**
 * Save conversation to localStorage
 */
const saveConversationToStorage = (messages: ChatMessage[]) => {
  try {
    const serialized = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
      manualReferences: msg.manualReferences,
      usedOpenClaw: msg.usedOpenClaw,
      fallbackUsed: msg.fallbackUsed,
      executionTimeMs: msg.executionTimeMs,
      skillChain: msg.skillChain
    }));
    localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.warn('Failed to save conversation to localStorage:', error);
  }
};

/**
 * Load conversation from localStorage
 */
const loadConversationFromStorage = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch (error) {
    console.warn('Failed to load conversation from localStorage:', error);
  }
  return [];
};

/**
 * Clear conversation from localStorage
 */
const clearConversationFromStorage = () => {
  try {
    localStorage.removeItem(CONVERSATION_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear conversation from localStorage:', error);
  }
};

/**
 * Barry OpenClaw Hook
 */
export function useBarryOpenClaw(options: UseBarryOpenClawOptions = {}) {
  const { location, openclawPercentage, enableFallback } = options;

  const [messages, setMessages] = useState<ChatMessage[]>(() => loadConversationFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<BarryOpenClawConversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [lastResponse, setLastResponse] = useState<HybridResponse | null>(null);
  const { user } = useAuth();
  const { pageContext } = useBarry();

  // Configure hybrid service on mount/option change
  useEffect(() => {
    if (openclawPercentage !== undefined || enableFallback !== undefined) {
      barryHybridService.setConfig({
        ...(openclawPercentage !== undefined && { openclawPercentage }),
        ...(enableFallback !== undefined && { enableFallback })
      });
    }
  }, [openclawPercentage, enableFallback]);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    saveConversationToStorage(messages);
  }, [messages]);

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

      const parsedConversations = (data || []).map((conv: any) => ({
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
    clearConversationFromStorage();
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

      // Add page context to the user message if available
      let userMessageContent = message.trim();
      if (pageContext) {
        const contextHint = `[Page Context: User is currently on the ${pageContext.pageName} page.${pageContext.pageTitle ? ` ${pageContext.pageTitle}` : ''}${pageContext.relevantData ? ` ${JSON.stringify(pageContext.relevantData)}` : ''}]\n\n${userMessageContent}`;
        userMessageContent = contextHint;
      }

      // Call hybrid service
      const response = await barryHybridService.chat(
        [...apiMessages, { role: 'user', content: userMessageContent }],
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
        fallbackUsed: response.fallbackUsed,
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
    clearConversationFromStorage();
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
