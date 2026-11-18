'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Sparkles, Bot, User, Globe, Briefcase, BookOpen } from 'lucide-react';
import { useEffect, useRef } from 'react';

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

export default function LahikaFrontPage() {
  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col">
        {messages.length === 0 ? (
          /* Hero Welcome Screen (Shown before first message) */
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

            {/* Quick-Start Prompt Cards */}
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
          /* Active Chat Messages */
          <div className="space-y-6 pb-28">
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
      </main>

      {/* Bottom Input Bar */}
      <footer className="sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-4 pb-6 px-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative flex items-center bg-white rounded-2xl border border-slate-300 shadow-lg focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all"
        >
          <input
            className="w-full py-4 pl-5 pr-14 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm sm:text-base"
            value={input}
            placeholder="Ask Lahika anything in English or Hausa..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2.5 p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}
