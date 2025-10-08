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
      // Call the barry function
      const { data, error: functionError } = await supabase.functions.invoke('chat-with-barry', {
        body: {
          messages: [
            ...messages,
            { role: 'user', content: message.trim() }
          ],
          location: location || null
        }
      });

      if (functionError) throw functionError;

      // Enrich manual references with chunk content
      const enrichedReferences = await enrichManualReferences(data.manualReferences || []);

      // Add Barry's response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content || "I couldn't process that request.",
        timestamp: new Date(),
        manualReferences: enrichedReferences
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
  }, [messages, profile?.unimog_model, location]);

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