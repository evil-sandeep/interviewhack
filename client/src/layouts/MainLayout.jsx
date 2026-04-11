import React from 'react';
import Header from '../components/layout/Header';
import ChatContainer from '../components/chat/ChatContainer';
import ChatInput from '../components/chat/ChatInput';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950/70 text-slate-100 font-sans flex flex-col selection:bg-violet-500/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="fixed inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-emerald-600/10 pointer-events-none -z-10"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col w-full mx-auto p-3 overflow-hidden relative">
        <ChatContainer />
      </main>
    </div>
  );
};


export default MainLayout;
