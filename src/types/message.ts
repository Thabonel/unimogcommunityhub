
import { UserProfile } from './user';

export interface User {
  id: string;
  name: string;
  avatar: string | null;
  online: boolean;
  unimogModel?: string | null;
  location?: string | null;
  bio?: string | null;
}

export interface Author extends User {
  id: string;
  name: string;
  avatar: string | null;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

// Database related interfaces for Supabase
export interface DBMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface DBConversation {
  id: string;
  updated_at: string;
  messages?: DBMessage[];
  conversation_participants?: { user_id: string }[];
}
