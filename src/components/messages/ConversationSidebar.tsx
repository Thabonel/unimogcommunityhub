
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Conversation } from '@/types/message';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationSidebar = ({ 
  conversations, 
  activeConversation, 
  onSelectConversation 
}: ConversationSidebarProps) => {
  return (
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
        {conversations.map((conversation) => (
          <div 
            key={conversation.id}
            className={`p-3 cursor-pointer flex items-center gap-3 hover:bg-accent relative ${
              activeConversation.id === conversation.id ? 'bg-accent' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
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
  );
};

export default ConversationSidebar;
