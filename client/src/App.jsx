import React from 'react';

function App() {
  return (
    <div className="flex flex-col h-screen text-white bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden select-none">
      
      {/* Draggable Header */}
      <header 
        className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 cursor-default"
        style={{ WebkitAppRegion: 'drag' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <h1 className="text-xs font-bold tracking-widest uppercase opacity-70">Interview Assistant</h1>
        </div>
        
        {/* Buttons (Non-draggable) */}
        <div className="flex gap-2" style={{ WebkitAppRegion: 'no-drag' }}>
          <button className="p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="p-1 hover:bg-red-500/20 rounded-md transition-colors text-zinc-400 hover:text-red-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content Area (Empty for now) */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
        <div className="p-6 rounded-full bg-white/5 border border-white/5 mb-4">
           <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
           </svg>
        </div>
        <p className="text-sm font-medium text-zinc-400">Ready for Interview</p>
        <p className="text-[10px] uppercase tracking-tighter text-zinc-600 mt-1">Foundation Overlay Loaded</p>
      </main>

      {/* Footer Area with Placeholder Input */}
      <footer className="p-4 bg-white/5 border-t border-white/10">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Type payload override..." 
            className="w-full bg-black/20 border border-white/5 rounded-lg pl-4 pr-10 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button className="absolute right-2 top-1.5 p-1.5 text-zinc-500 hover:text-blue-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
