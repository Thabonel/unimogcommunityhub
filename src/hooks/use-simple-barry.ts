import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { callBarryTools } from '@/services/openclaw/barryToolsService';

export interface BarryConversation {
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
}

export interface ManualReference {
  type: string;
  title: string;
  filename?: string;
  chapter_filename?: string; // Added from Edge Function for manual matching
  original_page: number;
  pdf_page: number;
  storage_url: string;
  chapter_number?: number;
  manual_type: string;
  // Content fields for inline citations
  page_number?: number;
  section_title?: string;
  content?: string;
  page_image_url?: string;
  // Legacy fields for backward compatibility
  manual?: string;
  page?: number;
  section?: string;
  pageImageUrl?: string;
  hasVisualContent?: boolean;
  visualContentType?: string;
}

// Helper function to enrich manual references with chunk content
async function enrichManualReferences(references: ManualReference[]): Promise<ManualReference[]> {
  if (!references || references.length === 0) return references;

  try {
    // Fetch chunk content for each reference
    const enrichedRefs = await Promise.all(
      references.map(async (ref) => {
        try {
          // Skip chunk lookup for RPS illustrations (they're PNG files, not PDFs with chunks)
          if (ref.type === 'rps_illustration') {
            return ref; // Return as-is, frontend will display the image directly
          }

          // Extract manual filename from chapter_filename or storage_url
          let manualIdentifier = ref.filename || ref.chapter_filename;
          if (!manualIdentifier && ref.storage_url) {
            // Extract from storage_url (e.g., ".../29_Pedal_Linkage.pdf#page=2" → "29_Pedal_Linkage")
            const urlParts = ref.storage_url.split('/');
            const lastPart = urlParts[urlParts.length - 1];
            const filename = lastPart.split('#')[0]; // Remove #page= fragment
            manualIdentifier = filename.replace('.pdf', ''); // Remove .pdf extension
          }

          if (!manualIdentifier) {
            console.warn('No manual identifier found for reference:', ref);
            return ref;
          }

          // Query manual_chunks with BOTH page_number AND manual_title match
          const { data: chunks, error} = await supabase
            .from('manual_chunks')
            .select('content, section_title, page_number, page_image_url, manual_title')
            .eq('page_number', ref.pdf_page || ref.original_page)
            .ilike('manual_title', `%${manualIdentifier}%`) // Fuzzy match on manual title
            .limit(1)
            .maybeSingle();

          if (error || !chunks) {
            console.warn(`No chunk found for ${manualIdentifier} page ${ref.pdf_page}:`, error);
            return ref;
          }

          // Enrich reference with chunk data
          return {
            ...ref,
            content: chunks.content,
            section_title: chunks.section_title,
            page_number: chunks.page_number,
            page_image_url: chunks.page_image_url
          };
        } catch (err) {
          console.error('Error fetching chunk for reference:', err);
          return ref;
        }
      })
    );

    return enrichedRefs;
  } catch (err) {
    console.error('Error enriching manual references:', err);
    return references;
  }
}

export function useSimpleBarry(location?: { latitude: number; longitude: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<BarryConversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const { user } = useAuth();

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

      // Parse messages from JSONB
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
      // Generate title from first user message
      const firstUserMsg = newMessages.find(m => m.role === 'user');
      const title = firstUserMsg
        ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '')
        : 'New Conversation';

      // Serialize messages for JSONB storage
      const serializedMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        manualReferences: msg.manualReferences
      }));

      if (conversationId) {
        // Update existing conversation
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
        // Create new conversation
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

    // Fetch from database if not in cache
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
  }, []);

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
      const allMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: message.trim() }
      ];
      const data = await callBarryTools({ messages: allMessages, location });

      const enrichedReferences = await enrichManualReferences(data.manualReferences || []);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content || "I couldn't process that request.",
        timestamp: new Date(),
        manualReferences: enrichedReferences
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      // Save conversation to database
      saveConversation(updatedMessages);

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
  }, [messages, location, saveConversation]);

  const clearChat = useCallback(() => {
    setConversationId(null);
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
    retry,
    // Conversation persistence
    conversations,
    isLoadingConversations,
    conversationId,
    loadConversation,
    startNewConversation,
    loadConversations
  };
}