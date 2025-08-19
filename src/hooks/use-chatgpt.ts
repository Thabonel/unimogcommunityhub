import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export function useChatGPT() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isConfigured = !!import.meta.env.VITE_OPENAI_API_KEY;
  
  const sendMessage = async (content: string) => {
    setMessages(prev => [...prev, { 
      role: 'user', 
      content, 
      timestamp: new Date() 
    }]);
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Barry is currently being set up. Please check back soon!',
        timestamp: new Date()
      }]);
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = () => {
    setMessages([]);
    setError(null);
  };
  
  return {
    messages,
    isLoading,
    error,
    isConfigured,
    sendMessage,
    clearChat
  };
}