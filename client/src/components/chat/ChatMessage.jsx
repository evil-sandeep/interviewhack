import React, { useState } from 'react';

const ChatMessage = ({ msg }) => {
  const isUser = msg.sender === 'user';
  const [copied, setCopied] = useState(false);
  
  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Visual UX feedback reset
  };
  
  return (
    <div className={`flex flex-col group ${isUser ? 'items-end' : 'items-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`relative max-w-[85%] rounded-2xl px-5 py-3 shadow-lg whitespace-pre-wrap leading-relaxed transition-all ${
        isUser 
          ? 'bg-violet-600 text-white rounded-br-sm shadow-violet-500/20' 
          : 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 rounded-bl-sm'
      }`}>
        {msg.text}
        
        {/* Hover Action: Copy To Clipboard */}
        <button 
          onClick={copyToClipboard}
          className={`absolute ${isUser ? '-left-12' : '-right-12'} top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-slate-800 shadow shadow-black/10 transition-all opacity-0 group-hover:opacity-100 
            ${copied ? 'text-emerald-500 scale-110' : 'text-slate-400 hover:text-violet-500'}
          `}
          title={copied ? "Copied!" : "Copy message"}
        >
          {copied ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          )}
        </button>

      </div>
      
      {msg.timestamp && (
        <span className={`text-[10px] mt-1 opacity-60 dark:opacity-40 px-1 font-medium select-none ${isUser ? 'text-violet-600 dark:text-violet-200' : 'text-slate-500 dark:text-slate-400'}`}>
          {formatTime(msg.timestamp)}
        </span>
      )}
    </div>
  );
};

// Optimization: React Memo caches the bubble strictly unless its particular Prop object updates natively! Stops lagging.
export default React.memo(ChatMessage);
