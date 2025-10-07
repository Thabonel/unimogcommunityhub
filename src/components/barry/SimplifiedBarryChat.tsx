import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, AlertCircle, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useSimpleBarry } from '@/hooks/use-simple-barry';
import { SimplePDFViewer } from '@/components/knowledge/SimplePDFViewer';

interface SimplifiedBarryChatProps {
  className?: string;
  userModel?: string | null;
}

export function SimplifiedBarryChat({ className, userModel }: SimplifiedBarryChatProps) {
  const [input, setInput] = useState('');
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'chat' | 'pdf'>('chat');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    isLoading,
    error,
    isAuthenticated,
    sendMessage,
    clearChat,
  } = useSimpleBarry();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        (scrollContainer as HTMLElement).scrollTop = (scrollContainer as HTMLElement).scrollHeight;
      }
    }
  }, [messages]);

  // Extract PDF references from Barry's responses
  useEffect(() => {
    const lastBarryMessage = messages.findLast(m => m.role === 'assistant');
    if (lastBarryMessage?.manualReferences && lastBarryMessage.manualReferences.length > 0) {
      const firstRef = lastBarryMessage.manualReferences[0];
      const pdfUrl = firstRef.pageImageUrl || `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/manuals/${firstRef.manual}`;
      setSelectedPDF(pdfUrl);

      // Auto-switch to PDF view on mobile when PDF is loaded
      if (window.innerWidth < 1024) {
        setMobileView('pdf');
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');

    // Send message to Barry
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full min-h-[400px]", className)}>
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to chat with Barry.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Mobile Tab Bar */}
      <div className="lg:hidden border-b bg-background">
        <div className="flex">
          <button
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors",
              mobileView === 'chat'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMobileView('chat')}
          >
            💬 Chat
          </button>
          <button
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium transition-colors",
              mobileView === 'pdf'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setMobileView('pdf')}
            disabled={!selectedPDF}
          >
            📄 Manual {selectedPDF && '✓'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Chat (30% on desktop, full on mobile) */}
        <div className={cn(
          "flex flex-col h-full",
          "lg:w-[30%] lg:border-r",
          mobileView === 'pdf' ? 'hidden lg:flex' : 'flex'
        )}>
          <Card className="flex flex-col h-full border-0 lg:border rounded-none lg:rounded-lg">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Chat with Barry</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
              {/* Messages */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Ask Barry about Unimog maintenance, repairs, or technical questions</p>
                    </div>
                  )}

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
                          "max-w-[85%] rounded-lg px-4 py-2",
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <div className="whitespace-pre-wrap break-words text-sm">
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
                        <div className="flex gap-1">
                          <span className="animate-bounce">•</span>
                          <span className="animate-bounce delay-100">•</span>
                          <span className="animate-bounce delay-200">•</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t p-3 bg-background">
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={userModel ? `Ask about your ${userModel}...` : "Ask Barry anything..."}
                    className="min-h-[60px] resize-none text-sm"
                    disabled={isLoading}
                    rows={2}
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Inline PDF Viewer (70% on desktop, full on mobile) */}
        <div className={cn(
          "flex flex-col h-full",
          "lg:w-[70%]",
          mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
        )}>
          {selectedPDF ? (
            <div className="relative h-full">
              {/* Close button for mobile */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 lg:hidden bg-background/80 backdrop-blur-sm"
                onClick={() => {
                  setSelectedPDF(null);
                  setMobileView('chat');
                }}
              >
                <X className="h-4 w-4" />
              </Button>

              <SimplePDFViewer
                url={selectedPDF}
                onClose={() => {
                  setSelectedPDF(null);
                  if (window.innerWidth < 1024) {
                    setMobileView('chat');
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-muted/30 text-muted-foreground p-8">
              <FileText className="h-20 w-20 mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No Manual Selected</h3>
              <p className="text-sm text-center max-w-md">
                Ask Barry a technical question and relevant manual pages will appear here automatically
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
