import React from 'react';
import { useAppContext } from '../context/AppContext';

const MessageList = () => {
  const { messages } = useAppContext();

  // Helper to format time
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Helper to extract bullet points from AI response
  const getBullets = (text) => {
    if (!text) return [];
    return text
      .split('\n')
      .map(line => line.replace(/^[*•-]\s*/, '').trim())
      .filter(line => line.length > 0);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-40">
           <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
           </svg>
           <p className="text-sm font-medium">Ready when you are...</p>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {msg.sender === 'user' ? (
              <div className="flex flex-col gap-1.5">
                 <h2 className="text-white font-bold text-[15.5px] flex items-center gap-2.5 tracking-wide">
                   <span className="text-[17px] opacity-90 leading-none">💬</span>
                   Question: {msg.text}
                 </h2>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <h3 className="text-zinc-100 font-bold text-[15.5px] flex items-center gap-2.5 tracking-wide">
                  <span className="text-[17px] text-yellow-500 leading-none shadow-yellow-500/20 drop-shadow-md">⭐</span>
                  Answer:
                </h3>
                <ul className="space-y-4 pl-8 pr-4">
                  {getBullets(msg.text).map((bullet, bIdx) => (
                    <li key={bIdx} className="relative text-[14.5px] leading-relaxed text-zinc-300 font-medium tracking-wide">
                      <span className="absolute -left-5 top-2.5 w-[5px] h-[5px] bg-zinc-500 rounded-full"></span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 pl-8 mt-2">
                   <span className="text-[11px] font-medium text-zinc-600 opacity-60">
                      {formatTime(msg.createdAt || new Date())}
                   </span>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};


export default MessageList;
