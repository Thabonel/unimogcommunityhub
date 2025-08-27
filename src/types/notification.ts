export interface Notification {
  id: string;
  user_id: string;
  type: 'post_comment' | 'post_like' | 'marketplace' | 'message' | 'trip' | 'system' | 'achievement';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
  metadata?: {
    sender_id?: string;
    sender_name?: string;
    post_id?: string;
    listing_id?: string;
    trip_id?: string;
    [key: string]: any;
  };
}

export interface NotificationPreferences {
  email_enabled: boolean;
  push_enabled: boolean;
  post_notifications: boolean;
  marketplace_notifications: boolean;
  message_notifications: boolean;
  trip_notifications: boolean;
  system_notifications: boolean;
}

export interface CreateNotificationInput {
  user_id: string;
  type: Notification['type'];
  title: string;
  message: string;
  link?: string;
  metadata?: Notification['metadata'];
}