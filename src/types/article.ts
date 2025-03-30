
export interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  published_at: string;
  reading_time: number;
  is_archived: boolean;
  is_approved: boolean;
  source_url?: string | null;
  original_file_url?: string | null;
  cover_image?: string | null;
  created_at?: string;
  order?: number;
}
