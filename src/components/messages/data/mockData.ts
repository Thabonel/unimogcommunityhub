
import { Conversation, Message } from '@/types/message';

// Mock conversation data
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    user: {
      name: 'Alex Weber',
      avatar: null,
      online: true,
    },
    lastMessage: 'Thanks for the advice on the suspension upgrade.',
    timestamp: new Date(2023, 10, 15, 14, 30),
    unread: 2,
  },
  {
    id: '2',
    user: {
      name: 'Sarah Johnson',
      avatar: null,
      online: false,
    },
    lastMessage: 'Will you be attending the Unimog meetup next month?',
    timestamp: new Date(2023, 10, 14, 9, 45),
    unread: 0,
  },
  {
    id: '3',
    user: {
      name: 'Mike Thompson',
      avatar: null,
      online: true,
    },
    lastMessage: 'I found those brake parts we were discussing.',
    timestamp: new Date(2023, 10, 13, 16, 20),
    unread: 0,
  },
];

// Mock messages for the active conversation
export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'Alex Weber',
    content: 'Hey John, I wanted to ask about the suspension upgrade you did on your U1700L.',
    timestamp: new Date(2023, 10, 15, 13, 45),
    isCurrentUser: false,
  },
  {
    id: '2',
    sender: 'John Doe',
    content: 'Hi Alex! Sure, I used the heavy-duty springs from Off-Road Solutions. They increased the load capacity by about 30%.',
    timestamp: new Date(2023, 10, 15, 13, 50),
    isCurrentUser: true,
  },
  {
    id: '3',
    sender: 'Alex Weber',
    content: 'That sounds perfect for what I need. Was the installation straightforward?',
    timestamp: new Date(2023, 10, 15, 13, 55),
    isCurrentUser: false,
  },
  {
    id: '4',
    sender: 'John Doe',
    content: 'Yes, it was fairly straightforward. You\'ll need a proper lift and some specific tools though. I can send you the installation guide if you want.',
    timestamp: new Date(2023, 10, 15, 14, 0), 
    isCurrentUser: true,
  },
  {
    id: '5',
    sender: 'Alex Weber',
    content: 'That would be great! Thanks for the advice on the suspension upgrade.',
    timestamp: new Date(2023, 10, 15, 14, 30),
    isCurrentUser: false,
  },
];

// Mock user data
export const MOCK_USER = {
  name: 'John Doe',
  avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
  unimogModel: 'U1700L'
};
