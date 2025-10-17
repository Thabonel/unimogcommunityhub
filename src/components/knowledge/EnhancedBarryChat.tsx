import React, { useState, useRef, useEffect } from 'react';
import {
  Send, RotateCw, Trash2, AlertCircle, LogIn, ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleBarry, ManualReference } from '@/hooks/use-simple-barry';
import { ManualCitation } from './ManualCitation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@/components/error-boundary';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface EnhancedBarryChatProps {
  className?: string;
  location?: { latitude: number; longitude: number };
  userModel?: string | null;
  onCitationClick?: (reference: ManualReference) => void;
  onReferencesReceived?: (references: ManualReference[]) => void;
}

export function EnhancedBarryChat({
  className,
  location,
  userModel,
  onCitationClick,
  onReferencesReceived
}: EnhancedBarryChatProps) {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [validatedMessageIds, setValidatedMessageIds] = useState<Set<number>>(new Set());
  const { user } = useAuth();

  const {
    messages,
    isLoading,
    error,
    isAuthenticated,
    sendMessage,
    clearChat,
    retry
  } = useSimpleBarry(location);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        (scrollContainer as HTMLElement).scrollTop = (scrollContainer as HTMLElement).scrollHeight;
      }
    }
  }, [messages]);

  // Notify parent when new manual references arrive for preloading
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage.manualReferences) {
      onReferencesReceived?.(lastMessage.manualReferences);
    }
  }, [messages, onReferencesReceived]);

  // Handle citation click - pass to parent callback or no-op
  const handleCitationClick = (reference: ManualReference) => {
    onCitationClick?.(reference);
  };

  // Save validated answer
  const handleThumbsUp = async (messageIndex: number) => {
    if (!user || validatedMessageIds.has(messageIndex)) return;

    // Find the user question (previous message)
    const questionMessage = messages[messageIndex - 1];
    const answerMessage = messages[messageIndex];

    if (!questionMessage || !answerMessage || answerMessage.role !== 'assistant') {
      return;
    }

    try {
      const { error } = await supabase
        .from('barry_validated_answers')
        .insert({
          user_id: user.id,
          question: questionMessage.content,
          answer: answerMessage.content,
          manual_references: answerMessage.manualReferences || []
        });

      if (error) throw error;

      setValidatedMessageIds(prev => new Set(prev).add(messageIndex));

      toast({
        title: "Thank you!",
        description: "Your feedback helps Barry improve.",
      });
    } catch (err) {
      console.error('Error saving validated answer:', err);
      toast({
        title: "Error",
        description: "Failed to save feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !isAuthenticated) return;

    const message = input;
    setInput('');

    try {
      const response = await sendMessage(message);

    } catch {
      // Error handled by hook
    }
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full min-h-[400px]", className)}>
        <Alert className="max-w-md">
          <LogIn className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <p>You need to be logged in to chat with Barry.</p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className={cn("flex items-center justify-center h-full min-h-[400px] bg-gray-50", className)}>
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Barry Chat Error</h2>
            <p className="text-gray-600 mb-4">Unable to load the AI chat interface. Please try refreshing the page.</p>
            <Button onClick={() => window.location.reload()}>Refresh Chat</Button>
          </div>
        </div>
      }
    >
      <div className={cn("flex flex-col h-full", className)}>
        {/* Main Chat Area - Full width, citations open drawer */}
        <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="pb-2 px-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Chat with Barry</CardTitle>
                <div className="flex items-center gap-2">
                  {error && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={retry}
                      disabled={isLoading}
                      title="Retry last message"
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    disabled={isLoading}
                    title="Clear conversation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
              {/* Messages Area - Scrollable */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[95%] rounded-lg px-3 py-2",
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {message.content}
                      </div>

                      {/* Manual Citations - shown inline for assistant messages */}
                      {message.role === 'assistant' && message.manualReferences && message.manualReferences.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-border/50">
                          {message.manualReferences.map((ref, refIdx) => (
                            <ManualCitation
                              key={refIdx}
                              reference={ref}
                              onClick={() => handleCitationClick(ref)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Thumbs Up Button - shown for assistant messages */}
                      {message.role === 'assistant' && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                          <div className={cn(
                            "text-xs opacity-70"
                          )}>
                            {message.timestamp && format(message.timestamp, 'HH:mm')}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleThumbsUp(index)}
                            disabled={validatedMessageIds.has(index)}
                            className={cn(
                              "h-7 px-2 gap-1",
                              validatedMessageIds.has(index) && "text-green-600"
                            )}
                            title={validatedMessageIds.has(index) ? "Feedback saved" : "This answer was helpful"}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span className="text-xs">
                              {validatedMessageIds.has(index) ? "Saved" : "Helpful"}
                            </span>
                          </Button>
                        </div>
                      )}

                      {/* Timestamp for user messages */}
                      {message.role === 'user' && message.timestamp && (
                        <div className="text-xs mt-1 opacity-70 text-right">
                          {format(message.timestamp, 'HH:mm')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse">Barry is thinking...</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </ScrollArea>


              {/* Error Display */}
              {error && (
                <Alert variant="destructive" className="mx-4 mb-2 flex-shrink-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Input Area - Always visible at bottom */}
              <form onSubmit={handleSubmit} className="border-t p-2 flex-shrink-0">
              <div className="flex gap-2 sm:gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={userModel ? `Ask Barry about your ${userModel}...` : "Ask Barry about your Unimog..."}
                  className="min-h-[50px] resize-none text-sm"
                  disabled={isLoading}
                  rows={2}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="self-end h-10 w-10 p-2"
                  size="default"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                Press Enter to send, Shift+Enter for new line
              </div>
            </form>
            </CardContent>
          </Card>
      </div>
    </ErrorBoundary>
  );
}