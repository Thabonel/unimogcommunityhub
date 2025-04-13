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
      fuel_logs: {
        Row: {
          created_at: string
          currency: string
          fill_date: string
          fuel_amount: number
          fuel_price_per_unit: number
          fuel_station: string | null
          fuel_type: string
          full_tank: boolean | null
          id: string
          notes: string | null
          odometer: number
          total_cost: number
          updated_at: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          fill_date?: string
          fuel_amount: number
          fuel_price_per_unit: number
          fuel_station?: string | null
          fuel_type: string
          full_tank?: boolean | null
          id?: string
          notes?: string | null
          odometer: number
          total_cost: number
          updated_at?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          fill_date?: string
          fuel_amount?: number
          fuel_price_per_unit?: number
          fuel_station?: string | null
          fuel_type?: string
          full_tank?: boolean | null
          id?: string
          notes?: string | null
          odometer?: number
          total_cost?: number
          updated_at?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_logs: {
        Row: {
          completed_by: string | null
          cost: number | null
          created_at: string
          currency: string
          date: string
          id: string
          location: string | null
          maintenance_type: string
          notes: string | null
          odometer: number
          parts_replaced: string[] | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          completed_by?: string | null
          cost?: number | null
          created_at?: string
          currency?: string
          date: string
          id?: string
          location?: string | null
          maintenance_type: string
          notes?: string | null
          odometer: number
          parts_replaced?: string[] | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          completed_by?: string | null
          cost?: number | null
          created_at?: string
          currency?: string
          date?: string
          id?: string
          location?: string | null
          maintenance_type?: string
          notes?: string | null
          odometer?: number
          parts_replaced?: string[] | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_notification_settings: {
        Row: {
          created_at: string
          email_notifications: boolean
          id: string
          notification_frequency: string
          phone_number: string | null
          sms_notifications: boolean
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          notification_frequency?: string
          phone_number?: string | null
          sms_notifications?: boolean
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          notification_frequency?: string
          phone_number?: string | null
          sms_notifications?: boolean
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_notification_settings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
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
          unimog_wiki_data: Json | null
          unimog_year: string | null
          updated_at: string
          use_vehicle_photo_as_profile: boolean | null
          vehicle_photo_url: string | null
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
          unimog_wiki_data?: Json | null
          unimog_year?: string | null
          updated_at?: string
          use_vehicle_photo_as_profile?: boolean | null
          vehicle_photo_url?: string | null
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
          unimog_wiki_data?: Json | null
          unimog_year?: string | null
          updated_at?: string
          use_vehicle_photo_as_profile?: boolean | null
          vehicle_photo_url?: string | null
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
      track_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          track_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          track_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          track_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_comments_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          color: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string | null
          distance_km: number | null
          elevation_gain: number | null
          id: string
          is_public: boolean
          name: string
          segments: Json
          source_type: string
          trip_id: string | null
          visible: boolean
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          distance_km?: number | null
          elevation_gain?: number | null
          id?: string
          is_public?: boolean
          name: string
          segments: Json
          source_type: string
          trip_id?: string | null
          visible?: boolean
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          distance_km?: number | null
          elevation_gain?: number | null
          id?: string
          is_public?: boolean
          name?: string
          segments?: Json
          source_type?: string
          trip_id?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      trip_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_comments_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_coordinates: {
        Row: {
          coordinates: Json
          created_at: string
          id: string
          sequence_number: number
          trip_id: string
        }
        Insert: {
          coordinates: Json
          created_at?: string
          id?: string
          sequence_number: number
          trip_id: string
        }
        Update: {
          coordinates?: Json
          created_at?: string
          id?: string
          sequence_number?: number
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_coordinates_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_emergency_alerts: {
        Row: {
          alert_type: string
          coordinates: Json | null
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          issued_at: string
          severity: string
          source: string | null
          title: string
          trip_id: string
        }
        Insert: {
          alert_type: string
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          issued_at: string
          severity: string
          source?: string | null
          title: string
          trip_id: string
        }
        Update: {
          alert_type?: string
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string
          severity?: string
          source?: string | null
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_emergency_alerts_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_weather_data: {
        Row: {
          created_at: string
          forecast_date: string
          id: string
          trip_id: string
          updated_at: string
          weather_data: Json
        }
        Insert: {
          created_at?: string
          forecast_date: string
          id?: string
          trip_id: string
          updated_at?: string
          weather_data: Json
        }
        Update: {
          created_at?: string
          forecast_date?: string
          id?: string
          trip_id?: string
          updated_at?: string
          weather_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "trip_weather_data_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          is_public: boolean
          name: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_public?: boolean
          name: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_public?: boolean
          name?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      unimog_models: {
        Row: {
          capabilities: string | null
          created_at: string
          features: Json | null
          history: string | null
          id: string
          model_code: string
          name: string
          series: string
          specs: Json
          updated_at: string
          wiki_data: Json | null
        }
        Insert: {
          capabilities?: string | null
          created_at?: string
          features?: Json | null
          history?: string | null
          id?: string
          model_code: string
          name: string
          series: string
          specs?: Json
          updated_at?: string
          wiki_data?: Json | null
        }
        Update: {
          capabilities?: string | null
          created_at?: string
          features?: Json | null
          history?: string | null
          id?: string
          model_code?: string
          name?: string
          series?: string
          specs?: Json
          updated_at?: string
          wiki_data?: Json | null
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
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          starts_at: string
          subscription_level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string
          subscription_level?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string
          subscription_level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_trials: {
        Row: {
          converted_to_subscription: boolean
          created_at: string
          email_sent_at: string | null
          expires_at: string
          id: string
          is_active: boolean
          started_at: string
          user_id: string
        }
        Insert: {
          converted_to_subscription?: boolean
          created_at?: string
          email_sent_at?: string | null
          expires_at: string
          id?: string
          is_active?: boolean
          started_at?: string
          user_id: string
        }
        Update: {
          converted_to_subscription?: boolean
          created_at?: string
          email_sent_at?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          created_at: string
          current_odometer: number
          id: string
          license_plate: string | null
          model: string
          name: string
          odometer_unit: string
          thumbnail_url: string | null
          updated_at: string
          user_id: string
          vin: string | null
          year: string
        }
        Insert: {
          created_at?: string
          current_odometer: number
          id?: string
          license_plate?: string | null
          model: string
          name: string
          odometer_unit: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
          vin?: string | null
          year: string
        }
        Update: {
          created_at?: string
          current_odometer?: number
          id?: string
          license_plate?: string | null
          model?: string
          name?: string
          odometer_unit?: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
          vin?: string | null
          year?: string
        }
        Relationships: []
      }
      visitor_analytics: {
        Row: {
          converted_to_subscription: boolean
          converted_to_trial: boolean
          id: string
          metadata: Json | null
          referrer: string | null
          session_id: string
          signed_up: boolean
          user_id: string | null
          visited_at: string
        }
        Insert: {
          converted_to_subscription?: boolean
          converted_to_trial?: boolean
          id?: string
          metadata?: Json | null
          referrer?: string | null
          session_id: string
          signed_up?: boolean
          user_id?: string | null
          visited_at?: string
        }
        Update: {
          converted_to_subscription?: boolean
          converted_to_trial?: boolean
          id?: string
          metadata?: Json | null
          referrer?: string | null
          session_id?: string
          signed_up?: boolean
          user_id?: string | null
          visited_at?: string
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
        Relationships: []
      }
    }
    Functions: {
      create_conversation: {
        Args: { user1_id: string; user2_id: string }
        Returns: string
      }
      decrement_feedback_votes: {
        Args: Record<PropertyKey, never> | { feedback_id: string }
        Returns: undefined
      }
      get_trending_content: {
        Args:
          | Record<PropertyKey, never>
          | { content_type: string; time_ago: string; result_limit?: number }
        Returns: {
          content_id: number
          content_title: string
        }[]
      }
      get_unread_message_count: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: number
      }
      has_active_subscription: {
        Args: { user_id: string }
        Returns: boolean
      }
      has_role: {
        Args:
          | { role_name: string }
          | Record<PropertyKey, never>
          | { user_id: number; role_name: string }
          | { _role: Database["public"]["Enums"]["app_role"] }
          | { user_id: string; role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      increment_feedback_votes: {
        Args: { feedback_id: string }
        Returns: undefined
      }
      is_trial_active: {
        Args: { user_id: string } | Record<PropertyKey, never>
        Returns: boolean
      }
      mark_conversation_as_read: {
        Args: { conversation_id: number } | { conversation_id: string }
        Returns: undefined
      }
      mark_message_as_read: {
        Args:
          | Record<PropertyKey, never>
          | { message_id: number }
          | { message_id: string }
        Returns: undefined
      }
      start_user_trial: {
        Args: { p_user_id: string; p_started_at: string; p_expires_at: string }
        Returns: {
          converted_to_subscription: boolean
          created_at: string
          email_sent_at: string | null
          expires_at: string
          id: string
          is_active: boolean
          started_at: string
          user_id: string
        }[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
