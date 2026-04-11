import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { useAppContext } from '../../context/AppContext';
import ChatInput from './ChatInput';

const ChatContainer = () => {
  const { messages, clearChat } = useAppContext();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full flex-1 flex flex-col bg-slate-900/40 border border-white/5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      {/* Informational Header Ribbon acting as primary Drag Handle */}
      <div 
        className="bg-slate-800/60 px-4 py-2 border-b border-white/5 flex items-center justify-between"
        style={{ WebkitAppRegion: 'drag' }}
      >
        <p className="text-zinc-300 text-[10px] font-bold tracking-[0.2em] flex items-center gap-2 select-none uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Listening
        </p>
        <div className="flex gap-2">
          <button onClick={clearChat} style={{ WebkitAppRegion: 'no-drag' }} className="text-zinc-500 hover:text-red-400 p-1 transition-colors rounded bg-white/5 border border-white/5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto p-5 sm:p-6 scrollbar-thin scrollbar-thumb-[#35373c] scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600/70 font-mono text-xs uppercase tracking-widest">
             Terminal Awaiting Voice Input ...
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatMessage key={idx} msg={msg} />
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 pt-2 pb-4 bg-[#1e1f22] border-t border-[#35373c]/50">
         <ChatInput />
      </div>

    </div>
  );
};

export default ChatContainer;
