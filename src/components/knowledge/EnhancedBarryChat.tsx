import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send, RotateCw, Trash2, AlertCircle, LogIn, FileText, X,
  Bot, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSimpleBarry, ManualReference } from '@/hooks/use-simple-barry';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@/components/error-boundary';
import { SimplePDFViewer } from './SimplePDFViewer';

interface EnhancedBarryChatProps {
  className?: string;
  location?: { latitude: number; longitude: number };
  userModel?: string | null;
}

export function EnhancedBarryChat({ className, location, userModel }: EnhancedBarryChatProps) {
  const [input, setInput] = useState('');
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [allManualReferences, setAllManualReferences] = useState<ManualReference[]>([]);
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

  // Helper function to get PDF URL from manual reference
  const getPdfUrl = (ref: ManualReference): string => {
    if (ref.type === 'u435_optimized_index' && ref.storage_url) {
      return `${ref.storage_url}#page=${ref.pdf_page || 1}`;
    } else if (ref.type === 'u435_chapter' && ref.direct_url) {
      return ref.direct_url;
    } else if (ref.manual) {
      return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/manuals/${ref.manual}`;
    }
    return '';
  };

  // Extract PDF references from Barry's responses and auto-load
  useEffect(() => {
    const lastBarryMessage = messages.findLast(m => m.role === 'assistant');
    if (lastBarryMessage?.manualReferences && lastBarryMessage.manualReferences.length > 0) {
      const references = lastBarryMessage.manualReferences;
      setAllManualReferences(references);

      // Auto-load first PDF
      const firstRef = references[0];
      const pdfUrl = getPdfUrl(firstRef);

      if (pdfUrl) {
        setSelectedPDF(pdfUrl);

        // Auto-switch to PDF view on mobile when PDF is loaded
        if (window.innerWidth < 1024) {
          setMobileView('pdf');
        }
      }
    }
  }, [messages]);

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

        {/* Right Panel - Inline PDF Viewer (70% on desktop, full on mobile) */}
        <div className={cn(
          "flex flex-col h-full",
          "lg:w-[70%]",
          mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
        )}>
          {selectedPDF ? (
            <div className="h-full flex flex-col">
              {/* Manual selector (only show if multiple manuals) */}
              {allManualReferences.length > 1 && (
                <div className="flex items-center gap-1 p-1 border-b bg-background flex-shrink-0">
                  <BookOpen className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {allManualReferences.length} manuals
                  </span>
                  <Select value={selectedPDF} onValueChange={setSelectedPDF}>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Select manual" />
                    </SelectTrigger>
                    <SelectContent>
                      {allManualReferences.map((ref, idx) => {
                        const pdfUrl = getPdfUrl(ref);
                        return (
                          <SelectItem key={idx} value={pdfUrl}>
                            {ref.title} - Page {ref.pdf_page || ref.page || '?'}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* PDF Viewer */}
              <div className="flex-1 min-h-0">
                <SimplePDFViewer
                  url={selectedPDF}
                  onClose={() => {
                    setSelectedPDF(null);
                    if (window.innerWidth < 1024) {
                      setMobileView('chat');
                    }
                  }}
                  embedded={true}
                />
              </div>
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
    </ErrorBoundary>
  );
}