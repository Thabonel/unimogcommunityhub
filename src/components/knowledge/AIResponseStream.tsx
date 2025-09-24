import React, { useEffect, useRef, useState } from 'react';
import { Bot, User, Copy, Zap, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ManualReference {
  manual: string;
  page: number;
  section: string;
  confidence: number;
  context: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  references?: ManualReference[];
}

interface AIResponseStreamProps {
  messages: Message[];
  isProcessing: boolean;
  onReferenceClick: (reference: ManualReference) => void;
}

export function AIResponseStream({ messages, isProcessing, onReferenceClick }: AIResponseStreamProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [streamingText, setStreamingText] = useState('');
  const [showStreamingCursor, setShowStreamingCursor] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, streamingText]);

  // Simulate streaming effect for new assistant messages
  useEffect(() => {
    if (isProcessing) {
      setShowStreamingCursor(true);
      setStreamingText('');

      // Simulate typing indicator
      const typingInterval = setInterval(() => {
        setStreamingText(prev => {
          if (prev.length >= 3) return '';
          return prev + '.';
        });
      }, 500);

      return () => clearInterval(typingInterval);
    } else {
      setShowStreamingCursor(false);
      setStreamingText('');
    }
  }, [isProcessing]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === 'user';

    return (
      <div
        key={index}
        className={cn(
          "flex gap-4 p-6 border-b border-military-green/10",
          isUser ? "bg-military-green/5" : "bg-black"
        )}
      >
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          isUser
            ? "bg-military-green text-white"
            : "bg-gradient-to-br from-military-green to-military-green/70 text-white"
        )}>
          {isUser ? (
            <User className="h-5 w-5" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-white text-sm">
              {isUser ? 'You' : 'Barry'}
            </span>
            <span className="text-xs text-gray-400">
              {format(message.timestamp, 'HH:mm:ss')}
            </span>
            {!isUser && (
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Gemini AI
              </Badge>
            )}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-100 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>

          {/* Manual References */}
          {message.references && message.references.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-military-green" />
                <span className="text-sm font-medium text-military-green">
                  Manual References
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {message.references.map((ref, refIndex) => (
                  <Button
                    key={refIndex}
                    variant="outline"
                    size="sm"
                    onClick={() => onReferenceClick(ref)}
                    className={cn(
                      "text-xs h-7 bg-military-green/10 border-military-green/30",
                      "hover:bg-military-green/20 text-military-green",
                      "transition-all duration-200 hover:scale-105"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-military-green rounded-full"></div>
                      Page {ref.page}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content)}
              className="text-xs text-gray-400 hover:text-white h-6"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            {!isUser && (
              <Badge variant="secondary" className="text-xs">
                Confidence: {message.references?.[0]?.confidence
                  ? Math.round(message.references[0].confidence * 100) + '%'
                  : 'High'}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Messages Area */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-military-green/30"
      >
        {messages.map((message, index) => renderMessage(message, index))}

        {/* Streaming Indicator */}
        {isProcessing && (
          <div className="flex gap-4 p-6 bg-black">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-military-green to-military-green/70 text-white flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-white text-sm">Barry</span>
                <Badge variant="outline" className="text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-military-green rounded-full animate-pulse"></div>
                    Processing
                  </div>
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-military-green rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-military-green rounded-full animate-bounce animation-delay-100"></div>
                  <div className="w-2 h-2 bg-military-green rounded-full animate-bounce animation-delay-200"></div>
                </div>
                <span className="text-sm">
                  Analyzing manual database{streamingText}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-military-green/20 bg-military-green/5">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>{messages.length} messages</span>
            <span>DB: 1,185 manual chunks</span>
            {messages.some(m => m.references?.length) && (
              <span>
                {messages.reduce((acc, m) => acc + (m.references?.length || 0), 0)} references found
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Real-time
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}