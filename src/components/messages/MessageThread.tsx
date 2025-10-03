
import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Message } from '@/types/message';
import { Check, CheckCheck } from 'lucide-react';

interface MessageThreadProps {
  messages: Message[];
  otherUserLastSeen?: Date | null;
}

const MessageThread = ({ messages, otherUserLastSeen }: MessageThreadProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if message was read (for sent messages only)
  const isMessageRead = (message: Message) => {
    if (!message.isCurrentUser || !otherUserLastSeen) return false;
    return message.timestamp <= otherUserLastSeen;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            const isRead = isMessageRead(message);
            const isLastMessage = index === messages.length - 1;
            const showReadReceipt = message.isCurrentUser && isLastMessage && isRead;

            return (
              <div
                key={message.id}
                className={`flex flex-col ${message.isCurrentUser ? 'items-end' : 'items-start'} gap-1`}
              >
                <div className={`max-w-[80%] ${message.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-accent'} rounded-lg p-3`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <p className="text-xs opacity-70">
                      {format(message.timestamp, 'h:mm a')}
                    </p>
                    {message.isCurrentUser && (
                      <span className={isRead ? "text-blue-400" : "opacity-70"}>
                        {isRead ? (
                          <CheckCheck className="h-3.5 w-3.5" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
                {showReadReceipt && (
                  <span className="text-xs text-muted-foreground italic">
                    Seen
                  </span>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageThread;
