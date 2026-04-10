import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import ChatMessage from './ChatMessage';

const ChatContainer = () => {
  const { messages, isTyping } = useAppContext();
  const endOfMessagesRef = useRef(null);

  // Auto-scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto w-full px-4 space-y-2 flex flex-col min-h-[60vh] scrollbar-thin scrollbar-thumb-violet-500/20 scrollbar-track-transparent pt-4">
      
      {/* Empty State */}
      {messages.length === 0 && !isTyping && (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 animate-pulse pt-20">
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
      <div className="flex-1 flex flex-col justify-end">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} msg={msg} />
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4 animate-in fade-in duration-300">
            <div className="bg-slate-800/80 border border-white/5 rounded-2xl rounded-bl-sm px-5 py-4 shadow-lg flex gap-1 items-center">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
        
        {/* Invisible element to snap to */}
        <div ref={endOfMessagesRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatContainer;
