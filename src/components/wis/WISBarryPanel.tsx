import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  FileText, 
  Image as ImageIcon,
  BookOpen,
  Loader2,
  X,
  Minimize2,
  Maximize2,
  ExternalLink,
  RefreshCw,
  Zap,
  MessageCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedWISResult, WISProcedure, WISPart, WISBulletin } from '@/lib/unified-wis-search';
import { getModelDisplayName } from './VehicleModelSelector';

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
}

interface WISBarryPanelProps {
  selectedModel?: string;
  currentDocument?: UnifiedWISResult | WISProcedure | WISPart | WISBulletin | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function WISBarryPanel({ 
  selectedModel, 
  currentDocument, 
  isOpen, 
  onClose,
  className = '' 
}: WISBarryPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentReferences, setCurrentReferences] = useState<DocumentReference[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { session } = useAuth();

  // Initialize with contextual greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const modelName = selectedModel ? getModelDisplayName(selectedModel) : 'your Unimog';
      const contextualGreeting = currentDocument
        ? `G'day! I see you're looking at "${currentDocument.title}" ${currentDocument.reference_number ? `(${currentDocument.reference_number})` : ''}. I've got the full technical details loaded up - ask me anything about this procedure, related parts, or any other ${modelName} questions!`
        : `G'day! I'm Barry, your AI Unimog specialist. I can help with technical questions about ${modelName}, explain procedures, find parts, or provide general assistance. What can I help you with today?`;

      const greeting: ChatMessage = {
        id: 'greeting',
        role: 'assistant',
        content: contextualGreeting,
        timestamp: new Date(),
        references: currentDocument ? [{
          doc_id: currentDocument.doc_id || (currentDocument as any).id || 'current',
          doc_type: currentDocument.doc_type || 'document',
          ref: currentDocument.reference_number || 'Current Document',
          title: currentDocument.title
        }] : []
      };
      setMessages([greeting]);
    }
  }, [isOpen, currentDocument, selectedModel]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update context when document changes
  useEffect(() => {
    if (currentDocument && messages.length > 0) {
      const contextMessage: ChatMessage = {
        id: `context-${Date.now()}`,
        role: 'assistant',
        content: `I've updated my context to "${currentDocument.title}". I now have the complete technical details loaded and can answer specific questions about this document.`,
        timestamp: new Date(),
        references: [{
          doc_id: currentDocument.doc_id || (currentDocument as any).id || 'current',
          doc_type: currentDocument.doc_type || 'document',
          ref: currentDocument.reference_number || 'Current Document',
          title: currentDocument.title
        }]
      };
      setMessages(prev => [...prev, contextMessage]);
    }
  }, [currentDocument?.doc_id, currentDocument?.title]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setLoading(true);

    try {
      if (!session?.access_token) {
        throw new Error('Please sign in to chat with Barry');
      }

      // Build context-aware message
      let contextualMessage = messageToSend;
      
      if (selectedModel) {
        const modelName = getModelDisplayName(selectedModel);
        contextualMessage = `[${modelName}] ${messageToSend}`;
      }

      if (currentDocument) {
        contextualMessage += `\n\nCurrent WIS Document Context: "${currentDocument.title}" (${currentDocument.reference_number || 'N/A'})`;
        if (currentDocument.content_summary) {
          contextualMessage += `\nDocument Summary: ${currentDocument.content_summary}`;
        }
        if ((currentDocument as any).content) {
          contextualMessage += `\nFull Content: ${(currentDocument as any).content.substring(0, 1000)}...`;
        }
      }

      const { data, error } = await supabase.functions.invoke('chat-with-barry-claude', {
        body: {
          messages: [
            { role: 'user', content: contextualMessage }
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

    } catch (error) {
      console.error('Error sending message to Barry:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry mate, I'm having trouble with the technical systems right now. Try asking your question again, or feel free to ask me anything else about Unimogs!",
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

  const clearChat = () => {
    setMessages([]);
    setCurrentReferences([]);
    // Re-initialize with contextual greeting
    const modelName = selectedModel ? getModelDisplayName(selectedModel) : 'your Unimog';
    const greeting: ChatMessage = {
      id: 'new-greeting',
      role: 'assistant',
      content: `Chat cleared! I'm ready to help with ${modelName} questions${currentDocument ? ` and I still have "${currentDocument.title}" loaded for context` : ''}.`,
      timestamp: new Date()
    };
    setMessages([greeting]);
  };

  if (!isOpen) return null;

  const panelWidth = isMinimized ? 'w-80' : 'w-96';
  
  return (
    <div className={`fixed right-4 top-20 bottom-4 ${panelWidth} z-50 ${className}`}>
      <Card className="h-full flex flex-col border-2 border-blue-200 shadow-xl bg-white">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="w-5 h-5" />
              WIS Barry - Technical Assistant
              {currentDocument && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  Context Loaded
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                title="Clear chat"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {!isMinimized && (
            <div className="text-green-100 text-sm mt-1">
              {selectedModel ? `${getModelDisplayName(selectedModel)} Specialist` : 'Unimog Specialist'}
              {currentDocument && (
                <div className="text-xs mt-1 opacity-90">
                  📄 Analyzing: {currentDocument.title}
                </div>
              )}
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-2 ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                        message.role === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-3 h-3" />
                        ) : (
                          <Bot className="w-3 h-3" />
                        )}
                      </div>

                      <div className={`flex-1 max-w-[85%] ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`inline-block p-2 rounded-lg text-sm ${
                          message.role === 'user' 
                            ? 'bg-blue-500 text-white ml-auto' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>

                        {/* References for assistant messages */}
                        {message.role === 'assistant' && message.references && message.references.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {message.references.map((ref) => (
                                <Badge
                                  key={ref.doc_id}
                                  variant="outline"
                                  className="text-xs cursor-pointer hover:bg-blue-50 border-blue-200"
                                >
                                  <FileText className="w-2.5 h-2.5 mr-1" />
                                  {ref.title.substring(0, 30)}...
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <Bot className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                        <div className="inline-block p-2 rounded-lg bg-gray-100">
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span className="text-xs text-gray-600">Analyzing...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentDocument 
                      ? "Ask about this document..." 
                      : "Ask Barry anything..."
                    }
                    disabled={loading}
                    className="flex-1 text-sm"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={loading || !inputMessage.trim()}
                    className="bg-green-600 hover:bg-green-700 px-3"
                    size="sm"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
                
                {currentDocument && (
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Context: {currentDocument.title.substring(0, 40)}...
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

export default WISBarryPanel;