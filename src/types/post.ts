export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile: {
    avatar_url: string | null;
    full_name: string | null;
    display_name: string | null;
  };
  likes_count: number;
  liked_by_user: boolean;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  video_url?: string | null;
  link_url?: string | null;
  link_title?: string | null;
  link_description?: string | null;
  link_image?: string | null;
  visibility?: 'public' | 'private' | 'friends';
  post_type?: 'text' | 'image' | 'video' | 'link' | 'poll';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PostWithUser extends Post {
  profile: {
    id?: string;
    avatar_url: string | null;
    full_name: string | null;
    display_name: string | null;
    unimog_model: string | null;
    location: string | null;
    online: boolean;
  };
  likes_count: number;
  comments_count: number;
  shares_count: number;
  liked_by_user: boolean;
  shared_by_user: boolean;
}

// Post from database view with stats
export interface PostWithStats {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  visibility: string | null;
  post_type: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  // User info from profiles join
  avatar_url: string | null;
  full_name: string | null;
  display_name: string | null;
  unimog_model: string | null;
  location: string | null;
  online: boolean | null;
  // Aggregated stats
  likes_count: number;
  comments_count: number;
  shares_count: number;
}
