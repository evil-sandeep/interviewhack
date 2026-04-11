import React from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const Header = () => {
  const { isListening, startListening, stopListening } = useSpeechRecognition();

  const handleMicToggle = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <div 
      className="flex items-center justify-between px-3 py-2 bg-[#1e1f22]/90 border-b border-white/5 select-none"
    >

      {/* Brand Profile */}
      <div className="flex items-center gap-2 pr-4 border-r border-white/10 h-6">
        <div className="w-6 h-6 rounded-md bg-[#2dcc70] flex items-center justify-center shadow-lg">
           <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
           </svg>
        </div>
        <span className="font-bold text-[13px] text-white tracking-tight">ParakeetAI</span>
        <button 
          onClick={handleMicToggle}
          style={{ WebkitAppRegion: 'no-drag' }} 
          className={`ml-1 transition-colors ${isListening ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <svg className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>

      {/* Nav Tools */}
      <div className="flex items-center gap-1 mx-2" style={{ WebkitAppRegion: 'no-drag' }}>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-zinc-200 transition-all">
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Help
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12H3m18 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Analyze Screen
        </button>
        <button className="px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-all">
          Chat
        </button>
      </div>

      {/* Utility / Stats */}
      <div className="flex items-center gap-3 pl-4 border-l border-white/10 h-6">
        <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded shadow-inner border border-white/5">
           <div className={`w-2 h-2 bg-white rounded-sm ${isListening ? 'animate-pulse' : 'opacity-20'}`}></div>
           <span className="text-[11px] font-mono font-bold text-zinc-200">27:14</span>
        </div>
        
        <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' }}>
          <button className="text-zinc-500 hover:text-zinc-300 p-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
          </button>
          <button className="text-zinc-500 hover:text-zinc-300 p-1">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};


export default Header;
