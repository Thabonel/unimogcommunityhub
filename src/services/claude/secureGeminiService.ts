import { supabase } from '@/lib/supabase-client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  images?: ImageReference[];
}

export interface ImageReference {
  id: string;
  url: string;
  description: string;
  type: 'diagram' | 'photo' | 'schematic' | 'parts-view' | 'table' | 'chart';
  pageNumber: number;
  relevance: number; // 0-1 confidence score
}

export interface ManualReference {
  manual: string;
  page: number;
  section?: string;
  pageImageUrl?: string | null;
  hasVisualContent?: boolean;
  visualContentType?: 'text' | 'diagram' | 'mixed' | 'schematic' | 'photo';
  confidence?: number; // Similarity score from semantic search
  context?: string; // Search method and relevance info
  hasVisuals?: boolean; // From semantic search
  visualType?: string | null; // Visual content type from database
  imageUrl?: string | null; // Page image URL from database
  quality?: number | null; // Extraction quality score
}

export interface AttachmentMetadata {
  filename: string;
  storage_path: string;
  public_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface GeminiResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  manualReferences?: ManualReference[];
  images?: ImageReference[];
  knowledgeMode?: 'curated_knowledge' | 'two_pass_rag_verified' | 'general_ai';
  knowledgeSources?: string | null;
  attachments?: AttachmentMetadata[];
}

class SecureGeminiService {
  private messages: ChatMessage[] = [];
  private lastManualReferences: ManualReference[] = [];
  private lastKnowledgeMode: 'curated_knowledge' | 'two_pass_rag_verified' | 'general_ai' = 'general_ai';
  private lastKnowledgeSources: string | null = null;
  private lastAttachments: AttachmentMetadata[] = [];

  constructor() {
    // Initialize with Barry's greeting - will be overridden by language-specific greeting from backend
    this.messages = [{
      role: 'assistant',
      content: "G'day! I'm Barry, your AI assistant and Unimog specialist. Been wrenching on these beasts for over 40 years, but I'm here to help with anything you need - weather forecasts, directions, general questions, or of course, any Unimog problems. What can I help you with today?",
      timestamp: new Date()
    }];
  }

  async sendMessage(message: string, location?: { latitude: number; longitude: number }, userLanguage?: string): Promise<{ content: string; manualReferences?: ManualReference[]; knowledgeMode?: 'curated_knowledge' | 'two_pass_rag_verified' | 'general_ai'; knowledgeSources?: string | null; attachments?: AttachmentMetadata[] }> {
    try {
      // Add user message to history
      this.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error('You must be logged in to chat with Barry');
      }

      // Get comprehensive user context for Barry
      let detectedLanguage = userLanguage;
      let userContext = null;

      try {
        // Fetch user profile and vehicles in parallel
        const [profileResult, vehiclesResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('language, full_name, bio, experience_level, preferred_terrain, location, unimog_model, unimog_year, unimog_modifications, unimog_series, mechanical_skills, certifications')
            .eq('id', session.user.id)
            .single(),
          supabase
            .from('vehicles')
            .select('year, model, vin, modifications, description')
            .eq('user_id', session.user.id)
        ]);

        // Set language preference
        if (!detectedLanguage && profileResult.data?.language) {
          detectedLanguage = profileResult.data.language;
        }

        // Build user context for Barry
        if (profileResult.data || vehiclesResult.data?.length) {
          const profile = profileResult.data;
          const vehicles = vehiclesResult.data || [];

          userContext = {
            profile: profile ? {
              name: profile.full_name,
              experienceLevel: profile.experience_level,
              preferredTerrain: profile.preferred_terrain,
              location: profile.location,
              bio: profile.bio,
              unimogModel: profile.unimog_model,
              unimogYear: profile.unimog_year,
              unimogModifications: profile.unimog_modifications,
              unimogSeries: profile.unimog_series,
              mechanicalSkills: profile.mechanical_skills,
              certifications: profile.certifications
            } : null,
            vehicles: vehicles.map(vehicle => ({
              year: vehicle.year,
              model: vehicle.model,
              vin: vehicle.vin,
              modifications: vehicle.modifications,
              description: vehicle.description
            }))
          };
        }
      } catch (error) {
        console.log('Could not fetch user context:', error);
      }

      // Search for relevant images based on the message
      const relevantImages = await this.searchRelevantImages(message);

      // Determine which Barry function to call based on environment
      // Staging uses agentic version for testing, production uses stable version
      const isStaging = window.location.hostname.includes('staging') ||
                       window.location.hostname.includes('localhost');
      const barryFunction = isStaging ? 'chat-with-barry-agentic' : 'chat-with-barry';

      console.log(`🤖 Calling Barry function: ${barryFunction} (${isStaging ? 'STAGING - Agentic' : 'PRODUCTION - Stable'})`);

      // Call the main Barry Edge Function
      const { data, error } = await supabase.functions.invoke(barryFunction, {
        body: {
          messages: this.messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          location: location
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        
        // Handle specific error cases
        if (error.message?.includes('Rate limit')) {
          throw new Error('Slow down there! I can only answer so fast. Give me a moment to catch up.');
        }
        
        throw new Error(error.message || 'Failed to get response from Barry');
      }

      if (!data?.content) {
        throw new Error('No response received from Barry');
      }

      // Store manual references if any
      if (data.manualReferences) {
        console.log('📚 Manual references received:', data.manualReferences);
        this.lastManualReferences = data.manualReferences;
      }

      // Store knowledge mode if provided
      if (data.knowledgeMode) {
        console.log('🎯 Knowledge mode:', data.knowledgeMode);
        this.lastKnowledgeMode = data.knowledgeMode;
      }

      // Store knowledge sources if provided
      if (data.knowledgeSources) {
        console.log('📖 Knowledge sources:', data.knowledgeSources);
        this.lastKnowledgeSources = data.knowledgeSources;
      }

      // Store attachments if provided
      if (data.attachments) {
        console.log(`📎 Attachments received: ${data.attachments.length} files`);
        this.lastAttachments = data.attachments;
      }

      // Extract referenced images from response
      const referencedImages = data?.images || [];

      // Add assistant response to history with images
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        images: referencedImages
      };
      this.messages.push(assistantMessage);

      return {
        content: data.content,
        manualReferences: data.manualReferences,
        knowledgeMode: data.knowledgeMode,
        knowledgeSources: data.knowledgeSources,
        attachments: data.attachments
      };
    } catch (error) {
      console.error('Chat error:', error);
      
      if (error instanceof Error) {
        // Return user-friendly error messages
        if (error.message.includes('logged in')) {
          throw new Error('You need to be logged in to chat with Barry. Please sign in first.');
        }
        throw error;
      }
      
      throw new Error('Something went wrong. Please try again.');
    }
  }

  getMessages(): ChatMessage[] {
    return this.messages;
  }

  getLastManualReferences(): ManualReference[] {
    return this.lastManualReferences;
  }

  getLastKnowledgeMode(): 'curated_knowledge' | 'two_pass_rag_verified' | 'general_ai' {
    return this.lastKnowledgeMode;
  }

  getLastKnowledgeSources(): string | null {
    return this.lastKnowledgeSources;
  }

  getLastAttachments(): AttachmentMetadata[] {
    return this.lastAttachments;
  }

  clearHistory(): void {
    // Keep Barry's initial greeting
    this.messages = [{
      role: 'assistant',
      content: "G'day! I'm Barry, your AI assistant and Unimog specialist. Been wrenching on these beasts for over 40 years, but I'm here to help with anything you need - weather forecasts, directions, general questions, or of course, any Unimog problems. What can I help you with today?",
      timestamp: new Date()
    }];
    this.lastManualReferences = [];
    this.lastKnowledgeMode = 'general_ai';
    this.lastKnowledgeSources = null;
    this.lastAttachments = [];
  }

  isConfigured(): boolean {
    // With Edge Functions, we just need to check if user is authenticated
    return true; // The Edge Function handles API key configuration
  }

  /**
   * Search for relevant images based on query text
   */
  async searchRelevantImages(query: string, manualId?: string): Promise<ImageReference[]> {
    try {
      // First, find relevant text chunks using the query
      const { data: chunks, error: chunksError } = await supabase
        .from('manual_chunks')
        .select('id, manual_id, content')
        .or(`content.ilike.%${query}%`)
        .limit(10);

      if (chunksError) {
        console.warn('Error searching text chunks:', chunksError);
      }

      // Extract chunk IDs to find related images
      const chunkIds = chunks?.map(chunk => chunk.id) || [];

      if (chunkIds.length === 0) {
        // Fallback: search images directly
        const { data, error } = await supabase
          .from('manual_images')
          .select('*')
          .limit(5);

        if (error) throw error;

        return (data || []).map(img => ({
          id: img.id,
          url: img.image_url || img.image_path,
          description: `Technical manual image`,
          type: 'diagram' as const,
          pageNumber: 1, // Default since we don't have page_number in current schema
          relevance: 0.6 // Lower relevance for fallback search
        }));
      }

      // Search for images linked to the relevant text chunks
      const { data, error } = await supabase
        .from('manual_images')
        .select('*')
        .in('chunk_id', chunkIds)
        .limit(5);

      if (error) throw error;

      return (data || []).map(img => ({
        id: img.id,
        url: img.image_url || img.image_path,
        description: `Technical diagram related to: ${query}`,
        type: 'diagram' as const,
        pageNumber: 1, // Default since we don't have page_number in current schema
        relevance: 0.8 // Higher relevance for chunk-linked images
      }));
    } catch (error) {
      console.error('Error searching images:', error);
      return [];
    }
  }
}

export const secureGeminiService = new SecureGeminiService();