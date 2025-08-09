import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCw, Trash2, AlertCircle, LogIn, BookOpen, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSecureChatGPT } from '@/hooks/use-secure-chatgpt';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { ErrorBoundary } from '@/components/error-boundary';

interface EnhancedBarryChatProps {
  className?: string;
}

export function EnhancedBarryChat({ className }: EnhancedBarryChatProps) {
  const [input, setInput] = useState('');
  const [selectedManual, setSelectedManual] = useState<string | null>(null);
  const [manualContent, setManualContent] = useState<string>('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    messages, 
    manualReferences,
    isLoading, 
    error, 
    isAuthenticated,
    sendMessage, 
    clearChat,
    retry
  } = useSecureChatGPT();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Load manual content when a reference is selected
  const loadManualPage = async (filename: string, pageNumber: number) => {
    try {
      // For now, show a placeholder. In production, this would fetch the actual PDF page
      setManualContent(`Loading ${filename}, Page ${pageNumber}...\n\nThis would display the actual manual page content, diagrams, and tables.`);
      setSelectedManual(`${filename} - Page ${pageNumber}`);
    } catch (err) {
      console.error('Error loading manual:', err);
      setManualContent('Failed to load manual content');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !isAuthenticated) return;
    
    const message = input;
    setInput('');
    
    try {
      await sendMessage(message);
    } catch (err) {
      // Error is handled by the hook
    }
    
    // Refocus textarea
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
      <div className={cn("flex flex-col items-center justify-center h-[600px]", className)}>
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
        <div className={cn("flex items-center justify-center h-[800px] bg-gray-50", className)}>
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Barry Chat Error</h2>
            <p className="text-gray-600 mb-4">Unable to load the AI chat interface. Please try refreshing the page.</p>
            <Button onClick={() => window.location.reload()}>Refresh Chat</Button>
          </div>
        </div>
      }
    >
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4 h-[800px]", className)}>
        {/* Chat Panel */}
        <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat with Barry</CardTitle>
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
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
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
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    {message.timestamp && (
                      <div className={cn(
                        "text-xs mt-1 opacity-70",
                        message.role === 'user' ? 'text-right' : 'text-left'
                      )}>
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

          {/* Manual References */}
          {manualReferences.length > 0 && (
            <div className="border-t p-3">
              <div className="text-xs font-medium mb-2 flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Manual References:
              </div>
              <div className="flex flex-wrap gap-2">
                {manualReferences.map((ref, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => loadManualPage(ref.manual, ref.page)}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    {ref.manual} p.{ref.page}
                    {ref.section && ` - ${ref.section}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mx-4 mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Barry about your Unimog..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
                rows={2}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Manual Content Panel */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Manual Content
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <Tabs defaultValue="current" className="h-full flex flex-col">
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="current">Current Reference</TabsTrigger>
              <TabsTrigger value="all">All Manuals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="flex-1 px-4 pb-4">
              <ScrollArea className="h-full">
                {selectedManual ? (
                  <div className="space-y-4">
                    <div className="font-medium text-sm">{selectedManual}</div>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans">{manualContent}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <BookOpen className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-center">
                      Manual excerpts will appear here when Barry references technical documentation
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="all" className="flex-1 px-4 pb-4">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse all available Unimog manuals:
                  </p>
                  {/* This would be populated with actual manuals from the database */}
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      U1700L Service Manual
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      U1700L Parts Catalog
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      Portal Axle Maintenance Guide
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      OM352 Engine Manual
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </ErrorBoundary>
  );
}