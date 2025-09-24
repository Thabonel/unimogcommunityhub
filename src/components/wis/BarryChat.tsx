import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  FileText, 
  Image as ImageIcon,
  ExternalLink,
  BookOpen,
  Loader2
} from 'lucide-react';
import { WISModel, WIS_MODELS } from '@/lib/supabase-wis';
import { MediaGallery } from './MediaGallery';
import { WISMediaCarousel, MediaItem } from './WISMediaCarousel';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { useSecureGemini } from '@/hooks/use-secure-gemini';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  references?: DocumentReference[];
  media?: any[];
}

interface DocumentReference {
  doc_id: string;
  doc_type: string;
  ref: string;
  title: string;
  chunks?: any[];
  media?: MediaItem[];
}

interface BarryChatProps {
  selectedModel?: WISModel;
}

export function BarryChat({ selectedModel = WIS_MODELS[0] }: BarryChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [currentReferences, setCurrentReferences] = useState<DocumentReference[]>([]);
  const [currentMedia, setCurrentMedia] = useState<any[]>([]);
  const [expandedReference, setExpandedReference] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the working hook from Bubble Barry
  const {
    messages,
    manualReferences,
    isLoading,
    error,
    isAuthenticated,
    sendMessage,
    clearChat
  } = useSecureGemini();

  // Map manual names from Barry to database manual titles
  const mapManualNameToDatabase = (manualName: string): string => {
    const lowerName = manualName.toLowerCase();

    // Handle U1700L specific mappings
    if (lowerName.includes('u1700') || lowerName.includes('435')) {
      return 'U1700L U435 Workshop Manual Volume 1';
    }

    // Handle other manual mappings if needed
    if (lowerName.includes('light repair')) {
      return 'G603 Unimog all types Light Repair.pdf';
    }

    if (lowerName.includes('medium repair')) {
      return 'G604 1 Unimog all types Medium Repair';
    }

    if (lowerName.includes('heavy repair')) {
      return 'G604 2 Unimog all types Heavy Repair';
    }

    // Default: return original name
    return manualName;
  };

  // Update references when manual references from hook change
  useEffect(() => {
    if (manualReferences && manualReferences.length > 0) {
      console.log('🔧 Processing manual references from Barry:', manualReferences);

      const mappedReferences: DocumentReference[] = manualReferences.map(ref => {
        const mappedManualName = mapManualNameToDatabase(ref.manual);
        const doc_id = mappedManualName; // Use mapped manual name as doc_id for API

        console.log(`📖 Mapping "${ref.manual}" -> "${mappedManualName}" (Page ${ref.page})`);

        return {
          doc_id,
          doc_type: 'manual',
          ref: `${mappedManualName} - Page ${ref.page}`,
          title: `${ref.manual} - Page ${ref.page}`, // Keep original for display
          chunks: [],
          media: []
        };
      });

      setCurrentReferences(mappedReferences);
    } else {
      setCurrentReferences([]);
    }
  }, [manualReferences]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isAuthenticated) return;

    const message = inputMessage;
    setInputMessage('');

    try {
      // Include model information in the message context
      const contextualMessage = `[Vehicle: ${selectedModel.name}] ${message}`;
      await sendMessage(contextualMessage);
    } catch (error) {
      console.error('Error sending message to Barry:', error);
      // Error is already handled by the hook
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadFullReference = async (reference: DocumentReference) => {
    if (expandedReference === reference.doc_id) {
      setExpandedReference(null);
      return;
    }

    try {
      console.log('🔍 Loading full reference for:', {
        doc_id: reference.doc_id,
        title: reference.title,
        doc_type: reference.doc_type
      });

      const apiUrl = `/api/wis/document/${encodeURIComponent(reference.doc_id)}`;
      console.log('📡 Making API call to:', apiUrl);

      const response = await fetch(apiUrl);

      console.log('📊 API Response status:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response data:', {
          chunks_count: data.chunks?.length || 0,
          media_count: data.media?.length || 0,
          doc_id: data.doc_id,
          title: data.title
        });

        setCurrentReferences(prev =>
          prev.map(ref =>
            ref.doc_id === reference.doc_id
              ? { ...ref, chunks: data.chunks, media: data.media }
              : ref
          )
        );
        setExpandedReference(reference.doc_id);
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          requested_doc_id: reference.doc_id
        });

        // Show user-friendly error
        alert(`Failed to load manual content: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error loading full reference:', {
        error: error,
        doc_id: reference.doc_id,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      alert('Failed to load manual content. Check console for details.');
    }
  };

  // Disabled proactive media fetching since WIS data is fake
  const fetchProactiveMedia = async (messageContent: string) => {
    // Return empty array since WIS media is all fake
    return [];
  };

  // For now, we don't fetch media since WIS buckets contain fake data
  // Real media from manual_images table would need different handling
  const fetchMediaForReferences = async (references: DocumentReference[]) => {
    // Return empty array since WIS media is fake and manual images need different approach
    return [];
  };

  // Proactively fetch media for Barry's responses
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content) {
      // Fetch media proactively based on response content
      fetchProactiveMedia(lastMessage.content).then(proactiveMedia => {
        if (proactiveMedia.length > 0) {
          setCurrentMedia(prev => {
            // Combine existing media with new proactive media, avoiding duplicates
            const existingFileNames = new Set(prev.map(item => item.file_name));
            const newMedia = proactiveMedia.filter(item => !existingFileNames.has(item.file_name));
            return [...prev, ...newMedia].slice(0, 20); // Limit to 20 items total
          });
        }
      });
    }
  }, [messages]);

  // Update references with media when they change
  useEffect(() => {
    if (currentReferences.length > 0) {
      fetchMediaForReferences(currentReferences).then(mediaItems => {
        setCurrentMedia(prev => {
          // Combine reference media with any existing proactive media
          const existingFileNames = new Set(prev.map(item => item.file_name));
          const newMedia = mediaItems.filter(item => !existingFileNames.has(item.file_name));
          return [...prev, ...newMedia];
        });

        // Also update the references with their associated media
        setCurrentReferences(prev =>
          prev.map(ref => ({
            ...ref,
            media: mediaItems.filter(media =>
              media.description.toLowerCase().includes(ref.title.toLowerCase()) ||
              ref.title.toLowerCase().includes(media.description.toLowerCase())
            )
          }))
        );
      });
    }
  }, [currentReferences]);

  return (
    <div className="grid grid-cols-12 gap-6 h-[600px]">
      {/* Chat Interface */}
      <div className="col-span-12 lg:col-span-8">
        <Card className="h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              Barry - AI Mechanic with Manual Access
            </CardTitle>
            <p className="text-green-100">
              Ask Barry about maintenance, repairs, or any technical questions about your {selectedModel.name}
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    <div className={`flex-1 max-w-[80%] ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-500 text-white ml-auto' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>

                      {/* References for assistant messages */}
                      {message.role === 'assistant' && message.references && message.references.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-2">References:</p>
                          <div className="space-y-1">
                            {message.references.map((ref) => (
                              <Badge
                                key={ref.doc_id}
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-gray-100"
                                onClick={() => loadFullReference(ref)}
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                {ref.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block p-3 rounded-lg bg-gray-100">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-600">Barry is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Barry about your U1700L..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim() || !isAuthenticated}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Content Sidebar */}
      <div className="col-span-12 lg:col-span-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Manual Content
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Tabs defaultValue="current" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
                <TabsTrigger value="current">Current Reference</TabsTrigger>
                <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
                <TabsTrigger value="all">All Manuals</TabsTrigger>
              </TabsList>

              <div className="flex-1 p-4">
                <TabsContent value="current" className="h-full">
                  {currentReferences.length > 0 ? (
                    <ScrollArea className="h-full">
                      <div className="space-y-4">
                        {currentReferences.map((reference) => (
                          <div key={reference.doc_id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{reference.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {reference.doc_type}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{reference.ref}</p>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => loadFullReference(reference)}
                            >
                              {expandedReference === reference.doc_id ? 'Collapse' : 'Open full doc'}
                            </Button>

                            {expandedReference === reference.doc_id && reference.chunks && (
                              <div className="mt-3 space-y-2">
                                {reference.chunks.slice(0, 3).map((chunk: any, index: number) => (
                                  <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                                    {chunk.content}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Display media for this reference */}
                            {reference.media && reference.media.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs text-gray-600 mb-2 font-medium">
                                  Media ({reference.media.length} items)
                                </p>
                                <WISMediaCarousel
                                  media={reference.media}
                                  height={200}
                                  showThumbnails={true}
                                  className="border rounded"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">
                          Manual excerpts and diagrams will appear here when Barry references technical documentation.
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Pages with illustrations will show blue badges in the references section.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="diagrams" className="h-full">
                  {currentMedia.length > 0 ? (
                    <div className="h-full">
                      <WISMediaCarousel
                        media={currentMedia}
                        height="100%"
                        showThumbnails={true}
                        className="h-full"
                      />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">
                          Diagrams and images from Barry's responses will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all" className="h-full">
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        Complete manual library access coming soon.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}