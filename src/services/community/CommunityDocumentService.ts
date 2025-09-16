import { supabase } from '@/lib/supabase-client';

export interface CommunityDocument {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string;
  document_type: 'powerpoint' | 'excel' | 'pdf' | 'checklist' | 'procedure';
  file_name: string;
  file_path: string;
  file_size?: number;
  created_by: string;
  is_public: boolean;
  download_count: number;
  rating_sum: number;
  rating_count: number;
  rating_average: number;
  vehicle_models: string[];
  categories: string[];
  tags: string[];
  original_query?: string;
  generation_method: string;

  // Joined data
  creator_name?: string;
  signed_url?: string;
}

export interface DocumentRating {
  id: string;
  created_at: string;
  document_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
}

export interface DocumentSearchOptions {
  query?: string;
  document_type?: string;
  vehicle_models?: string[];
  categories?: string[];
  tags?: string[];
  sort_by?: 'created_at' | 'rating_average' | 'download_count' | 'title';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface DocumentUploadData {
  title: string;
  description?: string;
  document_type: 'powerpoint' | 'excel' | 'pdf' | 'checklist' | 'procedure';
  file: File;
  is_public?: boolean;
  vehicle_models?: string[];
  categories?: string[];
  tags?: string[];
  original_query?: string;
}

export class CommunityDocumentService {
  private static instance: CommunityDocumentService;

  static getInstance(): CommunityDocumentService {
    if (!CommunityDocumentService.instance) {
      CommunityDocumentService.instance = new CommunityDocumentService();
    }
    return CommunityDocumentService.instance;
  }

  /**
   * Upload a document to the community library
   */
  async uploadDocument(data: DocumentUploadData): Promise<CommunityDocument | null> {
    try {
      // Upload file to Supabase Storage
      const fileExt = data.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `community-documents/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, data.file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        return null;
      }

      // Create document record
      const { data: document, error: dbError } = await supabase
        .from('community_documents')
        .insert({
          title: data.title,
          description: data.description,
          document_type: data.document_type,
          file_name: data.file.name,
          file_path: filePath,
          file_size: data.file.size,
          is_public: data.is_public ?? true,
          vehicle_models: data.vehicle_models || [],
          categories: data.categories || [],
          tags: data.tags || [],
          original_query: data.original_query,
        })
        .select('*')
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Clean up uploaded file
        await supabase.storage.from('documents').remove([filePath]);
        return null;
      }

      return document;
    } catch (error) {
      console.error('Upload document error:', error);
      return null;
    }
  }

  /**
   * Search community documents
   */
  async searchDocuments(options: DocumentSearchOptions = {}): Promise<CommunityDocument[]> {
    try {
      let query = supabase
        .from('community_documents')
        .select(`
          *,
          profiles(display_name, full_name)
        `)
        .eq('is_public', true);

      // Apply filters
      if (options.query) {
        query = query.textSearch('search_vector', options.query);
      }

      if (options.document_type) {
        query = query.eq('document_type', options.document_type);
      }

      if (options.vehicle_models?.length) {
        query = query.overlaps('vehicle_models', options.vehicle_models);
      }

      if (options.categories?.length) {
        query = query.overlaps('categories', options.categories);
      }

      if (options.tags?.length) {
        query = query.overlaps('tags', options.tags);
      }

      // Apply sorting
      const sortBy = options.sort_by || 'created_at';
      const sortOrder = options.sort_order || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Search documents error:', error);
        return [];
      }

      // Add creator names and generate signed URLs
      const documents = await Promise.all(
        (data || []).map(async (doc: any) => {
          const signedUrl = await this.getSignedUrl(doc.file_path);
          return {
            ...doc,
            creator_name: doc.profiles?.display_name || doc.profiles?.full_name || 'Unknown',
            signed_url: signedUrl,
          };
        })
      );

      return documents;
    } catch (error) {
      console.error('Search documents error:', error);
      return [];
    }
  }

  /**
   * Get popular documents (most downloaded or highest rated)
   */
  async getPopularDocuments(limit: number = 10, sortBy: 'downloads' | 'rating' = 'downloads'): Promise<CommunityDocument[]> {
    const sortField = sortBy === 'downloads' ? 'download_count' : 'rating_average';
    return this.searchDocuments({
      sort_by: sortField as any,
      sort_order: 'desc',
      limit,
    });
  }

  /**
   * Get recent documents
   */
  async getRecentDocuments(limit: number = 10): Promise<CommunityDocument[]> {
    return this.searchDocuments({
      sort_by: 'created_at',
      sort_order: 'desc',
      limit,
    });
  }

  /**
   * Get user's documents
   */
  async getUserDocuments(userId?: string, includePrivate: boolean = false): Promise<CommunityDocument[]> {
    try {
      let query = supabase
        .from('community_documents')
        .select('*');

      if (userId) {
        query = query.eq('created_by', userId);
      } else {
        // Get current user's documents
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        query = query.eq('created_by', user.id);
      }

      if (!includePrivate) {
        query = query.eq('is_public', true);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Get user documents error:', error);
        return [];
      }

      // Generate signed URLs
      const documents = await Promise.all(
        (data || []).map(async (doc) => {
          const signedUrl = await this.getSignedUrl(doc.file_path);
          return {
            ...doc,
            signed_url: signedUrl,
          };
        })
      );

      return documents;
    } catch (error) {
      console.error('Get user documents error:', error);
      return [];
    }
  }

  /**
   * Download a document (increment download count)
   */
  async downloadDocument(documentId: string): Promise<string | null> {
    try {
      // Get document
      const { data: document, error } = await supabase
        .from('community_documents')
        .select('file_path, download_count')
        .eq('id', documentId)
        .single();

      if (error || !document) {
        console.error('Get document error:', error);
        return null;
      }

      // Increment download count
      await supabase
        .from('community_documents')
        .update({ download_count: document.download_count + 1 })
        .eq('id', documentId);

      // Get signed URL
      return this.getSignedUrl(document.file_path);
    } catch (error) {
      console.error('Download document error:', error);
      return null;
    }
  }

  /**
   * Rate a document
   */
  async rateDocument(documentId: string, rating: number, reviewText?: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('document_ratings')
        .upsert({
          document_id: documentId,
          user_id: user.id,
          rating,
          review_text: reviewText,
        });

      if (error) {
        console.error('Rate document error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Rate document error:', error);
      return false;
    }
  }

  /**
   * Get user's rating for a document
   */
  async getUserRating(documentId: string): Promise<DocumentRating | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('document_ratings')
        .select('*')
        .eq('document_id', documentId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Get user rating error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get user rating error:', error);
      return null;
    }
  }

  /**
   * Get ratings for a document
   */
  async getDocumentRatings(documentId: string, limit: number = 10): Promise<DocumentRating[]> {
    try {
      const { data, error } = await supabase
        .from('document_ratings')
        .select(`
          *,
          profiles(display_name, full_name)
        `)
        .eq('document_id', documentId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Get document ratings error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get document ratings error:', error);
      return [];
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      // Get document to get file path
      const { data: document, error: getError } = await supabase
        .from('community_documents')
        .select('file_path, created_by')
        .eq('id', documentId)
        .single();

      if (getError || !document) {
        console.error('Get document for deletion error:', getError);
        return false;
      }

      // Verify user owns the document
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== document.created_by) {
        console.error('User not authorized to delete document');
        return false;
      }

      // Delete from database (this will cascade delete ratings)
      const { error: deleteError } = await supabase
        .from('community_documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) {
        console.error('Delete document error:', deleteError);
        return false;
      }

      // Delete file from storage
      await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      return true;
    } catch (error) {
      console.error('Delete document error:', error);
      return false;
    }
  }

  /**
   * Get signed URL for file download
   */
  private async getSignedUrl(filePath: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) {
        console.error('Create signed URL error:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Get signed URL error:', error);
      return null;
    }
  }

  /**
   * Get popular categories
   */
  async getPopularCategories(): Promise<{ category: string; count: number }[]> {
    try {
      // This would need a custom SQL function to unnest arrays and count
      // For now, return hardcoded popular categories
      return [
        { category: 'hydraulics', count: 45 },
        { category: 'engine', count: 38 },
        { category: 'transmission', count: 32 },
        { category: 'electrical', count: 28 },
        { category: 'brakes', count: 24 },
        { category: 'suspension', count: 18 },
      ];
    } catch (error) {
      console.error('Get popular categories error:', error);
      return [];
    }
  }

  /**
   * Get popular vehicle models
   */
  async getPopularVehicleModels(): Promise<{ model: string; count: number }[]> {
    try {
      // This would need a custom SQL function to unnest arrays and count
      // For now, return hardcoded popular models
      return [
        { model: 'U1700L', count: 65 },
        { model: 'U1300L', count: 48 },
        { model: 'U5000', count: 32 },
        { model: 'U4000', count: 28 },
        { model: 'U2400', count: 22 },
        { model: 'U1450L', count: 18 },
      ];
    } catch (error) {
      console.error('Get popular vehicle models error:', error);
      return [];
    }
  }
}

export const communityDocumentService = CommunityDocumentService.getInstance();