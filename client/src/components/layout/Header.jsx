import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isVoiceEnabled, setIsVoiceEnabled, clearChat, messages, theme, toggleTheme, ttsSpeed, cycleSpeed } = useAppContext();
  const { logout, user } = useAuth();

  return (
    <header className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] cursor-pointer hover:scale-105 transition-transform" />
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-300 leading-tight">
              AI Voice Assistant
            </h1>
            {user && (
              <p className="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 font-mono tracking-widest uppercase opacity-80 mt-0.5">
                [{user.name}] Active
              </p>
            )}
          </div>
        </div>

        {/* Mobile-only tools stack */}
        <div className="sm:hidden flex gap-2">
           <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
             {theme === 'dark' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
           </button>
        </div>
      </div>
      
      <div className="flex gap-2 items-center mt-4 sm:mt-0 w-full sm:w-auto justify-end">
        
        {/* Desktop Theme Toggle */}
        <button 
          onClick={toggleTheme}
          title="Toggle Global Theme"
          className="hidden sm:flex relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 items-center justify-center"
        >
          {theme === 'dark' ? (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>

        {/* Speed Synthesizer Toggle */}
        <button 
          onClick={cycleSpeed}
          title="Playback Rate"
          className="relative p-2 rounded-full text-xs font-mono font-bold text-violet-600 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/20 transition-all duration-300 min-w-[2.5rem]"
        >
          {ttsSpeed}x
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1"></div>

        <button 
          onClick={clearChat}
          disabled={messages.length === 0}
          title="Clear Chat History"
          className={`relative p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
            messages.length > 0
              ? 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 ring-1 ring-red-500/20 dark:ring-red-500/30' 
              : 'text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 ring-1 ring-black/5 dark:ring-white/5 cursor-not-allowed opacity-50'
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
              ? 'text-violet-600 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/20 hover:bg-violet-200 dark:hover:bg-violet-500/30 ring-1 ring-violet-500/30 dark:ring-violet-500/50' 
              : 'text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 ring-1 ring-black/10 dark:ring-white/10'
          }`}
        >
          {isVoiceEnabled ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
             </svg>
          )}
        </button>

        <button 
          onClick={logout}
          title="Log Out Session"
          className="relative p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300 flex items-center justify-center ml-2"
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
