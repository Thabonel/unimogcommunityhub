import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, AlertCircle, Search, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useSimpleBarry, ManualReference } from '@/hooks/use-simple-barry';
import { SimplePDFViewer } from '@/components/knowledge/SimplePDFViewer';
import { supabase } from '@/lib/supabase-client';

// Content types for versatile right panel
type ContentType = 'pdf' | 'diagram' | 'table' | 'checklist' | 'links' | 'text' | 'custom';

interface BarryContent {
  id: string;
  type: ContentType;
  title: string;
  priority?: 'critical' | 'high' | 'standard';
  data: any;
}

interface SimplifiedBarryChatProps {
  className?: string;
  userModel?: string | null;
}

export function SimplifiedBarryChat({ className, userModel }: SimplifiedBarryChatProps) {
  const [input, setInput] = useState('');
  const [relevantContent, setRelevantContent] = useState<BarryContent[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [contentSearch, setContentSearch] = useState('');
  const [showAllContent, setShowAllContent] = useState(false);
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
  } = useSimpleBarry();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Fetch relevant manuals based on the conversation
  const fetchRelevantManuals = async (query: string) => {
    try {
      // Call our search function to find relevant manuals
      const { data, error } = await supabase.rpc('search_u435_manuals', {
        search_term: query.toLowerCase()
      });

      if (error) throw error;

      // Convert to BarryContent format
      const content: BarryContent[] = (data || []).map((item: any) => ({
        id: item.slug,
        type: 'pdf' as ContentType,
        title: item.title,
        priority: item.relevance > 0.9 ? 'critical' : item.relevance > 0.7 ? 'high' : 'standard',
        data: {
          filename: item.filename,
          url: `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/${item.storage_path}`,
          manualType: item.manual_type,
          partNumber: item.part_number
        }
      }));

      setRelevantContent(content);
    } catch (err) {
      console.error('Error fetching relevant manuals:', err);
    }
  };

  // Update content when new message is sent - use manual references from Barry's response
  useEffect(() => {
    const lastBarryMessage = messages.findLast(m => m.role === 'assistant');
    if (lastBarryMessage?.manualReferences && lastBarryMessage.manualReferences.length > 0) {
      // Convert manual references to BarryContent format
      const content: BarryContent[] = lastBarryMessage.manualReferences.map((ref: ManualReference, index: number) => ({
        id: `manual-${index}`,
        type: 'pdf' as ContentType,
        title: `${ref.manual} - Page ${ref.page}`,
        priority: index === 0 ? 'critical' : index < 3 ? 'high' : 'standard',
        data: {
          filename: ref.manual,
          url: ref.pageImageUrl || `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/manuals/${ref.manual}`,
          manualType: ref.manual.toLowerCase().includes('workshop') ? 'workshop' : 'maintenance',
          page: ref.page,
          section: ref.section
        }
      }));
      setRelevantContent(content);
    } else {
      // Fall back to searching based on user message
      const lastUserMessage = messages.findLast(m => m.role === 'user');
      if (lastUserMessage?.content) {
        fetchRelevantManuals(lastUserMessage.content);
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

  // Filter content based on search
  const filteredContent = relevantContent.filter(item =>
    item.title.toLowerCase().includes(contentSearch.toLowerCase()) ||
    (showAllContent ? true : false)
  );

  // Priority icons
  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'critical': return '🎯';
      case 'high': return '🔥';
      default: return '📄';
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
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4 h-full", className)}>
      {/* Left Panel - Chat */}
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Chat with Barry</CardTitle>
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

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages */}
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
                      "max-w-[85%] rounded-lg px-4 py-2",
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
          <form onSubmit={handleSubmit} className="border-t p-3">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={userModel ? `Ask about your ${userModel}...` : "Ask Barry anything..."}
                className="min-h-[60px] resize-none"
                disabled={isLoading}
                rows={2}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Right Panel - Versatile Content Display */}
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="space-y-3">
            <CardTitle>Relevant Resources</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={contentSearch}
                  onChange={(e) => setContentSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllContent(!showAllContent)}
              >
                {showAllContent ? 'Show Relevant' : 'Show All'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full px-4 pb-4">
            {filteredContent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Ask Barry a question to see relevant resources</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredContent.map((item) => (
                  <ContentItem
                    key={item.id}
                    item={item}
                    onSelect={() => {
                      if (item.type === 'pdf') {
                        setSelectedPDF(item.data.url);
                      }
                      // Handle other content types as needed
                    }}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* PDF Viewer Modal */}
      {selectedPDF && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-4 z-50">
            <SimplePDFViewer
              url={selectedPDF}
              onClose={() => setSelectedPDF(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Component for rendering different content types
function ContentItem({
  item,
  onSelect
}: {
  item: BarryContent;
  onSelect: () => void;
}) {
  const renderContent = () => {
    switch (item.type) {
      case 'pdf':
        return (
          <button
            onClick={onSelect}
            className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span>{getPriorityIcon(item.priority)}</span>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium truncate">{item.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {item.data.manualType === 'workshop' ? 'Workshop' : 'Maintenance'}
                  </Badge>
                  {item.data.partNumber && (
                    <span className="text-xs text-muted-foreground">
                      Part {item.data.partNumber}
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </button>
        );

      // Add other content type renderers here as needed
      case 'text':
        return (
          <div className="p-3 rounded-lg border bg-muted/50">
            <h4 className="font-medium mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.data}</p>
          </div>
        );

      default:
        return (
          <div className="p-3 rounded-lg border">
            <span className="text-sm text-muted-foreground">
              {item.type}: {item.title}
            </span>
          </div>
        );
    }
  };

  return renderContent();
}

// Helper function for priority icons
function getPriorityIcon(priority?: string) {
  switch (priority) {
    case 'critical': return '🎯';
    case 'high': return '🔥';
    default: return '📄';
  }
}