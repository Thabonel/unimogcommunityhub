import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VoiceInterfaceProps {
  enabled: boolean;
  isListening: boolean;
  onVoiceInput: (transcript: string) => void;
  onInputChange: (value: string) => void;
  currentInput: string;
  onSubmit: (message: string) => void;
  isProcessing: boolean;
}

export function VoiceInterface({
  enabled,
  isListening,
  onVoiceInput,
  onInputChange,
  currentInput,
  onSubmit,
  isProcessing
}: VoiceInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        if (event.results[event.results.length - 1].isFinal) {
          onVoiceInput(transcript);
          setIsRecording(false);
        } else {
          onInputChange(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    }

    // Speech Synthesis
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSpeechSynthesis(synth);

      const updateVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);

        // Select a good default voice
        const englishVoices = availableVoices.filter(voice => voice.lang.startsWith('en'));
        const preferredVoice = englishVoices.find(voice =>
          voice.name.includes('Male') || voice.name.includes('Daniel') || voice.name.includes('Alex')
        ) || englishVoices[0];

        if (preferredVoice) {
          setSelectedVoice(preferredVoice.name);
        }
      };

      updateVoices();
      synth.onvoiceschanged = updateVoices;
    }
  }, []);

  // Initialize audio level monitoring
  useEffect(() => {
    if (enabled && isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

          microphoneRef.current.connect(analyserRef.current);
          analyserRef.current.fftSize = 256;

          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

          const updateAudioLevel = () => {
            if (analyserRef.current && isRecording) {
              analyserRef.current.getByteFrequencyData(dataArray);
              const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
              setAudioLevel(average / 255);
              requestAnimationFrame(updateAudioLevel);
            }
          };

          updateAudioLevel();
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
        });
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled, isRecording]);

  const startListening = () => {
    if (recognition && enabled) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  const speak = (text: string) => {
    if (speechSynthesis && selectedVoice) {
      speechSynthesis.cancel(); // Stop any current speech

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.name === selectedVoice);

      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentInput.trim() || isProcessing) return;
    onSubmit(currentInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Voice Status */}
      {enabled && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              <div className="flex items-center gap-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"
                )}>
                </div>
                {isRecording ? 'Listening' : 'Voice Ready'}
              </div>
            </Badge>

            {/* Audio Level Indicator */}
            {isRecording && (
              <div className="flex items-center gap-1">
                <div className="flex items-end gap-1 h-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 bg-military-green rounded-sm transition-all duration-100",
                        audioLevel * 5 > i ? "opacity-100" : "opacity-30"
                      )}
                      style={{
                        height: `${Math.max(0.25, Math.min(1, (audioLevel * 5 - i))) * 16}px`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Speech Controls */}
          <div className="flex items-center gap-2">
            {isSpeaking ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopSpeaking}
                className="text-red-400 hover:text-red-300"
              >
                <VolumeX className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speak("Voice interface is ready for your command")}
                className="text-gray-400 hover:text-white"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={currentInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              enabled
                ? "Ask Barry about brake systems, engine diagnostics, or click the mic to speak..."
                : "Ask Barry about brake systems, engine diagnostics, maintenance procedures..."
            }
            className={cn(
              "min-h-[80px] resize-none bg-gray-900 border-military-green/30",
              "text-white placeholder:text-gray-400 focus:border-military-green/50",
              "pr-20" // Space for buttons
            )}
            disabled={isProcessing}
            rows={3}
          />

          {/* Voice Button */}
          {enabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={isRecording ? stopListening : startListening}
              className={cn(
                "absolute bottom-2 right-12 text-white hover:bg-military-green/30",
                isRecording ? "bg-red-500/20 text-red-400" : "",
                !recognition ? "opacity-50 cursor-not-allowed" : ""
              )}
              disabled={!recognition || isProcessing}
            >
              {isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Send Button */}
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={!currentInput.trim() || isProcessing}
            className="absolute bottom-2 right-2 text-white hover:bg-military-green/30 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Commands */}
        <div className="flex flex-wrap gap-2">
          {[
            "Show me brake system diagrams",
            "Explain engine diagnostics",
            "Troubleshoot hydraulic issues",
            "Parts identification guide"
          ].map((command) => (
            <Button
              key={command}
              variant="outline"
              size="sm"
              onClick={() => onInputChange(command)}
              className="text-xs h-7 bg-military-green/10 border-military-green/30 text-military-green hover:bg-military-green/20"
              disabled={isProcessing}
            >
              {command}
            </Button>
          ))}
        </div>
      </form>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 text-military-green">
            <div className="w-4 h-4 border-2 border-military-green border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Barry is analyzing your request...</span>
          </div>
        </div>
      )}
    </div>
  );
}