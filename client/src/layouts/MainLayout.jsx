import React from 'react';
import Header from '../components/layout/Header';
import ChatContainer from '../components/chat/ChatContainer';
import ChatInput from '../components/chat/ChatInput';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-violet-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-slate-950 pointer-events-none -z-10"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 overflow-hidden relative">
        <ChatContainer />
        <ChatInput />
      </main>
    </div>
  );
};

export default MainLayout;
