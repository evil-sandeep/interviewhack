import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const Header = () => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const int = setInterval(() => setTimer(p => p + 1), 1000);
    return () => clearInterval(int);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div 
      className="bg-[#1e1f22] border border-[#2e3035] rounded-full px-5 py-2.5 flex items-center gap-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4"
      style={{ WebkitAppRegion: 'drag' }} 
    >
      
      {/* Brand Profile */}
      <div className="flex items-center gap-2 pr-4 border-r border-[#2e3035]">
        <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
           <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
        </div>
        <span className="font-semibold text-zinc-100 tracking-wide text-[15px]">InterviewAI</span>
      </div>

      <button className="text-zinc-400 hover:text-white transition-colors" title="Mic Status" style={{ WebkitAppRegion: 'no-drag' }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
      </button>

      {/* Primary Action Mockups fully click-protected natively against OS dragging bindings */}
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200 transition-all pointer-events-none shadow-inner" style={{ WebkitAppRegion: 'no-drag' }}>
        <svg className="w-4 h-4 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
        <span className="text-sm font-medium">AI Help</span>
      </button>

      <button className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors pointer-events-none" style={{ WebkitAppRegion: 'no-drag' }}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        <span className="text-sm font-medium">Analyze Screen</span>
      </button>

      <button className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 transition-colors pointer-events-none" style={{ WebkitAppRegion: 'no-drag' }}>
        <span className="text-sm font-medium">Chat</span>
      </button>

      <div className="flex items-center gap-2 pl-4 border-l border-[#2e3035]">
        <div className="px-2 py-1 bg-[#2e3035] rounded shadow-sm text-sm font-mono text-zinc-200 flex items-center gap-2 tracking-wider">
           <div className="w-2.5 h-2.5 bg-white rounded-sm animate-pulse"></div>
           {formatTime(timer)}
        </div>
      </div>

    </div>
  );
};

export default Header;
