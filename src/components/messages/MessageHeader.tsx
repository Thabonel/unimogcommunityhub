
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Conversation } from '@/types/message';
import { MapPin, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface MessageHeaderProps {
  conversation: Conversation;
  lastSeen?: Date | null;
}

const MessageHeader = ({ conversation, lastSeen }: MessageHeaderProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  // Format last seen text
  const getLastSeenText = () => {
    if (conversation.user.online) return null;
    if (!lastSeen) return null;

    const distance = formatDistanceToNow(lastSeen, { addSuffix: true });
    return `Last seen ${distance}`;
  };

  // Listen for typing indicators
  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel(`conversation:${conversation.id}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Check if other user is typing
        const otherUserTyping = Object.values(state).some((presences: any) => {
          return presences.some((presence: any) =>
            presence.user_id === conversation.user.id && presence.typing
          );
        });
        setIsTyping(otherUserTyping);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id, conversation.user.id, user]);
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.user.avatar || undefined} alt={conversation.user.name} />
          <AvatarFallback className="bg-military-olive text-military-sand">
            {conversation.user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{conversation.user.name}</h3>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            {isTyping ? (
              <span className="text-primary font-medium flex items-center gap-1.5">
                <span className="animate-pulse">typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </span>
            ) : conversation.user.online ? (
              <span className="text-green-500 font-medium">● Online</span>
            ) : getLastSeenText() ? (
              <span className="text-gray-500">{getLastSeenText()}</span>
            ) : (
              <span className="text-gray-500">Offline</span>
            )}
            
            {conversation.user.unimogModel && (
              <>
                <span className="text-gray-400">•</span>
                <span>{conversation.user.unimogModel}</span>
              </>
            )}
            
            {conversation.user.location && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <MapPin size={12} />
                      <span className="truncate max-w-[100px]">{conversation.user.location}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Location: {conversation.user.location}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
      
      {conversation.user.bio && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info size={16} className="text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p>{conversation.user.bio}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default MessageHeader;
