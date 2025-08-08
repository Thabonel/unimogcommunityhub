
import { User } from "@supabase/supabase-js";

// Types for analytics data
export interface UserActivity {
  event_id?: string;
  user_id?: string | null;
  event_type: ActivityEventType;
  event_data?: Record<string, any>;
  page?: string;
  timestamp?: string;
  session_id: string;
}

export type ActivityEventType = 
  | 'page_view'
  | 'post_create'
  | 'post_like' 
  | 'post_unlike'
  | 'post_comment'
  | 'post_share'
  | 'session_start'
  | 'session_end'
  | 'profile_view'
  | 'search'
  | 'link_click'
  | 'video_play'
  | 'feature_use'
  | 'feedback_submit'
  | 'survey_shown'
  | 'survey_completed'
  | 'survey_dismissed'
  | 'experiment_view'
  | 'experiment_conversion';

// Experiment types
export type ExperimentVariant = 'control' | 'variant_a' | 'variant_b' | 'variant_c';

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  variants: ExperimentVariant[];
  weightings?: Record<ExperimentVariant, number>;
  active: boolean;
}
