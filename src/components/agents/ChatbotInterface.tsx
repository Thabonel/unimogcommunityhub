import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AgentOrchestrator } from '@/services/agents/AgentOrchestrator';
import { ChatMessage, AgentTask, AgentContext } from '@/services/agents/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChatbotInterfaceProps {
  className?: string;
}

export function ChatbotInterface({ className }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "👋 Hello! I'm your Claude Code assistant. I can coordinate various specialized agents to help with your development tasks. What would you like to work on today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTasks, setActiveTasks] = useState<AgentTask[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const orchestratorRef = useRef<AgentOrchestrator>();

  // Initialize orchestrator
  useEffect(() => {
    const context: AgentContext = {
      user: {
        id: 'user-1',
        name: 'Developer',
        role: 'admin'
      },
      project: {
        name: 'UnimogCommunityHub',
        path: '/Users/thabonel/Documents/unimogcommunityhub',
        type: 'react-typescript'
      },
      session: {
        id: `session-${Date.now()}`,
        startedAt: new Date(),
        history: messages
      },
      preferences: {}
    };

    orchestratorRef.current = new AgentOrchestrator(context);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing || !orchestratorRef.current) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Parse user intent and delegate to appropriate agent
      const intent = parseUserIntent(input);
      
      // Add assistant acknowledgment
      const ackMessage: ChatMessage = {
        role: 'assistant',
        content: `I understand you want to ${intent.action}. Let me coordinate the right agents for this task...`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, ackMessage]);

      // Execute task with appropriate agent
      const response = await orchestratorRef.current.executeTask(
        intent.agentId,
        intent.description,
        intent.input
      );

      // Update active tasks
      const tasks = orchestratorRef.current.getActiveTasks();
      setActiveTasks(tasks);

      // Add result message
      const resultMessage: ChatMessage = {
        role: 'assistant',
        content: formatAgentResponse(response),
        agentId: response.agentId,
        timestamp: new Date(),
        metadata: { response }
      };
      setMessages(prev => [...prev, resultMessage]);

    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Let me try a different approach...`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseUserIntent = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Test-related
    if (lowerInput.includes('test') || lowerInput.includes('coverage')) {
      return {
        agentId: 'test-writer' as const,
        action: 'write tests',
        description: input,
        input: { type: 'unit' }
      };
    }
    
    // Code analysis
    if (lowerInput.includes('analyze') || lowerInput.includes('review') || lowerInput.includes('quality')) {
      return {
        agentId: 'code-analyzer' as const,
        action: 'analyze code',
        description: input,
        input: {}
      };
    }
    
    // Performance
    if (lowerInput.includes('performance') || lowerInput.includes('optimize') || lowerInput.includes('speed')) {
      return {
        agentId: 'performance-optimizer' as const,
        action: 'optimize performance',
        description: input,
        input: {}
      };
    }
    
    // Security
    if (lowerInput.includes('security') || lowerInput.includes('vulnerability') || lowerInput.includes('audit')) {
      return {
        agentId: 'security-auditor' as const,
        action: 'audit security',
        description: input,
        input: {}
      };
    }
    
    // UI/UX
    if (lowerInput.includes('component') || lowerInput.includes('ui') || lowerInput.includes('design')) {
      return {
        agentId: 'ui-ux-designer' as const,
        action: 'create UI components',
        description: input,
        input: {}
      };
    }
    
    // Database
    if (lowerInput.includes('database') || lowerInput.includes('sql') || lowerInput.includes('query')) {
      return {
        agentId: 'database-architect' as const,
        action: 'optimize database',
        description: input,
        input: {}
      };
    }
    
    // Documentation
    if (lowerInput.includes('document') || lowerInput.includes('docs') || lowerInput.includes('readme')) {
      return {
        agentId: 'docs-writer' as const,
        action: 'write documentation',
        description: input,
        input: {}
      };
    }
    
    // Default to chatbot for coordination
    return {
      agentId: 'chatbot' as const,
      action: 'coordinate task',
      description: input,
      input: {}
    };
  };

  const formatAgentResponse = (response: any) => {
    if (!response.success) {
      return `❌ Task failed: ${response.error}`;
    }

    const agent = response.agentId;
    const result = response.result;

    switch (agent) {
      case 'test-writer':
        return `✅ Test suite created! Generated ${result.testsCreated} tests with ${result.coverage}% coverage. Files: ${result.files.join(', ')}`;
      
      case 'code-analyzer':
        return `🔍 Code analysis complete! Found ${result.issues} issues (${result.critical} critical). Suggestions: ${result.suggestions.join(', ')}`;
      
      case 'database-architect':
        return `🗄️ Database optimized! Applied ${result.optimizations} optimizations. Migrations: ${result.migrations.join(', ')}`;
      
      case 'chatbot':
        return `💬 I've identified this as a ${result.intent} request. Delegating to: ${result.delegatedTo.join(', ')}`;
      
      default:
        return `✅ Task completed successfully! ${JSON.stringify(result)}`;
    }
  };

  const getAgentEmoji = (agentId?: string) => {
    const emojis: Record<string, string> = {
      'test-writer': '🧪',
      'code-analyzer': '🔍',
      'performance-optimizer': '⚡',
      'security-auditor': '🔐',
      'pam-enhancer': '🤖',
      'ui-ux-designer': '🎨',
      'database-architect': '🗄️',
      'docs-writer': '📚',
      'chatbot': '💬'
    };
    return emojis[agentId || ''] || '🤖';
  };

  return (
    <div className={cn("flex flex-col h-[600px]", className)}>
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Claude Code Agent Assistant
            {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
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
                      "max-w-[80%] rounded-lg px-4 py-2",
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.agentId && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getAgentEmoji(message.agentId)}</span>
                        <span className="text-xs font-medium">{message.agentId}</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    <div className={cn(
                      "text-xs mt-1 opacity-70",
                      message.role === 'user' ? 'text-right' : 'text-left'
                    )}>
                      {format(message.timestamp, 'HH:mm')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div className="border-t p-3">
              <div className="text-xs font-medium mb-2">Active Tasks:</div>
              <div className="space-y-1">
                {activeTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2 text-xs">
                    {task.status === 'completed' && <CheckCircle className="h-3 w-3 text-green-500" />}
                    {task.status === 'in_progress' && <Loader2 className="h-3 w-3 animate-spin" />}
                    {task.status === 'failed' && <AlertCircle className="h-3 w-3 text-red-500" />}
                    <span>{task.agentId}: {task.description}</span>
                    <Badge variant={task.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to write tests, analyze code, optimize performance, or any development task..."
                className="min-h-[60px] resize-none"
                disabled={isProcessing}
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="self-end"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </div>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-4">
        <Alert>
          <Bot className="h-4 w-4" />
          <AlertDescription>
            <strong>Available Agents:</strong> Test Writer 🧪, Code Analyzer 🔍, Performance Optimizer ⚡, 
            Security Auditor 🔐, UI/UX Designer 🎨, Database Architect 🗄️, Documentation Writer 📚
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}