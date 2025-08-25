
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && !isSending) {
      setIsSending(true);
      await onSendMessage(messageText);
      setMessageText('');
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <Input 
          placeholder="Type your message..." 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
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
