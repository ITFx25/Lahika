'use client';

import { useChat } from '@ai-sdk/react';

export default function LahikaChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-xl py-12 mx-auto stretch px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Lahika AI Agent</h1>

      <div className="space-y-4 mb-24">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-lg ${
              m.role === 'user' ? 'bg-blue-600 text-white ml-auto max-w-[80%]' : 'bg-gray-100 text-gray-900 mr-auto max-w-[80%]'
            }`}
          >
            <p className="text-xs font-semibold mb-1">{m.role === 'user' ? 'You' : 'Lahika'}</p>
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-xl pb-6 bg-white pr-8">
        <input
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-black"
          value={input}
          placeholder="Ask Lahika anything..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
