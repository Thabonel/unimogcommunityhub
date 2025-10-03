
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max 200px (approx 8 lines)
      textarea.style.height = `${newHeight}px`;
    }
  };

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

  // Handle input change with typing indicator and auto-resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessageText(value);
    adjustTextareaHeight();

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

      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Handle Enter key (send message on Enter, new line on Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
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
    <div className="p-4 border-t bg-background">
      <form onSubmit={handleSendMessage} className="flex items-end gap-2 w-full">
        <Textarea
          ref={textareaRef}
          data-message-input
          placeholder="Type your message..."
          value={messageText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-h-[40px] max-h-[200px] resize-none"
          rows={1}
          disabled={isSending}
        />
        <Button
          type="submit"
          disabled={!messageText.trim() || isSending}
          className="flex items-center gap-2 shrink-0"
          size="default"
        >
          <Send size={16} />
          Send
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
