
export interface ArticleAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface ArticleData {
  id: string;
  title: string;
  content: string;
  originalFileUrl?: string;
  author: ArticleAuthor;
  publishedAt: string;
  readingTime: number;
  likes: number;
  views: number;
  categories: string[];
  isSaved?: boolean;
}
