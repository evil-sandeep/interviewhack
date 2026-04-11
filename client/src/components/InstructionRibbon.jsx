import React from 'react';
import { useAppContext } from '../context/AppContext';

const InstructionRibbon = () => {
  const { clearChat, isTyping } = useAppContext();

  const handleClear = async () => {
    if (window.confirm('Clear all interview history?')) {
      await clearChat();
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-1.5 bg-black/50 border-b border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-3 overflow-hidden">
        {isTyping ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
            <p className="text-[11px] font-bold text-blue-400 tracking-wider">ParakeetAI IS THINKING...</p>
          </div>
        ) : (
          <p className="text-[11px] font-medium text-zinc-400 truncate tracking-wide">
            and ParakeetAI will provide an answer based on your resume and customize it for the position
          </p>
        )}
      </div>

      
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <button 
          onClick={handleClear}
          className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
        <button className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <button className="p-1 text-red-500/80 hover:text-red-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};


export default InstructionRibbon;
