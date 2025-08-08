export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
      visitor_analytics: {
        Row: {
          id: string
          session_id: string
          visited_at: string
          signed_up: boolean
          referrer: string | null
          converted_to_trial: boolean
          converted_to_subscription: boolean
          metadata: Json
        }
        Insert: {
          id?: string
          session_id: string
          visited_at?: string
          signed_up?: boolean
          referrer?: string | null
          converted_to_trial?: boolean
          converted_to_subscription?: boolean
          metadata?: Json
        }
        Update: {
          id?: string
          session_id?: string
          visited_at?: string
          signed_up?: boolean
          referrer?: string | null
          converted_to_trial?: boolean
          converted_to_subscription?: boolean
          metadata?: Json
        }
        Relationships: []
      }
      user_trials: {
        Row: {
          id: string
          user_id: string
          started_at: string
          expires_at: string
          is_active: boolean
          email_sent_at: string | null
          converted_to_subscription: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          started_at?: string
          expires_at: string
          is_active?: boolean
          email_sent_at?: string | null
          converted_to_subscription?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          started_at?: string
          expires_at?: string
          is_active?: boolean
          email_sent_at?: string | null
          converted_to_subscription?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_trials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string
          id: string
          plan_id: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_id?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_id?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_trial_active: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
