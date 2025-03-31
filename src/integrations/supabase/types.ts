export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blocked_emails: {
        Row: {
          blocked_at: string
          blocked_by: string | null
          email: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_at?: string
          blocked_by?: string | null
          email: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_at?: string
          blocked_by?: string | null
          email?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_articles: {
        Row: {
          author_id: string
          author_name: string
          category: string
          content: string
          cover_image: string | null
          excerpt: string
          id: string
          is_approved: boolean | null
          is_archived: boolean | null
          likes: number | null
          order: number | null
          original_file_url: string | null
          published_at: string | null
          reading_time: number | null
          source_url: string | null
          title: string
          views: number | null
        }
        Insert: {
          author_id: string
          author_name: string
          category: string
          content: string
          cover_image?: string | null
          excerpt: string
          id?: string
          is_approved?: boolean | null
          is_archived?: boolean | null
          likes?: number | null
          order?: number | null
          original_file_url?: string | null
          published_at?: string | null
          reading_time?: number | null
          source_url?: string | null
          title: string
          views?: number | null
        }
        Update: {
          author_id?: string
          author_name?: string
          category?: string
          content?: string
          cover_image?: string | null
          excerpt?: string
          id?: string
          is_approved?: boolean | null
          is_archived?: boolean | null
          likes?: number | null
          order?: number | null
          original_file_url?: string | null
          published_at?: string | null
          reading_time?: number | null
          source_url?: string | null
          title?: string
          views?: number | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          id: string
          updated_at: string
        }
        Insert: {
          id?: string
          updated_at?: string
        }
        Update: {
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          rating: number | null
          status: string | null
          type: string
          user_id: string | null
          votes: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          rating?: number | null
          status?: string | null
          type: string
          user_id?: string | null
          votes?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          rating?: number | null
          status?: string | null
          type?: string
          user_id?: string | null
          votes?: number | null
        }
        Relationships: []
      }
      feedback_votes: {
        Row: {
          created_at: string
          feedback_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_votes_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      manuals: {
        Row: {
          approved: boolean | null
          created_at: string | null
          description: string
          file_path: string
          file_size: number
          id: string
          pages: number | null
          submitted_by: string
          title: string
          updated_at: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          description: string
          file_path: string
          file_size: number
          id?: string
          pages?: number | null
          submitted_by: string
          title: string
          updated_at?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          description?: string
          file_path?: string
          file_size?: number
          id?: string
          pages?: number | null
          submitted_by?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          reference_id: string | null
          reference_type: string | null
          sender_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          reference_id?: string | null
          reference_type?: string | null
          sender_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          reference_id?: string | null
          reference_type?: string | null
          sender_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_shares: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banned_until: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          currency: string | null
          display_name: string | null
          email: string | null
          experience_level: string | null
          full_name: string | null
          id: string
          location: string | null
          online: boolean | null
          phone_number: string | null
          postal_code: string | null
          state: string | null
          street_address: string | null
          unimog_model: string | null
          unimog_modifications: string | null
          unimog_year: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          banned_until?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          online?: boolean | null
          phone_number?: string | null
          postal_code?: string | null
          state?: string | null
          street_address?: string | null
          unimog_model?: string | null
          unimog_modifications?: string | null
          unimog_year?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          banned_until?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          online?: boolean | null
          phone_number?: string | null
          postal_code?: string | null
          state?: string | null
          street_address?: string | null
          unimog_model?: string | null
          unimog_modifications?: string | null
          unimog_year?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reddit_articles: {
        Row: {
          author_id: string | null
          author_name: string | null
          category: string | null
          content: string | null
          coverImage: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          likes: number | null
          published_at: string | null
          reading_time: number | null
          subreddit: string | null
          title: string
          url: string | null
          views: number | null
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content?: string | null
          coverImage?: string | null
          created_at?: string | null
          excerpt?: string | null
          id: string
          likes?: number | null
          published_at?: string | null
          reading_time?: number | null
          subreddit?: string | null
          title: string
          url?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category?: string | null
          content?: string | null
          coverImage?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          likes?: number | null
          published_at?: string | null
          reading_time?: number | null
          subreddit?: string | null
          title?: string
          url?: string | null
          views?: number | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          event_data: Json | null
          event_id: string | null
          event_type: string
          id: string
          page: string | null
          session_id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          event_data?: Json | null
          event_id?: string | null
          event_type: string
          id?: string
          page?: string | null
          session_id: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          event_data?: Json | null
          event_id?: string | null
          event_type?: string
          id?: string
          page?: string | null
          session_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_details: {
        Row: {
          avatar_url: string | null
          banned_until: string | null
          bio: string | null
          display_name: string | null
          email: string | null
          experience_level: string | null
          full_name: string | null
          id: string | null
          is_admin: boolean | null
          location: string | null
          online: boolean | null
          unimog_model: string | null
          unimog_modifications: string | null
          unimog_year: string | null
        }
        Insert: {
          avatar_url?: string | null
          banned_until?: string | null
          bio?: string | null
          display_name?: string | null
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string | null
          is_admin?: never
          location?: string | null
          online?: boolean | null
          unimog_model?: string | null
          unimog_modifications?: string | null
          unimog_year?: string | null
        }
        Update: {
          avatar_url?: string | null
          banned_until?: string | null
          bio?: string | null
          display_name?: string | null
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string | null
          is_admin?: never
          location?: string | null
          online?: boolean | null
          unimog_model?: string | null
          unimog_modifications?: string | null
          unimog_year?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_conversation: {
        Args: {
          user1_id: string
          user2_id: string
        }
        Returns: string
      }
      decrement_feedback_votes: {
        Args: {
          feedback_id: string
        }
        Returns: undefined
      }
      get_trending_content: {
        Args: {
          content_type: string
          time_ago: string
          result_limit?: number
        }
        Returns: {
          content_id: string
          engagement_count: number
        }[]
      }
      get_unread_message_count: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_feedback_votes: {
        Args: {
          feedback_id: string
        }
        Returns: undefined
      }
      mark_conversation_as_read: {
        Args: {
          conversation_id: string
        }
        Returns: number
      }
      mark_message_as_read: {
        Args: {
          message_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
