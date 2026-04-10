import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ChatContainer = () => {
  const { messages } = useAppContext();

  return (
    <div className="flex-1 overflow-y-auto w-full p-4 space-y-6 flex flex-col justify-end min-h-[60vh] scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent">
      {/* Empty State */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 ring-1 ring-white/5">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <p className="text-lg">How can I help you today?</p>
          <p className="text-sm opacity-60">Tap the mic and start speaking</p>
        </div>
      )}

      {/* Messages */}
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-lg ${
            msg.sender === 'user' 
              ? 'bg-violet-600 text-white rounded-br-sm' 
              : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-bl-sm'
          }`}>
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatContainer;
