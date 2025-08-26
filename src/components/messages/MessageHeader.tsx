
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Conversation } from '@/types/message';
import { MapPin, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MessageHeaderProps {
  conversation: Conversation;
}

const MessageHeader = ({ conversation }: MessageHeaderProps) => {
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
            <span className={conversation.user.online ? "text-green-500" : "text-gray-500"}>
              {conversation.user.online ? 'Online' : 'Offline'}
            </span>
            
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
