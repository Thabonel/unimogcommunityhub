
export interface User {
  name: string;
  avatar: string | null;
  online: boolean;
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
