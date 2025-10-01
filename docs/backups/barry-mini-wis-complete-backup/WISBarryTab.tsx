import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, AlertCircle, Wrench, Package, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSecureChatGPT } from '@/hooks/use-secure-chatgpt';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WISBarryTabProps {
  currentProcedure?: {
    id: string;
    title: string;
    description?: string;
  };
  vehicleModel?: string;
  className?: string;
  onClose?: () => void;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  wisContext?: {
    procedureId?: string;
    partNumbers?: string[];
    suggestions?: string[];
  };
}

export const WISBarryTab: React.FC<WISBarryTabProps> = ({
  currentProcedure,
  vehicleModel = 'U1700L',
  className,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useSecureChatGPT();

  // Auto-scroll to bottom when new messages arrive (with delay to prevent initial page scroll)
  useEffect(() => {
    if (messages.length > 1) { // Only auto-scroll after welcome message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  // Welcome message with WIS context
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: currentProcedure
          ? `Hello! I'm Barry, your WIS assistant. I can see you're working with **${currentProcedure.title}** on your ${vehicleModel}. How can I help you with this procedure?`
          : `Hello! I'm Barry, your WIS assistant for ${vehicleModel}. I can help you with procedures, parts identification, troubleshooting, and more. What would you like to know?`,
        isUser: false,
        timestamp: new Date(),
        wisContext: currentProcedure ? {
          procedureId: currentProcedure.id,
          suggestions: [
            'Explain this procedure step-by-step',
            'What tools do I need?',
            'Show me related parts',
            'Common issues with this procedure'
          ]
        } : {
          suggestions: [
            'Help me find a procedure',
            'Identify a part by description',
            'Troubleshoot an issue',
            'Maintenance schedule advice'
          ]
        }
      };
      setMessages([welcomeMessage]);
    }
  }, [currentProcedure, vehicleModel, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Create WIS-aware prompt
      let contextPrompt = `You are Barry, a WIS (Workshop Information System) assistant for Mercedes-Benz Unimog vehicles. `;
      contextPrompt += `The user is working with a ${vehicleModel}. `;

      if (currentProcedure) {
        contextPrompt += `They are currently viewing procedure "${currentProcedure.title}" (ID: ${currentProcedure.id}). `;
      }

      contextPrompt += `Provide helpful, specific technical assistance. Focus on WIS procedures, parts identification, and troubleshooting. `;
      contextPrompt += `Since this is integrated in WIS, do NOT suggest "opening WIS" - they're already here. `;
      contextPrompt += `User question: ${inputValue}`;

      const response = await sendMessage(contextPrompt, vehicleModel);

      if (response && response.trim()) {
        const barryMessage: Message = {
          id: `barry-${Date.now()}`,
          content: response,
          isUser: false,
          timestamp: new Date(),
          wisContext: {
            procedureId: currentProcedure?.id
          }
        };
        setMessages(prev => [...prev, barryMessage]);
      }
    } catch (error) {
      console.error('Barry WIS error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-blue-900">Barry WIS Assistant</span>
        </div>
        {currentProcedure && (
          <Badge variant="secondary" className="bg-blue-200 text-blue-800">
            <Wrench className="w-3 h-3 mr-1" />
            {currentProcedure.title}
          </Badge>
        )}
        <Badge variant="outline" className="mr-2">
          {vehicleModel}
        </Badge>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-auto h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
            title="Close Barry Assistant"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isUser ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.isUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900 border"
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>

                {/* Show suggestions for Barry messages */}
                {!message.isUser && message.wisContext?.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.wisContext.suggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="text-xs opacity-70 mt-1">
                  {format(message.timestamp, 'HH:mm')}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2 border">
                <div className="flex items-center gap-2 text-gray-600">
                  <Bot className="w-4 h-4 animate-pulse" />
                  <span>Barry is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              currentProcedure
                ? "Ask about this procedure, required tools, common issues..."
                : "Ask Barry about procedures, parts, troubleshooting..."
            }
            className="flex-1 min-h-[40px] max-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {currentProcedure && (
          <div className="text-xs text-gray-600 mt-2">
            Barry knows you're working on <strong>{currentProcedure.title}</strong> and can provide specific guidance.
          </div>
        )}
      </form>
    </div>
  );
};