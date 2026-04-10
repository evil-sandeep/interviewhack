import React from 'react';

const ChatMessage = ({ msg }) => {
  const isUser = msg.sender === 'user';
  
  // Format the MongoDB timestamp natively using standard JS
  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    // Graceful fallback if Date parse fails
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-lg whitespace-pre-wrap leading-relaxed ${
        isUser 
          ? 'bg-violet-600 text-white rounded-br-sm' 
          : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-bl-sm'
      }`}>
        {msg.text}
      </div>
      {/* Dynamic Tiny Footprint Timestamps */}
      {msg.timestamp && (
        <span className={`text-[10px] mt-1 opacity-40 px-1 font-medium select-none ${isUser ? 'text-violet-200' : 'text-slate-400'}`}>
          {formatTime(msg.timestamp)}
        </span>
      )}
    </div>
  );
};

export default ChatMessage;
