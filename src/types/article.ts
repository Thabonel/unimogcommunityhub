
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  published_at: string;
  reading_time: number;
  cover_image?: string;
  source_url?: string;
}
