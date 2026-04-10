import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, RotateCw, Trash2, AlertCircle, LogIn, ExternalLink, Search, Mic, MicOff, Volume2, VolumeX, Camera, X, ThumbsUp, ThumbsDown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSecureGemini } from '@/hooks/use-secure-gemini';
import { supabase } from '@/lib/supabase-client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ZoomableImage } from './ZoomableImage';

interface SecureBarryChatProps {
  height?: string;
  className?: string;
  location?: { latitude: number; longitude: number };
}

export function SecureBarryChat({ height = "600px", className, location }: SecureBarryChatProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ data: string; mediaType: string; preview: string } | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Set<number>>(new Set());
  const prevMessageCountRef = useRef(0);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const {
    messages,
    webSearchResults,
    knowledgeMode,
    isLoading,
    error,
    isAuthenticated,
    sendMessage,
    clearChat,
    retry
  } = useSecureGemini(location);

  // Initialize speech synthesis and cancel on unmount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');

      setInput(transcript);

      // Auto-submit on final result
      if (event.results[event.results.length - 1].isFinal) {
        setIsListening(false);
        if (transcript.trim()) {
          setInput('');
          sendMessage(transcript.trim());
        }
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        console.warn('[Voice] Speech recognition error:', event.error);
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [sendMessage]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  // Auto-read Barry's responses aloud when voice is enabled (only for NEW messages)
  useEffect(() => {
    if (!voiceEnabled || !synthRef.current || messages.length === 0) return;
    // Only speak when a new message was added (not on mount/re-render)
    if (messages.length <= prevMessageCountRef.current) {
      prevMessageCountRef.current = messages.length;
      return;
    }
    prevMessageCountRef.current = messages.length;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'assistant' && !isLoading) {
      const cleanText = lastMsg.content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/^[-*]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        .replace(/^>\s+/gm, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\n+/g, '. ')
        .replace(/\.\s*\./g, '.')
        .substring(0, 500);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 0.9;
      synthRef.current.speak(utterance);
    }
  }, [messages, isLoading, voiceEnabled]);

  // Clear transient state when chat is cleared
  useEffect(() => {
    if (messages.length <= 1) {
      if (feedbackGiven.size > 0) setFeedbackGiven(new Set());
      if (pendingImage) setPendingImage(null);
    }
  }, [messages.length, feedbackGiven.size, pendingImage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Keep input visible when virtual keyboard opens on mobile
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const handleResize = () => {
      const formEl = document.querySelector('[data-barry-input]');
      if (formEl) {
        formEl.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }
    };
    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, []);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 3 * 1024 * 1024) return; // 3MB limit (base64 expands ~33%, must stay under 6MB edge function limit)

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setPendingImage({
        data: base64,
        mediaType: file.type,
        preview: result
      });
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = '';
  }, []);

  const submitFeedback = useCallback(async (messageIndex: number, isCorrect: boolean) => {
    if (feedbackGiven.has(messageIndex)) return;

    const assistantMsg = messages[messageIndex];
    if (!assistantMsg || assistantMsg.role !== 'assistant') return;

    const userMsg = messages.slice(0, messageIndex).reverse().find(m => m.role === 'user');
    if (!userMsg) return;

    setFeedbackGiven(prev => new Set(prev).add(messageIndex));

    try {
      await supabase.functions.invoke('validate-barry-answer', {
        body: {
          userQuery: userMsg.content,
          barryResponse: assistantMsg.content,
          isCorrect,
          searchMethod: 'agentic_rag'
        }
      });
    } catch {
      // Feedback is best-effort, don't block UI
    }
  }, [messages, feedbackGiven]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !pendingImage) || isLoading || !isAuthenticated) return;

    const message = input || (pendingImage ? 'What can you tell me about this?' : '');
    const imageToSend = pendingImage;
    setInput('');
    setPendingImage(null);

    try {
      await sendMessage(message, imageToSend ? { data: imageToSend.data, mediaType: imageToSend.mediaType } : undefined);
    } catch (err) {
      // Error is handled by the hook
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
      <div className={cn("flex flex-col items-center justify-center", className)} style={{ height }}>
        <Alert className="max-w-md mx-4">
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
    <div className={cn("flex flex-col bg-background", className)} style={{ height }}>
      {/* Chat Header Actions */}
      <div className="flex items-center justify-end gap-2 p-2 border-b">
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

                {/* Display manual images if available */}
                {message.role === 'assistant' && message.images && message.images.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs opacity-70 font-medium">Related Technical Diagrams:</div>
                    <div className="grid grid-cols-1 gap-2">
                      {message.images.map((image: any, imgIndex: number) => (
                        <div key={imgIndex} className="border rounded-lg overflow-hidden bg-white">
                          <img
                            src={image.url}
                            alt={image.description || 'Technical diagram'}
                            className="w-full h-auto max-h-48 object-contain"
                            loading="lazy"
                          />
                          {image.description && (
                            <div className="p-2 text-xs text-gray-600 bg-gray-50">
                              {image.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Display manual references if available */}
                {message.role === 'assistant' && message.manualReferences && message.manualReferences.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <div className="text-xs opacity-70 space-y-2">
                      <div className="font-medium">Sources:</div>
                      {message.manualReferences.map((ref: any, refIndex: number) => (
                        <div key={refIndex}>
                          {ref.type === 'rps_illustration' ? (
                            <div className="space-y-1">
                              <div className="text-xs">📋 {ref.title}</div>
                              <ZoomableImage
                                src={ref.cdn_url || ref.storage_url}
                                alt={ref.title}
                                className="max-w-full h-auto rounded border border-border"
                              />
                            </div>
                          ) : ref.type === 'manual' ? (
                            <div className="text-xs">📖 {ref.manual} (Page {ref.page})</div>
                          ) : (
                            <div className="text-xs">🔧 {ref.source}: {ref.title}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {message.role === 'assistant' && index > 0 && (
                  <div className="flex items-center gap-2 mt-2 pt-1">
                    {feedbackGiven.has(index) ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Feedback recorded
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => submitFeedback(index, true)}
                          className="text-muted-foreground hover:text-green-600 transition-colors"
                          title="This answer was helpful"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => submitFeedback(index, false)}
                          className="text-muted-foreground hover:text-red-600 transition-colors"
                          title="This answer was wrong"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs text-muted-foreground">Was this helpful?</span>
                      </>
                    )}
                  </div>
                )}

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

          {webSearchResults && webSearchResults.length > 0 && knowledgeMode === 'web_search' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 text-sm">
                  Web Search Results ({webSearchResults.length})
                </span>
              </div>
              <div className="space-y-2">
                {webSearchResults.map((result, index) => (
                  <a
                    key={index}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-white rounded border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-blue-700 text-sm truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {result.description}
                        </div>
                        {result.price && (
                          <div className="text-sm font-medium text-green-600 mt-1">
                            {result.price}
                          </div>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mx-4 mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Preview */}
      {pendingImage && (
        <div className="mx-4 mt-2 relative inline-block">
          <img src={pendingImage.preview} alt="Attached" className="h-20 rounded border" />
          <button
            type="button"
            onClick={() => setPendingImage(null)}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Input Area */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleImageSelect}
      />
      <form onSubmit={handleSubmit} className="border-t p-4" data-barry-input>
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Ask Barry about your Unimog..."}
            className={cn("min-h-[60px] resize-none", isListening && "border-red-400 bg-red-50/10")}
            disabled={isLoading || isListening}
            rows={2}
            enterKeyHint="send"
          />
          <div className="flex flex-col gap-1 self-end">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => imageInputRef.current?.click()}
              disabled={isLoading}
              title="Attach photo"
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleListening}
              disabled={isLoading}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              type="submit"
              disabled={(!input.trim() && !pendingImage) || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>Enter to send, Shift+Enter for new line</span>
          <button
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            title={voiceEnabled ? "Mute Barry's voice" : "Enable Barry's voice"}
          >
            {voiceEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            <span>{voiceEnabled ? 'Voice on' : 'Voice off'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}