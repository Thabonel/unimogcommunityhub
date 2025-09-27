import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send, RotateCw, Trash2, AlertCircle, LogIn, BookOpen, FileText,
  Image as ImageIcon, ZoomIn, ZoomOut, Cpu, Wrench, Bot, Droplets,
  Bolt, Settings, ExternalLink, Eye, Package, ShoppingCart, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSimpleBarry } from '@/hooks/use-simple-barry';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { ErrorBoundary } from '@/components/error-boundary';
import { DiagramService, DiagramData } from '@/services/claude/diagramService';

interface EnhancedBarryChatProps {
  className?: string;
  location?: { latitude: number; longitude: number };
  userModel?: string | null;
}

type ManualRef = {
  manual: string;
  page: number;
  pageImageUrl?: string | null;
  hasVisualContent?: boolean;
  section?: string | null;
  visualContentType?: string | null;
};

/** Client-side deterministic embeddings (no secrets on frontend). */
function hashEmbed(text: string, dim = 768): number[] {
  // Simple, fast, deterministic byte hash → [-1,1] range
  const enc = new TextEncoder().encode(text || '');
  const vec = new Array(dim).fill(0);
  for (let i = 0; i < enc.length; i++) {
    vec[i % dim] += ((enc[i] / 255) * 2) - 1;
  }
  // L2 normalize
  let n = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map(v => v / n);
}

/** Embeddings provider to satisfy DiagramService.getRelevant */
const clientEmbeddings = {
  async embed(input: string): Promise<number[]> {
    return hashEmbed(input, 768);
  }
};

export function EnhancedBarryChat({ className, location, userModel }: EnhancedBarryChatProps) {
  const [input, setInput] = useState('');
  const [selectedManual, setSelectedManual] = useState<string | null>(null);
  const [manualContent, setManualContent] = useState<string>('');
  const [selectedPageImage, setSelectedPageImage] = useState<string | null>(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [generatedDiagrams, setGeneratedDiagrams] = useState<DiagramData[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('current');
  const [newDiagramAvailable, setNewDiagramAvailable] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Clear any persisted content on component mount
  useEffect(() => {
    setGeneratedDiagrams([]);
    setSelectedDiagram(null);
    setSelectedManual(null);
    setSelectedPageImage(null);
    setManualContent('');
  }, []);

  const {
    messages,
    isLoading,
    error,
    isAuthenticated,
    sendMessage,
    clearChat,
    retry
  } = useSimpleBarry(location);

  // Get manual references from the last Barry message
  const manualReferences = useMemo(() => {
    const lastBarryMessage = messages.findLast(m => m.role === 'assistant');
    return lastBarryMessage?.manualReferences || [];
  }, [messages]);

  // Build compact convo context (last user + assistant)
  const lastUserMsg = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') return messages[i].content || '';
    }
    return '';
  }, [messages]);

  const lastAssistantMsg = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role !== 'user') return messages[i].content || '';
    }
    return '';
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        (scrollContainer as HTMLElement).scrollTop = (scrollContainer as HTMLElement).scrollHeight;
      }
    }
  }, [messages]);

  // Only load diagrams when there's actual conversation content
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Only search for diagrams if there's meaningful conversation
      if (!lastUserMsg || !lastAssistantMsg || messages.length < 2) {
        setGeneratedDiagrams([]);
        setSelectedDiagram(null);
        return;
      }

      const images = await DiagramService.getRelevant(
        supabase,
        clientEmbeddings,
        lastUserMsg,
        lastAssistantMsg,
        {
          limit: 8
        }
      );

      if (!cancelled && images.length) {
        setGeneratedDiagrams(images);
        setSelectedDiagram(images[0]);
        setActiveTab('diagrams');
        setNewDiagramAvailable(true);
        setTimeout(() => setNewDiagramAvailable(false), 4000);
      }
    })();
    return () => { cancelled = true; };
  }, [lastUserMsg, lastAssistantMsg, messages.length]);

  // Load manual content when a reference is selected
  const loadManualPage = async (reference: ManualRef) => {
    try {
      const { manual, page, pageImageUrl, hasVisualContent } = reference;

      if (pageImageUrl) {
        setSelectedPageImage(pageImageUrl);
        setImageZoom(1);
      } else {
        setSelectedPageImage(null);
      }

      if (hasVisualContent && pageImageUrl) {
        setManualContent(`Displaying page ${page} from "${manual}"\n\nThis page contains technical diagrams and illustrations. Use the zoom controls to examine details.`);
      } else {
        setManualContent(`Page ${page} from "${manual}"\n\nText-based content from this manual page. Page image not available for this manual.`);
      }

      setSelectedManual(`${manual} - Page ${page}`);
      setActiveTab('current');
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
      const response = await sendMessage(message);

      // Legacy keyword-based fallback (kept for compatibility)
      if (response) {
        const diagrams = DiagramService.parseResponseForDiagrams(response);
        if (diagrams.length > 0) {
          setGeneratedDiagrams(prev => prev.length ? prev : diagrams);
          setSelectedDiagram(prev => prev ?? diagrams[0]);
          setNewDiagramAvailable(true);
          setActiveTab('diagrams');
          setTimeout(() => setNewDiagramAvailable(false), 4000);
        }
      }
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

  const zoomIn = () => setImageZoom(z => Math.min(4, parseFloat((z + 0.25).toFixed(2))));
  const zoomOut = () => setImageZoom(z => Math.max(0.5, parseFloat((z - 0.25).toFixed(2))));
  const resetZoom = () => setImageZoom(1);

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
      <div className={cn("grid grid-cols-1 lg:grid-cols-[25%_75%] gap-4 h-full overflow-hidden", className)}>
        {/* Chat Panel - Independent scrolling */}
        <div className="flex flex-col h-full overflow-hidden">
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

                {/* Diagram notification */}
                {newDiagramAvailable && generatedDiagrams.length > 0 && (
                  <div className="flex justify-center mt-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2 flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        Visuals ready in the right panel →
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

              {/* Manual References (badges) */}
              {manualReferences.length > 0 && (
                <div className="border-t p-3 flex-shrink-0">
                  <div className="text-xs font-medium mb-2 flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Manual References:
                    <span className="text-gray-400">({manualReferences.length})</span>
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
                        onClick={() => loadManualPage(ref as ManualRef)}
                      >
                        {ref.hasVisualContent ? (
                          <ImageIcon className="h-3 w-3" />
                        ) : (
                          <FileText className="h-3 w-3" />
                        )}
                        {ref.manual || 'Unknown Manual'} p.{ref.page || '?'}
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

        {/* Right Panel: Versatile Content Canvas - Independent scrolling */}
        <div className="flex flex-col h-full overflow-hidden">
          <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="pb-3 px-4 flex-shrink-0">
              <CardTitle className="text-lg">Barry's Canvas</CardTitle>
              <p className="text-sm text-muted-foreground">Relevant resources and content will appear here</p>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full p-4">

                {/* Versatile Content Canvas */}
                <div className="space-y-4">
                  {/* Manual References from Barry's Response */}
                  {manualReferences.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        Manual References ({manualReferences.length})
                      </div>

                      <div className="space-y-2">
                        {manualReferences.map((ref: any, idx) => {
                          // Handle both old and new reference formats
                          const isU435Chapter = ref.type === 'u435_chapter';

                          // For U435 chapters, use direct_url or build from u435-chapters bucket
                          let manualUrl = '';
                          let displayTitle = '';

                          if (isU435Chapter) {
                            // New U435 chapter format
                            displayTitle = ref.title || 'U435 Manual Chapter';
                            if (ref.page_range) {
                              displayTitle += ` - ${ref.page_range}`;
                            }

                            // Use direct_url if available, otherwise build from u435-chapters bucket
                            if (ref.direct_url) {
                              manualUrl = ref.direct_url;
                            } else if (ref.filename) {
                              manualUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/u435-chapters/${ref.filename}`;
                            }
                          } else {
                            // Old format for backward compatibility
                            displayTitle = `${ref.manual || 'Manual'} - Page ${ref.page || '?'}`;
                            const manualFilename = ref.manual || 'manual.pdf';
                            manualUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/manuals/${manualFilename}`;
                          }

                          return (
                            <div
                              key={idx}
                              className="border rounded-lg p-3 bg-background hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {displayTitle}
                                  </div>
                                  {isU435Chapter && ref.manual_type && (
                                    <div className="text-xs text-muted-foreground">
                                      {ref.manual_type.toUpperCase()} Manual
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (manualUrl) {
                                      window.open(manualUrl, '_blank');
                                    }
                                  }}
                                  disabled={!manualUrl}
                                >
                                  <FileText className="h-4 w-4" />
                                  VIEW PDF
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Selected Manual Content */}
                  {(selectedPageImage || selectedManual) && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-muted/50">
                        <div className="text-sm font-medium truncate">
                          {selectedManual ?? 'Manual Page'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" onClick={zoomOut} title="Zoom out">
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={resetZoom} title="Reset zoom">
                            1x
                          </Button>
                          <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom in">
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        {selectedPageImage ? (
                          <div className="w-full overflow-auto">
                            <img
                              src={selectedPageImage}
                              alt={selectedManual ?? 'Manual page'}
                              style={{ transform: `scale(${imageZoom})`, transformOrigin: 'top left' }}
                              className="block max-w-none select-none"
                              draggable={false}
                            />
                          </div>
                        ) : (
                          <pre className="text-xs p-3 whitespace-pre-wrap bg-muted rounded">{manualContent}</pre>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Generated Diagrams */}
                  {generatedDiagrams.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        Generated Diagrams ({generatedDiagrams.length})
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {generatedDiagrams.map((d, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedDiagram(d)}
                            className={cn(
                              "border rounded-md overflow-hidden group relative hover:shadow",
                              selectedDiagram === d ? "ring-2 ring-blue-500" : ""
                            )}
                            title={d.title || d.description || 'diagram'}
                          >
                            {d.type === 'image' && (
                              <img
                                src={d.content}
                                alt={d.title || `diagram-${idx}`}
                                className="w-full h-24 object-cover"
                              />
                            )}
                            {d.type === 'svg' && (
                              <div
                                className="w-full h-24 bg-white"
                                dangerouslySetInnerHTML={{ __html: d.content }}
                              />
                            )}
                            {d.type === 'ascii' && (
                              <pre className="w-full h-24 text-[8px] p-1 overflow-hidden">{d.content}</pre>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                              {d.title ?? 'Diagram'}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Selected Diagram Preview */}
                      {selectedDiagram && (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between p-3 bg-muted/50">
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">
                                {selectedDiagram.title ?? 'Diagram Preview'}
                              </div>
                              {selectedDiagram.description && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {selectedDiagram.description}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="outline" size="icon" onClick={zoomOut} title="Zoom out">
                                <ZoomOut className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={resetZoom} title="Reset zoom">
                                1x
                              </Button>
                              <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom in">
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-3">
                            {selectedDiagram.type === 'image' && (
                              <div className="w-full overflow-auto">
                                <img
                                  src={selectedDiagram.content}
                                  alt={selectedDiagram.title ?? 'diagram'}
                                  style={{ transform: `scale(${imageZoom})`, transformOrigin: 'top left' }}
                                  className="block max-w-none select-none"
                                  draggable={false}
                                />
                              </div>
                            )}
                            {selectedDiagram.type === 'svg' && (
                              <div
                                className="w-full overflow-auto bg-white"
                                style={{ transform: `scale(${imageZoom})`, transformOrigin: 'top left' }}
                                dangerouslySetInnerHTML={{ __html: selectedDiagram.content }}
                              />
                            )}
                            {selectedDiagram.type === 'ascii' && (
                              <pre
                                className="text-xs whitespace-pre-wrap bg-muted p-3 rounded"
                                style={{ transform: `scale(${imageZoom})`, transformOrigin: 'top left' }}
                              >
                                {selectedDiagram.content}
                              </pre>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Empty State */}
                  {manualReferences.length === 0 && generatedDiagrams.length === 0 && !selectedPageImage && !selectedManual && (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                      <Bot className="h-12 w-12 mb-4 opacity-50" />
                      <p className="text-center">
                        Ask Barry a question to see relevant manuals, diagrams, and resources here
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
        </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}