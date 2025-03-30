
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [messageText, setMessageText] = useState('');
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
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
  );
};

export default MessageInput;
