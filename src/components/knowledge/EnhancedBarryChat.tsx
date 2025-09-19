import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCw, Trash2, AlertCircle, LogIn, BookOpen, FileText, ChevronRight, Image as ImageIcon, ZoomIn, ZoomOut, Cpu, Wrench, Bot, Droplets, Bolt, Settings, ExternalLink, Eye, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
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
import { DiagramService, DiagramData } from '@/services/claude/diagramService';
import { SafeContent } from '@/components/SafeContent';
import { wisDataService, type WISProcedure } from '@/services/wis/wisDataService';

interface EnhancedBarryChatProps {
  className?: string;
  location?: { latitude: number; longitude: number };
  userModel?: string | null;
}

interface MiniWISResponse {
  quickInfo?: {
    title: string;
    value: string;
    unit?: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[];
  procedure?: {
    title: string;
    description: string;
    procedureId: string;
    difficulty: string;
    estimatedTime: string;
  };
  parts?: {
    title: string;
    parts: Array<{
      partNumber: string;
      description: string;
    }>;
  };
  tools?: {
    title: string;
    tools: string[];
  };
  safetyWarning?: string;
}

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
      const response = await sendMessage(message);
      
      // Check if Barry's response suggests diagrams
      if (response) {
        const diagrams = DiagramService.parseResponseForDiagrams(response);
        
        // Also check for specific diagram requests in user message
        const userRequestedDiagram = checkForDiagramRequest(message);
        if (userRequestedDiagram) {
          const diagram = generateRequestedDiagram(userRequestedDiagram);
          if (diagram) {
            diagrams.push(diagram);
          }
        }
        
        // If we have diagrams, show them with feedback
        if (diagrams.length > 0) {
          setGeneratedDiagrams(diagrams);
          setSelectedDiagram(diagrams[0]); // Show first diagram by default
          setNewDiagramAvailable(true);
          setActiveTab('diagrams'); // Auto-switch to diagrams tab
          
          // Clear the notification after a few seconds
          setTimeout(() => setNewDiagramAvailable(false), 5000);
        }
      }
    } catch (err) {
      // Error is handled by the hook
    }
    
    // Refocus textarea
    textareaRef.current?.focus();
  };

  // Helper function to check if user is requesting a diagram
  const checkForDiagramRequest = (message: string): string | null => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('show') || lowerMessage.includes('diagram') || lowerMessage.includes('illustration')) {
      if (lowerMessage.includes('portal axle') || lowerMessage.includes('drain plug')) return 'portal_axle';
      if (lowerMessage.includes('differential') || lowerMessage.includes('diff lock')) return 'differential';
      if (lowerMessage.includes('oil') && (lowerMessage.includes('flow') || lowerMessage.includes('circuit'))) return 'oil_circuit';
      if (lowerMessage.includes('wiring') || lowerMessage.includes('electrical')) return 'wiring';
    }
    return null;
  };

  // Generate requested diagram
  const generateRequestedDiagram = (type: string): DiagramData | null => {
    // Try SVG first for better quality
    let diagram = DiagramService.generateSvgDiagram(type + '_detailed');
    if (!diagram) {
      diagram = DiagramService.generateAsciiDiagram(type);
    }
    return diagram;
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
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full">
              <div className="p-4 space-y-4">
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
                        Diagram available in the right panel →
                      </span>
                    </div>
                  </div>
                )}

                {/* Manual References */}
                {manualReferences.length > 0 && (
                  <div className="border-t pt-3 mt-4">
                    <div className="text-xs font-medium mb-2 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Manual References:
                      {/* Debug info */}
                      <span className="text-gray-400">({manualReferences.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {manualReferences.map((ref, idx) => {
                        console.log(`📖 Rendering reference ${idx}:`, ref);
                        return (
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
                          {ref.manual || 'Unknown Manual'} p.{ref.page || '?'}
                          {ref.section && ` - ${ref.section}`}
                          {ref.hasVisualContent && (
                            <span className="text-xs text-blue-600 ml-1">
                              ({ref.visualContentType})
                            </span>
                          )}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="mt-4">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Fixed Input Area - Always Visible */}
          <div className="flex-shrink-0 border-t bg-background">
            <form onSubmit={handleSubmit} className="p-3 sm:p-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Barry Mini-WIS Panel */}
      <Card className="flex flex-col min-h-0 max-h-full overflow-hidden">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Wrench className="h-5 w-5 text-military-green flex-shrink-0" />
              <span className="truncate">Mini-WIS Assistant</span>
              <Badge variant="secondary" className="text-xs hidden sm:block">
                Quick Actions
              </Badge>
            </div>
          </CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            Barry handles simple queries here. Complex procedures open full WIS.
          </p>
        </CardHeader>

        <CardContent className="flex-1 p-0 min-h-0">
          <ScrollArea className="h-full px-3 sm:px-4 pb-4">
            {/* Quick Info Cards - Show when Barry provides simple answers */}
            <div className="space-y-3 sm:space-y-4">
              {/* Example quick info cards that would be populated based on Barry's response */}
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

              {/* WIS Handoff Card - Show when complex procedure is needed */}
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
                        // Navigate to WIS with specific procedure - use router navigation on mobile
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

              {/* Parts Reference Card */}
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
                        // Navigate to marketplace - use router navigation on mobile
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

              {/* Tools Required Card */}
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

              {/* Safety Warning Card */}
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

              {/* Empty State - Show when no specific info to display */}
              {false && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Bot className="h-12 w-12 mb-3 opacity-50" />
                  <p className="text-center text-sm">
                    Ask Barry a question to see quick answers and WIS recommendations here
                  </p>
                  <p className="text-xs text-center mt-2 opacity-75">
                    Simple queries show instant results • Complex procedures open full WIS
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      </div>
    </ErrorBoundary>
  );
}