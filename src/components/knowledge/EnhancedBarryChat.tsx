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
import { useSecureGemini } from '@/hooks/use-secure-gemini';
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

  const {
    messages,
    manualReferences,
    isLoading,
    error,
    isAuthenticated,
    sendMessage,
    clearChat,
    retry
  } = useSecureGemini(location);

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

  // DB-backed diagram/image retrieval whenever context changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const context = `${lastAssistantMsg}\n${lastUserMsg}`.trim();
      if (!context) return;

      const images = await DiagramService.getRelevant(
        supabase,
        clientEmbeddings,
        lastUserMsg,
        lastAssistantMsg,
        {
          // If user model is known, bias by manualId prefix convention if you have one.
          // You can pass manualIds: [userModel] if it matches your DB schema.
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
  }, [lastUserMsg, lastAssistantMsg]);

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
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4 h-full", className)}>
        {/* Chat Panel */}
        <Card className="flex flex-col min-h-0 max-h-full overflow-hidden">
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
                        "max-w-[85%] sm:max-w-[80%] rounded-lg px-4 py-3 sm:py-2",
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <div className="whitespace-pre-wrap break-words text-base sm:text-sm leading-relaxed sm:leading-normal">
                        {message.content}
                      </div>
                      {message.timestamp && (
                        <div className={cn(
                          "text-xs mt-2 sm:mt-1 opacity-70",
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
              <div className="border-t p-3">
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
              <Alert variant="destructive" className="mx-4 mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="border-t p-3 sm:p-4">
              <div className="flex gap-2 sm:gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={userModel ? `Ask Barry about your ${userModel}...` : "Ask Barry about your Unimog..."}
                  className="min-h-[70px] sm:min-h-[60px] resize-none text-base sm:text-sm"
                  disabled={isLoading}
                  rows={2}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="self-end h-12 w-12 sm:h-auto sm:w-auto p-3 sm:px-4 sm:py-2"
                  size="default"
                >
                  <Send className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <div className="text-xs sm:text-xs text-muted-foreground mt-2 sm:block hidden">
                Press Enter to send, Shift+Enter for new line
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right Panel: Tabs with Current (Mini-WIS) + Diagrams */}
        <Card className="flex flex-col min-h-0 max-h-full overflow-hidden">
          <CardHeader className="pb-0 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">Right-Hand Viewer</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-3 sm:px-4 pt-3">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
                </TabsList>
              </div>

              {/* CURRENT TAB (Mini-WIS) */}
              <TabsContent value="current" className="flex-1 overflow-hidden">
                <div className="px-3 sm:px-4 pb-3">
                  {/* Selected manual image / content, if any */}
                  {(selectedPageImage || selectedManual) && (
                    <div className="border rounded-lg overflow-hidden mb-4">
                      <div className="flex items-center justify-between p-2 bg-muted/50">
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
                      <div className="p-2">
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
                          <pre className="text-xs p-3 whitespace-pre-wrap">{manualContent}</pre>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mini-WIS Assistant */}
                  <div className="text-sm sm:text-base text-muted-foreground mb-3">
                    Barry handles simple queries here. Complex procedures open full WIS.
                  </div>

                  <ScrollArea className="h-[48vh] px-1">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Quick Info Cards (examples; keep your existing population logic) */}
                      <div className="border rounded-lg p-4 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-base sm:text-sm text-green-900">Engine Oil Capacity</h4>
                            <p className="text-base sm:text-sm text-green-700 mt-1.5 sm:mt-1">OM352A: 14 liters with filter</p>
                            <p className="text-sm sm:text-xs text-green-600 mt-1">SAE 15W-40 recommended</p>
                          </div>
                          <Droplets className="h-5 w-5 sm:h-4 sm:w-4 text-green-600 flex-shrink-0 mt-1" />
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 sm:p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-base sm:text-sm text-blue-900">Torque Specification</h4>
                            <p className="text-base sm:text-sm text-blue-700 mt-1.5 sm:mt-1">Wheel bolts: 380 Nm (280 ft-lbs)</p>
                            <p className="text-sm sm:text-xs text-blue-600 mt-1">Use cross pattern tightening</p>
                          </div>
                          <Bolt className="h-5 w-5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0 mt-1" />
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 sm:p-3 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                        <div className="space-y-4 sm:space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-base sm:text-sm text-orange-900">Portal Axle Service</h4>
                              <p className="text-base sm:text-sm text-orange-700 mt-1.5 sm:mt-1">
                                Complex procedure requiring step-by-step guidance
                              </p>
                            </div>
                            <Settings className="h-5 w-5 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0 mt-1" />
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                            <Button
                              size="default"
                              className="bg-military-green hover:bg-military-green/90 text-white flex-1 h-11 sm:h-9 text-base sm:text-sm"
                              onClick={() => {
                                if (window.innerWidth < 768) {
                                  window.location.href = '/knowledge/wis';
                                } else {
                                  window.open('/knowledge/wis', '_blank');
                                }
                              }}
                            >
                              <ExternalLink className="h-4 w-4 sm:h-3 sm:w-3 mr-2 sm:mr-1" />
                              Open in WIS
                            </Button>
                            <Button
                              size="default"
                              variant="outline"
                              className="h-11 sm:h-9 px-4 sm:px-3 text-base sm:text-sm sm:flex-shrink-0"
                              title="Get overview"
                            >
                              <Eye className="h-4 w-4 sm:h-3 sm:w-3 sm:mr-0 mr-2" />
                              <span className="sm:hidden">Overview</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 sm:p-3 bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                        <div className="space-y-4 sm:space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-base sm:text-sm text-purple-900">Required Parts</h4>
                              <div className="space-y-2 sm:space-y-1 mt-3 sm:mt-2">
                                <div className="text-sm sm:text-xs text-purple-700">• Oil filter: A 000 180 0309</div>
                                <div className="text-sm sm:text-xs text-purple-700">• Air filter: A 000 180 0609</div>
                                <div className="text-sm sm:text-xs text-purple-700">• Fuel filter: A 000 181 0108</div>
                              </div>
                            </div>
                            <Package className="h-5 w-5 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0 mt-1" />
                          </div>

                          <div className="flex items-center">
                            <Button
                              size="default"
                              variant="outline"
                              className="w-full h-11 sm:h-9 text-base sm:text-sm"
                              onClick={() => {
                                if (window.innerWidth < 768) {
                                  window.location.href = '/marketplace';
                                } else {
                                  window.open('/marketplace', '_blank');
                                }
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 sm:h-3 sm:w-3 mr-2 sm:mr-1" />
                              Find Parts
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 sm:p-3 bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-base sm:text-sm text-gray-900">Tools Needed</h4>
                            <div className="space-y-2 sm:space-y-1 mt-3 sm:mt-2">
                              <div className="text-sm sm:text-xs text-gray-700">• 17mm socket wrench</div>
                              <div className="text-sm sm:text-xs text-gray-700">• Oil drain pan (15L)</div>
                              <div className="text-sm sm:text-xs text-gray-700">• Funnel</div>
                            </div>
                          </div>
                          <Wrench className="h-5 w-5 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0 mt-1" />
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 sm:p-3 bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-base sm:text-sm text-red-900 flex items-center gap-2 sm:gap-1">
                              <AlertTriangle className="h-4 w-4 sm:h-3 sm:w-3 flex-shrink-0" />
                              Safety Notice
                            </h4>
                            <p className="text-sm sm:text-xs text-red-700 mt-2 sm:mt-1 leading-relaxed sm:leading-normal">
                              Always engage parking brake and use wheel chocks before working under vehicle
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* DIAGRAMS TAB */}
              <TabsContent value="diagrams" className="flex-1 overflow-hidden">
                <div className="px-3 sm:px-4 pb-3">
                  {generatedDiagrams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
                      <Bot className="h-10 w-10 mb-3 opacity-50" />
                      <p className="text-sm text-center">
                        Ask a question (e.g., "show portal axle drain plug") to load relevant manuals and diagrams.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Gallery */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {generatedDiagrams.map((d, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedDiagram(d)}
                            className={cn(
                              "border rounded-md overflow-hidden group relative",
                              selectedDiagram === d ? "ring-2 ring-blue-500" : "hover:shadow"
                            )}
                            title={d.title || d.description || 'diagram'}
                          >
                            {d.type === 'image' && (
                              <img
                                src={d.content}
                                alt={d.title || `diagram-${idx}`}
                                className="w-full h-28 object-cover"
                              />
                            )}
                            {d.type === 'svg' && (
                              <div
                                className="w-full h-28 bg-white"
                                dangerouslySetInnerHTML={{ __html: d.content }}
                              />
                            )}
                            {d.type === 'ascii' && (
                              <pre className="w-full h-28 text-[10px] p-2 overflow-hidden">{d.content}</pre>
                            )}
                            {d.type === 'mermaid' && (
                              <pre className="w-full h-28 text-[10px] p-2 overflow-auto">{d.content}</pre>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] px-1 py-0.5 truncate">
                              {d.title ?? 'Diagram'}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Preview */}
                      {selectedDiagram && (
                        <div className="mt-3 border rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between p-2 bg-muted/50">
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">
                                {selectedDiagram.title ?? 'Preview'}
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
                          <div className="p-2">
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
                                className="text-xs whitespace-pre-wrap"
                                style={{ transform: `scale(${imageZoom})`, transformOrigin: 'top left' }}
                              >
                                {selectedDiagram.content}
                              </pre>
                            )}
                            {selectedDiagram.type === 'mermaid' && (
                              <pre
                                className="text-xs whitespace-pre-wrap"
                                style={{ transform: `scale(${imageZoom})`, transformOrigin: 'top left' }}
                              >
                                {selectedDiagram.content}
                              </pre>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}