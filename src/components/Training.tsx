import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles,
  CheckCircle2,
  MessageSquareQuote,
  Send,
  Bot,
  User,
  Loader2,
  History
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { getGeminiResponse } from '../services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TrainingCommand {
  id: string;
  command: string;
  description: string;
}

interface TrainingProps {
  agentName: string;
  setAgentName: (name: string) => void;
}

export default function Training({ agentName, setAgentName }: TrainingProps) {
  const [commands, setCommands] = useState<TrainingCommand[]>(() => {
    const saved = localStorage.getItem('MAI_TRAINING_COMMANDS');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', command: "Always greet with 'Welcome to MAI Sales Agent!'", description: "Standard greeting for all new interactions." },
      { id: '2', command: "If customer asks for discount, offer 5% first.", description: "Standard negotiation tactic." },
      { id: '3', command: "Identify parts from WhatsApp requirements and create ERP quotes.", description: "Automated WhatsApp to ERP quotation workflow." },
      { id: '4', command: "Confirm quote generation to customer immediately.", description: "Ensures customer is informed of the backend action." },
    ];
  });

  // Auto-Save Commands to LocalStorage
  React.useEffect(() => {
    localStorage.setItem('MAI_TRAINING_COMMANDS', JSON.stringify(commands));
  }, [commands]);
  const [newCommand, setNewCommand] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [lastTrained, setLastTrained] = useState<Date | null>(new Date());
  
  // Sandbox Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: `Hello! I'm ${agentName}. I've updated my memory with your latest training instructions. How would you like to test my responses?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isChatLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsChatLoading(true);

    try {
      const response = await getGeminiResponse(
        [...messages, userMessage], 
        agentName,
        commands.map(c => c.command)
      );
      
      let botText = response.text || "";
      const functionCalls = response.functionCalls;

      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === 'updateAgentMemory') {
            const args = call.args as any;
            const newCmd = {
              id: Date.now().toString(),
              command: args.instruction,
              description: args.reason || 'Added via Training Sandbox'
            };
            setCommands(prev => [...prev, newCmd]);
            botText += `\n\n✨ **Memory Updated**: I've added your instruction to my training set: *"${args.instruction}"*`;
          }
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: botText || "I'm sorry, I couldn't process that request.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Error connecting to the agent. Please check your training set and API key.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const addCommand = () => {
    if (!newCommand.trim()) return;
    const cmd: TrainingCommand = {
      id: Date.now().toString(),
      command: newCommand,
      description: newDesc || 'No description provided.',
    };
    setCommands([...commands, cmd]);
    setNewCommand('');
    setNewDesc('');
  };

  const removeCommand = (id: string) => {
    setCommands(commands.filter(c => c.id !== id));
  };

  const handleTrain = async () => {
    setIsTraining(true);
    // Simulate training process
    await new Promise(resolve => setTimeout(resolve, 2500));
    setLastTrained(new Date());
    setIsTraining(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Agent Training Lab</h1>
          <p className="text-zinc-500">Define behavioral commands and knowledge for your AI sales agent.</p>
        </div>
        <button
          onClick={handleTrain}
          disabled={isTraining}
          className={cn(
            "px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20",
            isTraining 
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
          )}
        >
          {isTraining ? (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              Training Agent...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Run Training Sync
            </>
          )}
        </button>
      </div>

      {lastTrained && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <p className="text-sm text-emerald-800 font-medium">
            Agent successfully trained with {commands.length} active commands. 
            <span className="ml-2 font-normal opacity-70">Last sync: {lastTrained.toLocaleTimeString()}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Command Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Agent Identity
            </h3>
            <div className="space-y-1.5 mb-6">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Agent Name</label>
              <input
                type="text"
                placeholder="e.g. MAI Agent"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
              <p className="text-[10px] text-zinc-400 italic">This name is used by the AI during customer interactions.</p>
            </div>

            <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              New Command
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Instruction</label>
                <textarea
                  placeholder="e.g. Always mention the 24/7 support benefit..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none min-h-[100px] resize-none"
                  value={newCommand}
                  onChange={(e) => setNewCommand(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Context / Reason</label>
                <input
                  type="text"
                  placeholder="Why is this important?"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
              <button
                onClick={addCommand}
                disabled={!newCommand.trim()}
                className="w-full py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Add to Training Set
              </button>
            </div>
          </div>
        </div>

        {/* Commands List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">Active Training Set</h3>
              <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-lg">
                {commands.length} Commands
              </span>
            </div>
            <div className="divide-y divide-zinc-100">
              {commands.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <MessageSquareQuote className="w-12 h-12 text-zinc-200 mx-auto" />
                  <p className="text-zinc-500 text-sm">No training commands added yet.</p>
                </div>
              ) : (
                commands.map((cmd) => (
                  <div key={cmd.id} className="p-4 flex items-start justify-between group hover:bg-zinc-50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-zinc-900">"{cmd.command}"</p>
                      <p className="text-xs text-zinc-500">{cmd.description}</p>
                    </div>
                    <button
                      onClick={() => removeCommand(cmd.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Training Sandbox Chat */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-zinc-900">Training Sandbox</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Live Preview</span>
          </div>
          <button 
            onClick={() => setMessages([{
              id: Date.now().toString(),
              role: 'model',
              text: `Memory reset. I'm ${agentName}, ready for testing.`,
              timestamp: new Date(),
            }])}
            className="text-xs text-zinc-400 hover:text-zinc-600 flex items-center gap-1 transition-colors"
          >
            <History className="w-3 h-3" />
            Reset Session
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/30"
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
                  : "bg-white border border-zinc-100 text-zinc-800 rounded-tl-none shadow-sm"
              )}>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex gap-3 mr-auto">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-zinc-100 text-zinc-500 text-sm rounded-tl-none italic shadow-sm">
                Agent is thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-100 bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Test a customer query here..."
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <button
              type="submit"
              disabled={isChatLoading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[10px] text-zinc-400 mt-2 text-center">
            The agent uses your active training set to generate responses in this sandbox.
          </p>
        </div>
      </div>
    </div>
  );
}
