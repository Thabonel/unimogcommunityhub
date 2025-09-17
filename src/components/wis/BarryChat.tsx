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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentReferences, setCurrentReferences] = useState<DocumentReference[]>([]);
  const [currentMedia, setCurrentMedia] = useState<any[]>([]);
  const [expandedReference, setExpandedReference] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { session } = useAuth();

  // Initialize with Barry's greeting
  useEffect(() => {
    const greeting: ChatMessage = {
      id: 'greeting',
      role: 'assistant',
      content: "G'day! I'm Barry, your AI assistant and Unimog specialist. Been wrenching on these beasts for over 40 years, but I'm here to help with anything you need - weather forecasts, directions, general questions, or of course, any Unimog problems. What can I help you with today?",
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      if (!session?.access_token) {
        throw new Error('Please sign in to chat with Barry');
      }

      const { data, error } = await supabase.functions.invoke('chat-with-barry', {
        body: {
          messages: [
            { role: 'user', content: `[${selectedModel.name}] ${inputMessage}` }
          ]
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get response from Barry');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        references: data.manualReferences || [],
        media: []
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentReferences(data.manualReferences || []);
      setCurrentMedia([]);

    } catch (error) {
      console.error('Error sending message to Barry:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry mate, I'm having a bit of trouble accessing the workshop database right now. Try again in a moment, or feel free to ask me anything else!",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const loadFullReference = async (reference: DocumentReference) => {
    if (expandedReference === reference.doc_id) {
      setExpandedReference(null);
      return;
    }

    try {
      const response = await fetch(`/api/wis/document/${reference.doc_id}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentReferences(prev =>
          prev.map(ref =>
            ref.doc_id === reference.doc_id
              ? { ...ref, chunks: data.chunks }
              : ref
          )
        );
      }
      setExpandedReference(reference.doc_id);
    } catch (error) {
      console.error('Error loading full reference:', error);
    }
  };

  // Fetch media from WIS database for references
  const fetchMediaForReferences = async (references: DocumentReference[]) => {
    try {
      // Extract keywords from reference titles for searching
      const keywords = references
        .map(ref => ref.title.toLowerCase())
        .join(' ')
        .split(' ')
        .filter(word => word.length > 3) // Only use meaningful words
        .slice(0, 5); // Limit to first 5 keywords

      if (keywords.length === 0) {
        return [];
      }

      // Query WIS database directly for documents with media
      const { data: wisDocuments, error } = await supabase
        .from('wis_documents_unified')
        .select('doc_id, title, media')
        .not('media', 'is', null)
        .gte('media->0', 'null') // Has at least one media item
        .or(keywords.map(keyword => `title.ilike.%${keyword}%`).join(','))
        .limit(10);

      if (error) {
        console.error('Error fetching WIS documents:', error);
        return [];
      }

      // Convert WIS media to MediaItem format and generate signed URLs
      const mediaItems: MediaItem[] = [];

      for (const doc of (wisDocuments || [])) {
        if (doc.media && Array.isArray(doc.media)) {
          for (const mediaItem of doc.media) {
            try {
              // Generate signed URL for each media item
              const signedUrl = await supabase
                .storage
                .from(mediaItem.bucket || 'wis-media')
                .createSignedUrl(mediaItem.file_name, 3600); // 1 hour expiry

              mediaItems.push({
                type: mediaItem.type || 'document',
                bucket: mediaItem.bucket || 'wis-media',
                file_name: mediaItem.file_name,
                description: mediaItem.description || doc.title,
                signed_url: signedUrl.data?.signedUrl
              });
            } catch (error) {
              console.error(`Failed to get signed URL for ${mediaItem.file_name}:`, error);
              // Add without signed URL as fallback
              mediaItems.push({
                type: mediaItem.type || 'document',
                bucket: mediaItem.bucket || 'wis-media',
                file_name: mediaItem.file_name,
                description: mediaItem.description || doc.title
              });
            }
          }
        }
      }

      return mediaItems;
    } catch (error) {
      console.error('Error fetching media for references:', error);
      return [];
    }
  };

  // Update references with media when they change
  useEffect(() => {
    if (currentReferences.length > 0) {
      fetchMediaForReferences(currentReferences).then(mediaItems => {
        setCurrentMedia(mediaItems);
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
    } else {
      setCurrentMedia([]);
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
                
                {loading && (
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
                  disabled={loading}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={loading || !inputMessage.trim()}
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