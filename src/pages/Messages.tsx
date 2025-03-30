
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, Send, Plus } from 'lucide-react';
import { format } from 'date-fns';

// Mock user data
const mockUser = {
  name: 'John Doe',
  avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
  unimogModel: 'U1700L'
};

// Mock conversation data
const MOCK_CONVERSATIONS = [
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
const MOCK_MESSAGES = [
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
    timestamp: new Date(2023, 10, 15, 14, 0), // Fixed: Changed 14, 00 to 14, 0
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

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(MOCK_CONVERSATIONS[0]);
  const [messageText, setMessageText] = useState('');
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // In a real app, this would send the message to a backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-6">
        <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-6">
          Messages
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations Sidebar */}
          <Card className="lg:col-span-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search conversations..." 
                  className="pl-8" 
                />
              </div>
              <Button className="w-full flex items-center gap-2">
                <Plus size={16} />
                New Message
              </Button>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {MOCK_CONVERSATIONS.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-3 cursor-pointer flex items-center gap-3 hover:bg-accent relative ${
                    activeConversation.id === conversation.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{conversation.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {conversation.user.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-medium truncate">{conversation.user.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {format(conversation.timestamp, 'h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  
                  {conversation.unread > 0 && (
                    <div className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
          
          {/* Message Thread */}
          <Card className="lg:col-span-2 flex flex-col overflow-hidden">
            {/* Conversation Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{activeConversation.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{activeConversation.user.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {activeConversation.user.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {MOCK_MESSAGES.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-accent'} rounded-lg p-3`}>
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {format(message.timestamp, 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input 
                  placeholder="Type your message..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit"
                  disabled={!messageText.trim()}
                  className="flex items-center gap-2"
                >
                  <Send size={16} />
                  Send
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
