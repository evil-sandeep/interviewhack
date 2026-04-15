import React from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const Header = ({ isRecording, onToggle }) => {

  const handleMicToggle = () => {
    if (onToggle) onToggle();
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
          className={`ml-1 transition-colors ${isRecording ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <svg className={`w-3.5 h-3.5 ${isRecording ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
           <div className={`w-2 h-2 bg-white rounded-sm ${isRecording ? 'animate-pulse' : 'opacity-20'}`}></div>
           <span className="text-[11px] font-mono font-bold text-zinc-200">27:14</span>
        </div>
        
        {/* Apple-style Window Controls */}
        <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
          <button 
            onClick={() => window.electronAPI?.minimize()}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-all flex items-center justify-center group shadow-inner"
            title="Minimize"
          >
            <div className="w-1.5 h-[1.5px] bg-black/30 opacity-0 group-hover:opacity-100"></div>
          </button>
          <button 
            onClick={() => window.electronAPI?.maximize()}
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-all flex items-center justify-center group shadow-inner"
            title="Maximize"
          >
            <div className="w-1.5 h-1.5 border-[1.5px] border-black/30 opacity-0 group-hover:opacity-100"></div>
          </button>
          <button 
            onClick={() => window.electronAPI?.close()}
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-all flex items-center justify-center group shadow-inner"
            title="Close"
          >
            <svg className="w-2 h-2 text-black/40 opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};


export default Header;
