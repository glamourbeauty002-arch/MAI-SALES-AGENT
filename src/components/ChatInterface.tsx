import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { getGeminiResponse } from '../services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatProps {
  agentName: string;
  agentEnabled?: boolean;
}

export default function ChatInterface({ agentName, agentEnabled = true }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('MAI_CHAT_MESSAGES');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        console.error("Failed to parse chat messages", e);
      }
    }
    return [
      {
        id: '1',
        role: 'model',
        text: `Hello! I'm ${agentName}, your AI sales assistant. How can I help you accelerate your sales today?`,
        timestamp: new Date(),
      },
    ];
  });

  // Auto-Save Messages to LocalStorage
  useEffect(() => {
    localStorage.setItem('MAI_CHAT_MESSAGES', JSON.stringify(messages));
  }, [messages]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    if (!agentEnabled) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `⚠️ **${agentName} is currently offline.**\n\nPlease turn on the agent in the **Integrations** tab to resume automated responses.`,
          timestamp: new Date(),
        }]);
      }, 500);
      return;
    }

    setIsLoading(true);

    try {
      const savedCommands = localStorage.getItem('MAI_TRAINING_COMMANDS');
      const trainingCommands = savedCommands ? JSON.parse(savedCommands).map((c: any) => c.command) : [];
      
      const response = await getGeminiResponse([...messages, userMessage], agentName, trainingCommands);
      
      let botText = response.text || "";
      const functionCalls = response.functionCalls;

      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === 'createERPQutation') {
            const args = call.args as any;
            // Mock ERP API Call
            console.log("Calling ERP API with:", args);
            botText += `\n\n✅ **ERP Action Triggered**\nGenerated quotation for **${args.customerName}**.\nItems: ${args.parts.map((p: any) => `${p.quantity}x ${p.partNumber}`).join(', ')}\nStatus: Sent to WhatsApp.`;
          } else if (call.name === 'updateAgentMemory') {
            const args = call.args as any;
            const saved = localStorage.getItem('MAI_TRAINING_COMMANDS');
            const currentCommands = saved ? JSON.parse(saved) : [];
            const newCmd = {
              id: Date.now().toString(),
              command: args.instruction,
              description: args.reason || 'Added via Chat'
            };
            localStorage.setItem('MAI_TRAINING_COMMANDS', JSON.stringify([...currentCommands, newCmd]));
            botText += `\n\n✨ **Memory Updated**: I've learned a new rule: *"${args.instruction}"*. I'll apply this to future conversations.`;
          }
        }
      }

      if (!botText && !functionCalls) {
        botText = "I'm sorry, I couldn't process that request.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: botText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error connecting to my brain. Please check your API key configuration.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className={cn("w-5 h-5", agentEnabled ? "text-emerald-600" : "text-zinc-400")} />
          <h2 className="font-semibold text-zinc-700">{agentName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {agentEnabled && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", agentEnabled ? "bg-emerald-500" : "bg-zinc-400")}></span>
          </span>
          <span className="text-xs font-medium text-zinc-500">
            {agentEnabled ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex gap-3 max-w-[85%]",
              m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              m.role === 'user' ? "bg-zinc-900" : "bg-emerald-100"
            )}>
              {m.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              m.role === 'user' 
                ? "bg-zinc-900 text-white rounded-tr-none" 
                : "bg-zinc-100 text-zinc-800 rounded-tl-none"
            )}>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-zinc-100 text-zinc-500 text-sm rounded-tl-none italic">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={agentEnabled ? "Ask about leads, products, or sales tips..." : "Agent is currently offline..."}
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!agentEnabled}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !agentEnabled}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
