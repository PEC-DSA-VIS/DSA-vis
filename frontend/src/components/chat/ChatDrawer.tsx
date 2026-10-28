import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlgorithmStore } from '../../store/useAlgorithmStore';
import { MarkdownMessage } from './MarkdownMessage';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Bot,
  User,
  X,
  Send,
  Sparkles,
  Zap,
  Trash2,
  Lightbulb,
  CornerDownLeft,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  actionExecuted?: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const { token } = useAuth();
  const {
    currentAlgorithm,
    currentStepIndex,
    steps,
    input,
    comparisons,
    swaps,
    jumpToStep,
    stepForward,
    stepBackward,
    play,
    pause,
    setSpeed,
  } = useAlgorithmStore();

  const currentStep = steps[currentStepIndex] || steps[0];
  const storageKey = `algoviz_chat_${currentAlgorithm.id}`;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Thinking about this step...');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history for current algorithm
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        // Initial welcoming message
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: `Hello! I'm your **AlgoViz DSA Mentor**.\n\nI have full visibility into your current visualization: **${currentAlgorithm.name}** at **Step ${currentStepIndex + 1}**.\n\nAsk me anything about why pointers moved, what code line is running, or request a hint! You can also chat in **English**, **Hindi**, or **Hinglish**.`,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (e) {
      // safe fallback
    }
  }, [currentAlgorithm.id]);

  // Save history on change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (e) {
        // safe ignore
      }
    }
  }, [messages, storageKey]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle external prompt when opened via "Ask AI about this step"
  useEffect(() => {
    if (isOpen && externalPrompt) {
      handleSendMessage(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
    }
  }, [isOpen, externalPrompt]);

  const clearHistory = () => {
    localStorage.removeItem(storageKey);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Chat cleared. Ready for your questions on **${currentAlgorithm.name}**!`,
        timestamp: Date.now(),
      },
    ]);
  };

  // Execute board control tool actions emitted by the AI
  const executeBoardAction = (text: string) => {
    const actionMatch = text.match(/<<<ACTION:([\s\S]*?)>>>/);
    if (!actionMatch) return null;

    try {
      const actionObj = JSON.parse(actionMatch[1]);
      if (actionObj.action === 'jumpToStep' && typeof actionObj.step === 'number') {
        jumpToStep(actionObj.step);
        return `Jumped to Step ${actionObj.step + 1}`;
      } else if (actionObj.action === 'stepForward') {
        stepForward();
        return 'Stepped forward 1 tick';
      } else if (actionObj.action === 'stepBackward') {
        stepBackward();
        return 'Stepped backward 1 tick';
      } else if (actionObj.action === 'play') {
        play();
        return 'Started playback';
      } else if (actionObj.action === 'pause') {
        pause();
        return 'Paused playback';
      } else if (actionObj.action === 'setSpeed' && typeof actionObj.speed === 'number') {
        setSpeed(actionObj.speed);
        return `Set speed to ${actionObj.speed}x`;
      }
    } catch (e) {
      console.warn('Failed to parse AI board action tag:', e);
    }
    return null;
  };

  const handleSendMessage = async (userPrompt?: string) => {
    const query = (userPrompt || inputText).trim();
    if (!query || isLoading) return;

    setErrorBanner(null);
    setInputText('');

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setLoadingStatus('Analyzing algorithmic context...');

    // Build rich context payload
    const contextPayload = {
      algorithmId: currentAlgorithm.id,
      algorithmName: currentAlgorithm.name,
      category: currentAlgorithm.categoryName,
      input,
      currentStepIndex,
      totalSteps: steps.length,
      currentStep: {
        type: currentStep?.type,
        message: currentStep?.message,
        codeLine: currentStep?.codeLine,
        pointers: currentStep?.pointers,
        indices: currentStep?.indices,
      },
      pseudocode: currentAlgorithm.pseudocode,
      pseudocodeLine: currentAlgorithm.pseudocode?.[(currentStep?.codeLine || 1) - 1],
      counters: { comparisons, swaps },
      complexity: currentAlgorithm.complexity,
    };

    const assistantMsgId = `a-${Date.now()}`;
    let accumulatedContent = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          context: contextPayload,
          mode: 'chat',
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Rate limit exceeded. Please wait a moment.');
        }
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported by browser');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // Add placeholder assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        },
      ]);

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.slice(6).trim();
              if (dataStr === '[DONE]') continue;
              try {
                const parsed = JSON.parse(dataStr);
                const delta = parsed.choices?.[0]?.delta?.content || '';
                accumulatedContent += delta;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId ? { ...msg, content: accumulatedContent } : msg
                  )
                );
              } catch (e) {
                // partial json chunk
              }
            }
          }
        }
      }

      // Check if board action was returned
      const executed = executeBoardAction(accumulatedContent);
      if (executed) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, actionExecuted: executed } : msg
          )
        );
      }
    } catch (err: any) {
      setErrorBanner(err.message || 'Failed to connect to AI Mentor');
      setMessages((prev) =>
        prev.filter((m) => m.id !== assistantMsgId)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const quickChips = [
    'Why this step?',
    'Explain this line',
    'What happens next?',
    'Give me a hint',
    'Why is this O(n log n)?',
    'Show me a similar example',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className={cn(
            'fixed right-0 top-14 bottom-0 z-50 bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl flex flex-col transition-all duration-300',
            isExpanded ? 'w-full md:w-[600px]' : 'w-full sm:w-[420px]'
          )}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground">AlgoViz AI Mentor</span>
                  <Badge variant="outline" className="text-[9px] px-1 font-mono text-emerald-500 border-emerald-500/30">
                    Live Context
                  </Badge>
                </div>
                <span className="text-[10px] text-muted-foreground block truncate max-w-[200px]">
                  {currentAlgorithm.name} • Step {currentStepIndex + 1}/{steps.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hidden sm:flex"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Contract' : 'Expand width'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={clearHistory}
                title="Clear chat history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Context Snippet Strip */}
          <div className="px-3.5 py-1.5 bg-primary/5 border-b border-border/80 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="truncate pr-2 font-mono">
              Line {currentStep?.codeLine || 1}: {currentAlgorithm.pseudocode?.[(currentStep?.codeLine || 1) - 1] || 'Running'}
            </span>
            <span className="shrink-0 font-semibold text-primary text-[10px]">
              Comp: {comparisons}
            </span>
          </div>

          {/* Quick Action Chips Bar */}
          <div className="p-2 border-b border-border bg-muted/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
            {quickChips.map((chip) => (
              <Button
                key={chip}
                variant="outline"
                size="sm"
                className="h-6 px-2.5 text-[10px] rounded-full whitespace-nowrap shrink-0 hover:bg-primary/10 hover:text-primary hover:border-primary/40 font-medium"
                onClick={() => handleSendMessage(chip)}
                disabled={isLoading}
              >
                <Sparkles className="w-2.5 h-2.5 mr-1 text-primary" />
                {chip}
              </Button>
            ))}
          </div>

          {/* Error Banner if any */}
          {errorBanner && (
            <div className="m-3 p-2.5 rounded-lg bg-destructive/15 text-destructive border border-destructive/30 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="flex-1">{errorBanner}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1.5 text-xs text-destructive hover:bg-destructive/20"
                onClick={() => handleSendMessage()}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col gap-1 max-w-[90%]',
                    isAssistant ? 'mr-auto items-start' : 'ml-auto items-end'
                  )}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1">
                    {isAssistant ? (
                      <>
                        <Bot className="w-3 h-3 text-primary" />
                        <span>AI Mentor</span>
                      </>
                    ) : (
                      <>
                        <span>You</span>
                        <User className="w-3 h-3" />
                      </>
                    )}
                  </div>

                  <div
                    className={cn(
                      'p-3.5 rounded-2xl shadow-xs transition-all',
                      isAssistant
                        ? 'bg-muted/70 text-foreground border border-border/80 rounded-tl-sm'
                        : 'bg-primary text-primary-foreground font-medium rounded-tr-sm'
                    )}
                  >
                    {isAssistant ? (
                      <MarkdownMessage content={msg.content} />
                    ) : (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>

                  {/* Executed Board Action Pill */}
                  {msg.actionExecuted && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold"
                    >
                      <Zap className="w-3 h-3 text-emerald-500" />
                      <span>{msg.actionExecuted}</span>
                    </motion.div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col gap-1 mr-auto items-start max-w-[85%]">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-1">
                  <Bot className="w-3 h-3 text-primary animate-pulse" />
                  <span>AI Mentor</span>
                </div>
                <div className="p-3 rounded-2xl bg-muted/70 border border-border/80 text-xs flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                  </div>
                  <span className="text-[11px]">{loadingStatus}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Form */}
          <div className="p-3 border-t border-border bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center"
            >
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about this step or algorithm (English / Hinglish)..."
                rows={1}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-input bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none max-h-24"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputText.trim() || isLoading}
                className="absolute right-1.5 h-7 w-7 rounded-lg shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-muted-foreground">
              <span>Press Enter to send</span>
              <span className="text-primary font-medium">Hint-first mentor</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
