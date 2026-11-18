'use client';

import { useChat } from '@ai-sdk/react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Globe,
  Briefcase,
  BookOpen,
  Plus,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SUGGESTED_PROMPTS = [
  {
    icon: Globe,
    title: 'Hausa & English Translation',
    prompt: 'Translate "Artificial Intelligence is changing the future of business" into Hausa.',
  },
  {
    icon: Briefcase,
    title: 'Business Ideas',
    prompt: 'Give me 3 profitable digital business ideas I can start in Nigeria today.',
  },
  {
    icon: BookOpen,
    title: 'Learn Something New',
    prompt: 'Explain how cloud databases like Firebase Firestore work in simple terms.',
  },
];

interface ChatSession {
  id: string;
  title: string;
}

export default function LahikaFrontPage() {
  const [sessionId, setSessionId] = useState<string>(() => `session-${Date.now()}`);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
  } = useChat({
    body: { sessionId },
    onFinish: () => {
      fetchSessions();
    },
  });

  // Load list of saved sessions from Firestore
  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.sessions) setSessions(data.sessions);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start a fresh conversation
  const handleNewChat = () => {
    setSessionId(`session-${Date.now()}`);
    setMessages([]);
    setSidebarOpen(false);
  };

  // Load a past conversation from Firestore
  const handleSelectSession = async (id: string) => {
    setSessionId(id);
    setSidebarOpen(false);
    try {
      const res = await fetch(`/api/history?sessionId=${id}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar (Chat History) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <button
            onClick={handleNewChat}
            className="flex-1 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden ml-2 p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Recent Chats
          </p>
          {sessions.length === 0 ? (
            <p className="text-xs text-slate-500 px-2">No saved chats yet.</p>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSession(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                  sessionId === s.id
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0 text-emerald-500" />
                <span className="truncate">{s.title}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none text-slate-900">Lahika</h1>
                <span className="text-xs text-emerald-600 font-medium">AI Assistant • Online</span>
              </div>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
              English / Hausa
            </span>
          </div>
        </header>

        {/* Scrollable Chat Area */}
        <main className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-4xl mx-auto flex flex-col min-h-full">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 shadow-sm">
                  <Bot className="w-9 h-9" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
                  Sannu! I am <span className="text-emerald-600">Lahika</span>.
                </h2>
                <p className="text-slate-600 max-w-lg text-base sm:text-lg mb-10">
                  Your personal AI assistant for research, business, writing, and everyday tasks in English and Hausa.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
                  {SUGGESTED_PROMPTS.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => append({ role: 'user', content: item.prompt })}
                        className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-slate-900 mb-1">{item.title}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2">{item.prompt}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-8">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role !== 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl max-w-[82%] text-sm sm:text-base leading-relaxed shadow-sm ${
                        m.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>

                    {m.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 items-center text-slate-400 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 animate-pulse" />
                    </div>
                    <span>Lahika is thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
