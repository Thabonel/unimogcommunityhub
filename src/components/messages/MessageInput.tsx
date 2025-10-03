
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  conversationId?: string;
}

const MessageInput = ({ onSendMessage, conversationId }: MessageInputProps) => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Broadcast typing status
  const broadcastTyping = (isTyping: boolean) => {
    if (!user || !conversationId) return;

    const channel = supabase.channel(`conversation:${conversationId}`);

    if (isTyping) {
      channel.track({ user_id: user.id, typing: true });
    } else {
      channel.untrack();
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageText(value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Broadcast typing
    if (value.length > 0) {
      broadcastTyping(true);

      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        broadcastTyping(false);
      }, 3000);
    } else {
      broadcastTyping(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && !isSending) {
      broadcastTyping(false); // Stop typing indicator
      setIsSending(true);
      await onSendMessage(messageText);
      setMessageText('');
      setIsSending(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      broadcastTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <Input
          data-message-input
          placeholder="Type your message..."
          value={messageText}
          onChange={handleInputChange}
          className="flex-1"
          disabled={isSending}
        />
        <Button 
          type="submit"
          disabled={!messageText.trim() || isSending}
          className="flex items-center gap-2"
        >
          <Send size={16} />
          Send
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
