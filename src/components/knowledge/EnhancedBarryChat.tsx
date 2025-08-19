import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCw, Trash2, AlertCircle, LogIn, BookOpen, FileText, ChevronRight, Image as ImageIcon, ZoomIn, ZoomOut } from 'lucide-react';
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
  location?: { latitude: number; longitude: number };
}

export function EnhancedBarryChat({ className, location }: EnhancedBarryChatProps) {
  const [input, setInput] = useState('');
  const [selectedManual, setSelectedManual] = useState<string | null>(null);
  const [manualContent, setManualContent] = useState<string>('');
  const [selectedPageImage, setSelectedPageImage] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
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
  } = useSecureChatGPT(location);

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
  const loadManualPage = async (reference: { manual: string; page: number; pageImageUrl?: string | null; hasVisualContent?: boolean }) => {
    try {
      const { manual, page, pageImageUrl, hasVisualContent } = reference;
      
      // Set the page image if available
      if (pageImageUrl) {
        setSelectedPageImage(pageImageUrl);
        setImageZoom(1); // Reset zoom
      } else {
        setSelectedPageImage(null);
      }
      
      // Set manual content based on whether we have visual content
      if (hasVisualContent && pageImageUrl) {
        setManualContent(`Displaying page ${page} from "${manual}"\n\nThis page contains technical diagrams and illustrations. Use the zoom controls to examine details.`);
      } else {
        setManualContent(`Page ${page} from "${manual}"\n\nText-based content from this manual page. Page image not available for this manual.`);
      }
      
      setSelectedManual(`${manual} - Page ${page}`);
    } catch (err) {
      console.error('Error loading manual:', err);
      setManualContent('Failed to load manual content');
      setSelectedPageImage(null);
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
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4 h-full", className)}>
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
                    className={cn(
                      "cursor-pointer hover:bg-secondary/80 flex items-center gap-1",
                      ref.hasVisualContent && "border-blue-200 bg-blue-50"
                    )}
                    onClick={() => loadManualPage(ref)}
                  >
                    {ref.hasVisualContent ? (
                      <ImageIcon className="h-3 w-3" />
                    ) : (
                      <FileText className="h-3 w-3" />
                    )}
                    {ref.manual} p.{ref.page}
                    {ref.section && ` - ${ref.section}`}
                    {ref.hasVisualContent && (
                      <span className="text-xs text-blue-600 ml-1">
                        ({ref.visualContentType})
                      </span>
                    )}
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
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Manual Content
            </div>
            {selectedPageImage && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImageZoom(Math.max(0.5, imageZoom - 0.25))}
                  disabled={imageZoom <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  {Math.round(imageZoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImageZoom(Math.min(2, imageZoom + 0.25))}
                  disabled={imageZoom >= 2}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            )}
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
                    
                    {/* Page Image Display */}
                    {selectedPageImage ? (
                      <div className="space-y-2">
                        <div className="border rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={selectedPageImage}
                            alt={`Manual page from ${selectedManual}`}
                            className="w-full h-auto"
                            style={{
                              transform: `scale(${imageZoom})`,
                              transformOrigin: 'top left',
                              transition: 'transform 0.2s ease'
                            }}
                            onError={(e) => {
                              console.error('Error loading manual page image:', e);
                              setSelectedPageImage(null);
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Click and drag to pan • Use zoom controls above
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans">{manualContent}</pre>
                      </div>
                    )}
                    
                    {/* Text content always shown below image */}
                    {selectedPageImage && (
                      <div className="prose prose-sm max-w-none border-t pt-4">
                        <pre className="whitespace-pre-wrap font-sans">{manualContent}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <BookOpen className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-center">
                      Manual excerpts and diagrams will appear here when Barry references technical documentation
                    </p>
                    <p className="text-xs text-center mt-2 opacity-75">
                      Pages with illustrations will show blue badges in the references section
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