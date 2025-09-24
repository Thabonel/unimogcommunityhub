import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Minimize2, Volume2, VolumeX, Mic, MicOff, Settings, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ReferenceViewer } from './ReferenceViewer';
import { AIResponseStream } from './AIResponseStream';
import { VoiceInterface } from './VoiceInterface';
import { ManualNavigator } from './ManualNavigator';
import { useSecureGemini } from '@/hooks/use-secure-gemini';

interface TVModeContainerProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TVModeContainer({ user, isOpen, onClose }: TVModeContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentReference, setCurrentReference] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the secure Gemini hook for Barry AI
  const {
    messages,
    isLoading: isProcessing,
    error,
    isAuthenticated,
    sendMessage,
    clearChat
  } = useSecureGemini();

  // Initialize with welcome message if no messages
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send an initial system message to set the context
      const welcomeMessage = `Welcome to Barry TV Mode, ${user?.name || 'Commander'}! I'm your immersive AI Unimog technical assistant. Ask me anything about your ${user?.unimogModel || 'Unimog'} - brake systems, engine diagnostics, maintenance procedures, or parts identification. I have access to 1,185 manual sections and can display technical diagrams instantly.`;
      // The welcome message will be handled by the AI system
    }
  }, [isOpen, messages.length, user?.name, user?.unimogModel]);

  // Initialize TV mode
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (containerRef.current) {
        containerRef.current.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle fullscreen toggle
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle voice input
  const handleVoiceInput = (transcript: string) => {
    setCurrentInput(transcript);
    handleSendMessage(transcript);
  };

  // Handle sending messages to Barry
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isProcessing) return;

    setCurrentInput('');

    try {
      // Use the secure Gemini hook to send message
      await sendMessage(message, {
        name: user?.name || 'User',
        unimog_model: user?.unimogModel || 'Unknown',
        language: 'English',
        personality: 'professional'
      });

    } catch (error) {
      console.error('Error calling Barry:', error);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'F11':
          e.preventDefault();
          toggleFullscreen();
          break;
        case ' ':
          if (e.ctrlKey) {
            e.preventDefault();
            setVoiceEnabled(!voiceEnabled);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [isOpen, voiceEnabled, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 bg-black text-white font-mono",
        "flex flex-col overflow-hidden",
        isFullscreen ? "cursor-none" : ""
      )}
      tabIndex={-1}
    >
      {/* Top Control Bar */}
      <div className={cn(
        "flex items-center justify-between p-4 bg-military-green/20 border-b border-military-green/30",
        "transition-opacity duration-300",
        isFullscreen ? "opacity-0 hover:opacity-100" : "opacity-100"
      )}>
        <div className="flex items-center gap-4">
          <Monitor className="h-6 w-6 text-military-green" />
          <div>
            <h1 className="text-lg font-bold">BARRY TV MODE</h1>
            <p className="text-xs text-gray-400">
              AI Technical Assistant • {user?.unimogModel || 'Unimog'} • {user?.name || 'User'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {messages.length - 1} Queries
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={cn(
              "text-white hover:bg-military-green/30",
              voiceEnabled ? "bg-military-green/20" : ""
            )}
          >
            {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-white hover:bg-military-green/30"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-military-green/30"
          >
            ×
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Panel - Reference Viewer */}
        <div className="w-1/3 border-r border-military-green/30 bg-gray-900">
          <ReferenceViewer
            reference={currentReference}
            onNavigate={setCurrentReference}
          />
        </div>

        {/* Center Panel - AI Interaction */}
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 overflow-hidden">
            <AIResponseStream
              messages={messages}
              isProcessing={isProcessing}
              onReferenceClick={setCurrentReference}
            />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-military-green/30 bg-military-green/5">
            <VoiceInterface
              enabled={voiceEnabled}
              isListening={isListening}
              onVoiceInput={handleVoiceInput}
              onInputChange={setCurrentInput}
              currentInput={currentInput}
              onSubmit={handleSendMessage}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Right Panel - Manual Navigator */}
        <div className="w-1/4 border-l border-military-green/30 bg-gray-900">
          <ManualNavigator
            currentReference={currentReference}
            onReferenceSelect={setCurrentReference}
            userModel={user?.unimogModel}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-military-green/10 border-t border-military-green/30 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            BARRY ONLINE
          </span>
          <span>DB: 1,185 Chunks • Images: 1,181</span>
          {currentReference && (
            <span>Current: {currentReference.manual} Page {currentReference.page}</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span>ESC: Exit • F11: Fullscreen • Ctrl+Space: Voice</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}