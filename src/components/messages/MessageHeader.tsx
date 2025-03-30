
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Conversation } from '@/types/message';

interface MessageHeaderProps {
  conversation: Conversation;
}

const MessageHeader = ({ conversation }: MessageHeaderProps) => {
  return (
    <div className="p-4 border-b flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={conversation.user.avatar || undefined} alt={conversation.user.name} />
        <AvatarFallback>{conversation.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold">{conversation.user.name}</h3>
        <p className="text-xs text-muted-foreground">
          {conversation.user.online ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
};

export default MessageHeader;
