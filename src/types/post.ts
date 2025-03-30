
export interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
  video_url?: string | null;
  link_url?: string | null;
  link_title?: string | null;
  link_description?: string | null;
  link_image?: string | null;
}

export interface PostWithUser extends Post {
  profile: {
    avatar_url: string | null;
    full_name: string | null;
    display_name: string | null;
    unimog_model: string | null;
    location: string | null;
    online: boolean | null;
  };
  likes_count: number;
  comments_count: number;
  shares_count: number;
  liked_by_user: boolean;
  shared_by_user: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: {
    avatar_url: string | null;
    full_name: string | null;
    display_name: string | null;
  };
  likes_count?: number;
  liked_by_user?: boolean;
}
