
import { format } from 'date-fns';
import { Message } from '@/types/message';

interface MessageThreadProps {
  messages: Message[];
}

const MessageThread = ({ messages }: MessageThreadProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => (
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
        ))
      )}
    </div>
  );
};

export default MessageThread;
