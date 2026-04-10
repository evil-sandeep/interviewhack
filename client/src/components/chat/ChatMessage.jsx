import React from 'react';

const ChatMessage = ({ msg }) => {
  const isUser = msg.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-lg whitespace-pre-wrap leading-relaxed ${
        isUser 
          ? 'bg-violet-600 text-white rounded-br-sm' 
          : 'bg-slate-800/80 border border-white/5 text-slate-200 rounded-bl-sm'
      }`}>
        {msg.text}
      </div>
    </div>
  );
};

export default ChatMessage;
