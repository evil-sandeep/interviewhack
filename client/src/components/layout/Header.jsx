import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isVoiceEnabled, setIsVoiceEnabled, clearChat, messages } = useAppContext();
  const { logout, user } = useAuth();

  return (
    <header className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* Glow effect icon */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-300 leading-tight">
            AI Voice Assistant
          </h1>
          {user && (
            <p className="text-[10px] text-fuchsia-400 font-mono tracking-widest uppercase opacity-80 mt-0.5">
              [{user.name}] Profile Active
            </p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 items-center">
        {/* Trash/Clear Memory Button */}
        <button 
          onClick={clearChat}
          disabled={messages.length === 0}
          title="Clear Chat History"
          className={`relative p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
            messages.length > 0
              ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20 ring-1 ring-red-500/30' 
              : 'text-slate-600 bg-slate-800 ring-1 ring-white/5 cursor-not-allowed opacity-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <button 
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          title={isVoiceEnabled ? "Mute Bot Responses" : "Unmute Bot Responses"}
          className={`relative p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
            isVoiceEnabled 
              ? 'text-violet-300 bg-violet-500/20 hover:bg-violet-500/30 ring-1 ring-violet-500/50' 
              : 'text-slate-500 bg-slate-800 hover:bg-slate-700 ring-1 ring-white/10'
          }`}
        >
          {isVoiceEnabled ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>

        <div className="w-px h-6 bg-white/10 mx-1"></div>

        <button 
          onClick={logout}
          title="Log Out Session"
          className="relative p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:ring-1 hover:ring-rose-500/30 transition-all duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

      </div>
    </header>
  );
};

export default Header;
